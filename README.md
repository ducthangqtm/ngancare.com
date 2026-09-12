# Ngân Care - Website Chăm Sóc Mẹ & Bé Tại Nhà (ngancare.com)

Dự án full-stack hoàn chỉnh cho thương hiệu **Ngân Care** của **Điều Dưỡng Nguyễn Thúy Ngân**, triển khai trên **Cloudflare Pages** kết hợp **Cloudflare D1 Database**.

---

## 🌟 Tính Năng Nổi Bật

1. **Trang Chủ Chuẩn Chuyển Đổi & Tối Ưu Trải Nghiệm**:
   - Header với thanh thông báo và nút **"HOTLINE HỖ TRỢ 24/7"** gọi hotline ngay lập tức.
   - Hero banner ấm áp, cam kết **"Có mặt sau 15 - 30 phút Long Biên & Gia Lâm"** và 4 trụ cột giá trị dịch vụ.
   - Giới thiệu **Điều Dưỡng Thúy Ngân** (Cao Đẳng Y Tế Hà Nội, Chứng chỉ Tuyến sữa thuận tự nhiên, Chứng chỉ Phục hồi sàn chậu & Spa sau sinh).
   - Danh mục dịch vụ trọng tâm: Thông tắc tia sữa nhẹ nhàng, Tắm bé sơ sinh an toàn, Chăm sóc phục hồi sau sinh toàn diện.
   - Quy trình chăm sóc 4 bước an toàn & Cam kết Vàng 3 KHÔNG.
   - Mạng lưới phục vụ Local SEO 12 quận Hà Nội.
   - Catalog sản phẩm thiên nhiên lành tính cho mẹ và bé kèm nút tư vấn qua Zalo.
   - Form đặt lịch trực tuyến với validation, gửi dữ liệu thời gian thực.
   - FAQ Accordion và Hệ thống nút gọi nổi (Hotline, Zalo, Messenger).

2. **Chuyên Mục Cẩm Nang Mẹ & Bé**:
   - Danh sách bài viết `/blog` phân loại theo danh mục (`Thông Tắc Tia Sữa`, `Tắm Bé Sơ Sinh`, `Chăm Sóc Sau Sinh`...).
   - Chi tiết bài viết `/blog/[slug]` với cấu trúc đề mục, hướng dẫn an toàn từ chuyên gia, khung tác giả và nút CTA đặt lịch.
   - Tích hợp đầy đủ JSON-LD Schema: `LocalBusiness`, `ProfessionalService`, `Person`, `FAQPage`, `BlogPosting`.

3. **Admin Dashboard Quản Trị (/admin)**:
   - Đăng nhập bảo mật `/admin/login`.
   - Quản lý lịch hẹn `/admin/bookings`: Xem danh sách, gọi điện thoại trực tiếp, cập nhật trạng thái (Pending -> Confirmed -> Completed -> Cancelled).
   - Quản lý dịch vụ / sản phẩm `/admin/services`: Thêm, sửa, xóa, bật/tắt hiển thị.
   - Quản lý bài viết blog `/admin/posts`: Soạn thảo nội dung Rich Text/HTML, tự động tạo slug, thiết lập SEO Title & Meta Description.

4. **Backend Serverless (Cloudflare Pages Functions & D1)**:
   - File cấu hình `wrangler.toml` và DDL khởi tạo `schema.sql`.
   - Cloudflare Pages Functions tại `/functions/api/*` truy xuất trực tiếp D1 SQLite:
     - `POST /api/booking`
     - `POST /api/admin/login`
     - `GET, PUT /api/admin/bookings`
     - `CRUD /api/admin/posts`
     - `CRUD /api/admin/services`
     - `GET /api/posts` & `GET /api/posts/[slug]`
     - `GET /api/services`
   - Hỗ trợ cả môi trường Local Dev song hành (`src/app/api/*`) chạy ngay lập tức không cần cấu hình phức tạp.

---

## 🚀 Hướng Dẫn Chạy Môi Trường Cục Bộ (Local Development)

```bash
# 1. Cài đặt dependencies
npm install

# 2. Khởi chạy dev server
npm run dev
```

Mở trình duyệt truy cập:
- Trang khách: [http://localhost:3000](http://localhost:3000)
- Chuyên mục Blog: [http://localhost:3000/blog](http://localhost:3000/blog)
- Quản trị Admin: [http://localhost:3000/admin](http://localhost:3000/admin)
  - **Tài khoản mặc định:** `admin`
  - **Mật khẩu mặc định:** `ngancare2026!`

---

## ☁️ Hướng Dẫn Triển Khai Lên Cloudflare Pages & Cloudflare D1

### Bước 1: Khởi tạo Database Cloudflare D1
```bash
# Đăng nhập Cloudflare CLI
npx wrangler login

# Tạo database D1
npx wrangler d1 create ngancare-db
```
Sau khi tạo, copy `database_id` vào file `wrangler.toml`:
```toml
[[d1_databases]]
binding = "DB"
database_name = "ngancare-db"
database_id = "paste-database-id-vao-day"
```

### Bước 2: Nạp Cấu Trúc Bảng và Dữ Liệu Khởi Tạo (Seed Data)
```bash
npx wrangler d1 execute ngancare-db --file=./schema.sql
```

### Bước 3: Build và Triển Khai Lên Cloudflare Pages
```bash
# Build tĩnh website
npm run pages:build

# Deploy lên Cloudflare Pages
npx wrangler pages deploy out --project-name=ngancare-com
```
Hoặc kết nối repository GitHub vào Cloudflare Pages Dashboard:
- **Build command:** `npm run pages:build`
- **Build output directory:** `out`
- **D1 Database Bindings:** Gán Variable `DB` trỏ đến `ngancare-db` trong tab Settings -> Functions -> D1 database bindings.
