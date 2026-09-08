// Cloudflare Pages Function: GET /api/slots?date=YYYY-MM-DD
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

  // If exact single slot
  if (ALL_SLOTS.includes(trimmed)) {
    return [trimmed];
  }

  // Check if it's a range like "09:30 - 11:00", "09:30 đến 11:00", "09:30-11:00"
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

  // If single time embedded e.g. "khoảng 9:30" or "9h30"
  if (times && times.length === 1) {
    const p = times[0].replace(/[hH]/, ':').split(':');
    const norm = `${p[0].padStart(2, '0')}:${(p[1] || '00').padStart(2, '0')}`;
    if (ALL_SLOTS.includes(norm)) return [norm];
  }

  // Fallback: any slot that appears in raw string
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
    const dateParam = url.searchParams.get('date');

    if (!dateParam) {
      return new Response(
        JSON.stringify({ success: false, error: 'Thiếu tham số ngày (date=YYYY-MM-DD).' }),
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }

    const date = dateParam.trim();

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

      // Get slots locked manually by admin for this date
      const { results: busyResults } = await env.DB.prepare(
        'SELECT time_slot FROM busy_slots WHERE TRIM(date) = ?'
      )
        .bind(date)
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

      // Get confirmed bookings for this date
      const { results: bookingResults } = await env.DB.prepare(
        "SELECT booking_time FROM bookings WHERE TRIM(booking_date) = ? AND status = 'confirmed'"
      )
        .bind(date)
        .all();

      const confirmedBookingSlots: string[] = [];
      for (const r of (bookingResults || [])) {
        if (r.booking_time) {
          confirmedBookingSlots.push(...expandBookingTimeToSlots(r.booking_time));
        }
      }

      const allBusySlots = Array.from(
        new Set([...manualBusySlots, ...confirmedBookingSlots])
      );

      return new Response(
        JSON.stringify({
          success: true,
          date,
          isAllDayBusy,
          busySlots: allBusySlots,
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
      }),
      { status: 200, headers: NO_CACHE_HEADERS }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
};
