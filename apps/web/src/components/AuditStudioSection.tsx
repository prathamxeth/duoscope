'use client';

import React, { useState } from 'react';
import { useWizard } from '../context/WizardContext';
import { WizardProgressBar } from './wizard/WizardProgressBar';
import { Step1Intake } from './wizard/Step1Intake';
import { Step2DeviceConfig } from './wizard/Step2DeviceConfig';
import { Step3StaticAudit } from './wizard/Step3StaticAudit';
import { Step4Simulation } from './wizard/Step4Simulation';
import { Step5Triage } from './wizard/Step5Triage';
import { MetricsOverview } from './MetricsOverview';
import { FoldSimulator } from './FoldSimulator';
import { IssueLedger } from './IssueLedger';
import { DiffInspector } from './DiffInspector';
import { Cpu, FileCode } from 'lucide-react';

export const AuditStudioSection: React.FC = () => {
  const { currentStep, report, performScan, updateIntakeConfig, navigateTo } = useWizard();
  const [viewMode, setViewMode] = useState<'wizard' | 'findings'>('wizard');

  const handleStartDemoScan = async () => {
    updateIntakeConfig({
      type: 'sample_demo',
      appName: 'DuoStore iOS Demo',
      bundleId: 'com.apple.samples.duostore'
    });
    try {
      await performScan();
    } catch (_) {}
  };

  return (
    <section id="audit-studio" className="min-h-screen bg-[#050508] relative py-20 px-4 md:px-8 flex flex-col justify-start select-none">
      <div className="max-w-7xl mx-auto w-full flex flex-col gap-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="text-xs font-body text-[#30d158] mb-1.5 tracking-wider font-semibold uppercase flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#30d158] animate-pulse" />
              // Automated Remediation & Triage Suite
            </div>
            <h2 className="font-heading italic text-4xl md:text-5xl lg:text-6xl text-white leading-tight">
              DuoScope Audit Studio
            </h2>
            <p className="text-sm text-white/70 font-body font-light max-w-2xl mt-1">
              Analyze Xcode source trees, inspect AST rule violations, and auto-patch SwiftUI/UIKit components for dual-screen readiness.
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="liquid-glass rounded-xl p-1 flex gap-1 self-start md:self-auto shrink-0">
            <button
              onClick={() => setViewMode('wizard')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-body font-medium transition-all cursor-pointer border-0 flex items-center gap-1.5 ${
                viewMode === 'wizard'
                  ? 'bg-white text-black font-semibold shadow'
                  : 'bg-[#2c2c2e]/60 hover:bg-[#2c2c2e] text-white/80 hover:text-white border border-white/10'
              }`}
            >
              <Cpu size={13} />
              <span>Interactive Wizard</span>
            </button>
            <button
              onClick={() => setViewMode('findings')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-body font-medium transition-all cursor-pointer border-0 flex items-center gap-1.5 ${
                viewMode === 'findings'
                  ? 'bg-white text-black font-semibold shadow'
                  : 'bg-[#2c2c2e]/60 hover:bg-[#2c2c2e] text-white/80 hover:text-white border border-white/10'
              }`}
            >
              <FileCode size={13} />
              <span>Direct Findings &amp; Diff</span>
            </button>
          </div>
        </div>

        {/* Wizard Workflow Mode */}
        {viewMode === 'wizard' && (
          <div className="flex flex-col gap-6">
            <WizardProgressBar />
            {currentStep === 1 && <Step1Intake />}
            {currentStep === 2 && <Step2DeviceConfig />}
            {currentStep === 3 && <Step3StaticAudit />}
            {currentStep === 4 && <Step4Simulation />}
            {currentStep === 5 && <Step5Triage />}
          </div>
        )}

        {/* Direct Findings Mode */}
        {viewMode === 'findings' && (
          report ? (
            <div className="flex flex-col gap-6">
              {/* Top Metrics Cards */}
              <MetricsOverview
                summary={report.summary}
                continuity={{
                  transitionDurationMs: 300,
                  mainThreadHitchDurationMs: 24.6,
                  droppedFrameCount: 3,
                  targetFrameRate: 120,
                  actualAverageFrameRate: 104,
                  peakMemoryDeltaMb: 4.2,
                  layoutSubviewsPassCount: 6,
                  isPerceptibleHitch: true
                }}
              />

              {/* Findings Ledger & Diff Inspector Split */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-5">
                  <IssueLedger findings={report.findings} />
                </div>

                <div className="lg:col-span-7 flex flex-col gap-6">
                  <DiffInspector />

                  {/* Embedded Fold Simulator */}
                  <FoldSimulator />
                </div>
              </div>
            </div>
          ) : (
            <div className="liquid-glass rounded-3xl p-10 text-center flex flex-col items-center justify-center gap-4 border border-white/10 max-w-2xl mx-auto my-8 shadow-2xl">
              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-white text-2xl">
                📂
              </div>
              <h3 className="font-heading italic text-3xl text-white">
                No Scan Report Generated Yet
              </h3>
              <p className="text-sm font-body font-light text-white/80 max-w-md">
                Upload your Swift source files, paste code in Step 1, or run a live analysis to view detailed AST violations, hinge collision alerts, and side-by-side diffs.
              </p>
              <div className="flex flex-wrap gap-3 items-center justify-center mt-3">
                <button
                  onClick={() => {
                    setViewMode('wizard');
                    navigateTo('studio');
                  }}
                  className="liquid-button liquid-button-primary rounded-xl px-5 py-2.5 text-xs font-semibold cursor-pointer border-0 shadow-lg"
                >
                  <span>Go to Step 1: Upload App Code</span>
                </button>
                <button
                  onClick={handleStartDemoScan}
                  className="liquid-glass rounded-xl px-4 py-2.5 text-xs font-semibold text-[#30d158] hover:text-white cursor-pointer border-0 shadow flex items-center gap-1.5"
                >
                  <span>Load Sample Demo Report</span>
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </section>
  );
};
