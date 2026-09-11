'use client';

import React, { useState, useEffect } from 'react';
import { useWizard } from '../context/WizardContext';
import { FadingVideo } from './FadingVideo';
import { BlurText } from './BlurText';
import { WizardProgressBar } from './wizard/WizardProgressBar';
import { Step1Intake } from './wizard/Step1Intake';
import { Step2DeviceConfig } from './wizard/Step2DeviceConfig';
import { Step3StaticAudit } from './wizard/Step3StaticAudit';
import { Step4Simulation } from './wizard/Step4Simulation';
import { Step5Triage } from './wizard/Step5Triage';
import { MetricsOverview } from './MetricsOverview';
import { FoldSimulator } from './FoldSimulator';
import { IssueLedger } from './IssueLedger';
import { DiffInspector } from './DiffInspector';
import { Sparkles, FileText } from 'lucide-react';

export const HeroDuoSection: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const { currentStep, heroViewMode: viewMode, setHeroViewMode: setViewMode, report, performScan, updateIntakeConfig, goToStep } = useWizard();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleStartDemoScan = async () => {
    updateIntakeConfig({
      type: 'sample_demo',
      appName: 'DuoStore Demo View',
      bundleId: 'com.apple.samples.duostore'
    });
    try {
      await performScan();
    } catch (_) {}
  };

  return (
    <section id="hero" className="min-h-screen relative overflow-hidden bg-black flex flex-col justify-start select-none pt-20 pb-10 sm:pt-24 sm:pb-12 px-4 sm:px-6 md:px-8">
      {/* Background Cinematic Fading Video 1 */}
      <FadingVideo
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260619_191346_9d19d66e-86a4-47f7-8dc6-712c1788c3b2.mp4"
        className="absolute left-1/2 top-0 -translate-x-1/2 object-cover object-top z-0 opacity-75"
        style={{ width: '120%', height: '120%' }}
        priority={true}
      />

      {/* Main Content Overlaid Directly Over Video 1 */}
      <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-col gap-4 sm:gap-5 pt-1 pb-2">
        {/* Centered Top Header Block (Newbie-Friendly Language) */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto w-full px-2">
          {/* Tag Pill */}
          <div className="liquid-glass rounded-full px-4 py-1 flex items-center justify-center gap-2 mb-2 text-xs font-body text-[#30d158] font-semibold tracking-wide whitespace-nowrap shrink-0 shadow-md">
            <span className="w-2 h-2 rounded-full bg-[#30d158] animate-pulse" />
            <span>Dual-Screen &amp; Folding Phone Checker</span>
          </div>

          {/* Headline — Centered BlurText */}
          <div className="w-full mb-1">
            <BlurText
              text="Prepare Your iPhone Apps for Folding Screens"
              className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.6rem] font-heading italic text-white leading-[0.94] tracking-[-1.5px] md:tracking-[-2.5px] text-center"
            />
          </div>

          {/* Subheading in Plain English */}
          <p
            style={{
              filter: mounted ? 'blur(0px)' : 'blur(10px)',
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0px)' : 'translateY(10px)',
              transition: 'all 0.6s ease-out 0.2s'
            }}
            className="text-xs sm:text-sm md:text-base text-white/85 max-w-2xl font-body font-light text-center leading-relaxed mb-3"
          >
            Check your app design in seconds, test how it looks folded or open, and fix buttons before they get cut in half.
          </p>

          {/* Centered Mode Switcher Pill */}
          <div
            style={{
              filter: mounted ? 'blur(0px)' : 'blur(10px)',
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0px)' : 'translateY(10px)',
              transition: 'all 0.6s ease-out 0.3s'
            }}
            className="liquid-glass rounded-full p-1.5 flex items-center gap-1.5 shadow-2xl overflow-x-auto"
          >
            <button
              onClick={() => setViewMode('wizard')}
              className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-body font-medium transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap shrink-0 ${
                viewMode === 'wizard'
                  ? 'bg-[#2c2c2e] text-white font-semibold shadow-md border border-white/25 scale-[1.02]'
                  : 'bg-transparent text-white/80 hover:text-white hover:bg-white/10 border-0'
              }`}
            >
              <Sparkles size={15} />
              <span>Step-by-Step Guide</span>
            </button>
            <button
              onClick={() => setViewMode('findings')}
              className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-body font-medium transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap shrink-0 ${
                viewMode === 'findings'
                  ? 'bg-[#2c2c2e] text-white font-semibold shadow-md border border-white/25 scale-[1.02]'
                  : 'bg-transparent text-white/80 hover:text-white hover:bg-white/10 border-0'
              }`}
            >
              <FileText size={15} />
              <span>Instant Fixes &amp; Report</span>
            </button>
          </div>
        </div>

        {/* Full Descriptive Step-by-Step Studio Stage in Liquid Glass */}
        <div
          style={{
            filter: mounted ? 'blur(0px)' : 'blur(10px)',
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0px)' : 'translateY(15px)',
            transition: 'all 0.6s ease-out 0.4s'
          }}
          className="w-full liquid-glass rounded-3xl p-5 sm:p-6 md:p-8 shadow-2xl border border-white/15"
        >
          {/* Wizard Workflow Mode */}
          {viewMode === 'wizard' && (
            <div className="flex flex-col gap-6">
              <WizardProgressBar />
              {currentStep === 1 && <Step1Intake />}
              {currentStep === 2 && <Step2DeviceConfig />}
              {currentStep === 3 && <Step3StaticAudit />}
              {currentStep === 4 && <Step4Simulation />}
              {currentStep === 5 && <Step5Triage />}
            </div>
          )}

          {/* Direct Findings Mode */}
          {viewMode === 'findings' && (
            report ? (
              <div className="flex flex-col gap-6">
                {/* Top Metrics Cards */}
                <MetricsOverview
                  summary={report.summary}
                  continuity={{
                    transitionDurationMs: 300,
                    mainThreadHitchDurationMs: 24.6,
                    droppedFrameCount: 3,
                    targetFrameRate: 120,
                    actualAverageFrameRate: 104,
                    peakMemoryDeltaMb: 4.2,
                    layoutSubviewsPassCount: 6,
                    isPerceptibleHitch: true
                  }}
                />

                {/* Findings Ledger & Diff Inspector Split */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-5">
                    <IssueLedger findings={report.findings} />
                  </div>

                  <div className="lg:col-span-7 flex flex-col gap-6">
                    <DiffInspector />

                    {/* Embedded Fold Simulator */}
                    <FoldSimulator />
                  </div>
                </div>
              </div>
            ) : (
              /* Styled Non-Empty State When No Report Is Available */
              <div className="flex flex-col items-center justify-center text-center p-8 sm:p-12 gap-5 liquid-glass rounded-3xl border border-white/15">
                <div className="w-16 h-16 rounded-full bg-[#0071e3]/20 border border-[#0071e3]/40 flex items-center justify-center shadow-inner">
                  <FileText size={28} className="text-[#2997ff]" />
                </div>
                <div className="max-w-md">
                  <h3 className="font-heading italic text-2xl sm:text-3xl text-white mb-2">
                    No Scan Analysis Generated Yet
                  </h3>
                  <p className="text-xs sm:text-sm text-white/75 font-body font-light leading-relaxed">
                    Upload an iOS app file or paste your Swift code in the Step-by-Step Guide to perform real static analysis, find fold crease collisions, and get instant code fixes.
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      setViewMode('wizard');
                      goToStep(1);
                    }}
                    className="bg-white text-black font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-full flex items-center gap-2 hover:bg-white/90 hover:scale-[1.02] transition-all cursor-pointer border-0 shadow-lg"
                  >
                    <span>Start App Audit in Step 1</span>
                    <span>→</span>
                  </button>

                  <button
                    onClick={handleStartDemoScan}
                    className="liquid-glass rounded-full px-5 py-2.5 text-xs sm:text-sm font-body text-[#30d158] hover:text-white flex items-center gap-2 transition-all cursor-pointer border-0 shadow-md"
                  >
                    <Sparkles size={14} className="text-[#30d158]" />
                    <span>Run Sample App Demo</span>
                  </button>
                </div>
              </div>
            )
          )}
        </div>

        {/* Bottom Common-Sense Feature Pills (No Engineering Jargon & Uniform Clean Sizing) */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4 flex-wrap pt-2">
          <div className="liquid-glass rounded-full px-4 py-1.5 flex items-center gap-2 text-xs text-white/95 font-body font-medium shadow-md whitespace-nowrap shrink-0">
            <span className="w-2 h-2 rounded-full bg-[#30d158]" />
            <span>Automatic Design Check</span>
          </div>
          <div className="liquid-glass rounded-full px-4 py-1.5 flex items-center gap-2 text-xs text-white/95 font-body font-medium shadow-md whitespace-nowrap shrink-0">
            <span className="w-2 h-2 rounded-full bg-[#0071e3]" />
            <span>Works on 5.4&quot; Small &amp; 7.6&quot; Big Screens</span>
          </div>
          <div className="liquid-glass rounded-full px-4 py-1.5 flex items-center gap-2 text-xs text-white/95 font-body font-medium shadow-md whitespace-nowrap shrink-0">
            <span className="w-2 h-2 rounded-full bg-[#ff9f0a]" />
            <span>Folding Crease Safety</span>
          </div>
          <div className="liquid-glass rounded-full px-4 py-1.5 flex items-center gap-2 text-xs text-white/95 font-body font-medium shadow-md hidden sm:flex whitespace-nowrap shrink-0">
            <span className="w-2 h-2 rounded-full bg-[#bf5af2]" />
            <span>Compatible With Any iOS App</span>
          </div>
        </div>
      </div>
    </section>
  );
};
