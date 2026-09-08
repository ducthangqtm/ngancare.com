// Cloudflare Pages Function: POST /api/booking
interface Env {
  DB: D1Database;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const { request, env } = context;
    const body = (await request.json()) as any;

    const {
      customer_name,
      customer_phone,
      customer_address,
      service_id,
      booking_date,
      booking_time,
      notes,
    } = body;

    // Validate required fields
    if (!customer_name || !customer_phone || !customer_address || !booking_date || !booking_time) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Vui lòng điền đầy đủ các thông tin bắt buộc: Họ tên, Số điện thoại, Địa chỉ, Ngày và Giờ hẹn.',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const id = 'bk-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);

    // If Cloudflare D1 is bound
    if (env && env.DB) {
      await env.DB.prepare(`
        INSERT INTO bookings (id, customer_name, customer_phone, customer_address, service_id, booking_date, booking_time, notes, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', CURRENT_TIMESTAMP)
      `)
        .bind(
          id,
          customer_name,
          customer_phone,
          customer_address,
          service_id || null,
          booking_date,
          booking_time,
          notes || ''
        )
        .run();
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Đặt lịch thành công! Điều dưỡng Thúy Ngân sẽ liên hệ xác nhận trong ít phút.',
        data: {
          id,
          customer_name,
          customer_phone,
          customer_address,
          service_id,
          booking_date,
          booking_time,
          status: 'pending',
        },
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Lỗi xử lý đặt lịch: ' + (err.message || 'Hệ thống bận, vui lòng gọi trực tiếp hotline.'),
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
