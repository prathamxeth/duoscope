import { RemediationGuidance, TargetFramework } from '@foldlens/core-types';

export interface CodeRuleMatch {
  ruleId: string;
  matchedText: string;
  line: number;
  framework: TargetFramework;
  context: 'SWIFTUI_FRAME' | 'UISCREEN_BOUNDS' | 'HARDCODED_WIDTH' | 'HARDCODED_HEIGHT' | 'LAYOUT_SUBVIEWS_RIGID' | 'PLIST_DEVICE_FAMILY' | 'PLIST_FULLSCREEN' | 'ASSET_RASTER';
}

/**
 * Generates drop-in Swift and SwiftUI code fixes based on static rule triggers.
 */
export function generateRemediation(match: CodeRuleMatch): RemediationGuidance {
  switch (match.context) {
    case 'UISCREEN_BOUNDS':
      if (match.framework === 'SwiftUI') {
        return {
          framework: 'SwiftUI',
          explanation: '`UIScreen.main.bounds` is static and does not update when an iPhone is unfolded into dual/expanded canvas mode. Use `GeometryReader` or `.containerRelativeFrame(.horizontal)` to read adaptive container geometry dynamically.',
          originalSnippet: match.matchedText,
          recommendedSnippet: `// Replace static UIScreen bounds with SwiftUI container sizing:
GeometryReader { geometry in
    VStack {
        // Use geometry.size.width and geometry.size.height
        ContentView()
            .frame(width: geometry.size.width)
    }
}
// Or in iOS 17+:
.containerRelativeFrame(.horizontal) { length, axis in
    length // adapts automatically to folded (5.4") vs unfolded (7.6")
}`,
          docUrl: 'https://developer.apple.com/documentation/swiftui/geometryreader'
        };
      } else {
        return {
          framework: 'UIKit',
          explanation: '`UIScreen.main.bounds` is fixed to the hardware display and causes layout clipping on foldable dynamic viewports. Anchor views to `view.safeAreaLayoutGuide` or adapt in `viewWillTransition(to:with:)`.',
          originalSnippet: match.matchedText,
          recommendedSnippet: `// Replace UIScreen.main.bounds with Auto Layout safe area anchors:
NSLayoutConstraint.activate([
    customView.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor),
    customView.leadingAnchor.constraint(equalTo: view.safeAreaLayoutGuide.leadingAnchor),
    customView.trailingAnchor.constraint(equalTo: view.safeAreaLayoutGuide.trailingAnchor),
    customView.bottomAnchor.constraint(equalTo: view.safeAreaLayoutGuide.bottomAnchor)
])`,
          docUrl: 'https://developer.apple.com/documentation/uikit/uiviewcontroller/1621461-viewwilltransition'
        };
      }

    case 'SWIFTUI_FRAME':
    case 'HARDCODED_WIDTH':
      return {
        framework: match.framework,
        explanation: 'Hardcoded fixed widths (e.g. 375, 390, 414pt) cause extreme empty margins or clipped views when unfolded to the 7.6" inner canvas.',
        originalSnippet: match.matchedText,
        recommendedSnippet: match.framework === 'SwiftUI'
          ? `.frame(maxWidth: .infinity) // Allow view to expand smoothly across foldable canvas`
          : `customView.widthAnchor.constraint(equalTo: view.widthAnchor, multiplier: 1.0).isActive = true`,
        docUrl: 'https://developer.apple.com/documentation/swiftui/view/frame(minwidth:idealwidth:maxwidth:minheight:idealheight:maxheight:alignment:)'
      };

    case 'HARDCODED_HEIGHT':
      return {
        framework: match.framework,
        explanation: 'Hardcoded fixed heights (e.g. 844, 932pt) break when switching between compact outer screen aspect ratios and squarish expanded dual-screen ratios.',
        originalSnippet: match.matchedText,
        recommendedSnippet: match.framework === 'SwiftUI'
          ? `.frame(maxHeight: .infinity)`
          : `customView.heightAnchor.constraint(equalTo: view.heightAnchor).isActive = true`,
        docUrl: 'https://developer.apple.com/documentation/swiftui/view/frame'
      };

    case 'LAYOUT_SUBVIEWS_RIGID':
      return {
        framework: 'UIKit',
        explanation: 'Manual frame calculations in `layoutSubviews` without reacting to size transitions will freeze layouts upon folding/unfolding. Use Auto Layout or override `traitCollectionDidChange` / `viewWillTransition`.',
        originalSnippet: match.matchedText,
        recommendedSnippet: `override func viewWillTransition(to size: CGSize, with coordinator: UIViewControllerTransitionCoordinator) {
    super.viewWillTransition(to: size, with: coordinator)
    coordinator.animate(alongsideTransition: { _ in
        // Smoothly animate subview layout adaptations
        self.updateAdaptiveLayout(for: size)
    })
}`,
        docUrl: 'https://developer.apple.com/documentation/uikit/uitraitcollection'
      };

    case 'PLIST_DEVICE_FAMILY':
      return {
        framework: 'InfoPlist',
        explanation: 'Foldable dual-screen iOS devices utilize tablet/expanded form factor scaling. `UIDeviceFamily` must include 2 (iPad/Universal).',
        originalSnippet: match.matchedText,
        recommendedSnippet: `<key>UIDeviceFamily</key>
<array>
    <integer>1</integer> <!-- iPhone Compact (5.4") -->
    <integer>2</integer> <!-- iPad / Expanded Dual-Canvas (7.6") -->
</array>`,
        docUrl: 'https://developer.apple.com/documentation/bundleresources/information_property_list/uidevicefamily'
      };

    case 'PLIST_FULLSCREEN':
      return {
        framework: 'InfoPlist',
        explanation: '`UIRequiresFullScreen: true` disables multi-window and foldable canvas split-view continuity.',
        originalSnippet: match.matchedText,
        recommendedSnippet: `<key>UIRequiresFullScreen</key>
<false/>`,
        docUrl: 'https://developer.apple.com/documentation/bundleresources/information_property_list/uirequiresfullscreen'
      };

    case 'ASSET_RASTER':
      return {
        framework: 'AssetCatalog',
        explanation: 'Bitmap assets lacking vector PDF/SVG or scalable representations will appear blurry on the higher-density expanded 7.6" dual canvas.',
        originalSnippet: match.matchedText,
        recommendedSnippet: `// In Xcode Asset Catalog:
// Set "Scales" to "Single Scale" (Vector) and provide a clean SVG or Vector PDF.
// Or ensure 1x, 2x, and 3x retina slices are populated.`,
        docUrl: 'https://developer.apple.com/documentation/xcode/asset-catalogs'
      };
  }
}
