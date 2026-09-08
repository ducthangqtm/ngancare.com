'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Calendar, Stethoscope, ShoppingBag, FileText, LogOut, LayoutDashboard, Globe, KeyRound, X, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('ngancare_admin_token');
      localStorage.removeItem('ngancare_admin_user');
    }
    router.push('/admin/login');
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (newPassword !== confirmPassword) {
      setMessage({ text: 'Mật khẩu xác nhận không khớp.', type: 'error' });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ text: 'Mật khẩu mới phải có ít nhất 6 ký tự.', type: 'error' });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'admin',
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setMessage({ text: 'Đổi mật khẩu thành công!', type: 'success' });
        setTimeout(() => {
          setShowPasswordModal(false);
          setCurrentPassword('');
          setNewPassword('');
          setConfirmPassword('');
          setMessage(null);
        }, 1500);
      } else {
        setMessage({ text: data.error || 'Đổi mật khẩu thất bại.', type: 'error' });
      }
    } catch (e: any) {
      setMessage({ text: 'Lỗi kết nối máy chủ.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const links = [
    { name: 'Tổng Quan', href: '/admin', icon: LayoutDashboard },
    { name: 'Lịch Hẹn Đặt', href: '/admin/bookings', icon: Calendar },
    { name: 'Dịch Vụ Y Tế', href: '/admin/services', icon: Stethoscope },
    { name: 'Sản Phẩm & Affiliate', href: '/admin/products', icon: ShoppingBag },
    { name: 'Bài Viết Blog', href: '/admin/posts', icon: FileText },
  ];

  return (
    <>
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
          <button
            onClick={() => setShowPasswordModal(true)}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <KeyRound className="w-4 h-4 text-gold-400" />
            <span>Đổi Mật Khẩu Admin</span>
          </button>

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

      {/* Modal Đổi Mật Khẩu */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-charcoal-900 border border-gray-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-white">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-gold-400" />
                <h3 className="text-base sm:text-lg font-bold">Đổi Mật Khẩu Quản Trị</h3>
              </div>
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setMessage(null);
                }}
                className="text-gray-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {message && (
              <div
                className={`p-3 rounded-xl mb-4 text-xs flex items-center gap-2 ${
                  message.type === 'success'
                    ? 'bg-emerald-950/60 border border-emerald-800 text-emerald-300'
                    : 'bg-red-950/60 border border-red-800 text-red-300'
                }`}
              >
                {message.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                )}
                <span>{message.text}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-gray-300 font-medium mb-1">Mật Khẩu Hiện Tại *</label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Nhập mật khẩu đang dùng..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-charcoal-800 border border-gray-700 focus:border-gold-500 outline-none text-white"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-medium mb-1">Mật Khẩu Mới *</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Tối thiểu 6 ký tự..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-charcoal-800 border border-gray-700 focus:border-gold-500 outline-none text-white"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-medium mb-1">Xác Nhận Mật Khẩu Mới *</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Nhập lại mật khẩu mới..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-charcoal-800 border border-gray-700 focus:border-gold-500 outline-none text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordModal(false);
                    setMessage(null);
                  }}
                  className="px-4 py-2.5 rounded-xl border border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-white font-bold flex items-center gap-2 disabled:opacity-60"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Lưu Mật Khẩu</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
