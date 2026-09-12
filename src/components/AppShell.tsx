'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingCTA from '@/components/FloatingCTA';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  // Trang quản trị: KHÔNG hiển thị Navbar, Footer, và các nút CTA nổi của khách (Zalo, Messenger, Hotline)
  if (isAdmin) {
    return <div className="min-h-screen bg-gray-50">{children}</div>;
  }

  // Trang khách hàng: Hiển thị đầy đủ Navbar, Footer, Floating CTA
  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <FloatingCTA />
    </>
  );
}
