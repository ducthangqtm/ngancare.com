'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Check, Clock, Calendar, ArrowRight, Star } from 'lucide-react';
import { Service } from '@/lib/types';
import { INITIAL_SERVICES } from '@/lib/seed-data';

interface CoreServicesProps {
  onSelectService?: (serviceId: string) => void;
}

export default function CoreServices({ onSelectService }: CoreServicesProps) {
  // Flagship services (excluding pure physical products which have their own catalog)
  const [services, setServices] = useState<Service[]>(
    INITIAL_SERVICES.filter((s) => s.category !== 'san_pham')
  );

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch('/api/services');
        const data = await res.json();
        if (data.success && data.data && data.data.length > 0) {
          const medicalServices = data.data.filter(
            (s: Service) => s.category !== 'san_pham' && s.is_active === 1
          );
          if (medicalServices.length > 0) {
            setServices(medicalServices);
          }
        }
      } catch (e) {
        // Fallback to initial seed
      }
    };
    fetchServices();
  }, []);

  return (
    <section id="dich-vu" className="py-16 sm:py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gold-100 border border-gold-300 text-gold-800 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-gold-600" />
            <span>Dịch Vụ Y Khoa Trọng Tâm</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-charcoal-900">
            Dịch Vụ Chăm Sóc <span className="gold-gradient-text">Chuẩn Y Khoa Tại Nhà</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-charcoal-800">
            Bảng giá niêm yết công khai, minh bạch 100% — Cam kết không phát sinh bất kỳ phụ phí nào.
          </p>
        </div>

        {/* Services Grid (4 Flagship Healthcare Services) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {services.map((service, index) => {
            const isPopular = index === 0; // Most requested: Thông tắc tia sữa
            return (
              <div
                key={service.id}
                className={`relative rounded-3xl transition-all duration-300 flex flex-col justify-between overflow-hidden ${
                  isPopular
                    ? 'border-2 border-gold-500 shadow-gold-lg bg-cream-50 scale-[1.02]'
                    : 'border border-gold-200 shadow-sm hover:shadow-md bg-white'
                }`}
              >
                {/* Popular Badge */}
                {isPopular && (
                  <div className="bg-gradient-to-r from-gold-600 to-amber-500 text-white text-xs font-bold py-1.5 px-4 text-center uppercase tracking-wider flex items-center justify-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-white" />
                    <span>Dịch Vụ Cấp Cứu Nổi Bật Nhất</span>
                  </div>
                )}

                <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Header: Service Name & Category */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-bold text-gold-700 uppercase tracking-wide bg-gold-100 px-2.5 py-0.5 rounded-full">
                        {service.category === 'thong_tac'
                          ? 'Thông Tia Sữa'
                          : service.category === 'tam_be'
                          ? 'Tắm Bé Sơ Sinh'
                          : service.category === 'me_bau'
                          ? 'Massage Mẹ Bầu'
                          : 'Phục Hồi Sau Sinh'}
                      </span>
                      {service.duration && (
                        <span className="flex items-center gap-1 text-xs text-gray-500 font-medium">
                          <Clock className="w-3.5 h-3.5 text-gold-500" />
                          {service.duration} phút
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold text-charcoal-900 leading-snug">
                      {service.name}
                    </h3>

                    {/* Price display */}
                    <div className="mt-4 mb-4 pb-4 border-b border-gold-100 flex items-baseline gap-2">
                      <span className="text-2xl sm:text-3xl font-extrabold text-gold-600">
                        {service.price ? service.price.toLocaleString('vi-VN') + 'đ' : 'Liên hệ'}
                      </span>
                      <span className="text-xs text-gray-500">/ buổi tại nhà</span>
                    </div>

                    <p className="text-xs sm:text-sm text-gray-700 leading-relaxed mb-5">
                      {service.description}
                    </p>

                    {/* Features List */}
                    <ul className="space-y-2.5 text-xs sm:text-sm text-charcoal-900 mb-6">
                      {service.features &&
                        service.features.map((feat, fIdx) => (
                          <li key={fIdx} className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                            <span className="leading-snug">{feat}</span>
                          </li>
                        ))}
                    </ul>
                  </div>

                  {/* Booking CTA Button */}
                  <a
                    href="#dat-lich"
                    onClick={() => onSelectService && onSelectService(service.id)}
                    className={`w-full py-3 px-4 rounded-xl font-bold text-sm text-center flex items-center justify-center gap-2 transition-all shadow-sm ${
                      isPopular
                        ? 'bg-gold-500 hover:bg-gold-600 text-white shadow-gold-soft'
                        : 'bg-cream-200 hover:bg-gold-500 hover:text-white text-charcoal-900'
                    }`}
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Đặt Lịch Gói Này</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Extra note */}
        <div className="mt-10 p-4 rounded-2xl bg-cream-200/80 border border-gold-200 text-center max-w-2xl mx-auto text-xs sm:text-sm text-charcoal-800">
          💡 <strong>Mẹ lưu ý:</strong> Toàn bộ dụng cụ tiệt trùng, dầu massage thảo dược và máy sóng siêu âm đều do Điều dưỡng chuẩn bị 100%. Gia đình chỉ cần chuẩn bị nước ấm.
        </div>

      </div>
    </section>
  );
}
