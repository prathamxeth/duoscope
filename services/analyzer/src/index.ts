import * as fs from 'fs';
import * as path from 'path';
import { StaticScanner } from './static_scanner.js';
import { FoldLensReport } from '@foldlens/core-types';

export * from './static_scanner.js';
export * from './plist_scanner.js';
export * from './asset_scanner.js';
export * from './hinge_detector.js';
export * from './remediations.js';

/**
 * Main CLI runner for FoldLens Analyzer
 */
export async function runCli(): Promise<void> {
  const args = process.argv.slice(2);
  let targetPath = process.cwd();
  let outputPath = 'foldlens-report.json';
  let appName = 'SampleApp';
  let bundleId = 'com.example.sample';

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--target' || arg === '-t') {
      targetPath = path.resolve(args[++i] || '.');
    } else if (arg === '--output' || arg === '-o') {
      outputPath = path.resolve(args[++i] || 'foldlens-report.json');
    } else if (arg === '--app' || arg === '-a') {
      appName = args[++i] || 'SampleApp';
    } else if (arg === '--bundle' || arg === '-b') {
      bundleId = args[++i] || 'com.example.sample';
    }
  }

  console.log('╔══════════════════════════════════════════════════════════════════╗');
  console.log('║       FoldLens - Dual-Screen iOS Continuity Diagnostic Engine    ║');
  console.log('╚══════════════════════════════════════════════════════════════════╝');
  console.log(`\nScanning target: ${targetPath}`);

  const scanner = new StaticScanner();
  const report: FoldLensReport = await scanner.scan({
    targetPath,
    appName,
    bundleId
  });

  // Write report to JSON
  fs.writeFileSync(outputPath, JSON.stringify(report, null, 2), 'utf-8');

  console.log(`\nScan Complete!`);
  console.log(`──────────────────────────────────────────────────────────────────`);
  console.log(`Fold Readiness Score: ${report.foldReadinessScore}/100 (Grade: ${report.grade})`);
  console.log(`Total Findings:       ${report.summary.total}`);
  console.log(`  - Critical:         ${report.summary.bySeverity.CRITICAL}`);
  console.log(`  - High:             ${report.summary.bySeverity.HIGH}`);
  console.log(`  - Medium:           ${report.summary.bySeverity.MEDIUM}`);
  console.log(`  - Low:              ${report.summary.bySeverity.LOW}`);
  console.log(`──────────────────────────────────────────────────────────────────`);
  console.log(`Diagnostic report saved to: ${outputPath}\n`);
}

// If executed directly as a script
if (process.argv[1] && (process.argv[1].endsWith('index.js') || process.argv[1].endsWith('index.ts') || process.argv[1].endsWith('foldlens.js'))) {
  runCli().catch((err) => {
    console.error('FoldLens Analyzer encountered a fatal error:', err);
    process.exit(1);
  });
}
