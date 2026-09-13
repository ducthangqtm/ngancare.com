'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Bé chưa rụng rốn có tắm tại nhà được không?',
      a: 'Hoàn toàn được và rất an toàn khi có chuyên viên hỗ trợ. Điều dưỡng Thúy Ngân tuân thủ quy trình tắm và chăm sóc cuống rốn sạch sẽ, an toàn, cẩn thận, giúp cuống rốn luôn khô thoáng, sạch sẽ, tránh đọng nước cho bé.',
    },
    {
      q: 'Một buổi thông tắc tia sữa thường mất bao lâu và có đau không?',
      a: 'Một buổi thông tắc kéo dài khoảng 100 phút. Phương pháp chăm sóc ứng dụng kỹ thuật dẫn lưu hệ bạch huyết kết hợp massage giải cơ vùng ngực bằng tay và máy chuyên dụng. Tuyệt đối KHÔNG làm đau rát, KHÔNG dùng lực thô bạo, giúp giải cơ lưu thông khí huyết, giảm ứ trệ và thông sữa thuận tự nhiên.',
    },
    {
      q: 'Dụng cụ chăm sóc có được tiệt trùng sạch sẽ trước khi đến nhà không?',
      a: 'Toàn bộ khăn xô, dụng cụ vệ sinh, máy chuyên dụng và phụ kiện đều được làm sạch và tiệt trùng cẩn thận trước khi mang đến phục vụ mỗi gia đình.',
    },
    {
      q: 'Mẹ sinh mổ sau bao lâu thì có thể xông hơi và massage phục hồi?',
      a: 'Với mẹ sinh mổ, các động tác massage nhẹ nhàng vùng tay chân, cổ vai gáy và hỗ trợ thông tuyến sữa có thể thực hiện ngay sau khi xuất viện về nhà (ngày thứ 4 - 5). Riêng xông hơi toàn thân và quấn ấm bụng sẽ tiến hành sau khoảng 10 - 14 ngày khi vết mổ đã khô hoàn toàn.',
    },
    {
      q: 'Ngân Care nhận phục vụ tại nhà như thế nào?',
      a: 'Điều dưỡng Nguyễn Thúy Ngân nhận chăm sóc mẹ và bé tận nơi tại nhà ở Hà Nội. Mẹ chỉ cần đặt lịch hẹn trước qua website hoặc liên hệ trực tiếp Hotline / Zalo: 0339.627.769 để được sắp xếp thời gian chăm sóc chu đáo nhất.',
    },
  ];

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-16 sm:py-20 bg-white relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gold-100 border border-gold-300 text-gold-800 text-xs font-bold uppercase tracking-wider mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-gold-600" />
            <span>Giải Đáp Thắc Mắc</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-charcoal-900 leading-tight text-balance">
            Câu Hỏi Thường Gặp <span className="gold-gradient-text whitespace-nowrap">(FAQ)</span>
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-charcoal-800 text-balance">
            Những băn khoăn phổ biến nhất của các mẹ bầu và mẹ sau sinh khi lần đầu sử dụng dịch vụ tại nhà.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="border border-gold-200 rounded-2xl overflow-hidden transition-all bg-cream-50/40"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-charcoal-900 hover:text-gold-600 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-gold-600 flex-shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-gray-700 leading-relaxed border-t border-gold-100/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
