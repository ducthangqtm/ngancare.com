'use client';

import React, { useState, useEffect } from 'react';
import AdminNav from '@/components/AdminNav';
import {
  Calendar,
  Phone,
  CheckCircle2,
  Clock,
  XCircle,
  Search,
  Filter,
  Loader2,
  Lock,
  Unlock,
  AlertCircle,
  Sparkles,
  ChevronRight,
  UserCheck
} from 'lucide-react';
import { Booking, BookingStatus } from '@/lib/types';
import { TIME_SLOT_SECTIONS, ALL_TIME_SLOTS } from '@/lib/time-slots';

export default function AdminBookingsPage() {
  const [activeTab, setActiveTab] = useState<'bookings' | 'slots'>('bookings');

  // Bookings list state
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Time slots management state
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [busySlots, setBusySlots] = useState<string[]>([]);
  const [isAllDayBusy, setIsAllDayBusy] = useState(false);
  const [dateBookings, setDateBookings] = useState<any[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsMsg, setSlotsMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Quick range blocker state
  const [rangeStart, setRangeStart] = useState('08:00');
  const [rangeEnd, setRangeEnd] = useState('11:00');

  useEffect(() => {
    // Fetch live bookings
    const fetchBookings = async () => {
      try {
        const res = await fetch('/api/admin/bookings');
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          setBookings(data.data);
        }
      } catch (e) {
        // error
      } finally {
        setIsLoading(false);
      }
    };
    fetchBookings();
  }, []);

  // Fetch busy slots when selected date changes or tab switched to 'slots'
  const fetchDateSlots = async (date: string) => {
    setSlotsLoading(true);
    setSlotsMsg(null);
    try {
      const res = await fetch(`/api/admin/slots?date=${date}`);
      const data = await res.json();
      if (data.success) {
        setBusySlots(data.busySlots || []);
        setIsAllDayBusy(data.isAllDayBusy || false);
        setDateBookings(data.bookings || []);
      }
    } catch (e) {
      setSlotsMsg({ text: 'Lỗi khi tải lịch làm việc của ngày này.', type: 'error' });
    } finally {
      setSlotsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'slots') {
      fetchDateSlots(selectedDate);
    }
  }, [selectedDate, activeTab]);

  const handleUpdateStatus = async (id: string, newStatus: BookingStatus) => {
    setUpdatingId(id);
    try {
      const res = await fetch('/api/admin/bookings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setBookings((prev) =>
          prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
        );
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUpdatingId(null);
    }
  };

  // Toggle single time slot
  const handleToggleSlot = async (timeSlot: string) => {
    setSlotsMsg(null);
    try {
      const res = await fetch('/api/admin/slots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'toggle',
          date: selectedDate,
          time_slot: timeSlot,
        }),
      });
      const data = await res.json();
      if (data.success) {
        if (data.status === 'locked') {
          setBusySlots((prev) => [...prev, timeSlot]);
        } else {
          setBusySlots((prev) => prev.filter((s) => s !== timeSlot));
        }
      }
    } catch (e) {
      setSlotsMsg({ text: 'Lỗi cập nhật mốc giờ.', type: 'error' });
    }
  };

  // Toggle all day
  const handleToggleAllDay = async () => {
    setSlotsMsg(null);
    try {
      const res = await fetch('/api/admin/slots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'toggle_all_day',
          date: selectedDate,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setIsAllDayBusy(data.isAllDayBusy);
        if (data.isAllDayBusy) {
          setSlotsMsg({ text: `Đã khóa toàn bộ ngày ${selectedDate}! Khách sẽ không thể đặt lịch hôm nay.`, type: 'success' });
        } else {
          setSlotsMsg({ text: `Đã mở lại ngày ${selectedDate}.`, type: 'success' });
        }
      }
    } catch (e) {
      setSlotsMsg({ text: 'Lỗi khóa cả ngày.', type: 'error' });
    }
  };

  // Lock range of slots
  const handleLockRange = async () => {
    if (rangeStart >= rangeEnd) {
      setSlotsMsg({ text: 'Giờ bắt đầu phải sớm hơn giờ kết thúc.', type: 'error' });
      return;
    }
    const slotsInRange = ALL_TIME_SLOTS.filter((s) => s >= rangeStart && s <= rangeEnd);
    if (slotsInRange.length === 0) return;

    try {
      const res = await fetch('/api/admin/slots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'lock_batch',
          date: selectedDate,
          slots: slotsInRange,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setBusySlots((prev) => Array.from(new Set([...prev, ...slotsInRange])));
        setSlotsMsg({ text: `Đã khóa ${slotsInRange.length} mốc giờ từ ${rangeStart} đến ${rangeEnd}!`, type: 'success' });
      }
    } catch (e) {
      setSlotsMsg({ text: 'Lỗi khóa khoảng giờ.', type: 'error' });
    }
  };

  // Unlock all slots for the date
  const handleUnlockAll = async () => {
    try {
      const res = await fetch('/api/admin/slots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'unlock_all',
          date: selectedDate,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setBusySlots([]);
        setIsAllDayBusy(false);
        setSlotsMsg({ text: `Đã mở trống lại toàn bộ mốc giờ của ngày ${selectedDate}!`, type: 'success' });
      }
    } catch (e) {
      setSlotsMsg({ text: 'Lỗi mở lại lịch.', type: 'error' });
    }
  };

  const filtered = bookings.filter((b) => {
    const matchStatus = filterStatus === 'all' || b.status === filterStatus;
    const matchSearch =
      !searchTerm ||
      b.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.customer_phone.includes(searchTerm) ||
      b.customer_address.toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchSearch;
  });

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
            <Clock className="w-3 h-3" />
            <span>Chờ Xác Nhận</span>
          </span>
        );
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300">
            <CheckCircle2 className="w-3 h-3" />
            <span>Đã Xác Nhận</span>
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3 h-3" />
            <span>Đã Hoàn Thành</span>
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700 border border-gray-300">
            <XCircle className="w-3 h-3" />
            <span>Đã Hủy</span>
          </span>
        );
      default:
        return null;
    }
  };

  const getQuickDate = (offsetDays: number) => {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    return d.toISOString().split('T')[0];
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <AdminNav />

      <main className="flex-1 p-4 sm:p-8 max-w-7xl overflow-x-auto">
        {/* Page Header */}
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900">
              Quản Lý Lịch Hẹn & Giờ Trống
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Theo dõi lịch khách đặt và chủ động quản lý các khung giờ bận / rảnh của Thúy Ngân.
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center bg-gray-200/80 p-1.5 rounded-2xl">
            <button
              onClick={() => setActiveTab('bookings')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                activeTab === 'bookings'
                  ? 'bg-white text-charcoal-900 shadow-sm'
                  : 'text-gray-600 hover:text-charcoal-900'
              }`}
            >
              <Calendar className="w-4 h-4 text-gold-600" />
              <span>📋 Danh Sách Khách Đặt</span>
              <span className="bg-gold-100 text-gold-800 text-[11px] px-2 py-0.5 rounded-full font-black">
                {bookings.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('slots')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                activeTab === 'slots'
                  ? 'bg-gold-500 text-white shadow-gold-soft'
                  : 'text-gray-600 hover:text-charcoal-900'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>⏰ Lịch Làm Việc & Giờ Trống</span>
            </button>
          </div>
        </div>

        {/* ================= TAB 1: DANH SÁCH LỊCH HẸN ================= */}
        {activeTab === 'bookings' && (
          <div>
            {/* Toolbar */}
            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm text-charcoal-900 bg-white focus:outline-none focus:border-gold-500"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="pending">Chờ xác nhận</option>
                  <option value="confirmed">Đã xác nhận</option>
                  <option value="completed">Đã hoàn thành</option>
                  <option value="cancelled">Đã hủy</option>
                </select>
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Tìm theo tên, SĐT, địa chỉ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:border-gold-500"
                />
              </div>
            </div>

            {/* Table of Bookings */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-gray-50 text-gray-500 uppercase text-[11px] font-bold border-b border-gray-200">
                    <tr>
                      <th className="py-3.5 px-4">Khách Hàng</th>
                      <th className="py-3.5 px-4">Địa Chỉ Phục Vụ</th>
                      <th className="py-3.5 px-4">Dịch Vụ & Thời Gian</th>
                      <th className="py-3.5 px-4">Ghi Chú Y Tế</th>
                      <th className="py-3.5 px-4">Trạng Thái</th>
                      <th className="py-3.5 px-4 text-right">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {isLoading ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-gray-500">
                          <div className="flex items-center justify-center gap-2">
                            <Loader2 className="w-5 h-5 text-gold-500 animate-spin" />
                            <span>Đang đồng bộ dữ liệu lịch hẹn từ hệ thống...</span>
                          </div>
                        </td>
                      </tr>
                    ) : filtered.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-gray-400">
                          Chưa có lịch hẹn nào.
                        </td>
                      </tr>
                    ) : (
                      filtered.map((b) => (
                        <tr key={b.id} className="hover:bg-cream-50/60 transition-colors">
                          <td className="py-4 px-4">
                            <p className="font-bold text-charcoal-900">{b.customer_name}</p>
                            <a
                              href={`tel:${b.customer_phone}`}
                              className="inline-flex items-center gap-1 text-gold-700 font-semibold hover:underline mt-0.5"
                            >
                              <Phone className="w-3 h-3" />
                              <span>{b.customer_phone}</span>
                            </a>
                          </td>

                          <td className="py-4 px-4 max-w-xs">
                            <p className="text-gray-700 text-xs line-clamp-2">{b.customer_address}</p>
                          </td>

                          <td className="py-4 px-4">
                            <p className="font-semibold text-charcoal-900 text-xs">
                              {b.service_name || 'Tư vấn mẹ bé'}
                            </p>
                            <p className="text-gray-500 text-[11px] mt-0.5 flex items-center gap-1 font-medium">
                              <Calendar className="w-3 h-3 text-gold-600" />
                              <span>
                                {b.booking_date} lúc <strong>{b.booking_time}</strong>
                              </span>
                            </p>
                          </td>

                          <td className="py-4 px-4 max-w-xs">
                            <p className="text-gray-600 text-xs italic line-clamp-2">
                              {b.notes ? `“${b.notes}”` : 'Không có ghi chú'}
                            </p>
                          </td>

                          <td className="py-4 px-4">{getStatusBadge(b.status)}</td>

                          <td className="py-4 px-4 text-right">
                            <select
                              disabled={updatingId === b.id}
                              value={b.status}
                              onChange={(e) =>
                                handleUpdateStatus(b.id, e.target.value as BookingStatus)
                              }
                              className="px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold focus:outline-none focus:border-gold-500 bg-white"
                            >
                              <option value="pending">Chờ xác nhận</option>
                              <option value="confirmed">Đã xác nhận</option>
                              <option value="completed">Đã hoàn thành</option>
                              <option value="cancelled">Hủy lịch</option>
                            </select>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: QUẢN LÝ GIỜ TRỐNG / KÍN LỊCH ================= */}
        {activeTab === 'slots' && (
          <div className="space-y-6">
            {/* Notification alert */}
            {slotsMsg && (
              <div
                className={`p-3.5 rounded-2xl text-xs flex items-center gap-2.5 shadow-sm ${
                  slotsMsg.type === 'success'
                    ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                    : 'bg-red-50 border border-red-200 text-red-800'
                }`}
              >
                {slotsMsg.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
                )}
                <span className="font-semibold">{slotsMsg.text}</span>
              </div>
            )}

            {/* Date Selector & Quick Actions */}
            <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              {/* Date picker */}
              <div className="flex flex-wrap items-center gap-3">
                <label className="text-xs font-bold text-charcoal-900 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-gold-600" />
                  <span>Chọn Ngày Làm Việc:</span>
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-3.5 py-2 rounded-xl border border-gray-300 font-bold text-xs sm:text-sm text-charcoal-900 bg-cream-50 focus:border-gold-500 outline-none"
                />

                {/* Quick Date Presets */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setSelectedDate(getQuickDate(0))}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      selectedDate === getQuickDate(0)
                        ? 'bg-gold-500 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    Hôm Nay
                  </button>
                  <button
                    onClick={() => setSelectedDate(getQuickDate(1))}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      selectedDate === getQuickDate(1)
                        ? 'bg-gold-500 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    Ngày Mai
                  </button>
                  <button
                    onClick={() => setSelectedDate(getQuickDate(2))}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      selectedDate === getQuickDate(2)
                        ? 'bg-gold-500 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    Ngày Kia
                  </button>
                </div>
              </div>

              {/* All-Day Lock Button & Reset */}
              <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
                <button
                  onClick={handleToggleAllDay}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                    isAllDayBusy
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                      : 'bg-rose-500 hover:bg-rose-600 text-white shadow-sm'
                  }`}
                >
                  {isAllDayBusy ? (
                    <>
                      <Unlock className="w-4 h-4" />
                      <span>Mở Lại Nhận Khách Cả Ngày</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Bận / Khóa Cả Ngày Hôm Nay</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleUnlockAll}
                  className="px-3.5 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 text-xs font-semibold"
                >
                  Mở Lại Tất Cả Giờ
                </button>
              </div>
            </div>

            {/* Quick Range Blocker Panel */}
            <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span className="font-bold text-amber-900">
                  Chặn Nhanh Khoảng Giờ Bận (Ví dụ có lịch hẹn ngoài hoặc bận riêng):
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span>Từ:</span>
                <select
                  value={rangeStart}
                  onChange={(e) => setRangeStart(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg border border-amber-300 bg-white font-semibold outline-none text-xs"
                >
                  {ALL_TIME_SLOTS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <span>Đến:</span>
                <select
                  value={rangeEnd}
                  onChange={(e) => setRangeEnd(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg border border-amber-300 bg-white font-semibold outline-none text-xs"
                >
                  {ALL_TIME_SLOTS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleLockRange}
                  className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold transition-colors"
                >
                  Khóa Khoảng Này
                </button>
              </div>
            </div>

            {/* Status Summary Banner */}
            <div
              className={`p-4 rounded-2xl border flex items-center justify-between text-xs font-bold ${
                isAllDayBusy
                  ? 'bg-rose-50 border-rose-200 text-rose-800'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-800'
              }`}
            >
              <div className="flex items-center gap-2">
                {isAllDayBusy ? <Lock className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                <span>
                  Ngày {selectedDate}:{' '}
                  {isAllDayBusy
                    ? 'ĐANG NGHỈ / KHÓA CẢ NGÀY (Khách không thể đặt lịch bất kỳ giờ nào).'
                    : `ĐANG NHẬN KHÁCH (${busySlots.length} mốc giờ đã kín, ${
                        ALL_TIME_SLOTS.length - busySlots.length
                      } mốc giờ còn trống).`}
                </span>
              </div>
              <span className="text-[11px] text-gray-500 font-normal">
                👉 Chạm vào từng mốc giờ bên dưới để bật/tắt (Xanh = Trống, Đỏ = Kín)
              </span>
            </div>

            {/* Time Slot Sections: Morning, Afternoon, Evening */}
            {slotsLoading ? (
              <div className="bg-white p-12 rounded-3xl border border-gray-200 text-center">
                <Loader2 className="w-6 h-6 text-gold-500 animate-spin mx-auto mb-2" />
                <p className="text-xs text-gray-500">Đang tải lịch của ngày {selectedDate}...</p>
              </div>
            ) : (
              <div className="space-y-6">
                {TIME_SLOT_SECTIONS.map((sec) => (
                  <div
                    key={sec.title}
                    className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm"
                  >
                    <h3 className="text-xs font-extrabold text-charcoal-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <span>{sec.icon}</span>
                      <span>{sec.title}</span>
                    </h3>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-3">
                      {sec.slots.map((slot) => {
                        const isBusy = isAllDayBusy || busySlots.includes(slot);
                        // Check if there is an existing booking on this slot
                        const bookingOnSlot = dateBookings.find(
                          (b) => b.booking_time === slot && b.status !== 'cancelled'
                        );

                        return (
                          <button
                            key={slot}
                            disabled={isAllDayBusy}
                            onClick={() => handleToggleSlot(slot)}
                            className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-between gap-1 group active:scale-95 ${
                              isBusy
                                ? 'bg-rose-50 border-rose-300 text-rose-900 hover:bg-rose-100 shadow-xs'
                                : 'bg-white border-emerald-300 hover:border-emerald-500 text-charcoal-900 shadow-xs hover:shadow-md'
                            } ${isAllDayBusy ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                          >
                            <span className="text-sm font-black tracking-tight">{slot}</span>

                            {bookingOnSlot ? (
                              <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded-full line-clamp-1 flex items-center gap-0.5">
                                <UserCheck className="w-2.5 h-2.5" />
                                <span>{bookingOnSlot.customer_name.split(' ').slice(-1)[0]}</span>
                              </span>
                            ) : isBusy ? (
                              <span className="text-[10px] font-bold text-rose-600 flex items-center gap-0.5">
                                <Lock className="w-2.5 h-2.5" />
                                <span>ĐÃ KÍN</span>
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                                <span>TRỐNG</span>
                              </span>
                            )}

                            <span className="text-[9px] text-gray-400 group-hover:text-gray-700">
                              {isBusy ? 'Chạm để mở' : 'Chạm để khóa'}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
