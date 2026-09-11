'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface PosturePill {
  id: string;
  label: string;
  image: string;
  caption: string;
}

const POSTURE_PILLS: PosturePill[] = [
  {
    id: 'foldable',
    label: 'Foldable design',
    image: '/assets/duo/hero__dbnzxlb3ia2q_large_2x-1.png',
    caption: 'Offers exceptional viewing experiences in a design that fits in your pocket.'
  },
  {
    id: 'landscape',
    label: 'Landscape',
    image: '/assets/duo/landscape__f7x2oe1oxemy_large_2x.png',
    caption: 'A spacious display for incredibly immersive entertainment. Multitask with two apps side-by-side.'
  },
  {
    id: 'portrait',
    label: 'Portrait',
    image: '/assets/duo/portrait__15lry9l2g8ye_large_2x.png',
    caption: 'Type comfortably on a wider keyboard. Enjoy more room to browse and scroll.'
  },
  {
    id: 'closed',
    label: 'Closed',
    image: '/assets/duo/closed__3le61imm1w2e_large_2x.png',
    caption: 'Compact 5.4-inch outer cover display for quick single-handed actions.'
  },
  {
    id: 'seated',
    label: 'Seated',
    image: '/assets/duo/laptop__c7kl6vmsqd6q_large_2x.png',
    caption: 'Tabletop 90° flex mode with upper video playback and lower control canvas.'
  },
  {
    id: 'standing',
    label: 'Standing',
    image: '/assets/duo/tent__68ysumotbs2m_large_2x.png',
    caption: 'Self-balancing tent posture for hands-free video calls and media.'
  },
  {
    id: 'durability',
    label: 'Durability',
    image: '/assets/duo/durability__d8uh14wcv2oi_large_2x.png',
    caption: 'Aerospace-grade titanium frame with ultra-thin Ceramic Shield glass.'
  }
];

export const AppleDuoHeroStage: React.FC = () => {
  const [activePosture, setActivePosture] = useState<string>('foldable');
  const currentItem = POSTURE_PILLS.find((p) => p.id === activePosture) ?? POSTURE_PILLS[0]!;

  return (
    <section id="duo-hardware" style={{
      width: '100%',
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '3rem 1.5rem 5rem 1.5rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '2.5rem'
    }}>
      {/* -------------------------------------------------------------------- */}
      {/* Hero Headline */}
      {/* -------------------------------------------------------------------- */}
      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.65rem' }}>
        <div className="text-sm font-body text-white/80 tracking-wider">
          // Hardware & Posture Specifications
        </div>

        <h2 className="font-heading italic text-5xl md:text-7xl lg:text-[5.5rem] leading-[0.9] tracking-[-3px] text-white">
          iPhone Duo Explorer
        </h2>

        <p className="text-sm md:text-base text-white/80 font-body font-light max-w-lg mt-2">
          Dual-display hardware topology with dynamic 5.4" cover display and expansive 7.6" inner canvas.
        </p>

        {/* Hero CTA Action Pill */}
        <div style={{
          marginTop: '1rem',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '1.25rem',
          padding: '8px 12px 8px 22px',
          borderRadius: '9999px',
          background: 'rgba(255, 255, 255, 0.04)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <div style={{ fontSize: '0.88rem', color: '#ffffff', fontWeight: 500, fontFamily: 'var(--font-body)' }}>
            <span>Dual-Display Hardware Topology</span>
          </div>

          <button
            onClick={() => {
              const el = document.getElementById('audit-studio');
              if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
              } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            className="liquid-button liquid-button-primary"
            style={{ padding: '8px 20px', fontSize: '0.86rem' }}
          >
            <span>Audit Top Workflow</span>
            <span style={{ fontSize: '0.9rem', marginLeft: '4px' }}>↑</span>
          </button>
        </div>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* Interactive Posture Explorer with Floating Foreground Text Overlay */}
      {/* -------------------------------------------------------------------- */}
      <div className="duo-posture-grid">
        {/* Left Column: Vertical Apple Frosted Pills */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {POSTURE_PILLS.map((pill) => {
            const isActive = activePosture === pill.id;
            return (
              <button
                key={pill.id}
                onClick={() => setActivePosture(pill.id)}
                className={`apple-posture-pill ${isActive ? 'active' : ''}`}
                style={{
                  justifyContent: 'flex-start',
                  width: '100%'
                }}
              >
                <div className="pill-icon">
                  {isActive ? '✓' : '+'}
                </div>
                <span>{pill.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Column: Active Visual Stage with Transparent Foreground Text Overlay */}
        <div style={{
          position: 'relative',
          width: '100%',
          minHeight: '480px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            position: 'relative',
            width: '100%',
            maxWidth: '720px',
            height: '480px',
            borderRadius: '24px',
            overflow: 'hidden',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'rgba(0, 0, 0, 0.5)'
          }}>
            <Image
              src={currentItem.image}
              alt={currentItem.label}
              fill
              priority
              style={{
                objectFit: 'contain',
                transition: 'opacity 300ms ease, transform 350ms var(--spring-smooth)'
              }}
            />

            {/* Transparent Floating Liquid-Glass Foreground Caption Card */}
            <div
              className="liquid-glass-strong"
              style={{
                position: 'absolute',
                bottom: '20px',
                left: '20px',
                right: '20px',
                padding: '1rem 1.4rem',
                borderRadius: '1.25rem',
                background: 'rgba(0, 0, 0, 0.65)',
                backdropFilter: 'blur(30px)',
                WebkitBackdropFilter: 'blur(30px)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.75rem',
                zIndex: 20
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', maxWidth: '80%' }}>
                <div className="font-heading italic text-xl md:text-2xl text-white">
                  {currentItem.label}
                </div>
                <div className="font-body text-xs md:text-sm text-white/85 font-light leading-relaxed">
                  {currentItem.caption}
                </div>
              </div>

              <div className="liquid-glass rounded-full px-3 py-1 text-xs text-white/90 font-mono tabular-nums">
                Posture #{POSTURE_PILLS.findIndex(p => p.id === activePosture) + 1} / 7
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
