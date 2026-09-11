import { FindingCategory, FindingSeverity, TargetFramework } from '@foldlens/core-types';

export interface RuleDefinition {
  id: string;
  category: FindingCategory;
  severity: FindingSeverity;
  title: string;
  description: string;
  pattern: RegExp;
  framework: TargetFramework;
  context: 'SWIFTUI_FRAME' | 'UISCREEN_BOUNDS' | 'HARDCODED_WIDTH' | 'HARDCODED_HEIGHT' | 'LAYOUT_SUBVIEWS_RIGID';
}

export const HARDCODED_BOUNDS_RULES: RuleDefinition[] = [
  {
    id: 'FL-BOUNDS-001',
    category: 'LAYOUT_TRAP',
    severity: 'CRITICAL',
    title: 'Usage of UIScreen.main.bounds',
    description: 'Found direct access to UIScreen.main.bounds. This API returns physical hardware screen dimensions and fails to adapt dynamically during fold/unfold viewport transitions.',
    pattern: /UIScreen\.main\.(bounds|bounds\.width|bounds\.height|nativeBounds)/g,
    framework: 'UIKit',
    context: 'UISCREEN_BOUNDS'
  },
  {
    id: 'FL-BOUNDS-002',
    category: 'LAYOUT_TRAP',
    severity: 'HIGH',
    title: 'Hardcoded Compact iPhone Screen Width (375/390/414/430pt)',
    description: 'Hardcoded standard iPhone screen width detected in layout declaration or frame initializer. Will cause narrow ribbon rendering on expanded 7.6" canvas.',
    pattern: /(?:width:\s*|width\s*==\s*|CGRect\(.*,\s*|CGSize\(\s*width:\s*)(?:375|390|414|428|430)(?:\.0)?(?:\s*,\s*|\s*\)|\s*;)/g,
    framework: 'UIKit',
    context: 'HARDCODED_WIDTH'
  },
  {
    id: 'FL-BOUNDS-003',
    category: 'LAYOUT_TRAP',
    severity: 'HIGH',
    title: 'Hardcoded Compact iPhone Screen Height (667/812/844/896/932pt)',
    description: 'Hardcoded standard iPhone screen height detected in layout. Will break vertical scroll containment and aspect ratio in dual-screen canvas.',
    pattern: /(?:height:\s*|height\s*==\s*|CGRect\(.*,\s*|CGSize\(.*height:\s*)(?:667|812|844|852|896|926|932)(?:\.0)?(?:\s*,\s*|\s*\)|\s*;)/g,
    framework: 'UIKit',
    context: 'HARDCODED_HEIGHT'
  },
  {
    id: 'FL-BOUNDS-004',
    category: 'LAYOUT_TRAP',
    severity: 'HIGH',
    title: 'Fixed SwiftUI .frame(width: ...) with Static Point Value',
    description: 'Fixed width modifier in SwiftUI prevents fluid resizing when canvas expands during unfolding.',
    pattern: /\.frame\s*\(\s*width:\s*(?:375|390|414|428|430)\b/g,
    framework: 'SwiftUI',
    context: 'SWIFTUI_FRAME'
  }
];
