'use client';

import React, { useState } from 'react';
import { DiagnosticFinding, FindingSeverity } from '@foldlens/core-types';
import { RemediationCard } from './RemediationCard';
import { ChevronDown, ChevronUp, FileCode } from 'lucide-react';

interface IssueLedgerProps {
  findings: DiagnosticFinding[];
}

export const IssueLedger: React.FC<IssueLedgerProps> = ({ findings }) => {
  const [selectedSeverity, setSelectedSeverity] = useState<FindingSeverity | 'ALL'>('ALL');
  const [expandedId, setExpandedId] = useState<string | null>(findings[0]?.id || null);

  const filteredFindings = selectedSeverity === 'ALL'
    ? findings
    : findings.filter(f => f.severity === selectedSeverity);

  const getSeverityBadge = (sev: FindingSeverity) => {
    switch (sev) {
      case 'CRITICAL': return 'bg-[#ff453a]/20 text-[#ff453a] border border-[#ff453a]/40';
      case 'HIGH': return 'bg-[#ff9f0a]/20 text-[#ff9f0a] border border-[#ff9f0a]/40';
      case 'MEDIUM': return 'bg-[#0a84ff]/20 text-[#0a84ff] border border-[#0a84ff]/40';
      default: return 'bg-[#30d158]/20 text-[#30d158] border border-[#30d158]/40';
    }
  };

  return (
    <div className="liquid-glass" style={{ padding: '1.75rem', borderRadius: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header and Segmented Filters */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <h2 className="font-heading italic text-2xl md:text-3xl text-white">
              App Health &amp; Fixes
            </h2>
            <span className="liquid-glass rounded-full px-2.5 py-0.5 text-xs text-white/90 tabular-nums whitespace-nowrap shrink-0">{filteredFindings.length} Items</span>
          </div>
          <p className="font-body text-xs md:text-sm text-white/70 font-light mt-1">
            Step-by-step guidance to fix layout and fold line issues
          </p>
        </div>

        {/* Filter Segmented Control */}
        <div className="liquid-glass rounded-full p-1 flex gap-1 overflow-x-auto">
          {([
            { id: 'ALL', label: 'All Issues' },
            { id: 'CRITICAL', label: 'Must-Fix' },
            { id: 'HIGH', label: 'Caution' },
            { id: 'MEDIUM', label: 'Tips' }
          ] as const).map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setSelectedSeverity(id)}
              className={`rounded-full px-3 py-1 text-xs font-body transition-all whitespace-nowrap shrink-0 border-0 cursor-pointer ${
                selectedSeverity === id
                  ? 'bg-white text-black font-semibold shadow-sm scale-[1.02]'
                  : 'liquid-glass text-white/80 hover:text-white'
              }`}
            >
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Accordion Findings List or Styled Empty State */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {filteredFindings.length === 0 ? (
          <div className="liquid-glass rounded-2xl p-6 text-center flex flex-col items-center justify-center gap-2 border border-white/10">
            <span className="text-xs text-[#30d158] font-semibold">✓ 0 Issues Detected</span>
            <p className="text-xs text-white/70 font-light max-w-sm">
              No fold line collisions or screen layout traps were identified for this filter.
            </p>
          </div>
        ) : (
          filteredFindings.map((finding) => {
            const isExpanded = expandedId === finding.id;

            return (
              <div
                key={finding.id}
                className={isExpanded ? 'liquid-glass-strong' : 'liquid-glass'}
                style={{
                  borderRadius: '16px',
                  overflow: 'hidden',
                  transition: 'all 200ms ease'
                }}
              >
                {/* Finding Summary Bar */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : finding.id)}
                  style={{
                    padding: '1.1rem 1.4rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    userSelect: 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 ${getSeverityBadge(finding.severity)}`}>
                      {finding.severity === 'CRITICAL' ? 'Must-Fix' : finding.severity === 'HIGH' ? 'Caution' : 'Tip'}
                    </span>
                    <div>
                      <div className="font-body font-medium text-white text-sm md:text-base">
                        {finding.title}
                      </div>
                      {finding.location && (
                        <div className="font-mono" style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.5)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.2rem' }}>
                          <FileCode size={13} />
                          <span>{finding.location.filePath}:{finding.location.startLine}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
                    <span className="liquid-glass rounded-full px-2.5 py-0.5 text-[11px] text-white/80 font-body whitespace-nowrap shrink-0">
                      {finding.category === 'HINGE_COLLISION' ? 'Fold Line Safety' : finding.category === 'LAYOUT_TRAP' ? 'Screen Layout' : 'Animation Smoothness'}
                    </span>
                    <div style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                      {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                  </div>
                </div>

                {/* Expanded Remediation Body */}
                {isExpanded && (
                  <div style={{ padding: '0 1.4rem 1.4rem 1.4rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <p className="font-body text-sm font-light text-white/80 py-3 leading-relaxed">
                      {finding.description}
                    </p>

                    {finding.remediation && (
                      <RemediationCard remediation={finding.remediation} />
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
