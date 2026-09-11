'use client';

import React from 'react';
import { HingeSpecification, HingeCollisionResult } from '@foldlens/core-types';
import { Realistic3DPhoneSimulator } from './Realistic3DPhoneSimulator';

interface FoldSimulatorProps {
  hingeSpec?: HingeSpecification;
  collisions?: HingeCollisionResult[];
}

export const FoldSimulator: React.FC<FoldSimulatorProps> = () => {
  return (
    <div className="liquid-glass rounded-3xl p-4 sm:p-6 flex flex-col gap-4 border border-white/15 shadow-2xl">
      <div>
        <div className="flex items-center gap-2">
          <h2 className="font-heading italic text-2xl md:text-3xl text-white">
            Realistic 3D iPhone Duo Simulator
          </h2>
          <span className="liquid-glass rounded-full px-2.5 py-0.5 text-xs text-[#30d158] font-semibold whitespace-nowrap shrink-0">
            Live 3D
          </span>
        </div>
        <p className="font-body text-xs md:text-sm text-white/70 font-light mt-1">
          Simulated Apple hardware with realistic 5.4&quot; and 7.6&quot; screens. Drag anywhere to rotate in 3D space.
        </p>
      </div>

      <Realistic3DPhoneSimulator initialAngle={180} initialMode="expanded_inner_7_6" />
    </div>
  );
};

