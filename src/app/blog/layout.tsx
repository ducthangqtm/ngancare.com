import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cẩm Nang Chăm Sóc Mẹ Và Bé Tại Nhà | Ngân Care',
  description:
    'Tổng hợp các bài viết hướng dẫn thông tắc tia sữa nhẹ nhàng, tắm bé sơ sinh chưa rụng rốn an toàn và cẩm nang phục hồi sau sinh từ Điều Dưỡng Thúy Ngân.',
  alternates: {
    canonical: 'https://ngancare.com/blog',
  },
  openGraph: {
    title: 'Cẩm Nang Chăm Sóc Mẹ Và Bé Tại Nhà | Ngân Care',
    description:
      'Tổng hợp kinh nghiệm và kỹ năng chăm sóc mẹ và bé sơ sinh an toàn, tận tâm từ Điều Dưỡng Thúy Ngân.',
    url: 'https://ngancare.com/blog',
    type: 'website',
    images: [
      {
        url: '/images/banner.jpg',
        width: 1200,
        height: 630,
        alt: 'Cẩm Nang Chăm Sóc Mẹ Và Bé Ngân Care',
      },
    ],
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
