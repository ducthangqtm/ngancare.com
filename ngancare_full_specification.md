# SPECIFICATION VÀ PROMPT TỔNG HỢP XÂY DỰNG WEBSITE NGÂN CARE (ngancare.com)
> Dự án: Website Chăm Sóc Mẹ & Bé Ngân Care
> Kiến trúc: Cloudflare Pages + Cloudflare D1 (SQLite) + Cloudflare R2 + GitHub Actions

---

## 1. TỔNG QUAN HỆ THỐNG VÀ TECH STACK
- **Domain:** `ngancare.com` (Cloudflare Registrar & DNS)
- **Frontend Framework:** Next.js (Static Export / App Router with Edge Runtime) hoặc Astro / Hono + React.
- **Styling:** Tailwind CSS (Tone màu: Vàng Gold `#D4A359`, Kem ấm `#FAF6F0`, Trắng `#FFFFFF`, Text `#2D2D2D`).
- **Icons:** Lucide React (`lucide-react`).
- **Database & Storage:**
  - **Cloudflare D1:** Lưu trữ bảng Services, Bookings, Blog Posts, Admins (Serverless SQLite miễn phí).
  - **Cloudflare R2:** Lưu trữ ảnh bài viết Blog và hình ảnh sản phẩm (Miễn phí 10GB, 0đ băng thông).
- **Backend API:** Cloudflare Pages Functions (`/functions/api/*`).

---

## 2. DATABASE SCHEMA HOÀN CHỈNH (CLOUDFLARE D1)
```sql
-- 1. Bảng Dịch vụ & Sản phẩm
CREATE TABLE IF NOT EXISTS services (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL, -- 'me_bau', 'sau_sinh', 'tam_be', 'san_pham'
    price REAL,
    duration INTEGER, -- Thời lượng tính bằng phút
    description TEXT,
    features TEXT, -- JSON chuỗi mô tả lợi ích
    image_url TEXT,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Bảng Đặt Lịch Hẹn
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

-- 3. Bảng Bài Viết Blog (Chuẩn SEO YMYL)
CREATE TABLE IF NOT EXISTS posts (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL, -- Nội dung HTML hoặc Markdown
    cover_image TEXT,
    category TEXT DEFAULT 'KienThucMeBe',
    author TEXT DEFAULT 'Điều Dưỡng Thúy Ngân',
    views INTEGER DEFAULT 0,
    is_published INTEGER DEFAULT 1,
    meta_title TEXT,
    meta_description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 4. Bảng Quản trị viên (Admin)
CREATE TABLE IF NOT EXISTS admins (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'admin',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

## 3. CẤU TRÚC GIAO DIỆN LANDING PAGE CHÍNH (FRONTEND)

### Section 1: Header / Sticky Navbar
- Logo: Bông sen vàng và bàn tay nâng niu + Tên thương hiệu **Nguyễn Thúy Ngân - Mẹ và Bé** (ngancare.com).
- Menu: Trang chủ, Về Ngân Care, Dịch vụ, Sản phẩm, Bảng giá, Quy trình, Blog, Đặt lịch.
- Nút bấm nổi bật:
  - **"Cấp cứu tắc tia sữa 24/7"** (Nút màu cam nổi bật, nhấp nháy, bấm gọi Hotline ngay lập tức).
  - Nút "Đặt lịch ngay".

### Section 2: Hero Section
- Hình ảnh: Bố cục banner mẹ và bé ấm áp, hình ảnh chuyên viên Ngân chăm sóc tận tâm.
- Tiêu đề chính: *"Đồng Hành Cùng Mẹ Chăm Sóc Sức Khỏe Mẹ Và Bé Từ Thai Kỳ Đến Sau Sinh"*.
- Slogan: *"Chăm sóc bằng kiến thức - Nuôi dưỡng bằng yêu thương"*.
- Cam kết nhanh: *"Có mặt sau 30 - 45 phút nội thành Hà Nội"*.
- 4 trụ cột giá trị:
  1. Kiến thức y khoa chính quy.
  2. Chăm sóc nhẹ nhàng, tận tâm.
  3. Giải pháp tự nhiên, không đau.
  4. Đồng hành 24/7 cùng mẹ bỉm.

### Section 3: Giới thiệu Chuyên gia (About Specialist)
- Ảnh chân dung tròn viền vàng sang trọng của Điều dưỡng Nguyễn Thúy Ngân.
- Trình độ & Chuyên môn:
  - Tốt nghiệp Trường Cao Đẳng Y Tế Hà Nội.
  - Chứng chỉ Chăm sóc Tuyến sữa thuận tự nhiên.
  - Chứng chỉ Phục hồi sức khỏe sàn chậu & Spa mẹ bầu sau sinh.

### Section 4: Danh mục Dịch vụ Trọng tâm
- **Thông tắc tia sữa & Kích sữa:** Không đau, không nặn bóp thô bạo, giải tỏa cương sữa tức thì.
- **Tắm bé & Massage sơ sinh tại nhà:** Chuẩn y khoa, vệ sinh rốn an toàn, hơ lá trầu, vận động sớm.
- **Chăm sóc mẹ bầu & Spa sau sinh:** Massage giảm đau lưng hông, xông hơi thảo dược toàn thân/vùng kín, quấn bụng định hình thảo mộc.

### Section 5: Quy trình 4 Bước Chuẩn Y Khoa
- Bước 1: Thăm khám, kiểm tra nang sữa và tình trạng sức khỏe mẹ/bé.
- Bước 2: Vệ sinh, tiệt trùng dụng cụ y tế 100%.
- Bước 3: Thực hiện thao tác chuyên môn nhẹ nhàng, êm dịu, không đau.
- Bước 4: Hướng dẫn mẹ kỹ năng chỉnh khớp ngậm đúng và cách nuôi con bằng sữa mẹ.

### Section 6: Cam kết Vàng 3 KHÔNG
- KHÔNG gây đau đớn, tổn thương nang sữa.
- KHÔNG dùng hóa chất độc hại (100% thảo mộc tự nhiên an toàn).
- KHÔNG phát sinh chi phí ngoài giá niêm yết.

### Section 7: Khu vực Phục vụ tại Nhà (Local SEO Hà Nội)
- Hỗ trợ nhanh tại các quận: Cầu Giấy, Nam Từ Liêm, Bắc Từ Liêm, Thanh Xuân, Đống Đa, Hà Đông, Ba Đình, Hoàn Kiếm, Hai Bà Trưng, Hoàng Mai, Long Biên, Gia Lâm.

### Section 8: Form Đặt Lịch Trực Tuyến
- Nhập thông tin: Họ tên mẹ, Số điện thoại, Địa chỉ đón tiếp, Gói dịch vụ, Thời gian hẹn, Ghi chú tình trạng.
- Gửi dữ liệu về API `/api/booking` -> Lưu vào Cloudflare D1.

### Section 9: Catalog Sản phẩm Thiên Nhiên
- Giới thiệu các sản phẩm: Cao chè vằng sẻ, cốt gừng nghệ hạ thổ, tinh dầu tràm Huế, thảo dược xông tắm sau sinh...
- Nút "Tư vấn nhanh qua Zalo".

### Section 10: FAQ - Câu hỏi Thường Gặp
- Bé chưa rụng rốn có tắm tại nhà được không?
- Một buổi thông tia sữa thường mất bao lâu?
- Dụng cụ có được khử trùng trước khi đến nhà không?

### Section 11: Footer & Floating Action Buttons
- Liên kết mạng xã hội: Fanpage Facebook (`facebook.com/ngancare.mevabe`), Zalo, Hotline.
- Floating buttons góc phải màn hình: Nút gọi điện, Nút chat Zalo, Nút mở Messenger.

---

## 4. HỆ THỐNG BLOG CHIA SẺ KIẾN THỨC (FRONTEND & SEO)
- Route `/blog`: Hiển thị danh sách bài viết phân trang, lọc theo danh mục.
- Route `/blog/[slug]`: Chi tiết bài viết chuẩn SEO YMYL (Mục lục, Khối tác giả Điều dưỡng Thúy Ngân, Nút CTA đặt lịch).
- Cấu trúc JSON-LD Schema: Khai báo Schema `MedicalBusiness`, `Person`, `BlogPosting`, `FAQPage`.

---

## 5. HỆ THỐNG ADMIN DASHBOARD (/admin)
- `/admin/login`: Trang đăng nhập quản trị.
- `/admin/bookings`: Xem bảng danh sách lịch hẹn, đổi trạng thái (Pending -> Confirmed -> Completed).
- `/admin/services`: CRUD danh mục dịch vụ và sản phẩm.
- `/admin/posts`: Trình soạn thảo bài viết Blog (Rich Text/Markdown), tự sinh slug, nhập SEO Meta Title/Description.

---

## 6. PROMPT ĐẦY ĐỦ CHO ANTIGRAVITY
(Sao chép phần bên dưới đưa vào Antigravity để tạo trọn bộ dự án)

```
Bạn là chuyên gia Full-stack và Chuyên gia SEO. Hãy tạo dự án mã nguồn hoàn chỉnh cho website dịch vụ chăm sóc mẹ và bé "Ngân Care" (ngancare.com) triển khai trên Cloudflare Pages kết hợp Cloudflare D1:

1. Kiến trúc:
- Next.js (App Router, Static Export & Pages Functions) hoặc Astro + React.
- Tailwind CSS với tông màu: Vàng Gold (#D4A359), Kem ấm (#FAF6F0), Trắng (#FFFFFF).
- Cloudflare D1 cho Database (Services, Bookings, Posts, Admins).

2. Trang Khách (Public):
- Landing page trang chủ đầy đủ: Header (kèm nút Cấp Cứu Tắc Tia Sữa 24/7), Hero Banner, About Chuyên gia Thúy Ngân, Services, Quy trình 4 bước chuẩn Y khoa, Cam kết 3 KHÔNG, Khu vực phục vụ Hà Nội, Catalog Sản phẩm, Form Đặt lịch, FAQ, Footer.
- Blog module: Trang danh sách `/blog` và bài viết chi tiết `/blog/[slug]`. Tích hợp đầy đủ JSON-LD Schema (MedicalBusiness, Person, FAQPage, Article).

3. Trang Quản trị (Admin):
- Dashboard `/admin` quản lý Bookings, Services/Sản phẩm, và Viết bài Blog (kèm Rich Text Editor).

4. API Backend (Cloudflare Pages Functions):
- Xử lý các endpoint: POST `/api/booking`, POST `/api/admin/login`, CRUD `/api/admin/posts`, CRUD `/api/admin/services`, GET `/api/posts`.
- Tạo file `wrangler.toml` và file `schema.sql` sẵn sàng khởi tạo Database D1.
```
