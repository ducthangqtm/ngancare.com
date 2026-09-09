'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, User, Phone, FileText, CheckCircle2, AlertCircle, Loader2, Sparkles } from 'lucide-react';
import { INITIAL_SERVICES } from '@/lib/seed-data';
import { TIME_SLOT_SECTIONS } from '@/lib/time-slots';

interface BookingFormProps {
  initialServiceId?: string;
}

export default function BookingForm({ initialServiceId }: BookingFormProps) {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [serviceId, setServiceId] = useState(initialServiceId || 'srv-01');

  // Date and Time selection
  const todayStr = new Date().toISOString().split('T')[0];
  const [bookingDate, setBookingDate] = useState<string>(todayStr);
  const [bookingTime, setBookingTime] = useState<string>('09:00');
  const [isCustomTime, setIsCustomTime] = useState(false);
  const [customTimeInput, setCustomTimeInput] = useState('');

  // Slots availability state
  const [busySlots, setBusySlots] = useState<string[]>([]);
  const [isAllDayBusy, setIsAllDayBusy] = useState(false);
  const [slotsLoading, setSlotsLoading] = useState(false);

  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Service list for dropdown
  const [serviceOptions, setServiceOptions] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('ngancare_cached_services');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {}
    }
    return INITIAL_SERVICES.filter((s) => s.category !== 'san_pham' && s.is_active === 1);
  });

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch('/api/services');
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          const medicalServices = data.data.filter(
            (s: any) => s.category !== 'san_pham' && s.is_active === 1
          );
          setServiceOptions(medicalServices);
          try {
            localStorage.setItem('ngancare_cached_services', JSON.stringify(medicalServices));
          } catch (e) {}
        }
      } catch (e) {
        // Fallback
      }
    };
    fetchServices();
  }, []);

  // Fetch slots availability whenever bookingDate changes
  useEffect(() => {
    if (!bookingDate) return;
    const fetchSlots = async () => {
      setSlotsLoading(true);
      try {
        const res = await fetch(`/api/slots?date=${bookingDate}&_t=${Date.now()}`, {
          cache: 'no-store',
        });
        const data = await res.json();
        if (data.success) {
          setBusySlots(data.busySlots || []);
          setIsAllDayBusy(data.isAllDayBusy || false);
        }
      } catch (e) {
        // error
      } finally {
        setSlotsLoading(false);
      }
    };
    fetchSlots();
  }, [bookingDate]);

  const isSlotBusy = (slot: string) => {
    if (!busySlots || busySlots.length === 0) return false;
    if (busySlots.includes(slot)) return true;
    for (const b of busySlots) {
      if (!b) continue;
      if (b === slot) return true;
      const times = b.match(/\b\d{1,2}[:hH]\d{2}\b/g);
      if (times && times.length >= 2) {
        const norm = (t: string) => {
          const p = t.replace(/[hH]/, ':').split(':');
          return `${p[0].padStart(2, '0')}:${(p[1] || '00').padStart(2, '0')}`;
        };
        const start = norm(times[0]);
        const end = norm(times[1]);
        if (slot >= start && slot <= end) return true;
      } else if (times && times.length === 1) {
        const p = times[0].replace(/[hH]/, ':').split(':');
        const norm = `${p[0].padStart(2, '0')}:${(p[1] || '00').padStart(2, '0')}`;
        if (slot === norm) return true;
      }
      if (b.includes(slot)) return true;
    }
    return false;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Basic validation
    if (!customerName.trim() || !customerPhone.trim() || !customerAddress.trim() || !bookingDate) {
      setErrorMessage('Vui lòng điền đầy đủ Họ tên, Số điện thoại, Địa chỉ và Ngày hẹn.');
      return;
    }

    if (!/^[0-9+() -]{9,15}$/.test(customerPhone.trim())) {
      setErrorMessage('Số điện thoại không hợp lệ. Vui lòng kiểm tra lại.');
      return;
    }

    const finalTime = isCustomTime ? customTimeInput.trim() : bookingTime;
    if (!finalTime) {
      setErrorMessage('Vui lòng chọn khung giờ hoặc điền giờ hẹn mong muốn.');
      return;
    }

    if (!isCustomTime && isSlotBusy(finalTime)) {
      setErrorMessage(`Khung giờ ${finalTime} ngày ${bookingDate} hiện đã kín lịch. Vui lòng chọn khung giờ khác hoặc liên hệ hotline.`);
      return;
    }

    if (isAllDayBusy && finalTime !== 'Càng sớm càng tốt (Cấp cứu)') {
      setErrorMessage(`Ngày ${bookingDate} Điều dưỡng Thúy Ngân hiện đã kín lịch. Vui lòng chọn ngày khác hoặc liên hệ hotline.`);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: customerName.trim(),
          customer_phone: customerPhone.trim(),
          customer_address: customerAddress.trim(),
          service_id: serviceId,
          booking_date: bookingDate,
          booking_time: finalTime,
          notes: notes.trim(),
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccess(true);
      } else {
        setErrorMessage(data.error || 'Có lỗi xảy ra khi đặt lịch. Vui lòng liên hệ trực tiếp hotline.');
      }
    } catch (err: any) {
      setErrorMessage('Không thể kết nối đến máy chủ. Vui lòng gọi trực tiếp hotline để được hỗ trợ tức thì.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="dat-lich" className="py-16 sm:py-20 bg-gradient-to-b from-white via-cream-100 to-cream-200 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gold-100 border border-gold-300 text-gold-800 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-gold-600" />
            <span>Chăm Sóc Tận Nhà Theo Yêu Cầu</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-charcoal-900">
            Đặt Lịch Chăm Sóc <span className="gold-gradient-text">Mẹ & Bé Tại Nhà</span>
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-charcoal-800 max-w-xl mx-auto">
            Điền thông tin bên dưới để Điều dưỡng Thúy Ngân sắp xếp lịch hẹn và chuẩn bị dụng cụ y tế chu đáo nhất cho gia đình bạn.
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gold-300 shadow-xl relative overflow-hidden">
          
          {success ? (
            <div className="text-center py-10 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce-gentle">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-charcoal-900">
                Đặt Lịch Hẹn Thành Công!
              </h3>
              <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
                Cảm ơn mẹ đã tin tưởng <strong>Ngân Care</strong>. Điều dưỡng Nguyễn Thúy Ngân sẽ gọi điện thoại xác nhận trong vòng <strong>5 - 10 phút</strong> để tư vấn cụ thể và khởi hành đến nhà mẹ.
              </p>
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href="tel:0339627769"
                  className="px-6 py-2.5 rounded-full bg-emergency-500 hover:bg-emergency-600 text-white font-bold text-sm shadow-md"
                >
                  Cần Gấp? Gọi Ngay: 0339.627.769
                </a>
                <button
                  onClick={() => {
                    setSuccess(false);
                    setCustomerName('');
                    setCustomerPhone('');
                    setCustomerAddress('');
                    setNotes('');
                  }}
                  className="px-6 py-2.5 rounded-full bg-cream-200 hover:bg-gold-200 text-charcoal-900 font-semibold text-sm transition-colors"
                >
                  Đặt Lịch Thêm Buổi Khác
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {errorMessage && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-start gap-2.5">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Customer Name */}
                <div>
                  <label className="block text-xs font-bold text-charcoal-900 mb-1.5 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-gold-600" />
                    <span>Họ Và Tên Mẹ / Người Đặt Lịch *</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Nguyễn Thị Mai Lan"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-gold-500 focus:ring-2 focus:ring-gold-200 outline-none text-sm text-charcoal-900 bg-cream-50/50"
                  />
                </div>

                {/* Customer Phone */}
                <div>
                  <label className="block text-xs font-bold text-charcoal-900 mb-1.5 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-gold-600" />
                    <span>Số Điện Thoại Nhận Cuộc Gọi *</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="Ví dụ: 0339627769"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-gold-500 focus:ring-2 focus:ring-gold-200 outline-none text-sm text-charcoal-900 bg-cream-50/50"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-xs font-bold text-charcoal-900 mb-1.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-gold-600" />
                  <span>Địa Chỉ Phục Vụ Tại Nhà (Số nhà, Ngõ, Tòa chung cư, Phường/Xã) *</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Số 25 Ngõ 90 Nguyễn Văn Cừ / Căn hộ Landmark 1, Vinhomes..."
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-gold-500 focus:ring-2 focus:ring-gold-200 outline-none text-sm text-charcoal-900 bg-cream-50/50"
                />
              </div>

              {/* Service Selection */}
              <div>
                <label className="block text-xs font-bold text-charcoal-900 mb-1.5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-gold-600" />
                  <span>Chọn Gói Dịch Vụ Cần Chăm Sóc *</span>
                </label>
                <select
                  value={serviceId}
                  onChange={(e) => setServiceId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-gold-500 focus:ring-2 focus:ring-gold-200 outline-none text-sm text-charcoal-900 bg-cream-50/50"
                >
                  {serviceOptions.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.price ? s.price.toLocaleString('vi-VN') + 'đ' : 'Báo giá'})
                    </option>
                  ))}
                  <option value="other">Gói kết hợp khác / Cần tư vấn thêm</option>
                </select>
              </div>

              {/* Date and Time Selection Section */}
              <div className="pt-2 border-t border-gold-200/60 space-y-4">
                {/* 1. Date Picker */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <label className="text-xs font-bold text-charcoal-900 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-gold-600" />
                    <span>1. Ngày Mong Muốn Đến *</span>
                  </label>
                  <input
                    type="date"
                    required
                    min={todayStr}
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full sm:w-60 px-4 py-2 rounded-xl border border-gray-300 font-bold text-sm text-charcoal-900 bg-cream-50 focus:border-gold-500 outline-none"
                  />
                </div>

                {/* All-Day Busy Alert */}
                {isAllDayBusy ? (
                  <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">Ngày {bookingDate}: Điều dưỡng Thúy Ngân đã kín lịch / nghỉ cả ngày.</p>
                      <p className="mt-0.5 text-[11px] text-rose-700">
                        Mẹ vui lòng đổi sang ngày khác. Nếu mẹ đang bị tắc tia sữa sốt cương đau khẩn cấp, hãy gọi trực tiếp hotline{' '}
                        <a href="tel:0339627769" className="font-bold underline text-rose-900">0339.627.769</a> để được hỗ trợ cấp cứu.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div>
                    {/* Time Selection Header */}
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold text-charcoal-900 flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-gold-600" />
                        <span>2. Chọn Mốc Giờ Hoặc Điền Giờ Tự Do *</span>
                      </label>
                      <span className="text-[11px] text-gray-500 font-normal">
                        {slotsLoading ? 'Đang kiểm tra...' : '🟢 Trống • 🔒 Đã kín'}
                      </span>
                    </div>

                    {/* Emergency ASAP Option */}
                    <div className="mb-3">
                      <button
                        type="button"
                        onClick={() => {
                          setIsCustomTime(false);
                          setBookingTime('Càng sớm càng tốt (Cấp cứu)');
                        }}
                        className={`w-full py-2.5 px-4 rounded-2xl border text-xs font-bold transition-all flex items-center justify-between ${
                          !isCustomTime && bookingTime === 'Càng sớm càng tốt (Cấp cứu)'
                            ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white border-red-600 shadow-md scale-[1.01]'
                            : 'bg-rose-50/70 hover:bg-rose-100 text-red-700 border-rose-200'
                        }`}
                      >
                        <span className="flex items-center gap-1.5">
                          <span>🚨</span>
                          <span>Càng Sớm Càng Tốt (Cấp Cứu Tắc Tia / Sốt Cương Vú)</span>
                        </span>
                        <span className="text-[10px] uppercase tracking-wide bg-white/30 px-2 py-0.5 rounded-full font-black">
                          Ưu Tiên Số 1
                        </span>
                      </button>
                    </div>

                    {/* 30-Minute Slot Sections: Morning, Afternoon, Evening */}
                    <div className="space-y-2.5">
                      {TIME_SLOT_SECTIONS.map((sec) => (
                        <div key={sec.title} className="bg-cream-50/50 p-2.5 rounded-2xl border border-gold-100">
                          <span className="text-[11px] font-extrabold text-charcoal-800 uppercase tracking-wider mb-2 block">
                            {sec.icon} {sec.title}
                          </span>
                          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-1.5">
                            {sec.slots.map((slot) => {
                              const isBusy = isSlotBusy(slot);
                              const isSelected = !isCustomTime && bookingTime === slot;

                              return (
                                <button
                                  key={slot}
                                  type="button"
                                  disabled={isBusy}
                                  onClick={() => {
                                    if (isBusy) return;
                                    setIsCustomTime(false);
                                    setBookingTime(slot);
                                  }}
                                  className={`py-2 px-1 rounded-xl text-center text-xs font-bold transition-all ${
                                    isBusy
                                      ? 'bg-rose-50/80 text-rose-400 border border-rose-200 cursor-not-allowed line-through opacity-75'
                                      : isSelected
                                      ? 'bg-gold-500 text-white shadow-gold-soft border border-gold-500 scale-105'
                                      : 'bg-white hover:bg-gold-50 text-charcoal-900 border border-gray-200 hover:border-gold-300 shadow-xs'
                                  }`}
                                >
                                  <span>{slot}</span>
                                  {isBusy && (
                                    <span className="block text-[8px] no-underline font-extrabold text-rose-600">
                                      🔒 Kín
                                    </span>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Custom Flexible Time Option */}
                    <div className="mt-3 p-3 rounded-2xl border border-dashed border-gold-300 bg-white">
                      <div className="flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => {
                            setIsCustomTime(true);
                            if (!customTimeInput) setCustomTimeInput('17:15');
                          }}
                          className={`text-xs font-bold flex items-center gap-2 transition-colors ${
                            isCustomTime ? 'text-gold-700' : 'text-gray-600 hover:text-charcoal-900'
                          }`}
                        >
                          <span
                            className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] ${
                              isCustomTime ? 'border-gold-500 bg-gold-500 text-white font-black' : 'border-gray-400'
                            }`}
                          >
                            {isCustomTime && '✓'}
                          </span>
                          <span>🕒 Giờ khác / Ghi chú giờ tự do (Ví dụ: 08:45, sau 17h khi chồng về...)</span>
                        </button>
                      </div>

                      {isCustomTime && (
                        <div className="mt-2.5 pt-2.5 border-t border-gold-100 flex flex-col sm:flex-row items-center gap-2">
                          <input
                            type="text"
                            placeholder="Nhập giờ mong muốn (VD: 08:45 sáng, sau 17h15...)"
                            value={customTimeInput}
                            onChange={(e) => setCustomTimeInput(e.target.value)}
                            className="w-full sm:flex-1 px-3.5 py-2 rounded-xl border border-gold-400 focus:ring-2 focus:ring-gold-200 outline-none text-xs text-charcoal-900 font-medium bg-cream-50/50"
                          />
                          <span className="text-[11px] text-gray-500 italic">
                            Điều dưỡng Thúy Ngân sẽ gọi lại xác nhận ngay!
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Selected Time Indicator */}
                    <div className="mt-2 text-xs text-gray-600 flex items-center gap-1.5">
                      <span>Khung giờ đã chọn:</span>
                      <strong className="text-gold-700 font-black text-sm">
                        {isCustomTime ? (customTimeInput || 'Chưa điền giờ') : bookingTime}
                      </strong>
                    </div>
                  </div>
                )}
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-charcoal-900 mb-1.5 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-gold-600" />
                  <span>Mô Tả Tình Trạng Hiện Tại Của Mẹ Hoặc Bé (Tùy chọn)</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Ví dụ: Ngực phải bị nổi cục cứng đau nhức từ tối qua, bé sinh được 6 ngày chưa rụng rốn, mẹ sinh mổ còn đau lưng..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-gold-500 focus:ring-2 focus:ring-gold-200 outline-none text-sm text-charcoal-900 bg-cream-50/50"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-xl bg-gold-500 hover:bg-gold-600 text-white font-bold text-base shadow-gold-soft hover:shadow-gold-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 active:scale-[0.99]"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Đang Xử Lý Gửi Đặt Lịch...</span>
                    </>
                  ) : (
                    <>
                      <Calendar className="w-5 h-5" />
                      <span>Xác Nhận Đặt Lịch Hẹn Ngay</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-center text-[11px] text-gray-500">
                🔒 Thông tin của mẹ được bảo mật tuyệt đối. Cam kết không làm phiền khi không có yêu cầu.
              </p>

            </form>
          )}

        </div>

      </div>
    </section>
  );
}
