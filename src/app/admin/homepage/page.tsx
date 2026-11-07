'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminNav from '@/components/AdminNav';
import {
  Phone,
  Sparkles,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ExternalLink,
  Layers,
  UserCheck,
  ShieldCheck,
  ListOrdered,
  PanelTop,
  Columns,
  Tag,
  Stethoscope,
  ShoppingBag,
  FileText
} from 'lucide-react';
import { HomepageConfig, DEFAULT_HOMEPAGE_CONFIG } from '@/lib/homepage-config';

type ActiveTab = 'contact' | 'hero' | 'founder' | 'process_commit' | 'header_footer' | 'pillars' | 'headings';

export default function AdminHomepageSettingsPage() {
  const [config, setConfig] = useState<HomepageConfig>(DEFAULT_HOMEPAGE_CONFIG);
  const [activeTab, setActiveTab] = useState<ActiveTab>('contact');
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Load configuration from API
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch('/api/admin/homepage');
        const data = await res.json();
        if (data.success && data.data) {
          setConfig({ ...DEFAULT_HOMEPAGE_CONFIG, ...data.data });
        }
      } catch (e) {
        console.error('Lỗi khi tải cấu hình trang chủ:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const handleChange = (key: keyof HomepageConfig, value: string) => {
    setConfig((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/admin/homepage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('Đã lưu cấu hình nội dung trang chủ thành công!', 'success');
      } else {
        showToast(data.error || 'Lưu cấu hình thất bại.', 'error');
      }
    } catch (err: any) {
      showToast('Lỗi kết nối máy chủ khi lưu.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleResetDefaults = () => {
    if (confirm('Bạn có chắc muốn khôi phục toàn bộ câu chữ trang chủ về mặc định ban đầu?')) {
      setConfig({ ...DEFAULT_HOMEPAGE_CONFIG });
      showToast('Đã khôi phục các trường về nội dung mặc định. Bấm "Lưu Thay Đổi" để áp dụng.', 'success');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <AdminNav />

      <main className="flex-1 p-4 sm:p-8 lg:p-10 max-w-7xl overflow-x-auto">
        {/* Header Section */}
        <div className="mb-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-gold-600 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Hệ Thống Quản Trị Trực Quan (CMS)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900">
              Cài Đặt Nội Dung Toàn Website
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-2xl">
              Tùy chỉnh 100% câu chữ: Hotline, Header, Footer, 4 Trụ Cột, Banner, Giới Thiệu, Tiêu Đề Dịch Vụ & Sản Phẩm.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/"
              target="_blank"
              className="px-3.5 py-2 rounded-xl bg-white border border-gray-300 hover:bg-gray-100 text-charcoal-800 text-xs sm:text-sm font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <ExternalLink className="w-4 h-4 text-gray-500" />
              <span>Xem Trang Khách</span>
            </Link>

            <button
              type="button"
              onClick={handleResetDefaults}
              className="px-3.5 py-2 rounded-xl bg-white border border-amber-300 hover:bg-amber-50 text-amber-800 text-xs sm:text-sm font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
              title="Khôi phục câu chữ nguyên bản"
            >
              <RotateCcw className="w-4 h-4 text-amber-600" />
              <span>Khôi Phục Mặc Định</span>
            </button>

            <button
              type="button"
              onClick={() => handleSave()}
              disabled={saving || loading}
              className="px-5 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-600 active:scale-95 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-gold-soft transition-all disabled:opacity-60"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Đang Lưu...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Lưu Thay Đổi</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Toast Alert */}
        {toast && (
          <div
            className={`mb-6 p-4 rounded-xl flex items-center gap-3 border shadow-sm transition-all ${toast.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-red-50 border-red-200 text-red-800'
              }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            )}
            <span className="text-xs sm:text-sm font-semibold">{toast.message}</span>
          </div>
        )}

        {loading ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 flex flex-col items-center justify-center text-gray-500">
            <Loader2 className="w-8 h-8 animate-spin text-gold-500 mb-3" />
            <p className="text-sm font-medium">Đang tải cấu hình trang chủ...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Tab Navigation (7 Tabs) */}
            <div className="bg-white rounded-2xl p-1.5 border border-gray-200 shadow-xs flex flex-wrap gap-1">
              <button
                type="button"
                onClick={() => setActiveTab('contact')}
                className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all ${activeTab === 'contact'
                    ? 'bg-gold-500 text-white shadow-gold-soft'
                    : 'text-gray-600 hover:text-charcoal-900 hover:bg-gray-100'
                  }`}
              >
                <Phone className="w-4 h-4" />
                <span>1. Liên Hệ Chung</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('hero')}
                className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all ${activeTab === 'hero'
                    ? 'bg-gold-500 text-white shadow-gold-soft'
                    : 'text-gray-600 hover:text-charcoal-900 hover:bg-gray-100'
                  }`}
              >
                <Layers className="w-4 h-4" />
                <span>2. Banner Đầu Trang</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('founder')}
                className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all ${activeTab === 'founder'
                    ? 'bg-gold-500 text-white shadow-gold-soft'
                    : 'text-gray-600 hover:text-charcoal-900 hover:bg-gray-100'
                  }`}
              >
                <UserCheck className="w-4 h-4" />
                <span>3. Giới Thiệu Chuyên Viên</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('process_commit')}
                className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all ${activeTab === 'process_commit'
                    ? 'bg-gold-500 text-white shadow-gold-soft'
                    : 'text-gray-600 hover:text-charcoal-900 hover:bg-gray-100'
                  }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>4. Cam Kết & Quy Trình</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('header_footer')}
                className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all ${activeTab === 'header_footer'
                    ? 'bg-gold-500 text-white shadow-gold-soft'
                    : 'text-gray-600 hover:text-charcoal-900 hover:bg-gray-100'
                  }`}
              >
                <PanelTop className="w-4 h-4" />
                <span>5. Header & Footer</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('pillars')}
                className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all ${activeTab === 'pillars'
                    ? 'bg-gold-500 text-white shadow-gold-soft'
                    : 'text-gray-600 hover:text-charcoal-900 hover:bg-gray-100'
                  }`}
              >
                <Columns className="w-4 h-4" />
                <span>6. 4 Trụ Cột Niềm Tin</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('headings')}
                className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all ${activeTab === 'headings'
                    ? 'bg-gold-500 text-white shadow-gold-soft'
                    : 'text-gray-600 hover:text-charcoal-900 hover:bg-gray-100'
                  }`}
              >
                <Tag className="w-4 h-4" />
                <span>7. Tiêu Đề Dịch Vụ & SP</span>
              </button>
            </div>

            {/* TAB 1: THÔNG TIN LIÊN HỆ */}
            {activeTab === 'contact' && (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-6 sm:p-8 space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-charcoal-900 flex items-center gap-2">
                    <Phone className="w-5 h-5 text-gold-600" />
                    <span>Thông Tin Liên Hệ & Kênh Tư Vấn Trực Tiếp</span>
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">
                    Cập nhật số điện thoại và địa chỉ hiển thị ở nút gọi, Zalo, Header và Footer trên toàn trang.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-charcoal-900 uppercase tracking-wide mb-1.5">
                      Số Hotline Gọi Nhanh (Dùng để bấm gọi tel:)
                    </label>
                    <input
                      type="text"
                      value={config.contact_hotline}
                      onChange={(e) => handleChange('contact_hotline', e.target.value)}
                      placeholder="0339627769"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-gold-500 focus:ring-2 focus:ring-gold-200 text-sm font-medium"
                    />
                    <p className="text-[11px] text-gray-400 mt-1">
                      Số liền không dấu cách để trình duyệt và điện thoại tự quay số.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-charcoal-900 uppercase tracking-wide mb-1.5">
                      Số Hotline Hiển Thị (Có dấu chấm dễ nhìn)
                    </label>
                    <input
                      type="text"
                      value={config.contact_hotline_display}
                      onChange={(e) => handleChange('contact_hotline_display', e.target.value)}
                      placeholder="0339.627.769"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-gold-500 focus:ring-2 focus:ring-gold-200 text-sm font-medium"
                    />
                    <p className="text-[11px] text-gray-400 mt-1">
                      Hiển thị trên nút gọi ở Banner, Header và Footer.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-charcoal-900 uppercase tracking-wide mb-1.5">
                      Đường Dẫn Zalo Tư Vấn (Link hoặc số Zalo)
                    </label>
                    <input
                      type="text"
                      value={config.contact_zalo}
                      onChange={(e) => handleChange('contact_zalo', e.target.value)}
                      placeholder="https://zalo.me/0339627769"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-gold-500 focus:ring-2 focus:ring-gold-200 text-sm font-medium"
                    />
                    <p className="text-[11px] text-gray-400 mt-1">
                      Ví dụ: <code className="bg-gray-100 px-1 py-0.5 rounded text-gold-700">https://zalo.me/0339627769</code>
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-charcoal-900 uppercase tracking-wide mb-1.5">
                      Fanpage Facebook (Nếu có)
                    </label>
                    <input
                      type="text"
                      value={config.contact_facebook || ''}
                      onChange={(e) => handleChange('contact_facebook', e.target.value)}
                      placeholder="https://www.facebook.com/ngancare.mevabe"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-gold-500 focus:ring-2 focus:ring-gold-200 text-sm font-medium"
                    />
                    <p className="text-[11px] text-gray-400 mt-1">
                      Liên kết đến trang Facebook mẹ và bé.
                    </p>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-charcoal-900 uppercase tracking-wide mb-1.5">
                      Địa Bàn / Khu Vực Hoạt Động Chính
                    </label>
                    <input
                      type="text"
                      value={config.contact_address}
                      onChange={(e) => handleChange('contact_address', e.target.value)}
                      placeholder="Toàn bộ khu vực nội thành Hà Nội & các huyện lân cận"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-gold-500 focus:ring-2 focus:ring-gold-200 text-sm font-medium"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-charcoal-900 uppercase tracking-wide mb-1.5">
                      Thời Gian Phục Vụ
                    </label>
                    <input
                      type="text"
                      value={config.contact_working_hours || ''}
                      onChange={(e) => handleChange('contact_working_hours', e.target.value)}
                      placeholder="Phục vụ 24/7 (Cả Thứ 7, Chủ Nhật & Ngày Lễ)"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-gold-500 focus:ring-2 focus:ring-gold-200 text-sm font-medium"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: HERO BANNER ĐẦU TRANG */}
            {activeTab === 'hero' && (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-6 sm:p-8 space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-charcoal-900 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-gold-600" />
                    <span>Banner Đầu Trang (Hero Banner)</span>
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">
                    Ấn tượng đầu tiên khi khách hàng bước vào website. Nên viết câu từ ngắn gọn, tạo niềm tin và thúc đẩy đặt lịch.
                  </p>
                </div>

                <div className="space-y-5 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-charcoal-900 uppercase tracking-wide mb-1.5">
                      Dòng Tiêu Đề Nhỏ (Slogan / Badge Trên Cùng)
                    </label>
                    <input
                      type="text"
                      value={config.hero_badge}
                      onChange={(e) => handleChange('hero_badge', e.target.value)}
                      placeholder="“Chăm sóc bằng kiến thức — Nuôi dưỡng bằng yêu thương”"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-gold-500 focus:ring-2 focus:ring-gold-200 text-sm font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-charcoal-900 uppercase tracking-wide mb-1.5">
                      Tiêu Đề Chính Lớn (H1)
                    </label>
                    <textarea
                      rows={2}
                      value={config.hero_title}
                      onChange={(e) => handleChange('hero_title', e.target.value)}
                      placeholder="Đồng Hành Cùng Mẹ Chăm Sóc Sức Khỏe Mẹ Và Bé Từ Thai Kỳ Đến Sau Sinh"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-gold-500 focus:ring-2 focus:ring-gold-200 text-sm font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-charcoal-900 uppercase tracking-wide mb-1.5">
                      Cụm Từ Nổi Bật (Tô Màu Vàng Kim Trong H1)
                    </label>
                    <input
                      type="text"
                      value={config.hero_title_highlight}
                      onChange={(e) => handleChange('hero_title_highlight', e.target.value)}
                      placeholder="Mẹ Và Bé"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-gold-500 focus:ring-2 focus:ring-gold-200 text-sm font-medium"
                    />
                    <p className="text-[11px] text-gray-400 mt-1">
                      Nếu để trống, toàn bộ tiêu đề chính sẽ hiển thị màu chữ chuẩn.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-charcoal-900 uppercase tracking-wide mb-1.5">
                      Đoạn Văn Mô Tả Ngắn Dưới Tiêu Đề
                    </label>
                    <textarea
                      rows={3}
                      value={config.hero_subtitle}
                      onChange={(e) => handleChange('hero_subtitle', e.target.value)}
                      placeholder="Được sáng lập và trực tiếp phụ trách bởi Điều Dưỡng Nguyễn Thúy Ngân..."
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-gold-500 focus:ring-2 focus:ring-gold-200 text-sm font-medium leading-relaxed"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-charcoal-900 uppercase tracking-wide mb-1.5">
                        Chữ Trên Nút CTA Chính (Đặt Lịch)
                      </label>
                      <input
                        type="text"
                        value={config.hero_cta_booking}
                        onChange={(e) => handleChange('hero_cta_booking', e.target.value)}
                        placeholder="Đặt Lịch Chăm Sóc Ngay"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-gold-500 focus:ring-2 focus:ring-gold-200 text-sm font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-charcoal-900 uppercase tracking-wide mb-1.5">
                        Chữ Trên Nút Gọi Hotline
                      </label>
                      <input
                        type="text"
                        value={config.hero_cta_hotline}
                        onChange={(e) => handleChange('hero_cta_hotline', e.target.value)}
                        placeholder="Hotline: 0339.627.769"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-gold-500 focus:ring-2 focus:ring-gold-200 text-sm font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-charcoal-900 uppercase tracking-wide mb-1.5">
                      Đường Dẫn Ảnh Banner (URL ảnh)
                    </label>
                    <div className="flex gap-3 items-center">
                      <input
                        type="text"
                        value={config.hero_banner_image}
                        onChange={(e) => handleChange('hero_banner_image', e.target.value)}
                        placeholder="/images/banner.jpg"
                        className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-gold-500 focus:ring-2 focus:ring-gold-200 text-sm font-medium"
                      />
                      {config.hero_banner_image && (
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0 bg-gray-100">
                          <img
                            src={config.hero_banner_image}
                            alt="Preview banner"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as any).src = '/images/banner.jpg';
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: GIỚI THIỆU ĐIỀU DƯỠNG THÚY NGÂN */}
            {activeTab === 'founder' && (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-6 sm:p-8 space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-charcoal-900 flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-gold-600" />
                    <span>Giới Thiệu Người Sáng Lập — Điều Dưỡng Thúy Ngân</span>
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">
                    Xây dựng thương hiệu cá nhân đáng tin cậy với bằng cấp chính quy và kinh nghiệm thực tế.
                  </p>
                </div>

                <div className="space-y-5 pt-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-charcoal-900 uppercase tracking-wide mb-1.5">
                        Badge Tiêu Đề Nhỏ
                      </label>
                      <input
                        type="text"
                        value={config.founder_section_badge}
                        onChange={(e) => handleChange('founder_section_badge', e.target.value)}
                        placeholder="Về Người Sáng Lập Ngân Care"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-gold-500 focus:ring-2 focus:ring-gold-200 text-sm font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-charcoal-900 uppercase tracking-wide mb-1.5">
                        Tên Điều Dưỡng / Chuyên Viên
                      </label>
                      <input
                        type="text"
                        value={config.founder_name}
                        onChange={(e) => handleChange('founder_name', e.target.value)}
                        placeholder="Nguyễn Thúy Ngân"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-gold-500 focus:ring-2 focus:ring-gold-200 text-sm font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-charcoal-900 uppercase tracking-wide mb-1.5">
                      Tiêu Đề Mục Giới Thiệu
                    </label>
                    <input
                      type="text"
                      value={config.founder_title}
                      onChange={(e) => handleChange('founder_title', e.target.value)}
                      placeholder="Gặp Gỡ Chuyên Viên Điều Dưỡng"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-gold-500 focus:ring-2 focus:ring-gold-200 text-sm font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-charcoal-900 uppercase tracking-wide mb-1.5">
                        Số Năm Kinh Nghiệm (Đoạn text mô tả)
                      </label>
                      <input
                        type="text"
                        value={config.founder_experience}
                        onChange={(e) => handleChange('founder_experience', e.target.value)}
                        placeholder="Hơn 9 năm kinh nghiệm"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-gold-500 focus:ring-2 focus:ring-gold-200 text-sm font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-charcoal-900 uppercase tracking-wide mb-1.5">
                        Huy Hiệu Năm (Viết ngắn gọn)
                      </label>
                      <input
                        type="text"
                        value={config.founder_experience_badge}
                        onChange={(e) => handleChange('founder_experience_badge', e.target.value)}
                        placeholder="9+"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-gold-500 focus:ring-2 focus:ring-gold-200 text-sm font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-charcoal-900 uppercase tracking-wide mb-1.5">
                      Đoạn Văn Giới Thiệu Bản Thân & Quá Trình Làm Việc
                    </label>
                    <textarea
                      rows={3}
                      value={config.founder_bio}
                      onChange={(e) => handleChange('founder_bio', e.target.value)}
                      placeholder="Hơn 9 năm tận tụy đồng hành cùng hàng nghìn mẹ bỉm sữa Thủ đô..."
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-gold-500 focus:ring-2 focus:ring-gold-200 text-sm font-medium leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-charcoal-900 uppercase tracking-wide mb-1.5">
                      Câu Châm Ngôn / Trích Dẫn Ý Nghĩa
                    </label>
                    <textarea
                      rows={2}
                      value={config.founder_quote}
                      onChange={(e) => handleChange('founder_quote', e.target.value)}
                      placeholder="“Mỗi em bé chào đời là một thiên thần vô giá...”"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-gold-500 focus:ring-2 focus:ring-gold-200 text-sm font-medium italic"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-charcoal-900 uppercase tracking-wide mb-1.5">
                      Đường Dẫn Ảnh Đại Diện (Avatar URL)
                    </label>
                    <div className="flex gap-3 items-center">
                      <input
                        type="text"
                        value={config.founder_image}
                        onChange={(e) => handleChange('founder_image', e.target.value)}
                        placeholder="/images/avata.jpg"
                        className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-gold-500 focus:ring-2 focus:ring-gold-200 text-sm font-medium"
                      />
                      {config.founder_image && (
                        <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-gold-400 flex-shrink-0 bg-gray-100">
                          <img
                            src={config.founder_image}
                            alt="Preview avatar"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as any).src = '/images/avata.jpg';
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: QUY TRÌNH & CAM KẾT */}
            {activeTab === 'process_commit' && (
              <div className="space-y-6">
                {/* Phần 1: Quy trình 4 bước */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-6 sm:p-8 space-y-6">
                  <div>
                    <h2 className="text-lg font-bold text-charcoal-900 flex items-center gap-2">
                      <ListOrdered className="w-5 h-5 text-gold-600" />
                      <span>Quy Trình Chăm Sóc Mẹ & Bé</span>
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">
                      Tùy chỉnh tiêu đề và tóm tắt từng bước để khách hàng hiểu rõ quy chuẩn an toàn.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                    <div>
                      <label className="block text-xs font-bold text-charcoal-900 uppercase tracking-wide mb-1.5">
                        Badge Tiêu Đề Nhỏ
                      </label>
                      <input
                        type="text"
                        value={config.process_badge}
                        onChange={(e) => handleChange('process_badge', e.target.value)}
                        placeholder="Tận Tâm & Chuyên Nghiệp"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-gold-500 focus:ring-2 focus:ring-gold-200 text-sm font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-charcoal-900 uppercase tracking-wide mb-1.5">
                        Tiêu Đề Chính Quy Trình
                      </label>
                      <input
                        type="text"
                        value={config.process_title}
                        onChange={(e) => handleChange('process_title', e.target.value)}
                        placeholder="Quy Trình Chăm Sóc 4 Bước"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-gold-500 focus:ring-2 focus:ring-gold-200 text-sm font-medium"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-charcoal-900 uppercase tracking-wide mb-1.5">
                        Slogan / Mô Tả Quy Trình
                      </label>
                      <input
                        type="text"
                        value={config.process_subtitle}
                        onChange={(e) => handleChange('process_subtitle', e.target.value)}
                        placeholder="4 Bước Vàng — Mẹ An Tâm"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-gold-500 focus:ring-2 focus:ring-gold-200 text-sm font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-3">
                    {/* Bước 1 */}
                    <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/70 space-y-2.5">
                      <span className="text-xs font-extrabold text-gold-700 uppercase tracking-wider">Bước 01</span>
                      <input
                        type="text"
                        value={config.process_step1_title}
                        onChange={(e) => handleChange('process_step1_title', e.target.value)}
                        placeholder="Tiêu đề bước 1"
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs sm:text-sm font-bold bg-white"
                      />
                      <textarea
                        rows={2}
                        value={config.process_step1_desc}
                        onChange={(e) => handleChange('process_step1_desc', e.target.value)}
                        placeholder="Mô tả chi tiết bước 1"
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs text-gray-700 bg-white"
                      />
                    </div>

                    {/* Bước 2 */}
                    <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/70 space-y-2.5">
                      <span className="text-xs font-extrabold text-gold-700 uppercase tracking-wider">Bước 02</span>
                      <input
                        type="text"
                        value={config.process_step2_title}
                        onChange={(e) => handleChange('process_step2_title', e.target.value)}
                        placeholder="Tiêu đề bước 2"
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs sm:text-sm font-bold bg-white"
                      />
                      <textarea
                        rows={2}
                        value={config.process_step2_desc}
                        onChange={(e) => handleChange('process_step2_desc', e.target.value)}
                        placeholder="Mô tả chi tiết bước 2"
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs text-gray-700 bg-white"
                      />
                    </div>

                    {/* Bước 3 */}
                    <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/70 space-y-2.5">
                      <span className="text-xs font-extrabold text-gold-700 uppercase tracking-wider">Bước 03</span>
                      <input
                        type="text"
                        value={config.process_step3_title}
                        onChange={(e) => handleChange('process_step3_title', e.target.value)}
                        placeholder="Tiêu đề bước 3"
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs sm:text-sm font-bold bg-white"
                      />
                      <textarea
                        rows={2}
                        value={config.process_step3_desc}
                        onChange={(e) => handleChange('process_step3_desc', e.target.value)}
                        placeholder="Mô tả chi tiết bước 3"
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs text-gray-700 bg-white"
                      />
                    </div>

                    {/* Bước 4 */}
                    <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/70 space-y-2.5">
                      <span className="text-xs font-extrabold text-gold-700 uppercase tracking-wider">Bước 04</span>
                      <input
                        type="text"
                        value={config.process_step4_title}
                        onChange={(e) => handleChange('process_step4_title', e.target.value)}
                        placeholder="Tiêu đề bước 4"
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs sm:text-sm font-bold bg-white"
                      />
                      <textarea
                        rows={2}
                        value={config.process_step4_desc}
                        onChange={(e) => handleChange('process_step4_desc', e.target.value)}
                        placeholder="Mô tả chi tiết bước 4"
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs text-gray-700 bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Phần 2: Cam kết vàng */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-6 sm:p-8 space-y-6">
                  <div>
                    <h2 className="text-lg font-bold text-charcoal-900 flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-gold-600" />
                      <span>Cam Kết Vàng Dịch Vụ</span>
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">
                      Các nguyên tắc cam kết giúp gia đình hoàn toàn yên tâm khi sử dụng dịch vụ tại nhà.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                    <div>
                      <label className="block text-xs font-bold text-charcoal-900 uppercase tracking-wide mb-1.5">
                        Badge Tiêu Đề Nhỏ
                      </label>
                      <input
                        type="text"
                        value={config.commit_badge}
                        onChange={(e) => handleChange('commit_badge', e.target.value)}
                        placeholder="Uy Tín & Tận Tâm"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-gold-500 focus:ring-2 focus:ring-gold-200 text-sm font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-charcoal-900 uppercase tracking-wide mb-1.5">
                        Tiêu Đề Mục Cam Kết
                      </label>
                      <input
                        type="text"
                        value={config.commit_title}
                        onChange={(e) => handleChange('commit_title', e.target.value)}
                        placeholder="Cam Kết Vàng Từ Điều Dưỡng Thúy Ngân"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-gold-500 focus:ring-2 focus:ring-gold-200 text-sm font-medium"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-charcoal-900 uppercase tracking-wide mb-1.5">
                        Mô Tả / Slogan Cam Kết
                      </label>
                      <input
                        type="text"
                        value={config.commit_subtitle}
                        onChange={(e) => handleChange('commit_subtitle', e.target.value)}
                        placeholder="Đặt sự an toàn của mẹ và bé lên trên hết..."
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-gold-500 focus:ring-2 focus:ring-gold-200 text-sm font-medium"
                      />
                    </div>
                  </div>

                  <div className="space-y-4 pt-3">
                    {/* Cam kết 1 */}
                    <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/70 space-y-2.5">
                      <span className="text-xs font-extrabold text-gold-700 uppercase tracking-wider">Cam Kết 01</span>
                      <input
                        type="text"
                        value={config.commit_item1_title}
                        onChange={(e) => handleChange('commit_item1_title', e.target.value)}
                        placeholder="Tiêu đề cam kết 1"
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs sm:text-sm font-bold bg-white"
                      />
                      <textarea
                        rows={2}
                        value={config.commit_item1_desc}
                        onChange={(e) => handleChange('commit_item1_desc', e.target.value)}
                        placeholder="Mô tả cam kết 1"
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs text-gray-700 bg-white"
                      />
                    </div>

                    {/* Cam kết 2 */}
                    <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/70 space-y-2.5">
                      <span className="text-xs font-extrabold text-gold-700 uppercase tracking-wider">Cam Kết 02</span>
                      <input
                        type="text"
                        value={config.commit_item2_title}
                        onChange={(e) => handleChange('commit_item2_title', e.target.value)}
                        placeholder="Tiêu đề cam kết 2"
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs sm:text-sm font-bold bg-white"
                      />
                      <textarea
                        rows={2}
                        value={config.commit_item2_desc}
                        onChange={(e) => handleChange('commit_item2_desc', e.target.value)}
                        placeholder="Mô tả cam kết 2"
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs text-gray-700 bg-white"
                      />
                    </div>

                    {/* Cam kết 3 */}
                    <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/70 space-y-2.5">
                      <span className="text-xs font-extrabold text-gold-700 uppercase tracking-wider">Cam Kết 03</span>
                      <input
                        type="text"
                        value={config.commit_item3_title}
                        onChange={(e) => handleChange('commit_item3_title', e.target.value)}
                        placeholder="Tiêu đề cam kết 3"
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs sm:text-sm font-bold bg-white"
                      />
                      <textarea
                        rows={2}
                        value={config.commit_item3_desc}
                        onChange={(e) => handleChange('commit_item3_desc', e.target.value)}
                        placeholder="Mô tả cam kết 3"
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs text-gray-700 bg-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: HEADER & FOOTER */}
            {activeTab === 'header_footer' && (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-6 sm:p-8 space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-charcoal-900 flex items-center gap-2">
                    <PanelTop className="w-5 h-5 text-gold-600" />
                    <span>Cài Đặt Thanh Tiêu Đề (Header) & Chân Trang (Footer)</span>
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">
                    Tùy chỉnh câu thông báo trên cùng, đoạn mô tả giới thiệu thương hiệu và thông tin bản quyền ở chân trang.
                  </p>
                </div>

                <div className="space-y-5 pt-2">
                  {/* Header Announcement Bar */}
                  <div>
                    <label className="block text-xs font-bold text-charcoal-900 uppercase tracking-wide mb-1.5">
                      Text Thanh Thông Báo Đầu Trang (Top Bar Announcement)
                    </label>
                    <textarea
                      rows={2}
                      value={config.header_announcement}
                      onChange={(e) => handleChange('header_announcement', e.target.value)}
                      placeholder="Dịch vụ chăm sóc mẹ và bé tại nhà — ĐD. Nguyễn Thúy Ngân tận tâm đồng hành!"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-gold-500 focus:ring-2 focus:ring-gold-200 text-sm font-medium"
                    />
                    <p className="text-[11px] text-gray-400 mt-1">
                      Dải thông báo màu vàng đồng chạy trên cùng cùng số Hotline.
                    </p>
                  </div>

                  {/* Footer Description */}
                  <div>
                    <label className="block text-xs font-bold text-charcoal-900 uppercase tracking-wide mb-1.5">
                      Mô Tả Thương Hiệu Chân Trang (Footer Description)
                    </label>
                    <textarea
                      rows={3}
                      value={config.footer_description}
                      onChange={(e) => handleChange('footer_description', e.target.value)}
                      placeholder="Dịch vụ chăm sóc mẹ và bé tại nhà uy tín hàng đầu Hà Nội..."
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-gold-500 focus:ring-2 focus:ring-gold-200 text-sm font-medium leading-relaxed"
                    />
                  </div>

                  {/* Footer Address */}
                  <div>
                    <label className="block text-xs font-bold text-charcoal-900 uppercase tracking-wide mb-1.5">
                      Dòng Địa Chỉ Trụ Sở Chân Trang (Footer Address)
                    </label>
                    <input
                      type="text"
                      value={config.footer_address}
                      onChange={(e) => handleChange('footer_address', e.target.value)}
                      placeholder="Trụ sở: Thượng Thanh, Q. Long Biên, Hà Nội"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-gold-500 focus:ring-2 focus:ring-gold-200 text-sm font-medium"
                    />
                  </div>

                  {/* Footer Disclaimer / Specialist */}
                  <div>
                    <label className="block text-xs font-bold text-charcoal-900 uppercase tracking-wide mb-1.5">
                      Dòng Ghi Chú Chuyên Môn (Bảo Chứng Chuyên Môn)
                    </label>
                    <input
                      type="text"
                      value={config.footer_disclaimer}
                      onChange={(e) => handleChange('footer_disclaimer', e.target.value)}
                      placeholder="Bảo chứng chuyên môn: ĐD. Nguyễn Thúy Ngân"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-gold-500 focus:ring-2 focus:ring-gold-200 text-sm font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Copyright Text */}
                    <div>
                      <label className="block text-xs font-bold text-charcoal-900 uppercase tracking-wide mb-1.5">
                        Dòng Bản Quyền (Copyright Text)
                      </label>
                      <input
                        type="text"
                        value={config.footer_copyright}
                        onChange={(e) => handleChange('footer_copyright', e.target.value)}
                        placeholder="Bản quyền thuộc về Điều Dưỡng Nguyễn Thúy Ngân."
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-gold-500 focus:ring-2 focus:ring-gold-200 text-sm font-medium"
                      />
                    </div>

                    {/* Trust Badge Text */}
                    <div>
                      <label className="block text-xs font-bold text-charcoal-900 uppercase tracking-wide mb-1.5">
                        Huy Hiệu Tin Cậy (Góc Phải Footer)
                      </label>
                      <input
                        type="text"
                        value={config.footer_badge_trust}
                        onChange={(e) => handleChange('footer_badge_trust', e.target.value)}
                        placeholder="An Toàn & Tận Tâm"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-gold-500 focus:ring-2 focus:ring-gold-200 text-sm font-medium"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 6: 4 TRỤ CỘT NIỀM TIN */}
            {activeTab === 'pillars' && (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-6 sm:p-8 space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-charcoal-900 flex items-center gap-2">
                    <Columns className="w-5 h-5 text-gold-600" />
                    <span>4 Trụ Cột Niềm Tin (Nằm Dưới Hero Banner)</span>
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">
                    4 khối giá trị cốt lõi giúp tạo dựng niềm tin tuyệt đối với các mẹ bầu và mẹ bỉm sữa.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  {/* Trụ cột 01 */}
                  <div className="p-5 rounded-xl border border-gray-200 bg-gray-50/70 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-gold-700 uppercase tracking-wider">Trụ Cột 01</span>
                      <span className="text-[11px] text-gray-400 font-semibold">Chuyên Môn</span>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-charcoal-800 uppercase mb-1">
                        Tiêu Đề Trụ Cột 01
                      </label>
                      <input
                        type="text"
                        value={config.pillar1_title}
                        onChange={(e) => handleChange('pillar1_title', e.target.value)}
                        placeholder="Chuyên Môn Đào Tạo Chính Quy"
                        className="w-full px-3.5 py-2 rounded-lg border border-gray-300 text-xs sm:text-sm font-bold bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-charcoal-800 uppercase mb-1">
                        Mô Tả Trụ Cột 01
                      </label>
                      <textarea
                        rows={2}
                        value={config.pillar1_desc}
                        onChange={(e) => handleChange('pillar1_desc', e.target.value)}
                        placeholder="Tốt nghiệp Cao Đẳng Y Tế Hà Nội..."
                        className="w-full px-3.5 py-2 rounded-lg border border-gray-300 text-xs text-gray-700 bg-white"
                      />
                    </div>
                  </div>

                  {/* Trụ cột 02 */}
                  <div className="p-5 rounded-xl border border-gray-200 bg-gray-50/70 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-gold-700 uppercase tracking-wider">Trụ Cột 02</span>
                      <span className="text-[11px] text-gray-400 font-semibold">Tận Tâm</span>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-charcoal-800 uppercase mb-1">
                        Tiêu Đề Trụ Cột 02
                      </label>
                      <input
                        type="text"
                        value={config.pillar2_title}
                        onChange={(e) => handleChange('pillar2_title', e.target.value)}
                        placeholder="Chăm Sóc Nhẹ Nhàng, Tận Tâm"
                        className="w-full px-3.5 py-2 rounded-lg border border-gray-300 text-xs sm:text-sm font-bold bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-charcoal-800 uppercase mb-1">
                        Mô Tả Trụ Cột 02
                      </label>
                      <textarea
                        rows={2}
                        value={config.pillar2_desc}
                        onChange={(e) => handleChange('pillar2_desc', e.target.value)}
                        placeholder="Thương bé như con..."
                        className="w-full px-3.5 py-2 rounded-lg border border-gray-300 text-xs text-gray-700 bg-white"
                      />
                    </div>
                  </div>

                  {/* Trụ cột 03 */}
                  <div className="p-5 rounded-xl border border-gray-200 bg-gray-50/70 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-gold-700 uppercase tracking-wider">Trụ Cột 03</span>
                      <span className="text-[11px] text-gray-400 font-semibold">Dẫn Lưu Bạch Huyết</span>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-charcoal-800 uppercase mb-1">
                        Tiêu Đề Trụ Cột 03
                      </label>
                      <input
                        type="text"
                        value={config.pillar3_title}
                        onChange={(e) => handleChange('pillar3_title', e.target.value)}
                        placeholder="Tích hợp dẫn lưu hệ bạch huyết..."
                        className="w-full px-3.5 py-2 rounded-lg border border-gray-300 text-xs sm:text-sm font-bold bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-charcoal-800 uppercase mb-1">
                        Mô Tả Trụ Cột 03
                      </label>
                      <textarea
                        rows={2}
                        value={config.pillar3_desc}
                        onChange={(e) => handleChange('pillar3_desc', e.target.value)}
                        placeholder="Chăm sóc bầu ngực và tuyến sữa..."
                        className="w-full px-3.5 py-2 rounded-lg border border-gray-300 text-xs text-gray-700 bg-white"
                      />
                    </div>
                  </div>

                  {/* Trụ cột 04 */}
                  <div className="p-5 rounded-xl border border-gray-200 bg-gray-50/70 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-gold-700 uppercase tracking-wider">Trụ Cột 04</span>
                      <span className="text-[11px] text-gray-400 font-semibold">Đồng Hành</span>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-charcoal-800 uppercase mb-1">
                        Tiêu Đề Trụ Cột 04
                      </label>
                      <input
                        type="text"
                        value={config.pillar4_title}
                        onChange={(e) => handleChange('pillar4_title', e.target.value)}
                        placeholder="Đồng hành trọn đời"
                        className="w-full px-3.5 py-2 rounded-lg border border-gray-300 text-xs sm:text-sm font-bold bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-charcoal-800 uppercase mb-1">
                        Mô Tả Trụ Cột 04
                      </label>
                      <textarea
                        rows={2}
                        value={config.pillar4_desc}
                        onChange={(e) => handleChange('pillar4_desc', e.target.value)}
                        placeholder="Hỗ trợ giải đáp thắc mắc..."
                        className="w-full px-3.5 py-2 rounded-lg border border-gray-300 text-xs text-gray-700 bg-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 7: TIÊU ĐỀ DỊCH VỤ & SẢN PHẨM */}
            {activeTab === 'headings' && (
              <div className="space-y-6">
                {/* Phần 1: Tiêu đề Section Dịch Vụ */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-6 sm:p-8 space-y-6">
                  <div>
                    <h2 className="text-lg font-bold text-charcoal-900 flex items-center gap-2">
                      <Stethoscope className="w-5 h-5 text-gold-600" />
                      <span>Tiêu Đề Section "Dịch Vụ Chăm Sóc Mẹ & Bé"</span>
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">
                      Tùy chỉnh câu chữ phần đầu khối giới thiệu các gói dịch vụ (Thông tắc, Tắm bé, Sau sinh).
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                    <div>
                      <label className="block text-xs font-bold text-charcoal-900 uppercase tracking-wide mb-1.5">
                        Badge Tiêu Đề Nhỏ
                      </label>
                      <input
                        type="text"
                        value={config.services_badge}
                        onChange={(e) => handleChange('services_badge', e.target.value)}
                        placeholder="Dịch Vụ Trọng Tâm"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-gold-500 focus:ring-2 focus:ring-gold-200 text-sm font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-charcoal-900 uppercase tracking-wide mb-1.5">
                        Cụm Từ Nổi Bật (Tô Màu Vàng Kim Trong H2)
                      </label>
                      <input
                        type="text"
                        value={config.services_title_highlight}
                        onChange={(e) => handleChange('services_title_highlight', e.target.value)}
                        placeholder="Mẹ Và Bé Tại Nhà"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-gold-500 focus:ring-2 focus:ring-gold-200 text-sm font-medium"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-charcoal-900 uppercase tracking-wide mb-1.5">
                        Tiêu Đề Chính Lớn (H2)
                      </label>
                      <input
                        type="text"
                        value={config.services_title}
                        onChange={(e) => handleChange('services_title', e.target.value)}
                        placeholder="Dịch Vụ Chăm Sóc Mẹ Và Bé Tại Nhà"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-gold-500 focus:ring-2 focus:ring-gold-200 text-sm font-medium"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-charcoal-900 uppercase tracking-wide mb-1.5">
                        Đoạn Mô Tả Phụ Dưới H2
                      </label>
                      <textarea
                        rows={2}
                        value={config.services_subtitle}
                        onChange={(e) => handleChange('services_subtitle', e.target.value)}
                        placeholder="Bảng giá niêm yết công khai, minh bạch rõ ràng..."
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-gold-500 focus:ring-2 focus:ring-gold-200 text-sm font-medium"
                      />
                    </div>
                  </div>
                </div>

                {/* Phần 2: Tiêu đề Section Sản Phẩm */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-6 sm:p-8 space-y-6">
                  <div>
                    <h2 className="text-lg font-bold text-charcoal-900 flex items-center gap-2">
                      <ShoppingBag className="w-5 h-5 text-gold-600" />
                      <span>Tiêu Đề Section "Sản Phẩm Thiên Nhiên & Affiliate"</span>
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">
                      Tùy chỉnh câu chữ phần đầu khối giới thiệu sản phẩm thảo mộc và link liên kết.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                    <div>
                      <label className="block text-xs font-bold text-charcoal-900 uppercase tracking-wide mb-1.5">
                        Badge Tiêu Đề Nhỏ
                      </label>
                      <input
                        type="text"
                        value={config.products_badge}
                        onChange={(e) => handleChange('products_badge', e.target.value)}
                        placeholder="Thảo Mộc Cung Đình & Tự Nhiên"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-gold-500 focus:ring-2 focus:ring-gold-200 text-sm font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-charcoal-900 uppercase tracking-wide mb-1.5">
                        Cụm Từ Nổi Bật (Tô Màu Vàng Kim Trong H2)
                      </label>
                      <input
                        type="text"
                        value={config.products_title_highlight}
                        onChange={(e) => handleChange('products_title_highlight', e.target.value)}
                        placeholder="Lành Tính Cho Mẹ & Bé"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-gold-500 focus:ring-2 focus:ring-gold-200 text-sm font-medium"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-charcoal-900 uppercase tracking-wide mb-1.5">
                        Tiêu Đề Chính Lớn (H2)
                      </label>
                      <input
                        type="text"
                        value={config.products_title}
                        onChange={(e) => handleChange('products_title', e.target.value)}
                        placeholder="Sản Phẩm Thiên Nhiên Lành Tính Cho Mẹ & Bé"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-gold-500 focus:ring-2 focus:ring-gold-200 text-sm font-medium"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-charcoal-900 uppercase tracking-wide mb-1.5">
                        Đoạn Mô Tả Phụ Dưới H2
                      </label>
                      <textarea
                        rows={2}
                        value={config.products_subtitle}
                        onChange={(e) => handleChange('products_subtitle', e.target.value)}
                        placeholder="Nguồn gốc xuất xứ rõ ràng, chưng cất thủ công..."
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-gold-500 focus:ring-2 focus:ring-gold-200 text-sm font-medium"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Floating Save Button Bar for Convenience */}
            <div className="sticky bottom-4 z-20 bg-charcoal-900/90 backdrop-blur-md text-white p-4 rounded-2xl border border-gray-700 shadow-2xl flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="hidden sm:inline">Nội dung sẽ được cập nhật tức thì trên website khi lưu</span>
                <span className="sm:hidden">Sẵn sàng lưu nội dung</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSave()}
                  disabled={saving || loading}
                  className="px-6 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-600 active:scale-95 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-gold-soft transition-all disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Đang Lưu Dữ Liệu...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Lưu Thay Đổi Ngay</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
