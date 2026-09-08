'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [authorized, setAuthorized] = useState<boolean>(false);

  useEffect(() => {
    // Không chặn trang đăng nhập
    if (pathname === '/admin/login') {
      setAuthorized(true);
      return;
    }

    // Kiểm tra token quản trị
    const token = typeof window !== 'undefined' ? localStorage.getItem('ngancare_admin_token') : null;
    if (!token) {
      setAuthorized(false);
      router.replace('/admin/login');
    } else {
      setAuthorized(true);
    }
  }, [pathname, router]);

  // Nếu đang ở trang login thì render ngay
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // Nếu chưa đăng nhập hoặc đang chuyển hướng, hiển thị màn hình chờ bảo mật
  if (!authorized) {
    return (
      <div className="min-h-screen bg-charcoal-950 flex flex-col items-center justify-center text-white p-4">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-gold-400" />
          <p className="text-sm text-gray-300 font-medium">Đang kiểm tra quyền quản trị viên...</p>
          <p className="text-xs text-gray-500">Chuyển hướng đến trang đăng nhập nếu chưa xác thực</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
