import { Service, BlogPost, Booking } from './types';

export const INITIAL_SERVICES: Service[] = [
  {
    id: 'srv-01',
    name: 'Thông Tắc Tia Sữa & Kích Sữa Tự Nhiên Không Đau',
    slug: 'thong-tac-tia-sua-khong-dau',
    category: 'thong_tac',
    price: 350000,
    duration: 75,
    description:
      'Phương pháp massage xoang nang sữa chuẩn y khoa kết hợp máy sóng siêu âm đa tần hiện đại và thảo dược lành tính. Tuyệt đối không nặn bóp thô bạo, giải tỏa cương đau, viêm tắc tức thì, kích hoạt phản xạ xuống sữa mạnh mẽ.',
    features: [
      'Không đau đớn, không bóp nặn làm dập nát nang sữa',
      'Công nghệ sóng siêu âm đa tần đánh tan cục tắc sâu',
      'Chườm đắp thảo dược làm dịu cơn sốt cương vú',
      'Hướng dẫn mẹ tư thế bế và chỉnh khớp ngậm đúng tại nhà',
    ],
    image_url: '/images/banner.jpg',
    is_active: 1,
  },
  {
    id: 'srv-02',
    name: 'Tắm Bé Sơ Sinh & Massage Vận Động Sớm Chuẩn Y Khoa',
    slug: 'tam-be-so-sinh-chuan-y-khoa',
    category: 'tam_be',
    price: 150000,
    duration: 45,
    description:
      'Quy trình tắm và vệ sinh cuống rốn vô khuẩn 100% do Điều dưỡng chuyên khoa trực tiếp thực hiện. Kết hợp massage toàn thân kích thích tuần hoàn, tiêu hóa, phòng chống vàng da và hơ lá trầu không giữ ấm tỳ vị cho bé.',
    features: [
      'Điều dưỡng Y tế trực tiếp thực hiện chuyên nghiệp',
      'Vệ sinh rốn chuẩn vô khuẩn phòng viêm nhiễm',
      'Massage kích thích nhu động ruột, giảm đầy hơi nôn trớ',
      'Hơ lá trầu không giữ ấm thóp, ngực, bụng, lưng',
    ],
    image_url: '/images/banner.jpg',
    is_active: 1,
  },
  {
    id: 'srv-03',
    name: 'Chăm Sóc & Phục Hồi Toàn Diện Mẹ Sau Sinh',
    slug: 'cham-soc-phuc-hoi-me-sau-sinh',
    category: 'sau_sinh',
    price: 450000,
    duration: 90,
    description:
      'Liệu trình phục hồi chuyên sâu kết hợp thảo dược cổ truyền và kỹ thuật y khoa. Giúp giảm đau mỏi lưng hông, đẩy sạch sản dịch, co hồi tử cung, xông hơi vùng kín thải độc và quấn bụng thảo mộc định hình vòng eo.',
    features: [
      'Xông hơi toàn thân và vùng kín bằng lá thảo dược Dao Đỏ',
      'Massage bấm huyệt lưu thông khí huyết, giảm ứ trệ',
      'Quấn muối thảo dược và đai nịt bụng định hình eo thon',
      'Dưỡng da sáng mịn, mờ thâm rạn với cốt nghệ gừng hạ thổ',
    ],
    image_url: '/images/banner.jpg',
    is_active: 1,
  },
  {
    id: 'srv-04',
    name: 'Massage Mẹ Bầu Thư Giãn & Giảm Đau Nhức Thai Kỳ',
    slug: 'massage-me-bau-thu-gian',
    category: 'me_bau',
    price: 350000,
    duration: 75,
    description:
      'Dành cho mẹ từ tuần thai thứ 16 trở đi. Giúp giải tỏa áp lực đè nặng lên cột sống, giảm chuột rút và phù nề bàn chân, xua tan lo âu, cải thiện giấc ngủ ngon cho mẹ và thai nhi phát triển khỏe mạnh.',
    features: [
      'Dầu massage hữu cơ chiết xuất tự nhiên 100% an toàn cho thai nhi',
      'Kỹ thuật vuốt miết chuẩn y học cổ truyền, không ấn huyệt nguy hiểm',
      'Giảm phù nề chân, tê bì tay và đau khớp háng',
      'Tư vấn tư thế nằm nghỉ ngơi và chế độ vận động thai kỳ',
    ],
    image_url: '/images/banner.jpg',
    is_active: 1,
  },
  {
    id: 'sp-01',
    name: 'Cao Chè Vằng Sẻ Quảng Trị Nguyên Chất',
    slug: 'cao-che-vang-se-nguyen-chat',
    category: 'san_pham',
    price: 180000,
    duration: null,
    description:
      'Nấu từ 100% lá chè vằng sẻ tươi vùng đất cát Quảng Trị, giúp kích thích tuyến sữa dồi dào, sữa đặc thơm và hỗ trợ co bóp tử cung tống sạch sản dịch sau sinh.',
    features: [
      '100% nguyên chất, không pha tạp, không chất bảo quản',
      'Kích sữa về nhanh, sánh đặc dồi dào dinh dưỡng',
      'Hỗ trợ tiêu mỡ thừa vùng bụng, thanh nhiệt giải độc',
    ],
    image_url: '/images/banner.jpg',
    affiliate_url: 'https://shopee.vn',
    is_active: 1,
  },
  {
    id: 'sp-02',
    name: 'Cốt Gừng Nghệ Hạt Gấc Hạ Thổ 3 Tháng 10 Ngày',
    slug: 'cot-gung-nghe-hat-gac-ha-tho',
    category: 'san_pham',
    price: 250000,
    duration: null,
    description:
      'Bài thuốc cổ truyền làm ấm cơ thể mẹ sau sinh, phòng chống gió máy hậu sản, dưỡng sáng da, mờ vết thâm rạn vùng bụng đùi và giúp săn chắc vòng eo.',
    features: [
      'Gừng ta, nghệ nếp quê và hạt gấc hạ thổ đủ 100 ngày',
      'Giữ ấm cơ thể, phòng cảm lạnh và nhức mỏi xương khớp',
      'Mờ thâm rạn, tái tạo da sáng hồng tự nhiên',
    ],
    image_url: '/images/banner.jpg',
    affiliate_url: 'https://shopee.vn',
    is_active: 1,
  },
  {
    id: 'sp-03',
    name: 'Tinh Dầu Tràm Gió Huế Nguyên Chất',
    slug: 'tinh-dau-tram-hue-nguyen-chat',
    category: 'san_pham',
    price: 160000,
    duration: null,
    description:
      'Chưng cất thủ công từ lá tràm gió thiên nhiên Thừa Thiên Huế, hương thơm ấm dịu, không gây cay nóng, dùng an toàn tuyệt đối cho trẻ sơ sinh và sản phụ.',
    features: [
      'Chiết xuất 100% lá tràm gió tự nhiên xứ Huế',
      'Giữ ấm ngực, lưng, bàn chân phòng cảm ho sổ mũi',
      'Làm dịu nhanh vết muỗi đốt và côn trùng cắn',
    ],
    image_url: '/images/banner.jpg',
    affiliate_url: 'https://shopee.vn',
    is_active: 1,
  },
  {
    id: 'sp-04',
    name: 'Lá Xông Tắm Thảo Dược Mẹ Sau Sinh Dao Đỏ',
    slug: 'la-xong-tam-thao-duoc-dao-do',
    category: 'san_pham',
    price: 220000,
    duration: null,
    description:
      'Bài thuốc lá xông tắm cổ truyền của đồng bào Dao Đỏ, gồm hơn 10 vị thảo mộc rừng giúp mẹ bỉm hồi phục thể lực thần tốc, sạch sản dịch và sảng khoái tinh thần.',
    features: [
      'Hơn 10 loại thảo mộc rừng Tây Bắc phơi sấy sạch',
      'Giúp lưu thông khí huyết, bài trừ độc tố qua tuyến mồ hôi',
      'Giảm đau nhức mỏi cơ khớp sau cuộc chuyển dạ',
    ],
    image_url: '/images/banner.jpg',
    affiliate_url: 'https://shopee.vn',
    is_active: 1,
  },
];

export const INITIAL_POSTS: BlogPost[] = [
  {
    id: 'post-01',
    title: 'Tắc Tia Sữa Uống Gì, Làm Gì? Phác Đồ Xử Trí Chuẩn Y Khoa Tại Nhà Không Đau',
    slug: 'tac-tia-sua-uong-gi-lam-gi-phac-do-chuan-y-khoa',
    excerpt:
      'Tắc tia sữa là nỗi ám ảnh lớn của mẹ bỉm sau sinh. Hướng dẫn chi tiết từ Điều dưỡng Thúy Ngân về nguyên nhân, dấu hiệu nhận biết sớm và cách thông tắc an toàn tuyệt đối không gây tổn thương nang sữa.',
    cover_image: '/images/banner.jpg',
    category: 'Thông Tắc Tia Sữa',
    author: 'Điều Dưỡng Nguyễn Thúy Ngân',
    views: 1420,
    is_published: 1,
    meta_title: 'Tắc Tia Sữa: Cách Xử Trí Không Đau Chuẩn Y Khoa | Ngân Care',
    meta_description:
      'Hướng dẫn chi tiết từ Điều dưỡng Thúy Ngân về cách nhận biết và thông tắc tia sữa tại nhà an toàn, giải tỏa cương đau ngay tức thì.',
    created_at: '2026-02-15T08:00:00Z',
    content: `
      <h2>1. Dấu hiệu nhận biết sớm tình trạng tắc tia sữa</h2>
      <p>Tắc tia sữa thường xuất hiện đột ngột vào giai đoạn 1 tuần đến 1 tháng sau sinh khi nguồn sữa bắt đầu về nhiều nhưng chưa được lưu thông nhịp nhàng. Mẹ cần nhận biết sớm qua các dấu hiệu:</p>
      <ul>
        <li>Bầu ngực căng cứng bất thường, sờ thấy một hoặc nhiều khối u cục nổi cộm rõ rệt.</li>
        <li>Cảm giác đau tức tăng dần, bầu ngực có thể hơi ửng đỏ và nóng ran khi chạm vào.</li>
        <li>Lượng sữa vắt ra giảm hẳn, bé bú lâu nhưng không no và quấy khóc.</li>
        <li>Trường hợp nặng: mẹ có thể bị sốt nhẹ 37.5°C - 38.5°C kèm cảm giác gai rét ớn lạnh.</li>
      </ul>

      <h2>2. Nguyên nhân cốt lõi dẫn đến tắc tia sữa</h2>
      <p>Có 3 nguyên nhân phổ biến nhất mà Điều dưỡng Thúy Ngân thường gặp khi đến thăm khám tại nhà cho các mẹ:</p>
      <ol>
        <li><strong>Khớp ngậm của bé chưa đúng:</strong> Bé chỉ ngậm núm vú mà không ngậm sâu vào quầng thâm vú, khiến sữa không được rút cạn ở các xoang sữa đáy.</li>
        <li><strong>Căng thẳng, mất ngủ và thiếu nước:</strong> Tuyến sữa được kích hoạt bởi hormone Oxytocin. Khi mẹ lo âu, stress hay thiếu ngủ, phản xạ xuống sữa bị ức chế nghiêm trọng.</li>
        <li><strong>Áp lực chèn ép ngoại cảnh:</strong> Mặc áo ngực quá chật hoặc nằm nghiêng đè lên bầu ngực suốt đêm.</li>
      </ol>

      <h2>3. Phác đồ xử trí 4 bước chuẩn y khoa tại nhà</h2>
      <p>Tuyệt đối <strong>KHÔNG</strong> dùng kim chọc, không bóp nặn thô bạo gây dập nang sữa dẫn đến viêm mủ áp xe. Hãy tuân thủ 4 bước:</p>
      <ul>
        <li><strong>Bước 1 - Chườm ấm vừa phải:</strong> Dùng khăn nhúng nước ấm khoảng 45°C chườm lên vùng ngực 5-7 phút để làm giãn nở các ống dẫn sữa.</li>
        <li><strong>Bước 2 - Massage nhẹ nhàng theo hình xoắn ốc:</strong> Sử dụng các đầu ngón tay vuốt nhẹ từ thành ngực hướng dần về phía đầu ti.</li>
        <li><strong>Bước 3 - Cho bé bú bên ngực bị tắc trước:</strong> Lực hút sinh học tự nhiên của em bé là vũ khí thông tia mạnh mẽ và an toàn nhất.</li>
        <li><strong>Bước 4 - Vắt kiệt sữa thừa:</strong> Dùng máy hút sữa ở chế độ nhẹ nhàng để làm rỗng hoàn toàn bầu ngực sau cữ bú.</li>
      </ul>

      <h2>4. Khi nào mẹ cần liên hệ chuyên viên y tế cấp cứu ngay?</h2>
      <p>Nếu mẹ đã tự massage quá 24 giờ mà cục tắc không tan, sốt cao trên 38.5°C, ngực sưng đỏ tấy lan rộng thì cần liên hệ ngay chuyên viên thông tắc tia sữa chuẩn y khoa để được can thiệp kịp thời bằng máy sóng siêu âm và kỹ thuật vô khuẩn, tránh biến chứng viêm mủ áp xe vú phải phẫu thuật rạch dẫn lưu.</p>
    `,
  },
  {
    id: 'post-02',
    title: 'Hướng Dẫn Tắm Bé Sơ Sinh Chưa Rụng Rốn Tại Nhà An Toàn 100% Chuẩn Bệnh Viện',
    slug: 'huong-dan-tam-be-so-sinh-chua-rung-ron-an-toan',
    excerpt:
      'Quy trình tắm bé sơ sinh chi tiết từng bước, kỹ thuật bế và vệ sinh cuốn rốn vô khuẩn giúp bé ngủ sâu giấc, phòng tránh viêm rốn và vàng da sơ sinh.',
    cover_image: '/images/banner.jpg',
    category: 'Tắm Bé Sơ Sinh',
    author: 'Điều Dưỡng Nguyễn Thúy Ngân',
    views: 980,
    is_published: 1,
    meta_title: 'Hướng Dẫn Tắm Bé Sơ Sinh Chưa Rụng Rốn An Toàn Tại Nhà | Ngân Care',
    meta_description:
      'Quy trình chuẩn y khoa hướng dẫn tắm bé sơ sinh và vệ sinh cuống rốn an toàn, tránh viêm nhiễm từ Điều Dưỡng Thúy Ngân.',
    created_at: '2026-02-18T10:30:00Z',
    content: `
      <h2>1. Chuẩn bị phòng tắm và dụng cụ vô khuẩn</h2>
      <p>Nhiệt độ phòng tắm lý tưởng cho trẻ sơ sinh là từ 26 - 28°C, kín gió, có thể bật đèn sưởi nếu thời tiết mùa đông. Nước tắm cần duy trì ở nhiệt độ 37 - 38°C (kiểm tra bằng nhiệt kế hoặc cùi chỏ tay).</p>

      <h2>2. Kỹ thuật bế và làm sạch mắt mũi tai trước khi tắm</h2>
      <p>Dùng gạc y tế vô khuẩn nhúng nước muối sinh lý 0.9% lau sạch khóe mắt bé từ trong ra ngoài. Tiếp theo dùng tăm bông thấm nhẹ làm sạch vành tai ngoài.</p>

      <h2>3. Thao tác tắm thân mình và bảo vệ rốn</h2>
      <p>Nhẹ nhàng hạ thân mình bé vào chậu nước, giữ vững phần cổ và đầu bé trên cánh tay mẹ/điều dưỡng. Rửa sạch các nếp gấp cổ, nách, bẹn - nơi đọng mồ hôi và chất gây.</p>

      <h2>4. Chăm sóc cuống rốn đúng cách sau khi tắm</h2>
      <p>Thấm khô cuống rốn bằng gạc vô trùng. Quan sát chân rốn xem có mùi hôi, rỉ dịch vàng hay ửng đỏ không. Để rốn hở thoáng khí, không băng kín để rốn nhanh khô và tự rụng tự nhiên.</p>
    `,
  },
  {
    id: 'post-03',
    title: 'Cẩm Nang Phục Hồi Cơ Thể Toàn Diện Cho Mẹ Sau Sinh: Giảm Đau Mỏi & Về Dáng Nhanh',
    slug: 'cam-nang-phuc-hoi-co-the-cho-me-sau-sinh',
    excerpt:
      'Sau kỳ vượt cạn, cơ thể mẹ chịu nhiều tổn thương và biến đổi lớn. Hãy cùng tìm hiểu phương pháp xông hơi thảo dược, chăm sóc sàn chậu và dinh dưỡng để mẹ nhanh hồi phục sức khỏe.',
    cover_image: '/images/banner.jpg',
    category: 'Chăm Sóc Sau Sinh',
    author: 'Điều Dưỡng Nguyễn Thúy Ngân',
    views: 750,
    is_published: 1,
    meta_title: 'Cẩm Nang Phục Hồi Sau Sinh Cho Mẹ Bỉm Toàn Diện | Ngân Care',
    meta_description:
      'Bí quyết phục hồi sức khỏe, giảm đau lưng hông và lấy lại vóc dáng sau sinh an toàn từ chuyên gia Điều Dưỡng Thúy Ngân.',
    created_at: '2026-02-22T14:15:00Z',
    content: `
      <h2>1. Giai đoạn vàng hồi phục sức khỏe sau sinh</h2>
      <p>30 ngày đầu sau sinh là thời điểm quý báu để cơ thể phục hồi tổn thương cơ học, co hồi tử cung và đào thải sản dịch. Chăm sóc đúng cách sẽ giúp mẹ tránh được các chứng hậu sản như đau lưng mãn tính, lạnh dạ dày hay sa sàn chậu.</p>

      <h2>2. Liệu pháp xông hơi thảo dược toàn thân và vùng kín</h2>
      <p>Nước xông từ các loại lá thảo mộc thiên nhiên (lá tre, sả, gừng, bưởi, ngải cứu, trắc bách diệp...) giúp làm giãn nở lỗ chân lông, đào thải độc tố, giảm ứ huyết và hỗ trợ co hồi vùng kín nhanh chóng.</p>

      <h2>3. Massage phục hồi cơ xương khớp và quấn ấm thảo mộc</h2>
      <p>Các động tác xoa bóp nhẹ nhàng dọc hai dải cơ lưng và hông kết hợp tinh dầu ấm giúp giảm căng cứng cơ bắp sau quá trình rặn đẻ hoặc mang vác thai nhi 9 tháng 10 ngày.</p>
    `,
  },
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'bk-101',
    customer_name: 'Chị Mai Lan',
    customer_phone: '0982345678',
    customer_address: 'Số 18 Ngõ 68 Cầu Giấy, P. Quan Hoa, Cầu Giấy, Hà Nội',
    service_id: 'srv-01',
    service_name: 'Thông Tắc Tia Sữa & Kích Sữa Tự Nhiên Không Đau',
    booking_date: '2026-03-09',
    booking_time: '14:30',
    notes: 'Ngực phải căng cứng, sốt nhẹ 38 độ, cần hỗ trợ sớm nhất có thể.',
    status: 'pending',
    created_at: '2026-03-08T09:15:00Z',
  },
  {
    id: 'bk-102',
    customer_name: 'Chị Thu Trang',
    customer_phone: '0915678901',
    customer_address: 'Toà S2.05 KĐT Vinhomes Smart City, Tây Mỗ, Nam Từ Liêm, Hà Nội',
    service_id: 'srv-02',
    service_name: 'Tắm Bé Sơ Sinh & Massage Vận Động Sớm Chuẩn Y Khoa',
    booking_date: '2026-03-09',
    booking_time: '09:00',
    notes: 'Bé sinh được 5 ngày chưa rụng rốn, đặt gói 10 buổi tắm và hơ lá trầu.',
    status: 'confirmed',
    created_at: '2026-03-08T08:30:00Z',
  },
  {
    id: 'bk-103',
    customer_name: 'Chị Phương Thảo',
    customer_phone: '0978123456',
    customer_address: 'Tầng 12 Chung cư Imperia Garden, 203 Nguyễn Huy Tưởng, Thanh Xuân',
    service_id: 'srv-03',
    service_name: 'Chăm Sóc & Phục Hồi Toàn Diện Mẹ Sau Sinh',
    booking_date: '2026-03-10',
    booking_time: '15:00',
    notes: 'Mẹ sinh mổ ngày thứ 10, đau mỏi lưng nhiều, cần xông hơi và massage nhẹ nhàng.',
    status: 'confirmed',
    created_at: '2026-03-07T16:20:00Z',
  },
];
