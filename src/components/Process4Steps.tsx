import React from 'react';
import { Stethoscope, ShieldAlert, Sparkles, Baby, ArrowRight } from 'lucide-react';
import { HomepageConfig } from '@/lib/homepage-config';

interface Process4StepsProps {
  config?: Partial<HomepageConfig>;
}

export default function Process4Steps({ config }: Process4StepsProps) {
  const badge = config?.process_badge || 'Tận Tâm & Chuyên Nghiệp';
  const title = config?.process_title || 'Quy Trình Chăm Sóc 4 Bước';
  const subtitle = config?.process_subtitle || '4 Bước Vàng — Mẹ An Tâm';

  const steps = [
    {
      num: '01',
      icon: Stethoscope,
      title: config?.process_step1_title || 'Đánh giá và nhận định',
      desc: config?.process_step1_desc || 'Điều dưỡng viên nắm bắt thể trạng và nhu cầu của mẹ và bé. Lắng nghe và kiểm tra tình trạng thực tế cần hỗ trợ chăm sóc.',
      bullets: [
        'Điều dưỡng viên nắm bắt thể trạng và nhu cầu của mẹ và bé',
        'Lắng nghe và kiểm tra tình trạng thực tế cần hỗ trợ chăm sóc',
      ],
    },
    {
      num: '02',
      icon: ShieldAlert,
      title: config?.process_step2_title || 'Chuẩn bị dụng cụ chăm sóc',
      desc: config?.process_step2_desc || 'Chuẩn bị các dụng cụ chăm sóc thường quy và chuyên biệt theo gói dịch vụ. Đảm bảo toàn bộ dụng cụ được vệ sinh và tiệt trùng sạch sẽ, an toàn.',
      bullets: [
        'Chuẩn bị các dụng cụ chăm sóc thường quy và chuyên biệt theo gói dịch vụ',
        'Đảm bảo toàn bộ dụng cụ được vệ sinh và tiệt trùng sạch sẽ, an toàn',
      ],
    },
    {
      num: '03',
      icon: Sparkles,
      title: config?.process_step3_title || 'Thao tác chuyên môn',
      desc: config?.process_step3_desc || 'Thực hiện các thao tác chuyên môn nhẹ nhàng theo gói dịch vụ. Chăm sóc chu đáo các vấn đề mẹ và bé đang gặp phải (thông tia, tắm bé, thư giãn).',
      bullets: [
        'Thực hiện các thao tác chuyên môn nhẹ nhàng theo gói dịch vụ',
        'Chăm sóc chu đáo các vấn đề mẹ và bé đang gặp phải (thông tia, tắm bé, thư giãn)',
      ],
    },
    {
      num: '04',
      icon: Baby,
      title: config?.process_step4_title || 'Đánh giá kết quả & giải thích thắc mắc',
      desc: config?.process_step4_desc || 'Đánh giá hiệu quả sau buổi chăm sóc. Tổng hợp những điểm gia đình cần lưu ý khi chăm sóc mẹ và bé, hướng dẫn mẹ cách tự chăm sóc và theo dõi thể trạng bé tại nhà.',
      bullets: [
        'Đánh giá hiệu quả sau buổi chăm sóc',
        'Tổng hợp những điểm gia đình cần lưu ý khi chăm sóc mẹ và bé',
        'Hướng dẫn mẹ cách tự chăm sóc và theo dõi thể trạng bé tại nhà',
      ],
    },
  ];

  return (
    <section id="quy-trinh" className="py-16 sm:py-20 bg-cream-200/50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gold-100 border border-gold-300 text-gold-800 text-xs font-bold uppercase tracking-wider mb-3">
            <span>{badge}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-charcoal-900 leading-tight text-balance">
            {title}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-gold-800 font-semibold text-balance">
            {subtitle}
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
                  <h3 className="text-base sm:text-lg font-bold text-charcoal-900 mt-1 mb-3 leading-snug text-balance">
                    {step.title}
                  </h3>
                  <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-line">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
