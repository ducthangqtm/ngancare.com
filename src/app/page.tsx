'use client';

import React, { useState, useEffect } from 'react';
import HeroBanner from '@/components/HeroBanner';
import AboutSpecialist from '@/components/AboutSpecialist';
import CoreServices from '@/components/CoreServices';
import Process4Steps from '@/components/Process4Steps';
import Commitments3No from '@/components/Commitments3No';
import ProductsCatalog from '@/components/ProductsCatalog';
import HomeBlogSection from '@/components/HomeBlogSection';
import BookingForm from '@/components/BookingForm';
import FAQ from '@/components/FAQ';
import { HomepageConfig, DEFAULT_HOMEPAGE_CONFIG } from '@/lib/homepage-config';

export default function HomePage() {
  const [selectedServiceId, setSelectedServiceId] = useState<string>('srv-01');
  const [config, setConfig] = useState<HomepageConfig>(DEFAULT_HOMEPAGE_CONFIG);

  useEffect(() => {
    const fetchHomepageConfig = async () => {
      try {
        const res = await fetch('/api/homepage');
        const data = await res.json();
        if (data.success && data.data) {
          setConfig((prev) => ({ ...prev, ...data.data }));
        }
      } catch (e) {
        // Fallback silently to DEFAULT_HOMEPAGE_CONFIG
      }
    };

    fetchHomepageConfig();
  }, []);

  const handleSelectService = (id: string) => {
    setSelectedServiceId(id);
    const element = document.getElementById('dat-lich');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* 1. Hero Banner with 4 Pillars & Quick Action */}
      <HeroBanner config={config} />

      {/* 2. Specialist Credentials: Điều Dưỡng Nguyễn Thúy Ngân */}
      <AboutSpecialist config={config} />

      {/* 3. Core Flagship Services */}
      <CoreServices onSelectService={handleSelectService} config={config} />

      {/* 4. Professional 4-Step Process */}
      <Process4Steps config={config} />

      {/* 5. Gold 3-NOs Commitments */}
      <Commitments3No config={config} />

      {/* 6. Natural Products Catalog */}
      <ProductsCatalog config={config} />

      {/* 8. Blog Knowledge Section on Homepage */}
      <HomeBlogSection />

      {/* 9. Online Booking Form */}
      <BookingForm initialServiceId={selectedServiceId} />

      {/* 10. Interactive FAQ Accordion */}
      <FAQ />
    </>
  );
}
