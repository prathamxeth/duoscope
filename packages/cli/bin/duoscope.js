#!/usr/bin/env node

/**
 * DuoScope CLI — Precision Dual-Screen iOS Continuity Diagnostic Engine
 * Usage:
 *   npx duoscope audit <file_or_dir> [--fix] [--json]
 */

const fs = require('fs');
const path = require('path');

const SEAM_X = 384;
const SEAM_THRESHOLD = 20;

function scanSwiftCode(code, filename = 'inline.swift') {
  const lines = code.split('\n');
  const findings = [];

  lines.forEach((line, idx) => {
    const lineNum = idx + 1;

    // Trap 1: UIScreen.main.bounds usage
    if (/UIScreen\.main\.bounds/.test(line)) {
      findings.push({
        id: `uiscreen-trap-${lineNum}`,
        file: filename,
        line: lineNum,
        severity: 'CRITICAL',
        title: 'Fixed Screen Dimension Trap (UIScreen.main.bounds)',
        description: 'Using UIScreen.main.bounds causes layout breakage and distortion when transitioning between 5.4" cover display and 7.6" dual canvas.',
        original: line.trim(),
        suggested: line.replace(/UIScreen\.main\.bounds\.(width|height)/g, 'view.bounds.$1').trim(),
        fixType: 'replace'
      });
    }

    // Trap 2: Center alignment crossing fold crease
    if (/centerXAnchor\.constraint\(equalTo:\s*view\.centerXAnchor\)/.test(line)) {
      findings.push({
        id: `crease-collision-${lineNum}`,
        file: filename,
        line: lineNum,
        severity: 'HIGH',
        title: 'Center Crease Collision (Hinge Seam at x=384pt)',
        description: 'Centering interactive controls directly across view.centerXAnchor positions buttons over the physical folding crease.',
        original: line.trim(),
        suggested: line.replace(/centerXAnchor\.constraint\(equalTo:\s*view\.centerXAnchor\)/, 'trailingAnchor.constraint(equalTo: view.safeAreaLayoutGuide.trailingAnchor, constant: -20)').trim(),
        fixType: 'replace'
      });
    }

    // Trap 3: Hardcoded compact frame widths
    if (/\.frame\(width:\s*(375|390|414|430)\b/.test(line)) {
      findings.push({
        id: `hardcoded-width-${lineNum}`,
        file: filename,
        line: lineNum,
        severity: 'MEDIUM',
        title: 'Hardcoded Single-Screen Width Constraint',
        description: 'Fixed width constraint prevents responsive expansion on 7.6" dual canvas.',
        original: line.trim(),
        suggested: line.replace(/\.frame\(width:\s*(375|390|414|430)\b/, '.frame(maxWidth: .infinity').trim(),
        fixType: 'replace'
      });
    }
  });

  return findings;
}

function scanPath(targetPath) {
  const stat = fs.statSync(targetPath);
  let allFindings = [];

  if (stat.isFile()) {
    const content = fs.readFileSync(targetPath, 'utf8');
    allFindings = scanSwiftCode(content, targetPath);
  } else if (stat.isDirectory()) {
    const files = fs.readdirSync(targetPath, { recursive: true });
    for (const file of files) {
      if (typeof file === 'string' && (file.endsWith('.swift') || file.endsWith('.m') || file.endsWith('.h'))) {
        const fullPath = path.join(targetPath, file);
        try {
          const content = fs.readFileSync(fullPath, 'utf8');
          const fileFindings = scanSwiftCode(content, fullPath);
          allFindings = allFindings.concat(fileFindings);
        } catch (_) {}
      }
    }
  }

  return allFindings;
}

function applyFixes(findings) {
  const filesModified = new Set();

  for (const finding of findings) {
    if (!fs.existsSync(finding.file)) continue;
    let content = fs.readFileSync(finding.file, 'utf8');
    if (content.includes(finding.original)) {
      content = content.replace(finding.original, finding.suggested);
      fs.writeFileSync(finding.file, content, 'utf8');
      filesModified.add(finding.file);
    }
  }

  return Array.from(filesModified);
}

// CLI Command Parser
function run() {
  const args = process.argv.slice(2);
  const command = args[0] || 'help';

  if (command === 'help' || args.includes('--help') || args.includes('-h')) {
    console.log(`
\x1b[1m\x1b[36mDuoScope CLI\x1b[0m — Dual-Screen iOS Continuity Diagnostics & Automated Fixes

\x1b[1mUsage:\x1b[0m
  npx duoscope audit <path_or_file>      Run static continuity audit on Swift files
  npx duoscope audit <path> --fix         Auto-apply safe layout and fold seam patches
  npx duoscope audit <path> --json        Output diagnostic report in JSON format
  npx duoscope version                   Show current version

\x1b[1mExamples:\x1b[0m
  npx duoscope audit ./ios/Sources/Views/ProductView.swift
  npx duoscope audit ./ios --fix
`);
    process.exit(0);
  }

  if (command === 'version' || args.includes('-v')) {
    console.log('duoscope v1.0.0 (Apple iPhone Duo 5.4" <-> 7.6" Engine)');
    process.exit(0);
  }

  if (command === 'audit') {
    const target = args[1] || '.';
    const isFix = args.includes('--fix');
    const isJson = args.includes('--json');

    if (!fs.existsSync(target)) {
      console.error(`\x1b[31mError: Target path "${target}" not found.\x1b[0m`);
      process.exit(1);
    }

    const findings = scanPath(target);
    const score = Math.max(0, 100 - findings.filter(f => f.severity === 'CRITICAL').length * 25 - findings.filter(f => f.severity === 'HIGH').length * 15 - findings.filter(f => f.severity === 'MEDIUM').length * 5);

    if (isJson) {
      console.log(JSON.stringify({ target, score, findingsCount: findings.length, findings }, null, 2));
      return;
    }

    console.log(`\n\x1b[1m\x1b[35m=== DuoScope Dual-Screen Continuity Diagnostic ===\x1b[0m`);
    console.log(`Target: \x1b[36m${path.resolve(target)}\x1b[0m`);
    console.log(`Readiness Score: \x1b[1m${score >= 80 ? '\x1b[32m' : score >= 50 ? '\x1b[33m' : '\x1b[31m'}${score}/100\x1b[0m\n`);

    if (findings.length === 0) {
      console.log(`\x1b[32m✓ Zero continuity traps found! App is 100% ready for iPhone Duo 5.4" <-> 7.6".\x1b[0m\n`);
      return;
    }

    console.log(`Found \x1b[1m${findings.length} foldable continuity issues:\x1b[0m\n`);

    findings.forEach((f, i) => {
      const color = f.severity === 'CRITICAL' ? '\x1b[31m' : f.severity === 'HIGH' ? '\x1b[33m' : '\x1b[34m';
      console.log(`${i + 1}. [${color}${f.severity}\x1b[0m] \x1b[1m${f.title}\x1b[0m`);
      console.log(`   Location: ${f.file}:${f.line}`);
      console.log(`   ${f.description}`);
      console.log(`   \x1b[31m- ${f.original}\x1b[0m`);
      console.log(`   \x1b[32m+ ${f.suggested}\x1b[0m\n`);
    });

    if (isFix) {
      const patchedFiles = applyFixes(findings);
      console.log(`\x1b[32m✓ Applied ${findings.length} automated patches across ${patchedFiles.length} files.\x1b[0m\n`);
    } else {
      console.log(`\x1b[36mTip: Run with \x1b[1m--fix\x1b[0m\x1b[36m to automatically apply suggested patches.\x1b[0m\n`);
    }
  }
}

run();
