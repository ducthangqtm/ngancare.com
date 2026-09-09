'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PhoneCall, Menu, X, Calendar, Sparkles, Heart } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Trang Chủ', href: '/' },
    { name: 'Về Ngân Care', href: '/#gioi-thieu' },
    { name: 'Dịch Vụ', href: '/#dich-vu' },
    { name: 'Quy Trình', href: '/#quy-trinh' },
    { name: 'Cam Kết', href: '/#cam-ket' },
    { name: 'Sản Phẩm', href: '/#san-pham' },
    { name: 'Blog Kiến Thức', href: '/#blog-kien-thuc' },
  ];

  return (
    <>
      {/* Top announcement bar */}
      <div className="bg-gradient-to-r from-gold-600 via-amber-600 to-gold-700 text-white text-xs sm:text-sm py-1.5 px-4 text-center font-medium flex items-center justify-center gap-2 shadow-sm">
        <span className="flex h-2 w-2 relative flex-shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
        </span>
        <span className="truncate sm:overflow-visible">
          Dịch vụ chăm sóc mẹ và bé tại nhà — ĐD. Nguyễn Thúy Ngân tận tâm đồng hành!
        </span>
        <a
          href="tel:0339627769"
          className="underline font-bold hover:text-amber-100 hidden sm:inline ml-2 whitespace-nowrap"
        >
          Hotline: 0339.627.769
        </a>
      </div>

      <header
        className={`sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm transition-all duration-300 ${
          scrolled ? 'py-2.5 shadow-md' : 'py-3.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            {/* Brand Logo & Name (No line break) */}
            <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
              <div className="relative w-11 h-11 sm:w-12 sm:h-12 flex-shrink-0 rounded-full overflow-hidden border border-gold-300 shadow-sm bg-white p-0.5">
                <Image
                  src="/images/logo.png"
                  alt="Ngân Care - Chăm Sóc Mẹ và Bé"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform"
                />
              </div>
              <div className="flex flex-col whitespace-nowrap">
                <span className="text-lg sm:text-xl font-bold tracking-tight text-charcoal-900 group-hover:text-gold-600 transition-colors whitespace-nowrap">
                  Nguyễn Thúy Ngân
                </span>
                <span className="text-xs font-semibold text-gold-600 tracking-wider uppercase flex items-center gap-1 whitespace-nowrap">
                  <Heart className="w-3 h-3 fill-gold-500 text-gold-500" /> Chăm Sóc Mẹ & Bé
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-5 xl:gap-6 text-sm font-medium text-charcoal-900 whitespace-nowrap">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="hover:text-gold-600 transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-gold-500 hover:after:w-full after:transition-all whitespace-nowrap"
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Header Action Buttons */}
            <div className="hidden sm:flex items-center gap-3 flex-shrink-0">
              {/* Hotline Button */}
              <a
                href="tel:0339627769"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emergency-500 hover:bg-emergency-600 text-white font-bold text-xs sm:text-sm transition-all shadow-md active:scale-95 whitespace-nowrap"
                title="Hotline tư vấn và chăm sóc: 0339.627.769"
              >
                <PhoneCall className="w-4 h-4 animate-bounce-gentle flex-shrink-0" />
                <span className="tracking-wide">HOTLINE: 0339.627.769</span>
              </a>

              {/* Book Appointment CTA */}
              <a
                href="/#dat-lich"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gold-500 hover:bg-gold-600 text-white font-semibold text-xs sm:text-sm shadow-gold-soft hover:shadow-gold-lg transition-all active:scale-95 whitespace-nowrap"
              >
                <Calendar className="w-4 h-4" />
                <span>Đặt Lịch Ngay</span>
              </a>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex sm:hidden items-center gap-2">
              <a
                href="tel:0339627769"
                className="p-2 rounded-full bg-emergency-500 text-white animate-pulse"
                aria-label="Gọi Hotline"
              >
                <PhoneCall className="w-4 h-4" />
              </a>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-lg text-charcoal-900 hover:text-gold-600 hover:bg-cream-200 focus:outline-none"
                aria-label="Toggle Menu"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isOpen && (
          <div className="lg:hidden bg-white/98 border-t border-gold-200/50 px-4 pt-3 pb-6 space-y-3 shadow-xl">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="px-3 py-2.5 rounded-lg text-base font-medium text-charcoal-900 hover:bg-cream-200 hover:text-gold-600 transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="pt-3 border-t border-gold-100 flex flex-col gap-2.5">
              <a
                href="tel:0339627769"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-emergency-500 text-white font-bold text-sm shadow-md"
              >
                <PhoneCall className="w-4 h-4" />
                <span>HOTLINE: 0339.627.769</span>
              </a>
              <a
                href="/#dat-lich"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-gold-500 text-white font-bold text-sm shadow-gold-soft"
              >
                <Calendar className="w-4 h-4" />
                <span>ĐẶT LỊCH HẸN TẠI NHÀ</span>
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
