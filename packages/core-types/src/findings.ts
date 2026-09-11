/**
 * Severity level of a diagnostic finding.
 */
export type FindingSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';

/**
 * Diagnostic categorization for foldable issues.
 */
export type FindingCategory =
  | 'LAYOUT_TRAP'
  | 'HINGE_COLLISION'
  | 'CONTINUITY_HITCH'
  | 'PLIST_MISCONFIGURATION'
  | 'ASSET_SCALABILITY'
  | 'DEPRECATED_API'
  | 'AUTO_LAYOUT_AMBIGUITY';

/**
 * The target framework for the source code or remediation.
 */
export type TargetFramework = 'SwiftUI' | 'UIKit' | 'AutoLayout' | 'CoreGraphics' | 'InfoPlist' | 'AssetCatalog';

/**
 * Device viewport state where the issue manifests.
 */
export type ImpactedViewportState = 'folded' | 'unfolded' | 'transition' | 'all';

/**
 * Source code location reference for an identified finding.
 */
export interface SourceLocation {
  filePath: string;
  startLine: number;
  endLine: number;
  startColumn?: number;
  endColumn?: number;
}

/**
 * Code remediation guidance providing drop-in replacements and explanations.
 */
export interface RemediationGuidance {
  framework: TargetFramework;
  explanation: string;
  originalSnippet: string;
  recommendedSnippet: string;
  docUrl?: string;
}

/**
 * Diagnostic Finding interface representing a single issue identified by FoldLens.
 */
export interface DiagnosticFinding {
  id: string;
  category: FindingCategory;
  severity: FindingSeverity;
  title: string;
  description: string;
  ruleId: string;
  impactedViewport: ImpactedViewportState;
  location?: SourceLocation;
  remediation?: RemediationGuidance;
  metadata?: Record<string, unknown>;
}
