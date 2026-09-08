-- =========================================================
-- DATABASE SCHEMA: NGÂN CARE (ngancare.com)
-- Nền tảng: Cloudflare D1 (Serverless SQLite)
-- =========================================================

-- 1. Bảng Dịch Vụ Y Tế Chăm Sóc Mẹ & Bé
CREATE TABLE IF NOT EXISTS services (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL, -- 'thong_tac', 'tam_be', 'sau_sinh', 'me_bau'
    price REAL,
    duration INTEGER, -- Thời lượng tính bằng phút
    description TEXT,
    features TEXT, -- Chuỗi JSON mô tả danh sách lợi ích
    image_url TEXT,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Bảng Sản Phẩm Thiên Nhiên & Tiếp Thị Liên Kết (Affiliate)
CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    price REAL,
    description TEXT,
    features TEXT, -- Chuỗi JSON mô tả điểm nổi bật
    image_url TEXT,
    affiliate_url TEXT, -- Link Shopee, TikTok Shop, Lazada
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. Bảng Đặt Lịch Hẹn Chăm Sóc Tại Nhà
CREATE TABLE IF NOT EXISTS bookings (
    id TEXT PRIMARY KEY,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_address TEXT NOT NULL,
    service_id TEXT,
    booking_date TEXT NOT NULL,
    booking_time TEXT NOT NULL,
    notes TEXT,
    status TEXT DEFAULT 'pending', -- 'pending', 'confirmed', 'completed', 'cancelled'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (service_id) REFERENCES services(id)
);

-- 4. Bảng Bài Viết Blog Y Khoa (Chuẩn SEO YMYL)
CREATE TABLE IF NOT EXISTS posts (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL, -- Nội dung HTML / Markdown bài viết y khoa
    cover_image TEXT,
    category TEXT DEFAULT 'KienThucMeBe',
    author TEXT DEFAULT 'Điều Dưỡng Nguyễn Thúy Ngân',
    views INTEGER DEFAULT 0,
    is_published INTEGER DEFAULT 1,
    meta_title TEXT,
    meta_description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 5. Bảng Quản Trị Viên (Admin)
CREATE TABLE IF NOT EXISTS admins (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'admin',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 6. Bảng Cài Đặt Hệ Thống & Cờ Khởi Tạo
CREATE TABLE IF NOT EXISTS system_settings (
    key TEXT PRIMARY KEY,
    value TEXT
);

-- =========================================================
-- SEED DATA (DỮ LIỆU KHỞI TẠO MẪU)
-- =========================================================

-- Dữ liệu Dịch vụ y tế cốt lõi
INSERT OR IGNORE INTO services (id, name, slug, category, price, duration, description, features, image_url, is_active)
VALUES
('srv-01', 'Thông Tắc Tia Sữa & Giải Tỏa Cương Căng Tức Thì', 'thong-tac-tia-sua-khong-dau', 'thong_tac', 350000, 75,
 'Phương pháp massage thông xoang nang sữa chuẩn y khoa, kết hợp chườm ấm thảo dược và máy massage sóng siêu âm đa tần. Tuyệt đối không nặn bóp thô bạo, giải tỏa tức thì cảm giác đau tức, tắc tia, sữa về ào ạt ngay sau 1 liệu trình.',
 '["Không đau đớn, không làm dập nát nang sữa","Máy sóng siêu âm đa tần làm tan cục tắc sâu","Giải tỏa sốt cương sữa, viêm tuyến vú kịp thời","Chỉnh khớp ngậm bú mẹ đúng cách tận nhà"]',
 '/images/banner.jpg', 1),

('srv-02', 'Tắm Bé Sơ Sinh & Massage Vận Động Sớm Chuẩn Y Khoa', 'tam-be-so-sinh-chuan-y-khoa', 'tam_be', 150000, 45,
 'Quy trình tắm và vệ sinh rốn an toàn 100% bằng găng tay và dụng cụ tiệt trùng vô khuẩn. Kết hợp massage thư giãn cơ bắp, vận động phản xạ sớm và hơ lá trầu không giữ ấm tỳ vị cho bé yêu ngon giấc.',
 '["Điều dưỡng y tế chuyên khoa trực tiếp chăm sóc","Vệ sinh rốn chuẩn vô khuẩn phòng nhiễm trùng","Massage kích thích tuần hoàn và tiêu hóa chống đầy hơi","Hơ lá trầu không giữ ấm thóp, ngực, bụng"]',
 '/images/banner.jpg', 1),

('srv-03', 'Chăm Sóc & Phục Hồi Mẹ Sau Sinh Toàn Diện', 'cham-soc-phuc-hoi-me-sau-sinh', 'sau_sinh', 450000, 90,
 'Gói phục hồi chuyên sâu kết hợp tinh hoa thảo dược cổ truyền và kỹ thuật y khoa hiện đại. Giúp mẹ giảm đau mỏi lưng hông, co hồi tử cung nhanh chóng, đào thải sản dịch và lấy lại vóc dáng thon gọn.',
 '["Xông hơi toàn thân và vùng kín bằng lá thảo dược Dao Đỏ","Massage bấm huyệt lưu thông khí huyết toàn thân","Quấn bụng định hình thảo mộc giảm mỡ vòng eo","Tẩy tế bào chết sáng da bằng cốt cám gạo nghệ"]',
 '/images/banner.jpg', 1),

('srv-04', 'Massage Mẹ Bầu Thư Giãn Giảm Đau Nhức Thai Kỳ', 'massage-me-bau-thu-gian', 'me_bau', 350000, 75,
 'Liệu trình massage êm dịu chuyên biệt cho mẹ từ tuần thứ 16 trở đi. Giúp giải tỏa áp lực cột sống, giảm phù nề chân tay, cải thiện chứng mất ngủ và kết nối gắn kết yêu thương giữa mẹ và bé.',
 '["Sử dụng dầu massage hữu cơ thiên nhiên 100% an toàn","Kỹ thuật vuốt miết nhẹ nhàng chuẩn y học cổ truyền","Giảm chuột rút, phù nề bàn chân và đau khớp háng","Tư vấn tư thế nằm nghỉ ngơi tốt nhất cho thai nhi"]',
 '/images/banner.jpg', 1);

-- Dữ liệu Sản phẩm thiên nhiên & Affiliate
INSERT OR IGNORE INTO products (id, name, slug, price, description, features, image_url, affiliate_url, is_active)
VALUES
('sp-01', 'Cao Chè Vằng Sẻ Quảng Trị Nguyên Chất', 'cao-che-vang-se-nguyen-chat', 180000,
 'Chiết xuất 100% từ lá chè vằng sẻ tự nhiên Quảng Trị, giúp kích thích tuyến sữa hoạt động mạnh mẽ, sữa đặc sánh thơm ngon và hỗ trợ co bóp tử cung tống sạch sản dịch sau sinh.',
 '["100% nguyên chất, không chất bảo quản","Kích sữa về nhanh, sánh đặc dồi dào","Hỗ trợ giảm cân, tiêu mỡ bụng tự nhiên"]',
 '/images/banner.jpg', 'https://shopee.vn', 1),

('sp-02', 'Cốt Gừng Nghệ Hạt Gấc Hạ Thổ 3 Tháng 10 Ngày', 'cot-gung-nghe-hat-gac-ha-tho', 250000,
 'Bài thuốc cổ truyền làm ấm cơ thể, phòng chống gió máy hậu sản, dưỡng sáng mờ thâm rạn da bụng, đùi và hỗ trợ săn chắc vòng eo sau sinh.',
 '["Gừng ta và nghệ nếp nguyên chất hạ thổ sâu","Giữ ấm cơ thể, tránh cảm lạnh sau sinh","Mờ thâm rạn, tái tạo làn da săn chắc mịn màng"]',
 '/images/banner.jpg', 'https://shopee.vn', 1),

('sp-03', 'Tinh Dầu Tràm Gió Huế Nguyên Chất', 'tinh-dau-tram-hue-nguyen-chat', 160000,
 'Tinh dầu tràm tự nhiên xứ Huế cô đặc, hương thơm dịu nhẹ an toàn tuyệt đối cho trẻ sơ sinh. Giúp giữ ấm, phòng cảm lạnh, xua muỗi và chống côn trùng cắn.',
 '["Chiết xuất lá tràm tự nhiên 100%","Giữ ấm phổi, ngực, bụng và lòng bàn chân cho bé","Làm dịu nhanh vết muỗi và côn trùng đốt"]',
 '/images/banner.jpg', 'https://shopee.vn', 1),

('sp-04', 'Lá Xông Tắm Thảo Dược Mẹ Sau Sinh Dao Đỏ', 'la-xong-tam-thao-duoc-dao-do', 220000,
 'Bài thuốc lá xông tắm cổ truyền của đồng bào Dao Đỏ hơn 10 vị thảo mộc rừng giúp mẹ hồi phục thể lực, lưu thông khí huyết và sạch sản dịch.',
 '["Thảo mộc rừng Tây Bắc sấy sạch","Lưu thông khí huyết giảm đau mỏi","Đào thải độc tố qua tuyến mồ hôi"]',
 '/images/banner.jpg', 'https://shopee.vn', 1);

-- Dữ liệu Bài viết Y khoa mẫu
INSERT OR IGNORE INTO posts (id, title, slug, excerpt, content, cover_image, category, author, views, is_published, meta_title, meta_description)
VALUES
('post-01', 
 'Tắc Tia Sữa Uống Gì, Làm Gì? Phác Đồ Xử Trí Chuẩn Y Khoa Tại Nhà Không Đau',
 'tac-tia-sua-uong-gi-lam-gi-phac-do-chuan-y-khoa',
 'Tắc tia sữa là nỗi ám ảnh lớn của mẹ bỉm sau sinh. Hướng dẫn chi tiết từ Điều dưỡng Thúy Ngân về nguyên nhân, dấu hiệu nhận biết sớm và cách thông tắc an toàn tuyệt đối không gây tổn thương nang sữa.',
 '<h2>1. Dấu hiệu nhận biết sớm tình trạng tắc tia sữa</h2><p>Tắc tia sữa thường xuất hiện đột ngột vào giai đoạn 1 tuần đến 1 tháng sau sinh khi nguồn sữa bắt đầu về nhiều nhưng chưa được lưu thông nhịp nhàng. Mẹ cần nhận biết sớm qua các dấu hiệu:</p><ul><li>Bầu ngực căng cứng bất thường, sờ thấy một hoặc nhiều khối u cục nổi cộm rõ rệt.</li><li>Cảm giác đau tức tăng dần, bầu ngực có thể hơi ửng đỏ và nóng ran khi chạm vào.</li><li>Lượng sữa vắt ra giảm hẳn, bé bú lâu nhưng không no và quấy khóc.</li><li>Trường hợp nặng: mẹ có thể bị sốt nhẹ 37.5°C - 38.5°C kèm cảm giác gai rét ớn lạnh.</li></ul><h2>2. Nguyên nhân cốt lõi dẫn đến tắc tia sữa</h2><p>Có 3 nguyên nhân phổ biến nhất mà Điều dưỡng Thúy Ngân thường gặp khi đến thăm khám tại nhà cho các mẹ:</p><ol><li><strong>Khớp ngậm của bé chưa đúng:</strong> Bé chỉ ngậm núm vú mà không ngậm sâu vào quầng thâm vú, khiến sữa không được rút cạn ở các xoang sữa đáy.</li><li><strong>Căng thẳng, mất ngủ và thiếu nước:</strong> Tuyến sữa được kích hoạt bởi hormone Oxytocin. Khi mẹ lo âu, stress hay thiếu ngủ, phản xạ xuống sữa bị ức chế nghiêm trọng.</li><li><strong>Áp lực chèn ép ngoại cảnh:</strong> Mặc áo ngực quá chật hoặc nằm nghiêng đè lên bầu ngực suốt đêm.</li></ol><h2>3. Phác đồ xử trí 4 bước chuẩn y khoa tại nhà</h2><p>Tuyệt đối <strong>KHÔNG</strong> dùng kim chọc, không bóp nặn thô bạo gây dập nang sữa dẫn đến viêm mủ áp xe. Hãy tuân thủ 4 bước:</p><ul><li><strong>Bước 1 - Chườm ấm vừa phải:</strong> Dùng khăn nhúng nước ấm khoảng 45°C chườm lên vùng ngực 5-7 phút để làm giãn nở các ống dẫn sữa.</li><li><strong>Bước 2 - Massage nhẹ nhàng theo hình xoắn ốc:</strong> Sử dụng các đầu ngón tay vuốt nhẹ từ thành ngực hướng dần về phía đầu ti.</li><li><strong>Bước 3 - Cho bé bú bên ngực bị tắc trước:</strong> Lực hút sinh học tự nhiên của em bé là vũ khí thông tia mạnh mẽ và an toàn nhất.</li><li><strong>Bước 4 - Vắt kiệt sữa thừa:</strong> Dùng máy hút sữa ở chế độ nhẹ nhàng để làm rỗng hoàn toàn bầu ngực sau cữ bú.</li></ul><h2>4. Khi nào mẹ cần liên hệ chuyên viên y tế cấp cứu ngay?</h2><p>Nếu mẹ đã tự massage quá 24 giờ mà cục tắc không tan, sốt cao trên 38.5°C, ngực sưng đỏ tấy lan rộng thì cần liên hệ ngay chuyên viên thông tắc tia sữa chuẩn y khoa để được can thiệp kịp thời bằng máy sóng siêu âm và kỹ thuật vô khuẩn, tránh biến chứng viêm mủ áp xe vú phải phẫu thuật rạch dẫn lưu.</p>',
 '/images/banner.jpg',
 'Thông Tắc Tia Sữa',
 'Điều Dưỡng Nguyễn Thúy Ngân',
 1420,
 1,
 'Tắc Tia Sữa: Cách Xử Trí Không Đau Chuẩn Y Khoa | Ngân Care',
 'Hướng dẫn chi tiết từ Điều dưỡng Thúy Ngân về cách nhận biết và thông tắc tia sữa tại nhà an toàn, giải tỏa cương đau ngay tức thì.'
),

('post-02', 
 'Hướng Dẫn Tắm Bé Sơ Sinh Chưa Rụng Rốn Tại Nhà An Toàn 100% Chuẩn Bệnh Viện',
 'huong-dan-tam-be-so-sinh-chua-rung-ron-an-toan',
 'Quy trình tắm bé sơ sinh chi tiết từng bước, kỹ thuật bế và vệ sinh cuốn rốn vô khuẩn giúp bé ngủ sâu giấc, phòng tránh viêm rốn và vàng da sơ sinh.',
 '<h2>1. Chuẩn bị phòng tắm và dụng cụ vô khuẩn</h2><p>Nhiệt độ phòng tắm lý tưởng cho trẻ sơ sinh là từ 26 - 28°C, kín gió, có thể bật đèn sưởi nếu thời tiết mùa đông. Nước tắm cần duy trì ở nhiệt độ 37 - 38°C (kiểm tra bằng nhiệt kế hoặc cùi chỏ tay).</p><h2>2. Kỹ thuật bế và làm sạch mắt mũi tai trước khi tắm</h2><p>Dùng gạc y tế vô khuẩn nhúng nước muối sinh lý 0.9% lau sạch khóe mắt bé từ trong ra ngoài. Tiếp theo dùng tăm bông thấm nhẹ làm sạch vành tai ngoài.</p><h2>3. Thao tác tắm thân mình và bảo vệ rốn</h2><p>Nhẹ nhàng hạ thân mình bé vào chậu nước, giữ vững phần cổ và đầu bé trên cánh tay mẹ/điều dưỡng. Rửa sạch các nếp gấp cổ, nách, bẹn - nơi đọng mồ hôi và chất gây.</p><h2>4. Chăm sóc cuống rốn đúng cách sau khi tắm</h2><p>Thấm khô cuống rốn bằng gạc vô trùng. Quan sát chân rốn xem có mùi hôi, rỉ dịch vàng hay ửng đỏ không. Để rốn hở thoáng khí, không băng kín để rốn nhanh khô và tự rụng tự nhiên.</p>',
 '/images/banner.jpg',
 'Tắm Bé Sơ Sinh',
 'Điều Dưỡng Nguyễn Thúy Ngân',
 980,
 1,
 'Hướng Dẫn Tắm Bé Sơ Sinh Chưa Rụng Rốn An Toàn Tại Nhà | Ngân Care',
 'Quy trình chuẩn y khoa hướng dẫn tắm bé sơ sinh và vệ sinh cuống rốn an toàn, tránh viêm nhiễm từ Điều Dưỡng Thúy Ngân.'
),

('post-03', 
 'Cẩm Nang Phục Hồi Cơ Thể Toàn Diện Cho Mẹ Sau Sinh: Giảm Đau Mỏi & Về Dáng Nhanh',
 'cam-nang-phuc-hoi-co-the-cho-me-sau-sinh',
 'Sau kỳ vượt cạn, cơ thể mẹ chịu nhiều tổn thương và biến đổi lớn. Hãy cùng tìm hiểu phương pháp xông hơi thảo dược, chăm sóc sàn chậu và dinh dưỡng để mẹ nhanh hồi phục sức khỏe.',
 '<h2>1. Giai đoạn vàng hồi phục sức khỏe sau sinh</h2><p>30 ngày đầu sau sinh là thời điểm quý báu để cơ thể phục hồi tổn thương cơ học, co hồi tử cung và đào thải sản dịch. Chăm sóc đúng cách sẽ giúp mẹ tránh được các chứng hậu sản như đau lưng mãn tính, lạnh dạ dày hay sa sàn chậu.</p><h2>2. Liệu pháp xông hơi thảo dược toàn thân và vùng kín</h2><p>Nước xông từ các loại lá thảo mộc thiên nhiên (lá tre, sả, gừng, bưởi, ngải cứu, trắc bách diệp...) giúp làm giãn nở lỗ chân lông, đào thải độc tố, giảm ứ huyết và hỗ trợ co hồi vùng kín nhanh chóng.</p><h2>3. Massage phục hồi cơ xương khớp và quấn ấm thảo mộc</h2><p>Các động tác xoa bóp nhẹ nhàng dọc hai dải cơ lưng và hông kết hợp tinh dầu ấm giúp giảm căng cứng cơ bắp sau quá trình rặn đẻ hoặc mang vác thai nhi 9 tháng 10 ngày.</p>',
 '/images/banner.jpg',
 'Chăm Sóc Sau Sinh',
 'Điều Dưỡng Nguyễn Thúy Ngân',
 750,
 1,
 'Cẩm Nang Phục Hồi Sau Sinh Cho Mẹ Bỉm Toàn Diện | Ngân Care',
 'Bí quyết phục hồi sức khỏe, giảm đau lưng hông và lấy lại vóc dáng sau sinh an toàn từ chuyên gia Điều Dưỡng Thúy Ngân.'
);

-- Tài khoản Quản trị viên
INSERT OR IGNORE INTO admins (id, username, password_hash, role)
VALUES
('adm-01', 'admin', '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', 'admin');
