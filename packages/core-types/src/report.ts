import { DiagnosticFinding, FindingSeverity } from './findings.js';
import { ViewHierarchySnapshot } from './view_hierarchy.js';
import { HingeCollisionResult, HingeSpecification } from './hinge.js';
import { ContinuityMetric } from './continuity.js';

/**
 * Summary counts of diagnostic findings.
 */
export interface FindingsSummary {
  total: number;
  bySeverity: Record<FindingSeverity, number>;
  byCategory: {
    layoutTraps: number;
    hingeCollisions: number;
    continuityHitches: number;
    plistMisconfigurations: number;
    assetScalability: number;
    deprecatedApis: number;
    autoLayoutAmbiguities: number;
  };
}

/**
 * Target application metadata.
 */
export interface TargetAppMetadata {
  bundleIdentifier?: string;
  appName?: string;
  version?: string;
  minIosVersion?: string;
  targetDeviceFamilies: number[];
  scannedFilesCount: number;
  linesOfCode: number;
  scanTimestamp: string;
}

/**
 * Full FoldLens Diagnostic Report.
 */
export interface FoldLensReport {
  reportVersion: string;
  appMetadata: TargetAppMetadata;
  foldReadinessScore: number; // 0 - 100
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  summary: FindingsSummary;
  findings: DiagnosticFinding[];
  hingeAnalysis?: {
    specification: HingeSpecification;
    collisions: HingeCollisionResult[];
  };
  continuityMetrics?: ContinuityMetric;
  snapshots?: {
    folded?: ViewHierarchySnapshot;
    unfolded?: ViewHierarchySnapshot;
  };
}
