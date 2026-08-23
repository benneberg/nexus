# ARCHITECTURE.md

## 1. SYSTEM ARCHITECTURE OVERVIEW

Nexus is structured as a full-stack, bi-modal application combining a Node.js/Express server with a Vite-powered React 19 single-page application.

```
┌──────────────────────────────────────────────────────────────────────────┐
│                             CLIENT LAYER                                 │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │                     React 19 SPA (Vite + Tailwind)                 │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌───────────┐  ┌───────────┐ │  │
│  │  │ ChatPanel    │  │ CCCInspector │  │ CardDeck  │  │ SkillsView│ │  │
│  │  └──────────────┘  └──────────────┘  └───────────┘  └───────────┘ │  │
│  └──────────────────────────────────┬─────────────────────────────────┘  │
│                                     │                                    │
│                    Zustand Store (useStore.ts)                           │
│              (localStorage + IndexedDB Persistence)                      │
└─────────────────────────────────────┬────────────────────────────────────┘
                                      │ HTTP / WebSocket (Port 3000)
┌─────────────────────────────────────▼────────────────────────────────────┐
│                             SERVER LAYER                                 │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │                  Node.js Express Server (server.ts)                 │  │
│  │  ┌─────────────────┐  ┌──────────────────┐  ┌───────────────────┐  │  │
│  │  │ /api/orchestrate│  │ /api/ccc/index   │  │ /api/skills/reg.  │  │  │
│  │  └────────┬────────┘  └──────────────────┘  └───────────────────┘  │  │
│  │           │                                                        │  │
│  │  ┌────────▼────────────────┐        ┌───────────────────────────┐  │  │
│  │  │ Google GenAI SDK        │        │ NSP WebSocket Gateway     │  │  │
│  │  │ (@google/genai)         │        │ (path: /nsp) + Telemetry  │  │  │
│  │  └─────────────────────────┘        └───────────────────────────┘  │  │
│  └────────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 2. MAJOR COMPONENTS & RESPONSIBILITIES

### Server Layer (`server.ts`)
- **Express HTTP API Router:** Serves static frontend assets in production and routes API endpoints (`/api/orchestrate`, `/api/ccc/index`, `/api/skills/registry`, `/api/telemetry`).
- **Security & Rate Limiting:** Mounts `express-rate-limit` middleware on critical AI and search routes to prevent quota exhaustion and API abuse.
- **Gemini Proxy Engine:** Securely initializes `@google/genai` using `process.env.GEMINI_API_KEY`. It processes natural language steering prompts, structures JSON responses, and returns architectural summaries, steps, and generated code artifacts to the client without exposing keys.
- **NSP Telemetry WebSocket Gateway:** Hosts a WebSocket server (`/nsp`) that broadcasts system health metrics and real-time skill registration events.
- **CCC Semantic Indexer (`/api/ccc/index`):** Parses the server workspace filesystem to build a deterministic Common Code Context symbol graph for visual inspection.
- **Persistent Skill Registry:** Maintains a JSON file-backed (`skills.json`) state for custom skill installations and definitions.

### Client Layer (`src/`)
- **Zustand State Engine (`src/store/useStore.ts`):** Manages global state across projects, active views, artifacts, messages, skills, custom templates, and telemetry. Features double-layer persistence via `localStorage` and `IndexedDB`.
- **ChatPanel (`src/components/workspace/ChatPanel.tsx`):** Renders orchestration chat, step breakdowns, and voice input via browser Web Speech API.
- **CCCInspector (`src/components/CCCInspector.tsx`):** Renders semantic codebase graph nodes with row virtualization powered by `@tanstack/react-virtual` for fluid rendering of large symbol sets.
- **SkillsView (`src/components/SkillsView.tsx`):** Marketplace for browsing, installing, and contributing custom skill modules to the server registry.
- **ProjectSettings (`src/components/ProjectSettings.tsx`):** Workspace management panel including the Custom Template engine that saves active project files as reusable scaffolds.

---

## 3. DATA FLOW & SEQUENCE

1. **User Steering Intent:**
   - User inputs natural language or uses Web Speech voice transcription in `ChatPanel`.
   - Client sends HTTP POST to `/api/orchestrate`.
   - Server delegates to Gemini SDK (`gemini-2.5-flash`), formats response into structured JSON, and returns artifacts.
   - Client store updates messages and artifacts, auto-saving to local persistence.

2. **Real-time Telemetry & Fallback:**
   - On launch, `App.tsx` opens WebSocket connection to `ws://<host>/nsp`.
   - Server streams `NSP_TELEMETRY` events every 3 seconds.
   - If WebSocket connection fails or is blocked by sandbox proxying, client automatically falls back to HTTP polling via `/api/telemetry` every 5 seconds.

3. **Semantic Indexing:**
   - Client calls `/api/ccc/index`.
   - Server traverses `src/` directory, extracts exported symbols, imports, and relationships, returning a structured CCC IR payload.
   - `CCCInspector` visualizes nodes using list virtualization.

---

## 4. DESIGN PATTERNS & PRINCIPLES

- **API Key Isolation:** Secrets are kept strictly server-side in `server.ts`. Client never accesses or exposes raw API keys.
- **Single External Port (Port 3000):** Express binds to host `0.0.0.0` on port `3000`. WebSocket gateway mounts on the same HTTP server (`/nsp`).
- **Bundled Single Binary Server Output:** Production build uses `esbuild` to compile `server.ts` into a CommonJS binary (`dist/server.cjs`) with externalized dependencies, minimizing cold-start times and eliminating ESM resolution ambiguities in production containers.
- **Double-Layer Persistence:** State syncs synchronously to `localStorage` and asynchronously backs up to `IndexedDB` (`src/lib/db.ts`).

---

## 5. ARCHITECTURAL RISKS & MITIGATIONS

| Risk | Impact | Mitigation Strategy |
| :--- | :--- | :--- |
| **WebSocket Connection Drops** | Telemetry stream interruption | Automatic fallback to HTTP `/api/telemetry` polling in `App.tsx`. |
| **Missing GEMINI_API_KEY** | Orchestration failure | Server-side fallback heuristics return structured mock responses with explicit warnings when API key is unconfigured. |
| **API Quota Exhaustion** | Backend service interruption | Application of `express-rate-limit` on orchestration API routes. |
| **Large Symbol Graph Bloat** | DOM lag during codebase inspection | `@tanstack/react-virtual` virtualized rendering limits DOM nodes in `CCCInspector.tsx`. |
