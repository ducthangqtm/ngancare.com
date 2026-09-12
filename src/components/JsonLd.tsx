import React from 'react';

interface JsonLdProps {
  type?: 'home' | 'article';
  articleData?: {
    title: string;
    description: string;
    slug: string;
    coverImage: string;
    datePublished?: string;
    dateModified?: string;
  };
}

export default function JsonLd({ type = 'home', articleData }: JsonLdProps) {
  const baseUrl = 'https://ngancare.com';

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'ProfessionalService'],
    '@id': `${baseUrl}/#organization`,
    name: 'Ngân Care - Chăm Sóc Mẹ Và Bé Tại Nhà',
    alternateName: 'Nguyễn Thúy Ngân Chăm Sóc Mẹ & Bé',
    url: baseUrl,
    logo: `${baseUrl}/images/logo.png`,
    image: `${baseUrl}/images/banner.jpg`,
    description:
      'Dịch vụ thông tắc tia sữa nhẹ nhàng, tắm bé sơ sinh và chăm sóc phục hồi mẹ sau sinh tại nhà khu vực Long Biên & Gia Lâm bởi Điều dưỡng Thúy Ngân. Tận tâm, an toàn, có mặt sau 15 - 30 phút.',
    telephone: '0339627769',
    priceRange: '150.000đ - 500.000đ',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Thượng Thanh',
      addressLocality: 'Long Biên',
      addressRegion: 'Hà Nội',
      postalCode: '100000',
      addressCountry: 'VN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '21.0583',
      longitude: '105.8897',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ],
        opens: '00:00',
        closes: '23:59',
      },
    ],
    sameAs: [
      'https://www.facebook.com/ngancare.mevabe',
      'https://zalo.me/0339627769',
    ],
  };

  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${baseUrl}/#specialist`,
    name: 'Nguyễn Thúy Ngân',
    jobTitle: 'Điều Dưỡng - Chuyên Viên Chăm Sóc Mẹ & Bé Tại Nhà',
    worksFor: {
      '@id': `${baseUrl}/#organization`,
    },
    image: `${baseUrl}/images/avata.jpg`,
    description:
      'Tốt nghiệp chuyên ngành Điều dưỡng tại Trường Cao Đẳng Y Tế Hà Nội, sở hữu chứng chỉ Chăm sóc Tuyến sữa thuận tự nhiên và chứng chỉ Phục hồi sức khỏe sàn chậu & Spa mẹ sau sinh với hơn 8 năm kinh nghiệm.',
    alumniOf: {
      '@type': 'EducationalOrganization',
      name: 'Trường Cao Đẳng Y Tế Hà Nội',
    },
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Bé chưa rụng rốn có tắm tại nhà được không?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Hoàn toàn được và rất an toàn. Điều dưỡng Thúy Ngân tuân thủ quy trình tắm và chăm sóc cuống rốn sạch sẽ, an toàn, vệ sinh dụng cụ kỹ lưỡng, giúp cuống rốn luôn khô thoáng, phòng ngừa viêm nhiễm cho bé.',
        },
      },
      {
        '@type': 'Question',
        name: 'Một buổi thông tắc tia sữa thường mất bao lâu?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Một buổi thông tắc tia sữa chuyên nghiệp kéo dài từ 60 - 75 phút. Chuyên viên sẽ kết hợp massage nhẹ nhàng bằng phương pháp dẫn lưu hệ bạch huyết mở xoang sữa và hướng dẫn mẹ chỉnh khớp ngậm đúng.',
        },
      },
      {
        '@type': 'Question',
        name: 'Dụng cụ chăm sóc có được tiệt trùng sạch sẽ trước khi đến nhà không?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Tất cả dụng cụ, khăn sạch và thiết bị đều được làm sạch, tiệt trùng cẩn thận trước khi mang đến phục vụ mẹ và bé.',
        },
      },
    ],
  };

  let articleSchema = null;
  if (type === 'article' && articleData) {
    articleSchema = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: articleData.title,
      description: articleData.description,
      image: articleData.coverImage.startsWith('http')
        ? articleData.coverImage
        : `${baseUrl}${articleData.coverImage}`,
      url: `${baseUrl}/blog/${articleData.slug}`,
      datePublished: articleData.datePublished || new Date().toISOString(),
      dateModified: articleData.dateModified || new Date().toISOString(),
      author: {
        '@id': `${baseUrl}/#specialist`,
      },
      publisher: {
        '@id': `${baseUrl}/#organization`,
      },
    };
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      {type === 'home' && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      {articleSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />
      )}
    </>
  );
}
