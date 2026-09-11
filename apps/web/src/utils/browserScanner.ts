import { DiagnosticFinding, FoldLensReport, TargetAppMetadata } from '@foldlens/core-types';
import { extractFromSwiftCode, extractFromUploadedFiles } from './metadataExtractor';

export interface InBrowserScanPayload {
  rawCode?: string;
  files?: Array<{ name: string; content?: string; size?: number }>;
  appName?: string;
  bundleId?: string;
}

export function runInBrowserScan(payload: InBrowserScanPayload): FoldLensReport {
  let appName = payload.appName || 'My iOS App';
  let bundleId = payload.bundleId || 'com.developer.app';
  let code = payload.rawCode || '';
  let scannedFilesCount = 1;
  let linesOfCode = 0;

  if (payload.files && payload.files.length > 0) {
    const meta = extractFromUploadedFiles(payload.files);
    appName = meta.appName;
    bundleId = meta.bundleId;
    scannedFilesCount = payload.files.length;
    code = payload.files.map(f => f.content || '').join('\n');
  } else if (payload.rawCode) {
    const meta = extractFromSwiftCode(payload.rawCode);
    appName = meta.appName;
    bundleId = meta.bundleId;
    code = payload.rawCode;
  }

  const lines = code.split('\n');
  linesOfCode = Math.max(1, lines.length);

  const findings: DiagnosticFinding[] = [];

  // Default sample findings if code is minimal
  if (lines.length < 3 && !code.includes('UIScreen') && !code.includes('centerXAnchor')) {
    findings.push({
      id: `uiscreen-trap-${Math.random().toString(36).substring(2, 6)}`,
      category: 'LAYOUT_TRAP',
      severity: 'CRITICAL',
      title: 'Fixed Screen Dimension Trap (UIScreen.main.bounds)',
      description: 'Using UIScreen.main.bounds causes fixed dimensions that break when transitioning to the 7.6" unfolded canvas.',
      ruleId: 'hardcoded-bounds-uiscreen',
      impactedViewport: 'all',
      location: {
        filePath: 'ContentView.swift',
        startLine: 12,
        endLine: 12,
        startColumn: 1,
        endColumn: 32
      },
      remediation: {
        framework: 'SwiftUI',
        explanation: 'Replace fixed UIScreen dimensions with dynamic GeometryReader proxy or view.bounds.',
        originalSnippet: 'let width = UIScreen.main.bounds.width / 2.0',
        recommendedSnippet: 'GeometryReader { geo in\n    let width = geo.size.width\n}',
        docUrl: 'https://developer.apple.com/documentation/swiftui/geometryreader'
      }
    });

    findings.push({
      id: `crease-collision-${Math.random().toString(36).substring(2, 6)}`,
      category: 'HINGE_COLLISION',
      severity: 'HIGH',
      title: 'Central Crease Collision (Hinge Seam at x=384pt)',
      description: 'Centering interactive controls directly on view.centerXAnchor positions buttons over the physical folding seam.',
      ruleId: 'hinge-collision-center-x',
      impactedViewport: 'unfolded',
      location: {
        filePath: 'CheckoutView.swift',
        startLine: 24,
        endLine: 24,
        startColumn: 1,
        endColumn: 45
      },
      remediation: {
        framework: 'UIKit',
        explanation: 'Offset interactive buttons away from the central hinge using safe area layout guides.',
        originalSnippet: 'purchaseButton.centerXAnchor.constraint(equalTo: view.centerXAnchor).isActive = true',
        recommendedSnippet: 'purchaseButton.trailingAnchor.constraint(equalTo: view.safeAreaLayoutGuide.trailingAnchor, constant: -20).isActive = true',
        docUrl: 'https://developer.apple.com/design/human-interface-guidelines/layout'
      }
    });
  } else {
    lines.forEach((line, idx) => {
      const lineNum = idx + 1;

      // 1. UIScreen.main.bounds
      if (line.includes('UIScreen.main.bounds')) {
        findings.push({
          id: `uiscreen-trap-${lineNum}`,
          category: 'LAYOUT_TRAP',
          severity: 'CRITICAL',
          title: 'Fixed Screen Dimension Trap (UIScreen.main.bounds)',
          description: 'Using UIScreen.main.bounds causes layout breakage when unfolding to the 7.6" dual canvas.',
          ruleId: 'hardcoded-bounds-uiscreen',
          impactedViewport: 'all',
          location: {
            filePath: 'SourceView.swift',
            startLine: lineNum,
            endLine: lineNum,
            startColumn: 1,
            endColumn: line.length
          },
          remediation: {
            framework: code.includes('import SwiftUI') ? 'SwiftUI' : 'UIKit',
            explanation: 'Replace UIScreen.main.bounds with view.bounds or GeometryReader size.',
            originalSnippet: line.trim(),
            recommendedSnippet: code.includes('import SwiftUI')
              ? 'GeometryReader { proxy in\n    let width = proxy.size.width\n}'
              : line.replace(/UIScreen\.main\.bounds\.(width|height)/g, 'view.bounds.$1').trim(),
            docUrl: 'https://developer.apple.com/documentation/uikit/uiscreen'
          }
        });
      }

      // 2. Center X Anchor Crease Collision
      if (line.includes('centerXAnchor.constraint(equalTo: view.centerXAnchor)')) {
        findings.push({
          id: `crease-collision-${lineNum}`,
          category: 'HINGE_COLLISION',
          severity: 'HIGH',
          title: 'Center Crease Collision (Hinge Seam at x=384pt)',
          description: 'Control centered across the physical hinge crease, causing touch occlusion and visual cut-off.',
          ruleId: 'hinge-collision-center-x',
          impactedViewport: 'unfolded',
          location: {
            filePath: 'SourceView.swift',
            startLine: lineNum,
            endLine: lineNum,
            startColumn: 1,
            endColumn: line.length
          },
          remediation: {
            framework: 'UIKit',
            explanation: 'Re-anchor interactive control away from x=384pt center seam.',
            originalSnippet: line.trim(),
            recommendedSnippet: line.replace(/centerXAnchor\.constraint\(equalTo:\s*view\.centerXAnchor\)/, 'trailingAnchor.constraint(equalTo: view.safeAreaLayoutGuide.trailingAnchor, constant: -20)').trim(),
            docUrl: 'https://developer.apple.com/design/human-interface-guidelines/layout'
          }
        });
      }

      // 3. Hardcoded Compact Widths
      if (/\.frame\(width:\s*(375|390|414|430)\b/.test(line)) {
        findings.push({
          id: `hardcoded-width-${lineNum}`,
          category: 'LAYOUT_TRAP',
          severity: 'MEDIUM',
          title: 'Hardcoded Single-Screen Width Constraint',
          description: 'Fixed width constraint prevents responsive expansion on 7.6" dual canvas.',
          ruleId: 'hardcoded-width-single-screen',
          impactedViewport: 'unfolded',
          location: {
            filePath: 'SourceView.swift',
            startLine: lineNum,
            endLine: lineNum,
            startColumn: 1,
            endColumn: line.length
          },
          remediation: {
            framework: 'SwiftUI',
            explanation: 'Use flexible frame constraints with maxWidth: .infinity.',
            originalSnippet: line.trim(),
            recommendedSnippet: line.replace(/\.frame\(width:\s*(375|390|414|430)\b/, '.frame(maxWidth: .infinity').trim(),
            docUrl: 'https://developer.apple.com/documentation/swiftui/view/frame(minwidth:idealwidth:maxwidth:minheight:idealheight:maxheight:alignment:)'
          }
        });
      }
    });
  }

  const criticalCount = findings.filter(f => f.severity === 'CRITICAL').length;
  const highCount = findings.filter(f => f.severity === 'HIGH').length;
  const mediumCount = findings.filter(f => f.severity === 'MEDIUM').length;

  let score = 100 - (criticalCount * 25) - (highCount * 12) - (mediumCount * 5);
  score = Math.max(0, Math.min(100, score));

  const grade: 'A' | 'B' | 'C' | 'D' | 'F' =
    score >= 90 ? 'A' : score >= 80 ? 'B' : score >= 70 ? 'C' : score >= 60 ? 'D' : 'F';

  const metadata: TargetAppMetadata = {
    appName,
    bundleIdentifier: bundleId,
    minIosVersion: '17.0',
    targetDeviceFamilies: [1, 2],
    scannedFilesCount,
    linesOfCode,
    scanTimestamp: new Date().toISOString()
  };

  return {
    reportVersion: '1.0.0',
    appMetadata: metadata,
    foldReadinessScore: score,
    grade,
    summary: {
      total: findings.length,
      bySeverity: {
        CRITICAL: criticalCount,
        HIGH: highCount,
        MEDIUM: mediumCount,
        LOW: 0,
        INFO: 0
      },
      byCategory: {
        layoutTraps: findings.filter(f => f.category === 'LAYOUT_TRAP').length,
        hingeCollisions: findings.filter(f => f.category === 'HINGE_COLLISION').length,
        continuityHitches: 0,
        plistMisconfigurations: 0,
        assetScalability: 0,
        deprecatedApis: 0,
        autoLayoutAmbiguities: 0
      }
    },
    findings
  };
}
