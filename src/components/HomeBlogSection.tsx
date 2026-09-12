'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BookOpen, Calendar, ArrowRight, Sparkles, User } from 'lucide-react';
import { BlogPost } from '@/lib/types';
import { INITIAL_POSTS } from '@/lib/seed-data';

export default function HomeBlogSection() {
  const [posts, setPosts] = useState<BlogPost[]>(INITIAL_POSTS);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/posts');
        const data = await res.json();
        if (data.success && data.data && data.data.length > 0) {
          setPosts(data.data);
        }
      } catch (e) {
        // Fallback to initial
      }
    };
    fetchPosts();
  }, []);

  return (
    <section id="blog-kien-thuc" className="py-16 sm:py-20 bg-cream-100/40 relative scroll-mt-16 sm:scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gold-100 border border-gold-300 text-gold-800 text-xs font-bold uppercase tracking-wider mb-3">
            <BookOpen className="w-3.5 h-3.5 text-gold-600" />
            <span>Cẩm Nang Chăm Sóc Mẹ & Bé</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-charcoal-900 text-balance max-w-2xl mx-auto leading-snug">
            Kiến Thức Chăm Sóc{' '}
            <span className="gold-gradient-text inline-block">Từ Điều Dưỡng Thúy Ngân</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-charcoal-800">
            Tổng hợp các bài viết hướng dẫn thông tắc tia sữa nhẹ nhàng, chăm sóc bé sơ sinh và phục hồi sau sinh an toàn, chu đáo.
          </p>
        </div>

        {/* Blog Posts Grid (Top 3 latest) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {posts.slice(0, 3).map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-3xl border border-gold-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Cover Image (Standard 16:9 aspect-video) */}
                <Link href={`/blog/${post.slug}`} className="block relative aspect-video w-full bg-cream-100 overflow-hidden">
                  <Image
                    src={post.cover_image || '/images/banner.jpg'}
                    alt={post.title}
                    fill
                    unoptimized
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-gold-500 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-sm">
                    {post.category}
                  </div>
                </Link>

                {/* Article Info */}
                <div className="p-6">
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-gold-600" />
                      <span>{post.author || 'ĐD. Thúy Ngân'}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-gold-600" />
                      <span>
                        {post.created_at
                          ? new Date(post.created_at).toLocaleDateString('vi-VN')
                          : 'Gần đây'}
                      </span>
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-charcoal-900 line-clamp-2 leading-snug group-hover:text-gold-600 transition-colors">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>

                  <p className="mt-2.5 text-xs sm:text-sm text-gray-600 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              {/* Read More Link */}
              <div className="p-6 pt-0">
                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-gold-600 group-hover:text-gold-700 transition-colors"
                >
                  <span>Đọc Chi Tiết Phác Đồ</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* View All Blog Link */}
        <div className="text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white border border-gold-300 hover:border-gold-500 text-charcoal-900 hover:text-gold-600 font-bold text-sm shadow-sm hover:shadow-md transition-all active:scale-95"
          >
            <BookOpen className="w-4 h-4 text-gold-500" />
            <span>Xem Tất Cả Bài Viết Cẩm Nang ({posts.length} bài viết)</span>
            <ArrowRight className="w-4 h-4 text-gold-500" />
          </Link>
        </div>

      </div>
    </section>
  );
}
