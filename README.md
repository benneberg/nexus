# Nexus - engineering workspace

> The semantic operating system for autonomous engineering. A full-stack, mobile-first engineering workspace replacing traditional file-centric editing with intent-driven steering, semantic codebase indexing, and multi-brain consensus orchestration.

[![CI](https://github.com/benneberg/nexus/actions/workflows/ci.yml/badge.svg)](https://github.com/benneberg/nexus/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![Bun](https://img.shields.io/badge/Bun-Latest-fbf0d9.svg)](https://bun.sh/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB.svg)](https://react.dev/)

---

## Highlights & Core Architecture

- **Brain & Muscle Bi-Modal Architecture:** High-level AI intent reasoning (The Brain) separated from runtime execution, telemetry, and git operations (The Muscle).
- **Mobile-First Card Deck (PCards):** Triage projects, trigger automated fixes, scaffold systems, and monitor build health via touch-friendly visual card stacks dispatching `INTENT_DISPATCH` over NSP.
- **Common Code Context (CCC) Semantic Indexer & Query Engine:**
  - Workspace symbol parser (`/api/ccc/index`) mapping modules, imports, routes, and services into a structured semantic graph.
  - Semantic query discovery endpoint (`/api/ccc/query`) allowing natural-language and keyword lookups of codebase entities with confidence scoring.
  - Virtualized UI graph inspection (`@tanstack/react-virtual`) handling large repository symbol sets without DOM lag.
- **Nexus Synapse Protocol (NSP) WebSocket Gateway:**
  - Real-time bi-directional connection (`/nsp`) broadcasting telemetry (`NSP_TELEMETRY`), skill registrations (`SKILL_REGISTERED`), and processing incoming steering commands (`INTENT_DISPATCH`, `USER_MESSAGE_RECEIVED`).
  - Automatic HTTP polling fallback (`/api/telemetry`) to ensure uninterrupted telemetry even behind restrictive proxies.
- **Manifest v2 Skill Marketplace:**
  - Discover, install, update, and contribute specialized procedural intelligence modules.
  - Manifest v2 specifications: `permissions` (e.g., `git:read`, `fs:write`), `visual_priority`, `telemetry_mapping`, and `insight_triggers`.
  - Portable `.nsk` (Nexus Skill) package import and export directly from the UI.
  - Disk-persisted skill registry via `skills.json`.
- **Multi-Brain Consensus & Reasoning Engine:**
  - Dynamic model modes: *Flash 3.7* (ultra-low latency), *Deep Reasoning* (high thinking budget), *Multi-Brain Consensus* (parallel multi-agent deliberation & critique), and *Security Auditor* (strict vulnerability review).
  - Server-side consensus synthesis with full reasoning trace inspection in the chat UI.
- **Native Git Engine:**
  - Backend execution pipeline on `/api/git/exec` supporting status, diff, add, commit, push, fetch, and branch checkout.
  - Interactive `GitPanel` with live diff inspection and branch management.
- **Cloud Snapshot Synchronization:**
  - Multi-user workspace synchronization via `/api/workspace/snapshot` backed by server disk storage (`workspace-snapshot.json`).
  - One-click cloud snapshot push and pull in Project Settings.
- **Security & Hardened Rate Limiting:**
  - Gemini API key (`process.env.GEMINI_API_KEY`) is strictly isolated server-side.
  - `express-rate-limit` configured with `app.set('trust proxy', 1)` and custom key generators to prevent quota abuse and eliminate cloud proxy validation errors.
- **Automated Verification:**
  - 100% passing Vitest test suite (21 unit and integration tests across 5 test suites).

---

## Tech Stack

- **Frontend (Brain):** React 19, Vite 6, TypeScript 5.8, Tailwind CSS 4, Zustand 5, Motion, Lucide Icons, @tanstack/react-virtual, Monaco Editor
- **Backend (Muscle):** Node.js 20+, Express 4, WebSocket (`ws`), esbuild
- **AI Integration:** `@google/genai` (Gemini 3.7 Flash with Thinking Budgets)
- **Testing:** Vitest 4, Testing Library React, jsdom

---

## Quick Start

### Installation
```bash
npm install
```

### Development Mode
Boots the Express backend server with Vite middleware on port `3000`:
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

### Unit Tests
Run the Vitest test suite:
```bash
npm run test
```

### Type Checking & Linting
```bash
npm run lint
```

### Production Build
Bundles client static assets to `dist/` and compiles `server.ts` into a single, bundled CommonJS server `dist/server.cjs` via `esbuild`:
```bash
npm run build
```

### Production Start
Launches the standalone compiled CommonJS server on port `3000`:
```bash
npm run start
```

---

## Testing & Verification Summary

The project is fully verified with zero build or lint errors:
- **Build Status:** Passed (`npm run build` generates clean `dist/` bundle)
- **Lint Status:** Passed (`tsc --noEmit` zero type errors)
- **Unit Test Suite:** 21 passed tests across 5 test suites (`store.test.ts`, `components.test.tsx`, `SkillsView.test.tsx`, `cccQueryEngine.test.ts`, `gemini.test.ts`)

---

## Repository Structure

```
├── server.ts                   # Express API routes, WebSocket gateway, Gemini proxy, Git & CCC engines
├── skills.json                 # Persistent server-side Manifest v2 skill registry
├── workspace-snapshot.json     # Persistent server-side workspace state snapshot
├── src/
│   ├── main.tsx                # Client entry point
│   ├── App.tsx                 # Main application layout & WebSocket telemetry handler
│   ├── types.ts                # TypeScript interfaces (Manifest v2, CCC, PCard, NSP)
│   ├── lib/
│   │   ├── db.ts               # Dual-layer IndexedDB and localStorage persistence
│   │   └── gemini.ts           # Client-side API proxy caller
│   ├── store/
│   │   └── useStore.ts         # Central Zustand state store
│   ├── components/
│   │   ├── CCCGraphEditor.tsx  # Interactive visual graph view
│   │   ├── CCCInspector.tsx    # Virtualized semantic graph inspector
│   │   ├── CardDeck.tsx        # Mobile-first PCard deck with NSP Intent Dispatch
│   │   ├── GitPanel.tsx        # Native Git diff, staging, and branch panel
│   │   ├── SkillsView.tsx      # Manifest v2 Marketplace with .nsk import/export
│   │   ├── ProjectSettings.tsx # Cloud snapshot sync & custom template generator
│   │   └── workspace/
│   │       ├── ChatPanel.tsx   # Steering chat with Multi-Brain modes & voice input
│   │       └── ArtifactPanel.tsx # Code & live preview artifact tabber
│   └── __tests__/              # Vitest test suite
├── package.json                # Dependencies, scripts, and test config
├── vite.config.ts              # Vite & Tailwind configuration
├── metadata.json               # Applet configuration metadata
├── ARCHITECTURE.md             # Detailed system architecture specification
├── REPO_STATUS.md              # Current repository readiness and maturity audit
├── OPEN_SPECS.md               # Ecosystem open specifications
└── TODO.md                     # Roadmap and execution tracking
```
