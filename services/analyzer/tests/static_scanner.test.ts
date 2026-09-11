import { test, describe } from 'node:test';
import * as assert from 'node:assert';
import * as path from 'node:path';
import { StaticScanner } from '../src/static_scanner.js';
import { detectHingeCollisions } from '../src/hinge_detector.js';
import { ViewNode } from '@foldlens/core-types';

describe('FoldLens Static Scanner Suite', () => {
  const fixturesDir = path.resolve('tests/fixtures');

  test('should detect all static violations in Swift fixtures and Info.plist', async () => {
    const scanner = new StaticScanner();
    const report = await scanner.scan({
      targetPath: fixturesDir,
      appName: 'TestApp',
      bundleId: 'com.test.app'
    });

    assert.ok(report, 'Report should be defined');
    assert.strictEqual(report.appMetadata.appName, 'TestApp');
    assert.ok(report.findings.length >= 6, `Expected at least 6 findings, got ${report.findings.length}`);

    // Check specific rule detections
    const findingRules = report.findings.map(f => f.ruleId);
    assert.ok(findingRules.includes('FL-BOUNDS-001'), 'Must detect UIScreen.main.bounds');
    assert.ok(findingRules.includes('FL-BOUNDS-002'), 'Must detect hardcoded width');
    assert.ok(findingRules.includes('FL-BOUNDS-003'), 'Must detect hardcoded height');
    assert.ok(findingRules.includes('FL-BOUNDS-004'), 'Must detect SwiftUI fixed frame');
    assert.ok(findingRules.includes('FL-PLIST-001'), 'Must detect missing iPad UIDeviceFamily');
    assert.ok(findingRules.includes('FL-PLIST-002'), 'Must detect UIRequiresFullScreen=true');
    assert.ok(findingRules.includes('FL-ASSET-001'), 'Must detect non-scalable raster asset');

    // Check remediation generation
    const boundsFinding = report.findings.find(f => f.ruleId === 'FL-BOUNDS-001');
    assert.ok(boundsFinding?.remediation, 'Remediation should be present for UIScreen.main.bounds');
    assert.ok(boundsFinding.remediation.recommendedSnippet.length > 10, 'Remediation snippet should be detailed');

    // Verify readiness score calculation
    assert.ok(report.foldReadinessScore < 50, 'Score should be low due to critical and high severity findings');
    assert.ok(['D', 'F'].includes(report.grade), `Expected low grade, got ${report.grade}`);
  });

  test('should detect hinge collisions on view nodes intersecting the center crease', () => {
    const mockViewTree: ViewNode = {
      id: 'root-view',
      className: 'UIView',
      frame: { x: 0, y: 0, width: 768, height: 1024 },
      bounds: { x: 0, y: 0, width: 768, height: 1024 },
      screenFrame: { x: 0, y: 0, width: 768, height: 1024 },
      isHidden: false,
      alpha: 1.0,
      clipsToBounds: false,
      userInteractionEnabled: true,
      children: [
        {
          id: 'btn-checkout',
          className: 'UIButton',
          accessibilityLabel: 'Complete Purchase',
          frame: { x: 300, y: 800, width: 170, height: 50 },
          bounds: { x: 0, y: 0, width: 170, height: 50 },
          screenFrame: { x: 300, y: 800, width: 170, height: 50 }, // spans 300 -> 470, straddles 384 pt crease!
          isHidden: false,
          alpha: 1.0,
          clipsToBounds: false,
          userInteractionEnabled: true,
          children: []
        },
        {
          id: 'safe-card',
          className: 'UIView',
          frame: { x: 20, y: 100, width: 300, height: 200 },
          bounds: { x: 0, y: 0, width: 300, height: 200 },
          screenFrame: { x: 20, y: 100, width: 300, height: 200 }, // spans 20 -> 320, safe on left side
          isHidden: false,
          alpha: 1.0,
          clipsToBounds: false,
          userInteractionEnabled: true,
          children: []
        }
      ]
    };

    const { collisions, findings } = detectHingeCollisions(mockViewTree);

    assert.strictEqual(collisions.length, 1, 'Should detect exactly 1 collision (the checkout button)');
    assert.strictEqual(collisions[0]?.elementId, 'btn-checkout');
    assert.strictEqual(collisions[0]?.occlusionType, 'CRITICAL_CTA_SPLIT');
    assert.strictEqual(findings[0]?.severity, 'CRITICAL');
  });
});
