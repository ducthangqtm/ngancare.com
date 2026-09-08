import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calendar, User, Eye, ArrowLeft, PhoneCall, CheckCircle2, ShieldCheck, Heart, AlertTriangle } from 'lucide-react';
import { INITIAL_POSTS } from '@/lib/seed-data';
import JsonLd from '@/components/JsonLd';

export async function generateStaticParams() {
  return INITIAL_POSTS.map((post) => ({
    slug: post.slug,
  }));
}

export default function BlogPostDetail({ params }: { params: { slug: string } }) {
  const post = INITIAL_POSTS.find((p) => p.slug === params.slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <JsonLd
        type="article"
        articleData={{
          title: post.title,
          description: post.excerpt,
          slug: post.slug,
          coverImage: post.cover_image,
          datePublished: post.created_at,
          dateModified: post.updated_at,
        }}
      />

      <div className="py-10 sm:py-16 bg-cream-100/40 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Back Navigation Link */}
          <div className="mb-6">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-gold-700 hover:text-gold-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại Chuyên mục Kiến Thức Mẹ & Bé</span>
            </Link>
          </div>

          <article className="bg-white rounded-3xl p-6 sm:p-10 border border-gold-200 shadow-lg">
            
            {/* Post Category Badge */}
            <div className="inline-block bg-gold-100 text-gold-800 text-xs font-bold px-3 py-1 rounded-full mb-4">
              {post.category}
            </div>

            {/* Post Headline */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-charcoal-900 leading-tight mb-4">
              {post.title}
            </h1>

            {/* Author Meta & Medical Verification Badge */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-gray-100 text-xs text-gray-500">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-gold-500 flex-shrink-0">
                  <Image
                    src="/images/avata.jpg"
                    alt={post.author}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-bold text-charcoal-900 text-sm flex items-center gap-1">
                    {post.author}
                    <ShieldCheck className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                  </p>
                  <p className="text-[11px] text-gold-700">Tốt nghiệp CĐ Y Tế Hà Nội • Tham vấn chuyên môn Y học</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-gold-600" />
                  {post.views} lượt xem
                </span>
                <span>•</span>
                <span>Cập nhật mới nhất</span>
              </div>
            </div>

            {/* Excerpt Lead */}
            <div className="my-6 p-4 rounded-2xl bg-cream-200/80 border-l-4 border-gold-500 text-sm sm:text-base font-medium text-charcoal-900 leading-relaxed italic">
              {post.excerpt}
            </div>

            {/* Cover Image */}
            <div className="relative h-64 sm:h-96 w-full rounded-2xl overflow-hidden mb-8 shadow-sm">
              <Image
                src={post.cover_image || '/images/banner.jpg'}
                alt={post.title}
                fill
                priority
                unoptimized
                className="object-cover"
              />
            </div>

            {/* Medical Warning Callout */}
            <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-300 text-charcoal-900 text-xs sm:text-sm flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-900 block mb-1">Khuyến cáo an toàn từ Điều Dưỡng Thúy Ngân:</strong>
                <span>
                  Các phương pháp massage và thông tia sữa phải được thực hiện nhẹ nhàng theo giải phẫu xoang nang sữa. Tuyệt đối <strong>KHÔNG</strong> dùng lực nặn bóp thô bạo hoặc dùng kim châm chọc tại nhà vì có nguy cơ cao làm dập nát ống dẫn sữa, tạo điều kiện cho vi khuẩn xâm nhập gây áp xe vú nguy hiểm.
                </span>
              </div>
            </div>

            {/* Rich Content Article Body */}
            <div
              className="prose max-w-none text-charcoal-900 leading-relaxed text-sm sm:text-base space-y-4 [&>h2]:text-xl [&>h2]:font-bold [&>h2]:text-gold-700 [&>h2]:mt-8 [&>h2]:mb-3 [&>p]:text-gray-700 [&>p]:leading-relaxed [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:space-y-2 [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:space-y-2"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Author Signature Box */}
            <div className="mt-12 p-6 rounded-3xl bg-cream-100 border border-gold-300 flex flex-col sm:flex-row items-center gap-5">
              <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-gold-500 flex-shrink-0 shadow-md">
                <Image
                  src="/images/avata.jpg"
                  alt="Điều Dưỡng Nguyễn Thúy Ngân"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="text-center sm:text-left space-y-1">
                <h4 className="text-base font-bold text-charcoal-900">
                  Tác Giả & Cố Vấn Chuyên Môn: Điều Dưỡng Nguyễn Thúy Ngân
                </h4>
                <p className="text-xs text-gold-800 font-semibold">
                  Tốt nghiệp Trường Cao Đẳng Y Tế Hà Nội • Chứng chỉ Tuyến Sữa Thuận Tự Nhiên
                </p>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Với hơn 8 năm công tác thực tiễn, Điều dưỡng Ngân đã trực tiếp đồng hành giúp hơn 3,500 mẹ bỉm sữa Thủ đô giải tỏa cương đau, khơi thông dòng sữa ngọt lành cho bé yêu.
                </p>
              </div>
            </div>

            {/* Bottom In-Article CTA */}
            <div className="mt-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-charcoal-900 to-charcoal-800 text-white text-center space-y-4 shadow-xl border border-gold-500/30">
              <h3 className="text-xl sm:text-2xl font-bold">
                Mẹ Đang Bị Tắc Tia Sữa Cương Đau Hay Cần Tắm Bé Chuẩn Y Khoa?
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 max-w-xl mx-auto">
                Đừng chịu đựng cơn đau đơn độc. Điều dưỡng Thúy Ngân sẵn sàng có mặt sau <strong>15 - 30 phút</strong> tại nhà bạn ở Long Biên & Gia Lâm để hỗ trợ thông tia êm ái!
              </p>
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href="tel:0339627769"
                  className="w-full sm:w-auto px-7 py-3 rounded-full bg-emergency-500 hover:bg-emergency-600 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Gọi Hotline 24/7: 0339.627.769</span>
                </a>
                <Link
                  href="/#dat-lich"
                  className="w-full sm:w-auto px-6 py-3 rounded-full bg-gold-500 hover:bg-gold-600 text-white font-bold text-sm shadow-gold-soft flex items-center justify-center gap-2"
                >
                  <span>Đặt Lịch Hẹn Tại Nhà</span>
                </Link>
              </div>
            </div>

          </article>

        </div>
      </div>
    </>
  );
}
