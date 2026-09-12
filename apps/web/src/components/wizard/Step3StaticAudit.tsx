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
    <div className="max-w-4xl mx-auto flex flex-col gap-5 w-full select-none">
      {/* Short Context Label */}
      <div className="flex justify-between items-center pb-1">
        <span className="font-heading italic text-2xl md:text-3xl text-white">
          Checking Layout &amp; Button Positions
        </span>
        <span className="text-xs font-body text-white/70">
          Real-time scan of app files and screen constraints
        </span>
      </div>

      {/* Real-time Progress Card */}
      <div className="liquid-glass rounded-3xl p-5 sm:p-7 border border-white/10 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2.5">
            <FileSearch size={20} className="text-[#2997ff]" />
            <span className="font-heading italic text-xl sm:text-2xl text-white">
              {isScanningLocal ? 'Scanning App Code...' : 'Scan Complete!'}
            </span>
          </div>
          <span className="font-mono tabular-nums text-lg sm:text-xl font-extrabold text-white">
            {progress}%
          </span>
        </div>

        {/* Progress Bar Track */}
        <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-5">
          <div
            className="h-full bg-white rounded-full transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Scanned Rule Items */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center gap-2.5">
            <FileCode size={16} className="text-[#30d158] shrink-0" />
            <span className="text-xs sm:text-sm text-white font-medium font-body">
              App Files: {scannedFiles} Checked
            </span>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center gap-2.5">
            <Layers size={16} className="text-[#2997ff] shrink-0" />
            <span className="text-xs sm:text-sm text-white font-medium font-body">
              Lines of Code: {linesOfCode}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center gap-2.5">
            <AlertOctagon size={16} className={findings.length > 0 ? 'text-[#ff9f0a] shrink-0' : 'text-[#30d158] shrink-0'} />
            <span className="text-xs sm:text-sm text-white font-medium font-body">
              Items Needing Fix: {findings.length}
            </span>
          </div>
        </div>
      </div>

      {/* Identified Violations Preview */}
      <div className="flex flex-col gap-4">
        <h3 className="font-heading italic text-2xl sm:text-3xl text-white">
          {findings.length > 0 ? 'Items Found Needing Attention' : 'Scan Results'}
        </h3>

        {errorMsg && (
          <div className="liquid-glass rounded-2xl p-4 border-l-4 border-[#ff453a] text-[#ff453a] text-xs sm:text-sm font-body">
            Scan issue: {errorMsg} (defaulting to safe baseline)
          </div>
        )}

        {findings.length === 0 && !isScanningLocal && !errorMsg && (
          <div className="liquid-glass rounded-2xl p-5 border-l-4 border-[#30d158] flex items-center gap-4">
            <div className="p-2 rounded-xl bg-[#30d158]/20 text-[#30d158]">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <div className="font-heading italic text-xl sm:text-2xl text-white">
                All Checks Passed!
              </div>
              <p className="text-xs sm:text-sm text-white/75 mt-1 font-body">
                No hardcoded screen sizes or crease collisions detected in your scanned files.
              </p>
            </div>
          </div>
        )}

        {findings.map((finding) => (
          <div
            key={finding.id}
            className={`liquid-glass rounded-2xl p-4 sm:p-5 flex justify-between items-center gap-4 border-l-4 ${
              finding.severity === 'CRITICAL' ? 'border-[#ff453a]' : 'border-[#ff9f0a]'
            }`}
          >
            <div className="flex gap-3.5 items-start">
              <div
                className={`p-2 rounded-xl shrink-0 ${
                  finding.severity === 'CRITICAL' ? 'bg-[#ff453a]/20 text-[#ff453a]' : 'bg-[#ff9f0a]/20 text-[#ff9f0a]'
                }`}
              >
                {finding.severity === 'CRITICAL' ? <AlertOctagon size={20} /> : <AlertTriangle size={20} />}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="font-heading italic text-xl sm:text-2xl text-white">
                    {finding.title}
                  </span>
                  <span className={finding.severity === 'CRITICAL' ? 'liquid-badge liquid-badge-critical' : 'liquid-badge liquid-badge-warning'}>
                    {finding.severity === 'CRITICAL' ? 'Needs Fix' : 'Caution'}
                  </span>
                </div>
                {finding.location && (
                  <div className="font-mono text-xs text-white/60">
                    {finding.location.filePath}:{finding.location.startLine}
                  </div>
                )}
                <p className="text-xs sm:text-sm text-white/75 mt-1.5 font-body leading-relaxed">
                  {finding.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Footer */}
      <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-3 pt-2">
        <button
          onClick={prevStep}
          className="w-full sm:w-auto liquid-glass rounded-full px-5 py-2.5 text-xs sm:text-sm font-body text-white/90 hover:text-white flex items-center justify-center gap-2 transition-all cursor-pointer border-0 shadow-md"
        >
          <ArrowLeft size={16} />
          <span>Back to Screen Setup</span>
        </button>

        <button
          onClick={nextStep}
          disabled={isScanningLocal}
          className="w-full sm:w-auto bg-white text-black font-semibold text-xs sm:text-sm px-6 py-2.5 rounded-full flex items-center justify-center gap-2 hover:bg-white/90 hover:scale-[1.02] transition-all cursor-pointer border-0 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>Continue to Live Fold Test</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};
