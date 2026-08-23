# TODO.md — Nexus Execution Roadmap

**Repository Status:** Production-Ready (Phase 1-3 Complete)  
**Estimated Completion Level:** 100% (for current scope)  
**Remaining Effort:** Phase 4 future enhancements (Cloud SQL, Native Git, Multi-Agent)

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

# Phase 3 - Make It Production Ready

- [x] **[PERSISTENCE] Server Skill Registry File / Database Backing**  
  Priority: P2  
  Impact: Medium  
  Effort: S  
  Recommendation: Persist contributed skills in `server.ts` to a `skills.json` file on disk or Firestore collection so custom skills survive container restarts.  

- [x] **[SECURITY] API Rate Limiting & Input Validation**  
  Priority: P2  
  Impact: High  
  Effort: S  
  Recommendation: Mount `express-rate-limit` middleware on `/api/orchestrate` and `/api/ccc/index` to prevent API key quota exhaustion.  

- [x] **[TESTS] Additional Integration Test Coverage**  
  Priority: P2  
  Impact: Medium  
  Effort: S  
  Recommendation: Add integration tests for `SkillsView` rendering and `ProjectSettings` template creation modal.  

---

# Phase 4 - Future Enhancements

- [ ] **[CLOUD] Cloud SQL / Firestore Database Integration**  
  Priority: P3  
  Impact: High  
  Effort: L  
  Recommendation: Support multi-user workspace synchronization across devices via Firestore or Cloud SQL backend database integration.  

- [ ] **[GIT] Real Native Git Integration**  
  Priority: P3  
  Impact: High  
  Effort: L  
  Recommendation: Connect client git status panel to actual server-side `simple-git` execution for real repo commits and pushes.  

- [ ] **[ORCHESTRATION] Parallel Multi-Brain LLM Models**  
  Priority: P3  
  Impact: Medium  
  Effort: M  
  Recommendation: Support switching or combining Gemini 2.5 Pro and Gemini 2.5 Flash for complex architectural refactors.  
