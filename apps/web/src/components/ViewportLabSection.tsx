'use client';

import React, { useState } from 'react';
import { FadingVideo } from './FadingVideo';
import { BlurText } from './BlurText';
import { Smartphone, Tablet, Sliders, ShieldCheck, Cpu, Activity, Layers } from 'lucide-react';
import { HingeOverlay } from './HingeOverlay';

export const ViewportLabSection: React.FC = () => {
  const [deviceState, setDeviceState] = useState<'compact_outer_5_4' | 'expanded_inner_7_6'>('expanded_inner_7_6');
  const [foldAngle, setFoldAngle] = useState<number>(180);

  const scale = 0.52;
  const isExpanded = deviceState === 'expanded_inner_7_6';

  const containerWidth = isExpanded ? 768 * scale : 375 * scale;
  const containerHeight = 812 * scale;

  const handleStateChange = (state: 'compact_outer_5_4' | 'expanded_inner_7_6') => {
    setDeviceState(state);
    if (state === 'compact_outer_5_4') {
      setFoldAngle(0);
    } else {
      setFoldAngle(180);
    }
  };

  const leftPaneRotation = foldAngle < 180 ? (180 - foldAngle) / 2 : 0;
  const rightPaneRotation = foldAngle < 180 ? -(180 - foldAngle) / 2 : 0;
  const seamShadowOpacity = foldAngle < 180 ? (180 - foldAngle) / 180 * 0.8 : 0;

  const handleScrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="viewport-lab" className="min-h-screen relative overflow-hidden bg-black flex flex-col justify-between select-none py-16 md:py-24">
      {/* Background Cinematic Fading Video 2 */}
      <FadingVideo
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260622_093722_ccfc7ebf-182f-419f-8a62-2dc02db7dd9d.mp4"
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-75"
      />

      {/* Main Content Container */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 md:px-8 max-w-6xl mx-auto w-full text-center">
        {/* Header Area */}
        <div className="text-center max-w-3xl flex flex-col items-center mb-8">
          <div className="text-xs font-body text-[#2997ff] mb-2 tracking-wider font-semibold uppercase flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#2997ff] animate-pulse" />
            // Hardware Emulation &amp; Hinge Seam Guard
          </div>

          <BlurText
            text="Interactive Viewport & Hinge Simulator"
            className="text-4xl md:text-6xl lg:text-[4.75rem] font-heading italic text-white leading-[0.92] tracking-[-3px]"
          />

          <p className="text-sm md:text-base text-white/80 font-body font-light mt-3 max-w-2xl leading-relaxed">
            Direct manipulation testing: rotate physical hinge angles (0° to 180°), toggle 5.4&quot; compact vs. 7.6&quot; dual-canvas, and verify central seam safe insets in real time.
          </p>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* iPhone Duo 3D Viewport Simulator Screen */}
        {/* ------------------------------------------------------------------ */}
        <div className="w-full max-w-5xl liquid-glass rounded-3xl p-6 md:p-8 flex flex-col lg:flex-row gap-8 items-center justify-between shadow-2xl border border-white/10">
          {/* Left Controls & Telemetry Column */}
          <div className="flex flex-col gap-4 w-full lg:w-[360px] shrink-0 text-left">
            {/* Display Segmented Switch */}
            <div className="liquid-glass rounded-2xl p-3 flex flex-col gap-2.5">
              <span className="text-xs text-white/70 font-body uppercase tracking-wider font-semibold">
                Active Display Canvas
              </span>
              <div className="liquid-glass rounded-xl p-1 flex gap-1.5">
                <button
                  onClick={() => handleStateChange('compact_outer_5_4')}
                  className={`flex-1 rounded-lg py-2 px-3 text-xs font-body flex items-center justify-center gap-2 transition-all cursor-pointer border-0 ${
                    !isExpanded
                      ? 'bg-white text-black font-semibold shadow-md'
                      : 'liquid-glass text-white/80 hover:text-white'
                  }`}
                >
                  <Smartphone size={14} />
                  <span>5.4&quot; Cover</span>
                </button>
                <button
                  onClick={() => handleStateChange('expanded_inner_7_6')}
                  className={`flex-1 rounded-lg py-2 px-3 text-xs font-body flex items-center justify-center gap-2 transition-all cursor-pointer border-0 ${
                    isExpanded
                      ? 'bg-white text-black font-semibold shadow-md'
                      : 'liquid-glass text-white/80 hover:text-white'
                  }`}
                >
                  <Tablet size={14} />
                  <span>7.6&quot; Dual Canvas</span>
                </button>
              </div>
            </div>

            {/* Fold Angle Slider */}
            {isExpanded && (
              <div className="liquid-glass rounded-2xl p-4 flex flex-col gap-2.5">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Sliders size={14} className="text-[#0a84ff]" />
                    <span className="text-xs text-white/90 font-body font-medium">Hinge Angle:</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#0a84ff] tabular-nums">
                    {foldAngle}° <span className="text-[10px] text-white/50 font-normal">{foldAngle === 180 ? '(Flat 180°)' : foldAngle >= 90 ? '(Flex Tabletop)' : '(Tent Posture)'}</span>
                  </span>
                </div>
                <div className="flex items-center gap-2.5 pt-1">
                  <span className="text-[10px] font-mono text-white/50">0°</span>
                  <input
                    type="range"
                    min="0"
                    max="180"
                    step="5"
                    value={foldAngle}
                    onChange={(e) => setFoldAngle(Number(e.target.value))}
                    className="w-full accent-white cursor-pointer h-2 bg-white/20 rounded-lg"
                  />
                  <span className="text-[10px] font-mono text-white/50">180°</span>
                </div>
              </div>
            )}

            {/* Real-time Telemetry Card */}
            <div className="liquid-glass rounded-2xl p-4 flex flex-col gap-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/60 font-body">Seam Inset Margin:</span>
                <span className="font-mono text-white text-xs font-semibold">14pt Safe Buffer</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/60 font-body">Layout Size Class:</span>
                <span className="font-mono text-[#30d158] text-xs font-semibold">
                  {isExpanded ? 'Regular × Regular' : 'Compact × Regular'}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/60 font-body">Hitch Frame Budget:</span>
                <span className="font-mono text-[#2997ff] text-xs font-semibold">16.6ms (120Hz)</span>
              </div>
            </div>

            <button
              onClick={() => handleScrollToSection('audit-studio')}
              className="liquid-button liquid-button-primary rounded-xl py-2.5 px-4 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer border-0 shadow-lg hover:scale-105 transition-transform"
            >
              <span>Run Automated AST Audit</span>
              <ShieldCheck size={15} color="#000000" />
            </button>
          </div>

          {/* Right 3D Hardware Simulation Stage */}
          <div className="flex-1 w-full flex items-center justify-center min-h-[360px] md:min-h-[420px] bg-black/60 rounded-2xl p-6 perspective-[1200px] border border-white/10 relative overflow-hidden">
            <div
              style={{
                position: 'relative',
                width: `${containerWidth}px`,
                height: `${containerHeight}px`,
                transition: 'width 300ms cubic-bezier(0.16, 1, 0.3, 1), height 300ms cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: '0 24px 60px rgba(0, 0, 0, 0.95), 0 0 30px rgba(0, 113, 227, 0.2)',
                borderRadius: '26px',
                border: '8px solid #2c2c2e',
                background: '#000000',
                overflow: 'hidden',
                display: 'flex'
              }}
            >
              {isExpanded ? (
                <>
                  {/* Left Pane */}
                  <div
                    style={{
                      flex: 1,
                      height: '100%',
                      transform: `rotateY(${leftPaneRotation}deg)`,
                      transformOrigin: 'right center',
                      transition: 'transform 160ms ease-out',
                      background: '#141416',
                      borderRight: '1px solid rgba(255, 255, 255, 0.08)',
                      padding: '14px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px'
                    }}
                  >
                    <div className="font-body text-xs font-semibold text-white/90 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2997ff]" />
                      <span>Primary Pane</span>
                    </div>
                    <div className="flex-1 bg-white/[0.04] rounded-xl p-3 text-xs text-white/60 font-body flex flex-col justify-between border border-white/5">
                      <div className="flex flex-col gap-1">
                        <div className="text-white font-medium text-xs">NavigationSidebar</div>
                        <div>• ItemCatalogView</div>
                        <div>• SectionFilters</div>
                        <div>• CategoryPicker</div>
                      </div>
                      <div className="text-[10px] text-[#30d158] font-mono">Safe Inset: OK</div>
                    </div>
                  </div>

                  {/* Crease Center Shadow */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      bottom: 0,
                      left: '50%',
                      width: '8px',
                      transform: 'translateX(-50%)',
                      background: `linear-gradient(to right, rgba(0,0,0,${seamShadowOpacity}), transparent, rgba(0,0,0,${seamShadowOpacity}))`,
                      pointerEvents: 'none',
                      zIndex: 20
                    }}
                  />

                  {/* Right Pane */}
                  <div
                    style={{
                      flex: 1,
                      height: '100%',
                      transform: `rotateY(${rightPaneRotation}deg)`,
                      transformOrigin: 'left center',
                      transition: 'transform 160ms ease-out',
                      background: '#141416',
                      padding: '14px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px'
                    }}
                  >
                    <div className="font-body text-xs font-semibold text-white/90 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#30d158]" />
                      <span>Detail Canvas</span>
                    </div>
                    <div className="flex-1 bg-white/[0.04] rounded-xl p-3 text-xs text-white/60 font-body flex flex-col justify-between border border-white/5">
                      <div className="flex flex-col gap-1">
                        <div className="text-white font-medium text-xs">DetailContentView</div>
                        <div>• CartSummaryInspector</div>
                        <div>• PaymentCTAButton</div>
                        <div>• LiveOrderTracking</div>
                      </div>
                      <div className="text-[10px] text-[#2997ff] font-mono">TwoPaneSplit: OK</div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="w-full h-full p-4 bg-[#141416] flex flex-col gap-3">
                  <div className="font-body text-xs font-semibold text-white/90 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff9f0a]" />
                    <span>5.4&quot; Outer Cover Display</span>
                  </div>
                  <div className="flex-1 bg-white/[0.04] rounded-xl p-3.5 text-xs text-white/60 font-body flex flex-col justify-between border border-white/5">
                    <div className="flex flex-col gap-1.5">
                      <div className="text-white font-medium text-xs">Single-Column Stack</div>
                      <div>• TabBarController</div>
                      <div>• CompactFlowLayout</div>
                      <div>• ModalSheetPresentation</div>
                    </div>
                    <div className="text-[11px] text-[#30d158] font-mono">Compact 375×812pt</div>
                  </div>
                </div>
              )}

              {/* Hinge Collision Overlay */}
              {isExpanded && (
                <HingeOverlay
                  scale={scale}
                  hingeSpec={{
                    orientation: 'vertical',
                    centerOffset: 384,
                    physicalWidth: 4,
                    safeMarginPt: 14
                  }}
                  collisions={[]}
                />
              )}
            </div>
          </div>
        </div>

        {/* Diagnostic Capabilities Cards */}
        <div className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <div className="liquid-glass rounded-2xl p-4 flex items-center gap-3 text-left hover:bg-white/[0.04] transition-colors">
            <div className="p-2 rounded-xl liquid-glass text-[#30d158] shrink-0">
              <ShieldCheck size={18} />
            </div>
            <div>
              <div className="text-xs font-semibold text-white font-body">Seam Guard</div>
              <div className="text-[11px] text-white/60 font-body leading-tight">Touch invalidation check</div>
            </div>
          </div>

          <div className="liquid-glass rounded-2xl p-4 flex items-center gap-3 text-left hover:bg-white/[0.04] transition-colors">
            <div className="p-2 rounded-xl liquid-glass text-[#2997ff] shrink-0">
              <Cpu size={18} />
            </div>
            <div>
              <div className="text-xs font-semibold text-white font-body">AST Static Linter</div>
              <div className="text-[11px] text-white/60 font-body leading-tight">SwiftUI &amp; UIKit traps</div>
            </div>
          </div>

          <div className="liquid-glass rounded-2xl p-4 flex items-center gap-3 text-left hover:bg-white/[0.04] transition-colors">
            <div className="p-2 rounded-xl liquid-glass text-[#ff9f0a] shrink-0">
              <Activity size={18} />
            </div>
            <div>
              <div className="text-xs font-semibold text-white font-body">Hitch Profiler</div>
              <div className="text-[11px] text-white/60 font-body leading-tight">0° to 180° frame stalls</div>
            </div>
          </div>

          <div className="liquid-glass rounded-2xl p-4 flex items-center gap-3 text-left hover:bg-white/[0.04] transition-colors">
            <div className="p-2 rounded-xl liquid-glass text-[#bf5af2] shrink-0">
              <Layers size={18} />
            </div>
            <div>
              <div className="text-xs font-semibold text-white font-body">TwoPane Split</div>
              <div className="text-[11px] text-white/60 font-body leading-tight">SplitLayout constraints</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
