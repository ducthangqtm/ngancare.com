// Cloudflare Pages Function: GET /api/services
interface Env {
  DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const { request, env } = context;
    const url = new URL(request.url);
    const category = url.searchParams.get('category');

    if (env && env.DB) {
      // Tự động đồng bộ giá và nội dung mới nhất theo ngansua.docx vào D1
      try {
        await env.DB.batch([
          env.DB.prepare(`
            UPDATE services 
            SET name = 'Thông Tắc Tia Sữa & Kích Sữa bằng pp Dẫn lưu hệ bạch huyết',
                price = 450000,
                duration = 100,
                description = 'Massage giải cơ, dẫn lưu hệ bạch huyết vùng ngực. Chăm sóc kết hợp giữa thao tác tay và máy chuyên dụng.',
                features = '["x Không tổn thương nang sữa","x Không dùng lực thô bạo","x Không đắp lá đắp thuốc","+ Giải cơ lưu thông khí huyết","+ Dẫn lưu dịch bạch huyết giảm ứ trệ","+ Lấy cặn, thông sữa thuận tự nhiên"]',
                is_active = 1
            WHERE id = 'srv-01' AND (price != 450000 OR duration != 100);
          `),
          env.DB.prepare(`
            UPDATE services 
            SET name = 'Tắm và chăm sóc trẻ sơ sinh',
                price = 180000,
                duration = 45,
                description = 'Tắm bé theo quy trình y khoa, Massage vận động phát triển cơ xương theo đúng tháng tuổi, chăm sóc và xử trí các vấn đề sinh lý/ bệnh lý sơ sinh.',
                features = '["+ 100% Điều dưỡng chính quy trực tiếp tắm bé","+ Dụng cụ vệ sinh vô khuẩn","+ Theo dõi và xử trí các vấn đề sinh lý/ bệnh lý sơ sinh trong suốt quá trình tắm"]',
                is_active = 1
            WHERE id = 'srv-02' AND price != 180000;
          `),
          env.DB.prepare(`
            UPDATE services 
            SET name = 'Chăm sóc sau sinh',
                price = 500000,
                duration = 90,
                is_active = 1
            WHERE id = 'srv-03' AND (price != 500000 OR name != 'Chăm sóc sau sinh');
          `),
          env.DB.prepare(`
            UPDATE services 
            SET is_active = 0
            WHERE id = 'srv-04' AND is_active != 0;
          `),
        ]);
      } catch (migrateErr) {
        // Bỏ qua nếu đã migrate
      }

      let query = "SELECT * FROM services WHERE is_active = 1 AND category != 'san_pham'";
      const params: any[] = [];

      if (category && category !== 'all') {
        query += ' AND category = ?';
        params.push(category);
      }

      query += ' ORDER BY created_at ASC';

      const stmt = env.DB.prepare(query);
      const { results } = params.length > 0 ? await stmt.bind(...params).all() : await stmt.all();

      const mapped = results.map((r: any) => ({
        ...r,
        features: typeof r.features === 'string' ? JSON.parse(r.features || '[]') : r.features || [],
      }));

      return new Response(JSON.stringify({ success: true, data: mapped }), {
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      });
    }

    return new Response(JSON.stringify({ success: true, data: [] }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
