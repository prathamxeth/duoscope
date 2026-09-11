# DuoScope

Dual-screen and foldable iOS continuity intelligence for AI coding agents and developers. 1 skill, precision AST diagnostics, live 3D hardware simulation, and deterministic layout auto-patching for foldable form factors (iPhone Duo 5.4" $\leftrightarrow$ 7.6").

By [Pratham](https://github.com/prathamxeth)

> **Quick start:** From your project root, run `npx duoscope audit <path> --fix`, or invoke `/duoscope audit` inside your AI coding tool. Live Web Studio: [prathamxeth.github.io/duoscope](https://prathamxeth.github.io/duoscope/).

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![Author: prathamxeth](https://img.shields.io/badge/Author-@prathamxeth-black.svg?style=flat-square&logo=github)](https://github.com/prathamxeth)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4+-3178C6.svg?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14.2-black.svg?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Live Deployment](https://img.shields.io/badge/GitHub%20Pages-Live%20Studio-30D158.svg?style=flat-square&logo=githubpages&logoColor=white)](https://prathamxeth.github.io/duoscope/)

---

## Why DuoScope?

Every model and developer has been trained on standard single-screen mobile interfaces. Skip dual-screen guidance and you get the same failure modes on every foldable project:

- **`UIScreen.main.bounds` everywhere**: Hardcoded screen dimensions that freeze or distort views when unfolding to the 7.6" dual canvas.
- **Crease collisions**: Interactive buttons, checkout actions, and CTAs centered directly across the physical hinge seam ($x = 384\text{pt} \pm 12\text{pt}$).
- **Rigid 390pt frames**: Single-screen width constraints that clip and prevent responsive expansion.
- **Continuity hitches**: Unoptimized subview passes causing frame drops (>16ms) during device posture change.

**DuoScope adds:**
- **One setup flow.** Drop [`.agents/skills/duoscope`](.agents/skills/duoscope) into your AI assistant or run `npx duoscope` to eliminate dual-screen defects automatically.
- **Deterministic AST detector rules.** Fast static analysis catches bounds traps, crease collisions, and rigid frames with zero LLM hallucinations and no API keys required.
- **Interactive 3D Web Studio.** Real-time 0°–180° physics simulation on GitHub Pages with instant side-by-side diff inspection.

---

## What's Included

### The Skill: `duoscope`

The skill installs as a native workflow for AI coding tools (Antigravity, Cursor, Claude Code, Windsurf):

```bash
/duoscope <command> <target>
```

Start auditing any iOS project with:

```bash
/duoscope audit
```

### Commands Matrix

All commands are accessed through `/duoscope` or the CLI:

| Command | What it does |
|---|---|
| `/duoscope audit` | Full static AST audit for bounds traps, crease collisions, and layout defects |
| `/duoscope fix` | Auto-applies non-destructive, validated Swift and SwiftUI code patches |
| `/duoscope simulate` | Profiles 5.4" cover $\leftrightarrow$ 7.6" canvas continuity and frame hitching |
| `/duoscope crease` | Calculates safe margins around the physical $x = 384\text{pt}$ vertical seam |
| `/duoscope adapt` | Converts fixed compact frame widths to dynamic `.frame(maxWidth: .infinity)` |
| `/duoscope plist` | Audits `Info.plist` for iPad/Universal (`UIDeviceFamily = 2`) & multi-window support |
| `/duoscope report` | Exports machine-readable diagnostic JSON for CI/CD integrations |

#### Usage Examples

```bash
/duoscope audit Sources/Views/CheckoutView.swift   # Audit checkout CTA for fold crease collision
/duoscope fix Sources/Views                       # Auto-patch all detected layout traps
/duoscope simulate                                 # Profile folding transition latency
/duoscope report --output=duoscope-report.json     # Generate full diagnostic report
```

---

## Anti-Patterns

DuoScope enforces explicit rules against foldable anti-patterns:

- ❌ **Don't query `UIScreen.main.bounds`**: Screen size changes dynamically between cover and canvas modes (use `GeometryReader` or `view.bounds`).
- ❌ **Don't center buttons on `view.centerXAnchor`**: Interactive controls straddle the physical hinge ($x = 384\text{pt}$).
- ❌ **Don't lock widths to 375/390/414pt**: Prevents fluid adaptation on 7.6" canvas.
- ❌ **Don't set `UIRequiresFullScreen = true`**: Disables dual-screen multitasking and split view.
- ❌ **Don't use raster-only `@1x`/`@2x` assets**: Leads to blurry rendering on high-DPI 7.6" displays (always provide vector PDF/SVG or `@3x`).

---

## Installation & Usage

### Option 1: Headless CLI (Recommended)

From your iOS project root, run:

```bash
# Scan a specific file or directory
npx duoscope audit ./Sources

# Scan and automatically apply code fixes
npx duoscope audit ./Sources --fix

# Export report as JSON for CI/CD
npx duoscope audit ./Sources --json > duoscope-report.json
```

---

### Option 2: AI Agent Skill

Copy `.agents/skills/duoscope` into your workspace `.agents/skills/` directory or global customizations (`~/.gemini/config/skills/duoscope`).

Then prompt your AI assistant:
> *"Audit this iOS project for iPhone Duo dual-screen continuity and apply safe fold layout fixes using the DuoScope skill."*

---

### Option 3: Interactive 3D Web Studio

Visit the live deployment at [**prathamxeth.github.io/duoscope**](https://prathamxeth.github.io/duoscope/) to:
- Test 0°–180° continuous hardware hinge angles in real-time 3D physics.
- Inspect the central fold-line safe zone overlay ($x = 384\text{pt}$).
- Paste Swift code or upload project files for instant side-by-side AST diff patches.

---

## Architecture

```
duoscope/
├── .agents/
│   └── skills/
│       └── duoscope/            # 🤖 AI Agent Skill definition (SKILL.md)
├── apps/
│   └── web/                     # 🌐 Next.js Web Studio & 3D Phone Simulator
├── packages/
│   ├── cli/                     # 💻 Standalone CLI executable (npx duoscope)
│   └── core-types/              # 📦 Shared TypeScript data contracts & AST models
└── services/
    └── analyzer/                # ⚙️ Static AST parser & heuristic rule engine
```

---

## Technology Stack

- **Frontend**: [Next.js 14](https://nextjs.org/) (App Router), [React 18](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/)
- **Design System**: Apple Liquid Glass, Pure OLED Dark Mode (`#000000`), `Instrument Serif`, `Barlow`, and `JetBrains Mono`
- **Simulation**: CSS 3D Matrix Transform Hardware Physics Engine
- **Engine**: TypeScript AST pattern parser, regex token analyzer, and Plist validator
- **CI/CD**: GitHub Actions automated deployment to [GitHub Pages](https://pages.github.com/)

---

## Author & License

Created by **[Pratham](https://github.com/prathamxeth)** ([@prathamxeth](https://github.com/prathamxeth)).

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for details.
