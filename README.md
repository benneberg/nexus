# Nexus - engineering workspace

> The semantic operating system for autonomous engineering. A full-stack, mobile-first engineering workspace replacing traditional file-centric editing with intent-driven steering, semantic codebase indexing, and multi-brain consensus orchestration.

[![CI](https://github.com/benneberg/nexus/actions/workflows/ci.yml/badge.svg)](https://github.com/benneberg/nexus/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![Bun](https://img.shields.io/badge/Bun-Latest-fbf0d9.svg)](https://bun.sh/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB.svg)](https://react.dev/)

---

## What is Nexus?

Nexus is an **AI-native autonomous engineering operating system**. Rather than treating software development as manual file-by-file typing, Nexus models systems at the architectural level. Developers act as Staff Architects—steering autonomous internal agents through high-level goals, visual system cards, and verified semantic graphs.

Nexus operates on a **Bi-Modal Split**:
- **The Brain (Frontend SPA):** Mobile-first orchestration, intent distillation, and gesture-driven system triaging running in React 19.
- **The Muscle (Backend Runtime):** Deterministic execution, telemetry, native Git operations, and codebase indexing running on an Express backend server.

---

## Why It Exists

Traditional IDEs were built decades ago for fixed desktop displays and manual keyboard-driven text editing:
1. **AI as an afterthought:** Conventional editors treat AI as a sidecar autocomplete widget. Nexus treats autonomous agents as primary operators under developer supervision.
2. **Mobility & Ergonomics:** Traditional IDEs are cumbersome on touch or mobile devices. Nexus introduces the **Card Deck (PCards)**—allowing developers to triage build health, approve architectural shifts, and trigger autonomous refactors from anywhere.
3. **Semantic Understanding vs. Token Dumps:** Brute-force file dumping floods model context windows. Nexus integrates **Common Code Context (CCC)**, an indexing runtime that compiles repositories into semantic dependency graphs, allowing precise symbol and route retrieval within strict token budgets.

### Target Users
- **Systems Architects & Lead Engineers:** Directing autonomous agent swarms and triaging repository health across multiple projects.
- **Intent-Driven Prototypers & Founders:** Moving from a product concept to a verified multi-file application scaffold in minutes.
- **AI-First Developers:** Building software with LLMs where manual file tree management and CLI boilerplate are bottlenecks.

---

## Current Capabilities

- **Mobile-First Card Deck (PCards):** Triage systems, monitor build telemetry, review proactive Autonomous Insights, and dispatch steering commands over the Nexus Synapse Protocol.
- **Multi-Brain AI Steering Engine:**
  - Dynamic model modes: *Flash 3.7* (ultra-low latency), *Deep Reasoning* (high thinking budget), *Multi-Brain Consensus* (parallel multi-agent review), and *Security Auditor*.
  - Full multi-agent reasoning trace inspection and thinking process display.
- **Common Code Context (CCC) Semantic Indexer:**
  - Extracts symbols, routes, schemas, and dependencies into structured graphs.
  - Natural-language and symbol query endpoint (`/api/ccc/query`) with confidence scoring.
  - Virtualized UI graph inspection (`@tanstack/react-virtual`) handling large codebases smoothly.
  - Native `ccc-contextcompiler` CLI integration for deterministic compilation into `.llm-context/`.
- **Nexus Synapse Protocol (NSP) Real-Time Gateway:**
  - Low-latency bi-directional WebSocket connection (`/nsp`) streaming system telemetry and processing intent actions.
  - Resilient automatic fallback to HTTP polling (`/api/telemetry`) in restricted proxy environments.
- **Native Git Engine:**
  - Backend execution pipeline (`/api/git/*`) for staging, diff inspection, committing, branch switching, and push/pull synchronization.
  - Visual Git console with interactive file diff previews.
- **Manifest v2 Skill Marketplace:**
  - Discover, install, and contribute specialized procedural intelligence modules with scoped sandbox permissions.
  - Import and export portable `.nsk` (Nexus Skill) bundles.
  - Server disk persistence via `skills.json`.
- **Workspace State Management:**
  - Double-layer client persistence (localStorage + IndexedDB).
  - Cloud snapshot synchronization (`/api/workspace/snapshot`) backed by `workspace-snapshot.json`.
  - One-click custom template generator converting active workspaces into reusable blueprints.
- **Voice Input:** Spoken intent transcription using the Web Speech API directly in the steering interface.

---

## Tech Stack

- **Frontend (Brain):** React 19, Vite 6, TypeScript 5.8, Tailwind CSS 4, Zustand 5, Motion, Lucide Icons, Monaco Editor, @tanstack/react-virtual
- **Backend (Muscle):** Node.js 20+ / Bun, Express 4.21, WebSocket (`ws`), esbuild
- **AI Engine:** `@google/genai` (Gemini 3.7 Flash with thinking budgets)
- **Context Compiler:** Native `ccc-contextcompiler` CLI & in-memory AST scanner
- **Testing:** Vitest 4, React Testing Library, JSDOM

---

## Quick Start

### Installation
```bash
# Clone the repository
git clone https://github.com/benneberg/nexus.git
cd nexus

# Install dependencies using npm (or bun)
npm install
```

### Configuration
Create a `.env` file from the example:
```bash
cp .env.example .env
```
Add your Gemini API key to `.env`:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```
*(Note: If no API key is provided, the application safely operates using deterministic fallback schemas).*

### Running in Development
Start the Express backend with live Vite middleware on port `3000`:
```bash
npm run dev
```
Navigate to `http://localhost:3000` in your browser.

### Production Build & Launch
Compile client static assets and bundle the backend into a standalone CommonJS binary:
```bash
# Build production bundle
npm run build

# Start the standalone server
npm run start
```

---

## User-Facing API Overview

The Express server (`server.ts`) exposes both REST endpoints and a WebSocket stream:

### REST API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Health check endpoint returning server status. |
| `GET` | `/api/telemetry` | HTTP fallback polling for CPU, memory, latency, and uptime. |
| `POST` | `/api/orchestrate` | AI intent orchestration proxy (Gemini 3.7 Flash with consensus modes). |
| `POST` | `/api/ccc/query` | Semantic codebase query (symbols, routes, schemas, dependencies). |
| `POST` | `/api/ccc/compile` | Trigger native CCC context compilation into `.llm-context/`. |
| `GET` | `/api/ccc/doctor` | Diagnostic health check for the CCC context compiler. |
| `GET` | `/api/ccc/artifacts` | Retrieve compiled artifact manifest and token estimates. |
| `GET` / `POST` | `/api/skills/registry` | List installed skills or register a new Manifest v2 skill. |
| `GET` / `POST` | `/api/workspace/snapshot` | Pull or push full workspace state for cloud backup. |
| `GET` | `/api/git/status` | Retrieve repository working tree status and branch info. |
| `GET` | `/api/git/diff` | Retrieve unified diff of modified files. |
| `POST` | `/api/git/stage` | Stage files for commit. |
| `POST` | `/api/git/commit` | Create a Git commit. |
| `POST` | `/api/git/branch` | Switch or create a Git branch. |

### WebSocket Gateway (`/nsp`)
- **Path:** `ws://localhost:3000/nsp`
- **Protocol:** Nexus Synapse Protocol (NSP)
- **Events:** Streams `NSP_TELEMETRY` every 3 seconds; handles client `INTENT_DISPATCH` and `USER_MESSAGE_RECEIVED` events with instant acknowledgments.

---

## Testing & Verification

Nexus maintains an automated test suite executed via Vitest:

```bash
# Run all unit and integration tests
npm run test

# Run TypeScript type verification
npm run lint
```

Continuous integration runs on every push and pull request via GitHub Actions (`.github/workflows/ci.yml`), verifying:
- TypeScript type checking (`tsc --noEmit`)
- Automated test suite (`vitest run`)
- Production bundle generation (`vite build` & `esbuild`)

---

## Repository Structure

```
├── server.ts                   # Express API routes, WebSocket gateway, Gemini proxy, Git & CCC engines
├── skills.json                 # Persistent server-side Manifest v2 skill registry
├── workspace-snapshot.json     # Persistent server-side workspace state snapshot
├── src/
│   ├── main.tsx                # Client entry point
│   ├── App.tsx                 # Main layout shell & NSP WebSocket telemetry handler
│   ├── types.ts                # TypeScript interfaces (Manifest v2, CCC, PCard, NSP)
│   ├── lib/
│   │   ├── db.ts               # Dual-layer IndexedDB and localStorage persistence
│   │   └── gemini.ts           # Client-side API proxy caller
│   ├── store/
│   │   └── useStore.ts         # Central Zustand state store
│   ├── components/
│   │   ├── CCCGraphEditor.tsx  # Interactive visual node-edge graph editor
│   │   ├── CCCInspector.tsx    # Virtualized semantic graph inspector
│   │   ├── CardDeck.tsx        # Mobile-first PCard deck with NSP Intent Dispatch
│   │   ├── GitPanel.tsx        # Native Git diff, staging, and branch panel
│   │   ├── SkillsView.tsx      # Manifest v2 Marketplace with .nsk import/export
│   │   ├── ProjectSettings.tsx # Cloud snapshot sync & custom template generator
│   │   └── workspace/
│   │       ├── ChatPanel.tsx   # Steering chat with Multi-Brain modes & voice input
│   │       └── ArtifactPanel.tsx # Code & live preview artifact tabber
│   └── __tests__/              # Vitest test suite (21 unit & integration tests)
├── .llm-context/               # Compiled CCC context artifacts and agent guides
│   ├── context.md              # Invariant rules and instructions for coding agents
│   └── context-manifest.json   # Token budgets and task recommendations
├── ARCHITECTURE.md             # Authoritative technical design & system specification
├── CONTRIBUTING.md             # Developer workflow, commands, and skill authoring guide
├── SECURITY.md                 # Security policy, threat model, and vulnerability reporting
└── package.json                # Dependencies, npm scripts, and metadata
```

---

## Authoritative Documentation

- **System Architecture & Design:** See [`ARCHITECTURE.md`](./ARCHITECTURE.md)
- **Contributing & Skill Authoring:** See [`CONTRIBUTING.md`](./CONTRIBUTING.md)
- **Security Policy:** See [`SECURITY.md`](./SECURITY.md)
- **AI Agent Context:** See [`.llm-context/context.md`](./.llm-context/context.md)
