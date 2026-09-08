'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminNav from '@/components/AdminNav';
import { Calendar, Stethoscope, ShoppingBag, FileText, ArrowRight } from 'lucide-react';
import { INITIAL_BOOKINGS, INITIAL_SERVICES, INITIAL_POSTS } from '@/lib/seed-data';
import { Service, Booking, BlogPost } from '@/lib/types';

export default function AdminDashboardPage() {
  const initialServices = INITIAL_SERVICES.filter((s) => s.category !== 'san_pham');
  const initialProducts = INITIAL_SERVICES.filter((s) => s.category === 'san_pham');

  const [bookingsCount, setBookingsCount] = useState(INITIAL_BOOKINGS.length);
  const [pendingCount, setPendingCount] = useState(
    INITIAL_BOOKINGS.filter((b) => b.status === 'pending').length
  );
  const [servicesCount, setServicesCount] = useState(initialServices.length);
  const [productsCount, setProductsCount] = useState(initialProducts.length);
  const [postsCount, setPostsCount] = useState(INITIAL_POSTS.length);

  // Fetch real-time live counts from D1 database
  useEffect(() => {
    const fetchDashboardData = async () => {
      // 1. Fetch Bookings
      try {
        const res = await fetch('/api/admin/bookings');
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          setBookingsCount(data.data.length);
          const pending = data.data.filter((b: Booking) => b.status === 'pending').length;
          setPendingCount(pending);
        }
      } catch (e) {}

      // 2. Fetch Services & Products
      try {
        const res = await fetch('/api/admin/services');
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          const srvs = data.data.filter((s: Service) => s.category !== 'san_pham');
          const prods = data.data.filter((s: Service) => s.category === 'san_pham');
          setServicesCount(srvs.length);
          setProductsCount(prods.length);
        }
      } catch (e) {}

      // 3. Fetch Posts
      try {
        const res = await fetch('/api/admin/posts');
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          setPostsCount(data.data.length);
        }
      } catch (e) {}
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <AdminNav />

      <main className="flex-1 p-6 sm:p-10 max-w-7xl">
        <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-charcoal-900">Tổng Quan Bảng Điều Khiển</h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Chào mừng trở lại! Dưới đây là dữ liệu hoạt động theo thời gian thực từ cơ sở dữ liệu Ngân Care.
            </p>
          </div>
          <Link
            href="/admin/bookings"
            className="px-4 py-2 rounded-xl bg-gold-500 hover:bg-gold-600 text-white font-bold text-xs sm:text-sm shadow-sm transition-all"
          >
            Quản Lý Lịch Hẹn Mới
          </Link>
        </div>

        {/* Metric Cards (4 Cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Lịch Hẹn Đặt</p>
              <h3 className="text-2xl sm:text-3xl font-black text-charcoal-900 mt-1">{bookingsCount}</h3>
              <p className="text-[11px] text-amber-600 font-medium mt-1">
                {pendingCount > 0 ? `${pendingCount} lịch hẹn đang chờ` : 'Không có lịch chờ'}
              </p>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Dịch Vụ Y Tế</p>
              <h3 className="text-2xl sm:text-3xl font-black text-charcoal-900 mt-1">{servicesCount}</h3>
              <p className="text-[11px] text-emerald-600 font-medium mt-1">Gói chăm sóc tại nhà</p>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <Stethoscope className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Sản Phẩm & Affiliate</p>
              <h3 className="text-2xl sm:text-3xl font-black text-charcoal-900 mt-1">{productsCount}</h3>
              <p className="text-[11px] text-orange-600 font-medium mt-1">Shopee / TikTok Shop</p>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Bài Viết Blog Y Khoa</p>
              <h3 className="text-2xl sm:text-3xl font-black text-charcoal-900 mt-1">{postsCount}</h3>
              <p className="text-[11px] text-blue-600 font-medium mt-1">Chuẩn SEO YMYL Google</p>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Quick Management Shortcuts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <Link
            href="/admin/bookings"
            className="p-5 bg-white rounded-2xl border border-gray-200 hover:border-gold-400 shadow-sm transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-gold-100 text-gold-600 flex items-center justify-center mb-3">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-charcoal-900 group-hover:text-gold-600 flex items-center justify-between">
              <span>Xem Lịch Hẹn</span>
              <ArrowRight className="w-4 h-4" />
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Xem chi tiết địa chỉ, số điện thoại của mẹ và chuyển trạng thái xác nhận.
            </p>
          </Link>

          <Link
            href="/admin/services"
            className="p-5 bg-white rounded-2xl border border-gray-200 hover:border-gold-400 shadow-sm transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
              <Stethoscope className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-charcoal-900 group-hover:text-gold-600 flex items-center justify-between">
              <span>Dịch Vụ Y Tế</span>
              <ArrowRight className="w-4 h-4" />
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Thêm mới dịch vụ, cập nhật bảng giá niêm yết và thời lượng phục vụ tại nhà.
            </p>
          </Link>

          <Link
            href="/admin/products"
            className="p-5 bg-white rounded-2xl border border-gray-200 hover:border-gold-400 shadow-sm transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center mb-3">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-charcoal-900 group-hover:text-gold-600 flex items-center justify-between">
              <span>Sản Phẩm & Affiliate</span>
              <ArrowRight className="w-4 h-4" />
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Quản lý sản phẩm thiên nhiên và gắn link tiếp thị Shopee / TikTok Shop nhận hoa hồng.
            </p>
          </Link>

          <Link
            href="/admin/posts"
            className="p-5 bg-white rounded-2xl border border-gray-200 hover:border-gold-400 shadow-sm transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-3">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-charcoal-900 group-hover:text-gold-600 flex items-center justify-between">
              <span>Bài Viết Blog</span>
              <ArrowRight className="w-4 h-4" />
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Soạn bài chia sẻ chuẩn YMYL, tự động sinh slug và nhập Meta SEO Title / Description.
            </p>
          </Link>
        </div>

      </main>
    </div>
  );
}
