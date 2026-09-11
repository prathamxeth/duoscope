'use client';

import React from 'react';
import { useWizard, WizardStep } from '../../context/WizardContext';
import { FolderGit2, Sliders, FileSearch, PlayCircle, BarChart3, Check, LucideIcon } from 'lucide-react';

interface StepItem {
  step: WizardStep;
  label: string;
  icon: LucideIcon;
}

const STEPS: StepItem[] = [
  { step: 1, label: '1. Choose App', icon: FolderGit2 },
  { step: 2, label: '2. Screen Setup', icon: Sliders },
  { step: 3, label: '3. Layout Scan', icon: FileSearch },
  { step: 4, label: '4. Fold Test', icon: PlayCircle },
  { step: 5, label: '5. Easy Fixes', icon: BarChart3 }
];

export const WizardProgressBar: React.FC = () => {
  const { currentStep, goToStep } = useWizard();

  return (
    <div className="liquid-glass" style={{
      maxWidth: '1020px',
      width: '100%',
      margin: '0 auto',
      padding: '0.5rem 1rem',
      borderRadius: '9999px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'relative',
      background: 'rgba(255, 255, 255, 0.03)',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
      overflowX: 'auto',
      scrollbarWidth: 'none'
    }}>
      {STEPS.map((item, index) => {
        const Icon = item.icon;
        const isCurrent = currentStep === item.step;
        const isCompleted = currentStep > item.step;
        const isClickable = item.step <= currentStep;

        return (
          <React.Fragment key={item.step}>
            {/* Step Capsule Button */}
            <button
              onClick={() => isClickable && goToStep(item.step)}
              disabled={!isClickable}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.55rem',
                background: isCurrent ? '#ffffff' : 'transparent',
                border: 'none',
                cursor: isClickable ? 'pointer' : 'default',
                padding: '0.45rem 1rem',
                borderRadius: '9999px',
                boxShadow: isCurrent ? '0 4px 16px rgba(255, 255, 255, 0.2)' : 'none',
                transition: 'all 200ms var(--spring-snappy)',
                opacity: isClickable ? 1 : 0.45,
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}
            >
              {/* Step Circle Indicator */}
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: isCurrent
                  ? 'rgba(0, 0, 0, 0.15)'
                  : isCompleted
                  ? 'rgba(52, 199, 89, 0.2)'
                  : 'rgba(255, 255, 255, 0.08)',
                color: isCurrent
                  ? '#000000'
                  : isCompleted
                  ? '#30d158'
                  : 'rgba(255, 255, 255, 0.6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.72rem',
                fontWeight: 700
              }}>
                {isCompleted ? <Check size={13} strokeWidth={2.8} /> : <Icon size={13} />}
              </div>

              {/* Step Label */}
              <span style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.84rem',
                fontWeight: isCurrent ? 600 : 400,
                color: isCurrent ? '#000000' : isCompleted ? '#ffffff' : 'rgba(255, 255, 255, 0.6)',
                letterSpacing: '-0.01em'
              }}>
                {item.label}
              </span>
            </button>

            {/* Connecting Track Line */}
            {index < STEPS.length - 1 && (
              <div style={{
                flex: 1,
                height: '2px',
                margin: '0 0.4rem',
                background: currentStep > index + 1
                  ? '#30d158'
                  : 'rgba(255, 255, 255, 0.08)',
                borderRadius: '9999px',
                transition: 'background 300ms ease'
              }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
