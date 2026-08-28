# TODO.md — Nexus Execution Roadmap

**Repository Status:** Operational Core / Advanced Prototype (Phases 1-4 Complete ✅)  
**Verification:** All 21 Vitest unit & integration tests passing (`npm test`), 0 TypeScript lint errors (`npm run lint`), production build verified (`npm run build`). Server-side Gemini 3.7 Flash proxy, rate limiting with `trust proxy: 1`, Native Git runner, NSP WebSocket gateway with `INTENT_DISPATCH`, and Manifest v2 skill registry fully active.

---

# Phase 1 - Core Foundations (Completed ✅)

- [x] **[CORE] Full-Stack Express & Vite Server Setup**  
  Priority: P0 | Impact: High | Status: Done  
  Configured Express server on `0.0.0.0:3000` with Vite middleware in development and single-bundle `dist/server.cjs` via `esbuild` in production.

- [x] **[AI] Server-Side Gemini API Proxy**  
  Priority: P0 | Impact: High | Status: Done  
  Proxied Gemini API requests on `/api/orchestrate` in `server.ts` to keep `GEMINI_API_KEY` hidden from client browsers.

- [x] **[CCC] Common Code Context Symbol Indexer**  
  Priority: P0 | Impact: High | Status: Done  
  Built `/api/ccc/index` workspace parser to extract exported symbols, imports, and relationships into a deterministic graph.

- [x] **[STORE] Zustand Persistence & State Engine**  
  Priority: P0 | Impact: High | Status: Done  
  Implemented double-layer persistence via `localStorage` and `IndexedDB` in `src/store/useStore.ts` and `src/lib/db.ts`.

- [x] **[TESTS] Vitest Unit Test Suite**  
  Priority: P0 | Impact: High | Status: Done  
  Added Vitest test runner with React Testing Library to test store operations, ChatPanel components, and Gemini response parsing.

---

# Phase 2 - Real-Time Protocols & Mobile UI (Completed ✅)

- [x] **[REALTIME] NSP WebSocket Gateway & Telemetry Fallback**  
  Priority: P1 | Impact: High | Status: Done  
  Hosted `/nsp` WebSocket gateway on Express HTTP server with automatic `/api/telemetry` HTTP polling fallback in `App.tsx`.

- [x] **[PERFORMANCE] Virtualized CCC Inspector List Rendering**  
  Priority: P1 | Impact: High | Status: Done  
  Integrated `@tanstack/react-virtual` in `CCCInspector.tsx` to handle large repository symbol lists without DOM lag.

- [x] **[TEMPLATES] One-Click Custom Template Generator**  
  Priority: P1 | Impact: Medium | Status: Done  
  Added `saveAsTemplate` in store and `ProjectSettings.tsx` to turn active project files into reusable scaffold templates.

- [x] **[SKILLS] Live Skill Marketplace Registry**  
  Priority: P1 | Impact: High | Status: Done  
  Connected `SkillsView.tsx` to server `/api/skills/registry` endpoint for instant installation, listing, and contribution.

- [x] **[MULTIMODAL] Web Speech API Voice Input**  
  Priority: P2 | Impact: Medium | Status: Done  
  Implemented voice transcription in `ChatPanel.tsx` to stream spoken commands as steering prompts.

---

# Phase 3 - Security, Manifest v2 & Protocol Hardening (Completed ✅)

- [x] **[PERSISTENCE] Server Skill Registry File Backing**  
  Priority: P2 | Impact: Medium | Status: Done  
  Persisted contributed skills in `server.ts` to `skills.json` on disk so custom skills survive container restarts.

- [x] **[SECURITY] Rate Limiting & Proxy Ingress Resolution**  
  Priority: P2 | Impact: High | Status: Done  
  Configured `app.set('trust proxy', 1)` and custom key generators for `express-rate-limit` to handle `X-Forwarded-For` and `Forwarded` headers without validation conflicts.

- [x] **[MANIFEST V2] Skill Ecosystem Schema & Package Format**  
  Priority: P2 | Impact: High | Status: Done  
  Implemented Manifest v2 in `skills.json` and server endpoints with `permissions` (sandbox scoping), `visual_priority`, `telemetry_mapping`, and `insight_triggers`. Added portable `.nsk` package export/import in `SkillsView.tsx`.

- [x] **[TESTS] Expanded Unit and Integration Test Coverage**  
  Priority: P2 | Impact: Medium | Status: Done  
  Added tests for `SkillsView`, `cccQueryEngine`, and component interactions (21 tests passing).

---

# Phase 4 - Advanced Engines & Tooling (Completed ✅)

- [x] **[CLOUD] Workspace Snapshot Synchronization**  
  Priority: P3 | Impact: High | Status: Done  
  Multi-user workspace synchronization via `/api/workspace/snapshot` backend endpoint with disk persistence (`workspace-snapshot.json`) and local JSON export/import in `ProjectSettings.tsx`.

- [x] **[GIT] Native Git Integration**  
  Priority: P3 | Impact: High | Status: Done  
  Full backend execution engine on `/api/git/exec` supporting status, diff, add, commit, reset, push, fetch, log, and checkout. Interactive `GitPanel.tsx` UI with file diff inspection and branch switcher.

- [x] **[ORCHESTRATION] Multi-Brain LLM Models & Consensus Distillation**  
  Priority: P3 | Impact: Medium | Status: Done  
  Implemented dynamic model modes (*Flash 3.7*, *Deep Reasoning*, *Multi-Brain Consensus*, *Security Auditor*) with thinking budgets, server-side consensus orchestration, and interactive multi-brain trace inspection.

- [x] **[NSP] CardDeck Intent Dispatch Integration**  
  Priority: P3 | Impact: High | Status: Done  
  Wired "Deploy Fix", "Scaffold", and "Steer Card" actions in `CardDeck.tsx` to dispatch `INTENT_DISPATCH` events over the `/nsp` WebSocket connection with real-time server acknowledgment.

---

# Phase 5 - Future Horizons (Open Ecosystem Alignment)

- [ ] **[PARSER] Deep AST Parsing Engine (Tree-sitter / TS Compiler API)**  
  Priority: P2 | Impact: High | Effort: M  
  *Objective:* Upgrade `/api/ccc/index` from regex/line scanning to full TypeScript AST extraction for type definitions, call-hierarchy graphs, and interface references.

- [ ] **[SANDBOX] Ephemeral Execution Container Nodes**  
  Priority: P2 | Impact: High | Effort: L  
  *Objective:* Isolate the "Muscle" runtime into ephemeral sandboxed execution containers (e.g. WebAssembly or secure container runners) for running untrusted generated code safely.

- [ ] **[OBSERVABILITY] Live OS & Process Telemetry Pipeline**  
  Priority: P3 | Impact: Medium | Effort: S  
  *Objective:* Connect `/api/telemetry` and `/nsp` to real Node.js runtime stats (`process.cpuUsage()`, `process.memoryUsage()`, event loop lag) to drive live dashboard gauges.

- [ ] **[COLLABORATION] Real-Time Multi-Operator Room Presence**  
  Priority: P3 | Impact: Medium | Effort: M  
  *Objective:* Add WebSocket room management so multiple operators can steer the same workspace concurrently with live cursor and intent sharing.

- [ ] **[CONSOLE] In-App Automated Test Runner Console**  
  Priority: P3 | Impact: Medium | Effort: S  
  *Objective:* Provide a one-click "Run Test Suite" button in the Workspace UI that executes `vitest run` on the server and displays interactive test reports.  
