import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Phone, MapPin, Mail, Heart, ShieldCheck, Clock, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-charcoal-900 text-gray-300 pt-16 pb-12 border-t border-gold-500/20 text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-gray-800">
          
          {/* Brand Info */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 flex-shrink-0 rounded-full overflow-hidden border border-gold-400 shadow-md bg-white p-0.5">
                <Image
                  src="/images/logo.png"
                  alt="Ngân Care Logo"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white leading-tight whitespace-nowrap">
                  Nguyễn Thúy Ngân
                </h3>
                <p className="text-xs text-gold-400 font-semibold tracking-wide">
                  Chăm sóc mẹ và bé tại nhà
                </p>
              </div>
            </div>

            <p className="text-gray-400 leading-relaxed text-xs">
              Dịch vụ chăm sóc mẹ và bé tại nhà uy tín hàng đầu Hà Nội. Trực tiếp thực hiện bởi Điều dưỡng chuyên khoa với phương châm: <em>&ldquo;Chăm sóc bằng kiến thức — Nuôi dưỡng bằng yêu thương&rdquo;</em>.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <a
                href="https://www.facebook.com/ngancare.mevabe"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-gray-800 hover:bg-blue-600 text-white flex items-center justify-center transition-colors"
                aria-label="Facebook Fanpage"
              >
                <span className="font-bold text-sm">f</span>
              </a>
              <a
                href="https://zalo.me/0339627769"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-gray-800 hover:bg-blue-500 text-white flex items-center justify-center transition-colors font-bold text-xs"
                aria-label="Zalo (+84 339 627 769)"
              >
                Zalo
              </a>
              <a
                href="tel:0339627769"
                className="w-9 h-9 rounded-full bg-gray-800 hover:bg-emerald-600 text-white flex items-center justify-center transition-colors"
                aria-label="Gọi điện 0339627769"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider text-gold-400">
              Dịch Vụ Chính
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>
                <Link href="/#dich-vu" className="hover:text-gold-400 transition-colors">
                  Thông tắc tia sữa
                </Link>
              </li>
              <li>
                <Link href="/#dich-vu" className="hover:text-gold-400 transition-colors">
                  Tắm và chăm sóc trẻ sơ sinh
                </Link>
              </li>
              <li>
                <Link href="/#dich-vu" className="hover:text-gold-400 transition-colors">
                  Chăm sóc phục hồi sau sinh
                </Link>
              </li>
              <li>
                <Link href="/#dich-vu" className="hover:text-gold-400 transition-colors">
                  Massage mẹ bầu thư giãn
                </Link>
              </li>
              <li>
                <Link href="/#san-pham" className="hover:text-gold-400 transition-colors">
                  Sản phẩm thảo mộc tự nhiên
                </Link>
              </li>
            </ul>
          </div>

          {/* Blog Articles */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider text-gold-400">
              Cẩm Nang Mẹ & Bé
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>
                <Link href="/blog/tac-tia-sua-uong-gi-lam-gi-phac-do-chuan-y-khoa" className="hover:text-gold-400 transition-colors line-clamp-2">
                  Kinh nghiệm thông tắc tia sữa nhẹ nhàng tại nhà
                </Link>
              </li>
              <li>
                <Link href="/blog/huong-dan-tam-be-so-sinh-chua-rung-ron-an-toan" className="hover:text-gold-400 transition-colors line-clamp-2">
                  Hướng dẫn tắm bé chưa rụng rốn an toàn, sạch sẽ
                </Link>
              </li>
              <li>
                <Link href="/blog/cam-nang-phuc-hoi-co-the-cho-me-sau-sinh" className="hover:text-gold-400 transition-colors line-clamp-2">
                  Cẩm nang phục hồi sau sinh & chăm sóc cơ thể
                </Link>
              </li>
              <li className="pt-1">
                <Link href="/blog" className="text-gold-400 hover:underline flex items-center gap-1 font-semibold">
                  <span>Xem toàn bộ bài viết Blog</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider text-gold-400">
              Thông Tin Liên Hệ
            </h4>
            <div className="space-y-2 text-xs text-gray-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-gold-400 flex-shrink-0 mt-0.5" />
                <span>Trụ sở: Thượng Thanh, Q. Long Biên, Hà Nội</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emergency-500 flex-shrink-0" />
                <span>Hotline / Zalo: <a href="tel:0339627769" className="text-white font-bold hover:text-gold-400">0339.627.769</a></span>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Bảo chứng chuyên môn: ĐD. Nguyễn Thúy Ngân</span>
              </div>
            </div>
          </div>

        </div>

        {/* Disclaimer & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500 text-center sm:text-left">
          <p>
            © {new Date().getFullYear()} <strong>Ngân Care (ngancare.com)</strong>. Bản quyền thuộc về Điều Dưỡng Nguyễn Thúy Ngân.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/admin/login" className="hover:text-gold-400 transition-colors">
              Khu Vực Quản Trị (Admin)
            </Link>
            <span>•</span>
            <span>An Toàn & Tận Tâm</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
