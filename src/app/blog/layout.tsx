import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cẩm Nang Y Khoa & Kiến Thức Mẹ Và Bé | Ngân Care',
  description:
    'Tổng hợp các bài viết hướng dẫn xử trí tắc tia sữa không đau, hướng dẫn tắm bé sơ sinh chưa rụng rốn an toàn và cẩm nang phục hồi sức khỏe cho mẹ sau sinh chuẩn Y khoa.',
  alternates: {
    canonical: 'https://ngancare.com/blog',
  },
  openGraph: {
    title: 'Cẩm Nang Y Khoa & Kiến Thức Mẹ Và Bé | Ngân Care',
    description:
      'Tổng hợp kiến thức chuẩn y khoa về thông tắc tia sữa, chăm sóc bé sơ sinh và phục hồi sau sinh từ Điều Dưỡng Thúy Ngân.',
    url: 'https://ngancare.com/blog',
    type: 'website',
    images: [
      {
        url: '/images/banner.jpg',
        width: 1200,
        height: 630,
        alt: 'Cẩm Nang Y Khoa Ngân Care',
      },
    ],
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
