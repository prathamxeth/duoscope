# DuoScope 📱⚡

> **Precision Dual-Screen iOS Continuity Diagnostics, 3D Physics Simulation & Automated Layout Patching**  
> Tailored for foldable iOS form factors (**iPhone Duo 5.4" Compact Cover $\leftrightarrow$ 7.6" Expanded Inner Canvas**).

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4+-3178C6.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14.2-black.svg?logo=next.js&logoColor=white)](https://nextjs.org/)
[![Platform](https://img.shields.io/badge/Form%20Factor-iPhone%20Duo%205.4%22%20%E2%86%94%207.6%22-0071E3.svg)](https://apple.com)

---

## 🌟 Overview

**DuoScope** is a comprehensive, production-grade diagnostic and simulation suite engineered to help iOS developers transition their apps seamlessly to dual-screen and foldable hardware. It detects layout traps, prevents UI element collisions with physical fold seams, profiles continuity hitches, and generates ready-to-apply Swift and SwiftUI remediations.

DuoScope operates through three unified modalities:
1. 🤖 **AI Agent Skill**: Automated diagnostic workflow for AI coding agents (`.agents/skills/duoscope`).
2. 🌐 **Interactive Web Audit Studio & 3D Simulator**: Real-time 3D foldable iPhone physics engine, fold line hazard visualizer, and side-by-side diff inspector (`apps/web`).
3. 💻 **Headless CLI Tool**: Fast command-line static analyzer and AST auto-patcher for local dev and CI/CD pipelines (`packages/cli`).

---

## 🧩 3-in-1 Architecture

```
duoscope/
├── .agents/skills/duoscope/    # 🤖 AI Agent Skill definition (SKILL.md)
├── packages/
│   ├── cli/                    # 💻 DuoScope CLI executable (npx duoscope audit)
│   └── core-types/             # 📦 Shared TypeScript data contracts & schemas
├── services/
│   └── analyzer/               # ⚙️ Static AST analysis engine & heuristic rules
└── apps/
    └── web/                    # 🌐 Next.js Web App with 3D Phone Physics & Audit Studio
```

---

## 🎯 The 4 Core Traps DuoScope Solves

| Hazard | Problem | DuoScope Solution |
|---|---|---|
| **`UIScreen.main.bounds` Trap** | Screen dimensions change when folding/unfolding, causing frozen or distorted views. | Rewrites fixed `UIScreen.main.bounds` to responsive `view.bounds` or `GeometryReader`. |
| **Physical Crease Collision** | Interactive buttons or checkout actions fall on the central hinge seam ($x = 384\text{pt} \pm 12\text{pt}$). | Re-anchors buttons with fold-safe padding (`safeAreaLayoutGuide`). |
| **Hardcoded Width Constraints** | Fixed single-screen widths (`375`, `390`, `414pt`) prevent responsive expansion. | Converts rigid frames to flexible `.frame(maxWidth: .infinity)` or Adaptive Stacks. |
| **Continuity Hitching & Glitches** | Unoptimized subview passes cause lag (>16ms dropped frames) during device posture change. | Measures transition timing and identifies expensive layout passes during rotation/folding. |

---

## 🚀 Quick Start

### 1. Run the Web Dashboard & 3D Simulator

```bash
# Install dependencies
npm install

# Build workspace packages
npm run build

# Launch the Next.js Web Studio
npm run dev:web
```
Open [http://localhost:3000](http://localhost:3000) (or `http://localhost:3001`) in your browser.

---

### 2. Use the Headless CLI

Run static analysis directly on any Swift file or Xcode repository:

```bash
# Scan a specific Swift file or directory
npx duoscope audit ./ios/Sources/Views/ProductView.swift

# Scan and automatically apply recommended Swift layout fixes
npx duoscope audit ./ios/Sources --fix

# Output diagnostic report as JSON for CI/CD integrations
npx duoscope audit ./ios --json
```

---

### 3. Integrate with AI Coding Assistants

DuoScope includes a built-in agent skill in `.agents/skills/duoscope/SKILL.md`.

Whenever you are working with an AI coding assistant, simply prompt:
```
"Audit my iOS project for iPhone Duo dual-screen continuity and apply safe fold layout fixes using DuoScope."
```

---

## 🛠️ Technology Stack

- **Frontend**: Next.js 14 (App Router), React 18, Tailwind CSS, Lucide Icons.
- **Design System**: Apple-grade Liquid Glass, Pure OLED Dark Mode (`#000000`), `Instrument Serif` & `Barlow` typography.
- **Analysis Engine**: Node.js AST static analyzer, Regex token parser, and Plist validator.
- **3D Simulator**: Interactive real-time CSS 3D matrix transform phone simulation with 0°–180° continuous hinge bend dynamics.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.
