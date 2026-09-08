// Cloudflare Pages Function: /api/admin/bookings (GET, PUT)
interface Env {
  DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const { env } = context;

    if (env && env.DB) {
      const { results } = await env.DB.prepare(`
        SELECT b.*, s.name as service_name 
        FROM bookings b 
        LEFT JOIN services s ON b.service_id = s.id 
        ORDER BY b.created_at DESC
      `).all();

      return new Response(
        JSON.stringify({ success: true, data: results }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, data: [] }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const onRequestPut: PagesFunction<Env> = async (context) => {
  try {
    const { request, env } = context;
    const body = (await request.json()) as any;
    const { id, status } = body;

    if (!id || !status) {
      return new Response(
        JSON.stringify({ success: false, error: 'Thiếu ID hoặc trạng thái cập nhật.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (env && env.DB) {
      await env.DB.prepare('UPDATE bookings SET status = ? WHERE id = ?')
        .bind(status, id)
        .run();
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Cập nhật trạng thái lịch hẹn thành công.' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
