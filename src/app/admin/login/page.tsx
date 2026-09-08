'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Lock, User, KeyRound, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('ngancare_admin_token', data.token);
          localStorage.setItem('ngancare_admin_user', JSON.stringify(data.user));
        }
        router.push('/admin/bookings');
      } else {
        setError(data.error || 'Tên đăng nhập hoặc mật khẩu không đúng.');
      }
    } catch (err: any) {
      setError('Lỗi kết nối máy chủ xác thực.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-charcoal-950 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full">
        
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="relative w-20 h-20 mx-auto mb-3 rounded-full overflow-hidden border-2 border-gold-400 shadow-lg bg-white p-1">
            <Image
              src="/images/logo.png"
              alt="Ngân Care"
              fill
              className="object-cover"
            />
          </div>
          <h1 className="text-2xl font-bold text-white">Quản Trị Viên Ngân Care</h1>
          <p className="text-xs text-gold-400 mt-1">Đăng nhập để quản lý lịch hẹn và nội dung website</p>
        </div>

        {/* Login Box */}
        <div className="bg-charcoal-900 border border-gray-800 rounded-3xl p-8 shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-5">
            
            {error && (
              <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-gold-400" />
                <span>Tên Đăng Nhập</span>
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Nhập tên đăng nhập..."
                className="w-full px-4 py-2.5 rounded-xl bg-charcoal-800 border border-gray-700 text-white text-sm focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500 placeholder-gray-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1.5 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-gold-400" />
                <span>Mật Khẩu</span>
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu..."
                className="w-full px-4 py-2.5 rounded-xl bg-charcoal-800 border border-gray-700 text-white text-sm focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500 placeholder-gray-500"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gold-500 hover:bg-gold-600 text-white font-bold text-sm shadow-gold-soft transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Đang Xác Thực...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Đăng Nhập Quản Trị</span>
                  </>
                )}
              </button>
            </div>

          </form>
        </div>

        {/* Back link */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Trở về Trang Chủ Ngân Care</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
