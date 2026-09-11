'use client';

import React, { useState } from 'react';
import { ArrowRightLeft, Code2, Check, Copy } from 'lucide-react';
import { useWizard } from '../context/WizardContext';

export const DiffInspector: React.FC = () => {
  const { report } = useWizard();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'visual' | 'code'>('visual');

  const finding = report?.findings?.[0];
  const originalCode = finding?.remediation?.originalSnippet || `// Original layout constraint\npurchaseButton.centerXAnchor.constraint(equalTo: view.centerXAnchor).isActive = true`;
  const fixedCode = finding?.remediation?.recommendedSnippet || `// Fixed safe two-pane layout constraint\nlet trailingGuide = view.layoutMarginsGuide.trailingAnchor\npurchaseButton.trailingAnchor.constraint(equalTo: trailingGuide, constant: -16).isActive = true`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(fixedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="liquid-glass rounded-3xl p-6 sm:p-7 flex flex-col gap-5 border border-white/10 shadow-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="font-heading italic text-2xl md:text-3xl text-white">
              Visual &amp; Code Inspector
            </h2>
            <span className="liquid-glass rounded-full px-2.5 py-0.5 text-xs text-white/90 whitespace-nowrap shrink-0">
              {finding ? finding.title : 'Live Preview'}
            </span>
          </div>
          <p className="font-body text-xs md:text-sm text-white/70 font-light mt-1">
            Compare layout: <span className="text-[#0a84ff] font-medium">5.4&quot; Closed Phone</span> → <span className="text-[#ff453a] font-medium">7.6&quot; Opened Canvas</span>
          </p>
        </div>

        {/* Tab switcher */}
        <div className="liquid-glass rounded-full p-1 flex gap-1 self-start sm:self-auto shrink-0">
          <button
            onClick={() => setActiveTab('visual')}
            className={`px-3 py-1 rounded-full text-xs font-body font-medium transition-all border-0 cursor-pointer ${
              activeTab === 'visual' ? 'bg-white text-black font-semibold shadow-sm' : 'liquid-glass text-white/80 hover:text-white'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <ArrowRightLeft size={13} />
              <span>Screen Morph</span>
            </span>
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`px-3 py-1 rounded-full text-xs font-body font-medium transition-all border-0 cursor-pointer ${
              activeTab === 'code' ? 'bg-white text-black font-semibold shadow-sm' : 'liquid-glass text-white/80 hover:text-white'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Code2 size={13} />
              <span>Code Diff</span>
            </span>
          </button>
        </div>
      </div>

      {activeTab === 'visual' ? (
        /* Side-by-Side Dual Viewport Cards */
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {/* Left: Folded State */}
          <div className="liquid-glass rounded-2xl p-4 sm:p-5 border-t-2 border-[#30d158] flex flex-col justify-between">
            <div className="flex justify-between items-center mb-3">
              <span className="font-heading italic text-lg text-[#30d158]">
                State 1: 5.4&quot; Compact
              </span>
              <span className="font-mono tabular-nums text-xs text-white/50">
                375 × 812 pt
              </span>
            </div>

            <div className="h-44 bg-black/50 rounded-xl border border-white/10 p-2.5 flex flex-col gap-2">
              <div className="h-8 bg-[#0a84ff]/15 border border-[#0a84ff]/30 rounded-lg flex items-center px-3 text-xs text-[#0a84ff] font-semibold">
                App Header Bar
              </div>
              <div className="flex-1 bg-white/[0.03] rounded-lg flex items-center justify-center text-xs text-white/60">
                Single-Column Catalog Flow
              </div>
              <div className="h-7 bg-[#30d158] rounded-lg flex items-center justify-center text-xs text-black font-bold">
                Action Button (Safe Zone)
              </div>
            </div>
          </div>

          {/* Right: Unfolded State with Hinge Collision Overlay */}
          <div className="liquid-glass rounded-2xl p-4 sm:p-5 border-t-2 border-[#ff453a] flex flex-col justify-between relative">
            <div className="flex justify-between items-center mb-3">
              <span className="font-heading italic text-lg text-[#ff453a]">
                State 2: 7.6&quot; Unfolded
              </span>
              <span className="font-mono tabular-nums text-xs text-white/50">
                768 × 1024 pt
              </span>
            </div>

            <div className="h-44 bg-black/50 rounded-xl border border-white/10 p-2.5 flex flex-col gap-2 relative overflow-hidden">
              {/* Center Hinge Seam Overlay */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  left: '50%',
                  width: '18px',
                  transform: 'translateX(-50%)',
                  background: 'repeating-linear-gradient(45deg, rgba(255, 69, 58, 0.15), rgba(255, 69, 58, 0.15) 6px, rgba(255, 69, 58, 0.35) 6px, rgba(255, 69, 58, 0.35) 12px)',
                  borderLeft: '1px dashed #ff453a',
                  borderRight: '1px dashed #ff453a',
                  zIndex: 10
                }}
              />

              <div className="h-8 bg-[#0a84ff]/15 border border-[#0a84ff]/30 rounded-lg flex items-center px-3 text-xs text-[#0a84ff] font-semibold">
                Expanded Navigation Bar
              </div>
              <div className="flex-1 bg-white/[0.03] rounded-lg flex items-center justify-center text-xs text-white/60">
                Stretched 2-Column Catalog
              </div>
              <div className="h-7 bg-[#ff453a] rounded-lg flex items-center justify-center text-xs text-white font-bold z-10 px-2 whitespace-nowrap shadow-lg">
                ⚠️ Button Overlaps Middle Fold Line
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Side-by-Side Code Diff Card */
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Original Problematic Snippet */}
            <div className="liquid-glass rounded-2xl p-4 border-t-2 border-[#ff453a] flex flex-col gap-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-heading italic text-base text-[#ff453a]">Before (Center Crease Collision)</span>
                <span className="font-mono text-white/40">Swift / UIKit</span>
              </div>
              <pre className="bg-black/60 rounded-xl p-3 text-xs font-mono text-white/80 overflow-x-auto border border-white/5 leading-relaxed">
                <code>{originalCode}</code>
              </pre>
            </div>

            {/* Recommended Fix Snippet */}
            <div className="liquid-glass rounded-2xl p-4 border-t-2 border-[#30d158] flex flex-col gap-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-heading italic text-base text-[#30d158]">After (Fold-Safe Column Guard)</span>
                <span className="font-mono text-[#30d158]">Ready to Paste</span>
              </div>
              <pre className="bg-black/60 rounded-xl p-3 text-xs font-mono text-white/90 overflow-x-auto border border-white/5 leading-relaxed">
                <code>{fixedCode}</code>
              </pre>
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              onClick={handleCopyCode}
              className="liquid-button liquid-button-primary rounded-xl py-2 px-4 text-xs font-semibold flex items-center gap-1.5 cursor-pointer border-0 shadow-md"
            >
              {copied ? <Check size={14} color="#000000" /> : <Copy size={14} color="#000000" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Recommended Fix'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
