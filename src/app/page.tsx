'use client';

import React, { useState } from 'react';
import HeroBanner from '@/components/HeroBanner';
import AboutSpecialist from '@/components/AboutSpecialist';
import CoreServices from '@/components/CoreServices';
import Process4Steps from '@/components/Process4Steps';
import Commitments3No from '@/components/Commitments3No';
import CoverageHanoi from '@/components/CoverageHanoi';
import ProductsCatalog from '@/components/ProductsCatalog';
import HomeBlogSection from '@/components/HomeBlogSection';
import BookingForm from '@/components/BookingForm';
import FAQ from '@/components/FAQ';

export default function HomePage() {
  const [selectedServiceId, setSelectedServiceId] = useState<string>('srv-01');

  const handleSelectService = (id: string) => {
    setSelectedServiceId(id);
    const element = document.getElementById('dat-lich');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* 1. Hero Banner with 4 Pillars & Emergency Quick Action */}
      <HeroBanner />

      {/* 2. Specialist Credentials: Điều Dưỡng Nguyễn Thúy Ngân */}
      <AboutSpecialist />

      {/* 3. Core Flagship Services */}
      <CoreServices onSelectService={handleSelectService} />

      {/* 4. Medical Standard 4-Step Process */}
      <Process4Steps />

      {/* 5. Gold 3-NOs Commitments */}
      <Commitments3No />

      {/* 6. Hanoi Local SEO Service Coverage Grid */}
      <CoverageHanoi />

      {/* 7. Natural Products Catalog */}
      <ProductsCatalog />

      {/* 8. Medical Blog Knowledge Section on Homepage */}
      <HomeBlogSection />

      {/* 9. Online Booking Form */}
      <BookingForm initialServiceId={selectedServiceId} />

      {/* 10. Interactive Medical FAQ Accordion */}
      <FAQ />
    </>
  );
}
