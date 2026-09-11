'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import {
  Smartphone,
  Tablet,
  Sliders,
  RotateCcw,
  ShoppingBag,
  Film,
  MapPin,
  ShieldCheck,
  Compass,
  ZoomIn,
  ZoomOut,
  Play,
  Pause,
  Maximize2,
  Laptop,
  BookOpen,
  Tent,
  Eye
} from 'lucide-react';

interface Realistic3DPhoneSimulatorProps {
  initialAngle?: number;
  initialMode?: 'compact_outer_5_4' | 'expanded_inner_7_6';
}

type DevicePosture = 'portrait_flat' | 'landscape_flat' | 'laptop_flex' | 'book_reading' | 'tent_standing' | 'closed_cover';
type DemoAppMode = 'duostore' | 'cinema' | 'maps' | 'safety';
type ViewEngine = '3d_interactive' | 'apple_studio_renders';

interface StudioRenderItem {
  id: DevicePosture;
  label: string;
  angle: number;
  image: string;
  description: string;
  aspect: string;
}

const STUDIO_RENDERS: StudioRenderItem[] = [
  {
    id: 'portrait_flat',
    label: 'Portrait Dual-Screen',
    angle: 180,
    image: '/assets/duo/portrait__15lry9l2g8ye_large_2x.png',
    description: 'Expansive 7.6" vertical canvas for reading, typing, and side-by-side app multitasking.',
    aspect: '768 × 1024 pt (4:3)'
  },
  {
    id: 'landscape_flat',
    label: 'Landscape Wide Screen',
    angle: 180,
    image: '/assets/duo/landscape__f7x2oe1oxemy_large_2x.png',
    description: 'Ultrawide horizontal canvas for immersive cinema, video editing, and split timelines.',
    aspect: '1024 × 768 pt (16:9)'
  },
  {
    id: 'laptop_flex',
    label: 'Laptop Tabletop Stand',
    angle: 90,
    image: '/assets/duo/laptop__c7kl6vmsqd6q_large_2x.png',
    description: '90° flex posture on a desk with top media playback and lower touch trackpad/controls.',
    aspect: 'Split 90° Flex'
  },
  {
    id: 'tent_standing',
    label: 'Standing Tent Mode',
    angle: 60,
    image: '/assets/duo/tent__68ysumotbs2m_large_2x.png',
    description: 'Self-standing inverted posture for hands-free video calls, timers, and bedside clock.',
    aspect: 'A-Frame Standing'
  },
  {
    id: 'book_reading',
    label: 'Book Reading Curve',
    angle: 125,
    image: '/assets/duo/hero__dbnzxlb3ia2q_large_2x-1.png',
    description: 'Natural 125° curvature for two-page reading and comfortable handheld dual-screen ergonomics.',
    aspect: '125° Ergonomic Curve'
  },
  {
    id: 'closed_cover',
    label: '5.4" Compact Cover',
    angle: 0,
    image: '/assets/duo/closed__3le61imm1w2e_large_2x.png',
    description: 'Single-handed 5.4-inch OLED cover display with Ceramic Shield for quick actions.',
    aspect: '375 × 812 pt (19.5:9)'
  }
];

export const Realistic3DPhoneSimulator: React.FC<Realistic3DPhoneSimulatorProps> = ({
  initialAngle = 180
}) => {
  // Simulator State
  const [engineMode, setEngineMode] = useState<ViewEngine>('3d_interactive');
  const [posture, setPosture] = useState<DevicePosture>('portrait_flat');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [foldAngle, setFoldAngle] = useState<number>(initialAngle);
  const [activeApp, setActiveApp] = useState<DemoAppMode>('duostore');

  // 3D Spatial Rotation State
  const [rotX, setRotX] = useState<number>(10);
  const [rotY, setRotY] = useState<number>(-12);
  const [rotZ, setRotZ] = useState<number>(0);
  const [zoom, setZoom] = useState<number>(1);
  const [isAutoOrbit, setIsAutoOrbit] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const stageRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{ x: number; y: number; rotX: number; rotY: number }>({ x: 0, y: 0, rotX: 0, rotY: 0 });

  const isClosed = posture === 'closed_cover' || foldAngle === 0;
  const isLandscape = orientation === 'landscape';

  // Quick Posture Switcher
  const selectPosture = (targetPosture: DevicePosture) => {
    setPosture(targetPosture);
    if (targetPosture === 'closed_cover') {
      setFoldAngle(0);
      setOrientation('portrait');
      setRotX(5);
      setRotY(-8);
      setRotZ(0);
    } else if (targetPosture === 'portrait_flat') {
      setFoldAngle(180);
      setOrientation('portrait');
      setRotX(10);
      setRotY(-12);
      setRotZ(0);
    } else if (targetPosture === 'landscape_flat') {
      setFoldAngle(180);
      setOrientation('landscape');
      setRotX(12);
      setRotY(-10);
      setRotZ(90);
    } else if (targetPosture === 'laptop_flex') {
      setFoldAngle(90);
      setOrientation('landscape');
      setRotX(28);
      setRotY(-8);
      setRotZ(0);
    } else if (targetPosture === 'book_reading') {
      setFoldAngle(125);
      setOrientation('portrait');
      setRotX(12);
      setRotY(-20);
      setRotZ(0);
    } else if (targetPosture === 'tent_standing') {
      setFoldAngle(60);
      setOrientation('landscape');
      setRotX(-18);
      setRotY(40);
      setRotZ(0);
    }
  };

  // Reset 3D Camera
  const resetCamera = () => {
    setRotX(10);
    setRotY(-12);
    setRotZ(isLandscape ? 90 : 0);
    setZoom(1);
    setIsAutoOrbit(false);
  };

  // Auto Orbit Animation Loop
  useEffect(() => {
    if (!isAutoOrbit) return;
    let animId: number;
    let currentY = rotY;

    const loop = () => {
      currentY = (currentY + 0.35) % 360;
      setRotY(currentY);
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isAutoOrbit, rotY]);

  // Pointer Handlers for 3D Free Rotation
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      rotX,
      rotY
    };
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartRef.current.x;
    const deltaY = e.clientY - dragStartRef.current.y;

    const newRotY = dragStartRef.current.rotY + deltaX * 0.45;
    const newRotX = Math.max(-60, Math.min(60, dragStartRef.current.rotX - deltaY * 0.4));

    setRotX(newRotX);
    setRotY(newRotY);
  }, [isDragging]);

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    try {
      (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
    } catch (_) {}
  };

  // Fold physics & pane rotation calculation
  const leftPaneRotation = !isClosed && foldAngle < 180 ? (180 - foldAngle) / 2 : 0;
  const rightPaneRotation = !isClosed && foldAngle < 180 ? -(180 - foldAngle) / 2 : 0;
  const creaseShadowFactor = !isClosed && foldAngle < 180 ? (180 - foldAngle) / 180 : 0;

  const currentStudioItem = STUDIO_RENDERS.find((r) => r.id === posture) || STUDIO_RENDERS[0]!;

  return (
    <div className="w-full flex flex-col gap-4 select-none">
      {/* ------------------------------------------------------------------ */}
      {/* Top Controls Bar: View Engine, Postures, App Scenarios, 3D Tools */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-transparent p-3 sm:p-4 rounded-3xl border border-white/20 shadow-2xl">
        {/* Left: Engine Mode (Interactive 3D vs Apple Photoreal Renders) */}
        <div className="flex items-center gap-2">
          <div className="bg-transparent border border-white/20 rounded-full p-1 flex gap-1">
            <button
              onClick={() => setEngineMode('3d_interactive')}
              className={`rounded-full px-3.5 py-1.5 text-xs font-body flex items-center gap-1.5 transition-all cursor-pointer border-0 ${
                engineMode === '3d_interactive'
                  ? 'bg-white text-black font-semibold shadow-md scale-[1.02]'
                  : 'bg-transparent text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <Compass size={13} />
              <span>Interactive 3D Object</span>
            </button>
            <button
              onClick={() => setEngineMode('apple_studio_renders')}
              className={`rounded-full px-3.5 py-1.5 text-xs font-body flex items-center gap-1.5 transition-all cursor-pointer border-0 ${
                engineMode === 'apple_studio_renders'
                  ? 'bg-white text-black font-semibold shadow-md scale-[1.02]'
                  : 'bg-transparent text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <Eye size={13} />
              <span>Apple Hardware Renders</span>
            </button>
          </div>
        </div>

        {/* Center: Live App Screen Scenario Selector */}
        {engineMode === '3d_interactive' && (
          <div className="flex items-center gap-1 bg-transparent border border-white/20 rounded-full p-1">
            <button
              onClick={() => setActiveApp('duostore')}
              title="Two-Pane Store Catalog"
              className={`px-3 py-1.5 rounded-full text-xs font-body flex items-center gap-1.5 transition-all cursor-pointer border-0 ${
                activeApp === 'duostore'
                  ? 'bg-white/20 text-white font-semibold shadow-inner'
                  : 'bg-transparent text-white/75 hover:text-white hover:bg-white/10'
              }`}
            >
              <ShoppingBag size={13} />
              <span className="hidden sm:inline">DuoStore</span>
            </button>
            <button
              onClick={() => setActiveApp('cinema')}
              title="Flex Split Cinema Player"
              className={`px-3 py-1.5 rounded-full text-xs font-body flex items-center gap-1.5 transition-all cursor-pointer border-0 ${
                activeApp === 'cinema'
                  ? 'bg-white/20 text-white font-semibold shadow-inner'
                  : 'bg-transparent text-white/75 hover:text-white hover:bg-white/10'
              }`}
            >
              <Film size={13} />
              <span className="hidden sm:inline">Cinema Flex</span>
            </button>
            <button
              onClick={() => setActiveApp('maps')}
              title="Split Maps & Satellite"
              className={`px-3 py-1.5 rounded-full text-xs font-body flex items-center gap-1.5 transition-all cursor-pointer border-0 ${
                activeApp === 'maps'
                  ? 'bg-white/20 text-white font-semibold shadow-inner'
                  : 'bg-transparent text-white/75 hover:text-white hover:bg-white/10'
              }`}
            >
              <MapPin size={13} />
              <span className="hidden sm:inline">Maps</span>
            </button>
            <button
              onClick={() => setActiveApp('safety')}
              title="Center Crease Safe Heatmap"
              className={`px-3 py-1.5 rounded-full text-xs font-body flex items-center gap-1.5 transition-all cursor-pointer border-0 ${
                activeApp === 'safety'
                  ? 'bg-white/20 text-white font-semibold shadow-inner'
                  : 'bg-transparent text-white/75 hover:text-white hover:bg-white/10'
              }`}
            >
              <ShieldCheck size={13} />
              <span className="hidden sm:inline">Safe Margin</span>
            </button>
          </div>
        )}

        {/* Right: 3D Camera Controls */}
        <div className="flex items-center gap-1.5">
          {engineMode === '3d_interactive' && (
            <>
              {/* Orientation Toggle Button */}
              <button
                onClick={() => {
                  const nextOrientation = isLandscape ? 'portrait' : 'landscape';
                  setOrientation(nextOrientation);
                  setRotZ(nextOrientation === 'landscape' ? 90 : 0);
                }}
                title={isLandscape ? 'Switch to Vertical Portrait' : 'Switch to Horizontal Landscape'}
                className="bg-transparent border border-white/20 hover:border-white/40 hover:bg-white/10 px-3 py-1.5 rounded-full text-xs font-body text-white/90 hover:text-white flex items-center gap-1.5 cursor-pointer"
              >
                <span>{isLandscape ? 'Landscape 90°' : 'Portrait'}</span>
              </button>

              {/* Auto-Orbit Toggle */}
              <button
                onClick={() => setIsAutoOrbit(!isAutoOrbit)}
                title={isAutoOrbit ? 'Pause 3D Orbit' : 'Auto-Rotate in 3D Space'}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs transition-all cursor-pointer border border-white/20 ${
                  isAutoOrbit ? 'bg-[#0071e3] text-white shadow-lg border-[#0071e3]' : 'bg-transparent text-white/80 hover:text-white hover:bg-white/10 hover:border-white/40'
                }`}
              >
                {isAutoOrbit ? <Pause size={13} /> : <Play size={13} />}
              </button>

              {/* Zoom Controls */}
              <button
                onClick={() => setZoom((z) => Math.max(0.65, z - 0.1))}
                title="Zoom Out"
                className="bg-transparent border border-white/20 hover:border-white/40 hover:bg-white/10 w-8 h-8 rounded-full flex items-center justify-center text-white/80 hover:text-white text-xs cursor-pointer"
              >
                <ZoomOut size={13} />
              </button>
              <button
                onClick={() => setZoom((z) => Math.min(1.35, z + 0.1))}
                title="Zoom In"
                className="bg-transparent border border-white/20 hover:border-white/40 hover:bg-white/10 w-8 h-8 rounded-full flex items-center justify-center text-white/80 hover:text-white text-xs cursor-pointer"
              >
                <ZoomIn size={13} />
              </button>

              {/* Reset Camera */}
              <button
                onClick={resetCamera}
                title="Reset Camera Angle"
                className="bg-transparent border border-white/20 hover:border-white/40 hover:bg-white/10 w-8 h-8 rounded-full flex items-center justify-center text-white/80 hover:text-white text-xs cursor-pointer"
              >
                <RotateCcw size={13} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Postures Navigation Pill Bar (All Positions) */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => selectPosture('portrait_flat')}
          className={`px-3.5 py-2 rounded-2xl text-xs font-body font-medium flex items-center gap-1.5 transition-all cursor-pointer border shrink-0 ${
            posture === 'portrait_flat'
              ? 'bg-white text-black font-semibold shadow-lg scale-[1.02] border-white'
              : 'bg-transparent border-white/20 hover:border-white/40 hover:bg-white/10 text-white/85 hover:text-white'
          }`}
        >
          <Tablet size={13} />
          <span>Portrait Flat (180°)</span>
        </button>

        <button
          onClick={() => selectPosture('landscape_flat')}
          className={`px-3.5 py-2 rounded-2xl text-xs font-body font-medium flex items-center gap-1.5 transition-all cursor-pointer border shrink-0 ${
            posture === 'landscape_flat'
              ? 'bg-white text-black font-semibold shadow-lg scale-[1.02] border-white'
              : 'bg-transparent border-white/20 hover:border-white/40 hover:bg-white/10 text-white/85 hover:text-white'
          }`}
        >
          <Maximize2 size={13} />
          <span>Landscape Wide (180°)</span>
        </button>

        <button
          onClick={() => selectPosture('laptop_flex')}
          className={`px-3.5 py-2 rounded-2xl text-xs font-body font-medium flex items-center gap-1.5 transition-all cursor-pointer border shrink-0 ${
            posture === 'laptop_flex'
              ? 'bg-white text-black font-semibold shadow-lg scale-[1.02] border-white'
              : 'bg-transparent border-white/20 hover:border-white/40 hover:bg-white/10 text-white/85 hover:text-white'
          }`}
        >
          <Laptop size={13} />
          <span>Laptop Flex (90°)</span>
        </button>

        <button
          onClick={() => selectPosture('book_reading')}
          className={`px-3.5 py-2 rounded-2xl text-xs font-body font-medium flex items-center gap-1.5 transition-all cursor-pointer border shrink-0 ${
            posture === 'book_reading'
              ? 'bg-white text-black font-semibold shadow-lg scale-[1.02] border-white'
              : 'bg-transparent border-white/20 hover:border-white/40 hover:bg-white/10 text-white/85 hover:text-white'
          }`}
        >
          <BookOpen size={13} />
          <span>Book Curve (125°)</span>
        </button>

        <button
          onClick={() => selectPosture('tent_standing')}
          className={`px-3.5 py-2 rounded-2xl text-xs font-body font-medium flex items-center gap-1.5 transition-all cursor-pointer border shrink-0 ${
            posture === 'tent_standing'
              ? 'bg-white text-black font-semibold shadow-lg scale-[1.02] border-white'
              : 'bg-transparent border-white/20 hover:border-white/40 hover:bg-white/10 text-white/85 hover:text-white'
          }`}
        >
          <Tent size={13} />
          <span>Standing Tent (60°)</span>
        </button>

        <button
          onClick={() => selectPosture('closed_cover')}
          className={`px-3.5 py-2 rounded-2xl text-xs font-body font-medium flex items-center gap-1.5 transition-all cursor-pointer border shrink-0 ${
            posture === 'closed_cover'
              ? 'bg-white text-black font-semibold shadow-lg scale-[1.02] border-white'
              : 'bg-transparent border-white/20 hover:border-white/40 hover:bg-white/10 text-white/85 hover:text-white'
          }`}
        >
          <Smartphone size={13} />
          <span>Cover Closed (5.4&quot;)</span>
        </button>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* MAIN VIEWPORT STAGE */}
      {/* ------------------------------------------------------------------ */}
      {engineMode === '3d_interactive' ? (
        /* ================================================================ */
        /* MODE A: INTERACTIVE 3D OBJECT FREE IN SPACE */
        /* ================================================================ */
        <div
          ref={stageRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className={`relative w-full h-[500px] sm:h-[560px] md:h-[620px] rounded-3xl overflow-hidden flex items-center justify-center bg-transparent border border-white/20 shadow-2xl transition-all ${
            isDragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
          style={{
            perspective: '1500px',
            touchAction: 'none'
          }}
        >
          {/* Spatial Environment Lighting / Ambient Glow */}
          <div
            className="absolute inset-0 pointer-events-none opacity-30"
            style={{
              background: `radial-gradient(circle at ${50 + rotY * 0.25}% ${50 - rotX * 0.25}%, rgba(0, 113, 227, 0.2) 0%, rgba(48, 209, 88, 0.05) 40%, transparent 70%)`
            }}
          />

          {/* 3D Grid Floor Horizon Plane */}
          <div
            className="absolute inset-x-0 bottom-0 h-48 pointer-events-none opacity-15"
            style={{
              background: 'radial-gradient(ellipse at 50% 100%, rgba(255,255,255,0.2) 0%, transparent 70%)',
              transform: 'rotateX(80deg)',
              transformOrigin: 'bottom center'
            }}
          />

          {/* Floating 3D Simulated iPhone Duo Object */}
          <div
            className="relative transition-transform duration-75 ease-out"
            style={{
              transformStyle: 'preserve-3d',
              transform: `scale(${zoom}) rotateX(${rotX}deg) rotateY(${rotY}deg) rotateZ(${rotZ}deg)`,
              filter: 'drop-shadow(0 35px 60px rgba(0, 0, 0, 0.95)) drop-shadow(0 0 30px rgba(0, 113, 227, 0.15))'
            }}
          >
            {/* ============================================================== */}
            {/* 5.4" COMPACT COVER DISPLAY (CLOSED STATE) */}
            {/* ============================================================== */}
            {isClosed && (
              <div
                className="relative rounded-[40px] p-2.5 bg-[#1c1d22] shadow-[0_0_0_2.5px_#3b3c42,0_0_0_5px_#121316,0_25px_50px_rgba(0,0,0,0.85)] border border-white/25 overflow-hidden"
                style={{
                  width: '250px',
                  height: '510px',
                  transformStyle: 'preserve-3d'
                }}
              >
                {/* Titanium Curved Side Highlight */}
                <div className="absolute inset-0 rounded-[40px] pointer-events-none bg-gradient-to-tr from-white/15 via-transparent to-white/10" />

                {/* Ceramic Shield Glass Bezel & Screen */}
                <div className="relative w-full h-full rounded-[34px] bg-black overflow-hidden flex flex-col justify-between border border-white/10">
                  {/* Dynamic Island Sensor Pill */}
                  <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-30 flex items-center justify-center">
                    <div className="bg-black border border-white/20 w-22 h-5 rounded-full flex items-center justify-between px-2.5 shadow-md">
                      <div className="w-2 h-2 rounded-full bg-[#1c1c1e] border border-white/20" />
                      <div className="text-[9px] font-mono font-semibold text-white">9:41</div>
                      <div className="w-1.5 h-1.5 rounded-full bg-[#30d158] animate-pulse" />
                    </div>
                  </div>

                  {/* Cover Screen iOS App View */}
                  <div className="w-full h-full pt-11 pb-4 px-3.5 flex flex-col justify-between text-white font-body bg-gradient-to-b from-[#14151a] via-[#0a0b0e] to-black">
                    {/* Status Pill */}
                    <div className="flex justify-between items-center text-[10px] text-white/70 px-1">
                      <span className="font-semibold text-white">5.4&quot; Cover Screen</span>
                      <span className="font-mono text-[#30d158] text-[9px]">375×812pt</span>
                    </div>

                    {/* Body Cards */}
                    <div className="flex-1 flex flex-col justify-center gap-3 my-auto">
                      <div className="liquid-glass rounded-2xl p-3.5 border border-white/15 shadow-md">
                        <div className="text-xs font-semibold text-white mb-1">Single-Handed Ergonomics</div>
                        <p className="text-[11px] text-white/75 leading-relaxed font-light">
                          Compact portrait layout matching standard iPhone touch targets and quick-action widgets.
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="liquid-glass rounded-xl p-2.5 text-center">
                          <div className="text-[10px] text-white/50">Width</div>
                          <div className="text-xs font-mono font-bold text-white">375 pt</div>
                        </div>
                        <div className="liquid-glass rounded-xl p-2.5 text-center">
                          <div className="text-[10px] text-white/50">Ratio</div>
                          <div className="text-xs font-mono font-bold text-[#0071e3]">19.5 : 9</div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action */}
                    <button
                      onClick={() => selectPosture('portrait_flat')}
                      className="w-full bg-white text-black text-xs font-semibold py-2.5 rounded-xl flex items-center justify-center gap-1.5 hover:bg-white/90 transition-all cursor-pointer border-0 shadow-lg"
                    >
                      <span>Unfold to Dual Canvas</span>
                      <span>→</span>
                    </button>
                  </div>

                  {/* Home Indicator Bar */}
                  <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-24 h-1 bg-white/40 rounded-full z-30" />
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* 7.6" DUAL-SCREEN EXPANDED INNER CANVAS (BENDABLE 3D PHYSICS) */}
            {/* ============================================================== */}
            {!isClosed && (
              <div
                className="relative flex items-center justify-center"
                style={{
                  width: '510px',
                  height: '510px',
                  transformStyle: 'preserve-3d'
                }}
              >
                {/* Left Phone Half / Display Pane */}
                <div
                  className="relative rounded-l-[38px] rounded-r-[6px] p-2.5 bg-[#1b1c21] shadow-[0_0_0_2.5px_#38393e,0_0_0_5px_#121316,0_28px_60px_rgba(0,0,0,0.9)] border-l border-y border-white/25 overflow-hidden"
                  style={{
                    width: '255px',
                    height: '510px',
                    transformOrigin: 'right center',
                    transform: `rotateY(${leftPaneRotation}deg)`,
                    transition: isDragging ? 'none' : 'transform 180ms cubic-bezier(0.16, 1, 0.3, 1)',
                    transformStyle: 'preserve-3d'
                  }}
                >
                  {/* Left Titanium Frame Specular Highlight */}
                  <div className="absolute inset-0 rounded-l-[38px] pointer-events-none bg-gradient-to-r from-white/15 via-transparent to-black/40" />

                  {/* Left OLED Display */}
                  <div className="relative w-full h-full rounded-l-[30px] rounded-r-[4px] bg-[#0c0d10] overflow-hidden flex flex-col justify-between border border-white/10 p-3.5">
                    {/* iOS Status Bar */}
                    <div className="flex justify-between items-center text-[10px] text-white/70 pt-0.5 px-1 z-20">
                      <span className="font-semibold text-white">9:41</span>
                      <span className="font-mono text-[9px] text-[#30d158] font-bold">Left Pane</span>
                    </div>

                    {/* Left Screen App Content Based on Active Scenario */}
                    <div className="flex-1 flex flex-col gap-2.5 pt-2 z-10 overflow-hidden">
                      {activeApp === 'duostore' && (
                        <>
                          <div className="text-xs font-semibold text-white flex items-center justify-between">
                            <span>Catalog Collection</span>
                            <span className="text-[10px] text-[#0a84ff]">Browse All</span>
                          </div>
                          <div className="flex flex-col gap-1.5">
                            {['AirPods Max Pro', 'Titanium Pro Series', 'Folding Folio Case', 'MagSafe Battery'].map((cat, idx) => (
                              <div
                                key={cat}
                                className={`rounded-xl p-2 text-xs flex items-center justify-between transition-all ${
                                  idx === 0
                                    ? 'bg-white/15 text-white font-medium border border-white/15'
                                    : 'bg-white/[0.04] text-white/70 hover:bg-white/10'
                                }`}
                              >
                                <span>{cat}</span>
                                <span className="text-[10px] text-white/40">›</span>
                              </div>
                            ))}
                          </div>
                          <div className="mt-auto liquid-glass rounded-xl p-2 border border-white/10">
                            <div className="text-[10px] text-white/50">Left Viewport Inset</div>
                            <div className="text-[11px] font-mono text-[#30d158]">Safe Area: 384×512pt</div>
                          </div>
                        </>
                      )}

                      {activeApp === 'cinema' && (
                        <div className="flex-1 flex flex-col justify-center items-center text-center p-2 liquid-glass rounded-2xl border border-white/15">
                          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-2 shadow-inner">
                            <Film size={24} className="text-[#0a84ff]" />
                          </div>
                          <div className="text-xs font-semibold text-white">4K Spatial HDR Video</div>
                          <div className="text-[10px] text-white/60 mt-1">Apple TV+ Flex Experience</div>
                        </div>
                      )}

                      {activeApp === 'maps' && (
                        <div className="flex-1 flex flex-col gap-2">
                          <div className="text-xs font-semibold text-white">Apple Park, Cupertino</div>
                          <div className="liquid-glass rounded-xl p-2.5 text-xs text-white/80">
                            <div className="font-semibold text-white">1 Apple Park Way</div>
                            <div className="text-[10px] text-[#30d158] mt-1">22 min • 18.2 miles (Fast Route)</div>
                          </div>
                          <div className="liquid-glass rounded-xl p-2.5 text-xs text-white/80">
                            <div className="font-semibold text-white">Union Square Store</div>
                            <div className="text-[10px] text-white/50">300 Post St, San Francisco</div>
                          </div>
                        </div>
                      )}

                      {activeApp === 'safety' && (
                        <div className="flex-1 flex flex-col gap-2">
                          <div className="liquid-glass rounded-xl p-2.5 border border-[#30d158]/40 bg-[#30d158]/10">
                            <div className="text-xs font-semibold text-[#30d158]">✓ Left Safe Margin</div>
                            <div className="text-[10px] text-white/80 mt-0.5">Anchored 16pt away from fold seam</div>
                          </div>
                          <div className="liquid-glass rounded-xl p-2 text-xs text-white/70">
                            <div className="font-mono text-[10px] text-white/90">AutoLayout Rule:</div>
                            <div className="text-[10px] text-white/50 font-mono mt-0.5">leadingAnchor == view</div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Bottom Left Navigation */}
                    <div className="w-full flex items-center justify-between pt-1 border-t border-white/10 z-20">
                      <span className="text-[9px] font-mono text-white/40">Pane 1 / Left</span>
                      <div className="w-12 h-1 bg-white/40 rounded-full" />
                    </div>
                  </div>
                </div>

                {/* Center Hinge Spine & Crease Shadow */}
                <div
                  className="relative z-30 pointer-events-none flex flex-col items-center justify-between"
                  style={{
                    width: '4px',
                    height: '510px',
                    background: '#111215',
                    boxShadow: `0 0 12px rgba(0,0,0,${creaseShadowFactor * 0.95})`
                  }}
                >
                  <div
                    className="w-full h-full"
                    style={{
                      background: `linear-gradient(to right, rgba(0,0,0,${0.35 + creaseShadowFactor * 0.6}), rgba(255,255,255,0.12), rgba(0,0,0,${0.35 + creaseShadowFactor * 0.6}))`
                    }}
                  />

                  {/* Safe Zone Visualizer Danger Zone Marker */}
                  {activeApp === 'safety' && (
                    <div
                      className="absolute inset-y-0 -left-3.5 -right-3.5 z-40 bg-red-500/20 border-x border-red-500/60 pointer-events-none flex items-center justify-center"
                      style={{ backdropFilter: 'blur(1px)' }}
                    >
                      <span className="text-[8px] font-mono font-bold text-red-300 -rotate-90 whitespace-nowrap uppercase tracking-wider">
                        Fold Danger Zone
                      </span>
                    </div>
                  )}
                </div>

                {/* Right Phone Half / Display Pane */}
                <div
                  className="relative rounded-r-[38px] rounded-l-[6px] p-2.5 bg-[#1b1c21] shadow-[0_0_0_2.5px_#38393e,0_0_0_5px_#121316,0_28px_60px_rgba(0,0,0,0.9)] border-r border-y border-white/25 overflow-hidden"
                  style={{
                    width: '255px',
                    height: '510px',
                    transformOrigin: 'left center',
                    transform: `rotateY(${rightPaneRotation}deg)`,
                    transition: isDragging ? 'none' : 'transform 180ms cubic-bezier(0.16, 1, 0.3, 1)',
                    transformStyle: 'preserve-3d'
                  }}
                >
                  {/* Right Titanium Frame Specular Highlight */}
                  <div className="absolute inset-0 rounded-r-[38px] pointer-events-none bg-gradient-to-l from-white/15 via-transparent to-black/40" />

                  {/* Right OLED Display */}
                  <div className="relative w-full h-full rounded-r-[30px] rounded-l-[4px] bg-[#0c0d10] overflow-hidden flex flex-col justify-between border border-white/10 p-3.5">
                    {/* iOS Status Bar */}
                    <div className="flex justify-between items-center text-[10px] text-white/70 pt-0.5 px-1 z-20">
                      <span className="font-mono text-[9px] text-[#0a84ff] font-bold">Right Canvas</span>
                      <span className="font-semibold text-white">5G 100%</span>
                    </div>

                    {/* Right Screen App Content Based on Active Scenario */}
                    <div className="flex-1 flex flex-col gap-2.5 pt-2 z-10 overflow-hidden">
                      {activeApp === 'duostore' && (
                        <>
                          <div className="liquid-glass rounded-2xl p-3.5 border border-white/15 flex flex-col gap-1.5 shadow-md">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="text-xs font-semibold text-white">AirPods Max Pro</div>
                                <div className="text-[10px] text-white/60">Space Black • Titanium</div>
                              </div>
                              <span className="text-xs font-mono font-bold text-[#30d158]">$549</span>
                            </div>
                            <div className="h-24 bg-white/[0.03] rounded-xl flex items-center justify-center border border-white/5 my-1">
                              <ShoppingBag size={32} className="text-white/40" />
                            </div>
                          </div>

                          <button className="mt-auto w-full bg-[#0071e3] text-white text-xs font-semibold py-2.5 rounded-xl flex items-center justify-center gap-1.5 hover:bg-[#0077ed] transition-all cursor-pointer border-0 shadow-lg">
                            <span>Add to Bag (Safe Positioned)</span>
                          </button>
                        </>
                      )}

                      {activeApp === 'cinema' && (
                        <div className="flex-1 flex flex-col justify-between p-2">
                          <div className="liquid-glass rounded-xl p-2.5">
                            <div className="text-[10px] text-white/50">Touch Controls</div>
                            <div className="text-xs font-semibold text-white mt-1">Spatial Audio EQ &amp; Scrubber</div>
                          </div>
                          <div className="flex items-center justify-center gap-4 py-3">
                            <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-xs">⏮</div>
                            <div className="w-11 h-11 rounded-full bg-white text-black flex items-center justify-center text-sm font-bold shadow-lg">▶</div>
                            <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-xs">⏭</div>
                          </div>
                        </div>
                      )}

                      {activeApp === 'maps' && (
                        <div className="flex-1 flex flex-col justify-between bg-white/[0.04] rounded-2xl p-3 border border-white/10">
                          <div>
                            <div className="text-xs font-semibold text-white">Live 3D Satellite Map</div>
                            <div className="text-[10px] text-white/50">Cupertino Campus Terrain</div>
                          </div>
                          <div className="liquid-glass rounded-xl p-2.5 text-center text-xs text-[#0a84ff] font-semibold shadow-md">
                            Start Turn-by-Turn →
                          </div>
                        </div>
                      )}

                      {activeApp === 'safety' && (
                        <div className="flex-1 flex flex-col gap-2">
                          <div className="liquid-glass rounded-xl p-2.5 border border-[#0a84ff]/40 bg-[#0a84ff]/10">
                            <div className="text-xs font-semibold text-[#0a84ff]">✓ Right Safe Margin</div>
                            <div className="text-[10px] text-white/80 mt-0.5">Anchored to trailingMarginGuide</div>
                          </div>
                          <div className="liquid-glass rounded-xl p-2 text-xs text-white/70">
                            <div className="font-mono text-[10px] text-white/90">Crease Intersections:</div>
                            <div className="text-[10px] text-[#30d158] font-mono mt-0.5">0 buttons across fold</div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Bottom Right Navigation */}
                    <div className="w-full flex items-center justify-between pt-1 border-t border-white/10 z-20">
                      <div className="w-12 h-1 bg-white/40 rounded-full" />
                      <span className="text-[9px] font-mono text-white/40">Pane 2 / Right</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Floating Interactive 3D Orbit Helper Hint */}
          <div className="absolute bottom-3.5 left-3.5 pointer-events-none bg-transparent border border-white/20 rounded-full px-3.5 py-1.5 text-[11px] text-white/85 flex items-center gap-2 shadow-lg">
            <Compass size={13} className="text-[#0a84ff] animate-spin" />
            <span>Drag anywhere in space to rotate 3D device • {rotY.toFixed(0)}° Y / {rotX.toFixed(0)}° X</span>
          </div>

          {/* Live Angle Pill Badge */}
          {!isClosed && (
            <div className="absolute top-3.5 right-3.5 pointer-events-none bg-transparent border border-white/20 rounded-full px-4 py-1 text-xs font-mono font-bold text-[#0a84ff] flex items-center gap-2 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-[#0a84ff] animate-pulse" />
              <span>{foldAngle}° Hinge Angle</span>
            </div>
          )}
        </div>
      ) : (
        /* ================================================================ */
        /* MODE B: APPLE STUDIO PHOTOREALISTIC RENDERS */
        /* ================================================================ */
        <div className="relative w-full min-h-[480px] sm:min-h-[540px] rounded-3xl overflow-hidden bg-transparent border border-white/20 p-6 flex flex-col items-center justify-between shadow-2xl">
          <div className="w-full flex justify-between items-center text-xs text-white/70 pb-2 border-b border-white/10">
            <span className="font-heading italic text-xl text-white">{currentStudioItem.label}</span>
            <span className="font-mono text-[#30d158]">{currentStudioItem.aspect}</span>
          </div>

          <div className="relative w-full max-w-2xl h-[340px] sm:h-[400px] my-auto flex items-center justify-center">
            <Image
              src={currentStudioItem.image}
              alt={currentStudioItem.label}
              fill
              priority
              className="object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.9)] transition-all duration-300"
            />
          </div>

          <div className="w-full bg-transparent rounded-2xl p-3.5 flex items-center justify-between gap-4 border border-white/20 mt-2">
            <div className="text-xs sm:text-sm text-white/85 font-light font-body leading-relaxed">
              {currentStudioItem.description}
            </div>
            <button
              onClick={() => {
                setEngineMode('3d_interactive');
                selectPosture(currentStudioItem.id);
              }}
              className="bg-white text-black font-semibold text-xs px-4 py-2 rounded-xl whitespace-nowrap hover:bg-white/90 transition-all cursor-pointer border-0 shadow-md shrink-0"
            >
              Rotate in 3D Space →
            </button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Bottom Physical Fold Angle Slider (When Unfolded) */}
      {/* ------------------------------------------------------------------ */}
      {!isClosed && engineMode === '3d_interactive' && (
        <div className="bg-transparent rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 border border-white/20 shadow-2xl">
          <div className="flex items-center gap-3.5 w-full sm:w-auto">
            <Sliders size={18} className="text-[#0a84ff] shrink-0" />
            <div className="flex flex-col">
              <span className="text-xs sm:text-sm font-body font-semibold text-white">Physical Dual-Screen Fold Angle</span>
              <span className="text-[11px] text-white/65 font-body">
                {foldAngle === 180 ? 'Flat Unfolded (7.6" Dual Canvas)' : foldAngle >= 90 ? 'Flex Stand Posture (Tabletop)' : 'Book / Closing Posture'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3.5 w-full sm:max-w-md">
            <span className="text-xs font-mono text-white/50 shrink-0">0° Closed</span>
            <input
              type="range"
              min="0"
              max="180"
              step="5"
              value={foldAngle}
              onChange={(e) => setFoldAngle(Number(e.target.value))}
              className="w-full accent-white cursor-pointer h-2 bg-white/20 rounded-lg"
            />
            <span className="text-xs font-mono text-white/90 font-bold shrink-0">{foldAngle}°</span>
          </div>
        </div>
      )}
    </div>
  );
};
