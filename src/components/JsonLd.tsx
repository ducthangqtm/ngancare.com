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
    '@type': ['MedicalBusiness', 'LocalBusiness'],
    '@id': `${baseUrl}/#organization`,
    name: 'Ngân Care - Chăm Sóc Mẹ Và Bé Chuẩn Y Khoa',
    alternateName: 'Nguyễn Thúy Ngân Chăm Sóc Mẹ & Bé',
    url: baseUrl,
    logo: `${baseUrl}/images/logo.png`,
    image: `${baseUrl}/images/banner.jpg`,
    description:
      'Dịch vụ thông tắc tia sữa không đau, tắm bé sơ sinh và chăm sóc phục hồi mẹ sau sinh chuẩn y khoa tại nhà khu vực Long Biên & Gia Lâm bởi Điều dưỡng Thúy Ngân. Có mặt sau 15 - 30 phút.',
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
    medicalSpecialty: [
      'Obstetric',
      'Pediatric',
      'LactationConsultant',
      'Nursing',
    ],
  };

  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${baseUrl}/#specialist`,
    name: 'Nguyễn Thúy Ngân',
    jobTitle: 'Điều Dưỡng Y Tế - Chuyên Gia Tuyến Sữa & Mẹ Bé',
    worksFor: {
      '@id': `${baseUrl}/#organization`,
    },
    image: `${baseUrl}/images/avata.jpg`,
    description:
      'Tốt nghiệp Trường Cao Đẳng Y Tế Hà Nội, sở hữu chứng chỉ Chăm sóc Tuyến sữa thuận tự nhiên và chứng chỉ Phục hồi sức khỏe sàn chậu & Spa mẹ sau sinh với hơn 8 năm kinh nghiệm.',
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
          text: 'Hoàn toàn được và rất an toàn. Điều dưỡng Thúy Ngân tuân thủ quy trình tắm và vệ sinh cuống rốn vô khuẩn 100% bằng găng tay y tế và dung dịch sát khuẩn chuyên dụng, giúp cuống rốn luôn khô thoáng, phòng ngừa viêm rốn sơ sinh.',
        },
      },
      {
        '@type': 'Question',
        name: 'Một buổi thông tắc tia sữa thường mất bao lâu?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Một buổi thông tắc tia sữa chuẩn y khoa kéo dài từ 60 - 75 phút. Điều dưỡng sẽ dùng sóng siêu âm đa tần kết hợp massage nhẹ nhàng mở xoang sữa và hướng dẫn mẹ chỉnh khớp ngậm đúng.',
        },
      },
      {
        '@type': 'Question',
        name: 'Dụng cụ y tế có được tiệt trùng trước khi đến nhà không?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Tất cả dụng cụ, gạc vô trùng, khăn tiệt trùng và thiết bị đều được khử khuẩn bằng dung dịch y tế chuyên dụng và đèn cực tím UV trước khi mang đến nhà phục vụ mẹ và bé.',
        },
      },
    ],
  };

  let articleSchema = null;
  if (type === 'article' && articleData) {
    articleSchema = {
      '@context': 'https://schema.org',
      '@type': 'MedicalWebPage',
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
      medicalAudience: 'Patient',
      aspect: ['Treatment', 'Prevention', 'Overview'],
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
