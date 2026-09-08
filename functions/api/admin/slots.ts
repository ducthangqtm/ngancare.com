// Cloudflare Pages Function: GET & POST /api/admin/slots
interface Env {
  DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const { request, env } = context;
    const url = new URL(request.url);
    const date = url.searchParams.get('date');

    if (!date) {
      return new Response(
        JSON.stringify({ success: false, error: 'Thiếu tham số ngày (date=YYYY-MM-DD).' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
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
        'SELECT * FROM busy_slots WHERE date = ?'
      )
        .bind(date)
        .all();

      // Get bookings for this date to display to admin
      const { results: bookingResults } = await env.DB.prepare(
        'SELECT id, customer_name, customer_phone, service_id, booking_time, status FROM bookings WHERE booking_date = ?'
      )
        .bind(date)
        .all();

      const manualBusySlots = (busyResults || []).map((r: any) => r.time_slot);
      const confirmedBookingSlots = (bookingResults || [])
        .filter((b: any) => b.status === 'confirmed')
        .map((b: any) => b.booking_time);
      const busySlots = Array.from(new Set([...manualBusySlots, ...confirmedBookingSlots]));

      return new Response(
        JSON.stringify({
          success: true,
          date,
          isAllDayBusy: busySlots.includes('ALL_DAY'),
          busySlots,
          bookings: bookingResults || [],
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
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
      { status: 200, headers: { 'Content-Type': 'application/json' } }
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
