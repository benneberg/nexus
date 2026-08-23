# Nexus

**The AI-Native Autonomous Engineering Operating System.**

Nexus is a full-stack, mobile-first engineering workspace designed for intent-driven software development. It replaces traditional file-centric editing with a high-level **steering interface** backed by semantic codebase indexing (CCC), real-time telemetry, and server-side Gemini AI orchestration.

---

## ✨ Highlights & Key Features

- **Brain & Muscle Bi-Modal Architecture:** High-level AI intent reasoning (The Brain) separated from runtime execution, telemetry, and git operations (The Muscle).
- **Mobile-First Card Deck (PCards):** Triage projects and monitor build health via touch-friendly visual card stacks.
- **Common Code Context (CCC) Semantic Indexer:** Server-side workspace symbol parser (`/api/ccc/index`) with virtualized UI graph inspection (`@tanstack/react-virtual`).
- **NSP Telemetry Stream:** Dual-mode real-time WebSocket connection (`/nsp`) broadcasting system health metrics with automatic HTTP polling fallback (`/api/telemetry`).
- **Skill Marketplace:** Discover, install, and contribute specialized neural capabilities connected to a persistent server-side registry (`/api/skills/registry` via `skills.json`).
- **Custom Template Engine:** Turn any active workspace into a reusable template scaffold with one click.
- **Voice-to-Intent Speech Engine:** Client-side Web Speech API integration for direct voice command streaming.
- **Secure Server-Side AI:** Gemini API calls are securely proxied in `server.ts` to keep secrets hidden from the browser, protected by `express-rate-limit` to prevent quota exhaustion.
- **Automated Test Suite:** Comprehensive Vitest unit test suite validating store logic, workspace components, SkillsView, and API integration.

---

## 🛠️ Tech Stack

- **Frontend:** React 19, Vite 6, TypeScript 5.8, Tailwind CSS 4, Zustand 5, Motion, Lucide Icons, @tanstack/react-virtual
- **Backend:** Node.js, Express 4, WebSocket (`ws`), esbuild
- **AI Integration:** `@google/genai` (Gemini 2.5 Flash)
- **Testing:** Vitest 4, Testing Library React, jsdom

---

## ⚡ Quick Start

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
Bundles client static assets to `dist/` and compiles `server.ts` into `dist/server.cjs` via `esbuild`:
```bash
npm run build
```

### Production Start
Launches the standalone compiled CommonJS server on port `3000`:
```bash
npm run start
```

---

## 🧪 Testing & Verification Summary

The project is fully verified with zero build or lint errors:
- **Build Status:** Passed (`npm run build` generates clean `dist/` bundle)
- **Lint Status:** Passed (`tsc --noEmit` zero type errors)
- **Unit Test Suite:** 21 passed tests across 5 test suites (`store.test.ts`, `components.test.tsx`, `SkillsView.test.tsx`, `cccQueryEngine.test.ts`, `gemini.test.ts`)

---

## 📁 Repository Structure

```
├── server.ts                   # Express API routes, WebSocket gateway, Gemini proxy
├── src/
│   ├── main.tsx                # Client entry point
│   ├── App.tsx                 # Main application layout & WebSocket telemetry handler
│   ├── types.ts                # TypeScript interface and type definitions
│   ├── lib/
│   │   └── db.ts               # Dual-layer IndexedDB and localStorage persistence
│   ├── store/
│   │   └── useStore.ts         # Central Zustand state store
│   ├── components/
│   │   ├── CCCInspector.tsx    # Virtualized semantic graph inspector
│   │   ├── SkillsView.tsx      # Marketplace and skill registry view
│   │   ├── ProjectSettings.tsx # Settings and custom template generator
│   │   └── workspace/
│   │       ├── ChatPanel.tsx   # Steering chat with voice command support
│   │       └── ArtifactPanel.tsx # Code & live preview artifact tabber
│   └── __tests__/              # Vitest test suite
├── package.json                # Dependencies, scripts, and test config
├── vite.config.ts              # Vite & Tailwind configuration
└── metadata.json               # Applet configuration metadata
```
