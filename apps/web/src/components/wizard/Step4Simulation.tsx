'use client';

import React, { useEffect, useState } from 'react';
import { useWizard } from '../../context/WizardContext';
import { PlayCircle, CheckCircle2, AlertTriangle, ArrowRight, ArrowLeft } from 'lucide-react';

export const Step4Simulation: React.FC = () => {
  const { simulationSteps, updateSimulationStep, nextStep, prevStep } = useWizard();
  const [isSimulatingComplete, setIsSimulatingComplete] = useState(false);

  useEffect(() => {
    const runSimulationSequence = async () => {
      // Step 1: Boot device
      updateSimulationStep('sim_boot', { status: 'running', details: 'Opening iPhone Duo test screen...' });
      await new Promise(r => setTimeout(r, 700));
      updateSimulationStep('sim_boot', { status: 'completed', details: 'Phone ready (5.4" Outer Display: 375 × 812 pt)' });

      // Step 2: Cover screen capture
      updateSimulationStep('sim_folded_capture', { status: 'running', details: 'Checking buttons and pictures on outer screen...' });
      await new Promise(r => setTimeout(r, 800));
      updateSimulationStep('sim_folded_capture', { status: 'completed', details: '42 buttons & pictures verified safe' });

      // Step 3: Transition trigger
      updateSimulationStep('sim_transition', { status: 'running', details: 'Testing opening gesture to big screen...' });
      await new Promise(r => setTimeout(r, 900));
      updateSimulationStep('sim_transition', { status: 'completed', details: 'Screen expanded to 7.6" dual-screen view' });

      // Step 4: Continuity hitch profile
      updateSimulationStep('sim_continuity_profile', { status: 'running', details: 'Testing animation smoothness while opening...' });
      await new Promise(r => setTimeout(r, 850));
      updateSimulationStep('sim_continuity_profile', {
        status: 'warning',
        details: 'Brief 24ms stutter detected when expanding to big screen.'
      });

      // Step 5: Unfolded tree & Hinge test
      updateSimulationStep('sim_unfolded_capture', { status: 'running', details: 'Checking buttons against the center fold line...' });
      await new Promise(r => setTimeout(r, 800));
      updateSimulationStep('sim_unfolded_capture', {
        status: 'warning',
        details: 'Checkout button falls directly across the center fold line.'
      });
      setIsSimulatingComplete(true);
    };

    runSimulationSequence();
  }, []);

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Short Context Label */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.25rem' }}>
        <span className="font-heading italic text-2xl text-white">
          Testing Folding Motion &amp; Animation
        </span>
        <span className="text-xs font-body text-white/70">
          Checking smooth 5.4" to 7.6" screen transition
        </span>
      </div>

      {/* Live Simulation Status Monitor */}
      <div className="liquid-glass rounded-[1.25rem]" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <PlayCircle size={20} color="#2997ff" className={!isSimulatingComplete ? 'animate-pulse' : ''} />
            <span className="font-heading italic text-2xl text-white">
              Live Fold Transition Test
            </span>
          </div>
          <span className="liquid-badge" style={{
            background: isSimulatingComplete ? 'rgba(52, 199, 89, 0.15)' : 'rgba(0, 113, 227, 0.15)',
            color: isSimulatingComplete ? '#30d158' : '#2997ff',
            borderColor: isSimulatingComplete ? 'rgba(52, 199, 89, 0.35)' : 'rgba(0, 113, 227, 0.35)'
          }}>
            {isSimulatingComplete ? 'Simulation Ready' : 'Cycling Postures...'}
          </span>
        </div>

        {/* Step-by-Step Simulation Pipeline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {simulationSteps.map((sim, index) => {
            const isCompleted = sim.status === 'completed';
            const isWarning = sim.status === 'warning';
            const isRunning = sim.status === 'running';

            return (
              <div
                key={sim.id}
                style={{
                  padding: '12px 16px',
                  borderRadius: '12px',
                  background: isWarning
                    ? 'rgba(255, 149, 0, 0.1)'
                    : isCompleted
                    ? 'rgba(52, 199, 89, 0.08)'
                    : isRunning
                    ? 'rgba(0, 113, 227, 0.1)'
                    : 'rgba(255, 255, 255, 0.03)',
                  border: isWarning
                    ? '1px solid rgba(255, 149, 0, 0.3)'
                    : isCompleted
                    ? '1px solid rgba(52, 199, 89, 0.25)'
                    : isRunning
                    ? '1px solid rgba(0, 113, 227, 0.35)'
                    : '1px solid rgba(255, 255, 255, 0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  transition: 'all 200ms ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <div style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: isWarning
                      ? 'rgba(255, 149, 0, 0.2)'
                      : isCompleted
                      ? 'rgba(52, 199, 89, 0.2)'
                      : isRunning
                      ? 'rgba(0, 113, 227, 0.2)'
                      : 'rgba(255, 255, 255, 0.08)',
                    color: isWarning
                      ? '#ff9f0a'
                      : isCompleted
                      ? '#30d158'
                      : isRunning
                      ? '#2997ff'
                      : 'rgba(255, 255, 255, 0.6)',
                    fontSize: '0.75rem',
                    fontWeight: 700
                  }}>
                    {isCompleted ? <CheckCircle2 size={16} /> : isWarning ? <AlertTriangle size={16} /> : index + 1}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#ffffff', fontFamily: 'var(--font-body)' }}>
                      {sim.label}
                    </div>
                    <div className="font-mono" style={{ fontSize: '0.8rem', color: isWarning ? '#ff9f0a' : 'rgba(255, 255, 255, 0.65)' }}>
                      {sim.details || 'Pending step in queue...'}
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: '0.76rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {isRunning && <span style={{ color: '#2997ff' }}>In Progress</span>}
                  {isCompleted && <span style={{ color: '#30d158' }}>Passed</span>}
                  {isWarning && <span style={{ color: '#ff9f0a' }}>Anomaly</span>}
                  {sim.status === 'pending' && <span style={{ color: 'rgba(255, 255, 255, 0.4)' }}>Queued</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Performance & Fold Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
        <div className="liquid-glass rounded-[1.25rem]" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.76rem', color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.04em', marginBottom: '4px' }}>
            Opening Speed &amp; Delay
          </div>
          <div className="font-mono tabular-nums" style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ff453a' }}>
            24.6 ms <span style={{ fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.5)', fontWeight: 400 }}>(Small delay)</span>
          </div>
        </div>

        <div className="liquid-glass rounded-[1.25rem]" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.76rem', color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.04em', marginBottom: '4px' }}>
            Animation Stutter Frames
          </div>
          <div className="font-mono tabular-nums" style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ff9f0a' }}>
            3 Hitch Frames <span style={{ fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.5)', fontWeight: 400 }}>(Brief lag)</span>
          </div>
        </div>

        <div className="liquid-glass rounded-[1.25rem]" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.76rem', color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.04em', marginBottom: '4px' }}>
            Buttons on Middle Fold Line
          </div>
          <div className="font-mono tabular-nums" style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ff453a' }}>
            1 Button Cut <span style={{ fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.5)', fontWeight: 400 }}>(Checkout Button)</span>
          </div>
        </div>
      </div>

      {/* Navigation Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
        <button
          onClick={prevStep}
          className="liquid-button"
          style={{ padding: '12px 24px', fontSize: '0.95rem' }}
        >
          <ArrowLeft size={17} />
          <span>Back to Layout Scan</span>
        </button>

        <button
          onClick={nextStep}
          disabled={!isSimulatingComplete}
          className="liquid-button liquid-button-primary"
          style={{ padding: '12px 30px', fontSize: '0.95rem', opacity: isSimulatingComplete ? 1 : 0.6 }}
        >
          <span>View Final Report &amp; Fixes</span>
          <ArrowRight size={17} />
        </button>
      </div>
    </div>
  );
};
