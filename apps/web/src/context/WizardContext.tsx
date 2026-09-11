'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import {
  FoldLensReport,
  HingeSpecification
} from '@foldlens/core-types';
import { runInBrowserScan } from '../utils/browserScanner';

export type WizardStep = 1 | 2 | 3 | 4 | 5;

export type IngestionType = 'upload_files' | 'paste_code' | 'sample_demo' | 'local_path' | 'github_repo' | 'xcarchive';

export interface UploadedFileItem {
  name: string;
  content: string;
  size: number;
}

export interface IntakeConfig {
  type: IngestionType;
  pathOrUrl: string;
  branch?: string;
  scheme?: string;
  appName: string;
  bundleId: string;
  rawCode?: string;
  uploadedFiles?: UploadedFileItem[];
}

export interface DeviceProfileConfig {
  profileName: string;
  outerDisplay: {
    diagonalInches: number;
    points: { width: number; height: number };
    pixels: { width: number; height: number };
    scale: number;
    refreshRateHz: number;
  };
  innerDisplay: {
    diagonalInches: number;
    points: { width: number; height: number };
    pixels: { width: number; height: number };
    scale: number;
    refreshRateHz: number;
  };
  hinge: HingeSpecification;
}

export const DEFAULT_DEVICE_PROFILE: DeviceProfileConfig = {
  profileName: 'iPhone Duo Pro (Dual-Screen)',
  outerDisplay: {
    diagonalInches: 5.4,
    points: { width: 375, height: 812 },
    pixels: { width: 1080, height: 2420 },
    scale: 3,
    refreshRateHz: 120
  },
  innerDisplay: {
    diagonalInches: 7.6,
    points: { width: 768, height: 1024 },
    pixels: { width: 2156, height: 2160 },
    scale: 2,
    refreshRateHz: 120
  },
  hinge: {
    orientation: 'vertical',
    centerOffset: 384,
    physicalWidth: 4,
    safeMarginPt: 14
  }
};

export interface SimulationProgressStep {
  id: string;
  label: string;
  status: 'pending' | 'running' | 'completed' | 'warning' | 'error';
  details?: string;
  timestamp?: number;
}

interface WizardContextType {
  currentStep: WizardStep;
  goToStep: (step: WizardStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  intakeConfig: IntakeConfig;
  updateIntakeConfig: (updates: Partial<IntakeConfig>) => void;
  deviceProfile: DeviceProfileConfig;
  updateDeviceProfile: (updates: Partial<DeviceProfileConfig>) => void;
  isScanning: boolean;
  setIsScanning: (scanning: boolean) => void;
  isSimulating: boolean;
  setIsSimulating: (simulating: boolean) => void;
  simulationSteps: SimulationProgressStep[];
  updateSimulationStep: (id: string, updates: Partial<SimulationProgressStep>) => void;
  report: FoldLensReport | null;
  setReport: (report: FoldLensReport | null) => void;
  heroViewMode: 'wizard' | 'findings';
  setHeroViewMode: (mode: 'wizard' | 'findings') => void;
  capabilitiesTab: 'features' | 'simulator';
  setCapabilitiesTab: (tab: 'features' | 'simulator') => void;
  activeNavTarget: 'studio' | 'fold_safety' | 'design_fixer' | 'simulator';
  setActiveNavTarget: (target: 'studio' | 'fold_safety' | 'design_fixer' | 'simulator') => void;
  navigateTo: (target: 'studio' | 'fold_safety' | 'design_fixer' | 'simulator') => void;
  performScan: () => Promise<FoldLensReport>;
  resetWizard: () => void;
}

const WizardContext = createContext<WizardContextType | undefined>(undefined);

const INITIAL_SIMULATION_STEPS: SimulationProgressStep[] = [
  { id: 'sim_boot', label: 'Start iPhone Duo test phone', status: 'pending' },
  { id: 'sim_folded_capture', label: 'Check 5.4" outer cover screen layout', status: 'pending' },
  { id: 'sim_transition', label: 'Test smooth opening gesture to big screen', status: 'pending' },
  { id: 'sim_continuity_profile', label: 'Check animation smoothness & delays', status: 'pending' },
  { id: 'sim_unfolded_capture', label: 'Verify 7.6" inner canvas & middle fold line safe zone', status: 'pending' }
];

export const WizardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentStep, setCurrentStep] = useState<WizardStep>(1);
  const [heroViewMode, setHeroViewModeState] = useState<'wizard' | 'findings'>('wizard');
  const [capabilitiesTab, setCapabilitiesTabState] = useState<'features' | 'simulator'>('features');
  const [activeNavTarget, setActiveNavTarget] = useState<'studio' | 'fold_safety' | 'design_fixer' | 'simulator'>('studio');

  const setHeroViewMode = (mode: 'wizard' | 'findings') => {
    setHeroViewModeState(mode);
    setActiveNavTarget(mode === 'wizard' ? 'studio' : 'design_fixer');
  };

  const setCapabilitiesTab = (tab: 'features' | 'simulator') => {
    setCapabilitiesTabState(tab);
    setActiveNavTarget(tab === 'features' ? 'fold_safety' : 'simulator');
  };

  const [intakeConfig, setIntakeConfig] = useState<IntakeConfig>({
    type: 'upload_files',
    pathOrUrl: '',
    branch: 'main',
    scheme: '',
    appName: 'My iOS App',
    bundleId: 'com.developer.app',
    rawCode: '',
    uploadedFiles: []
  });

  const [deviceProfile, setDeviceProfile] = useState<DeviceProfileConfig>(DEFAULT_DEVICE_PROFILE);
  const [isScanning, setIsScanning] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationSteps, setSimulationSteps] = useState<SimulationProgressStep[]>(INITIAL_SIMULATION_STEPS);
  const [report, setReport] = useState<FoldLensReport | null>(null);

  const goToStep = (step: WizardStep) => {
    setCurrentStep(step);
  };

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(5, prev + 1) as WizardStep);
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1) as WizardStep);
  };

  const updateIntakeConfig = (updates: Partial<IntakeConfig>) => {
    setIntakeConfig((prev) => ({ ...prev, ...updates }));
  };

  const updateDeviceProfile = (updates: Partial<DeviceProfileConfig>) => {
    setDeviceProfile((prev) => ({ ...prev, ...updates }));
  };

  const updateSimulationStep = (id: string, updates: Partial<SimulationProgressStep>) => {
    setSimulationSteps((prev) =>
      prev.map((step) => (step.id === id ? { ...step, ...updates } : step))
    );
  };

  const navigateTo = (target: 'studio' | 'fold_safety' | 'design_fixer' | 'simulator') => {
    const container = document.getElementById('main-scroll-container');
    const heroEl = document.getElementById('hero');
    const capEl = document.getElementById('capabilities');

    if (target === 'studio') {
      setHeroViewMode('wizard');
    } else if (target === 'design_fixer') {
      setHeroViewMode('findings');
    } else if (target === 'fold_safety') {
      setCapabilitiesTab('features');
    } else if (target === 'simulator') {
      setCapabilitiesTab('simulator');
    }

    const targetEl = (target === 'studio' || target === 'design_fixer') ? heroEl : capEl;
    if (container && targetEl) {
      const containerRect = container.getBoundingClientRect();
      const targetRect = targetEl.getBoundingClientRect();
      const targetTop = container.scrollTop + (targetRect.top - containerRect.top);
      container.scrollTo({ top: targetTop, behavior: 'smooth' });
    } else if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const performScan = async (): Promise<FoldLensReport> => {
    setIsScanning(true);
    try {
      let payload: any = {
        appName: intakeConfig.appName || 'My iOS App',
        bundleId: intakeConfig.bundleId || 'com.developer.app'
      };

      if (intakeConfig.type === 'paste_code' && intakeConfig.rawCode) {
        payload.rawCode = intakeConfig.rawCode;
      } else if (intakeConfig.type === 'upload_files' && intakeConfig.uploadedFiles && intakeConfig.uploadedFiles.length > 0) {
        payload.files = intakeConfig.uploadedFiles.map(f => ({ name: f.name, content: f.content }));
      } else if (intakeConfig.type === 'local_path') {
        payload.targetPath = intakeConfig.pathOrUrl || '.';
      } else if (intakeConfig.type === 'sample_demo') {
        payload.rawCode = `// DuoStore Sample App Code\nimport UIKit\n\nclass CheckoutViewController: UIViewController {\n    override func viewDidLoad() {\n        super.viewDidLoad()\n        let purchaseButton = UIButton(type: .system)\n        // Centered button falls on middle fold line\n        purchaseButton.centerXAnchor.constraint(equalTo: view.centerXAnchor).isActive = true\n        let itemWidth = UIScreen.main.bounds.width / 2.0\n    }\n}`;
      } else {
        payload.rawCode = intakeConfig.rawCode || `import UIKit\nclass AppView: UIView { var width = UIScreen.main.bounds.width }`;
      }

      try {
        const res = await fetch('/api/audit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success && data.report) {
            setReport(data.report);
            setIsScanning(false);
            return data.report;
          }
        }
      } catch (_) {
        // Fallback to in-browser scanner on static hosting (GitHub Pages)
      }

      // Execute in-browser static engine
      const fallbackReport = runInBrowserScan({
        appName: payload.appName,
        bundleId: payload.bundleId,
        rawCode: payload.rawCode,
        files: intakeConfig.uploadedFiles
      });

      setReport(fallbackReport);
      setIsScanning(false);
      return fallbackReport;
    } catch (err) {
      console.error('Audit scan error:', err);
      setIsScanning(false);
      throw err;
    }
  };

  const resetWizard = () => {
    setCurrentStep(1);
    setSimulationSteps(INITIAL_SIMULATION_STEPS);
    setReport(null);
  };

  return (
    <WizardContext.Provider
      value={{
        currentStep,
        goToStep,
        nextStep,
        prevStep,
        intakeConfig,
        updateIntakeConfig,
        deviceProfile,
        updateDeviceProfile,
        isScanning,
        setIsScanning,
        isSimulating,
        setIsSimulating,
        simulationSteps,
        updateSimulationStep,
        report,
        setReport,
        heroViewMode,
        setHeroViewMode,
        capabilitiesTab,
        setCapabilitiesTab,
        activeNavTarget,
        setActiveNavTarget,
        navigateTo,
        performScan,
        resetWizard
      }}
    >
      {children}
    </WizardContext.Provider>
  );
};

export const useWizard = (): WizardContextType => {
  const context = useContext(WizardContext);
  if (!context) {
    throw new Error('useWizard must be used within a WizardProvider');
  }
  return context;
};

