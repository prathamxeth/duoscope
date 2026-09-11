'use client';

import React, { useState } from 'react';
import { useWizard } from '../../context/WizardContext';
import { MetricsOverview } from '../MetricsOverview';
import { FoldSimulator } from '../FoldSimulator';
import { IssueLedger } from '../IssueLedger';
import { DiffInspector } from '../DiffInspector';
import { Download, ArrowLeft, RotateCcw, Check, Sparkles, FileText } from 'lucide-react';

export const Step5Triage: React.FC = () => {
  const { resetWizard, prevStep, report, performScan, updateIntakeConfig, goToStep } = useWizard();
  const [copiedPatch, setCopiedPatch] = useState(false);

  const selectedFinding = report?.findings?.[0];

  const handleExportJson = () => {
    if (!report) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(report, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    const sanitizedAppName = (report.appMetadata?.appName || 'app').toLowerCase().replace(/[^a-z0-9]/g, '-');
    downloadAnchor.setAttribute("download", `duoscope-report-${sanitizedAppName}-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleCopyPatch = () => {
    if (selectedFinding?.remediation?.recommendedSnippet) {
      navigator.clipboard.writeText(selectedFinding.remediation.recommendedSnippet);
      setCopiedPatch(true);
      setTimeout(() => setCopiedPatch(false), 2000);
    }
  };

  const handleRunDemoScan = async () => {
    updateIntakeConfig({
      type: 'sample_demo',
      appName: 'DuoStore Demo View',
      bundleId: 'com.apple.samples.duostore'
    });
    try {
      await performScan();
    } catch (_) {}
  };

  if (!report) {
    return (
      <div className="max-w-3xl mx-auto flex flex-col items-center justify-center text-center p-8 sm:p-12 gap-5 liquid-glass rounded-3xl border border-white/15">
        <div className="w-16 h-16 rounded-full bg-[#0071e3]/20 border border-[#0071e3]/40 flex items-center justify-center shadow-inner">
          <FileText size={28} className="text-[#2997ff]" />
        </div>
        <div className="max-w-md">
          <h3 className="font-heading italic text-2xl sm:text-3xl text-white mb-2">
            No Scan Analysis Available
          </h3>
          <p className="text-xs sm:text-sm text-white/75 font-body font-light leading-relaxed">
            Please complete Step 1 (App Intake) to upload your real iOS code or files. DuoScope will then run real static checks and generate ready-to-use code fixes.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => goToStep(1)}
            className="bg-white text-black font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-full flex items-center gap-2 hover:bg-white/90 hover:scale-[1.02] transition-all cursor-pointer border-0 shadow-lg"
          >
            <span>Back to Step 1 Intake</span>
            <span>→</span>
          </button>

          <button
            onClick={handleRunDemoScan}
            className="liquid-glass rounded-full px-5 py-2.5 text-xs sm:text-sm font-body text-[#30d158] hover:text-white flex items-center gap-2 transition-all cursor-pointer border-0 shadow-md"
          >
            <Sparkles size={14} className="text-[#30d158]" />
            <span>Run Sample App Demo</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Title & Action Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', paddingBottom: '0.25rem' }}>
        <div>
          <span className="font-heading italic text-2xl md:text-3xl text-white">
            App Readiness &amp; Ready-To-Use Fixes
          </span>
          <p className="font-body text-xs md:text-sm text-white/70 font-light mt-1">
            Visual screen comparison, fold line safe spacing, and ready-to-apply fixes for <strong className="text-white">{report.appMetadata?.appName || 'your app'}</strong>.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {selectedFinding && (
            <button
              onClick={handleCopyPatch}
              className="liquid-glass-strong rounded-full px-4 py-2 font-body text-xs md:text-sm text-white flex items-center gap-2 transition-all cursor-pointer border-0 shadow-md whitespace-nowrap shrink-0"
              style={{ borderColor: copiedPatch ? 'rgba(48, 209, 88, 0.5)' : undefined }}
            >
              {copiedPatch ? <Check size={14} color="#30d158" /> : <Download size={14} color="#0a84ff" />}
              <span style={{ color: copiedPatch ? '#30d158' : '#ffffff' }}>
                {copiedPatch ? 'Fix Copied!' : 'Copy Code Fix'}
              </span>
            </button>
          )}

          <button
            onClick={handleExportJson}
            className="liquid-glass rounded-full px-4 py-2 font-body text-xs md:text-sm text-white/90 hover:text-white flex items-center gap-2 transition-all cursor-pointer border-0 shadow-md whitespace-nowrap shrink-0"
          >
            <Download size={14} color="#0a84ff" />
            <span>Download Report</span>
          </button>

          <button
            onClick={resetWizard}
            className="liquid-glass rounded-full px-4 py-2 font-body text-xs md:text-sm text-white/90 hover:text-white flex items-center gap-2 transition-all cursor-pointer border-0 shadow-md whitespace-nowrap shrink-0"
          >
            <RotateCcw size={14} />
            <span>Check Another App</span>
          </button>
        </div>
      </div>

      {/* Metrics Overview Capsule Bar */}
      <MetricsOverview
        summary={report.summary}
      />

      {/* Main Two-Column Triage Workspace */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(420px, 1fr) minmax(460px, 1.2fr)', gap: '1.75rem', alignItems: 'start' }}>
        {/* Left Column: Interactive Issue Ledger */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <IssueLedger
            findings={report.findings}
          />
        </div>

        {/* Right Column: Visual Diff & Simulator Inspection */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          <DiffInspector />
          <FoldSimulator />
        </div>
      </div>

      {/* Navigation Footer */}
      <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '1rem' }}>
        <button
          onClick={prevStep}
          className="liquid-glass rounded-full px-5 py-2.5 text-xs md:text-sm font-body text-white/90 hover:text-white flex items-center gap-2 transition-all cursor-pointer border-0 shadow-md"
        >
          <ArrowLeft size={16} />
          <span>Back to Live Fold Test</span>
        </button>
      </div>
    </div>
  );
};

