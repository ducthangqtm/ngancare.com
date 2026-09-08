'use client';

import React, { useState, useEffect } from 'react';
import AdminNav from '@/components/AdminNav';
import { FileText, Plus, Trash2, Edit3, Eye, Check, X, Sparkles, Globe, Loader2 } from 'lucide-react';
import { BlogPost } from '@/lib/types';
import { INITIAL_POSTS } from '@/lib/seed-data';

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  // Fetch live posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/admin/posts');
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          setPosts(data.data);
        }
      } catch (e) {
        // Fallback
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // Form fields
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('Thông Tắc Tia Sữa');
  const [author, setAuthor] = useState('Điều Dưỡng Nguyễn Thúy Ngân');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [isPublished, setIsPublished] = useState(1);

  const generateSlug = (val: string) => {
    return val
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'd')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (!editId) {
      const generated = generateSlug(val);
      setSlug(generated);
      setMetaTitle(val + ' | Ngân Care');
    }
  };

  const handleOpenAdd = () => {
    setEditId(null);
    setTitle('');
    setSlug('');
    setExcerpt('');
    setContent('<h2>1. Tiêu đề mục nội dung</h2>\n<p>Nội dung chia sẻ y khoa chi tiết...</p>');
    setMetaTitle('');
    setMetaDescription('');
    setIsPublished(1);
    setIsEditing(true);
  };

  const handleOpenEdit = (post: BlogPost) => {
    setEditId(post.id);
    setTitle(post.title);
    setSlug(post.slug);
    setCategory(post.category);
    setAuthor(post.author);
    setExcerpt(post.excerpt);
    setContent(post.content);
    setMetaTitle(post.meta_title || post.title);
    setMetaDescription(post.meta_description || post.excerpt);
    setIsPublished(post.is_published);
    setIsEditing(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !slug.trim() || !content.trim()) return;

    if (editId) {
      // Update
      const updatedPost: Partial<BlogPost> = {
        id: editId,
        title,
        slug,
        category,
        author,
        excerpt,
        content,
        meta_title: metaTitle,
        meta_description: metaDescription,
        is_published: isPublished,
      };

      try {
        await fetch('/api/admin/posts', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedPost),
        });
      } catch (e) {}

      setPosts(posts.map((p) => (p.id === editId ? ({ ...p, ...updatedPost } as BlogPost) : p)));
    } else {
      // Create
      const newPost: BlogPost = {
        id: 'post-' + Date.now(),
        title,
        slug,
        category,
        author,
        excerpt,
        content,
        cover_image: '/images/banner.jpg',
        views: 0,
        is_published: isPublished,
        meta_title: metaTitle,
        meta_description: metaDescription,
        created_at: new Date().toISOString(),
      };

      try {
        await fetch('/api/admin/posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newPost),
        });
      } catch (e) {}

      setPosts([newPost, ...posts]);
    }

    setIsEditing(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa bài viết này?')) return;
    try {
      await fetch(`/api/admin/posts?id=${id}`, { method: 'DELETE' });
    } catch (e) {}
    setPosts(posts.filter((p) => p.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <AdminNav />

      <main className="flex-1 p-6 sm:p-10 max-w-7xl overflow-x-auto">
        <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-charcoal-900">Quản Lý Bài Viết Blog</h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Soạn thảo bài viết chia sẻ kiến thức chuẩn YMYL, tối ưu thẻ tiêu đề và meta description cho Google.
            </p>
          </div>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-white font-bold text-xs sm:text-sm shadow-sm flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Viết Bài Mới</span>
          </button>
        </div>

        {/* Editor Modal / Section */}
        {isEditing && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gold-300 shadow-lg mb-8">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-charcoal-900 flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-gold-600" />
                <span>{editId ? 'Chỉnh Sửa Bài Viết' : 'Soạn Thảo Bài Viết Mới'}</span>
              </h3>
              <button
                onClick={() => setIsEditing(false)}
                className="p-1.5 text-gray-400 hover:text-charcoal-900 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-charcoal-900 mb-1">Tiêu Đề Bài Viết *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={handleTitleChange}
                    placeholder="Ví dụ: Cách xử trí tắc tia sữa tại nhà an toàn"
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 focus:border-gold-500 outline-none text-sm font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-charcoal-900 mb-1">Danh Mục</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 focus:border-gold-500 outline-none bg-white"
                  >
                    <option value="Thông Tắc Tia Sữa">Thông Tắc Tia Sữa</option>
                    <option value="Tắm Bé Sơ Sinh">Tắm Bé Sơ Sinh</option>
                    <option value="Chăm Sóc Sau Sinh">Chăm Sóc Sau Sinh</option>
                    <option value="Dinh Dưỡng Mẹ Bỉm">Dinh Dưỡng Mẹ Bỉm</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-charcoal-900 mb-1">Slug (Đường Dẫn Tĩnh) *</label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 focus:border-gold-500 outline-none text-gray-600 bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block font-bold text-charcoal-900 mb-1">Tác Giả & Cố Vấn Y Khoa</label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 focus:border-gold-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-charcoal-900 mb-1">Tóm Tắt Bài Viết (Excerpt)</label>
                <textarea
                  rows={2}
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Mô tả tóm lược 2-3 câu khái quát nội dung y khoa..."
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 focus:border-gold-500 outline-none"
                />
              </div>

              {/* Rich Content Editor */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-bold text-charcoal-900">
                    Nội Dung Bài Viết (Hỗ trợ thẻ HTML: &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;strong&gt;) *
                  </label>
                  <span className="text-[11px] text-gray-400">Chuẩn SEO cấu trúc đề mục</span>
                </div>
                <textarea
                  rows={10}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Nhập nội dung bài viết định dạng HTML..."
                  className="w-full p-4 rounded-xl border border-gray-300 focus:border-gold-500 outline-none font-mono text-xs leading-relaxed"
                />
              </div>

              {/* SEO Meta Box */}
              <div className="p-4 rounded-xl bg-gold-50/60 border border-gold-200 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-gold-800 uppercase tracking-wide">
                  <Globe className="w-4 h-4" />
                  <span>Tối Ưu SEO Google (Meta Tags)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-charcoal-900 mb-1">SEO Title Tag</label>
                    <input
                      type="text"
                      value={metaTitle}
                      onChange={(e) => setMetaTitle(e.target.value)}
                      placeholder="Tiêu đề hiển thị trên kết quả tìm kiếm..."
                      className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-charcoal-900 mb-1">SEO Meta Description</label>
                    <input
                      type="text"
                      value={metaDescription}
                      onChange={(e) => setMetaDescription(e.target.value)}
                      placeholder="Mô tả dưới 160 ký tự..."
                      className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isPublished === 1}
                    onChange={(e) => setIsPublished(e.target.checked ? 1 : 0)}
                    className="w-4 h-4 text-gold-600 rounded border-gray-300 focus:ring-gold-500"
                  />
                  <span className="font-semibold text-xs text-charcoal-900">Xuất bản công khai</span>
                </label>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl bg-gold-500 hover:bg-gold-600 text-white font-bold"
                  >
                    {editId ? 'Lưu Cập Nhật' : 'Đăng Bài Viết'}
                  </button>
                </div>
              </div>

            </form>
          </div>
        )}

        {/* Posts Table */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-gray-50 text-gray-500 uppercase text-[11px] font-bold border-b border-gray-200">
                <tr>
                  <th className="py-3.5 px-4">Tiêu Đề Bài Viết</th>
                  <th className="py-3.5 px-4">Danh Mục</th>
                  <th className="py-3.5 px-4">Lượt Xem</th>
                  <th className="py-3.5 px-4">Trạng Thái</th>
                  <th className="py-3.5 px-4 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-gray-500">
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="w-5 h-5 text-gold-500 animate-spin" />
                        <span>Đang đồng bộ dữ liệu bài viết...</span>
                      </div>
                    </td>
                  </tr>
                ) : posts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-gray-400">
                      Chưa có bài viết nào.
                    </td>
                  </tr>
                ) : (
                  posts.map((p) => (
                  <tr key={p.id} className="hover:bg-cream-50/50 transition-colors">
                    <td className="py-4 px-4 max-w-md">
                      <p className="font-bold text-charcoal-900 line-clamp-1">{p.title}</p>
                      <p className="text-gray-400 text-[11px]">/blog/{p.slug}</p>
                    </td>

                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-gold-100 text-gold-800">
                        {p.category}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-gray-600">
                      {p.views} views
                    </td>

                    <td className="py-4 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                          p.is_published === 1
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        {p.is_published === 1 ? 'Đã xuất bản' : 'Bản nháp'}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Xóa bài viết"
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
