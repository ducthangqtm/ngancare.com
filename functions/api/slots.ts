// Cloudflare Pages Function: GET /api/slots?date=YYYY-MM-DD
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

      // Get slots locked by admin for this date
      const { results: busyResults } = await env.DB.prepare(
        'SELECT time_slot FROM busy_slots WHERE date = ?'
      )
        .bind(date)
        .all();

      const busySlots = (busyResults || []).map((r: any) => r.time_slot);
      const isAllDayBusy = busySlots.includes('ALL_DAY');

      // Also get confirmed bookings for this date
      const { results: bookingResults } = await env.DB.prepare(
        "SELECT booking_time FROM bookings WHERE booking_date = ? AND status = 'confirmed'"
      )
        .bind(date)
        .all();

      const confirmedBookingSlots = (bookingResults || []).map((r: any) => r.booking_time);

      return new Response(
        JSON.stringify({
          success: true,
          date,
          isAllDayBusy,
          busySlots: Array.from(new Set([...busySlots, ...confirmedBookingSlots])),
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
