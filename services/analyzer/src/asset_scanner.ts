import * as fs from 'fs';
import * as path from 'path';
import { DiagnosticFinding } from '@foldlens/core-types';
import { generateRemediation } from './remediations.js';

export interface AssetAuditResult {
  totalAssetsScanned: number;
  findings: DiagnosticFinding[];
}

/**
 * Scans Xcode Asset Catalogs (.xcassets) for raster resolution and vector scalability.
 */
export function scanAssetCatalogs(targetDir: string): AssetAuditResult {
  const findings: DiagnosticFinding[] = [];
  let totalAssetsScanned = 0;

  function traverse(currentPath: string) {
    if (!fs.existsSync(currentPath)) return;
    const entries = fs.readdirSync(currentPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name);

      if (entry.isDirectory()) {
        if (entry.name.endsWith('.imageset') || entry.name.endsWith('.appiconset')) {
          totalAssetsScanned++;
          auditAssetSet(fullPath, entry.name, findings);
        } else {
          traverse(fullPath);
        }
      }
    }
  }

  traverse(targetDir);

  return {
    totalAssetsScanned,
    findings
  };
}

function auditAssetSet(assetDir: string, assetName: string, findings: DiagnosticFinding[]) {
  const contentsJsonPath = path.join(assetDir, 'Contents.json');
  if (!fs.existsSync(contentsJsonPath)) return;

  try {
    const raw = fs.readFileSync(contentsJsonPath, 'utf-8');
    const json = JSON.parse(raw);

    const images: Array<{ scale?: string; filename?: string; idiom?: string }> = json.images || [];
    const hasVector = json.properties?.['preserves-vector-representation'] === true ||
      images.some(img => img.filename?.endsWith('.svg') || img.filename?.endsWith('.pdf'));

    const scalesPresent = new Set(images.map(img => img.scale).filter(Boolean));

    // If raster-only and missing 3x scale or vector support
    if (!hasVector && (!scalesPresent.has('3x') || scalesPresent.size < 2)) {
      findings.push({
        id: `FL-ASSET-001-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        category: 'ASSET_SCALABILITY',
        severity: 'MEDIUM',
        title: `Non-Scalable Asset in ${assetName}`,
        description: `Image set "${assetName}" lacks vector representation (SVG/PDF) or @3x retina scale. It will render with noticeable pixelation on the high-DPI 7.6" inner foldable display.`,
        ruleId: 'FL-ASSET-001',
        impactedViewport: 'unfolded',
        location: {
          filePath: contentsJsonPath,
          startLine: 1,
          endLine: 10
        },
        remediation: generateRemediation({
          ruleId: 'FL-ASSET-001',
          matchedText: `Asset Set: ${assetName}`,
          line: 1,
          framework: 'AssetCatalog',
          context: 'ASSET_RASTER'
        })
      });
    }
  } catch {
    // Non-fatal parse error on malformed contents.json
  }
}
