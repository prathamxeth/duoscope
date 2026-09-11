'use client';

import React from 'react';
import { HingeSpecification, HingeCollisionResult } from '@foldlens/core-types';

export interface HingeOverlayProps {
  hingeSpec: HingeSpecification;
  collisions?: HingeCollisionResult[];
  scale?: number;
}

export function HingeOverlay({
  hingeSpec,
  collisions = [],
  scale = 1
}: HingeOverlayProps) {
  const leftX = (hingeSpec.centerOffset - hingeSpec.safeMarginPt) * scale;
  const widthPx = (hingeSpec.safeMarginPt * 2) * scale;
  const centerX = hingeSpec.centerOffset * scale;

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      zIndex: 30
    }}>
      {/* Safe Exclusion Buffer Zone with Frosted Hazard Texture */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: `${leftX}px`,
          width: `${widthPx}px`,
          height: '100%',
          background: 'linear-gradient(90deg, rgba(255, 51, 102, 0.05) 0%, rgba(255, 51, 102, 0.22) 50%, rgba(255, 51, 102, 0.05) 100%)',
          borderLeft: '1px dashed rgba(255, 51, 102, 0.6)',
          borderRight: '1px dashed rgba(255, 51, 102, 0.6)',
          boxShadow: 'inset 0 0 16px var(--punch-coral-glow)'
        }}
      />

      {/* Center Hinge Crease Line (Physical Specular Highlight & Shadow) */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: `${centerX - 1}px`,
          width: '2px',
          height: '100%',
          background: 'linear-gradient(180deg, #ff3366 0%, #ec4899 100%)',
          boxShadow: '0 0 16px var(--punch-coral), 0 0 4px rgba(255, 255, 255, 0.7)'
        }}
      />

      {/* Floating Pill for Crease Annotation */}
      <div
        style={{
          position: 'absolute',
          top: '10px',
          left: `${centerX}px`,
          transform: 'translateX(-50%)',
          background: 'rgba(255, 51, 102, 0.28)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          color: '#FFFFFF',
          fontSize: '0.68rem',
          fontWeight: 700,
          padding: '0.22rem 0.75rem',
          borderRadius: '999px',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 51, 102, 0.5)',
          whiteSpace: 'nowrap',
          letterSpacing: '0.03em',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem'
        }}
      >
        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--punch-coral)', boxShadow: '0 0 8px var(--punch-coral)' }} />
        <span>SEAM ±12pt EXCLUSION</span>
      </div>

      {/* Render collision highlight boxes with fluid tactile border */}
      {collisions.map((col) => {
        const boxX = col.elementFrame.x * scale;
        const boxY = col.elementFrame.y * scale;
        const boxW = col.elementFrame.width * scale;
        const boxH = col.elementFrame.height * scale;

        return (
          <div
            key={col.elementId}
            style={{
              position: 'absolute',
              top: `${boxY}px`,
              left: `${boxX}px`,
              width: `${boxW}px`,
              height: `${boxH}px`,
              border: '2px solid var(--punch-coral)',
              background: 'rgba(255, 51, 102, 0.28)',
              borderRadius: '8px',
              pointerEvents: 'auto',
              cursor: 'pointer',
              boxShadow: '0 0 18px var(--punch-coral-glow)'
            }}
            title={`Hinge Collision: ${col.className} (${col.occlusionType})`}
          >
            <span style={{
              position: 'absolute',
              top: '-20px',
              left: '0',
              background: 'var(--punch-coral)',
              color: '#FFFFFF',
              fontSize: '0.65rem',
              fontWeight: 800,
              padding: '0.12rem 0.5rem',
              borderRadius: '999px',
              whiteSpace: 'nowrap',
              letterSpacing: '0.01em',
              boxShadow: '0 2px 8px rgba(0,0,0,0.5)'
            }}>
              {col.overlapPercentage}% Crease Overlap
            </span>
          </div>
        );
      })}
    </div>
  );
}
