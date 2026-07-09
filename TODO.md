# TODO.md

# Phase 1 — Make It Work (Foundation)

- [x] **[SECURITY] [src/lib/gemini.ts]** Move Gemini API logic to a server-side route.  
  Priority: P0  
  Impact: Critical  
  Effort: M  
  Evidence: Client-side exposure of `process.env.GEMINI_API_KEY`.  
  Recommendation: Create `/api/orchestrate` in a new `server.ts`.  
  Confidence: High

- [x] **[CORE] [server.ts]** Initialize a real Express server with Vite middleware.  
  Priority: P0  
  Impact: High  
  Effort: M  
  Evidence: Infrastructure described in docs but missing in code.  
  Recommendation: Add `server.ts` and update `package.json` scripts.  
  Confidence: High

- [x] **[STORAGE] [store/useStore.ts]** Connect workspace state to a persistent database.  
  Priority: P1  
  Impact: High  
  Effort: L  
  Evidence: All state currently ephemeral in memory (Zustand).  
  Recommendation: Use Firestore or local IndexedDB for durable projects.  
  Confidence: High

# Phase 2 — Make It Reliable (Hardening)

- [x] **[TESTING] [src/__tests__]** Expand unit tests for all React components.  
  Priority: P1  
  Impact: Medium  
  Effort: L  
  Evidence: Initial testing infrastructure is live but coverage is low (~10%).  
  Recommendation: Add tests for `ArtifactPanel` and `ChatPanel`.  
  Confidence: High

- [x] **[CCC] [components/CCCInspector.tsx]** Implement real repository indexing.  
  Priority: P1  
  Impact: Medium  
  Effort: L  
  Evidence: CCC data is currently a static JSON mock.  
  Recommendation: Integrate a basic file-walker and regex-based symbol extractor.  
  Confidence: Medium

- [x] **[UI] [components/workspace/ArtifactPanel.tsx]** Add code-diff visualization.  
  Priority: P2  
  Impact: High  
  Effort: M  
  Evidence: `ArtifactType.DIFF` exists but renders as raw text/mock editor.  
  Recommendation: Use `react-diff-viewer` or Monaco diff editor.  
  Confidence: High

# Phase 3 — Make It Production Ready (Scale)

- [ ] **[REALTIME] [NSP Protocol]** Implement WebSocket gateway for Brain/Muscle sync.  
  Priority: P2  
  Impact: High  
  Effort: L  
  Evidence: "NSP Stream" is currently simulated in `ChatPanel.tsx`.  
  Recommendation: Use `socket.io` for event-driven telemetry status.  
  Confidence: Medium

- [ ] **[PERFORMANCE] [components/CCCInspector.tsx]** Virtualize node lists.  
  Priority: P3  
  Impact: Low  
  Effort: S  
  Evidence: Large lists of symbols will lag UI.  
  Recommendation: Use `@tanstack/react-virtual`.  
  Confidence: High

# Phase 4 — Future Enhancements

- [ ] **[SKILLS] [SkillsView.tsx]** Connect Skill Marketplace to a real registry backend.  
  Priority: P2  
  Impact: High  
  Effort: L  
  Evidence: Marketplace is structurally implemented but uses hardcoded lists.  
  Recommendation: Implement `fetchSkills` from a remote JSON endpoint.  
  Confidence: High

- [ ] **[TEMPLATES] [store/useStore.ts]** Add "Custom Template" creation flow.  
  Priority: P2  
  Impact: Medium  
  Effort: S  
  Evidence: Template system exists but is restricted to static definitions.  
  Recommendation: Allow users to "Save as Template" from an existing project.  
  Confidence: High

- [ ] **[MULTIMODAL] [ChatPanel.tsx]** Real voice-to-intent engine.  
  Priority: P3  
  Impact: Low  
  Effort: M  
  Evidence: Mentioned in PRD but no audio processing logic.  
  Recommendation: Integrate Web Speech API or Gemini Live API.  
  Confidence: Medium
