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
    <div className="max-w-4xl mx-auto flex flex-col gap-5 w-full select-none">
      {/* Short Context Label */}
      <div className="flex justify-between items-center pb-1">
        <span className="font-heading italic text-2xl md:text-3xl text-white">
          Testing Folding Motion &amp; Animation
        </span>
        <span className="text-xs font-body text-white/70">
          Checking smooth 5.4" to 7.6" screen transition
        </span>
      </div>

      {/* Live Simulation Status Monitor */}
      <div className="liquid-glass rounded-3xl p-5 sm:p-7 border border-white/10 shadow-xl">
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center gap-2.5">
            <PlayCircle size={20} className={`text-[#2997ff] ${!isSimulatingComplete ? 'animate-pulse' : ''}`} />
            <span className="font-heading italic text-xl sm:text-2xl text-white">
              Live Fold Transition Test
            </span>
          </div>
          <span className={`liquid-glass text-xs font-semibold px-3 py-1 rounded-full border ${
            isSimulatingComplete ? 'text-[#30d158] border-[#30d158]/30' : 'text-[#2997ff] border-[#2997ff]/30'
          }`}>
            {isSimulatingComplete ? 'Simulation Ready' : 'Cycling Postures...'}
          </span>
        </div>

        {/* Step-by-Step Simulation Pipeline */}
        <div className="flex flex-col gap-3">
          {simulationSteps.map((sim, index) => {
            const isCompleted = sim.status === 'completed';
            const isWarning = sim.status === 'warning';
            const isRunning = sim.status === 'running';

            return (
              <div
                key={sim.id}
                className={`p-3.5 sm:p-4 rounded-xl flex items-center justify-between gap-3 border transition-all ${
                  isWarning
                    ? 'bg-[#ff9f0a]/10 border-[#ff9f0a]/30'
                    : isCompleted
                    ? 'bg-[#30d158]/10 border-[#30d158]/25'
                    : isRunning
                    ? 'bg-[#0071e3]/15 border-[#0071e3]/35'
                    : 'bg-white/[0.03] border-white/[0.06]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                      isWarning
                        ? 'bg-[#ff9f0a]/20 text-[#ff9f0a]'
                        : isCompleted
                        ? 'bg-[#30d158]/20 text-[#30d158]'
                        : isRunning
                        ? 'bg-[#0071e3]/20 text-[#2997ff]'
                        : 'bg-white/10 text-white/60'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 size={16} /> : isWarning ? <AlertTriangle size={16} /> : index + 1}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs sm:text-sm font-semibold text-white font-body truncate">
                      {sim.label}
                    </div>
                    <div className={`font-mono text-[11px] sm:text-xs truncate ${
                      isWarning ? 'text-[#ff9f0a]' : 'text-white/65'
                    }`}>
                      {sim.details || 'Pending step in queue...'}
                    </div>
                  </div>
                </div>

                <div className="text-[11px] font-semibold uppercase tracking-wider shrink-0">
                  {isRunning && <span className="text-[#2997ff]">In Progress</span>}
                  {isCompleted && <span className="text-[#30d158]">Passed</span>}
                  {isWarning && <span className="text-[#ff9f0a]">Anomaly</span>}
                  {sim.status === 'pending' && <span className="text-white/40">Queued</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Performance & Fold Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="liquid-glass rounded-2xl p-4 sm:p-5 border border-white/10">
          <div className="text-[11px] text-white/60 uppercase font-semibold tracking-wider mb-1 font-body">
            Opening Speed &amp; Delay
          </div>
          <div className="font-mono tabular-nums text-xl sm:text-2xl font-extrabold text-[#ff453a]">
            24.6 ms <span className="text-xs text-white/50 font-normal font-body">(Small delay)</span>
          </div>
        </div>

        <div className="liquid-glass rounded-2xl p-4 sm:p-5 border border-white/10">
          <div className="text-[11px] text-white/60 uppercase font-semibold tracking-wider mb-1 font-body">
            Animation Stutter Frames
          </div>
          <div className="font-mono tabular-nums text-xl sm:text-2xl font-extrabold text-[#ff9f0a]">
            3 Hitch Frames <span className="text-xs text-white/50 font-normal font-body">(Brief lag)</span>
          </div>
        </div>

        <div className="liquid-glass rounded-2xl p-4 sm:p-5 border border-white/10">
          <div className="text-[11px] text-white/60 uppercase font-semibold tracking-wider mb-1 font-body">
            Buttons on Middle Fold Line
          </div>
          <div className="font-mono tabular-nums text-xl sm:text-2xl font-extrabold text-[#ff453a]">
            1 Button Cut <span className="text-xs text-white/50 font-normal font-body">(Checkout Button)</span>
          </div>
        </div>
      </div>

      {/* Navigation Actions */}
      <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-3 pt-2">
        <button
          onClick={prevStep}
          className="w-full sm:w-auto liquid-glass rounded-full px-5 py-2.5 text-xs sm:text-sm font-body text-white/90 hover:text-white flex items-center justify-center gap-2 transition-all cursor-pointer border-0 shadow-md"
        >
          <ArrowLeft size={16} />
          <span>Back to Layout Scan</span>
        </button>

        <button
          onClick={nextStep}
          disabled={!isSimulatingComplete}
          className="w-full sm:w-auto bg-white text-black font-semibold text-xs sm:text-sm px-6 py-2.5 rounded-full flex items-center justify-center gap-2 hover:bg-white/90 hover:scale-[1.02] transition-all cursor-pointer border-0 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>View Final Report &amp; Fixes</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};
