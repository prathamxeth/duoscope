'use client';

import React from 'react';
import { FadingVideo } from './FadingVideo';
import { ImageIcon, MovieIcon, LightbulbIcon } from './icons/CustomIcons';
import { useWizard } from '../context/WizardContext';
import { Realistic3DPhoneSimulator } from './Realistic3DPhoneSimulator';

interface CapabilityCard {
  title: string;
  icon: React.ReactNode;
  tags: string[];
  body: string;
}

const CAPABILITIES: CapabilityCard[] = [
  {
    title: 'Fold Crease Safety',
    icon: <ImageIcon size={20} color="currentColor" />,
    tags: ['Button Safe Zone', 'No Cut-Offs', 'Easy Tapping', 'Center Line'],
    body: 'Automatically keeps your buttons, checkout actions, and important text safely away from the center fold line.'
  },
  {
    title: '3D Phone Simulator',
    icon: <MovieIcon size={20} color="currentColor" />,
    tags: ['0°–180° Angles', 'Small Screen', 'Big Screen', 'Tabletop Stand'],
    body: 'Spin and bend the phone in realistic 3D to see exactly how your app looks when held, folded, or opened flat.'
  },
  {
    title: 'Smart Design Fixer',
    icon: <LightbulbIcon size={20} color="currentColor" />,
    tags: ['Automatic Fixes', 'Screen Sizing', 'Side-by-Side', 'One-Click Patch'],
    body: 'Detects fixed screen size traps in your code and gives you ready-to-use fixes so your app looks gorgeous on any screen.'
  }
];

export const CapabilitiesSection: React.FC = () => {
  const { capabilitiesTab, setCapabilitiesTab, navigateTo } = useWizard();
  const showLiveStage = capabilitiesTab === 'simulator';
  const setShowLiveStage = (val: boolean) => setCapabilitiesTab(val ? 'simulator' : 'features');

  return (
    <section id="capabilities" className="video-hero-page select-none">
      {/* Background Cinematic Fading Video 2 */}
      <FadingVideo
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260622_093722_ccfc7ebf-182f-419f-8a62-2dc02db7dd9d.mp4"
        className="video-hero-bg opacity-75"
        priority={true}
      />

      {/* Content Overlaid Directly on Video 2 */}
      <div className="video-hero-content pt-20 pb-16 sm:pb-20 px-4 sm:px-6 md:px-12 lg:px-16 max-w-7xl mx-auto w-full flex flex-col justify-between">
        {/* Top Header Row */}
        <div className="w-full flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-body text-white/80 mb-1 tracking-wider uppercase font-semibold">
              Why DuoScope Makes It Easy
            </div>
            <h2 className="font-heading italic text-4xl sm:text-5xl md:text-6xl lg:text-[5rem] leading-[0.9] tracking-[-2px] md:tracking-[-3px] text-white whitespace-pre-line">
              {'Made for\nDual Screens'}
            </h2>
          </div>

          {/* Mode Switcher Pill */}
          <div className="liquid-glass rounded-full p-1 flex gap-1 self-start md:self-auto shadow-xl">
            <button
              onClick={() => setShowLiveStage(false)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-body font-medium transition-all cursor-pointer ${
                !showLiveStage
                  ? 'bg-[#2c2c2e] text-white font-semibold shadow-md border border-white/25 scale-[1.02]'
                  : 'bg-transparent text-white/80 hover:text-white hover:bg-white/10 border-0'
              }`}
            >
              Key Features
            </button>
            <button
              onClick={() => setShowLiveStage(true)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-body font-medium transition-all cursor-pointer ${
                showLiveStage
                  ? 'bg-[#2c2c2e] text-white font-semibold shadow-md border border-white/25 scale-[1.02]'
                  : 'bg-transparent text-white/80 hover:text-white hover:bg-white/10 border-0'
              }`}
            >
              Try 3D Simulator
            </button>
          </div>
        </div>

        {/* Center Stage: Cards or 3D Engine Overlaid on Video 2 */}
        {!showLiveStage ? (
          /* Three Liquid-Glass Cards Grid */
          <div className="w-full my-auto grid grid-cols-1 md:grid-cols-3 gap-5 py-4">
            {CAPABILITIES.map((cap) => (
              <div
                key={cap.title}
                className="liquid-glass rounded-2xl p-5 min-h-[280px] md:min-h-[320px] flex flex-col justify-between hover:bg-white/[0.04] transition-colors border border-white/15 shadow-2xl"
              >
                {/* Top Row: Icon + Pill Tags */}
                <div className="flex items-start justify-between gap-3">
                  <div className="liquid-glass h-10 w-10 rounded-xl flex items-center justify-center shrink-0">
                    {cap.icon}
                  </div>

                  <div className="flex flex-wrap gap-1.5 justify-end">
                    {cap.tags.map((tag) => (
                      <span
                        key={tag}
                        className="liquid-glass rounded-full px-2.5 py-0.5 text-[10px] text-white/90 font-body whitespace-nowrap"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom: Title & Body */}
                <div className="mt-4">
                  <h3 className="font-heading italic text-2xl md:text-3xl tracking-[-1px] leading-none text-white mb-2">
                    {cap.title}
                  </h3>
                  <p className="text-xs md:text-sm text-white/85 font-body font-light leading-relaxed max-w-[32ch]">
                    {cap.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Realistic Free-in-Space 3D Simulated iPhone Duo Object */
          <div className="w-full my-auto py-2">
            <Realistic3DPhoneSimulator />
          </div>
        )}

        {/* Bottom Status Bar */}
        <div className="w-full flex items-center justify-between pt-2 border-t border-white/10">
          <div className="text-[11px] text-white/60 font-body font-light">
            Built for Apple iPhone Duo • Simple, Instant Folding Screen Readiness
          </div>

          <button
            onClick={() => navigateTo('studio')}
            className="liquid-glass rounded-full px-3.5 py-1 text-xs font-medium text-white hover:bg-white/10 transition-colors cursor-pointer border-0 flex items-center gap-1"
          >
            <span>Back to Explorer ↑</span>
          </button>
        </div>
      </div>
    </section>
  );
};
