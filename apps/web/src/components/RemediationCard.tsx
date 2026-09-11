'use client';

import React, { useState } from 'react';
import { RemediationGuidance } from '@foldlens/core-types';
import { Copy, Check, ExternalLink, Lightbulb } from 'lucide-react';

interface RemediationCardProps {
  remediation: RemediationGuidance;
}

export const RemediationCard: React.FC<RemediationCardProps> = ({ remediation }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(remediation.recommendedSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="liquid-glass" style={{
      borderRadius: '1rem',
      borderTop: '2px solid #0a84ff',
      padding: '1.25rem',
      marginTop: '0.85rem'
    }}>
      {/* Top Bar with Framework Pill & Docs Link */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
          <div style={{
            width: '26px',
            height: '26px',
            borderRadius: '8px',
            background: 'rgba(10, 132, 255, 0.15)',
            border: '1px solid rgba(10, 132, 255, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Lightbulb size={14} color="#0a84ff" />
          </div>
          <h4 className="font-heading italic" style={{ fontSize: '1.15rem', color: '#ffffff' }}>
            Remediation Recipe ({remediation.framework})
          </h4>
        </div>

        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
          {remediation.docUrl && (
            <a
              href={remediation.docUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="liquid-glass rounded-full px-3 py-1 font-body text-xs text-white/90 hover:text-white"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                textDecoration: 'none'
              }}
            >
              <span>Apple Docs</span>
              <ExternalLink size={11} />
            </a>
          )}

          <button
            onClick={handleCopy}
            className="liquid-glass-strong rounded-full px-3 py-1 font-body text-xs flex items-center gap-1.5 transition-all"
            style={{
              color: copied ? '#30d158' : '#ffffff',
              borderColor: copied ? 'rgba(48, 209, 88, 0.4)' : undefined
            }}
          >
            {copied ? <Check size={12} color="#30d158" strokeWidth={2.5} /> : <Copy size={12} />}
            <span>{copied ? 'Copied' : 'Copy Fix'}</span>
          </button>
        </div>
      </div>

      <p className="font-body text-sm font-light text-white/80 leading-relaxed mb-3">
        {remediation.explanation}
      </p>

      {/* Code Snippet Box (Xcode Dark Inspired) */}
      <pre style={{
        background: 'rgba(0, 0, 0, 0.65)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '1rem 1.25rem',
        borderRadius: '10px',
        fontSize: '0.82rem',
        color: '#f5f5f7',
        fontFamily: 'var(--font-mono)',
        lineHeight: 1.6,
        overflowX: 'auto'
      }}>
        <code>{remediation.recommendedSnippet}</code>
      </pre>
    </div>
  );
};
