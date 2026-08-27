# TODO.md — Nexus Execution Roadmap

**Repository Status:** Production-Ready (Phase 1-4 Complete ✅)  
**Estimated Completion Level:** 100% (All Roadmap Milestones Achieved)  
**Verification:** All Vitest test suites passing, server rate limiter configured with trust proxy, Native Git runner active, Multi-Brain LLM consensus engine running, and Multi-User Cloud Snapshot Sync enabled.

---

# Phase 1 - Make It Work (Completed ✅)

- [x] **[CORE] Full-Stack Express & Vite Server Setup**  
  Priority: P0 | Impact: High | Effort: M  
  Recommendation: Bind Express to `0.0.0.0:3000` with Vite middleware in development and static bundle serving in production.  

- [x] **[AI] Server-Side Gemini API Proxy**  
  Priority: P0 | Impact: High | Effort: M  
  Recommendation: Proxy Gemini API requests on `/api/orchestrate` in `server.ts` to keep `GEMINI_API_KEY` hidden from client browsers.  

- [x] **[CCC] Common Code Context Symbol Indexer**  
  Priority: P0 | Impact: High | Effort: M  
  Recommendation: Build `/api/ccc/index` workspace parser to extract exported symbols, imports, and relationships into a deterministic graph.  

- [x] **[STORE] Zustand Persistence & State Engine**  
  Priority: P0 | Impact: High | Effort: M  
  Recommendation: Implement double-layer persistence via `localStorage` and `IndexedDB` in `src/store/useStore.ts` and `src/lib/db.ts`.  

- [x] **[TESTS] Vitest Unit Test Suite**  
  Priority: P0 | Impact: High | Effort: M  
  Recommendation: Add Vitest test runner with React Testing Library to test store operations, ChatPanel components, and Gemini response parsing.  

---

# Phase 2 - Make It Reliable (Completed ✅)

- [x] **[REALTIME] NSP WebSocket Gateway & Telemetry Fallback**  
  Priority: P1 | Impact: High | Effort: M  
  Recommendation: Host `/nsp` WebSocket gateway on Express HTTP server with automatic `/api/telemetry` HTTP polling fallback in `App.tsx`.  

- [x] **[PERFORMANCE] Virtualized CCC Inspector List Rendering**  
  Priority: P1 | Impact: High | Effort: S  
  Recommendation: Integrate `@tanstack/react-virtual` in `CCCInspector.tsx` to handle large repository symbol lists without DOM lag.  

- [x] **[TEMPLATES] One-Click Custom Template Generator**  
  Priority: P1 | Impact: Medium | Effort: S  
  Recommendation: Add `saveAsTemplate` in store and `ProjectSettings.tsx` to turn active project files into reusable scaffold templates.  

- [x] **[SKILLS] Live Skill Marketplace Registry**  
  Priority: P1 | Impact: High | Effort: M  
  Recommendation: Connect `SkillsView.tsx` to server `/api/skills/registry` endpoint for instant installation, listing, and contribution.  

- [x] **[MULTIMODAL] Web Speech API Voice Input**  
  Priority: P2 | Impact: Medium | Effort: S  
  Recommendation: Implement voice transcription in `ChatPanel.tsx` to stream spoken commands as steering prompts.  

---

# Phase 3 - Make It Production Ready (Completed ✅)

- [x] **[PERSISTENCE] Server Skill Registry File / Database Backing**  
  Priority: P2 | Impact: Medium | Effort: S  
  Recommendation: Persist contributed skills in `server.ts` to a `skills.json` file on disk or Firestore collection so custom skills survive container restarts.  

- [x] **[SECURITY] API Rate Limiting & Proxy Forwarding Configuration**  
  Priority: P2 | Impact: High | Effort: S  
  Recommendation: Mount `express-rate-limit` middleware on `/api/orchestrate` and `/api/ccc/index` with `app.set('trust proxy', 1)` and custom key generator handling standard `x-forwarded-for` and `forwarded` headers without validation conflicts.  

- [x] **[TESTS] Additional Integration Test Coverage**  
  Priority: P2 | Impact: Medium | Effort: S  
  Recommendation: Add integration tests for `SkillsView` rendering and `ProjectSettings` template creation modal.  

---

# Phase 4 - Future Enhancements (Completed ✅)

- [x] **[CLOUD] Cloud Database & Workspace Snapshot Synchronization**  
  Priority: P3 | Impact: High | Effort: L  
  Implemented: Multi-user workspace synchronization via `/api/workspace/snapshot` backend endpoint with disk persistence (`workspace-snapshot.json`), local JSON export/import in `ProjectSettings.tsx`, and real-time push/pull cloud snapshot synchronization.  

- [x] **[GIT] Real Native Git Integration**  
  Priority: P3 | Impact: High | Effort: L  
  Implemented: Full backend execution engine on `/api/git/exec` supporting status, diff, add, commit, reset, push, fetch, log, and checkout commands. Interactive `GitPanel.tsx` UI with visual file diff inspection, staged/unstaged staging, branch switcher, and timeline history.  

- [x] **[ORCHESTRATION] Multi-Brain LLM Models & Consensus Distillation**  
  Priority: P3 | Impact: Medium | Effort: M  
  Implemented: Dynamic model selection (`gemini-2.5-pro`, `gemini-2.5-flash`, `gemini-2.0-flash`) and Brain Modes (`Flash`, `Deep Reasoning`, `Multi-Brain Consensus`, `Security Auditor`) with thinking budgets, server-side consensus orchestration, and interactive multi-brain trace inspection in `ChatPanel.tsx`.  
