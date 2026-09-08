'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Bé chưa rụng rốn có tắm tại nhà được không?',
      a: 'Hoàn toàn được và rất an toàn khi có nhân viên y tế hỗ trợ. Điều dưỡng Thúy Ngân tuân thủ nghiêm ngặt quy trình vệ sinh cuống rốn vô khuẩn 100% bằng găng tay y tế và dung dịch sát khuẩn chuyên dụng, giúp cuống rốn luôn khô thoáng, tránh đọng nước gây nhiễm trùng hoặc u hạt rốn sơ sinh.',
    },
    {
      q: 'Một buổi thông tắc tia sữa thường mất bao lâu và có đau không?',
      a: 'Một buổi thông tắc kéo dài từ 60 - 75 phút. Phương pháp của Ngân Care là massage theo xoang nang sữa kết hợp máy sóng siêu âm đa tần hiện đại và chườm ấm thảo dược. Tuyệt đối KHÔNG bóp nặn thô bạo, rất êm ái, mẹ sẽ cảm thấy nhẹ nhõm, hết cương căng tức thì ngay trong buổi đầu tiên.',
    },
    {
      q: 'Dụng cụ y tế có được khử trùng trước khi đến nhà không?',
      a: 'Toàn bộ khăn xô, gạc y tế vô trùng, máy hút - thông sữa và thiết bị chuyên môn đều được tiệt trùng bằng cồn y tế chuyên dụng và tủ cực tím UV trước khi mang đến phục vụ mỗi gia đình.',
    },
    {
      q: 'Mẹ sinh mổ sau bao lâu thì có thể xông hơi và massage phục hồi?',
      a: 'Với mẹ sinh mổ, các động tác massage nhẹ nhàng vùng tay chân, cổ vai gáy và hỗ trợ thông tuyến sữa có thể thực hiện ngay sau khi xuất viện về nhà (ngày thứ 4 - 5). Riêng xông hơi toàn thân và quấn ấm bụng sẽ tiến hành sau khoảng 10 - 14 ngày khi vết mổ đã khô hoàn toàn.',
    },
    {
      q: 'Ngân Care phục vụ chủ yếu ở những khu vực nào?',
      a: 'Ngân Care hiện tại tập trung phục vụ chuyên sâu toàn bộ Quận Long Biên và Huyện Gia Lâm (Thượng Thanh, Đức Giang, Ngọc Thụy, Việt Hưng, Sài Đồng, Thạch Bàn, Bồ Đề, KĐT Vinhomes Riverside, KĐT Vinhomes Ocean Park 1, Đặng Xá, Trâu Quỳ...). Nhờ cự ly gần ngay tại Thượng Thanh, Điều dưỡng Thúy Ngân có mặt rất nhanh chỉ sau 15 - 30 phút khi mẹ liên hệ cấp cứu.',
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
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-charcoal-900">
            Câu Hỏi Thường Gặp <span className="gold-gradient-text">(FAQ)</span>
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-charcoal-800">
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
