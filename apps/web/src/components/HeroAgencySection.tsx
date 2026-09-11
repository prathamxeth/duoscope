'use client';

import React, { useState, useEffect } from 'react';
import { FadingVideo } from './FadingVideo';
import { BlurText } from './BlurText';
import { ArrowUpRight, Play, ClockIcon, GlobeIcon } from './icons/CustomIcons';

export const HeroAgencySection: React.FC = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleScrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const TRUST_LOGOS = ['Aeon', 'Vela', 'Apex', 'Orbit', 'Zeno'];

  return (
    <section id="hero" className="h-screen overflow-hidden bg-black relative flex flex-col justify-between select-none">
      {/* Background Fading Video */}
      <FadingVideo
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260619_191346_9d19d66e-86a4-47f7-8dc6-712c1788c3b2.mp4"
        className="absolute left-1/2 top-0 -translate-x-1/2 object-cover object-top z-0"
        style={{ width: '120%', height: '120%' }}
      />

      {/* -------------------------------------------------------------------- */}
      {/* Main content (centered, flex-1 flex flex-col items-center justify-center pt-24 px-4 text-center) */}
      {/* -------------------------------------------------------------------- */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center pt-24 px-4 text-center max-w-5xl mx-auto">
        {/* Badge (motion.div, delay 0.4): liquid-glass rounded-full pill with a white "New" badge inside */}
        <div
          style={{
            filter: mounted ? 'blur(0px)' : 'blur(10px)',
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0px)' : 'translateY(20px)',
            transition: 'filter 0.8s ease-out 0.4s, opacity 0.8s ease-out 0.4s, transform 0.8s ease-out 0.4s'
          }}
          className="liquid-glass rounded-full px-4 py-1.5 inline-flex items-center gap-2.5"
        >
          <span className="bg-white text-black text-[11px] font-semibold px-2 py-0.5 rounded-full font-body">
            New
          </span>
          <span className="text-xs md:text-sm text-white/90 font-body font-normal">
            Booking Q3 2026 engagements -- limited capacity
          </span>
        </div>

        {/* Headline (mt-6, max-w-3xl): BlurText with text "Crafted Digital Experiences Built to Outlast Trends" */}
        <div className="mt-6 max-w-3xl">
          <BlurText
            text="Crafted Digital Experiences Built to Outlast Trends"
            className="text-6xl md:text-7xl lg:text-[5.5rem] font-heading italic text-white leading-[0.8] tracking-[-4px]"
          />
        </div>

        {/* Subtext (motion.p, delay 0.8, mt-4) */}
        <p
          style={{
            filter: mounted ? 'blur(0px)' : 'blur(10px)',
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0px)' : 'translateY(20px)',
            transition: 'filter 0.8s ease-out 0.8s, opacity 0.8s ease-out 0.8s, transform 0.8s ease-out 0.8s'
          }}
          className="mt-4 text-sm md:text-base text-white max-w-2xl font-body font-light leading-tight"
        >
          We are a small studio of designers and engineers shaping brand-defining websites for ambitious companies. Precise typography, cinematic motion, and code you can be proud of.
        </p>

        {/* CTA buttons (motion.div, delay 1.1, mt-6, flex gap-6) */}
        <div
          style={{
            filter: mounted ? 'blur(0px)' : 'blur(10px)',
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0px)' : 'translateY(20px)',
            transition: 'filter 0.8s ease-out 1.1s, opacity 0.8s ease-out 1.1s, transform 0.8s ease-out 1.1s'
          }}
          className="mt-6 flex items-center justify-center gap-6"
        >
          <button
            onClick={() => handleScrollToSection('capabilities')}
            className="liquid-glass-strong rounded-full px-5 py-2.5 flex items-center gap-2 text-sm font-medium text-white hover:bg-white/10 transition-colors cursor-pointer border-0"
          >
            <span>Start a Project</span>
            <ArrowUpRight size={16} color="#FFFFFF" />
          </button>

          <button
            onClick={() => handleScrollToSection('capabilities')}
            className="liquid-glass rounded-full px-5 py-2.5 flex items-center gap-2 text-sm text-white/90 hover:text-white transition-colors border-0 cursor-pointer font-body font-medium"
          >
            <div className="w-5 h-5 rounded-full bg-white/15 flex items-center justify-center">
              <Play size={9} color="#FFFFFF" />
            </div>
            <span>Watch Showreel</span>
          </button>
        </div>

        {/* Stats cards (motion.div, delay 1.3, mt-8, flex gap-4) */}
        <div
          style={{
            filter: mounted ? 'blur(0px)' : 'blur(10px)',
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0px)' : 'translateY(20px)',
            transition: 'filter 0.8s ease-out 1.3s, opacity 0.8s ease-out 1.3s, transform 0.8s ease-out 1.3s'
          }}
          className="mt-8 flex items-center justify-center gap-4 flex-wrap"
        >
          {/* Card 1: ClockIcon, "6 Weeks", "Average End-to-End Launch Time" */}
          <div className="liquid-glass p-5 w-[220px] rounded-[1.25rem] text-left flex flex-col justify-between">
            <ClockIcon size={20} color="#FFFFFF" />
            <div className="text-4xl font-heading italic tracking-[-1px] leading-none mt-4 text-white">
              6 Weeks
            </div>
            <div className="text-xs text-white/70 font-body font-light mt-1">
              Average End-to-End Launch Time
            </div>
          </div>

          {/* Card 2: GlobeIcon, "140+", "Brands Shipped Across Four Continents" */}
          <div className="liquid-glass p-5 w-[220px] rounded-[1.25rem] text-left flex flex-col justify-between">
            <GlobeIcon size={20} color="#FFFFFF" />
            <div className="text-4xl font-heading italic tracking-[-1px] leading-none mt-4 text-white">
              140+
            </div>
            <div className="text-xs text-white/70 font-body font-light mt-1">
              Brands Shipped Across Four Continents
            </div>
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* Bottom trust bar (motion.div, delay 1.4, flex-col items-center gap-4 pb-8) */}
      {/* -------------------------------------------------------------------- */}
      <div
        style={{
          filter: mounted ? 'blur(0px)' : 'blur(10px)',
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0px)' : 'translateY(20px)',
          transition: 'filter 0.8s ease-out 1.4s, opacity 0.8s ease-out 1.4s, transform 0.8s ease-out 1.4s'
        }}
        className="relative z-10 flex flex-col items-center gap-4 pb-8"
      >
        <div className="liquid-glass rounded-full px-4 py-1 text-xs text-white/80 font-body">
          Trusted by founders, operators, and creative directors worldwide
        </div>

        <div className="flex items-center justify-center gap-12 md:gap-16">
          {TRUST_LOGOS.map((name) => (
            <span
              key={name}
              className="font-heading italic text-2xl md:text-3xl tracking-tight text-white/90 hover:text-white transition-colors cursor-default"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};
