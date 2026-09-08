'use client';

import React, { useState, useEffect } from 'react';
import AdminNav from '@/components/AdminNav';
import { ShoppingBag, Plus, Trash2, Edit2, X, ExternalLink, Sparkles, Image as ImageIcon, Link2 } from 'lucide-react';
import { Service } from '@/lib/types';
import { INITIAL_SERVICES } from '@/lib/seed-data';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Service[]>(
    INITIAL_SERVICES.filter((s) => s.category === 'san_pham')
  );
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [price, setPrice] = useState<string>('180000');
  const [affiliateUrl, setAffiliateUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('/images/banner.jpg');
  const [description, setDescription] = useState('');
  const [featuresInput, setFeaturesInput] = useState('');

  // Fetch live products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/admin/products');
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          setProducts(data.data);
        }
      } catch (e) {
        // Fallback to initial
      }
    };
    fetchProducts();
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
    setPrice('180000');
    setAffiliateUrl('');
    setImageUrl('/images/banner.jpg');
    setDescription('');
    setFeaturesInput('');
    setIsAdding(true);
  };

  const handleStartEdit = (item: Service) => {
    setEditingId(item.id);
    setName(item.name);
    setSlug(item.slug);
    setPrice(item.price !== null && item.price !== undefined ? item.price.toString() : '');
    setAffiliateUrl(item.affiliate_url || '');
    setImageUrl(item.image_url || '/images/banner.jpg');
    setDescription(item.description || '');
    setFeaturesInput(item.features && Array.isArray(item.features) ? item.features.join('\n') : '');
    setIsAdding(true);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !slug.trim()) return;

    const productData = {
      name: name.trim(),
      slug: slug.trim(),
      category: 'san_pham' as const,
      price: price ? parseFloat(price) : null,
      duration: null,
      affiliate_url: affiliateUrl.trim(),
      image_url: imageUrl.trim() || '/images/banner.jpg',
      description: description.trim(),
      features: featuresInput
        .split('\n')
        .map((f) => f.trim())
        .filter(Boolean),
      is_active: 1,
    };

    if (editingId) {
      // Update
      try {
        await fetch('/api/admin/products', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingId, ...productData }),
        });
      } catch (e) {}

      setProducts(products.map((p) => (p.id === editingId ? ({ ...p, ...productData } as Service) : p)));
    } else {
      // Create new
      const newProd: Service = {
        id: 'sp-' + Date.now(),
        ...productData,
      };

      try {
        await fetch('/api/admin/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newProd),
        });
      } catch (e) {}

      setProducts([newProd, ...products]);
    }

    setIsAdding(false);
    setEditingId(null);
    setName('');
    setSlug('');
    setAffiliateUrl('');
    setDescription('');
    setFeaturesInput('');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa sản phẩm này?')) return;
    try {
      await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE' });
    } catch (e) {}
    setProducts(products.filter((p) => p.id !== id));
  };

  const handleToggleActive = async (id: string, currentStatus: number) => {
    const updated = currentStatus === 1 ? 0 : 1;
    try {
      await fetch('/api/admin/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, is_active: updated }),
      });
    } catch (e) {}
    setProducts(products.map((p) => (p.id === id ? { ...p, is_active: updated } : p)));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <AdminNav />

      <main className="flex-1 p-6 sm:p-10 max-w-7xl overflow-x-auto">
        <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-charcoal-900 flex items-center gap-2.5">
              <ShoppingBag className="w-7 h-7 text-gold-600" />
              <span>Sản Phẩm & Tiếp Thị Liên Kết (Affiliate)</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Quản lý sản phẩm hữu cơ mẹ bé và gắn link affiliate (Shopee, TikTok Shop, Lazada) để nhận hoa hồng.
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
            <span>{isAdding ? 'Đóng Form' : 'Thêm Sản Phẩm Mới'}</span>
          </button>
        </div>

        {/* Form thêm / sửa sản phẩm */}
        {isAdding && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border-2 border-gold-400 shadow-md mb-8 transition-all">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-charcoal-900 flex items-center gap-2">
                {editingId ? (
                  <>
                    <Edit2 className="w-5 h-5 text-gold-600" />
                    <span>Chỉnh Sửa Sản Phẩm</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 text-gold-600" />
                    <span>Thêm Mới Sản Phẩm Thiên Nhiên & Link Affiliate</span>
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

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-charcoal-900 mb-1">Tên Sản Phẩm *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={handleNameChange}
                    placeholder="Ví dụ: Cao Chè Vằng Sẻ Quảng Trị"
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-charcoal-900 mb-1">Giá Bán Niêm Yết (VNĐ)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Ví dụ: 180000"
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 focus:border-gold-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-charcoal-900 mb-1">Link Ảnh Sản Phẩm</label>
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="/images/banner.jpg hoặc https://..."
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 focus:border-gold-500 outline-none text-gray-600"
                  />
                </div>
              </div>

              {/* Link Affiliate Input */}
              <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200">
                <label className="block font-bold text-charcoal-900 mb-1 flex items-center gap-1.5">
                  <Link2 className="w-4 h-4 text-amber-600" />
                  <span>Link Tiếp Thị Liên Kết (Affiliate Link Shopee / TikTok Shop / Lazada)</span>
                </label>
                <input
                  type="url"
                  value={affiliateUrl}
                  onChange={(e) => setAffiliateUrl(e.target.value)}
                  placeholder="Ví dụ: https://shope.ee/xxxxx hoặc https://vt.tiktok.com/xxxxx"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-amber-300 focus:border-amber-500 outline-none bg-white text-charcoal-900 text-xs sm:text-sm shadow-sm"
                />
                <p className="text-[11px] text-amber-700 mt-1.5 leading-relaxed">
                  💡 <strong>Gợi ý:</strong> Khi bạn dán link Affiliate, trên trang chủ khách hàng sẽ thấy nút <strong>"Mua Trên Shopee / Sàn TMĐT"</strong>. Khách bấm mua bạn sẽ nhận hoa hồng tự động! Nếu để trống, hệ thống sẽ mặc định dẫn khách nhắn tin qua <strong>Zalo</strong>.
                </p>
              </div>

              <div>
                <label className="block font-bold text-charcoal-900 mb-1">Mô Tả Sản Phẩm</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Nguồn gốc xuất xứ, thành phần, cách dùng an toàn..."
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 focus:border-gold-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-charcoal-900 mb-1">
                  Công Dụng Nổi Bật (Mỗi dòng một đặc điểm)
                </label>
                <textarea
                  rows={3}
                  value={featuresInput}
                  onChange={(e) => setFeaturesInput(e.target.value)}
                  placeholder="100% nguyên chất không phụ gia&#10;Kích thích sữa mẹ đặc thơm&#10;Dưỡng ấm cơ thể sau sinh"
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
                  {editingId ? 'Cập Nhật Sản Phẩm' : 'Lưu Sản Phẩm Mới'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Bảng danh sách sản phẩm */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-gray-50 text-gray-500 uppercase text-[11px] font-bold border-b border-gray-200">
                <tr>
                  <th className="py-3.5 px-4">Tên Sản Phẩm</th>
                  <th className="py-3.5 px-4">Đơn Giá</th>
                  <th className="py-3.5 px-4">Link Affiliate (Tiếp Thị)</th>
                  <th className="py-3.5 px-4">Trạng Thái</th>
                  <th className="py-3.5 px-4 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((item) => (
                  <tr key={item.id} className="hover:bg-cream-50/50 transition-colors">
                    <td className="py-4 px-4 max-w-xs">
                      <p className="font-bold text-charcoal-900">{item.name}</p>
                      <p className="text-gray-400 text-[11px]">/{item.slug}</p>
                    </td>

                    <td className="py-4 px-4 font-bold text-gold-600 whitespace-nowrap">
                      {item.price ? item.price.toLocaleString('vi-VN') + 'đ' : '—'}
                    </td>

                    <td className="py-4 px-4">
                      {item.affiliate_url ? (
                        <a
                          href={item.affiliate_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-100 hover:bg-amber-200 text-amber-900 transition-colors max-w-[200px] truncate"
                          title={item.affiliate_url}
                        >
                          <ExternalLink className="w-3.5 h-3.5 flex-shrink-0 text-amber-700" />
                          <span className="truncate">Link Affiliate</span>
                        </a>
                      ) : (
                        <span className="text-xs text-gray-400 italic">Tư vấn qua Zalo</span>
                      )}
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
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

                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleStartEdit(item)}
                          className="p-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Chỉnh sửa sản phẩm và link affiliate"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Xóa sản phẩm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}
