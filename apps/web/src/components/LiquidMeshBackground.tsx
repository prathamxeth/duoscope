'use client';

import React from 'react';

export const LiquidMeshBackground: React.FC = () => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      pointerEvents: 'none',
      zIndex: 0,
      overflow: 'hidden',
      background: 'linear-gradient(180deg, #ffffff 0%, #fbfbfd 60%, #f5f5f7 100%)'
    }}>
      {/* Subtle Apple Light Gradients */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        left: '20%',
        width: '60vw',
        height: '40vh',
        background: 'radial-gradient(circle, rgba(0, 113, 227, 0.03) 0%, rgba(255, 255, 255, 0) 70%)',
        filter: 'blur(60px)'
      }} />
    </div>
  );
};
