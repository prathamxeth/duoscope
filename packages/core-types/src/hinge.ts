import { Rect, ViewNode } from './view_hierarchy.js';

/**
 * Physical characteristics and safe margin for the foldable device hinge/crease.
 */
export interface HingeSpecification {
  orientation: 'vertical' | 'horizontal';
  centerOffset: number;       // Center point in points (e.g., 384 pt)
  physicalWidth: number;      // Physical hinge width in points (e.g., 4 pt)
  safeMarginPt: number;       // Safety exclusion buffer (e.g., 12 pt -> zone is [372, 396])
}

/**
 * Type of occlusion caused by the hinge.
 */
export type HingeOcclusionType =
  | 'DIRECT_INTERSECT'    // Element falls directly across the center crease
  | 'MARGIN_OVERLAP'      // Element penetrates into the safe exclusion margin
  | 'CRITICAL_CTA_SPLIT'  // Primary button or interactive control bisected by crease
  | 'TEXT_STRADDLE';      // Single line text label or input straddles crease

/**
 * Result of a hinge collision inspection for a specific view element.
 */
export interface HingeCollisionResult {
  elementId: string;
  className: string;
  accessibilityLabel?: string;
  elementFrame: Rect;
  hingeZone: Rect;
  occlusionType: HingeOcclusionType;
  overlapPercentage: number;
  viewNodeRef: ViewNode;
  recommendedShiftPt: {
    leftOffset: number;
    rightOffset: number;
  };
}
