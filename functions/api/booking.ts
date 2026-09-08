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

      // Send Telegram notification to group if configured
      try {
        let serviceName = 'Dịch vụ tư vấn chung';
        if (service_id) {
          const srvRow: any = await env.DB.prepare(
            'SELECT name FROM services WHERE id = ?'
          )
            .bind(service_id)
            .first();
          if (srvRow && srvRow.name) serviceName = srvRow.name;
        }

        let teleToken = '8700850904:AAGQUd380KftNANpmU3mbx7wNmHvH5oe4I4';
        let teleChatId = '-5427119274';

        const tokenRow: any = await env.DB.prepare(
          "SELECT value FROM system_settings WHERE key = 'telegram_bot_token'"
        ).first();
        if (tokenRow && tokenRow.value) teleToken = tokenRow.value;

        const chatRow: any = await env.DB.prepare(
          "SELECT value FROM system_settings WHERE key = 'telegram_chat_id'"
        ).first();
        if (chatRow && chatRow.value) teleChatId = chatRow.value;

        if (teleChatId) {
          const nowStr = new Intl.DateTimeFormat('vi-VN', {
            timeZone: 'Asia/Ho_Chi_Minh',
            hour: '2-digit',
            minute: '2-digit',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          }).format(new Date());

          const teleMsg =
            `🚨 *CÓ LỊCH ĐẶT MỚI TỪ NGANCARE.COM!*\n\n` +
            `👤 *Khách hàng:* ${customer_name}\n` +
            `📞 *Số điện thoại:* [${customer_phone}](tel:${customer_phone})\n` +
            `🏠 *Địa chỉ:* ${customer_address}\n` +
            `💆 *Gói dịch vụ:* ${serviceName}\n` +
            `📅 *Ngày hẹn:* ${booking_date}\n` +
            `⏰ *Khung giờ:* ${booking_time}\n` +
            (notes ? `📝 *Ghi chú:* ${notes}\n` : '') +
            `\n⏱️ *Thời gian đặt:* ${nowStr}\n` +
            `👉 [Xem danh sách lịch hẹn trong Admin](https://ngancare.com/admin/bookings)`;

          await fetch(`https://api.telegram.org/bot${teleToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: teleChatId,
              text: teleMsg,
              parse_mode: 'Markdown',
            }),
          });
        }
      } catch (teleErr) {
        console.error('Failed to dispatch Telegram notification:', teleErr);
      }
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
