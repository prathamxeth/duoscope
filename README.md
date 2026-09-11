# DuoScope 📱⚡

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4+-3178C6.svg?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14.2-black.svg?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Hardware Target](https://img.shields.io/badge/Hardware-iPhone%20Duo%20(5.4%22%20%E2%86%94%207.6%22)-0071E3.svg?style=flat-square&logo=apple&logoColor=white)](https://apple.com)

Automated diagnostics, 3D hardware simulation, and continuity remediation engine for foldable iOS applications (**iPhone Duo: 5.4" cover display $\leftrightarrow$ 7.6" unfolded canvas**).

[**🌐 Live Website & 3D Studio**](https://prathamxeth.github.io/duoscope/)

---

## 🌐 Website & 3D Studio

The **DuoScope Web Studio** ([`apps/web`](apps/web)) provides an interactive visual environment for auditing iOS applications against dual-screen form factors:

- **Interactive 3D Phone Hardware**: Continuous 0°–180° hinge angle testing with real-time physical lighting and posture states (Handheld, Tabletop, Unfolded Flat).
- **Fold Crease Safe Zone Visualizer**: Real-time overlay identifying UI components and action buttons crossing the central folding seam ($x = 384\text{pt} \pm 12\text{pt}$).
- **Automated Intake & AST Diff Inspector**: Upload Xcode source packages, paste Swift/SwiftUI code, and inspect side-by-side remediation patches with one-click copy.
- **Client-Side Static Engine**: Fully functional on static hosting environments (GitHub Pages) via built-in in-browser AST parsing fallback.

---

## 🤖 AI Agent Skill

DuoScope includes a native, production-grade AI Agent Skill located at [`.agents/skills/duoscope/SKILL.md`](.agents/skills/duoscope/SKILL.md).

### Capabilities
- **`UIScreen.main.bounds` Trap Elimination**: Flags static screen dimension calls and generates dynamic `GeometryReader` / `view.bounds` replacements.
- **Crease Collision Protection**: Re-anchors buttons, checkout CTAs, and interactive elements away from the $x = 384\text{pt}$ physical hinge seam.
- **Responsive Width Refactoring**: Converts hardcoded single-screen frame widths (`375`, `390`, `414pt`) to adaptive container layouts.
- **Info.plist & Multi-Window Readiness**: Verifies multitasking support (`UIRequiresFullScreen = false`) and high-density `@3x`/vector asset scaling.

### Usage with AI Assistants
Add `.agents/skills/duoscope` to your project and prompt any AI coding assistant:
> *"Audit this iOS project for iPhone Duo dual-screen continuity and apply safe fold layout fixes using the DuoScope skill."*

---

## 🛠️ Technology Stack

- **Web Frontend**: [Next.js 14](https://nextjs.org/) (App Router), [React 18](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/)
- **Design System**: Apple Liquid Glass, Pure OLED Dark Mode (`#000000`), `Instrument Serif`, `Barlow`, and `JetBrains Mono` typography
- **3D Graphics & Physics**: CSS 3D matrix transform hardware rendering with multi-angle posture simulation
- **Analysis Core**: TypeScript AST pattern parser, regex heuristic scanner, and Info.plist / `.xcassets` validators
- **Deployment**: [GitHub Pages](https://pages.github.com/) via automated [GitHub Actions CI/CD](.github/workflows/deploy.yml)

---

## 📄 License

This project is licensed under the **MIT License** — see the [`LICENSE`](LICENSE) file for details.

© 2026 DuoScope Team
