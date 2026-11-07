// Cloudflare Pages Function: GET /api/homepage
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

  // 5. Header & Footer
  header_announcement: 'Dịch vụ chăm sóc mẹ và bé tại nhà — ĐD. Nguyễn Thúy Ngân tận tâm đồng hành!',
  footer_description: 'Dịch vụ chăm sóc mẹ và bé tại nhà uy tín hàng đầu Hà Nội. Trực tiếp thực hiện bởi Điều dưỡng chuyên khoa với phương châm: “Chăm sóc bằng kiến thức — Nuôi dưỡng bằng yêu thương”.',
  footer_copyright: 'Bản quyền thuộc về Điều Dưỡng Nguyễn Thúy Ngân.',
  footer_disclaimer: 'Bảo chứng chuyên môn: ĐD. Nguyễn Thúy Ngân',
  footer_address: 'Trụ sở: Thượng Thanh, Q. Long Biên, Hà Nội',
  footer_badge_trust: 'An Toàn & Tận Tâm',

  // 6. 4 Trụ Cột Niềm Tin (Dưới Hero Banner)
  pillar1_title: 'Chuyên Môn Đào Tạo Chính Quy',
  pillar1_desc: 'Tốt nghiệp Cao Đẳng Y Tế Hà Nội, kinh nghiệm và tận tâm',
  pillar2_title: 'Chăm Sóc Nhẹ Nhàng, Tận Tâm',
  pillar2_desc: 'Thương bé như con, thấu hiểu mọi âu lo của mẹ bỉm',
  pillar3_title: 'Tích hợp dẫn lưu hệ bạch huyết trong quy trình chăm sóc',
  pillar3_desc: 'Chăm sóc bầu ngực và tuyến sữa bằng kỹ thuật dẫn lưu hệ bạch huyết — phương pháp nhẹ nhàng giúp thông tắc và giải tỏa căng tức vú',
  pillar4_title: 'Đồng hành trọn đời',
  pillar4_desc: 'Hỗ trợ giải đáp thắc mắc chăm sóc mẹ và bé trọn đời',

  // 7. Tiêu Đề Section Dịch Vụ & Sản Phẩm
  services_badge: 'Dịch Vụ Trọng Tâm',
  services_title: 'Dịch Vụ Chăm Sóc Mẹ Và Bé Tại Nhà',
  services_title_highlight: 'Mẹ Và Bé Tại Nhà',
  services_subtitle: 'Bảng giá niêm yết công khai, minh bạch rõ ràng — Cam kết không phát sinh bất kỳ phụ phí nào.',

  products_badge: 'Thảo Mộc Cung Đình & Tự Nhiên',
  products_title: 'Sản Phẩm Thiên Nhiên Lành Tính Cho Mẹ & Bé',
  products_title_highlight: 'Lành Tính Cho Mẹ & Bé',
  products_subtitle: 'Nguồn gốc xuất xứ rõ ràng, chưng cất thủ công truyền thống, không phụ gia và hóa chất bảo quản.',
};

export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const { env } = context;

    let config = { ...DEFAULT_HOMEPAGE_CONFIG };

    if (env && env.DB) {
      // Đảm bảo bảng system_settings tồn tại
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
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        success: true,
        data: DEFAULT_HOMEPAGE_CONFIG,
        warning: err.message,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
};
