'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BookOpen, Calendar, Eye, User, ArrowRight, Search, Sparkles } from 'lucide-react';
import { BlogPost } from '@/lib/types';
import { INITIAL_POSTS } from '@/lib/seed-data';

export default function BlogListPage() {
  const [posts, setPosts] = useState<BlogPost[]>(INITIAL_POSTS);
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [searchTerm, setSearchTerm] = useState('');

  React.useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/posts');
        const data = await res.json();
        if (data.success && data.data && data.data.length > 0) {
          setPosts(data.data);
        }
      } catch (e) {}
    };
    fetchPosts();
  }, []);

  const categories = [
    'Tất cả',
    'Thông Tắc Tia Sữa',
    'Tắm Bé Sơ Sinh',
    'Chăm Sóc Sau Sinh',
  ];

  const filteredPosts = posts.filter((post) => {
    const matchCat =
      selectedCategory === 'Tất cả' || post.category === selectedCategory;
    const matchSearch =
      !searchTerm ||
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="py-12 sm:py-16 bg-cream-100/50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gold-100 border border-gold-300 text-gold-800 text-xs font-bold uppercase tracking-wider mb-3">
            <BookOpen className="w-3.5 h-3.5 text-gold-600" />
            <span>Cẩm Nang Kiến Thức Y Khoa</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-charcoal-900 leading-tight">
            Góc Chia Sẻ Cùng <span className="gold-gradient-text">Điều Dưỡng Thúy Ngân</span>
          </h1>
          <p className="mt-3 text-sm sm:text-base text-charcoal-800">
            Tổng hợp các bài viết hướng dẫn chăm sóc mẹ bầu, xử trí tắc tia sữa và nuôi con bằng sữa mẹ chuẩn y học chứng cứ.
          </p>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
          
          {/* Category Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-gold-500 text-white shadow-gold-soft'
                    : 'bg-white text-charcoal-900 border border-gold-200 hover:border-gold-400'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm kiếm bài viết..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-full border border-gold-200 bg-white text-xs sm:text-sm focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-200"
            />
          </div>

        </div>

        {/* Blog Posts Grid */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-gold-200 p-8">
            <p className="text-gray-500 text-sm">Không tìm thấy bài viết phù hợp với từ khóa &ldquo;{searchTerm}&rdquo;.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('Tất cả');
              }}
              className="mt-3 text-xs font-bold text-gold-600 hover:underline"
            >
              Xem tất cả bài viết
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-3xl border border-gold-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Cover Image */}
                  <Link href={`/blog/${post.slug}`} className="block relative aspect-video w-full bg-cream-200 overflow-hidden">
                    <Image
                      src={post.cover_image || '/images/banner.jpg'}
                      alt={post.title}
                      fill
                      unoptimized
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-[11px] font-bold text-gold-700 shadow-sm">
                      {post.category}
                    </div>
                  </Link>

                  {/* Post Content */}
                  <div className="p-6">
                    <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-gold-600" />
                        {post.author}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5 text-gold-600" />
                        {post.views} lượt xem
                      </span>
                    </div>

                    <h2 className="text-lg font-bold text-charcoal-900 line-clamp-2 leading-snug group-hover:text-gold-600 transition-colors">
                      <Link href={`/blog/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h2>

                    <p className="mt-3 text-xs sm:text-sm text-gray-600 line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                {/* Read more CTA */}
                <div className="p-6 pt-0">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-gold-600 group-hover:text-gold-700 transition-colors hover:underline"
                  >
                    <span>Đọc chi tiết bài viết</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
