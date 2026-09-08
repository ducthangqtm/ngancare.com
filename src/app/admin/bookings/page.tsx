'use client';

import React, { useState, useEffect } from 'react';
import AdminNav from '@/components/AdminNav';
import { Calendar, Phone, MapPin, CheckCircle2, Clock, XCircle, Search, Filter, Loader2, AlertCircle } from 'lucide-react';
import { Booking, BookingStatus } from '@/lib/types';
import { INITIAL_BOOKINGS } from '@/lib/seed-data';

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <AdminNav />

      <main className="flex-1 p-6 sm:p-10 max-w-7xl overflow-x-auto">
        <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-charcoal-900">Quản Lý Lịch Hẹn Chăm Sóc</h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Theo dõi danh sách khách hàng đặt lịch trực tuyến, liên hệ tư vấn và cập nhật trạng thái.
            </p>
          </div>
          <div className="text-xs text-gray-500">
            Tổng cộng: <strong className="text-charcoal-900">{isLoading ? '...' : filtered.length}</strong> lịch hẹn
          </div>
        </div>

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
                      <p className="font-semibold text-charcoal-900 text-xs">{b.service_name || 'Tư vấn mẹ bé'}</p>
                      <p className="text-gray-500 text-[11px] mt-0.5 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-gold-600" />
                        <span>{b.booking_date} lúc {b.booking_time}</span>
                      </p>
                    </td>

                    <td className="py-4 px-4 max-w-xs">
                      <p className="text-gray-600 text-xs italic line-clamp-2">
                        {b.notes ? `“${b.notes}”` : 'Không có ghi chú'}
                      </p>
                    </td>

                    <td className="py-4 px-4">
                      {getStatusBadge(b.status)}
                    </td>

                    <td className="py-4 px-4 text-right">
                      <select
                        disabled={updatingId === b.id}
                        value={b.status}
                        onChange={(e) => handleUpdateStatus(b.id, e.target.value as BookingStatus)}
                        className="px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold focus:outline-none focus:border-gold-500 bg-white"
                      >
                        <option value="pending">Chờ xác nhận</option>
                        <option value="confirmed">Đã xác nhận</option>
                        <option value="completed">Đã hoàn thành</option>
                        <option value="cancelled">Hủy lịch</option>
                      </select>
                    </td>
                  </tr>
                )))}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}
