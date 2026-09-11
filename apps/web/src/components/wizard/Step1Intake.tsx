'use client';

import React, { useState, useRef } from 'react';
import { useWizard, IngestionType } from '../../context/WizardContext';
import {
  extractFromUploadedFiles,
  extractFromSwiftCode,
  extractFromGitUrl,
  extractFromLocalPath
} from '../../utils/metadataExtractor';
import { UploadCloud, Code, Github, Folder, ArrowRight, ShieldCheck, FileCode, X, Sparkles, AlertCircle } from 'lucide-react';

const SAMPLE_SWIFT_DEMO = `// DuoStore iOS Sample View with Foldable Layout Traps
import UIKit

class ProductDetailViewController: UIViewController {
    override func viewDidLoad() {
        super.viewDidLoad()
        
        // Trap 1: Fixed single-screen width causes severe stretch on 7.6" canvas
        let bannerWidth = UIScreen.main.bounds.width
        let banner = UIView(frame: CGRect(x: 0, y: 0, width: bannerWidth, height: 280))
        view.addSubview(banner)
        
        // Trap 2: Centered CTA button falls across the center fold crease (384pt)
        let checkoutButton = UIButton(type: .system)
        checkoutButton.setTitle("Complete Purchase - $499", for: .normal)
        checkoutButton.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(checkoutButton)
        
        // Centering right across middle fold line
        checkoutButton.centerXAnchor.constraint(equalTo: view.centerXAnchor).isActive = true
        checkoutButton.bottomAnchor.constraint(equalTo: view.safeAreaLayoutGuide.bottomAnchor, constant: -30).isActive = true
    }
}`;

export const Step1Intake: React.FC = () => {
  const { intakeConfig, updateIntakeConfig, nextStep } = useWizard();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [validationAttempted, setValidationAttempted] = useState(false);
  const [detectedFrom, setDetectedFrom] = useState<string | null>(null);

  const handleSelectType = (type: IngestionType) => {
    setValidationAttempted(false);
    if (type === 'github_repo') {
      const gitMeta = extractFromGitUrl(intakeConfig.pathOrUrl || '');
      setDetectedFrom(intakeConfig.pathOrUrl ? gitMeta.detectedSource : null);
      updateIntakeConfig({
        type,
        pathOrUrl: intakeConfig.pathOrUrl || '',
        branch: intakeConfig.branch || 'main',
        appName: intakeConfig.pathOrUrl ? gitMeta.appName : (intakeConfig.appName || 'RemoteRepoApp'),
        bundleId: intakeConfig.pathOrUrl ? gitMeta.bundleId : (intakeConfig.bundleId || 'com.developer.remote')
      });
    } else if (type === 'upload_files') {
      const files = intakeConfig.uploadedFiles || [];
      if (files.length > 0) {
        const fileMeta = extractFromUploadedFiles(files);
        setDetectedFrom(fileMeta.detectedSource);
        updateIntakeConfig({
          type,
          appName: fileMeta.appName,
          bundleId: fileMeta.bundleId
        });
      } else {
        updateIntakeConfig({
          type,
          appName: intakeConfig.appName || 'My iOS App',
          bundleId: intakeConfig.bundleId || 'com.developer.app'
        });
      }
    } else if (type === 'paste_code') {
      if (intakeConfig.rawCode && intakeConfig.rawCode.trim().length > 10) {
        const swiftMeta = extractFromSwiftCode(intakeConfig.rawCode);
        setDetectedFrom(swiftMeta.detectedSource);
        updateIntakeConfig({
          type,
          appName: swiftMeta.appName,
          bundleId: swiftMeta.bundleId
        });
      } else {
        updateIntakeConfig({
          type,
          appName: intakeConfig.appName || 'My Custom View',
          bundleId: intakeConfig.bundleId || 'com.developer.app'
        });
      }
    } else {
      const localMeta = extractFromLocalPath(intakeConfig.pathOrUrl || '');
      setDetectedFrom(intakeConfig.pathOrUrl ? localMeta.detectedSource : null);
      updateIntakeConfig({
        type,
        pathOrUrl: intakeConfig.pathOrUrl || '',
        appName: intakeConfig.pathOrUrl ? localMeta.appName : (intakeConfig.appName || 'LocalApp'),
        bundleId: intakeConfig.pathOrUrl ? localMeta.bundleId : (intakeConfig.bundleId || 'com.developer.app')
      });
    }
  };

  const loadSampleCode = () => {
    setDetectedFrom('Sample Swift Demo');
    updateIntakeConfig({
      type: 'paste_code',
      rawCode: SAMPLE_SWIFT_DEMO,
      appName: 'DuoStore Demo View',
      bundleId: 'com.apple.samples.duostore'
    });
  };

  const processFiles = async (fileList: FileList | File[]) => {
    const loadedFiles: Array<{ name: string; content: string; size: number }> = [];

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      if (!file) continue;
      try {
        const text = await file.text();
        loadedFiles.push({
          name: file.name,
          content: text,
          size: file.size
        });
      } catch (err) {
        console.error('Error reading file:', file.name, err);
      }
    }

    if (loadedFiles.length > 0) {
      const existing = intakeConfig.uploadedFiles || [];
      const updated = [...existing, ...loadedFiles];
      
      // Auto-extract package name and bundle ID from uploaded IPA/files/plists
      const extracted = extractFromUploadedFiles(updated);
      setDetectedFrom(extracted.detectedSource);

      updateIntakeConfig({
        type: 'upload_files',
        uploadedFiles: updated,
        appName: extracted.appName,
        bundleId: extracted.bundleId
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const removeFile = (index: number) => {
    const updated = (intakeConfig.uploadedFiles || []).filter((_, i) => i !== index);
    if (updated.length > 0) {
      const extracted = extractFromUploadedFiles(updated);
      setDetectedFrom(extracted.detectedSource);
      updateIntakeConfig({
        uploadedFiles: updated,
        appName: extracted.appName,
        bundleId: extracted.bundleId
      });
    } else {
      setDetectedFrom(null);
      updateIntakeConfig({ uploadedFiles: [] });
    }
  };

  const handleCodeChange = (code: string) => {
    const extracted = extractFromSwiftCode(code);
    if (code.trim().length > 15) {
      setDetectedFrom(extracted.detectedSource);
      updateIntakeConfig({
        rawCode: code,
        appName: extracted.appName,
        bundleId: extracted.bundleId
      });
    } else {
      updateIntakeConfig({ rawCode: code });
    }
  };

  const handleGitUrlChange = (url: string) => {
    const extracted = extractFromGitUrl(url);
    if (url.trim().length > 5) {
      setDetectedFrom(extracted.detectedSource);
      updateIntakeConfig({
        pathOrUrl: url,
        appName: extracted.appName,
        bundleId: extracted.bundleId
      });
    } else {
      updateIntakeConfig({ pathOrUrl: url });
    }
  };

  const handleLocalPathChange = (path: string) => {
    const extracted = extractFromLocalPath(path);
    if (path.trim().length > 1) {
      setDetectedFrom(extracted.detectedSource);
      updateIntakeConfig({
        pathOrUrl: path,
        appName: extracted.appName,
        bundleId: extracted.bundleId
      });
    } else {
      updateIntakeConfig({ pathOrUrl: path });
    }
  };

  // Content validation logic: Cannot proceed unless actual code or files are supplied
  const hasUploadedFiles = Boolean(intakeConfig.uploadedFiles && intakeConfig.uploadedFiles.length > 0);
  const hasPastedCode = Boolean(intakeConfig.rawCode && intakeConfig.rawCode.trim().length > 10);
  const hasGitUrl = Boolean(intakeConfig.pathOrUrl && intakeConfig.pathOrUrl.trim().length > 5);
  const hasLocalPath = Boolean(intakeConfig.pathOrUrl && intakeConfig.pathOrUrl.trim().length > 1);

  const canProceed =
    (intakeConfig.type === 'upload_files' && hasUploadedFiles) ||
    (intakeConfig.type === 'paste_code' && hasPastedCode) ||
    (intakeConfig.type === 'github_repo' && hasGitUrl) ||
    (intakeConfig.type === 'local_path' && hasLocalPath);

  const handleContinue = () => {
    if (canProceed) {
      nextStep();
    } else {
      setValidationAttempted(true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-5 w-full select-none">
      {/* Short Context Label & Demo Quick Button */}
      <div className="flex flex-wrap justify-between items-center gap-2 pb-1">
        <div>
          <span className="font-heading italic text-2xl md:text-3xl text-white">
            Choose App Source
          </span>
          <p className="text-xs font-body text-white/70 mt-0.5">
            Upload your real iOS code or files. DuoScope performs real static analysis without mockups.
          </p>
        </div>

        <button
          onClick={loadSampleCode}
          className="liquid-glass rounded-full px-3.5 py-1.5 text-xs font-body text-[#30d158] hover:text-white flex items-center gap-1.5 transition-all cursor-pointer border-0 shadow-md whitespace-nowrap shrink-0"
        >
          <Sparkles size={13} className="text-[#30d158]" />
          <span>Load Sample Swift Demo</span>
        </button>
      </div>

      {/* Ingestion Type Selection Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Option 1: Upload Files */}
        <button
          onClick={() => handleSelectType('upload_files')}
          className={`text-left p-4 rounded-2xl flex flex-col gap-2.5 transition-all cursor-pointer border-0 ${
            intakeConfig.type === 'upload_files'
              ? 'liquid-glass-strong bg-white/10 shadow-lg scale-[1.02]'
              : 'liquid-glass text-white/80 hover:text-white'
          }`}
        >
          <div className="flex justify-between items-center">
            <div className="w-9 h-9 rounded-xl bg-[#0071e3]/20 flex items-center justify-center">
              <UploadCloud size={18} className="text-[#2997ff]" />
            </div>
            <span className="liquid-glass rounded-full px-2 py-0.5 text-[10px] text-[#2997ff] font-semibold">Upload</span>
          </div>
          <div>
            <h3 className="font-heading italic text-lg text-white mb-0.5">Upload Files</h3>
            <p className="text-xs text-white/70 font-light font-body leading-relaxed">
              Drop .swift, .zip, .ipa, or project files.
            </p>
          </div>
        </button>

        {/* Option 2: Paste Code */}
        <button
          onClick={() => handleSelectType('paste_code')}
          className={`text-left p-4 rounded-2xl flex flex-col gap-2.5 transition-all cursor-pointer border-0 ${
            intakeConfig.type === 'paste_code'
              ? 'liquid-glass-strong bg-white/10 shadow-lg scale-[1.02]'
              : 'liquid-glass text-white/80 hover:text-white'
          }`}
        >
          <div className="flex justify-between items-center">
            <div className="w-9 h-9 rounded-xl bg-[#30d158]/20 flex items-center justify-center">
              <Code size={18} className="text-[#30d158]" />
            </div>
            <span className="liquid-glass rounded-full px-2 py-0.5 text-[10px] text-[#30d158] font-semibold">Direct Code</span>
          </div>
          <div>
            <h3 className="font-heading italic text-lg text-white mb-0.5">Paste Swift Code</h3>
            <p className="text-xs text-white/70 font-light font-body leading-relaxed">
              Paste SwiftUI or UIKit code directly.
            </p>
          </div>
        </button>

        {/* Option 3: GitHub / GitLab Repo */}
        <button
          onClick={() => handleSelectType('github_repo')}
          className={`text-left p-4 rounded-2xl flex flex-col gap-2.5 transition-all cursor-pointer border-0 ${
            intakeConfig.type === 'github_repo'
              ? 'liquid-glass-strong bg-white/10 shadow-lg scale-[1.02]'
              : 'liquid-glass text-white/80 hover:text-white'
          }`}
        >
          <div className="flex justify-between items-center">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
              <Github size={18} className="text-white" />
            </div>
            <span className="liquid-glass rounded-full px-2 py-0.5 text-[10px] text-white/90 font-semibold">Git Ingest</span>
          </div>
          <div>
            <h3 className="font-heading italic text-lg text-white mb-0.5">GitHub Repo</h3>
            <p className="text-xs text-white/70 font-light font-body leading-relaxed">
              Target public or private repository URL.
            </p>
          </div>
        </button>

        {/* Option 4: Local Folder */}
        <button
          onClick={() => handleSelectType('local_path')}
          className={`text-left p-4 rounded-2xl flex flex-col gap-2.5 transition-all cursor-pointer border-0 ${
            intakeConfig.type === 'local_path'
              ? 'liquid-glass-strong bg-white/10 shadow-lg scale-[1.02]'
              : 'liquid-glass text-white/80 hover:text-white'
          }`}
        >
          <div className="flex justify-between items-center">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
              <Folder size={18} className="text-white" />
            </div>
            <span className="liquid-glass rounded-full px-2 py-0.5 text-[10px] text-white/90 font-semibold">Workspace</span>
          </div>
          <div>
            <h3 className="font-heading italic text-lg text-white mb-0.5">Local Xcode Path</h3>
            <p className="text-xs text-white/70 font-light font-body leading-relaxed">
              Scan from active local workspace.
            </p>
          </div>
        </button>
      </div>

      {/* Dynamic Content Area */}
      {intakeConfig.type === 'upload_files' && (
        <div className="liquid-glass rounded-3xl p-5 md:p-6 flex flex-col gap-4 border border-white/15 shadow-xl">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            multiple
            accept=".swift,.m,.h,.plist,.storyboard,.xib,.zip,.ipa,.xcarchive"
            className="hidden"
          />

          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`p-6 sm:p-8 rounded-2xl border-2 border-dashed cursor-pointer flex flex-col items-center justify-center gap-3 transition-all ${
              dragActive ? 'border-[#2997ff] bg-[#0071e3]/10' : 'border-white/20 bg-white/[0.02] hover:bg-white/[0.04]'
            }`}
          >
            <div className="w-12 h-12 rounded-full bg-[#0071e3]/20 flex items-center justify-center shadow-inner">
              <UploadCloud size={24} className="text-[#2997ff]" />
            </div>
            <div className="text-center">
              <div className="text-white font-semibold text-sm md:text-base font-body">
                Click to browse or drop your iOS files here
              </div>
              <div className="text-white/60 text-xs mt-1 font-body">
                Supports .swift, .m, .h, .plist, .storyboard, .zip, .ipa, .xcarchive
              </div>
            </div>
          </div>

          {/* Uploaded Files or Styled Empty State */}
          {intakeConfig.uploadedFiles && intakeConfig.uploadedFiles.length > 0 ? (
            <div className="flex flex-col gap-2 pt-1">
              <div className="flex justify-between items-center text-xs text-white/70">
                <span>{intakeConfig.uploadedFiles.length} file(s) attached and ready for analysis:</span>
                <button
                  onClick={(e) => { e.stopPropagation(); updateIntakeConfig({ uploadedFiles: [] }); }}
                  className="liquid-glass rounded-full px-2.5 py-0.5 text-[#ff453a] hover:text-white text-[11px] cursor-pointer border-0"
                >
                  Clear All
                </button>
              </div>
              <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto pt-1">
                {intakeConfig.uploadedFiles.map((file, idx) => (
                  <div
                    key={`${file.name}-${idx}`}
                    className="liquid-glass rounded-xl px-3 py-1.5 flex items-center gap-2 text-xs text-white shadow-sm"
                  >
                    <FileCode size={14} className="text-[#30d158]" />
                    <span>{file.name}</span>
                    <span className="text-white/50 text-[10px]">
                      ({Math.round(file.size / 1024)} KB)
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); removeFile(idx); }}
                      className="liquid-glass rounded-full w-4 h-4 flex items-center justify-center text-white/60 hover:text-white cursor-pointer border-0 p-0 ml-1"
                    >
                      <X size={10} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="liquid-glass rounded-2xl p-4 text-center text-xs text-white/60 font-body border border-white/10 flex items-center justify-center gap-2">
              <span>No files uploaded yet. Drop Swift or Xcode files above, or click</span>
              <button
                onClick={loadSampleCode}
                className="liquid-glass rounded-full px-2.5 py-0.5 text-[#30d158] font-semibold hover:underline cursor-pointer border-0"
              >
                Sample Demo
              </button>
            </div>
          )}
        </div>
      )}

      {/* Code Paste Box */}
      {intakeConfig.type === 'paste_code' && (
        <div className="liquid-glass rounded-3xl p-5 md:p-6 flex flex-col gap-3 border border-white/15 shadow-xl">
          <div className="flex justify-between items-center">
            <label className="text-xs sm:text-sm text-white font-semibold font-body">
              Paste Swift / SwiftUI View Code
            </label>
            <span className="text-[11px] font-mono text-white/50">Swift 5.9+ / iOS 18</span>
          </div>
          <textarea
            value={intakeConfig.rawCode || ''}
            onChange={(e) => handleCodeChange(e.target.value)}
            placeholder={`// Paste your Swift View code here\nimport SwiftUI\n\nstruct ContentView: View {\n    var body: some View {\n        Text("Hello, Foldable World!")\n    }\n}`}
            className="font-mono w-full min-h-[200px] p-3.5 rounded-xl bg-black/60 border border-white/15 text-[#30d158] text-xs sm:text-sm leading-relaxed outline-none resize-y"
          />
        </div>
      )}

      {/* GitHub Repo / Local Path Box */}
      {(intakeConfig.type === 'github_repo' || intakeConfig.type === 'local_path') && (
        <div className="liquid-glass rounded-3xl p-5 md:p-6 flex flex-col gap-4 border border-white/15 shadow-xl">
          <div>
            <label className="block text-xs text-white/80 mb-1.5 font-medium font-body">
              {intakeConfig.type === 'github_repo' ? 'GitHub / GitLab Repository URL' : 'Local Project Directory Path'}
            </label>
            <input
              type="text"
              value={intakeConfig.pathOrUrl}
              onChange={(e) => intakeConfig.type === 'github_repo' ? handleGitUrlChange(e.target.value) : handleLocalPathChange(e.target.value)}
              placeholder={intakeConfig.type === 'github_repo' ? 'https://github.com/developer/ios-app' : './ios'}
              className="font-mono w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/15 text-[#2997ff] text-sm outline-none"
            />
          </div>

          {intakeConfig.type === 'github_repo' && (
            <div>
              <label className="block text-xs text-white/80 mb-1.5 font-medium font-body">
                Target Branch
              </label>
              <input
                type="text"
                value={intakeConfig.branch || 'main'}
                onChange={(e) => updateIntakeConfig({ branch: e.target.value })}
                className="font-mono w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/15 text-white text-sm outline-none"
              />
            </div>
          )}
        </div>
      )}

      {/* Target Application Configuration Inputs */}
      <div className="liquid-glass rounded-3xl p-5 md:p-6 flex flex-col gap-4 border border-white/15 shadow-xl">
        <div className="flex flex-wrap justify-between items-center gap-2">
          <div>
            <h3 className="font-heading italic text-2xl text-white">App Target Details</h3>
            <p className="text-xs text-white/60 font-body mt-0.5">
              {detectedFrom ? `Auto-detected from ${detectedFrom}. You can edit these anytime.` : 'Package name and bundle identifier'}
            </p>
          </div>
          {detectedFrom ? (
            <div className="liquid-glass rounded-full px-3 py-1 flex items-center gap-1.5 text-xs text-[#30d158] font-medium shadow-md">
              <Sparkles size={13} className="text-[#30d158]" />
              <span>Auto-Detected ({detectedFrom})</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs text-[#30d158] font-semibold">
              <ShieldCheck size={16} />
              <span>Target Ready</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-white/80 mb-1.5 font-medium font-body">
              App Display Name
            </label>
            <input
              type="text"
              value={intakeConfig.appName}
              onChange={(e) => updateIntakeConfig({ appName: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/15 text-white text-sm outline-none font-body font-medium"
            />
          </div>

          <div>
            <label className="block text-xs text-white/80 mb-1.5 font-medium font-body">
              Bundle Identifier
            </label>
            <input
              type="text"
              value={intakeConfig.bundleId}
              onChange={(e) => updateIntakeConfig({ bundleId: e.target.value })}
              className="font-mono w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/15 text-white text-sm outline-none"
            />
          </div>
        </div>
      </div>

      {/* Validation Warning Alert (If user tried to proceed with no content) */}
      {validationAttempted && !canProceed && (
        <div className="liquid-glass rounded-2xl p-4 border border-[#ff453a]/40 bg-[#ff453a]/10 flex items-center gap-3 text-white text-xs">
          <AlertCircle size={18} className="text-[#ff453a] shrink-0" />
          <div className="flex-1">
            <strong className="text-[#ff453a]">Content Required: </strong>
            <span>Please upload an iOS file, paste Swift code, or click </span>
            <button
              onClick={loadSampleCode}
              className="liquid-glass rounded-full px-2.5 py-0.5 text-[#30d158] font-semibold hover:underline cursor-pointer border-0 ml-1"
            >
              Load Sample Demo
            </button>
            <span> before proceeding.</span>
          </div>
        </div>
      )}

      {/* Action Footer */}
      <div className="flex justify-end items-center gap-3 pt-2">
        {!canProceed && (
          <span className="text-xs text-white/50 font-body hidden sm:inline">
            Attach files or code to proceed
          </span>
        )}

        <button
          onClick={handleContinue}
          className={`rounded-full px-6 py-3 font-body font-semibold text-sm flex items-center gap-2 transition-all cursor-pointer border-0 shadow-lg ${
            canProceed
              ? 'bg-white text-black hover:bg-white/90 hover:scale-[1.02]'
              : 'liquid-glass text-white/50 cursor-not-allowed opacity-75'
          }`}
        >
          <span>Continue to Screen Setup</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};


