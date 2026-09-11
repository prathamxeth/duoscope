import * as fs from 'fs';
import * as path from 'path';
import {
  DiagnosticFinding,
  FindingsSummary,
  FoldLensReport,
  TargetAppMetadata
} from '@foldlens/core-types';
import { HARDCODED_BOUNDS_RULES } from './rules/hardcoded_bounds.js';
import { LAYOUT_TRAP_RULES } from './rules/layout_traps.js';
import { generateRemediation } from './remediations.js';
import { scanInfoPlist } from './plist_scanner.js';
import { scanAssetCatalogs } from './asset_scanner.js';

export interface InMemoryFile {
  name: string;
  content: string;
}

export interface StaticScanOptions {
  targetPath?: string;
  files?: InMemoryFile[];
  rawCode?: string;
  bundleId?: string;
  appName?: string;
  minIosVersion?: string;
}

/**
 * Main Static Analysis Engine for FoldLens.
 */
export class StaticScanner {
  private allRules = [...HARDCODED_BOUNDS_RULES, ...LAYOUT_TRAP_RULES];

  /**
   * Performs complete static analysis on the specified source directory, in-memory files, or code snippet.
   */
  public async scan(options: StaticScanOptions): Promise<FoldLensReport> {
    const { targetPath, files, rawCode, bundleId = 'com.foldlens.auditedapp', appName = 'AuditedApp' } = options;
    const findings: DiagnosticFinding[] = [];
    let scannedFilesCount = 0;
    let totalLinesOfCode = 0;
    let targetDeviceFamilies = [1];

    if (rawCode) {
      scannedFilesCount = 1;
      const fileFindings = this.scanSourceContent(rawCode, 'UploadedApp.swift');
      findings.push(...fileFindings.findings);
      totalLinesOfCode += fileFindings.lineCount;
    } else if (files && files.length > 0) {
      for (const file of files) {
        if (file.name.endsWith('.swift') || file.name.endsWith('.m') || file.name.endsWith('.h') || file.name.endsWith('.storyboard') || file.name.endsWith('.xib')) {
          scannedFilesCount++;
          const fileFindings = this.scanSourceContent(file.content, file.name);
          findings.push(...fileFindings.findings);
          totalLinesOfCode += fileFindings.lineCount;
        } else if (file.name.endsWith('Info.plist')) {
          // Info.plist direct content check
          if (file.content.includes('<key>UIDeviceFamily</key>')) {
            if (file.content.includes('<integer>2</integer>')) {
              targetDeviceFamilies = [1, 2];
            }
          }
        }
      }
    } else if (targetPath) {
      if (!fs.existsSync(targetPath)) {
        throw new Error(`Target path does not exist: ${targetPath}`);
      }

      const stat = fs.statSync(targetPath);
      const filesToScan: string[] = [];

      if (stat.isFile()) {
        filesToScan.push(targetPath);
      } else {
        this.collectFiles(targetPath, filesToScan);
      }

      // 1. Scan Swift and Objective-C files
      for (const file of filesToScan) {
        if (file.endsWith('.swift') || file.endsWith('.m') || file.endsWith('.h')) {
          scannedFilesCount++;
          const fileFindings = this.scanSourceFile(file);
          findings.push(...fileFindings.findings);
          totalLinesOfCode += fileFindings.lineCount;
        }
      }

      // 2. Scan Info.plist if present
      for (const file of filesToScan) {
        if (file.endsWith('Info.plist')) {
          const plistResult = scanInfoPlist(file, true);
          findings.push(...plistResult.findings);
          if (plistResult.deviceFamilies.length > 0) {
            targetDeviceFamilies = plistResult.deviceFamilies;
          }
        }
      }

      // 3. Scan Asset Catalogs (.xcassets)
      if (stat.isDirectory()) {
        const assetResult = scanAssetCatalogs(targetPath);
        findings.push(...assetResult.findings);
      }
    } else {
      throw new Error('No target path, files, or raw code provided for analysis');
    }

    // Summarize findings
    const summary = this.buildSummary(findings);

    // Calculate readiness score & grade
    const score = this.calculateReadinessScore(summary);
    const grade = this.calculateGrade(score);

    const appMetadata: TargetAppMetadata = {
      bundleIdentifier: bundleId,
      appName,
      minIosVersion: options.minIosVersion || '16.0',
      targetDeviceFamilies,
      scannedFilesCount: Math.max(1, scannedFilesCount),
      linesOfCode: Math.max(1, totalLinesOfCode),
      scanTimestamp: new Date().toISOString()
    };

    return {
      reportVersion: '1.0.0',
      appMetadata,
      foldReadinessScore: score,
      grade,
      summary,
      findings
    };
  }

  public scanSourceContent(content: string, fileName: string): { findings: DiagnosticFinding[]; lineCount: number } {
    const findings: DiagnosticFinding[] = [];
    const lines = content.split('\n');
    const lineCount = lines.length;
    const isSwiftUI = content.includes('import SwiftUI') || content.includes(': View');

    for (const rule of this.allRules) {
      rule.pattern.lastIndex = 0;
      let match: RegExpExecArray | null;

      while ((match = rule.pattern.exec(content)) !== null) {
        const matchIndex = match.index;
        const lineNumber = content.substring(0, matchIndex).split('\n').length;
        const matchedText = match[0];
        const lineContent = lines[lineNumber - 1] || '';

        const effectiveFramework = isSwiftUI ? 'SwiftUI' : rule.framework;

        const finding: DiagnosticFinding = {
          id: `${rule.id}-${path.basename(fileName)}-L${lineNumber}-${Math.random().toString(36).substring(2, 6)}`,
          category: rule.category,
          severity: rule.severity,
          title: rule.title,
          description: rule.description,
          ruleId: rule.id,
          impactedViewport: rule.severity === 'CRITICAL' ? 'all' : 'unfolded',
          location: {
            filePath: fileName,
            startLine: lineNumber,
            endLine: lineNumber,
            startColumn: lineContent.indexOf(matchedText) + 1,
            endColumn: lineContent.indexOf(matchedText) + matchedText.length + 1
          },
          remediation: generateRemediation({
            ruleId: rule.id,
            matchedText: lineContent.trim() || matchedText,
            line: lineNumber,
            framework: effectiveFramework,
            context: rule.context
          }),
          metadata: {
            rawMatch: matchedText,
            lineContent: lineContent.trim()
          }
        };

        findings.push(finding);
      }
    }

    return { findings, lineCount };
  }

  private scanSourceFile(filePath: string): { findings: DiagnosticFinding[]; lineCount: number } {
    const findings: DiagnosticFinding[] = [];
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    const lineCount = lines.length;
    const isSwiftUI = content.includes('import SwiftUI') || content.includes(': View');

    for (const rule of this.allRules) {
      rule.pattern.lastIndex = 0;
      let match: RegExpExecArray | null;

      while ((match = rule.pattern.exec(content)) !== null) {
        const matchIndex = match.index;
        const lineNumber = content.substring(0, matchIndex).split('\n').length;
        const matchedText = match[0];
        const lineContent = lines[lineNumber - 1] || '';

        const effectiveFramework = isSwiftUI ? 'SwiftUI' : rule.framework;

        const finding: DiagnosticFinding = {
          id: `${rule.id}-${path.basename(filePath)}-L${lineNumber}-${Math.random().toString(36).substring(2, 6)}`,
          category: rule.category,
          severity: rule.severity,
          title: rule.title,
          description: rule.description,
          ruleId: rule.id,
          impactedViewport: rule.severity === 'CRITICAL' ? 'all' : 'unfolded',
          location: {
            filePath,
            startLine: lineNumber,
            endLine: lineNumber,
            startColumn: lineContent.indexOf(matchedText) + 1,
            endColumn: lineContent.indexOf(matchedText) + matchedText.length + 1
          },
          remediation: generateRemediation({
            ruleId: rule.id,
            matchedText: lineContent.trim() || matchedText,
            line: lineNumber,
            framework: effectiveFramework,
            context: rule.context
          }),
          metadata: {
            rawMatch: matchedText,
            lineContent: lineContent.trim()
          }
        };

        findings.push(finding);
      }
    }

    return { findings, lineCount };
  }

  private collectFiles(dir: string, fileList: string[]) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name.startsWith('.') || entry.name === 'node_modules' || entry.name === 'dist' || entry.name === 'build') {
        continue;
      }
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        this.collectFiles(fullPath, fileList);
      } else {
        fileList.push(fullPath);
      }
    }
  }

  private buildSummary(findings: DiagnosticFinding[]): FindingsSummary {
    const summary: FindingsSummary = {
      total: findings.length,
      bySeverity: {
        CRITICAL: 0,
        HIGH: 0,
        MEDIUM: 0,
        LOW: 0,
        INFO: 0
      },
      byCategory: {
        layoutTraps: 0,
        hingeCollisions: 0,
        continuityHitches: 0,
        plistMisconfigurations: 0,
        assetScalability: 0,
        deprecatedApis: 0,
        autoLayoutAmbiguities: 0
      }
    };

    for (const f of findings) {
      summary.bySeverity[f.severity] = (summary.bySeverity[f.severity] || 0) + 1;

      switch (f.category) {
        case 'LAYOUT_TRAP':
          summary.byCategory.layoutTraps++;
          break;
        case 'HINGE_COLLISION':
          summary.byCategory.hingeCollisions++;
          break;
        case 'CONTINUITY_HITCH':
          summary.byCategory.continuityHitches++;
          break;
        case 'PLIST_MISCONFIGURATION':
          summary.byCategory.plistMisconfigurations++;
          break;
        case 'ASSET_SCALABILITY':
          summary.byCategory.assetScalability++;
          break;
        case 'DEPRECATED_API':
          summary.byCategory.deprecatedApis++;
          break;
        case 'AUTO_LAYOUT_AMBIGUITY':
          summary.byCategory.autoLayoutAmbiguities++;
          break;
      }
    }

    return summary;
  }

  private calculateReadinessScore(summary: FindingsSummary): number {
    let score = 100;
    score -= summary.bySeverity.CRITICAL * 25;
    score -= summary.bySeverity.HIGH * 12;
    score -= summary.bySeverity.MEDIUM * 5;
    score -= summary.bySeverity.LOW * 2;
    return Math.max(0, Math.min(100, score));
  }

  private calculateGrade(score: number): 'A' | 'B' | 'C' | 'D' | 'F' {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  }
}
