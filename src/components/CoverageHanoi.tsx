import React from 'react';
import { MapPin, Navigation, Clock, PhoneCall, Home, CheckCircle2 } from 'lucide-react';

export default function CoverageHanoi() {
  const longBienAreas = [
    { name: 'P. Thượng Thanh (Trụ Sở)', eta: '5 - 15 phút', isHome: true },
    { name: 'P. Đức Giang', eta: '10 - 20 phút', isHome: false },
    { name: 'P. Ngọc Thụy', eta: '10 - 20 phút', isHome: false },
    { name: 'P. Việt Hưng / KĐT Việt Hưng', eta: '10 - 20 phút', isHome: false },
    { name: 'KĐT Vinhomes Riverside', eta: '10 - 20 phút', isHome: false },
    { name: 'P. Bồ Đề', eta: '15 - 25 phút', isHome: false },
    { name: 'P. Sài Đồng', eta: '15 - 25 phút', isHome: false },
    { name: 'P. Thạch Bàn', eta: '15 - 25 phút', isHome: false },
    { name: 'P. Giang Biên', eta: '10 - 20 phút', isHome: false },
    { name: 'P. Phúc Đồng / Phúc Lợi', eta: '15 - 25 phút', isHome: false },
  ];

  const giaLamAreas = [
    { name: 'KĐT Vinhomes Ocean Park 1', eta: '20 - 30 phút', isHome: false },
    { name: 'Thị Trấn Trâu Quỳ', eta: '15 - 25 phút', isHome: false },
    { name: 'KĐT Đặng Xá', eta: '15 - 25 phút', isHome: false },
    { name: 'Xã Cổ Bi', eta: '15 - 25 phút', isHome: false },
    { name: 'Xã Yên Thường', eta: '15 - 25 phút', isHome: false },
    { name: 'Xã Dương Xá', eta: '20 - 30 phút', isHome: false },
    { name: 'Xã Kiêu Kỵ', eta: '20 - 30 phút', isHome: false },
    { name: 'Xã Bát Tràng', eta: '20 - 30 phút', isHome: false },
  ];

  return (
    <section className="py-16 sm:py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gold-100 border border-gold-300 text-gold-800 text-xs font-bold uppercase tracking-wider mb-3">
            <Navigation className="w-3.5 h-3.5 text-gold-600" />
            <span>Địa Bàn Hoạt Động Trọng Tâm</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-charcoal-900">
            Khu Vực Phục Vụ Nhanh <span className="gold-gradient-text">Long Biên & Gia Lâm</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-charcoal-800">
            Điều dưỡng Nguyễn Thúy Ngân thường trú tại <strong>Thượng Thanh — Long Biên</strong>, tập trung phục vụ chuyên sâu và có mặt thần tốc chỉ <strong>15 — 30 phút</strong> tại khu vực Long Biên & Gia Lâm!
          </p>
        </div>

        {/* Long Bien Column & Gia Lam Column */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          
          {/* Long Biên */}
          <div className="bg-cream-100/60 p-6 sm:p-7 rounded-3xl border border-gold-300 shadow-sm">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-gold-200">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-gold-500 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                  LB
                </div>
                <div>
                  <h3 className="text-lg font-bold text-charcoal-900">Quận Long Biên</h3>
                  <p className="text-xs text-gold-700 font-medium">Trụ sở: Thượng Thanh, Long Biên</p>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                Có mặt 10 - 25 phút
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
              {longBienAreas.map((area, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    area.isHome
                      ? 'bg-amber-100/90 border-amber-400 shadow-sm ring-1 ring-amber-400'
                      : 'bg-white border-gold-200 hover:border-gold-400'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold text-charcoal-900">
                    <MapPin className="w-3.5 h-3.5 text-gold-600 flex-shrink-0" />
                    <span className="truncate">{area.name}</span>
                  </div>
                  <div className="mt-1 flex items-center gap-1 text-[11px] text-gray-500 font-medium">
                    <Clock className="w-3 h-3 text-gold-600 flex-shrink-0" />
                    <span>{area.eta}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Gia Lâm */}
          <div className="bg-cream-100/60 p-6 sm:p-7 rounded-3xl border border-gold-300 shadow-sm">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-gold-200">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                  GL
                </div>
                <div>
                  <h3 className="text-lg font-bold text-charcoal-900">Huyện Gia Lâm</h3>
                  <p className="text-xs text-amber-700 font-medium">Vinhomes Ocean Park 1 & các xã lân cận</p>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                Có mặt 15 - 30 phút
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
              {giaLamAreas.map((area, idx) => (
                <div
                  key={idx}
                  className="bg-white p-3 rounded-xl border border-gold-200 hover:border-gold-400 text-left transition-all"
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold text-charcoal-900">
                    <MapPin className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                    <span className="truncate">{area.name}</span>
                  </div>
                  <div className="mt-1 flex items-center gap-1 text-[11px] text-gray-500 font-medium">
                    <Clock className="w-3 h-3 text-amber-600 flex-shrink-0" />
                    <span>{area.eta}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Urgent Callout Card with exact phone */}
        <div className="bg-gradient-to-r from-cream-200 via-white to-cream-200 p-6 sm:p-8 rounded-3xl border border-gold-300 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-1.5">
            <h4 className="text-base sm:text-lg font-bold text-charcoal-900 flex items-center justify-center sm:justify-start gap-2">
              <Home className="w-5 h-5 text-gold-600" />
              <span>Trụ Sở Ngân Care: Thượng Thanh — Long Biên — Hà Nội</span>
            </h4>
            <p className="text-xs sm:text-sm text-gray-600 max-w-xl">
              Khoảng cách gần, không lo kẹt cầu hay chậm trễ. Điều dưỡng Thúy Ngân luôn mang theo đầy đủ máy móc sóng siêu âm và dụng cụ vô khuẩn tới tận phòng của mẹ.
            </p>
          </div>

          <a
            href="tel:0339627769"
            className="flex-shrink-0 px-7 py-3.5 rounded-full bg-emergency-500 hover:bg-emergency-600 text-white font-bold text-sm flex items-center gap-2.5 shadow-md transition-all active:scale-95 whitespace-nowrap"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Gọi Cấp Cứu: 0339.627.769</span>
          </a>
        </div>

      </div>
    </section>
  );
}
