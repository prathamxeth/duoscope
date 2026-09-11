/**
 * 2D Rectangle representing element coordinates in points.
 */
export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Physical/logical screen viewport configuration.
 */
export interface ViewportDimension {
  width: number;
  height: number;
  scale: number;
  safeAreaInsets: {
    top: number;
    left: number;
    bottom: number;
    right: number;
  };
}

/**
 * Standard foldable device states for iPhone Duo.
 */
export type DeviceState =
  | 'compact_outer_5_4'   // 5.4" Outer screen (e.g. 375x812 pt @3x)
  | 'expanded_inner_7_6'  // 7.6" Inner dual-canvas (e.g. 768x1024 pt @2x / 840x1080 pt)
  | 'transitioning';

/**
 * Node in the extracted or simulated iOS View Hierarchy tree.
 */
export interface ViewNode {
  id: string;
  className: string;
  moduleName?: string;
  frame: Rect;
  bounds: Rect;
  screenFrame: Rect;
  isHidden: boolean;
  alpha: number;
  clipsToBounds: boolean;
  userInteractionEnabled: boolean;
  accessibilityLabel?: string;
  accessibilityIdentifier?: string;
  hasAmbiguousLayout?: boolean;
  contentCompressionResistancePriority?: {
    horizontal: number;
    vertical: number;
  };
  contentHuggingPriority?: {
    horizontal: number;
    vertical: number;
  };
  children: ViewNode[];
}

/**
 * Snapshot of the view hierarchy at a specific device state.
 */
export interface ViewHierarchySnapshot {
  deviceState: DeviceState;
  viewport: ViewportDimension;
  timestampMs: number;
  rootNode: ViewNode;
  screenshotBase64?: string;
}
