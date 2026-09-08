'use client';

import React, { useState } from 'react';
import { Calendar, Clock, MapPin, User, Phone, FileText, CheckCircle2, AlertCircle, Loader2, Sparkles } from 'lucide-react';
import { INITIAL_SERVICES } from '@/lib/seed-data';

interface BookingFormProps {
  initialServiceId?: string;
}

export default function BookingForm({ initialServiceId }: BookingFormProps) {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [serviceId, setServiceId] = useState(initialServiceId || 'srv-01');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('09:00');
  const [notes, setNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Service list for dropdown
  const [serviceOptions, setServiceOptions] = useState(
    INITIAL_SERVICES.filter((s) => s.category !== 'san_pham')
  );

  React.useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch('/api/services');
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          const medicalServices = data.data.filter(
            (s: any) => s.category !== 'san_pham' && s.is_active === 1
          );
          setServiceOptions(medicalServices);
        }
      } catch (e) {
        // Fallback
      }
    };
    fetchServices();
  }, []);

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
          booking_time: bookingTime,
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
                  <span>Địa Chỉ Tại Long Biên hoặc Gia Lâm (Số nhà, Ngõ, Tòa chung cư, Phường/Xã) *</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Số 25 Ngõ 90 Thượng Thanh, Long Biên / Căn hộ S2.05 Vinhomes Ocean Park, Gia Lâm..."
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Booking Date */}
                <div>
                  <label className="block text-xs font-bold text-charcoal-900 mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-gold-600" />
                    <span>Ngày Mong Muốn Đến *</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-gold-500 focus:ring-2 focus:ring-gold-200 outline-none text-sm text-charcoal-900 bg-cream-50/50"
                  />
                </div>

                {/* Booking Time */}
                <div>
                  <label className="block text-xs font-bold text-charcoal-900 mb-1.5 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-gold-600" />
                    <span>Khung Giờ Đón Tiếp *</span>
                  </label>
                  <select
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-gold-500 focus:ring-2 focus:ring-gold-200 outline-none text-sm text-charcoal-900 bg-cream-50/50"
                  >
                    <option value="Càng sớm càng tốt (Cấp cứu)">Càng sớm càng tốt (Cấp cứu)</option>
                    <option value="08:00 - 09:30">08:00 - 09:30</option>
                    <option value="09:30 - 11:00">09:30 - 11:00</option>
                    <option value="11:00 - 12:30">11:00 - 12:30</option>
                    <option value="14:00 - 15:30">14:00 - 15:30</option>
                    <option value="15:30 - 17:00">15:30 - 17:00</option>
                    <option value="17:00 - 19:00">17:00 - 19:00</option>
                    <option value="Sau 19:00 (Buổi tối)">Sau 19:00 (Buổi tối)</option>
                  </select>
                </div>
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
