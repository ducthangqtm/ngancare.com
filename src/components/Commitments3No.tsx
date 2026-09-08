import React from 'react';
import { Ban, Leaf, CircleDollarSign, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function Commitments3No() {
  const commitments = [
    {
      icon: Ban,
      title: 'KHÔNG Đau Đớn — KHÔNG Dập Nang Sữa',
      desc: 'Tuyệt đối không dùng bạo lực nặn bóp, không châm chọc kim gây chảy máu hay rách mô liên kết. Mọi thao tác đều êm ái, bảo tồn trọn vẹn cấu trúc tuyến vú.',
      tag: 'Bảo Tồn Tuyến Vú',
    },
    {
      icon: Leaf,
      title: 'KHÔNG Hóa Chất — 100% Thảo Dược Tự Nhiên',
      desc: 'Toàn bộ tinh dầu, nước xông, cao chè vằng và thảo dược sử dụng đều thuần tự nhiên, lành tính, an toàn tuyệt đối cho làn da mỏng manh của bé và sức khỏe mẹ.',
      tag: 'Thuần Tự Nhiên 100%',
    },
    {
      icon: CircleDollarSign,
      title: 'KHÔNG Phát Sinh Bất Kỳ Phụ Phí Nào',
      desc: 'Báo giá trọn gói minh bạch trước khi đến nhà. Miễn phí cước di chuyển nội thành Hà Nội trong bán kính cam kết, không gợi ý mua thêm gói phụ khi chưa cần thiết.',
      tag: 'Minh Bạch Giá 100%',
    },
  ];

  return (
    <section id="cam-ket" className="py-16 sm:py-20 bg-gradient-to-b from-amber-50/50 via-white to-cream-100 text-charcoal-900 relative overflow-hidden">
      {/* Subtle gold glow behind */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gold-200/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-gold-100 border border-gold-300 text-gold-800 text-xs font-bold uppercase tracking-wider mb-3">
            <ShieldCheck className="w-4 h-4 text-gold-600" />
            <span>Danh Dự Nghề Y</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-charcoal-900">
            Cam Kết Vàng <span className="gold-gradient-text">“3 KHÔNG”</span> Từ Điều Dưỡng Thúy Ngân
          </h2>
          <p className="mt-3 text-sm sm:text-base text-charcoal-800">
            Đặt sự an toàn của mẹ và bé lên trên hết — Sự an tâm của gia đình là tôn chỉ hoạt động cao nhất.
          </p>
        </div>

        {/* 3 Commitments Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {commitments.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="bg-white border border-amber-200 rounded-3xl p-7 hover:border-gold-400 transition-all duration-300 flex flex-col justify-between group shadow-sm hover:shadow-gold-lg"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-gold-700 group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-gold-800 bg-gold-100 px-3 py-1 rounded-full border border-gold-200">
                      {item.tag}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-charcoal-900 leading-snug mb-3">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-charcoal-800 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-amber-100 flex items-center gap-2 text-xs text-gold-700 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Bảo đảm bằng uy tín thương hiệu</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
