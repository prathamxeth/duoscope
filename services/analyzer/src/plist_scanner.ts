import * as fs from 'fs';
import { DiagnosticFinding } from '@foldlens/core-types';
import { generateRemediation } from './remediations.js';

export interface PlistAuditResult {
  deviceFamilies: number[];
  requiresFullScreen: boolean;
  supportedOrientations: string[];
  findings: DiagnosticFinding[];
}

/**
 * Scans an Info.plist file or content string for foldable & iPad multitasking compliance.
 */
export function scanInfoPlist(filePathOrContent: string, isFilePath = true): PlistAuditResult {
  const content = isFilePath ? fs.readFileSync(filePathOrContent, 'utf-8') : filePathOrContent;
  const filePath = isFilePath ? filePathOrContent : 'Info.plist';
  const findings: DiagnosticFinding[] = [];

  // Parse UIDeviceFamily (array of integers or integer)
  const deviceFamilies: number[] = [];
  const familyMatches = content.match(/<key>UIDeviceFamily<\/key>\s*<array>([\s\S]*?)<\/array>/i);
  if (familyMatches && familyMatches[1]) {
    const intMatches = familyMatches[1].matchAll(/<integer>(\d+)<\/integer>/g);
    for (const match of intMatches) {
      if (match[1]) deviceFamilies.push(parseInt(match[1], 10));
    }
  } else {
    // Single integer check
    const singleMatch = content.match(/<key>UIDeviceFamily<\/key>\s*<integer>(\d+)<\/integer>/i);
    if (singleMatch && singleMatch[1]) {
      deviceFamilies.push(parseInt(singleMatch[1], 10));
    }
  }

  // If UIDeviceFamily does not include 2 (iPad/Universal expanded canvas)
  if (!deviceFamilies.includes(2)) {
    const startLine = getLineNumber(content, 'UIDeviceFamily');
    findings.push({
      id: `FL-PLIST-001-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      category: 'PLIST_MISCONFIGURATION',
      severity: 'CRITICAL',
      title: 'Missing iPad/Tablet UIDeviceFamily (2) for Foldable Inner Canvas',
      description: 'The app is configured for iPhone compact mode only (UIDeviceFamily 1). Foldable dual-screen hardware requires UIDeviceFamily 2 to unlock the 7.6" expanded inner layout.',
      ruleId: 'FL-PLIST-001',
      impactedViewport: 'unfolded',
      location: {
        filePath,
        startLine: startLine > 0 ? startLine : 1,
        endLine: startLine > 0 ? startLine + 4 : 5
      },
      remediation: generateRemediation({
        ruleId: 'FL-PLIST-001',
        matchedText: familyMatches ? familyMatches[0] : '<key>UIDeviceFamily</key><integer>1</integer>',
        line: startLine,
        framework: 'InfoPlist',
        context: 'PLIST_DEVICE_FAMILY'
      })
    });
  }

  // Parse UIRequiresFullScreen
  const fullScreenMatch = content.match(/<key>UIRequiresFullScreen<\/key>\s*<(true|false)\/>/i);
  const requiresFullScreen = fullScreenMatch ? fullScreenMatch[1]?.toLowerCase() === 'true' : false;

  if (requiresFullScreen) {
    const startLine = getLineNumber(content, 'UIRequiresFullScreen');
    findings.push({
      id: `FL-PLIST-002-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      category: 'PLIST_MISCONFIGURATION',
      severity: 'HIGH',
      title: 'UIRequiresFullScreen is Set to True',
      description: 'UIRequiresFullScreen=true prevents the application from supporting dynamic window resizing, foldable split-screen modes, and live canvas expansion.',
      ruleId: 'FL-PLIST-002',
      impactedViewport: 'transition',
      location: {
        filePath,
        startLine: startLine > 0 ? startLine : 1,
        endLine: startLine > 0 ? startLine + 1 : 2
      },
      remediation: generateRemediation({
        ruleId: 'FL-PLIST-002',
        matchedText: '<key>UIRequiresFullScreen</key><true/>',
        line: startLine,
        framework: 'InfoPlist',
        context: 'PLIST_FULLSCREEN'
      })
    });
  }

  // Parse orientations
  const supportedOrientations: string[] = [];
  const orientMatches = content.matchAll(/<string>(UIInterfaceOrientation[A-Za-z0-9]+)<\/string>/g);
  for (const match of orientMatches) {
    if (match[1]) supportedOrientations.push(match[1]);
  }

  return {
    deviceFamilies,
    requiresFullScreen,
    supportedOrientations,
    findings
  };
}

function getLineNumber(content: string, substring: string): number {
  const index = content.indexOf(substring);
  if (index === -1) return 1;
  return content.substring(0, index).split('\n').length;
}
