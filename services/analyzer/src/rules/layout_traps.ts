import { RuleDefinition } from './hardcoded_bounds.js';

export const LAYOUT_TRAP_RULES: RuleDefinition[] = [
  {
    id: 'FL-TRAP-001',
    category: 'LAYOUT_TRAP',
    severity: 'MEDIUM',
    title: 'Manual Frame Setting Inside layoutSubviews Without Dynamic Bounds Check',
    description: 'Setting subview frames manually in layoutSubviews without verifying container bounds change causes layout stutter or desynchronized layout passes.',
    pattern: /subview\.frame\s*=\s*CGRect\(/g,
    framework: 'UIKit',
    context: 'LAYOUT_SUBVIEWS_RIGID'
  },
  {
    id: 'FL-TRAP-002',
    category: 'DEPRECATED_API',
    severity: 'MEDIUM',
    title: 'Deprecated UIApplication.shared.statusBarOrientation',
    description: 'statusBarOrientation is deprecated in iOS 13+ and completely fails to report multi-window and foldable canvas orientation changes.',
    pattern: /UIApplication\.shared\.statusBarOrientation/g,
    framework: 'UIKit',
    context: 'LAYOUT_SUBVIEWS_RIGID'
  },
  {
    id: 'FL-TRAP-003',
    category: 'CONTINUITY_HITCH',
    severity: 'HIGH',
    title: 'Blocking Main Thread in viewWillTransition(to:with:)',
    description: 'Performing synchronous data fetches or heavy computation inside viewWillTransition causes severe continuity hitches (>16.6ms) during fold/unfold.',
    pattern: /override\s+func\s+viewWillTransition\s*\([^)]*\)\s*\{[^}]*(?:Data\(contentsOf:|Thread\.sleep|DispatchQueue\.main\.sync)/gs,
    framework: 'UIKit',
    context: 'LAYOUT_SUBVIEWS_RIGID'
  }
];
