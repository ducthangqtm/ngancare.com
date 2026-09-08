import React from 'react';
import Image from 'next/image';
import { MessageCircle, Check, Sparkles, ShieldCheck } from 'lucide-react';
import { INITIAL_SERVICES } from '@/lib/seed-data';

export default function ProductsCatalog() {
  const products = INITIAL_SERVICES.filter((s) => s.category === 'san_pham');

  return (
    <section id="san-pham" className="py-16 sm:py-20 bg-cream-200/40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gold-100 border border-gold-300 text-gold-800 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-gold-600" />
            <span>Thảo Mộc Cung Đình & Tự Nhiên</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-charcoal-900">
            Sản Phẩm Thiên Nhiên <span className="gold-gradient-text">Lành Tính Cho Mẹ & Bé</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-charcoal-800">
            Nguồn gốc xuất xứ rõ ràng, chưng cất thủ công truyền thống, không phụ gia và hóa chất bảo quản.
          </p>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((prod) => (
            <div
              key={prod.id}
              className="bg-white rounded-3xl border border-gold-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Product Image */}
                <div className="relative h-48 w-full bg-cream-100 overflow-hidden">
                  <Image
                    src={prod.image_url || '/images/banner.jpg'}
                    alt={prod.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-[11px] font-bold text-gold-700 shadow-sm flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>Thuần Tự Nhiên</span>
                  </div>
                </div>

                {/* Product Details */}
                <div className="p-5">
                  <h3 className="text-base font-bold text-charcoal-900 line-clamp-2 leading-snug group-hover:text-gold-600 transition-colors">
                    {prod.name}
                  </h3>

                  <div className="mt-2.5 mb-3 flex items-baseline gap-2">
                    <span className="text-xl font-extrabold text-gold-600">
                      {prod.price ? prod.price.toLocaleString('vi-VN') + 'đ' : 'Liên hệ'}
                    </span>
                  </div>

                  <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed mb-4">
                    {prod.description}
                  </p>

                  <ul className="space-y-1.5 text-xs text-charcoal-800">
                    {prod.features.slice(0, 2).map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Zalo Quick Order CTA */}
              <div className="p-5 pt-0">
                <a
                  href={`https://zalo.me/0339627769?text=${encodeURIComponent(
                    'Chào Điều dưỡng Thúy Ngân, tôi muốn được tư vấn đặt mua: ' + prod.name
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white font-bold text-xs flex items-center justify-center gap-2 border border-blue-200 hover:border-blue-600 transition-all shadow-sm active:scale-95"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Tư Vấn Nhanh Qua Zalo</span>
                </a>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
