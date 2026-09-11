import {
  HingeCollisionResult,
  HingeOcclusionType,
  HingeSpecification,
  Rect,
  ViewNode,
  DiagnosticFinding
} from '@foldlens/core-types';

export const DEFAULT_IPHONE_DUO_HINGE: HingeSpecification = {
  orientation: 'vertical',
  centerOffset: 384, // Center for 768pt wide canvas
  physicalWidth: 4,
  safeMarginPt: 12   // 384 - 12 = 372 to 384 + 12 = 396
};

/**
 * Checks geometric intersection between a view's frame and the device hinge zone.
 */
export function detectHingeCollisions(
  rootNode: ViewNode,
  hingeSpec: HingeSpecification = DEFAULT_IPHONE_DUO_HINGE
): { collisions: HingeCollisionResult[]; findings: DiagnosticFinding[] } {
  const collisions: HingeCollisionResult[] = [];
  const findings: DiagnosticFinding[] = [];

  const hingeZone: Rect = {
    x: hingeSpec.centerOffset - hingeSpec.safeMarginPt,
    y: 0,
    width: hingeSpec.safeMarginPt * 2,
    height: 1024 // Canvas height
  };

  function evaluateNode(node: ViewNode, isRoot: boolean = false) {
    if (node.isHidden || node.alpha <= 0.05) return;

    // Skip root container or background views that span 95%+ of canvas width
    const isFullCanvasContainer = isRoot || (node.screenFrame.width >= (hingeSpec.centerOffset * 2 * 0.95) && node.children && node.children.length > 0);

    const nodeLeft = node.screenFrame.x;
    const nodeRight = node.screenFrame.x + node.screenFrame.width;
    const hingeLeft = hingeZone.x;
    const hingeRight = hingeZone.x + hingeZone.width;

    const hasHorizontalOverlap = nodeLeft < hingeRight && nodeRight > hingeLeft;

    if (!isFullCanvasContainer && hasHorizontalOverlap && node.screenFrame.width > 0 && node.screenFrame.height > 0) {
      // Calculate overlap geometry
      const overlapLeft = Math.max(nodeLeft, hingeLeft);
      const overlapRight = Math.min(nodeRight, hingeRight);
      const overlapWidth = Math.max(0, overlapRight - overlapLeft);
      const overlapPercentage = Math.round((overlapWidth / node.screenFrame.width) * 100);

      // Determine occlusion category
      let occlusionType: HingeOcclusionType = 'MARGIN_OVERLAP';
      const isInteractive = node.userInteractionEnabled && (
        node.className.includes('Button') ||
        node.className.includes('TextField') ||
        node.className.includes('Switch') ||
        node.className.includes('Control')
      );
      const isText = node.className.includes('Label') || node.className.includes('Text');

      if (nodeLeft < hingeSpec.centerOffset && nodeRight > hingeSpec.centerOffset) {
        if (isInteractive) {
          occlusionType = 'CRITICAL_CTA_SPLIT';
        } else if (isText) {
          occlusionType = 'TEXT_STRADDLE';
        } else {
          occlusionType = 'DIRECT_INTERSECT';
        }
      }

      // Calculate safe lateral shift recommendation
      const shiftLeft = -(nodeRight - hingeLeft + 4);
      const shiftRight = hingeRight - nodeLeft + 4;

      const collision: HingeCollisionResult = {
        elementId: node.id,
        className: node.className,
        accessibilityLabel: node.accessibilityLabel,
        elementFrame: node.screenFrame,
        hingeZone,
        occlusionType,
        overlapPercentage,
        viewNodeRef: node,
        recommendedShiftPt: {
          leftOffset: shiftLeft,
          rightOffset: shiftRight
        }
      };

      collisions.push(collision);

      // Generate diagnostic finding
      const severity = occlusionType === 'CRITICAL_CTA_SPLIT' ? 'CRITICAL' :
        occlusionType === 'TEXT_STRADDLE' ? 'HIGH' : 'MEDIUM';

      findings.push({
        id: `FL-HINGE-${node.id}-${Date.now()}`,
        category: 'HINGE_COLLISION',
        severity,
        title: `Hinge Seam Occlusion on <${node.className}> (${occlusionType})`,
        description: `Element "${node.accessibilityLabel || node.className}" intersects the central foldable hinge zone (${hingeLeft.toFixed(0)}pt - ${hingeRight.toFixed(0)}pt) with ${overlapPercentage}% overlap. ${
          occlusionType === 'CRITICAL_CTA_SPLIT'
            ? 'Interactive user control is bisected across physical hinge, impeding touch gestures!'
            : 'Visual content or text is distorted across the screen crease.'
        }`,
        ruleId: 'FL-HINGE-001',
        impactedViewport: 'unfolded',
        remediation: {
          framework: 'UIKit',
          explanation: `Shift the element outside the ${hingeSpec.safeMarginPt * 2}pt hinge exclusion zone or split into a two-pane layout using SwiftUI NavigationSplitView or UIKit UIStackView.`,
          originalSnippet: `frame: (${node.screenFrame.x}, ${node.screenFrame.y}, ${node.screenFrame.width}, ${node.screenFrame.height})`,
          recommendedSnippet: `// Adjust horizontal constraint to stay on left or right display pane:
// Left pane anchor: trailingAnchor <= hingeCenter (${hingeSpec.centerOffset - hingeSpec.safeMarginPt}pt)
// Right pane anchor: leadingAnchor >= hingeCenter (${hingeSpec.centerOffset + hingeSpec.safeMarginPt}pt)`
        },
        metadata: {
          elementId: node.id,
          overlapPercentage,
          occlusionType
        }
      });
    }

    // Recursively check children
    if (node.children && node.children.length > 0) {
      for (const child of node.children) {
        evaluateNode(child, false);
      }
    }
  }

  evaluateNode(rootNode, true);

  return { collisions, findings };
}
