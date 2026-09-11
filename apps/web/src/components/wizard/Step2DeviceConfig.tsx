'use client';

import React from 'react';
import Image from 'next/image';
import { useWizard } from '../../context/WizardContext';
import { Smartphone, Tablet, Sliders, ArrowRight, ArrowLeft } from 'lucide-react';

export const Step2DeviceConfig: React.FC = () => {
  const { deviceProfile, updateDeviceProfile, nextStep, prevStep } = useWizard();

  const handleHingeMarginChange = (safeMarginPt: number) => {
    updateDeviceProfile({
      hinge: {
        ...deviceProfile.hinge,
        safeMarginPt
      }
    });
  };

  return (
    <div style={{ maxWidth: '920px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%' }}>
      {/* Short Context Label */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.25rem' }}>
        <span className="font-heading italic text-2xl text-white">
          Screen Sizes &amp; Fold Crease Buffer
        </span>
        <span className="text-xs font-body text-white/70">
          5.4" Outer &amp; 7.6" Inner Canvas
        </span>
      </div>

      {/* Interactive Posture Selection Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.5rem',
        alignItems: 'stretch'
      }}>
        {/* Left: 5.4" Outer Cover Card */}
        <div className="liquid-glass rounded-[1.25rem]" style={{
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          borderTop: '2px solid #2997ff'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Smartphone size={20} color="#2997ff" />
              <span className="font-heading italic text-2xl text-white">
                5.4" Outer Screen
              </span>
            </div>
            <span className="liquid-badge liquid-badge-info">Single-Handed</span>
          </div>

          <div style={{
            position: 'relative',
            height: '160px',
            borderRadius: '14px',
            overflow: 'hidden',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.5)'
          }}>
            <Image
              src="/assets/duo/closed__3le61imm1w2e_large_2x.jpg"
              alt="iPhone Duo Closed"
              fill
              style={{ objectFit: 'cover' }}
            />
          </div>

          <div style={{ fontSize: '0.86rem', color: 'rgba(255, 255, 255, 0.75)', display: 'flex', flexDirection: 'column', gap: '0.45rem', fontFamily: 'var(--font-body)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Screen Resolution:</span>
              <span className="font-mono tabular-nums" style={{ color: '#ffffff', fontWeight: 600 }}>1080 × 2420 px</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Display Smoothness:</span>
              <span className="font-mono" style={{ color: '#30d158', fontWeight: 600 }}>120Hz Ultra-Smooth</span>
            </div>
          </div>
        </div>

        {/* Right: 7.6" Inner Canvas Card */}
        <div className="liquid-glass rounded-[1.25rem]" style={{
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          borderTop: '2px solid #30d158'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Tablet size={20} color="#30d158" />
              <span className="font-heading italic text-2xl text-white">
                7.6" Big Canvas
              </span>
            </div>
            <span className="liquid-badge liquid-badge-success">Expanded</span>
          </div>

          <div style={{
            position: 'relative',
            height: '160px',
            borderRadius: '14px',
            overflow: 'hidden',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.5)'
          }}>
            <Image
              src="/assets/duo/display__bx48n0ntsgvm_large_2x.jpg"
              alt="iPhone Duo Unfolded Canvas"
              fill
              style={{ objectFit: 'cover' }}
            />
          </div>

          <div style={{ fontSize: '0.86rem', color: 'rgba(255, 255, 255, 0.75)', display: 'flex', flexDirection: 'column', gap: '0.45rem', fontFamily: 'var(--font-body)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Screen Resolution:</span>
              <span className="font-mono tabular-nums" style={{ color: '#ffffff', fontWeight: 600 }}>2156 × 2160 px</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Layout Style:</span>
              <span className="font-mono" style={{ color: '#2997ff', fontWeight: 600 }}>Dual-Panel View</span>
            </div>
          </div>
        </div>
      </div>

      {/* Target Form Factor & Hinge Fine-Tuning */}
      <div className="liquid-glass rounded-[1.25rem]" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Sliders size={20} color="#2997ff" />
            <h3 className="font-heading italic text-3xl text-white">Fold Line Safe Spacing</h3>
          </div>
          <span className="liquid-badge liquid-badge-info">Active Protection</span>
        </div>

        {/* Hinge Form Factor Segmented Picker */}
        <div>
          <label style={{ display: 'block', fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.75)', marginBottom: '0.6rem', fontWeight: 500 }}>
            Folding Direction
          </label>
          <div className="liquid-segmented" style={{ width: '100%', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
            <button
              onClick={() => updateDeviceProfile({ hinge: { ...deviceProfile.hinge, orientation: 'vertical' } })}
              className={`liquid-segment-item ${deviceProfile.hinge.orientation === 'vertical' ? 'active' : ''}`}
              style={{ justifyContent: 'center', padding: '10px' }}
            >
              📖 Book Style (Left &amp; Right)
            </button>
            <button
              onClick={() => updateDeviceProfile({ hinge: { ...deviceProfile.hinge, orientation: 'horizontal' } })}
              className={`liquid-segment-item ${deviceProfile.hinge.orientation === 'horizontal' ? 'active' : ''}`}
              style={{ justifyContent: 'center', padding: '10px' }}
            >
              📱 Flip Phone (Top &amp; Bottom)
            </button>
          </div>
        </div>

        {/* Hinge Seam Safe Margin Slider */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.88rem' }}>
            <span style={{ color: '#ffffff', fontWeight: 500, fontFamily: 'var(--font-body)' }}>Safe Distance from Fold Crease:</span>
            <span className="font-mono tabular-nums" style={{ color: '#2997ff', fontWeight: 700 }}>
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
            style={{
              width: '100%',
              accentColor: '#ffffff',
              cursor: 'pointer'
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', color: 'rgba(255, 255, 255, 0.5)', marginTop: '0.35rem' }}>
            <span>0 pt (Flush Edge)</span>
            <span>16 pt (Recommended Safe Buffer)</span>
            <span>32 pt (Extra Wide Guard)</span>
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
        <button
          onClick={prevStep}
          className="liquid-button"
          style={{ padding: '12px 24px', fontSize: '0.95rem' }}
        >
          <ArrowLeft size={17} />
          <span>Back to App Selection</span>
        </button>

        <button
          onClick={nextStep}
          className="liquid-button liquid-button-primary"
          style={{ padding: '12px 30px', fontSize: '0.95rem' }}
        >
          <span>Continue to Automatic Scan</span>
          <ArrowRight size={17} />
        </button>
      </div>
    </div>
  );
};
