// Cloudflare Pages Function: GET & POST /api/admin/homepage
interface Env {
  DB: D1Database;
}

const DEFAULT_HOMEPAGE_CONFIG = {
  // 1. Thông tin liên hệ chung
  contact_hotline: '0339627769',
  contact_hotline_display: '0339.627.769',
  contact_zalo: 'https://zalo.me/0339627769',
  contact_address: 'Toàn bộ khu vực nội thành Hà Nội & các huyện lân cận',
  contact_facebook: 'https://www.facebook.com/ngancare.mevabe',
  contact_working_hours: 'Phục vụ 24/7 (Cả Thứ 7, Chủ Nhật & Ngày Lễ)',

  // 2. Banner đầu trang (Hero Banner)
  hero_badge: '“Chăm sóc bằng kiến thức — Nuôi dưỡng bằng yêu thương”',
  hero_title: 'Đồng Hành Cùng Mẹ Chăm Sóc Sức Khỏe Mẹ Và Bé Từ Thai Kỳ Đến Sau Sinh',
  hero_title_highlight: 'Mẹ Và Bé',
  hero_subtitle: 'Được sáng lập và trực tiếp phụ trách bởi Điều Dưỡng Nguyễn Thúy Ngân. Chuyên viên chăm sóc sức khoẻ mẹ và bé được đào tạo và cấp chứng chỉ hành nghề chính quy.',
  hero_cta_booking: 'Đặt Lịch Chăm Sóc Ngay',
  hero_cta_hotline: 'Hotline: 0339.627.769',
  hero_banner_image: '/images/banner.jpg',

  // 3. Giới thiệu Điều Dưỡng Thúy Ngân
  founder_section_badge: 'Về Người Sáng Lập Ngân Care',
  founder_title: 'Gặp Gỡ Chuyên Viên Điều Dưỡng',
  founder_name: 'Nguyễn Thúy Ngân',
  founder_experience: 'Hơn 9 năm kinh nghiệm',
  founder_experience_badge: '9+',
  founder_bio: 'Hơn 9 năm tận tụy đồng hành cùng hàng nghìn mẹ bỉm sữa Thủ đô bằng sự thấu cảm của một người mẹ và tác phong chuyên nghiệp, tận tâm.',
  founder_quote: 'Mỗi em bé chào đời là một thiên thần vô giá. Người mẹ sau cuộc vượt cạn thiêng liêng xứng đáng được nâng niu, chăm sóc bằng tất cả tình yêu thương và sự chu đáo, tận tâm nhất.',
  founder_image: '/images/avata.jpg',

  // 4. Cam kết & Quy trình
  process_badge: 'Tận Tâm & Chuyên Nghiệp',
  process_title: 'Quy Trình Chăm Sóc 4 Bước',
  process_subtitle: '4 Bước Vàng — Mẹ An Tâm',
  process_step1_title: 'Đánh giá và nhận định',
  process_step1_desc: 'Điều dưỡng viên nắm bắt thể trạng và nhu cầu của mẹ và bé. Lắng nghe và kiểm tra tình trạng thực tế cần hỗ trợ chăm sóc.',
  process_step2_title: 'Chuẩn bị dụng cụ chăm sóc',
  process_step2_desc: 'Chuẩn bị các dụng cụ chăm sóc thường quy và chuyên biệt theo gói dịch vụ. Đảm bảo toàn bộ dụng cụ được vệ sinh và tiệt trùng sạch sẽ, an toàn.',
  process_step3_title: 'Thao tác chuyên môn',
  process_step3_desc: 'Thực hiện các thao tác chuyên môn nhẹ nhàng theo gói dịch vụ. Chăm sóc chu đáo các vấn đề mẹ và bé đang gặp phải (thông tia, tắm bé, thư giãn).',
  process_step4_title: 'Đánh giá kết quả & giải thích thắc mắc',
  process_step4_desc: 'Đánh giá hiệu quả sau buổi chăm sóc. Tổng hợp những điểm gia đình cần lưu ý khi chăm sóc mẹ và bé, hướng dẫn mẹ cách tự chăm sóc và theo dõi thể trạng bé tại nhà.',

  commit_badge: 'Uy Tín & Tận Tâm',
  commit_title: 'Cam Kết Vàng Từ Điều Dưỡng Thúy Ngân',
  commit_subtitle: 'Đặt sự an toàn của mẹ và bé lên trên hết — Sự an tâm của gia đình là tôn chỉ hoạt động cao nhất.',
  commit_item1_title: 'Đào tạo bài bản, chính quy chuyên ngành Điều dưỡng',
  commit_item1_desc: 'Đảm bảo kiến thức chăm sóc khoa học, an toàn, được cập nhật thường xuyên; không suy diễn hay truyền miệng thiếu cơ sở.',
  commit_item2_title: 'Sản phẩm sử dụng rõ nguồn gốc xuất xứ',
  commit_item2_desc: 'Mỗi sản phẩm sử dụng trong quá trình chăm sóc đều có rõ nguồn gốc xuất xứ và được công khai với khách hàng. Cam kết không sử dụng sản phẩm không rõ chất lượng.',
  commit_item3_title: 'Không tự ý phát sinh thêm chi phí, phụ phí ngoài lề',
  commit_item3_desc: 'Giá dịch vụ được công bố rõ ràng từ đầu, không tự ý thu bất kỳ phụ phí hay chi phí ngoài lề nào trong quá trình chăm sóc. Các mẹ biết rõ mình sẽ chi bao nhiêu, không lo bị động khi thanh toán.',
};

export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const { env } = context;

    let config = { ...DEFAULT_HOMEPAGE_CONFIG };

    if (env && env.DB) {
      await env.DB.prepare(`
        CREATE TABLE IF NOT EXISTS system_settings (
          key TEXT PRIMARY KEY,
          value TEXT
        )
      `).run();

      const row: any = await env.DB.prepare(
        "SELECT value FROM system_settings WHERE key = 'homepage_config'"
      ).first();

      if (row && row.value) {
        try {
          const parsed = JSON.parse(row.value);
          config = { ...config, ...parsed };
        } catch (e) {
          console.error('Error parsing homepage_config JSON:', e);
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: config,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
        },
      }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        success: false,
        error: err.message,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const { request, env } = context;
    const incomingData = await request.json() as any;

    if (!incomingData || typeof incomingData !== 'object') {
      return new Response(
        JSON.stringify({ success: false, error: 'Dữ liệu không hợp lệ.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    let existingConfig = { ...DEFAULT_HOMEPAGE_CONFIG };

    if (env && env.DB) {
      await env.DB.prepare(`
        CREATE TABLE IF NOT EXISTS system_settings (
          key TEXT PRIMARY KEY,
          value TEXT
        )
      `).run();

      const row: any = await env.DB.prepare(
        "SELECT value FROM system_settings WHERE key = 'homepage_config'"
      ).first();

      if (row && row.value) {
        try {
          existingConfig = { ...existingConfig, ...JSON.parse(row.value) };
        } catch (e) {}
      }

      const mergedConfig = { ...existingConfig, ...incomingData };
      const jsonStr = JSON.stringify(mergedConfig);

      await env.DB.prepare(`
        INSERT OR REPLACE INTO system_settings (key, value)
        VALUES ('homepage_config', ?)
      `).bind(jsonStr).run();

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Lưu cài đặt trang chủ thành công!',
          data: mergedConfig,
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Local fallback
    const mergedConfig = { ...existingConfig, ...incomingData };
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Lưu cài đặt trang chủ thành công (chế độ cục bộ)!',
        data: mergedConfig,
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
        error: err.message || 'Lỗi xử lý lưu cài đặt.',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};

