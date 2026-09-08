'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Calendar, Package, FileText, LogOut, LayoutDashboard, Globe } from 'lucide-react';

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('ngancare_admin_token');
    }
    router.push('/admin/login');
  };

  const links = [
    { name: 'Tổng Quan', href: '/admin', icon: LayoutDashboard },
    { name: 'Lịch Hẹn Đặt', href: '/admin/bookings', icon: Calendar },
    { name: 'Dịch Vụ & Sản Phẩm', href: '/admin/services', icon: Package },
    { name: 'Bài Viết Blog', href: '/admin/posts', icon: FileText },
  ];

  return (
    <aside className="w-full md:w-64 bg-charcoal-900 text-white flex-shrink-0 flex flex-col justify-between min-h-screen p-4 border-r border-gray-800">
      <div>
        {/* Admin Brand */}
        <div className="p-3 mb-6 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-gold-500 text-charcoal-900 font-black flex items-center justify-center text-sm shadow-sm">
              NC
            </span>
            <div>
              <h2 className="text-sm font-bold text-white leading-tight">Ngân Care Admin</h2>
              <p className="text-[11px] text-gold-400">Hệ thống quản trị</p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          {links.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-gold-500 text-white font-bold shadow-gold-soft'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Controls */}
      <div className="pt-4 border-t border-gray-800 space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
        >
          <Globe className="w-4 h-4 text-gold-400" />
          <span>Xem Trang Khách (Web)</span>
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs text-red-400 hover:text-red-300 hover:bg-red-950/40 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Đăng Xuất</span>
        </button>
      </div>
    </aside>
  );
}
