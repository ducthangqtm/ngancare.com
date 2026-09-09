import React from 'react';
import { Stethoscope, ShieldAlert, Sparkles, Baby, ArrowRight } from 'lucide-react';

export default function Process4Steps() {
  const steps = [
    {
      num: '01',
      icon: Stethoscope,
      title: 'Đánh giá và nhận định',
      bullets: [
        'Điều dưỡng viên đánh giá toàn trạng sức khoẻ mẹ và bé',
        'Xác định các vấn đề sinh lý/ bệnh lý cần chăm sóc',
      ],
    },
    {
      num: '02',
      icon: ShieldAlert,
      title: 'Chuẩn bị dụng cụ chăm sóc',
      bullets: [
        'Chuẩn bị các dụng cụ chăm sóc thường quy và dụng cụ chuyên biệt theo thực tế',
        'Đảm bảo dụng cụ chăm sóc đạt tiêu chuẩn an toàn y tế trước khi thực hiện',
      ],
    },
    {
      num: '03',
      icon: Sparkles,
      title: 'Thao tác chuyên môn',
      bullets: [
        'Thực hiện các thao tác chuyên môn theo gói dịch vụ',
        'Xử trí các vấn đề sinh lý/ bệnh lý mà mẹ và bé đang gặp phải',
      ],
    },
    {
      num: '04',
      icon: Baby,
      title: 'Đánh giá kết quả & giải thích thắc mắc',
      bullets: [
        'Đánh giá kết quả chăm sóc sau quá trình chăm sóc',
        'Tổng hợp những vấn đề mẹ và bé cần lưu ý sau buổi chăm sóc',
        'Hướng dẫn gia đình cách theo dõi và xử trí các vấn đề sức khoẻ',
      ],
    },
  ];

  return (
    <section id="quy-trinh" className="py-16 sm:py-20 bg-cream-200/50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gold-100 border border-gold-300 text-gold-800 text-xs font-bold uppercase tracking-wider mb-3">
            <span>Y Đức & Kỹ Thuật</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-charcoal-900">
            Quy Trình Chăm Sóc <span className="gold-gradient-text">4 Bước</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-gold-800 font-semibold">
            4 Bước Vàng — Mẹ An Tâm
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className="bg-white p-6 rounded-3xl border border-gold-200 shadow-sm hover:shadow-md transition-all relative flex flex-col justify-between group"
              >
                {/* Step Number Watermark */}
                <div className="absolute top-4 right-5 text-4xl font-black text-gold-100 select-none group-hover:text-gold-200 transition-colors">
                  {step.num}
                </div>

                <div>
                  <div className="w-12 h-12 rounded-2xl bg-gold-500 text-white flex items-center justify-center shadow-gold-soft mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>

                  <span className="text-xs font-bold text-gold-600 tracking-wider uppercase">Bước {step.num}</span>
                  <h3 className="text-base sm:text-lg font-bold text-charcoal-900 mt-1 mb-3 leading-snug">
                    {step.title}
                  </h3>
                  <ul className="space-y-1.5 text-xs text-gray-700 leading-relaxed">
                    {step.bullets.map((bullet, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-1.5">
                        <span className="text-gold-500 font-bold mt-0.5">•</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
