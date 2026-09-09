'use client';

import React, { useState, useEffect } from 'react';
import AdminNav from '@/components/AdminNav';
import { Package, Plus, Trash2, Edit2, Check, X, Clock, DollarSign, Sparkles, Loader2 } from 'lucide-react';
import { Service, ServiceCategory } from '@/lib/types';
import { INITIAL_SERVICES } from '@/lib/seed-data';

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState<ServiceCategory>('thong_tac');
  const [price, setPrice] = useState<string>('350000');
  const [duration, setDuration] = useState<string>('75');
  const [description, setDescription] = useState('');
  const [featuresInput, setFeaturesInput] = useState('');

  // Fetch live services from D1 database
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch('/api/admin/services');
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          setServices(data.data.filter((s: Service) => s.category !== 'san_pham'));
        }
      } catch (e) {
        // Fallback to initial services
      } finally {
        setIsLoading(false);
      }
    };
    fetchServices();
  }, []);

  const generateSlug = (val: string) => {
    return val
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'd')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    if (!editingId) {
      setSlug(generateSlug(e.target.value));
    }
  };

  const handleStartAdd = () => {
    setEditingId(null);
    setName('');
    setSlug('');
    setCategory('thong_tac');
    setPrice('350000');
    setDuration('75');
    setDescription('');
    setFeaturesInput('');
    setIsAdding(true);
  };

  const handleStartEdit = (item: Service) => {
    setEditingId(item.id);
    setName(item.name);
    setSlug(item.slug);
    setCategory(item.category);
    setPrice(item.price !== null && item.price !== undefined ? item.price.toString() : '');
    setDuration(item.duration !== null && item.duration !== undefined ? item.duration.toString() : '');
    setDescription(item.description || '');
    setFeaturesInput(item.features && Array.isArray(item.features) ? item.features.join('\n') : '');
    setIsAdding(true);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !slug.trim()) return;

    const serviceData = {
      name: name.trim(),
      slug: slug.trim(),
      category,
      price: price ? parseFloat(price) : null,
      duration: duration && category !== 'san_pham' ? parseInt(duration) : null,
      description: description.trim(),
      features: featuresInput
        .split('\n')
        .map((f) => f.trim())
        .filter(Boolean),
      image_url: '/images/banner.jpg',
      is_active: 1,
    };

    if (editingId) {
      // Cập nhật dịch vụ đã có
      try {
        await fetch('/api/admin/services', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingId, ...serviceData }),
        });
      } catch (e) {}

      setServices(services.map((s) => (s.id === editingId ? ({ ...s, ...serviceData } as Service) : s)));
    } else {
      // Thêm mới dịch vụ
      const newSrv: Service = {
        id: (category === 'san_pham' ? 'sp-' : 'srv-') + Date.now(),
        ...serviceData,
      };

      try {
        await fetch('/api/admin/services', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newSrv),
        });
      } catch (e) {}

      setServices([newSrv, ...services]);
    }

    setIsAdding(false);
    setEditingId(null);
    setName('');
    setSlug('');
    setDescription('');
    setFeaturesInput('');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa dịch vụ/sản phẩm này?')) return;
    try {
      await fetch(`/api/admin/services?id=${id}`, { method: 'DELETE' });
    } catch (e) {}
    setServices(services.filter((s) => s.id !== id));
  };

  const handleToggleActive = async (id: string, currentStatus: number) => {
    const updated = currentStatus === 1 ? 0 : 1;
    try {
      await fetch('/api/admin/services', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, is_active: updated }),
      });
    } catch (e) {}
    setServices(services.map((s) => (s.id === id ? { ...s, is_active: updated } : s)));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <AdminNav />

      <main className="flex-1 p-6 sm:p-10 max-w-7xl overflow-x-auto">
        <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-charcoal-900">Dịch Vụ Y Tế</h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Quản lý danh sách dịch vụ chăm sóc mẹ và bé tại nhà (thông tắc tia sữa, tắm bé, sau sinh, massage bầu).
            </p>
          </div>

          <button
            onClick={() => {
              if (isAdding) {
                setIsAdding(false);
                setEditingId(null);
              } else {
                handleStartAdd();
              }
            }}
            className="px-4 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-white font-bold text-xs sm:text-sm shadow-sm flex items-center gap-2 transition-all"
          >
            {isAdding ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            <span>{isAdding ? 'Đóng Form' : 'Thêm Dịch Vụ Y Tế'}</span>
          </button>
        </div>

        {/* Form thêm / chỉnh sửa */}
        {isAdding && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border-2 border-gold-400 shadow-md mb-8 transition-all">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-charcoal-900 flex items-center gap-2">
                {editingId ? (
                  <>
                    <Edit2 className="w-5 h-5 text-gold-600" />
                    <span>Chỉnh Sửa Dịch Vụ Y Tế</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 text-gold-600" />
                    <span>Thêm Mới Dịch Vụ Y Tế</span>
                  </>
                )}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsAdding(false);
                  setEditingId(null);
                }}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveService} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-charcoal-900 mb-1">Tên Dịch Vụ *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={handleNameChange}
                    placeholder="Ví dụ: Thông Tắc Tia Sữa Cấp Tốc"
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 focus:border-gold-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-charcoal-900 mb-1">Đường Dẫn Tĩnh (Slug) *</label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 focus:border-gold-500 outline-none text-gray-600 bg-gray-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-charcoal-900 mb-1">Danh Mục Dịch Vụ</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ServiceCategory)}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 focus:border-gold-500 outline-none bg-white"
                  >
                    <option value="thong_tac">Thông Tắc Tia Sữa</option>
                    <option value="tam_be">Tắm Bé Sơ Sinh</option>
                    <option value="sau_sinh">Chăm Sóc Sau Sinh</option>
                    <option value="me_bau">Massage Mẹ Bầu</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-charcoal-900 mb-1">Giá Niêm Yết (VNĐ)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Ví dụ: 350000"
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 focus:border-gold-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-charcoal-900 mb-1">Thời Lượng (Phút)</label>
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="Ví dụ: 75"
                    disabled={category === 'san_pham'}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 focus:border-gold-500 outline-none disabled:bg-gray-100"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-charcoal-900 mb-1">Mô Tả Ngắn</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Mô tả kỹ thuật y tế, công nghệ áp dụng..."
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 focus:border-gold-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-charcoal-900 mb-1">
                  Đặc Điểm Nổi Bật (Mỗi dòng một đặc điểm)
                </label>
                <textarea
                  rows={3}
                  value={featuresInput}
                  onChange={(e) => setFeaturesInput(e.target.value)}
                  placeholder="Không đau đớn&#10;Chuẩn y tế vô khuẩn 100%&#10;Điều dưỡng kinh nghiệm"
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 focus:border-gold-500 outline-none font-mono text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsAdding(false);
                    setEditingId(null);
                  }}
                  className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-gold-500 hover:bg-gold-600 text-white font-bold shadow-sm transition-all"
                >
                  {editingId ? 'Cập Nhật Thay Đổi' : 'Lưu Dịch Vụ Mới'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 1. GIAO DIỆN DÀNH CHO MOBILE (HIỂN THỊ DẠNG THẺ THÔNG MINH DỄ NHÌN) */}
        <div className="block md:hidden space-y-3.5 mb-6">
          {isLoading ? (
            <div className="bg-white p-8 rounded-2xl border border-gray-200 text-center text-gray-500">
              <Loader2 className="w-6 h-6 text-gold-500 animate-spin mx-auto mb-2" />
              <span className="text-xs">Đang tải danh sách dịch vụ...</span>
            </div>
          ) : services.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-gray-200 text-center text-gray-400 text-xs">
              Chưa có dịch vụ nào.
            </div>
          ) : (
            services.map((item) => (
              <div
                key={`mob-${item.id}`}
                className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm space-y-3"
              >
                {/* Header card: Tên dịch vụ + Trạng thái hiển thị */}
                <div className="flex items-start justify-between gap-2 border-b border-gray-100 pb-2.5">
                  <div>
                    <h3 className="text-sm font-extrabold text-charcoal-900">{item.name}</h3>
                    <p className="text-[11px] text-gray-400 mt-0.5">/{item.slug}</p>
                  </div>
                  <button
                    onClick={() => handleToggleActive(item.id, item.is_active)}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex-shrink-0 transition-colors ${
                      item.is_active === 1
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {item.is_active === 1 ? 'Đang hiển thị' : 'Đã ẩn'}
                  </button>
                </div>

                {/* Thông tin: Danh mục, Giá, Thời lượng */}
                <div className="bg-cream-50/80 p-3 rounded-xl border border-gold-100/70 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-gold-100 text-gold-800">
                      {item.category === 'thong_tac'
                        ? 'Thông Tia Sữa'
                        : item.category === 'tam_be'
                        ? 'Tắm Bé'
                        : item.category === 'sau_sinh'
                        ? 'Sau Sinh'
                        : item.category === 'me_bau'
                        ? 'Mẹ Bầu'
                        : 'Sản Phẩm'}
                    </span>
                    <span className="text-xs text-gray-500 font-medium">
                      ⏱ {item.duration ? `${item.duration} phút` : '—'}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between pt-1 border-t border-gold-200/50">
                    <span className="text-gray-500 font-medium text-xs">Đơn giá:</span>
                    <span className="text-base font-black text-gold-600">
                      {item.price ? item.price.toLocaleString('vi-VN') + 'đ' : '—'}
                    </span>
                  </div>
                </div>

                {/* Nút bấm thao tác */}
                <div className="pt-1 flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleStartEdit(item)}
                    className="flex-1 py-2 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Chỉnh Sửa</span>
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="py-2 px-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                    title="Xóa dịch vụ này"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Xóa</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* 2. BẢNG DÀNH CHO DESKTOP / IPAD (MÀN HÌNH >= 768px) */}
        <div className="hidden md:block bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-gray-50 text-gray-500 uppercase text-[11px] font-bold border-b border-gray-200">
                <tr>
                  <th className="py-3.5 px-4">Tên Dịch Vụ / Sản Phẩm</th>
                  <th className="py-3.5 px-4">Danh Mục</th>
                  <th className="py-3.5 px-4">Đơn Giá</th>
                  <th className="py-3.5 px-4">Thời Lượng</th>
                  <th className="py-3.5 px-4">Trạng Thái</th>
                  <th className="py-3.5 px-4 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-gray-500">
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="w-5 h-5 text-gold-500 animate-spin" />
                        <span>Đang đồng bộ dữ liệu dịch vụ...</span>
                      </div>
                    </td>
                  </tr>
                ) : services.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-gray-400">
                      Chưa có dịch vụ nào.
                    </td>
                  </tr>
                ) : (
                  services.map((item) => (
                  <tr key={item.id} className="hover:bg-cream-50/50 transition-colors">
                    <td className="py-4 px-4">
                      <p className="font-bold text-charcoal-900">{item.name}</p>
                      <p className="text-gray-400 text-[11px]">/{item.slug}</p>
                    </td>

                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-gold-100 text-gold-800">
                        {item.category === 'thong_tac'
                          ? 'Thông Tia Sữa'
                          : item.category === 'tam_be'
                          ? 'Tắm Bé'
                          : item.category === 'sau_sinh'
                          ? 'Sau Sinh'
                          : item.category === 'me_bau'
                          ? 'Mẹ Bầu'
                          : 'Sản Phẩm'}
                      </span>
                    </td>

                    <td className="py-4 px-4 font-bold text-gold-600">
                      {item.price ? item.price.toLocaleString('vi-VN') + 'đ' : '—'}
                    </td>

                    <td className="py-4 px-4 text-gray-600">
                      {item.duration ? `${item.duration} phút` : '—'}
                    </td>

                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleToggleActive(item.id, item.is_active)}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors ${
                          item.is_active === 1
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        {item.is_active === 1 ? 'Đang hiển thị' : 'Đã ẩn'}
                      </button>
                    </td>

                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleStartEdit(item)}
                          className="p-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Chỉnh sửa dịch vụ này"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Xóa mục này"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )))}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}
