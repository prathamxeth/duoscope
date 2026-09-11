---
name: duoscope
description: Automated diagnostics, fold crease safety, and continuity fixes for foldable dual-screen iOS apps (iPhone Duo 5.4" <-> 7.6"). Use when auditing, refactoring, or building SwiftUI and UIKit apps for foldable form factors, eliminating UIScreen bounds traps, resolving fold seam collisions, or implementing posture-adaptive dual-screen layouts.
---

# DuoScope: Dual-Screen & Foldable iOS Continuity Skill

A comprehensive engineering guide for auditing, designing, and repairing iOS applications for foldable and dual-screen form factors (specifically the iPhone Duo 5.4" cover display to 7.6" expanded inner canvas).

---

## 1. Core Architecture & Form Factors

Foldable iOS hardware operates across three primary physical configurations:
1. **Compact Cover Display (5.4")**: Single portrait pane (`375 × 812 pt`, `19.5:9` aspect ratio).
2. **Expanded Dual Canvas (7.6")**: Unfolded 180° canvas (`768 × 1024 pt` vertical, `1024 × 768 pt` horizontal). Center hinge seam is located exactly at `x = 384 pt` in vertical orientation.
3. **Tabletop / Laptop Flex Posture (90°–125°)**: Upper screen pane acts as viewing stage (`384 × 512 pt`); lower pane serves as interactive touch controls / keyboard.

---

## 2. The 4 Fatal Foldable iOS Anti-Patterns

When auditing iOS codebases, identify and eliminate these four critical traps:

### Trap 1: Fixed `UIScreen.main.bounds` Screen Sizing
- **Problem**: Reading `UIScreen.main.bounds` returns fixed hardware dimensions rather than dynamic window scene dimensions. When unfolded to 7.6", views either render distorted or truncate.
- **Rule**: Never use `UIScreen.main.bounds.width` or `UIScreen.main.bounds.height`.
- **SwiftUI Fix**: Use `GeometryReader` or `.frame(maxWidth: .infinity)`.
- **UIKit Fix**: Use `view.bounds` in `viewDidLayoutSubviews()`, or anchor constraints to `view.safeAreaLayoutGuide`.

```swift
// ❌ INCORRECT (Breaks on Fold/Unfold)
let bannerWidth = UIScreen.main.bounds.width
let banner = UIView(frame: CGRect(x: 0, y: 0, width: bannerWidth, height: 260))

// ✅ CORRECT (Adaptive Container)
override func viewDidLayoutSubviews() {
    super.viewDidLayoutSubviews()
    banner.frame = CGRect(x: 0, y: 0, width: view.bounds.width, height: 260)
}
```

---

### Trap 2: Center Crease Collisions (Action Cut-Offs)
- **Problem**: In 7.6" dual canvas, centering buttons or primary CTAs (`centerXAnchor.constraint(equalTo: view.centerXAnchor)`) places interactive tap targets directly over the physical folding hinge line (`x = 384 pt ± 16 pt`), making them difficult to tap and visually split in half.
- **Rule**: Anchor primary CTAs to `safeAreaLayoutGuide.trailingAnchor` or pane-specific layout guides.

```swift
// ❌ INCORRECT (Button split across fold seam)
checkoutButton.centerXAnchor.constraint(equalTo: view.centerXAnchor).isActive = true

// ✅ CORRECT (Safe Margin Anchored to Right Pane)
checkoutButton.trailingAnchor.constraint(equalTo: view.safeAreaLayoutGuide.trailingAnchor, constant: -20).isActive = true
checkoutButton.widthAnchor.constraint(equalToConstant: 320).isActive = true
```

---

### Trap 3: Hardcoded Window Dimensions & Modal Sheets
- **Problem**: Hardcoding modal or popover widths (e.g. `frame(width: 375)`) fails to take advantage of dual-pane screen real estate.
- **Rule**: Use adaptive split layouts (`NavigationSplitView` in SwiftUI or `UISplitViewController` in UIKit).

```swift
// ✅ CORRECT (SwiftUI Two-Pane Foldable Layout)
struct DualPaneStoreView: View {
    var body: some View {
        NavigationSplitView {
            CategorySidebarList()
                .navigationTitle("Categories")
        } detail: {
            ProductDetailGrid()
                .navigationTitle("Products")
        }
        .navigationSplitViewStyle(.balanced)
    }
}
```

---

### Trap 4: Loss of Ephemeral State on Continuity Transitions
- **Problem**: When folding or unfolding the device, iOS triggers a trait collection and window resize. Unsaved text input, video playback position, or scroll offsets get reset if stored only in transient view controller state.
- **Rule**: Store state in `@StateObject` / `@Observable` models or persistent controllers that survive window frame mutations.

---

## 3. Fold Safety Verification Checklist

When reviewing any pull request or UI component for foldable readiness:
- [ ] Are any views positioned between `x = 368 pt` and `x = 400 pt` on 7.6" canvases without a safe margin?
- [ ] Does the view implement `layoutSubviews()` or `traitCollectionDidChange()` to handle seamless 5.4" <-> 7.6" resizing?
- [ ] Are interactive buttons and text fields padded at least 24pt away from the center fold line?
- [ ] Is video playback decoupled from orientation changes to support 90° Tabletop Flex posture?
- [ ] Are animations configured with interruptible spring curves (`cubic-bezier(0.16, 1, 0.3, 1)`) so screen transitions never stutter?

---

## 4. Automated Fix CLI Command

To audit any Swift project and apply automatic fixes:
```bash
# Run static analysis audit on codebase
npx duoscope audit ./ios

# Run audit and automatically apply safe patches
npx duoscope audit ./ios --fix
```
