# DuoScope 📱⚡

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![Node](https://img.shields.io/badge/Node-%3E%3D18.0.0-339933.svg?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4+-3178C6.svg?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14.2-black.svg?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Hardware Target](https://img.shields.io/badge/Hardware-iPhone%20Duo%20(5.4%22%20%E2%86%94%207.6%22)-0071E3.svg?style=flat-square&logo=apple&logoColor=white)](https://apple.com)

Automated diagnostics, 3D hardware simulation, and AST auto-patching engine for dual-screen and foldable iOS applications (**iPhone Duo: 5.4" cover display $\leftrightarrow$ 7.6" unfolded canvas**).

[**🌐 Live Studio (GitHub Pages)**](https://prathamxeth.github.io/duoscope/) • [**💻 CLI Docs**](#-cli-reference) • [**🤖 AI Skill**](#-ai-agent-skill) • [**🔬 Diagnostic Rules**](#-diagnostic-rules--diffs)

---

## ⚡ Quickstart

```bash
# 1. Clone
git clone https://github.com/prathamxeth/duoscope.git
cd duoscope

# 2. Install & Build Monorepo
npm install
npm run build

# 3. Launch Web Studio (Next.js + 3D Physics Sim)
npm run dev:web
# -> http://localhost:3000 (or http://localhost:3001)

# 4. Or Run CLI Directly on any Swift file or Xcode Project
npx duoscope audit ./path/to/ios/Sources --fix
```

---

## 🧩 Monorepo Workspaces

| Workspace | Type | Path | Purpose |
|---|---|---|---|
| **`.agents/skills/duoscope`** | Skill | [`.agents/skills/duoscope/SKILL.md`](.agents/skills/duoscope/SKILL.md) | Drop-in AI agent skill for autonomous dual-screen auditing & code remediation. |
| **`apps/web`** | App | [`apps/web`](apps/web) | Next.js 14 Web Studio with real-time 3D phone physics, fold-crease overlay & diff inspector. |
| **`packages/cli`** | Binary | [`packages/cli`](packages/cli) | Standalone Node.js CLI tool (`npx duoscope audit <path> [--fix] [--json]`). |
| **`packages/core-types`** | Package | [`packages/core-types`](packages/core-types) | Shared TypeScript data contracts, AST schemas, and diagnostic report models. |
| **`services/analyzer`** | Service | [`services/analyzer`](services/analyzer) | Static AST parsing, regex heuristic rules, and Info.plist / `.xcassets` scanners. |

---

## 💻 CLI Reference

DuoScope CLI analyzes Swift/Obj-C source trees and generates non-destructive AST patches.

```bash
# Basic audit on single file or directory
npx duoscope audit ./Sources/Views/ProductView.swift

# Run audit & auto-apply fixes in-place
npx duoscope audit ./Sources --fix

# Export machine-readable JSON report for CI/CD status checks
npx duoscope audit ./Sources --json > duoscope-report.json

# Check version & usage
npx duoscope --help
```

### CLI Options

| Flag | Argument | Description |
|---|---|---|
| `audit` | `<path>` | **Required**. Target file or root directory to analyze. |
| `--fix` | _none_ | Auto-replaces detected AST anti-patterns with validated safe layout code. |
| `--json` | _none_ | Outputs report directly to stdout as formatted JSON. |
| `version` | _none_ | Prints installed DuoScope version. |

---

## 🔬 Diagnostic Rules & Diffs

DuoScope checks against the 4 core failure modes of foldable iOS applications:

### 1. `UIScreen.main.bounds` Dimension Trap (CRITICAL)
> **Problem**: Hardcoded screen queries return rigid dimensions that freeze or distort when unfolding to the 7.6" canvas.

```diff
- let itemWidth = UIScreen.main.bounds.width / 2.0
+ // SwiftUI Fix
+ GeometryReader { geo in
+     let itemWidth = geo.size.width / 2.0
+ }
+ // UIKit Fix
+ let itemWidth = view.bounds.width / 2.0
```

### 2. Central Crease Seam Collision (HIGH)
> **Problem**: Centered buttons or checkout CTAs straddle the physical folding crease ($x = 384\text{pt} \pm 12\text{pt}$), causing touch occlusion and visual cut-offs.

```diff
- purchaseButton.centerXAnchor.constraint(equalTo: view.centerXAnchor).isActive = true
+ purchaseButton.trailingAnchor.constraint(
+     equalTo: view.safeAreaLayoutGuide.trailingAnchor, 
+     constant: -20
+ ).isActive = true
```

### 3. Hardcoded Compact Widths (MEDIUM)
> **Problem**: Rigid single-screen frame widths (`375`, `390`, `414pt`) clip content on 7.6" unfolded canvas.

```diff
- .frame(width: 390, height: 220)
+ .frame(maxWidth: .infinity, minHeight: 220)
```

### 4. Multitasking & Asset Scalability (LOW / INFO)
- Verifies `Info.plist` has `UIRequiresFullScreen = false` to support foldable side-by-side apps.
- Flags raster-only `@1x`/`@2x` assets missing vector or `@3x` representations for 7.6" high-DPI scaling.

---

## 🤖 AI Agent Skill

DuoScope includes a native skill definition in [`.agents/skills/duoscope/SKILL.md`](.agents/skills/duoscope/SKILL.md).

### Installation for Coding Agents

Copy `.agents/skills/duoscope` into your workspace `.agents/skills/` or global root (`~/.gemini/config/skills/duoscope`).

### Prompt Example

```
"Run DuoScope diagnostics on my iOS views, check for fold crease collisions and UIScreen traps, and apply auto-fixes."
```

---

## 🌐 Web Studio & 3D Simulation

The web studio (`apps/web`) features:
- **Interactive 3D Phone Hardware**: 0°–180° continuous hinge angle testing with realistic physical lighting & posture simulation (Handheld, Tabletop, Unfolded Flat).
- **Intake Modes**: Xcode zip archive, Swift file upload, raw code paste, or local path analysis.
- **Side-by-Side Diff Inspector**: Visual before/after code review with 1-click copy.
- **Static Export**: Runs client-side fallback engine on static hosts (GitHub Pages) with zero server requirement.

---

## 🛠️ Monorepo Scripts

```bash
npm run build      # Builds all packages across workspaces
npm run dev:web    # Starts Next.js development server on localhost:3001
npm test           # Executes Jest test suites across workspaces
npm run analyze    # Runs static scanner service against test fixtures
```

---

## 📄 License

MIT © 2026 DuoScope Team
