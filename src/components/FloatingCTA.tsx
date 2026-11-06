'use client';

import React, { useState, useEffect } from 'react';
import { Phone, AlertTriangle } from 'lucide-react';

export default function FloatingCTA() {
  const [hotline, setHotline] = useState('0339627769');
  const [hotlineDisplay, setHotlineDisplay] = useState('0339.627.769');
  const [zalo, setZalo] = useState('https://zalo.me/0339627769');
  const [messenger, setMessenger] = useState('https://m.me/ngancare.mevabe');

  useEffect(() => {
    fetch('/api/homepage')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          if (data.data.contact_hotline) setHotline(data.data.contact_hotline);
          if (data.data.contact_hotline_display) setHotlineDisplay(data.data.contact_hotline_display);
          if (data.data.contact_zalo) {
            const z = data.data.contact_zalo.trim();
            setZalo(z.startsWith('http') ? z : `https://zalo.me/${z}`);
          }
          if (data.data.contact_facebook) {
            const fb = data.data.contact_facebook.trim();
            if (fb.includes('facebook.com')) {
              setMessenger(fb.replace('facebook.com', 'm.me').replace('www.facebook.com', 'm.me'));
            } else if (fb.startsWith('http')) {
              setMessenger(fb);
            }
          }
        }
      })
      .catch(() => {});
  }, []);

  return (
    <>
      {/* Social & Contact Actions on Bottom-Right */}
      <aside
        aria-label="Hỗ trợ khách hàng"
        className="fixed bottom-5 right-4 sm:right-6 z-50 flex flex-col items-end gap-3 pointer-events-none"
      >
        {/* Button: Facebook Messenger */}
        <a
          href={messenger}
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
          href={zalo}
          target="_blank"
          rel="noopener noreferrer"
          className="pointer-events-auto w-12 h-12 rounded-full bg-[#0068FF] hover:bg-[#0052cc] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform active:scale-95 text-xs font-black tracking-tight"
          title={`Chat Zalo (${hotlineDisplay})`}
          aria-label="Chat Zalo"
        >
          <span className="text-[12px] font-extrabold">Zalo</span>
        </a>

        {/* Button: Hotline Instant Call with Ripple */}
        <a
          href={`tel:${hotline}`}
          className="pointer-events-auto relative group w-14 h-14 rounded-full bg-gradient-to-tr from-emergency-600 to-amber-500 text-white flex items-center justify-center shadow-xl hover:scale-110 transition-transform active:scale-95"
          title={`Gọi hotline hỗ trợ 24/7 ngay: ${hotlineDisplay}`}
          aria-label={`Gọi điện hotline ${hotline}`}
        >
          <span className="absolute -inset-1 rounded-full bg-emergency-500 opacity-60 animate-ping group-hover:opacity-100" />
          <Phone className="w-6 h-6 animate-bounce-gentle relative z-10" />
        </a>
      </aside>
    </>
  );
}
