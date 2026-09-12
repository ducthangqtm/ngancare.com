'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import AdminNav from '@/components/AdminNav';
import {
  FileText,
  Plus,
  Trash2,
  Edit3,
  Eye,
  Check,
  X,
  Sparkles,
  Globe,
  Loader2,
  Image as ImageIcon,
  Heading,
  Heading2,
  Bold,
  Italic,
  List,
  ListOrdered,
  Lightbulb,
  Upload,
  Link2,
} from 'lucide-react';
import { BlogPost } from '@/lib/types';
import { INITIAL_POSTS } from '@/lib/seed-data';

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  // Form fields
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('Thông Tắc Tia Sữa');
  const [author, setAuthor] = useState('Điều Dưỡng Nguyễn Thúy Ngân');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('/images/banner.jpg');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [isPublished, setIsPublished] = useState(1);

  // Editor tab & upload helpers
  const [editorTab, setEditorTab] = useState<'edit' | 'preview'>('edit');
  const [showImgModal, setShowImgModal] = useState(false);
  const [inlineImgUrl, setInlineImgUrl] = useState('');
  const [inlineImgCaption, setInlineImgCaption] = useState('');

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const coverFileInputRef = useRef<HTMLInputElement>(null);
  const inlineFileInputRef = useRef<HTMLInputElement>(null);

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
    setContent(
      '<h2>1. Dấu hiệu nhận biết sớm</h2>\n<p>Mẹ cần theo dõi các biểu hiện sau...</p>\n\n<h2>2. Hướng dẫn các bước xử trí</h2>\n<p>Các bước chăm sóc nhẹ nhàng tại nhà...</p>'
    );
    setCoverImage('/images/banner.jpg');
    setMetaTitle('');
    setMetaDescription('');
    setIsPublished(1);
    setEditorTab('edit');
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
    setCoverImage(post.cover_image || '/images/banner.jpg');
    setMetaTitle(post.meta_title || post.title);
    setMetaDescription(post.meta_description || post.excerpt);
    setIsPublished(post.is_published);
    setEditorTab('edit');
    setIsEditing(true);
  };

  // Helper: insert formatting into textarea without knowing HTML
  const insertFormatting = (prefix: string, suffix = '', defaultText = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end) || defaultText;

    const before = text.substring(0, start);
    const after = text.substring(end);

    const newText = before + prefix + selectedText + suffix + after;
    setContent(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + selectedText.length
      );
    }, 0);
  };

  // Cover image upload
  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      alert('Vui lòng chọn ảnh dung lượng dưới 3MB để tải nhanh.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setCoverImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Inline content image upload from file
  const handleInlineImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      alert('Vui lòng chọn ảnh dung lượng dưới 3MB để bài viết tải mượt.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      const caption = prompt('Nhập chú thích ảnh (hoặc bấm OK để bỏ qua):', file.name.replace(/\.[^/.]+$/, '')) || '';
      const imgHtml = `\n<figure class="my-6 text-center">\n  <img src="${base64}" alt="${caption || 'Hình ảnh cẩm nang Ngân Care'}" class="rounded-2xl mx-auto shadow-md max-h-96 object-cover border border-gold-200" />\n  ${caption ? `<figcaption class="text-xs text-gray-500 mt-2 italic">${caption}</figcaption>` : ''}\n</figure>\n`;
      insertFormatting(imgHtml);
    };
    reader.readAsDataURL(file);
  };

  // Inline content image from URL
  const handleInsertImageUrl = () => {
    if (!inlineImgUrl.trim()) return;
    const imgHtml = `\n<figure class="my-6 text-center">\n  <img src="${inlineImgUrl.trim()}" alt="${inlineImgCaption.trim() || 'Hình ảnh cẩm nang Ngân Care'}" class="rounded-2xl mx-auto shadow-md max-h-96 object-cover border border-gold-200" />\n  ${inlineImgCaption.trim() ? `<figcaption class="text-xs text-gray-500 mt-2 italic">${inlineImgCaption.trim()}</figcaption>` : ''}\n</figure>\n`;
    insertFormatting(imgHtml);
    setInlineImgUrl('');
    setInlineImgCaption('');
    setShowImgModal(false);
  };

  // Smart auto-formatter: if plain text without HTML, convert double linebreaks into paragraphs
  const autoFormatPlainText = (raw: string) => {
    if (raw.includes('<h') || raw.includes('<p') || raw.includes('<ul') || raw.includes('<div') || raw.includes('<figure')) {
      return raw;
    }
    return raw
      .split(/\n\s*\n/)
      .map((para) => `<p>${para.replace(/\n/g, '<br/>')}</p>`)
      .join('\n');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !slug.trim() || !content.trim()) return;

    const formattedContent = autoFormatPlainText(content);

    if (editId) {
      // Update
      const updatedPost: Partial<BlogPost> = {
        id: editId,
        title: title.trim(),
        slug: slug.trim(),
        category,
        author: author.trim(),
        excerpt: excerpt.trim(),
        content: formattedContent,
        cover_image: coverImage || '/images/banner.jpg',
        meta_title: metaTitle.trim() || title.trim(),
        meta_description: metaDescription.trim() || excerpt.trim(),
        is_published: isPublished,
      };

      try {
        await fetch('/api/admin/posts', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedPost),
        });
      } catch (err) {}

      setPosts(posts.map((p) => (p.id === editId ? ({ ...p, ...updatedPost } as BlogPost) : p)));
    } else {
      // Create
      const newPost: BlogPost = {
        id: 'post-' + Date.now(),
        title: title.trim(),
        slug: slug.trim(),
        category,
        author: author.trim(),
        excerpt: excerpt.trim(),
        content: formattedContent,
        cover_image: coverImage || '/images/banner.jpg',
        views: 0,
        is_published: isPublished,
        meta_title: metaTitle.trim() || title.trim(),
        meta_description: metaDescription.trim() || excerpt.trim(),
        created_at: new Date().toISOString(),
      };

      try {
        await fetch('/api/admin/posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newPost),
        });
      } catch (err) {}

      setPosts([newPost, ...posts]);
    }

    setIsEditing(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa bài viết này?')) return;
    try {
      await fetch(`/api/admin/posts?id=${id}`, { method: 'DELETE' });
    } catch (err) {}
    setPosts(posts.filter((p) => p.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <AdminNav />

      <main className="flex-1 p-6 sm:p-10 max-w-7xl overflow-x-auto">
        <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-charcoal-900 flex items-center gap-2">
              <FileText className="w-7 h-7 text-gold-600" />
              <span>Cẩm Nang Kiến Thức Mẹ & Bé (Blog)</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Quản lý bài viết cẩm nang, hướng dẫn mẹ bỉm chăm sóc bé và thông tắc tia sữa.
            </p>
          </div>

          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-white font-bold text-xs sm:text-sm shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Viết Bài Mới</span>
          </button>
        </div>

        {/* Form Viết/Sửa Bài Viết */}
        {isEditing && (
          <div className="bg-white rounded-3xl border border-gold-300 shadow-xl p-6 sm:p-8 mb-10">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
              <h2 className="text-lg font-bold text-charcoal-900">
                {editId ? 'Chỉnh Sửa Bài Viết' : 'Soạn Bài Viết Cẩm Nang Mới'}
              </h2>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="p-1.5 text-gray-400 hover:text-charcoal-900 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-6 text-xs sm:text-sm">
              {/* Tiêu đề & Danh mục */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-charcoal-900 mb-1">Tiêu Đề Bài Viết *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={handleTitleChange}
                    placeholder="Ví dụ: Cách xử trí tắc tia sữa tại nhà an toàn không đau"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-gold-500 outline-none text-sm font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-charcoal-900 mb-1">Chuyên Mục</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-gold-500 outline-none bg-white font-medium"
                  >
                    <option value="Thông Tắc Tia Sữa">Thông Tắc Tia Sữa</option>
                    <option value="Tắm Bé Sơ Sinh">Tắm Bé Sơ Sinh</option>
                    <option value="Chăm Sóc Sau Sinh">Chăm Sóc Sau Sinh</option>
                    <option value="Dinh Dưỡng Mẹ Bỉm">Dinh Dưỡng Mẹ Bỉm</option>
                  </select>
                </div>
              </div>

              {/* Slug & Tác giả */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-charcoal-900 mb-1">Slug (Đường Dẫn Tĩnh Tự Động) *</label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 focus:border-gold-500 outline-none text-gray-600 bg-gray-50 font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-charcoal-900 mb-1">Tác Giả / Người Phụ Trách</label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 focus:border-gold-500 outline-none"
                  />
                </div>
              </div>

              {/* ẢNH ĐẠI DIỆN BÀI VIẾT (COVER IMAGE) */}
              <div className="p-4 sm:p-5 rounded-2xl bg-cream-50 border border-gold-200">
                <div className="flex items-center justify-between mb-3">
                  <label className="font-bold text-charcoal-900 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-gold-600" />
                    <span>Ảnh Đại Diện Bài Viết (Ảnh Bìa)</span>
                  </label>
                  <span className="text-[11px] text-gray-500">Hiển thị ở đầu bài viết và danh sách Blog</span>
                </div>

                <div className="flex flex-col sm:flex-row gap-5 items-start">
                  {/* Image Preview Box */}
                  <div className="relative w-full sm:w-48 h-32 rounded-xl overflow-hidden border border-gold-300 bg-white shadow-sm flex-shrink-0 flex items-center justify-center">
                    {coverImage ? (
                      <img
                        src={coverImage}
                        alt="Ảnh đại diện"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-400 text-xs">Chưa có ảnh</span>
                    )}
                  </div>

                  {/* Upload Controls */}
                  <div className="flex-1 space-y-3 w-full">
                    <div className="flex flex-wrap items-center gap-2">
                      <input
                        type="file"
                        ref={coverFileInputRef}
                        accept="image/*"
                        onChange={handleCoverUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => coverFileInputRef.current?.click()}
                        className="px-4 py-2 rounded-xl bg-gold-600 hover:bg-gold-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Tải ảnh từ máy tính / điện thoại</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setCoverImage('/images/banner.jpg')}
                        className="px-3 py-2 rounded-xl bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-semibold"
                      >
                        Dùng ảnh Banner mặc định
                      </button>

                      <button
                        type="button"
                        onClick={() => setCoverImage('/images/avata.jpg')}
                        className="px-3 py-2 rounded-xl bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-semibold"
                      >
                        Dùng ảnh ĐD. Thúy Ngân
                      </button>
                    </div>

                    <div>
                      <input
                        type="text"
                        value={coverImage}
                        onChange={(e) => setCoverImage(e.target.value)}
                        placeholder="Hoặc dán đường dẫn (URL) ảnh vào đây..."
                        className="w-full px-3.5 py-1.5 rounded-lg border border-gray-300 text-xs bg-white focus:border-gold-500 outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Tóm tắt bài viết */}
              <div>
                <label className="block font-bold text-charcoal-900 mb-1">Tóm Tắt Bài Viết (Excerpt)</label>
                <textarea
                  rows={2}
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Mô tả tóm lược 2-3 câu ngắn gọn để người đọc nắm được nội dung cốt lõi..."
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 focus:border-gold-500 outline-none leading-relaxed"
                />
              </div>

              {/* KHU VỰC SOẠN THẢO NỘI DUNG VỚI TOOLBAR & LIVE PREVIEW */}
              <div className="rounded-2xl border border-gold-300 overflow-hidden bg-white shadow-sm">
                {/* Header: Tabs Soạn Thảo vs Xem Trước */}
                <div className="bg-cream-100/70 px-4 py-2.5 border-b border-gold-200 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setEditorTab('edit')}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        editorTab === 'edit'
                          ? 'bg-white text-gold-800 shadow-sm border border-gold-300'
                          : 'text-gray-600 hover:text-charcoal-900'
                      }`}
                    >
                      ✍️ Soạn Thảo Nội Dung
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditorTab('preview')}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        editorTab === 'preview'
                          ? 'bg-white text-gold-800 shadow-sm border border-gold-300'
                          : 'text-gray-600 hover:text-charcoal-900'
                      }`}
                    >
                      👁️ Xem Trước Bài Viết
                    </button>
                  </div>

                  <span className="text-[11px] text-gold-700 font-medium hidden sm:inline">
                    💡 Bôi đen chữ rồi bấm các nút công cụ để làm đẹp bài viết
                  </span>
                </div>

                {editorTab === 'edit' ? (
                  <div>
                    {/* Visual Toolbar */}
                    <div className="p-2.5 bg-gray-50 border-b border-gray-200 flex flex-wrap items-center gap-1.5 text-xs">
                      {/* Tiêu đề lớn */}
                      <button
                        type="button"
                        onClick={() => insertFormatting('\n\n<h2>', '</h2>\n', 'Tiêu đề mục chính')}
                        className="px-2.5 py-1.5 rounded-lg bg-white border border-gray-200 hover:border-gold-400 hover:bg-gold-50 font-bold text-charcoal-900 flex items-center gap-1"
                        title="Tạo tiêu đề lớn"
                      >
                        <Heading className="w-3.5 h-3.5 text-gold-600" />
                        <span>Tiêu Đề Lớn</span>
                      </button>

                      {/* Tiêu đề nhỏ */}
                      <button
                        type="button"
                        onClick={() => insertFormatting('\n\n<h3>', '</h3>\n', 'Tiêu đề mục nhỏ')}
                        className="px-2.5 py-1.5 rounded-lg bg-white border border-gray-200 hover:border-gold-400 hover:bg-gold-50 font-semibold text-charcoal-900 flex items-center gap-1"
                        title="Tạo tiêu đề phụ"
                      >
                        <Heading2 className="w-3.5 h-3.5 text-gold-600" />
                        <span>Tiêu Đề Nhỏ</span>
                      </button>

                      <div className="h-4 w-px bg-gray-300 mx-1" />

                      {/* In đậm */}
                      <button
                        type="button"
                        onClick={() => insertFormatting('<strong>', '</strong>', 'chữ in đậm')}
                        className="px-2 py-1.5 rounded-lg bg-white border border-gray-200 hover:border-gold-400 hover:bg-gold-50 font-black text-charcoal-900"
                        title="In đậm chữ"
                      >
                        <Bold className="w-3.5 h-3.5" />
                      </button>

                      {/* In nghiêng */}
                      <button
                        type="button"
                        onClick={() => insertFormatting('<em>', '</em>', 'chữ in nghiêng')}
                        className="px-2 py-1.5 rounded-lg bg-white border border-gray-200 hover:border-gold-400 hover:bg-gold-50 italic text-charcoal-900"
                        title="In nghiêng chữ"
                      >
                        <Italic className="w-3.5 h-3.5" />
                      </button>

                      <div className="h-4 w-px bg-gray-300 mx-1" />

                      {/* Gạch đầu dòng */}
                      <button
                        type="button"
                        onClick={() =>
                          insertFormatting('\n<ul>\n  <li>', '</li>\n  <li>Ý thứ hai...</li>\n</ul>\n', 'Ý thứ nhất...')
                        }
                        className="px-2.5 py-1.5 rounded-lg bg-white border border-gray-200 hover:border-gold-400 hover:bg-gold-50 font-medium text-charcoal-900 flex items-center gap-1"
                        title="Tạo danh sách gạch đầu dòng"
                      >
                        <List className="w-3.5 h-3.5 text-gray-700" />
                        <span>Gạch Đầu Dòng</span>
                      </button>

                      {/* Đánh số thứ tự */}
                      <button
                        type="button"
                        onClick={() =>
                          insertFormatting('\n<ol>\n  <li>', '</li>\n  <li>Bước 2...</li>\n</ol>\n', 'Bước 1...')
                        }
                        className="px-2.5 py-1.5 rounded-lg bg-white border border-gray-200 hover:border-gold-400 hover:bg-gold-50 font-medium text-charcoal-900 flex items-center gap-1"
                        title="Tạo các bước đánh số thứ tự"
                      >
                        <ListOrdered className="w-3.5 h-3.5 text-gray-700" />
                        <span>Các Bước (1, 2, 3)</span>
                      </button>

                      <div className="h-4 w-px bg-gray-300 mx-1" />

                      {/* Khung Lời Khuyên Chăm Sóc */}
                      <button
                        type="button"
                        onClick={() =>
                          insertFormatting(
                            '\n<div class="my-6 p-4 rounded-2xl bg-amber-50 border-l-4 border-amber-500 text-charcoal-900">\n  <strong class="text-amber-900 block mb-1">💡 Lời khuyên từ Điều Dưỡng Thúy Ngân:</strong>\n  ',
                            '\n</div>\n',
                            'Nội dung dặn dò mẹ bỉm cần chú ý...'
                          )
                        }
                        className="px-2.5 py-1.5 rounded-lg bg-amber-50 border border-amber-300 hover:bg-amber-100 font-bold text-amber-900 flex items-center gap-1"
                        title="Chèn khung lời khuyên nổi bật"
                      >
                        <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                        <span>Khung Lời Khuyên Chăm Sóc</span>
                      </button>

                      {/* CHÈN ẢNH VÀO BÀI VIẾT */}
                      <div className="relative">
                        <input
                          type="file"
                          ref={inlineFileInputRef}
                          accept="image/*"
                          onChange={handleInlineImageFile}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => inlineFileInputRef.current?.click()}
                          className="px-3 py-1.5 rounded-lg bg-gold-100 border border-gold-300 hover:bg-gold-200 font-bold text-gold-900 flex items-center gap-1.5"
                          title="Tải ảnh từ máy và chèn vào bài viết"
                        >
                          <ImageIcon className="w-3.5 h-3.5 text-gold-700" />
                          <span>🖼️ Tải Ảnh Vào Bài</span>
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => setShowImgModal(true)}
                        className="px-2.5 py-1.5 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 flex items-center gap-1"
                        title="Chèn ảnh từ đường dẫn URL"
                      >
                        <Link2 className="w-3.5 h-3.5" />
                        <span>Link Ảnh</span>
                      </button>
                    </div>

                    {/* Modal chèn ảnh từ URL nếu muốn */}
                    {showImgModal && (
                      <div className="p-3 bg-gold-50 border-b border-gold-200 flex flex-wrap items-center gap-2">
                        <input
                          type="text"
                          value={inlineImgUrl}
                          onChange={(e) => setInlineImgUrl(e.target.value)}
                          placeholder="Dán link ảnh (https://...)..."
                          className="flex-1 min-w-[200px] px-3 py-1.5 rounded-lg border border-gray-300 text-xs bg-white outline-none"
                        />
                        <input
                          type="text"
                          value={inlineImgCaption}
                          onChange={(e) => setInlineImgCaption(e.target.value)}
                          placeholder="Chú thích ảnh (tùy chọn)..."
                          className="w-48 px-3 py-1.5 rounded-lg border border-gray-300 text-xs bg-white outline-none"
                        />
                        <button
                          type="button"
                          onClick={handleInsertImageUrl}
                          className="px-3 py-1.5 rounded-lg bg-gold-600 hover:bg-gold-700 text-white font-bold text-xs"
                        >
                          Chèn
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowImgModal(false)}
                          className="px-2.5 py-1.5 rounded-lg bg-gray-200 text-gray-700 text-xs font-semibold"
                        >
                          Đóng
                        </button>
                      </div>
                    )}

                    {/* Textarea Editor */}
                    <textarea
                      ref={textareaRef}
                      rows={14}
                      required
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Chị Ngân cứ gõ nội dung chia sẻ như soạn thảo văn bản bình thường. Bôi đen từ hoặc đoạn và bấm các nút công cụ bên trên để làm đẹp bài viết..."
                      className="w-full p-4 sm:p-5 outline-none font-sans text-xs sm:text-sm leading-relaxed text-charcoal-900 resize-y"
                    />
                  </div>
                ) : (
                  /* LIVE PREVIEW TAB */
                  <div className="p-6 sm:p-8 bg-white min-h-[350px]">
                    <div className="max-w-2xl mx-auto space-y-4">
                      <div className="inline-block bg-gold-100 text-gold-800 text-xs font-bold px-3 py-1 rounded-full">
                        {category}
                      </div>
                      <h1 className="text-xl sm:text-2xl font-extrabold text-charcoal-900 leading-tight">
                        {title || 'Chưa nhập tiêu đề bài viết'}
                      </h1>
                      <div className="text-xs text-gray-500 pb-4 border-b border-gray-100 flex items-center gap-2">
                        <span>Tác giả: <strong>{author}</strong></span>
                      </div>

                      {/* Excerpt */}
                      {excerpt && (
                        <div className="p-4 rounded-xl bg-cream-100 border-l-4 border-gold-500 text-xs sm:text-sm italic text-charcoal-900">
                          {excerpt}
                        </div>
                      )}

                      {/* Cover Image in preview */}
                      {coverImage && (
                        <div className="rounded-2xl overflow-hidden shadow-sm my-4 border border-gold-200">
                          <img
                            src={coverImage}
                            alt={title}
                            className="w-full max-h-72 object-cover"
                          />
                        </div>
                      )}

                      {/* Rendered HTML Content */}
                      <div
                        className="prose max-w-none text-charcoal-900 text-xs sm:text-sm leading-relaxed space-y-3 [&>h2]:text-lg [&>h2]:font-bold [&>h2]:text-gold-700 [&>h2]:mt-6 [&>h3]:text-base [&>h3]:font-bold [&>h3]:text-charcoal-900 [&>p]:text-gray-700 [&>ul]:list-disc [&>ul]:pl-5 [&>ol]:list-decimal [&>ol]:pl-5"
                        dangerouslySetInnerHTML={{ __html: autoFormatPlainText(content) }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* SEO Meta Box */}
              <div className="p-4 rounded-xl bg-gold-50/60 border border-gold-200 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-gold-800 uppercase tracking-wide">
                  <Globe className="w-4 h-4" />
                  <span>Tối Ưu SEO Google (Meta Tags Tự Động)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-charcoal-900 mb-1">SEO Title Tag</label>
                    <input
                      type="text"
                      value={metaTitle}
                      onChange={(e) => setMetaTitle(e.target.value)}
                      placeholder="Tiêu đề hiển thị trên kết quả tìm kiếm Google..."
                      className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-charcoal-900 mb-1">SEO Meta Description</label>
                    <input
                      type="text"
                      value={metaDescription}
                      onChange={(e) => setMetaDescription(e.target.value)}
                      placeholder="Mô tả tóm lược bài viết trên Google dưới 160 ký tự..."
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
                  <span className="font-semibold text-xs text-charcoal-900">Xuất bản công khai trên website</span>
                </label>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 font-semibold"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl bg-gold-500 hover:bg-gold-600 text-white font-bold shadow-sm transition-all"
                  >
                    {editId ? 'Lưu Cập Nhật Bài Viết' : 'Đăng Bài Viết Lên Website'}
                  </button>
                </div>
              </div>

            </form>
          </div>
        )}

        {/* 1. GIAO DIỆN DÀNH CHO MOBILE (HIỂN THỊ DẠNG THẺ THÔNG MINH DỄ NHÌN) */}
        <div className="block md:hidden space-y-3.5 mb-6">
          {isLoading ? (
            <div className="bg-white p-8 rounded-2xl border border-gray-200 text-center text-gray-500">
              <Loader2 className="w-6 h-6 text-gold-500 animate-spin mx-auto mb-2" />
              <span className="text-xs">Đang tải danh sách bài viết...</span>
            </div>
          ) : posts.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-gray-200 text-center text-gray-400 text-xs">
              Chưa có bài viết nào.
            </div>
          ) : (
            posts.map((p) => (
              <div
                key={`mob-post-${p.id}`}
                className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm space-y-3"
              >
                {/* Header: Ảnh bìa + Tiêu đề bài viết */}
                <div className="flex items-start gap-3 border-b border-gray-100 pb-2.5">
                  <div className="w-16 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gold-200">
                    <img
                      src={p.cover_image || '/images/banner.jpg'}
                      alt={p.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs font-bold text-charcoal-900 line-clamp-2 leading-snug">
                      {p.title}
                    </h3>
                    <p className="text-[10px] text-gray-400 mt-1 truncate">/blog/{p.slug}</p>
                  </div>
                </div>

                {/* Metadata: Chuyên mục, Views, Trạng thái */}
                <div className="bg-cream-50/80 p-3 rounded-xl border border-gold-100/70 text-xs flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-gold-100 text-gold-800">
                    {p.category}
                  </span>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-gray-500 font-medium">
                      👁 {p.views} views
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        p.is_published === 1
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {p.is_published === 1 ? 'Đã xuất bản' : 'Bản nháp'}
                    </span>
                  </div>
                </div>

                {/* Nút thao tác */}
                <div className="pt-1 flex items-center justify-between gap-2">
                  <Link
                    href={`/blog/${p.slug}`}
                    target="_blank"
                    className="flex-1 py-2 px-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-charcoal-800 text-xs font-semibold flex items-center justify-center gap-1 active:scale-95 transition-all"
                  >
                    <Eye className="w-3.5 h-3.5 text-gray-600" />
                    <span>Xem bài</span>
                  </Link>

                  <button
                    onClick={() => handleOpenEdit(p)}
                    className="flex-1 py-2 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold flex items-center justify-center gap-1 active:scale-95 transition-all"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Sửa bài</span>
                  </button>

                  <button
                    onClick={() => handleDelete(p.id)}
                    className="py-2 px-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-bold flex items-center justify-center gap-1 active:scale-95 transition-all"
                    title="Xóa bài viết này"
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
                  <th className="py-3.5 px-4">Ảnh & Tiêu Đề Bài Viết</th>
                  <th className="py-3.5 px-4">Chuyên Mục</th>
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
                        <div className="flex items-center gap-3">
                          <div className="w-14 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 border border-gold-200">
                            <img
                              src={p.cover_image || '/images/banner.jpg'}
                              alt={p.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-bold text-charcoal-900 line-clamp-1">{p.title}</p>
                            <p className="text-gray-400 text-[11px]">/blog/{p.slug}</p>
                          </div>
                        </div>
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
                            title="Chỉnh sửa bài viết"
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
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}
