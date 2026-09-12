import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import './globals.css';
import AppShell from '@/components/AppShell';
import JsonLd from '@/components/JsonLd';

const roboto = Roboto({
  weight: ['300', '400', '500', '700', '900'],
  subsets: ['latin', 'vietnamese'],
  variable: '--font-roboto',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://ngancare.com'),
  title: {
    default: 'Ngân Care - Dịch Vụ Chăm Sóc Mẹ Và Bé Tại Nhà Uy Tín Hà Nội | Điều Dưỡng Thúy Ngân',
    template: '%s | Ngân Care',
  },
  description:
    'Dịch vụ tắm bé sơ sinh, thông tắc tia sữa nhẹ nhàng, phục hồi mẹ sau sinh tại nhà khu vực Hà Nội. Tận tâm, chu đáo, an toàn.',
  keywords: [
    'chăm sóc mẹ và bé tại nhà hà nội',
    'thông tắc tia sữa nhẹ nhàng hà nội',
    'tắm bé sơ sinh tại nhà',
    'chăm sóc mẹ sau sinh hà nội',
    'ngân care',
    'điều dưỡng thúy ngân',
    'thông tắc tia sữa long biên',
    'thông tắc tia sữa gia lâm',
    'massage mẹ bầu',
    'hỗ trợ tắc tia sữa 24 7',
  ],
  authors: [{ name: 'Điều Dưỡng Nguyễn Thúy Ngân' }],
  creator: 'Ngân Care',
  publisher: 'Ngân Care',
  formatDetection: {
    telephone: true,
    address: true,
  },
  alternates: {
    canonical: 'https://ngancare.com',
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'Ngân Care - Dịch Vụ Chăm Sóc Mẹ Và Bé Tại Nhà Uy Tín Hà Nội | Điều Dưỡng Thúy Ngân',
    description:
      'Dịch vụ tắm bé sơ sinh, thông tắc tia sữa nhẹ nhàng, phục hồi mẹ sau sinh tại nhà khu vực Hà Nội. Tận tâm, chu đáo, an toàn.',
    url: 'https://ngancare.com',
    siteName: 'Ngân Care',
    images: [
      {
        url: '/images/banner.jpg',
        width: 1200,
        height: 630,
        alt: 'Ngân Care Chăm Sóc Mẹ Và Bé',
      },
    ],
    locale: 'vi_VN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ngân Care - Dịch Vụ Chăm Sóc Mẹ Và Bé Tại Nhà Uy Tín Hà Nội | Điều Dưỡng Thúy Ngân',
    description:
      'Dịch vụ tắm bé sơ sinh, thông tắc tia sữa nhẹ nhàng, phục hồi mẹ sau sinh tại nhà khu vực Hà Nội. Tận tâm, chu đáo, an toàn.',
    images: ['https://ngancare.com/images/banner.jpg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={roboto.variable}>
      <head>
        <JsonLd type="home" />
      </head>
      <body className="min-h-screen flex flex-col antialiased bg-cream-200/50 text-charcoal-900">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
