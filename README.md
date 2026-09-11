# DuoScope 📱⚡

<div align="center">

**The Automated Diagnostics, 3D Simulation & Continuity Suite for Foldable iOS Apps**  
*Built for iPhone Duo (5.4" Compact Cover $\leftrightarrow$ 7.6" Expanded Canvas)*

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/Node.js-%3E%3D18.0.0-339933.svg?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4+-3178C6.svg?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14.2-black.svg?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Form Factor](https://img.shields.io/badge/Hardware-iPhone%20Duo-0071E3.svg?style=flat-square&logo=apple&logoColor=white)](https://apple.com)

[**Live Demo (GitHub Pages)**](https://prathamxeth.github.io/duoscope/) • [**CLI Documentation**](#-cli-reference) • [**AI Agent Skill**](#-ai-agent-skill-integration) • [**Rule Engine**](#-diagnostic-rule-engine)

</div>

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Architecture](#-architecture)
- [Quick Start & Cloning](#-quick-start--cloning)
- [CLI Reference](#-cli-reference)
- [AI Agent Skill Integration](#-ai-agent-skill-integration)
- [Diagnostic Rule Engine](#-diagnostic-rule-engine)
- [Project Structure](#-project-structure)
- [Development & Scripts](#-development--scripts)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**DuoScope** provides the essential developer tooling required to build, audit, and patch Swift and SwiftUI applications for dual-screen and foldable form factors. It combines a **headless AST analyzer CLI**, an **interactive 3D Web Studio**, and an **AI Agent Skill** to eliminate layout traps, resolve physical crease collisions, and profile continuity performance.

```
+-------------------------------------------------------------------------+
|                                DUOSCOPE                                 |
+--------------------+---------------------+------------------------------+
|   🤖 AI Agent      |   💻 Headless CLI   |   🌐 Web Studio & 3D Sim     |
|   Skill Interface  |   npx duoscope      |   Next.js + WebGL Physics    |
+--------------------+---------------------+------------------------------+
```

---

## ✨ Key Features

- 📐 **Crease Collision Safety**: Identifies interactive controls, buttons, and checkout flows straddling the central hinge ($x = 384\text{pt} \pm 12\text{pt}$) and re-anchors them with fold-safe padding.
- 🚫 **UIScreen Trap Buster**: Automatically flags and refactors legacy `UIScreen.main.bounds` references to dynamic view-hierarchy containers (`GeometryReader`, `view.bounds`).
- 🔄 **3D Phone Physics Simulator**: Spin, tilt, and bend the simulated hardware from 0° (folded) to 180° (flat canvas) with real-time UI adaptation.
- ⚡ **Automated AST Auto-Patching**: Execute one-click or CLI-based remediation to produce clean git diffs directly into your Xcode projects.
- 🤖 **Native AI Agent Skill**: Drop-in `.agents/skills/duoscope` workflow for AI coding assistants (Antigravity, Cursor, Claude Code) to autonomously diagnose and fix foldable iOS codebases.

---

## 🚀 Quick Start & Cloning

### 1. Clone the Repository

Choose your preferred git method:

```bash
# Via GitHub CLI (Recommended)
gh repo clone prathamxeth/duoscope

# Via HTTPS
git clone https://github.com/prathamxeth/duoscope.git

# Via SSH
git clone git@github.com:prathamxeth/duoscope.git

# Navigate into the project
cd duoscope
```

### 2. Install Dependencies

```bash
# Install root monorepo & package workspaces
npm install
```

### 3. Build & Run the Web Studio

```bash
# Build all internal packages (@foldlens/core-types, @foldlens/analyzer)
npm run build

# Start the interactive Next.js developer studio
npm run dev:web
```

The Web Studio will be running at **`http://localhost:3000`** (or `http://localhost:3001`).

---

## 💻 CLI Reference

DuoScope ships with a standalone CLI engine in `packages/cli` that can be run directly via `npx`:

### Installation & Run

```bash
# Audit a single Swift source file
npx duoscope audit ./Sources/Views/ProductDetailView.swift

# Audit an entire Xcode workspace or directory
npx duoscope audit ./ios-app

# Audit and automatically apply safe layout fixes
npx duoscope audit ./ios-app --fix

# Output diagnostic results as structured JSON for CI/CD
npx duoscope audit ./ios-app --json > duoscope-report.json
```

### CLI Command Options

| Flag | Description |
|---|---|
| `audit <path>` | Scans file or directory for foldable layout traps and hinge violations. |
| `--fix` | Automatically rewrites source files with non-destructive code patches. |
| `--json` | Formats output as machine-readable JSON for CI/CD status checks. |
| `version` | Displays current DuoScope engine version. |
| `--help` | Displays command documentation and usage examples. |

---

## 🤖 AI Agent Skill Integration

DuoScope includes a standardized AI Agent Skill located at [`.agents/skills/duoscope/SKILL.md`](.agents/skills/duoscope/SKILL.md).

### Using with AI Coding Assistants

Copy the skill to your project's `.agents/skills/` directory or global customizations root (`~/.gemini/config/skills/duoscope`):

```bash
# Verify skill presence
ls -la .agents/skills/duoscope/SKILL.md
```

### Prompting AI Agents

When working with an AI assistant in your iOS repository, trigger DuoScope with:

> *"Audit this SwiftUI view for iPhone Duo dual-screen continuity and apply safe fold layout fixes using the DuoScope skill."*

The agent will parse view ASTs, detect crease seam hazards, and generate validated patches following Apple Human Interface Guidelines for foldable form factors.

---

## 🔬 Diagnostic Rule Engine

DuoScope tests against 4 primary categories of dual-screen and foldable defects:

### 1. Fixed Screen Dimension Traps (`UIScreen.main.bounds`)

```diff
- let itemWidth = UIScreen.main.bounds.width / 2.0
+ let itemWidth = view.bounds.width / 2.0
```

### 2. Crease Seam Collisions ($x = 384\text{pt}$)

```diff
- purchaseButton.centerXAnchor.constraint(equalTo: view.centerXAnchor).isActive = true
+ purchaseButton.trailingAnchor.constraint(equalTo: view.safeAreaLayoutGuide.trailingAnchor, constant: -20).isActive = true
```

### 3. Hardcoded Compact Widths

```diff
- .frame(width: 390, height: 200)
+ .frame(maxWidth: .infinity, minHeight: 200)
```

### 4. Plist & Multi-Window Readiness

Audits `Info.plist` to ensure:
- `UIDeviceFamily` supports iPad/Universal (`2`).
- `UIRequiresFullScreen` is set to `false` (allowing dynamic window resizing).
- Asset catalogs contain vector/`@3x` high-density assets for 7.6" canvas expansion.

---

## 📂 Project Structure

```
duoscope/
├── .agents/
│   └── skills/
│       └── duoscope/            # 🤖 AI Agent Skill definition (SKILL.md)
├── apps/
│   └── web/                     # 🌐 Next.js Web Studio & 3D Simulator
│       ├── public/              # Favicons, Web App Manifest, Static Assets
│       └── src/
│           ├── app/             # Next.js App Router (Layout & API routes)
│           ├── components/      # 3D Phone Simulator, Issue Ledger, Diff Inspector
│           ├── context/         # Wizard & Navigation State Engine
│           └── utils/           # Metadata Extractor (.ipa, .plist, Swift)
├── packages/
│   ├── cli/                     # 💻 Standalone Node.js CLI executable (duoscope.js)
│   └── core-types/              # 📦 Shared TypeScript interfaces & report schemas
├── services/
│   └── analyzer/                # ⚙️ Static AST analysis engine & heuristic rules
├── package.json                 # Monorepo Workspace Configuration
└── tsconfig.base.json           # Base TypeScript Configuration
```

---

## 🛠️ Development & Scripts

| Command | Description |
|---|---|
| `npm run dev:web` | Starts Next.js development server for the Web Studio (`localhost:3001`). |
| `npm run build` | Builds all packages across workspaces. |
| `npm run analyze` | Runs static analyzer service against test fixtures. |
| `npm test` | Runs Jest unit tests across packages. |
| `npx tsc --noEmit` | Runs full typecheck across workspace without emitting JS. |

---

## 🤝 Contributing

Contributions, bug reports, and rule improvements are welcome!

1. **Fork the Repository**
2. **Create a Feature Branch**: `git checkout -b feat/new-crease-rule`
3. **Commit Your Changes**: `git commit -m 'feat: add adaptive split view rule'`
4. **Push to the Branch**: `git push origin feat/new-crease-rule`
5. **Open a Pull Request**

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for more information.

<div align="center">
<sub>Crafted with precision for next-generation foldable hardware by the <b>DuoScope Team</b>.</sub>
</div>
