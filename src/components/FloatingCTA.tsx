'use client';

import React from 'react';
import { Phone, AlertTriangle } from 'lucide-react';

export default function FloatingCTA() {
  return (
    <>
      {/* 24/7 Emergency Floating Button on Bottom-Left */}
      <a
        href="tel:0339627769"
        className="fixed bottom-5 left-4 sm:left-6 z-50 flex items-center gap-2 bg-gradient-to-r from-emergency-600 to-emergency-500 hover:from-emergency-700 hover:to-emergency-600 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-full shadow-xl hover:shadow-2xl transition-all active:scale-95 group border border-white/30"
        title="Bấm gọi cấp cứu tắc tia sữa ngay: 0339.627.769"
        aria-label="Gọi cấp cứu 24/7"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
        </span>
        <AlertTriangle className="w-4 h-4 text-amber-200" />
        <span className="hidden sm:inline">Cấp Cứu 24/7: Long Biên & Gia Lâm</span>
        <span className="sm:hidden">Cấp Cứu 24/7</span>
      </a>

      {/* Social & Contact Actions on Bottom-Right */}
      <aside
        aria-label="Hỗ trợ khách hàng"
        className="fixed bottom-5 right-4 sm:right-6 z-50 flex flex-col items-end gap-3 pointer-events-none"
      >
        {/* Button: Facebook Messenger */}
        <a
          href="https://m.me/ngancare.mevabe"
          target="_blank"
          rel="noopener noreferrer"
          className="pointer-events-auto w-12 h-12 rounded-full bg-gradient-to-tr from-[#0084FF] via-[#0099FF] to-[#A824FF] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform active:scale-95"
          title="Nhắn tin Facebook Messenger"
          aria-label="Nhắn tin Facebook Messenger"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path d="M12 2C6.48 2 2 6.14 2 11.26c0 2.92 1.46 5.53 3.74 7.22V22l3.39-1.87c.91.25 1.88.39 2.87.39 5.52 0 10-4.14 10-9.26C22 6.14 17.52 2 12 2zm1.07 12.44l-2.58-2.75-5.04 2.75 5.54-5.88 2.65 2.75 4.97-2.75-5.54 5.88z" />
          </svg>
        </a>

        {/* Button: Chat Zalo */}
        <a
          href="https://zalo.me/0339627769"
          target="_blank"
          rel="noopener noreferrer"
          className="pointer-events-auto w-12 h-12 rounded-full bg-[#0068FF] hover:bg-[#0052cc] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform active:scale-95 text-xs font-black tracking-tight"
          title="Chat Zalo (+84 339 627 769)"
          aria-label="Chat Zalo"
        >
          <span className="text-[12px] font-extrabold">Zalo</span>
        </a>

        {/* Button: Hotline Instant Call with Ripple */}
        <a
          href="tel:0339627769"
          className="pointer-events-auto relative group w-14 h-14 rounded-full bg-gradient-to-tr from-emergency-600 to-amber-500 text-white flex items-center justify-center shadow-xl hover:scale-110 transition-transform active:scale-95"
          title="Gọi hotline cấp cứu ngay: 0339.627.769"
          aria-label="Gọi điện hotline 0339627769"
        >
          <span className="absolute -inset-1 rounded-full bg-emergency-500 opacity-60 animate-ping group-hover:opacity-100" />
          <Phone className="w-6 h-6 animate-bounce-gentle relative z-10" />
        </a>
      </aside>
    </>
  );
}
