'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminNav from '@/components/AdminNav';
import { Calendar, Package, FileText, CheckCircle2, Clock, Users, ArrowRight } from 'lucide-react';
import { INITIAL_BOOKINGS, INITIAL_SERVICES, INITIAL_POSTS } from '@/lib/seed-data';

export default function AdminDashboardPage() {
  const [bookingsCount, setBookingsCount] = useState(INITIAL_BOOKINGS.length);
  const [servicesCount, setServicesCount] = useState(INITIAL_SERVICES.length);
  const [postsCount, setPostsCount] = useState(INITIAL_POSTS.length);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <AdminNav />

      <main className="flex-1 p-6 sm:p-10 max-w-7xl">
        <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-charcoal-900">Tổng Quan Bảng Điều Khiển</h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Chào mừng trở lại! Dưới đây là tình hình hoạt động của Ngân Care.
            </p>
          </div>
          <Link
            href="/admin/bookings"
            className="px-4 py-2 rounded-xl bg-gold-500 hover:bg-gold-600 text-white font-bold text-xs sm:text-sm shadow-sm transition-all"
          >
            Quản Lý Lịch Hẹn Mới
          </Link>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Tổng Lịch Hẹn</p>
              <h3 className="text-3xl font-black text-charcoal-900 mt-1">{bookingsCount}</h3>
              <p className="text-[11px] text-amber-600 font-medium mt-1">1 lịch hẹn đang chờ xử lý</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Dịch Vụ & Sản Phẩm</p>
              <h3 className="text-3xl font-black text-charcoal-900 mt-1">{servicesCount}</h3>
              <p className="text-[11px] text-emerald-600 font-medium mt-1">Tất cả đang hoạt động</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <Package className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Bài Viết Blog Y Khoa</p>
              <h3 className="text-3xl font-black text-charcoal-900 mt-1">{postsCount}</h3>
              <p className="text-[11px] text-blue-600 font-medium mt-1">Chuẩn SEO YMYL Google</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Quick Management Shortcuts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/admin/bookings"
            className="p-6 bg-white rounded-2xl border border-gray-200 hover:border-gold-400 shadow-sm transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-gold-100 text-gold-600 flex items-center justify-center mb-3">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-charcoal-900 group-hover:text-gold-600 flex items-center justify-between">
              <span>Xem & Cập Nhật Lịch Hẹn</span>
              <ArrowRight className="w-4 h-4" />
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Xem chi tiết địa chỉ, số điện thoại, ghi chú của mẹ và chuyển trạng thái xác nhận.
            </p>
          </Link>

          <Link
            href="/admin/services"
            className="p-6 bg-white rounded-2xl border border-gray-200 hover:border-gold-400 shadow-sm transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-gold-100 text-gold-600 flex items-center justify-center mb-3">
              <Package className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-charcoal-900 group-hover:text-gold-600 flex items-center justify-between">
              <span>Quản Lý Dịch Vụ & Sản Phẩm</span>
              <ArrowRight className="w-4 h-4" />
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Thêm mới dịch vụ, cập nhật bảng giá niêm yết và thời lượng phục vụ tại nhà.
            </p>
          </Link>

          <Link
            href="/admin/posts"
            className="p-6 bg-white rounded-2xl border border-gray-200 hover:border-gold-400 shadow-sm transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-gold-100 text-gold-600 flex items-center justify-center mb-3">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-charcoal-900 group-hover:text-gold-600 flex items-center justify-between">
              <span>Soạn Thảo Bài Viết Blog</span>
              <ArrowRight className="w-4 h-4" />
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Viết bài chia sẻ kiến thức chuẩn YMYL, tự động sinh slug và nhập Meta SEO Title / Description.
            </p>
          </Link>
        </div>

      </main>
    </div>
  );
}
