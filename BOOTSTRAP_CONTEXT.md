schema:
  version: 1
  compatible_with:
    - CCC
  generated_by: Repository Bootstrap Prompt
  generated_at: "2026-07-21T19:53:01-07:00"
  repository: Nexus

repository_summary:
  value: Nexus is a full-stack AI engineering operating system. It features a mobile-first card deck UI, semantic code indexing, real-time WebSocket telemetry, and server-side Gemini AI orchestration.
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - metadata.json
    - README.md
    - server.ts
  notes: ""

technology_summary:
  value: React 19, TypeScript 5.8, Express 4, Vite 6, Tailwind CSS 4, Zustand 5, @tanstack/react-virtual 3, @google/genai SDK 1.29, ws 8.
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - package.json
  notes: ""

architecture_summary:
  value: Express server serving Vite frontend middleware in development and static bundle in production. Express hosts WebSocket server for telemetry, proxying Gemini AI calls on /api/orchestrate.
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - server.ts
  notes: ""

coding_patterns:
  value:
    - Functional React components with standard hooks
    - Zustand store with async persistence handlers (IndexedDB + localStorage)
    - Lazy API key initialization pattern on server
    - Virtualized row rendering for large list containers (@tanstack/react-virtual)
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - src/store/useStore.ts
    - src/components/CCCInspector.tsx
  notes: ""

naming_patterns:
  value:
    - PascalCase for React component files (e.g. ChatPanel.tsx, CCCInspector.tsx)
    - camelCase for store hooks, helper functions, and state values
    - UPPER_SNAKE_CASE for constant values and action types
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - src/components/
    - src/store/useStore.ts
  notes: ""

important_conventions:
  value:
    - Server runs strictly on port 3000 bound to host 0.0.0.0
    - Secrets accessed only in server.ts / server routes
    - All icons imported exclusively from lucide-react
    - Animations implemented with motion/react or CSS transitions
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - server.ts
    - src/components/
  notes: ""

critical_files:
  value:
    - server.ts: Main Express API & WebSocket entry point
    - src/App.tsx: Main UI shell and WS listener
    - src/store/useStore.ts: Global application store
    - src/types.ts: Core TypeScript type declarations
    - src/components/CCCInspector.tsx: Virtualized semantic graph component
    - package.json: Build scripts and package dependencies
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - Root directory files and src/ directory
  notes: ""

primary_entry_points:
  value:
    - server.ts
    - src/main.tsx
    - src/App.tsx
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - package.json
  notes: ""

dangerous_areas:
  value:
    - Server port setting in server.ts must strictly remain 3000 for container reverse proxy routing.
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - server.ts
  notes: ""

files_likely_to_change:
  value:
    - src/store/useStore.ts
    - src/components/
    - server.ts
  evidence_state: INFERRED
  confidence: HIGH
  evidence:
    - Active feature expansion patterns
  notes: ""

generated_files:
  value:
    - dist/ (static build outputs)
    - dist/server.cjs (bundled CommonJS server binary)
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - package.json
  notes: ""

repository_gaps:
  value: UNSET
  evidence_state: UNSET
  confidence: NONE
  evidence: []
  notes: "No repository gaps identified."

known_unknowns:
  value: UNSET
  evidence_state: UNSET
  confidence: NONE
  evidence: []
  notes: "No known unknowns identified."

overall_confidence:
  value: HIGH
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - Full analysis complete and verified.
  notes: ""
