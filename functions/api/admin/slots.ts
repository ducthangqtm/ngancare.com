// Cloudflare Pages Function: GET & POST /api/admin/slots
interface Env {
  DB: D1Database;
}

const ALL_SLOTS = [
  '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00', '19:30', '20:00'
];

function expandBookingTimeToSlots(rawTime: string): string[] {
  if (!rawTime) return [];
  const trimmed = rawTime.trim();
  if (ALL_SLOTS.includes(trimmed)) return [trimmed];

  const times = trimmed.match(/\b\d{1,2}[:hH]\d{2}\b/g);
  if (times && times.length >= 2) {
    const norm = (t: string) => {
      const p = t.replace(/[hH]/, ':').split(':');
      return `${p[0].padStart(2, '0')}:${(p[1] || '00').padStart(2, '0')}`;
    };
    const start = norm(times[0]);
    const end = norm(times[1]);
    const inRange = ALL_SLOTS.filter((s) => s >= start && s <= end);
    if (inRange.length > 0) return inRange;
  }

  if (times && times.length === 1) {
    const p = times[0].replace(/[hH]/, ':').split(':');
    const norm = `${p[0].padStart(2, '0')}:${(p[1] || '00').padStart(2, '0')}`;
    if (ALL_SLOTS.includes(norm)) return [norm];
  }

  const matched = ALL_SLOTS.filter((s) => trimmed.includes(s));
  if (matched.length > 0) return matched;

  return [trimmed];
}

const NO_CACHE_HEADERS = {
  'Content-Type': 'application/json',
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
  'Pragma': 'no-cache',
  'Expires': '0',
};

export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const { request, env } = context;
    const url = new URL(request.url);
    const date = url.searchParams.get('date');

    if (!date) {
      return new Response(
        JSON.stringify({ success: false, error: 'Thiếu tham số ngày (date=YYYY-MM-DD).' }),
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }

    if (env && env.DB) {
      // Ensure busy_slots table exists
      try {
        await env.DB.prepare(`
          CREATE TABLE IF NOT EXISTS busy_slots (
            id TEXT PRIMARY KEY,
            date TEXT NOT NULL,
            time_slot TEXT NOT NULL,
            note TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(date, time_slot)
          )
        `).run();
      } catch (e) {}

      // Get slots locked by admin
      const { results: busyResults } = await env.DB.prepare(
        'SELECT * FROM busy_slots WHERE TRIM(date) = ?'
      )
        .bind(date.trim())
        .all();

      // Get bookings for this date to display to admin
      const { results: bookingResults } = await env.DB.prepare(
        'SELECT id, customer_name, customer_phone, service_id, booking_time, status FROM bookings WHERE TRIM(booking_date) = ?'
      )
        .bind(date.trim())
        .all();

      const manualBusySlots: string[] = [];
      let isAllDayBusy = false;
      for (const r of (busyResults || [])) {
        if (r.time_slot === 'ALL_DAY') {
          isAllDayBusy = true;
        } else {
          manualBusySlots.push(...expandBookingTimeToSlots(r.time_slot));
        }
      }

      const confirmedBookingSlots: string[] = [];
      for (const b of (bookingResults || [])) {
        if (b.status === 'confirmed' && b.booking_time) {
          confirmedBookingSlots.push(...expandBookingTimeToSlots(b.booking_time));
        }
      }

      const busySlots = Array.from(new Set([...manualBusySlots, ...confirmedBookingSlots]));

      return new Response(
        JSON.stringify({
          success: true,
          date,
          isAllDayBusy,
          busySlots,
          bookings: bookingResults || [],
        }),
        { status: 200, headers: NO_CACHE_HEADERS }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        date,
        isAllDayBusy: false,
        busySlots: [],
        bookings: [],
      }),
      { status: 200, headers: NO_CACHE_HEADERS }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const { request, env } = context;
    const body = (await request.json()) as any;
    const { action, date, time_slot, start_time, end_time, slots } = body;

    if (!date) {
      return new Response(
        JSON.stringify({ success: false, error: 'Thiếu ngày làm việc.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!env || !env.DB) {
      return new Response(
        JSON.stringify({ success: true, message: 'D1 chưa kết nối (dev mode).' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Ensure busy_slots table exists
    await env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS busy_slots (
        id TEXT PRIMARY KEY,
        date TEXT NOT NULL,
        time_slot TEXT NOT NULL,
        note TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(date, time_slot)
      )
    `).run();

    if (action === 'toggle') {
      if (!time_slot) {
        return new Response(
          JSON.stringify({ success: false, error: 'Thiếu mốc giờ.' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Check if exists
      const existing: any = await env.DB.prepare(
        'SELECT id FROM busy_slots WHERE date = ? AND time_slot = ?'
      )
        .bind(date, time_slot)
        .first();

      if (existing) {
        // Unlock
        await env.DB.prepare('DELETE FROM busy_slots WHERE id = ?').bind(existing.id).run();
        return new Response(
          JSON.stringify({ success: true, status: 'unlocked', time_slot }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      } else {
        // Lock
        const newId = 'bs-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
        await env.DB.prepare(
          'INSERT INTO busy_slots (id, date, time_slot) VALUES (?, ?, ?)'
        )
          .bind(newId, date, time_slot)
          .run();
        return new Response(
          JSON.stringify({ success: true, status: 'locked', time_slot }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    if (action === 'toggle_all_day') {
      const existingAllDay: any = await env.DB.prepare(
        "SELECT id FROM busy_slots WHERE date = ? AND time_slot = 'ALL_DAY'"
      )
        .bind(date)
        .first();

      if (existingAllDay) {
        await env.DB.prepare("DELETE FROM busy_slots WHERE date = ? AND time_slot = 'ALL_DAY'")
          .bind(date)
          .run();
        return new Response(
          JSON.stringify({ success: true, isAllDayBusy: false }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      } else {
        const newId = 'bs-all-' + Date.now();
        await env.DB.prepare(
          "INSERT INTO busy_slots (id, date, time_slot, note) VALUES (?, ?, 'ALL_DAY', 'Nghỉ cả ngày')"
        )
          .bind(newId, date)
          .run();
        return new Response(
          JSON.stringify({ success: true, isAllDayBusy: true }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    if (action === 'lock_batch') {
      if (Array.isArray(slots) && slots.length > 0) {
        for (const slot of slots) {
          const newId = 'bs-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
          await env.DB.prepare(
            'INSERT OR IGNORE INTO busy_slots (id, date, time_slot) VALUES (?, ?, ?)'
          )
            .bind(newId, date, slot)
            .run();
        }
      }
      return new Response(
        JSON.stringify({ success: true, message: 'Đã khóa các khung giờ thành công!' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'unlock_all') {
      await env.DB.prepare('DELETE FROM busy_slots WHERE date = ?').bind(date).run();
      return new Response(
        JSON.stringify({ success: true, message: 'Đã mở lại toàn bộ giờ trong ngày!' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: false, error: 'Hành động không hợp lệ.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
