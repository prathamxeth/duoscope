'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useWizard } from '../../context/WizardContext';
import { Smartphone, Monitor, Sliders, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';

export const Step2DeviceConfig: React.FC = () => {
  const { deviceProfile, updateDeviceProfile, nextStep, prevStep } = useWizard();
  const [selectedProfile, setSelectedProfile] = useState<'mobile_5_4' | 'desktop_7_6'>('desktop_7_6');

  const handleHingeMarginChange = (safeMarginPt: number) => {
    updateDeviceProfile({
      hinge: {
        ...deviceProfile.hinge,
        safeMarginPt
      }
    });
  };

  const handleSelectProfile = (profile: 'mobile_5_4' | 'desktop_7_6') => {
    setSelectedProfile(profile);
    if (profile === 'mobile_5_4') {
      updateDeviceProfile({
        hinge: {
          ...deviceProfile.hinge,
          safeMarginPt: 0
        }
      });
    } else {
      updateDeviceProfile({
        hinge: {
          ...deviceProfile.hinge,
          safeMarginPt: 16
        }
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-5 w-full">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1">
        <div>
          <span className="font-heading italic text-2xl sm:text-3xl text-white">
            Screen Profiles &amp; Fold Crease Buffer
          </span>
          <p className="text-xs sm:text-sm font-body text-white/70 font-light mt-0.5">
            Test how your app adapts across 5.4&quot; Mobile Cover and 7.6&quot; Desktop/Dual Canvas viewports.
          </p>
        </div>

        {/* Profile Switcher Segmented Control */}
        <div className="liquid-glass rounded-full p-1 flex gap-1 self-start sm:self-auto shrink-0 shadow-lg">
          <button
            onClick={() => handleSelectProfile('mobile_5_4')}
            className={`px-3 sm:px-4 py-1.5 rounded-full text-xs font-body font-medium transition-all cursor-pointer flex items-center gap-1.5 border-0 ${
              selectedProfile === 'mobile_5_4'
                ? 'bg-[#2997ff] text-white font-semibold shadow-md scale-[1.02]'
                : 'bg-transparent text-white/75 hover:text-white'
            }`}
          >
            <Smartphone size={14} />
            <span>5.4&quot; Mobile View</span>
          </button>
          <button
            onClick={() => handleSelectProfile('desktop_7_6')}
            className={`px-3 sm:px-4 py-1.5 rounded-full text-xs font-body font-medium transition-all cursor-pointer flex items-center gap-1.5 border-0 ${
              selectedProfile === 'desktop_7_6'
                ? 'bg-[#30d158] text-white font-semibold shadow-md scale-[1.02]'
                : 'bg-transparent text-white/75 hover:text-white'
            }`}
          >
            <Monitor size={14} />
            <span>7.6&quot; Desktop Canvas</span>
          </button>
        </div>
      </div>

      {/* Interactive Posture Selection Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 items-stretch">
        {/* Left: 5.4" Outer Cover Card (Mobile Profile) */}
        <div
          onClick={() => handleSelectProfile('mobile_5_4')}
          className={`liquid-glass rounded-3xl p-5 sm:p-6 flex flex-col gap-4 cursor-pointer transition-all border ${
            selectedProfile === 'mobile_5_4'
              ? 'ring-2 ring-[#2997ff] border-[#2997ff]/40 bg-white/[0.04] shadow-2xl scale-[1.01]'
              : 'border-white/10 hover:border-white/25'
          }`}
          style={{ borderTop: '2px solid #2997ff' }}
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2.5">
              <Smartphone size={20} className="text-[#2997ff]" />
              <span className="font-heading italic text-xl sm:text-2xl text-white">
                5.4&quot; Mobile Cover
              </span>
            </div>
            {selectedProfile === 'mobile_5_4' ? (
              <span className="bg-[#2997ff]/20 text-[#2997ff] border border-[#2997ff]/40 text-[11px] font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 size={12} />
                <span>Active Profile</span>
              </span>
            ) : (
              <span className="liquid-glass text-white/70 text-[11px] px-2.5 py-0.5 rounded-full">
                Single-Handed
              </span>
            )}
          </div>

          <div className="relative h-36 sm:h-40 rounded-xl overflow-hidden border border-white/10 shadow-lg">
            <Image
              src="/assets/duo/closed__3le61imm1w2e_large_2x.jpg"
              alt="iPhone Duo Closed"
              fill
              className="object-cover"
            />
          </div>

          <div className="text-xs sm:text-sm text-white/75 flex flex-col gap-2 font-body">
            <div className="flex justify-between">
              <span>Logical Resolution:</span>
              <span className="font-mono text-white font-semibold tabular-nums">390 × 844 pt</span>
            </div>
            <div className="flex justify-between">
              <span>Physical Screen:</span>
              <span className="font-mono text-white/90 font-medium tabular-nums">1080 × 2420 px @3x</span>
            </div>
            <div className="flex justify-between">
              <span>Display Smoothness:</span>
              <span className="font-mono text-[#30d158] font-semibold">120Hz ProMotion</span>
            </div>
          </div>
        </div>

        {/* Right: 7.6" Inner Canvas Card (Desktop / Dual Canvas Profile) */}
        <div
          onClick={() => handleSelectProfile('desktop_7_6')}
          className={`liquid-glass rounded-3xl p-5 sm:p-6 flex flex-col gap-4 cursor-pointer transition-all border ${
            selectedProfile === 'desktop_7_6'
              ? 'ring-2 ring-[#30d158] border-[#30d158]/40 bg-white/[0.04] shadow-2xl scale-[1.01]'
              : 'border-white/10 hover:border-white/25'
          }`}
          style={{ borderTop: '2px solid #30d158' }}
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2.5">
              <Monitor size={20} className="text-[#30d158]" />
              <span className="font-heading italic text-xl sm:text-2xl text-white">
                7.6&quot; Desktop Canvas
              </span>
            </div>
            {selectedProfile === 'desktop_7_6' ? (
              <span className="bg-[#30d158]/20 text-[#30d158] border border-[#30d158]/40 text-[11px] font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 size={12} />
                <span>Active Profile</span>
              </span>
            ) : (
              <span className="liquid-glass text-white/70 text-[11px] px-2.5 py-0.5 rounded-full">
                Expanded
              </span>
            )}
          </div>

          <div className="relative h-36 sm:h-40 rounded-xl overflow-hidden border border-white/10 shadow-lg">
            <Image
              src="/assets/duo/display__bx48n0ntsgvm_large_2x.jpg"
              alt="iPhone Duo Unfolded Canvas"
              fill
              className="object-cover"
            />
          </div>

          <div className="text-xs sm:text-sm text-white/75 flex flex-col gap-2 font-body">
            <div className="flex justify-between">
              <span>Logical Resolution:</span>
              <span className="font-mono text-white font-semibold tabular-nums">768 × 844 pt</span>
            </div>
            <div className="flex justify-between">
              <span>Physical Screen:</span>
              <span className="font-mono text-white/90 font-medium tabular-nums">2156 × 2160 px @3x</span>
            </div>
            <div className="flex justify-between">
              <span>Hinge Seam Location:</span>
              <span className="font-mono text-[#2997ff] font-semibold">x = 384 pt (Center)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Target Form Factor & Hinge Fine-Tuning */}
      <div className="liquid-glass rounded-3xl p-5 sm:p-7 flex flex-col gap-5 border border-white/10 shadow-xl">
        <div className="flex justify-between items-center flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <Sliders size={20} className="text-[#2997ff]" />
            <h3 className="font-heading italic text-2xl sm:text-3xl text-white">Fold Line Safe Spacing</h3>
          </div>
          <span className="liquid-glass text-[#30d158] text-xs font-semibold px-3 py-1 rounded-full border border-[#30d158]/30">
            Active Protection
          </span>
        </div>

        {/* Hinge Form Factor Segmented Picker */}
        <div>
          <label className="block text-xs text-white/75 mb-2 font-medium">
            Folding Direction
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              onClick={() => updateDeviceProfile({ hinge: { ...deviceProfile.hinge, orientation: 'vertical' } })}
              className={`p-3 rounded-xl text-xs sm:text-sm font-body font-medium transition-all cursor-pointer border-0 flex items-center justify-center gap-2 ${
                deviceProfile.hinge.orientation === 'vertical'
                  ? 'bg-white text-black font-semibold shadow-md'
                  : 'liquid-glass text-white/80 hover:text-white'
              }`}
            >
              📖 Book Style (Left &amp; Right)
            </button>
            <button
              onClick={() => updateDeviceProfile({ hinge: { ...deviceProfile.hinge, orientation: 'horizontal' } })}
              className={`p-3 rounded-xl text-xs sm:text-sm font-body font-medium transition-all cursor-pointer border-0 flex items-center justify-center gap-2 ${
                deviceProfile.hinge.orientation === 'horizontal'
                  ? 'bg-white text-black font-semibold shadow-md'
                  : 'liquid-glass text-white/80 hover:text-white'
              }`}
            >
              📱 Flip Phone (Top &amp; Bottom)
            </button>
          </div>
        </div>

        {/* Hinge Seam Safe Margin Slider */}
        <div>
          <div className="flex justify-between mb-2 text-xs sm:text-sm">
            <span className="text-white font-medium font-body">Safe Distance from Fold Crease:</span>
            <span className="font-mono font-bold text-[#2997ff] tabular-nums">
              {deviceProfile.hinge.safeMarginPt} pt ({deviceProfile.hinge.safeMarginPt * 3} px)
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="32"
            step="2"
            value={deviceProfile.hinge.safeMarginPt}
            onChange={(e) => handleHingeMarginChange(Number(e.target.value))}
            className="w-full accent-white cursor-pointer h-2 bg-white/20 rounded-lg"
          />
          <div className="flex justify-between text-[11px] text-white/50 mt-1 font-body">
            <span>0 pt (Flush Edge)</span>
            <span>16 pt (Recommended Safe Buffer)</span>
            <span>32 pt (Extra Wide Guard)</span>
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-3 pt-2">
        <button
          onClick={prevStep}
          className="w-full sm:w-auto liquid-glass rounded-full px-5 py-2.5 text-xs sm:text-sm font-body text-white/90 hover:text-white flex items-center justify-center gap-2 transition-all cursor-pointer border-0 shadow-md"
        >
          <ArrowLeft size={16} />
          <span>Back to App Selection</span>
        </button>

        <button
          onClick={nextStep}
          className="w-full sm:w-auto bg-white text-black font-semibold text-xs sm:text-sm px-6 py-2.5 rounded-full flex items-center justify-center gap-2 hover:bg-white/90 hover:scale-[1.02] transition-all cursor-pointer border-0 shadow-lg"
        >
          <span>Continue to Automatic Scan</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};
