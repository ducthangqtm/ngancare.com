import React from 'react';
import Image from 'next/image';
import { ShieldCheck, Clock, HeartHandshake, PhoneCall, Sparkles, CheckCircle2 } from 'lucide-react';

export default function HeroBanner() {
  const pillars = [
    {
      icon: ShieldCheck,
      title: 'Kiến Thức Y Khoa Chính Quy',
      desc: 'Tốt nghiệp Y tế Hà Nội, thao tác chuẩn y học chứng cứ',
    },
    {
      icon: HeartHandshake,
      title: 'Chăm Sóc Nhẹ Nhàng, Tận Tâm',
      desc: 'Thương bé như con, thấu hiểu mọi âu lo của mẹ bỉm',
    },
    {
      icon: Sparkles,
      title: 'Giải Pháp Tự Nhiên - Không Đau',
      desc: 'Tuyệt đối không bóp nặn thô bạo, êm dịu thông tia',
    },
    {
      icon: Clock,
      title: 'Đồng Hành 24/7 Cùng Mẹ',
      desc: 'Hỗ trợ giải đáp, hướng dẫn chỉnh khớp ngậm trọn đời',
    },
  ];

  return (
    <section className="relative overflow-hidden pt-6 pb-16 lg:py-20 bg-gradient-to-b from-cream-200 via-cream-100 to-white">
      {/* Decorative background blurs */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-gold-200/40 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-amber-100/50 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Core Value Proposition & Headings */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Speed Commitment Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-100 border border-gold-300 text-charcoal-900 text-xs sm:text-sm font-semibold shadow-sm">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-gold-600"></span>
              </span>
              <span>Khu vực Long Biên & Gia Lâm: <strong>Có mặt sau 15 - 30 phút</strong></span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-charcoal-900 leading-tight">
              Đồng Hành Cùng Mẹ Chăm Sóc Sức Khỏe{' '}
              <span className="gold-gradient-text">Mẹ Và Bé</span> Từ Thai Kỳ Đến Sau Sinh
            </h1>

            {/* Slogan */}
            <p className="text-lg sm:text-xl font-medium text-gold-700 italic">
              “Chăm sóc bằng kiến thức — Nuôi dưỡng bằng yêu thương”
            </p>

            <p className="text-base sm:text-lg text-charcoal-800 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Được sáng lập và trực tiếp phụ trách bởi <strong>Điều Dưỡng Nguyễn Thúy Ngân</strong> (Thượng Thanh, Long Biên). Chuyên sâu thông tắc tia sữa không đau, tắm bé sơ sinh chuẩn Y khoa và phục hồi thể trạng toàn diện cho mẹ sau sinh tại nhà.
            </p>

            {/* Call to Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <a
                href="#dat-lich"
                className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-gold-500 hover:bg-gold-600 text-white font-bold text-base shadow-gold-soft hover:shadow-gold-lg transition-all text-center flex items-center justify-center gap-2 active:scale-95"
              >
                <span>Đặt Lịch Chăm Sóc Ngay</span>
              </a>

              <a
                href="tel:0339627769"
                className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white hover:bg-cream-100 border-2 border-emergency-500 text-emergency-600 font-bold text-base shadow-sm transition-all text-center flex items-center justify-center gap-2 active:scale-95"
              >
                <PhoneCall className="w-4 h-4 text-emergency-500" />
                <span>Cấp Cứu 24/7: 0339.627.769</span>
              </a>
            </div>

            {/* Trust Highlights */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 text-xs sm:text-sm text-charcoal-800">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>100% Điều dưỡng Y tế</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Vô khuẩn chuẩn Bệnh viện</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Thảo dược thiên nhiên 100%</span>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Banner Card */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/3] sm:aspect-[16/11]">
                <Image
                  src="/images/banner.jpg"
                  alt="Chuyên viên Ngân Care chăm sóc bé sơ sinh và mẹ bỉm"
                  fill
                  priority
                  className="object-cover hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Overlay Badge */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <p className="text-xs uppercase tracking-wider font-semibold text-gold-300">Dịch vụ tại nhà tận tâm</p>
                  <p className="text-base sm:text-lg font-bold">Thấu hiểu từng nhịp thở của bé & giọt sữa của mẹ</p>
                </div>
              </div>

              {/* Specialist Floating Mini-Card */}
              <div className="absolute -bottom-6 -left-4 sm:-left-6 bg-white/95 backdrop-blur-md p-3 sm:p-4 rounded-2xl shadow-xl border border-gold-200 flex items-center gap-3.5 max-w-[260px] sm:max-w-[280px]">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-gold-500 flex-shrink-0">
                  <Image
                    src="/images/avata.jpg"
                    alt="Điều Dưỡng Nguyễn Thúy Ngân"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-charcoal-900 leading-tight">ĐD. Nguyễn Thúy Ngân</h4>
                  <p className="text-[11px] text-gold-700 font-medium">8+ Năm Kinh Nghiệm</p>
                  <p className="text-[10px] text-gray-500">CĐ Y Tế Hà Nội</p>
                </div>
              </div>

              {/* Rating Floating Badge */}
              <div className="absolute -top-4 -right-2 sm:-right-4 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-lg border border-gold-200 text-center">
                <div className="flex items-center justify-center gap-1 text-amber-500 text-xs font-bold">
                  ★ ★ ★ ★ ★
                </div>
                <p className="text-[11px] font-bold text-charcoal-900 mt-0.5">3,500+ Mẹ Bỉm</p>
                <p className="text-[9px] text-gray-500">Đã tin dùng dịch vụ</p>
              </div>

            </div>
          </div>

        </div>

        {/* 4 Core Value Pillars Bar */}
        <div className="mt-14 pt-10 border-t border-gold-200/60">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="bg-white p-5 rounded-2xl border border-gold-200/70 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="flex items-center gap-3.5 mb-2.5">
                    <div className="w-10 h-10 rounded-xl bg-gold-100 flex items-center justify-center text-gold-600 flex-shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-gold-600 uppercase tracking-wider">Trụ cột 0{index + 1}</span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-charcoal-900 leading-snug">{item.title}</h3>
                  <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
