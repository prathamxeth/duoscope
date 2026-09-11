'use client';

import React from 'react';
import { WizardProvider } from '../context/WizardContext';
import { Header } from '../components/Header';
import { HeroDuoSection } from '../components/HeroDuoSection';
import { CapabilitiesSection } from '../components/CapabilitiesSection';

function LandingPageContent() {
  return (
    <div
      id="main-scroll-container"
      className="min-h-screen w-full overflow-y-auto bg-black text-white relative select-none scroll-smooth"
    >
      {/* ------------------------------------------------------------------ */}
      {/* Fixed DuoScope Adaptive Liquid-Glass Navbar */}
      {/* ------------------------------------------------------------------ */}
      <Header />

      {/* ------------------------------------------------------------------ */}
      {/* Section 1: Hero (Full Viewport with Video 1 + DuoScope Studio) */}
      {/* ------------------------------------------------------------------ */}
      <div className="min-h-screen w-full relative">
        <HeroDuoSection />
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Section 2: Capabilities (Video 2 + DuoScope Cards & 3D Simulator) */}
      {/* ------------------------------------------------------------------ */}
      <div className="min-h-screen w-full relative">
        <CapabilitiesSection />
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <WizardProvider>
      <LandingPageContent />
    </WizardProvider>
  );
}
