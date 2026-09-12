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
  UserCheck,
  Edit3,
  X,
  Save,
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

  // Reschedule / Edit modal state
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [editDate, setEditDate] = useState('');
  const [editTime, setEditTime] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [editStatus, setEditStatus] = useState<BookingStatus>('confirmed');
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [editSuccessMsg, setEditSuccessMsg] = useState<string | null>(null);

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

  // Open Reschedule Modal
  const openEditModal = (b: Booking) => {
    setEditingBooking(b);
    setEditDate(b.booking_date);
    setEditTime(b.booking_time);
    setEditNotes(b.notes || '');
    setEditStatus(b.status === 'cancelled' ? 'confirmed' : b.status);
    setEditSuccessMsg(null);
  };

  // Save Rescheduled Booking
  const handleSaveReschedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBooking) return;
    if (!editDate || !editTime.trim()) {
      alert('Vui lòng điền ngày và giờ hẹn.');
      return;
    }

    setIsSavingEdit(true);
    try {
      const res = await fetch('/api/admin/bookings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingBooking.id,
          status: editStatus,
          booking_date: editDate.trim(),
          booking_time: editTime.trim(),
          notes: editNotes.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setBookings((prev) =>
          prev.map((b) =>
            b.id === editingBooking.id
              ? {
                  ...b,
                  booking_date: editDate.trim(),
                  booking_time: editTime.trim(),
                  notes: editNotes.trim(),
                  status: editStatus,
                }
              : b
          )
        );
        if (selectedDate === editingBooking.booking_date || selectedDate === editDate) {
          fetchDateSlots(selectedDate);
        }
        setEditSuccessMsg(`Đã đổi lịch sang ${editDate} lúc ${editTime} thành công!`);
        setTimeout(() => {
          setEditingBooking(null);
          setEditSuccessMsg(null);
        }, 1000);
      } else {
        alert(data.error || 'Lỗi khi cập nhật lịch hẹn.');
      }
    } catch (err) {
      alert('Lỗi kết nối khi dời lịch hẹn.');
    } finally {
      setIsSavingEdit(false);
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
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300" title="Chưa khóa giờ trên website">
            <Clock className="w-3 h-3 text-amber-600" />
            <span>Chờ Xác Nhận (Chưa Khóa)</span>
          </span>
        );
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300" title="Đã khóa khung giờ này trên website">
            <CheckCircle2 className="w-3 h-3 text-blue-600" />
            <span>Đã Xác Nhận (Đã Khóa Giờ)</span>
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
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700 border border-gray-300" title="Đã giải phóng khung giờ trên website">
            <XCircle className="w-3 h-3" />
            <span>Đã Hủy (Đã Mở Lại Giờ)</span>
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
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center bg-gray-200/80 p-1.5 rounded-2xl w-full sm:w-auto gap-1 sm:gap-0">
            <button
              onClick={() => setActiveTab('bookings')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
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
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
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
            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm mb-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full sm:w-auto px-3 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm text-charcoal-900 bg-white focus:outline-none focus:border-gold-500"
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

            {/* Mechanism explanation alert */}
            <div className="bg-amber-50/80 border border-amber-200 p-3.5 rounded-2xl flex items-start sm:items-center gap-3 text-xs text-amber-900 shadow-xs mb-4">
              <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5 sm:mt-0" />
              <p>
                <strong>Nguyên tắc khóa lịch:</strong> Khách đặt mới ở trạng thái <em>“Chờ xác nhận”</em> sẽ <strong>chưa khóa giờ</strong> trên website. Sau khi Điều Dưỡng liên hệ mẹ bé và bấm nút <strong>“Xác Nhận & Khóa Giờ”</strong>, hệ thống mới chính thức khóa mốc giờ đó trên website để đảm bảo tính linh hoạt và không bị khóa nhầm.
              </p>
            </div>

            {/* 1. GIAO DIỆN DÀNH CHO MOBILE (HIỂN THỊ DẠNG THẺ THÔNG MINH DỄ NHÌN) */}
            <div className="block md:hidden space-y-3.5 mb-6">
              {isLoading ? (
                <div className="bg-white p-8 rounded-2xl border border-gray-200 text-center text-gray-500">
                  <Loader2 className="w-6 h-6 text-gold-500 animate-spin mx-auto mb-2" />
                  <span className="text-xs">Đang tải danh sách lịch hẹn...</span>
                </div>
              ) : filtered.length === 0 ? (
                <div className="bg-white p-8 rounded-2xl border border-gray-200 text-center text-gray-400 text-xs">
                  Chưa có lịch hẹn nào.
                </div>
              ) : (
                filtered.map((b) => (
                  <div
                    key={`mob-${b.id}`}
                    className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm space-y-3"
                  >
                    {/* Header Card: Tên khách + Badge trạng thái */}
                    <div className="flex items-start justify-between gap-2 border-b border-gray-100 pb-2.5">
                      <div>
                        <h3 className="text-sm font-extrabold text-charcoal-900">{b.customer_name}</h3>
                        <p className="text-[10px] text-gray-400 mt-0.5">Mã: #{b.id.slice(0, 8)}</p>
                      </div>
                      <div>{getStatusBadge(b.status)}</div>
                    </div>

                    {/* Nút bấm gọi điện thoại nhanh 1 chạm */}
                    <a
                      href={`tel:${b.customer_phone}`}
                      className="w-full py-2.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 font-bold text-xs flex items-center justify-center gap-2 active:scale-98 transition-all"
                    >
                      <Phone className="w-4 h-4 text-emerald-600" />
                      <span>Gọi trao đổi: <strong className="underline tracking-wide">{b.customer_phone}</strong></span>
                    </a>

                    {/* Dịch vụ & Mốc thời gian */}
                    <div className="bg-cream-50/80 p-3 rounded-xl border border-gold-100 text-xs space-y-1.5">
                      <p className="font-bold text-charcoal-900 flex items-start gap-1.5">
                        <span className="text-gold-600">🩺</span>
                        <span>{b.service_name || 'Tư vấn chăm sóc mẹ và bé'}</span>
                      </p>
                      <p className="flex items-center gap-1.5 text-gold-800 font-extrabold">
                        <Calendar className="w-3.5 h-3.5 text-gold-600" />
                        <span>Ngày {b.booking_date} lúc {b.booking_time}</span>
                      </p>
                    </div>

                    {/* Địa chỉ khách hàng */}
                    <div className="text-xs text-gray-700 bg-gray-50 p-2.5 rounded-xl flex items-start gap-2 leading-relaxed">
                      <span className="text-gray-400">📍</span>
                      <p className="flex-1"><strong className="text-charcoal-900">Địa chỉ:</strong> {b.customer_address}</p>
                    </div>

                    {/* Ghi chú khách hàng */}
                    {b.notes && (
                      <div className="text-xs text-amber-900 bg-amber-50/80 p-2.5 rounded-xl border border-amber-200/60 leading-relaxed italic">
                        <strong>Ghi chú:</strong> “{b.notes}”
                      </div>
                    )}

                    {/* Thao tác xử lý lịch hẹn */}
                    <div className="pt-2 border-t border-gray-100 space-y-2">
                      {b.status === 'pending' && (
                        <button
                          disabled={updatingId === b.id}
                          onClick={() => handleUpdateStatus(b.id, 'confirmed')}
                          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 text-white text-xs font-bold shadow-xs flex items-center justify-center gap-2 active:scale-95 transition-all"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Xác Nhận & Khóa Giờ Trên Web</span>
                        </button>
                      )}

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(b)}
                          className="flex-1 py-2 px-3 rounded-xl border border-amber-300 text-amber-900 bg-amber-50 hover:bg-amber-100 text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-amber-700" />
                          <span>Đổi ngày / giờ</span>
                        </button>

                        <div className="flex-1">
                          <select
                            disabled={updatingId === b.id}
                            value={b.status}
                            onChange={(e) => handleUpdateStatus(b.id, e.target.value as BookingStatus)}
                            className="w-full py-2 px-2 rounded-xl border border-gray-300 text-xs font-semibold focus:outline-none focus:border-gold-500 bg-white"
                          >
                            <option value="pending">Chờ xác nhận</option>
                            <option value="confirmed">Đã xác nhận</option>
                            <option value="completed">Đã hoàn thành</option>
                            <option value="cancelled">Hủy lịch</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* 2. BẢNG DÀNH CHO DESKTOP / IPAD (MÀN HÌNH RỘNG >= 768px) */}
            <div className="hidden md:block bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-gray-50 text-gray-500 uppercase text-[11px] font-bold border-b border-gray-200">
                    <tr>
                      <th className="py-3.5 px-4">Khách Hàng</th>
                      <th className="py-3.5 px-4">Địa Chỉ Phục Vụ</th>
                      <th className="py-3.5 px-4">Dịch Vụ & Thời Gian</th>
                      <th className="py-3.5 px-4">Ghi Chú Yêu Cầu</th>
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
                            <button
                              type="button"
                              onClick={() => openEditModal(b)}
                              className="mt-1 inline-flex items-center gap-1 text-[11px] text-amber-800 hover:text-amber-950 font-bold hover:underline"
                              title="Khách đổi giờ khi gọi trao đổi? Bấm để dời sang ngày/giờ khác"
                            >
                              <Edit3 className="w-3 h-3 text-amber-600" />
                              <span>Đổi ngày / giờ hẹn</span>
                            </button>
                          </td>

                          <td className="py-4 px-4 max-w-xs">
                            <p className="text-gray-600 text-xs italic line-clamp-2">
                              {b.notes ? `“${b.notes}”` : 'Không có ghi chú'}
                            </p>
                          </td>

                          <td className="py-4 px-4">{getStatusBadge(b.status)}</td>

                          <td className="py-4 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {b.status === 'pending' && (
                                <button
                                  disabled={updatingId === b.id}
                                  onClick={() => handleUpdateStatus(b.id, 'confirmed')}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white text-xs font-bold shadow-xs active:scale-95 transition-all whitespace-nowrap"
                                  title="Bấm xác nhận sau khi đã gọi trao đổi với mẹ bé (hệ thống sẽ tự động khóa giờ này trên web)"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>Xác Nhận & Khóa Giờ</span>
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => openEditModal(b)}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-amber-300 text-amber-900 bg-amber-50 hover:bg-amber-100 text-xs font-bold transition-all shadow-xs active:scale-95"
                                title="Đổi ngày hoặc giờ hẹn cho khách"
                              >
                                <Edit3 className="w-3.5 h-3.5 text-amber-700" />
                                <span>Đổi giờ</span>
                              </button>
                              <select
                                disabled={updatingId === b.id}
                                value={b.status}
                                onChange={(e) =>
                                  handleUpdateStatus(b.id, e.target.value as BookingStatus)
                                }
                                className="px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold focus:outline-none focus:border-gold-500 bg-white"
                              >
                                <option value="pending">Chờ xác nhận (Chưa khóa)</option>
                                <option value="confirmed">Đã xác nhận (Đã khóa giờ)</option>
                                <option value="completed">Đã hoàn thành</option>
                                <option value="cancelled">Hủy lịch (Mở lại giờ)</option>
                              </select>
                            </div>
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
            <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span className="font-bold text-amber-900">
                  Chặn Nhanh Khoảng Giờ Bận (Ví dụ có lịch hẹn ngoài hoặc bận riêng):
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <div className="flex items-center gap-1.5">
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
                </div>
                <div className="flex items-center gap-1.5">
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
                </div>
                <button
                  onClick={handleLockRange}
                  className="w-full sm:w-auto px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold transition-colors text-center"
                >
                  Khóa Khoảng Này
                </button>
              </div>
            </div>

            {/* Status Summary Banner */}
            <div
              className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs font-bold ${
                isAllDayBusy
                  ? 'bg-rose-50 border-rose-200 text-rose-800'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-800'
              }`}
            >
              <div className="flex items-center gap-2">
                {isAllDayBusy ? <Lock className="w-4 h-4 flex-shrink-0" /> : <Clock className="w-4 h-4 flex-shrink-0" />}
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
                              bookingOnSlot.status === 'confirmed' ? (
                                <span
                                  className="text-[10px] font-bold text-rose-700 bg-rose-100 border border-rose-200 px-1.5 py-0.5 rounded-full line-clamp-1 flex items-center gap-0.5"
                                  title={`Đã xác nhận cho: ${bookingOnSlot.customer_name} (ĐÃ KHÓA GIỜ)`}
                                >
                                  <Lock className="w-2.5 h-2.5 text-rose-600" />
                                  <span>{bookingOnSlot.customer_name.split(' ').slice(-1)[0]} (Khóa)</span>
                                </span>
                              ) : (
                                <span
                                  className="text-[10px] font-bold text-amber-800 bg-amber-100 border border-amber-300 px-1.5 py-0.5 rounded-full line-clamp-1 flex items-center gap-0.5"
                                  title={`Khách đặt chờ duyệt: ${bookingOnSlot.customer_name} (CHƯA KHÓA GIỜ)`}
                                >
                                  <Clock className="w-2.5 h-2.5 text-amber-600" />
                                  <span>{bookingOnSlot.customer_name.split(' ').slice(-1)[0]} (Chờ)</span>
                                </span>
                              )
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

        {/* ================= RESCHEDULE / EDIT MODAL ================= */}
        {editingBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
            <div className="bg-white rounded-3xl shadow-2xl border border-gold-200 max-w-lg w-full overflow-hidden animate-fade-in">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-white p-5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-5 h-5 text-amber-100" />
                  <div>
                    <h3 className="text-base font-extrabold">Đổi Ngày / Giờ Hẹn Khách</h3>
                    <p className="text-xs text-amber-100 font-medium mt-0.5">
                      Khách hàng: <strong>{editingBooking.customer_name}</strong> ({editingBooking.customer_phone})
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingBooking(null)}
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleSaveReschedule} className="p-6 space-y-4">
                {editSuccessMsg && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>{editSuccessMsg}</span>
                  </div>
                )}

                <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200 text-xs text-amber-900">
                  <p className="text-[11px] text-gray-500">Lịch hẹn hiện tại:</p>
                  <p className="font-bold text-charcoal-900">
                    📅 Ngày {editingBooking.booking_date} lúc ⏰ {editingBooking.booking_time}
                  </p>
                  <p className="text-[11px] text-amber-800 mt-1 italic">
                    💡 Khi lưu lịch mới: Khung giờ cũ ({editingBooking.booking_time}) sẽ <strong>tự động mở trống lại</strong> và khung giờ mới sẽ <strong>được khóa ngay</strong> trên website!
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal-900 mb-1.5">
                    1. Ngày Hẹn Mới:
                  </label>
                  <input
                    type="date"
                    required
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 font-bold text-xs sm:text-sm focus:outline-none focus:border-gold-500 bg-white"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-charcoal-900">
                      2. Khung Giờ Mới:
                    </label>
                    <span className="text-[11px] text-gray-500">Bấm chọn nhanh hoặc gõ giờ tự do:</span>
                  </div>

                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5 mb-2 max-h-36 overflow-y-auto p-2 bg-gray-50 rounded-xl border border-gray-200">
                    {ALL_TIME_SLOTS.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setEditTime(slot)}
                        className={`py-1.5 px-1 rounded-lg text-center text-xs font-bold transition-all ${
                          editTime === slot
                            ? 'bg-amber-600 text-white shadow-xs'
                            : 'bg-white text-gray-700 hover:bg-amber-100 border border-gray-200'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>

                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: 14:30 hoặc 14:30 - 16:00"
                    value={editTime}
                    onChange={(e) => setEditTime(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 font-bold text-xs focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal-900 mb-1.5">
                    3. Ghi Chú Trao Đổi (Tùy chọn):
                  </label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Khách gọi xin dời sang 14:30 chiều..."
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal-900 mb-1.5">
                    4. Trạng Thái Lịch Hẹn:
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as BookingStatus)}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 font-bold text-xs focus:outline-none focus:border-gold-500 bg-white"
                  >
                    <option value="confirmed">Đã xác nhận (Khóa ngay giờ mới trên web)</option>
                    <option value="pending">Chờ xác nhận lại (Chưa khóa giờ)</option>
                  </select>
                </div>

                {/* Modal Actions */}
                <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setEditingBooking(null)}
                    className="px-4 py-2 rounded-xl border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Hủy Bỏ
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingEdit}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
                  >
                    {isSavingEdit ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    <span>Lưu & Cập Nhật Giờ Mới</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
