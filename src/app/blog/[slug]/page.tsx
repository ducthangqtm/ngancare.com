import type { Metadata } from 'next';
import React from 'react';
import { INITIAL_POSTS } from '@/lib/seed-data';
import BlogPostClient from './BlogPostClient';

export async function generateStaticParams() {
  const params = INITIAL_POSTS.map((post) => ({
    slug: post.slug,
  }));
  // Generate static fallback shell for dynamic posts created post-build
  params.push({ slug: 'fallback' });
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = INITIAL_POSTS.find((p) => p.slug === params.slug);
  if (!post) {
    return {
      title: 'Kiến Thức Chăm Sóc Mẹ & Bé | Ngân Care',
      description:
        'Cẩm nang kinh nghiệm thông tắc tia sữa nhẹ nhàng, tắm bé chuẩn y khoa và chăm sóc phục hồi sức khỏe cho mẹ sau sinh cùng Điều Dưỡng Thúy Ngân.',
      alternates: {
        canonical: `https://ngancare.com/blog/${params.slug || ''}`,
      },
    };
  }

  const imageUrl = post.cover_image.startsWith('http')
    ? post.cover_image
    : `https://ngancare.com${post.cover_image}`;

  return {
    title: `${post.title} | Ngân Care`,
    description: post.excerpt,
    alternates: {
      canonical: `https://ngancare.com/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `https://ngancare.com/blog/${post.slug}`,
      type: 'article',
      publishedTime: post.created_at,
      authors: [post.author || 'Điều Dưỡng Nguyễn Thúy Ngân'],
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [imageUrl],
    },
  };
}

export default function BlogPostDetail({ params }: { params: { slug: string } }) {
  const post = INITIAL_POSTS.find((p) => p.slug === params.slug) || null;
  return <BlogPostClient initialPost={post} slug={params.slug} />;
}
