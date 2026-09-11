'use client';

import React, { useEffect, useState } from 'react';
import { useWizard } from '../../context/WizardContext';
import { FileSearch, AlertOctagon, AlertTriangle, ArrowRight, ArrowLeft, Layers, FileCode, CheckCircle2 } from 'lucide-react';

export const Step3StaticAudit: React.FC = () => {
  const { nextStep, prevStep, performScan, report } = useWizard();
  const [progress, setProgress] = useState(0);
  const [isScanningLocal, setIsScanningLocal] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const executeScan = async () => {
      setIsScanningLocal(true);
      setProgress(20);

      const pInterval = setInterval(() => {
        setProgress(prev => (prev < 90 ? prev + 15 : prev));
      }, 150);

      try {
        await performScan();
        if (isMounted) {
          clearInterval(pInterval);
          setProgress(100);
          setIsScanningLocal(false);
        }
      } catch (err: any) {
        if (isMounted) {
          clearInterval(pInterval);
          setProgress(100);
          setIsScanningLocal(false);
          setErrorMsg(err.message || 'Failed to scan files');
        }
      }
    };

    executeScan();

    return () => {
      isMounted = false;
    };
  }, []);

  const findings = report?.findings || [];
  const scannedFiles = report?.appMetadata?.scannedFilesCount || 1;
  const linesOfCode = report?.appMetadata?.linesOfCode || 1;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Short Context Label */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.25rem' }}>
        <span className="font-heading italic text-2xl text-white">
          Checking Layout &amp; Button Positions
        </span>
        <span className="text-xs font-body text-white/70">
          Real-time scan of app files and screen constraints
        </span>
      </div>

      {/* Real-time Progress Card */}
      <div className="liquid-glass rounded-[1.25rem]" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <FileSearch size={20} color="#2997ff" />
            <span className="font-heading italic text-2xl text-white">
              {isScanningLocal ? 'Scanning App Code...' : 'Scan Complete!'}
            </span>
          </div>
          <span className="font-mono tabular-nums" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff' }}>
            {progress}%
          </span>
        </div>

        {/* Progress Bar Track */}
        <div style={{
          height: '8px',
          background: 'rgba(255, 255, 255, 0.08)',
          borderRadius: '9999px',
          overflow: 'hidden',
          marginBottom: '1.25rem'
        }}>
          <div style={{
            height: '100%',
            width: `${progress}%`,
            background: '#ffffff',
            borderRadius: '9999px',
            transition: 'width 180ms ease'
          }} />
        </div>

        {/* Scanned Rule Items */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.85rem' }}>
          <div style={{ padding: '10px 14px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <FileCode size={16} color="#30d158" />
            <span style={{ fontSize: '0.84rem', color: '#ffffff', fontWeight: 500, fontFamily: 'var(--font-body)' }}>
              App Files: {scannedFiles} Checked
            </span>
          </div>
          <div style={{ padding: '10px 14px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Layers size={16} color="#2997ff" />
            <span style={{ fontSize: '0.84rem', color: '#ffffff', fontWeight: 500, fontFamily: 'var(--font-body)' }}>
              Lines of Code: {linesOfCode}
            </span>
          </div>
          <div style={{ padding: '10px 14px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <AlertOctagon size={16} color={findings.length > 0 ? '#ff9f0a' : '#30d158'} />
            <span style={{ fontSize: '0.84rem', color: '#ffffff', fontWeight: 500, fontFamily: 'var(--font-body)' }}>
              Items Needing Fix: {findings.length}
            </span>
          </div>
        </div>
      </div>

      {/* Identified Violations Preview */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h3 className="font-heading italic text-3xl text-white">
          {findings.length > 0 ? 'Items Found Needing Attention' : 'Scan Results'}
        </h3>

        {errorMsg && (
          <div className="liquid-glass rounded-[1.25rem]" style={{ padding: '1rem 1.25rem', borderLeft: '4px solid #ff453a', color: '#ff453a', fontSize: '0.86rem' }}>
            Scan issue: {errorMsg} (defaulting to safe baseline)
          </div>
        )}

        {findings.length === 0 && !isScanningLocal && !errorMsg && (
          <div className="liquid-glass rounded-[1.25rem]" style={{
            padding: '1.5rem',
            borderLeft: '4px solid #30d158',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <div style={{
              padding: '8px',
              borderRadius: '10px',
              background: 'rgba(52, 199, 89, 0.2)',
              color: '#30d158'
            }}>
              <CheckCircle2 size={24} />
            </div>
            <div>
              <div className="font-heading italic text-2xl text-white">
                All Checks Passed!
              </div>
              <p style={{ fontSize: '0.86rem', color: 'rgba(255, 255, 255, 0.75)', marginTop: '0.2rem', fontFamily: 'var(--font-body)' }}>
                No hardcoded screen sizes or crease collisions detected in your scanned files.
              </p>
            </div>
          </div>
        )}

        {findings.map((finding) => (
          <div
            key={finding.id}
            className="liquid-glass rounded-[1.25rem]"
            style={{
              padding: '1.25rem 1.5rem',
              borderLeft: finding.severity === 'CRITICAL' ? '4px solid #ff453a' : '4px solid #ff9f0a',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '1rem'
            }}
          >
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{
                padding: '8px',
                borderRadius: '10px',
                background: finding.severity === 'CRITICAL' ? 'rgba(255, 59, 48, 0.2)' : 'rgba(255, 159, 10, 0.2)',
                color: finding.severity === 'CRITICAL' ? '#ff453a' : '#ff9f0a'
              }}>
                {finding.severity === 'CRITICAL' ? <AlertOctagon size={20} /> : <AlertTriangle size={20} />}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.2rem', flexWrap: 'wrap' }}>
                  <span className="font-heading italic text-2xl text-white">
                    {finding.title}
                  </span>
                  <span className={finding.severity === 'CRITICAL' ? 'liquid-badge liquid-badge-critical' : 'liquid-badge liquid-badge-warning'}>
                    {finding.severity === 'CRITICAL' ? 'Needs Fix' : 'Caution'}
                  </span>
                </div>
                {finding.location && (
                  <div className="font-mono" style={{ fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.6)' }}>
                    {finding.location.filePath}:{finding.location.startLine}
                  </div>
                )}
                <p style={{ fontSize: '0.86rem', color: 'rgba(255, 255, 255, 0.75)', marginTop: '0.35rem', fontFamily: 'var(--font-body)' }}>
                  {finding.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
        <button
          onClick={prevStep}
          className="liquid-button"
          style={{ padding: '12px 24px', fontSize: '0.95rem' }}
        >
          <ArrowLeft size={17} />
          <span>Back to Screen Setup</span>
        </button>

        <button
          onClick={nextStep}
          disabled={isScanningLocal}
          className="liquid-button liquid-button-primary"
          style={{ padding: '12px 30px', fontSize: '0.95rem', opacity: isScanningLocal ? 0.6 : 1 }}
        >
          <span>Continue to Live Fold Test</span>
          <ArrowRight size={17} />
        </button>
      </div>
    </div>
  );
};
