<div align="center">

# 📱 DuoScope

### *Your iOS apps weren't built for hinges. DuoScope fixes that.*

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4+-3178C6.svg?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14.2-black.svg?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Deploy Status](https://img.shields.io/badge/GitHub%20Pages-Live%20Demo-30D158.svg?style=for-the-badge&logo=githubpages&logoColor=white)](https://prathamxeth.github.io/duoscope/)

<br />

```
   ┌─────────────────┐       ┌─────────────────┬─────────────────┐
   │                 │       │                 │                 │
   │   5.4" COVER    │  ──>  │   LEFT SCREEN   │  RIGHT SCREEN   │
   │    COMPACT      │       │     (384pt)     ║     (384pt)     │
   │                 │       │                 ║ <── SEAM x=384  │
   └─────────────────┘       └─────────────────┴─────────────────┘
        Folded (0°)                       Unfolded (180°)
```

### [👉 Launch Live 3D Web Studio & Playground](https://prathamxeth.github.io/duoscope/)

</div>

---

## 🎮 Interactive Features

<details open>
<summary><h3>🌐 1. The 3D Web Studio & Hardware Simulator</h3></summary>

Experience how your iOS app feels when folded, tilted on a table, or opened wide:

* 🔄 **0° to 180° Physics Engine**: Drag to bend the device in real-time 3D space.
* ⚠️ **Fold Line Radar**: Highlights controls and buttons trapped over the center seam ($x = 384\text{pt}$).
* ⚡ **Instant Fixes**: Paste raw Swift code or drag `.swift` files to get drop-in SwiftUI/UIKit patches.
* 📦 **Zero-Server Static Runtime**: Runs entirely client-side on GitHub Pages.

[**Open the Web Studio →**](https://prathamxeth.github.io/duoscope/)

</details>

<details open>
<summary><h3>🤖 2. The AI Agent Skill</h3></summary>

DuoScope ships with a native drop-in AI Agent Skill (`.agents/skills/duoscope/SKILL.md`) for AI assistants (Antigravity, Cursor, Claude Code).

#### 💬 Try this prompt in your AI agent:
```markdown
> "Audit my iOS project for iPhone Duo dual-screen continuity and apply safe fold layout fixes using the DuoScope skill."
```

#### 🛡️ What the AI Agent Solves Automatically:
- [x] Rewrites `UIScreen.main.bounds` traps to adaptive `GeometryReader` / `view.bounds`
- [x] Shifts `centerXAnchor` buttons safely away from the $x = 384\text{pt}$ physical crease
- [x] Unlocks hardcoded single-screen frames (`375pt`, `390pt`, `414pt`) to dynamic widths
- [x] Validates `Info.plist` multitasking & high-density `@3x` asset scaling

</details>

<details>
<summary><h3>🔬 3. Interactive Code Diff Inspector</h3></summary>

#### Trap 1: The `UIScreen.main.bounds` Trap
```diff
- // ❌ Freezes on 5.4" dimensions when unfolded
- let cardWidth = UIScreen.main.bounds.width - 32
+ // ✨ Adapts dynamically to 7.6" canvas
+ GeometryReader { proxy in
+     let cardWidth = proxy.size.width - 32
+ }
```

#### Trap 2: The Crease Collision Seam ($x = 384\text{pt}$)
```diff
- // ❌ Button gets cut in half right over the physical hinge!
- buyButton.centerXAnchor.constraint(equalTo: view.centerXAnchor).isActive = true
+ // ✨ Padded safely inside the right display quadrant
+ buyButton.trailingAnchor.constraint(
+     equalTo: view.safeAreaLayoutGuide.trailingAnchor,
+     constant: -20
+ ).isActive = true
```

#### Trap 3: Hardcoded Compact Frame Width
```diff
- // ❌ Clipped on 7.6" dual canvas
- .frame(width: 390, height: 240)
+ // ✨ Expands fluidly
+ .frame(maxWidth: .infinity, minHeight: 240)
```

</details>

---

## 🛠️ Technology Stack

```
   ┌─────────────────────────────────────────────────────────────┐
   │                      DUOSCOPE STACK                         │
   ├─────────────────┬───────────────────┬───────────────────────┤
   │  Next.js 14     │  Tailwind CSS     │  CSS 3D Physics       │
   │  App Router     │  Liquid Glass UI  │  Hardware Matrix Sim  │
   ├─────────────────┼───────────────────┼───────────────────────┤
   │  TypeScript 5.4 │  Regex AST Parser │  GitHub Actions CI/CD │
   │  Strict Typing  │  Client Fallback  │  Automated Pages Host │
   └─────────────────┴───────────────────┴───────────────────────┘
```

- **Frontend Core**: [Next.js 14](https://nextjs.org/), [React 18](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/)
- **Visual Design**: Apple Liquid Glass, Pure OLED Dark Mode (`#000000`), `Instrument Serif` & `Barlow` Typography
- **Hardware Simulation**: Real-time CSS 3D matrix transforms with continuous posture interpolation
- **Static Deployment**: [GitHub Pages](https://pages.github.com/) with automated workflow deployment

---

## 📄 Licensing

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for complete terms.

<div align="center">

**[⚡ Try DuoScope Live](https://prathamxeth.github.io/duoscope/)** • Crafted for next-gen dual-screen iOS hardware by the **DuoScope Team**.

</div>
