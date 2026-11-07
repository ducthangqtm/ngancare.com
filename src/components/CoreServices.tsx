'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Check, Clock, Calendar, ArrowRight, Star } from 'lucide-react';
import { Service } from '@/lib/types';
import { HomepageConfig } from '@/lib/homepage-config';

interface CoreServicesProps {
  onSelectService?: (serviceId: string) => void;
  config?: Partial<HomepageConfig>;
}

export default function CoreServices({ onSelectService, config }: CoreServicesProps) {
  const badge = config?.services_badge || 'Dịch Vụ Trọng Tâm';
  const title = config?.services_title || 'Dịch Vụ Chăm Sóc Mẹ Và Bé Tại Nhà';
  const highlight = config?.services_title_highlight ?? 'Mẹ Và Bé Tại Nhà';
  const subtitle = config?.services_subtitle || 'Bảng giá niêm yết công khai, minh bạch rõ ràng — Cam kết không phát sinh bất kỳ phụ phí nào.';

  const renderTitle = () => {
    if (highlight && title.includes(highlight)) {
      const parts = title.split(highlight);
      return (
        <>
          {parts[0]}
          <span className="gold-gradient-text whitespace-nowrap">{highlight}</span>
          {parts.slice(1).join(highlight)}
        </>
      );
    }
    return title;
  };
  // Flagship services (excluding pure physical products which have their own catalog)
  const [services, setServices] = useState<Service[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('ngancare_cached_services');
        localStorage.removeItem('ngancare_cached_services_v2');
        const cached = localStorage.getItem('ngancare_cached_services_v3');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed)) return parsed;
        }
      } catch (e) { }
    }
    return [];
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch(`/api/services?_t=${Date.now()}`, { cache: 'no-store' });
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          const careServices = data.data.filter(
            (s: Service) => s.category !== 'san_pham' && s.is_active === 1
          );
          setServices(careServices);
          try {
            localStorage.setItem('ngancare_cached_services_v3', JSON.stringify(careServices));
          } catch (e) { }
        }
      } catch (e) {
        // Network error
      } finally {
        setIsLoading(false);
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
            <span>{badge}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-charcoal-900 leading-tight text-balance">
            {renderTitle()}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-charcoal-800 text-balance max-w-2xl mx-auto whitespace-pre-line">
            {subtitle}
          </p>
        </div>

        {/* Services Grid (Flagship Healthcare Services) */}
        {isLoading && services.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-gray-500 text-sm">Đang tải danh sách dịch vụ...</p>
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-12 px-6 bg-cream-50 rounded-3xl border border-gold-200 max-w-xl mx-auto shadow-sm">
            <Sparkles className="w-8 h-8 text-gold-500 mx-auto mb-2" />
            <p className="text-charcoal-700 font-medium text-sm">Danh mục dịch vụ đang được cập nhật...</p>
          </div>
        ) : (
          <div className={`grid grid-cols-1 md:grid-cols-2 ${services.length === 3 ? 'lg:grid-cols-3 max-w-6xl mx-auto' : 'lg:grid-cols-4'} gap-6 items-stretch`}>
            {services.map((service, index) => {
              const isPopular = index === 0; // Most requested: Thông tắc tia sữa
              return (
                <div
                  key={service.id}
                  className={`relative rounded-3xl transition-all duration-300 flex flex-col justify-between overflow-hidden ${isPopular
                      ? 'border-2 border-gold-500 shadow-gold-lg bg-cream-50 scale-[1.02]'
                      : 'border border-gold-200 shadow-sm hover:shadow-md bg-white'
                    }`}
                >
                  {/* Popular Badge */}
                  {isPopular && (
                    <div className="bg-gradient-to-r from-gold-600 to-amber-500 text-white text-xs font-bold py-1.5 px-4 text-center uppercase tracking-wider flex items-center justify-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-white" />
                      <span>Dịch Vụ Nổi Bật</span>
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

                      <h3 className="text-lg sm:text-xl font-bold text-charcoal-900 leading-snug text-balance">
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
                          service.features.map((feat, fIdx) => {
                            const isNegative = feat.startsWith('x ') || feat.startsWith('x');
                            const text = feat.replace(/^[x+]\s*/, '');
                            return (
                              <li key={fIdx} className="flex items-start gap-2">
                                {isNegative ? (
                                  <span className="w-4 h-4 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-[10px] font-black flex-shrink-0 mt-0.5">
                                    ✕
                                  </span>
                                ) : (
                                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                                )}
                                <span className={`leading-snug ${isNegative ? 'text-charcoal-700' : 'text-charcoal-900 font-medium'}`}>
                                  {text}
                                </span>
                              </li>
                            );
                          })}
                      </ul>
                    </div>

                    {/* Booking CTA Button */}
                    <a
                      href="#dat-lich"
                      onClick={() => onSelectService && onSelectService(service.id)}
                      className={`w-full py-3 px-4 rounded-xl font-bold text-sm text-center flex items-center justify-center gap-2 transition-all shadow-sm ${isPopular
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
        )}

      </div>
    </section>
  );
}
