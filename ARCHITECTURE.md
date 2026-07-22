schema:
  version: 1
  compatible_with:
    - CCC
  generated_by: Repository Bootstrap Prompt
  generated_at: "2026-07-21T19:53:01-07:00"
  repository: Nexus

architecture_style:
  value: Full-Stack Modular Client-Server with Real-Time WebSocket Gateway
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - server.ts
    - package.json
    - src/App.tsx
  notes: ""

major_components:
  value:
    - Express Backend (server.ts): Manages API endpoints, Gemini proxying, CCC indexing, and skill registry.
    - WebSocket Telemetry Server (server.ts): Handles NSP protocol real-time message broadcasting.
    - Zustand Store (src/store/useStore.ts): Centralized client state management with double-layer storage (localStorage + IndexedDB).
    - ChatPanel (src/components/workspace/ChatPanel.tsx): Handles user prompt orchestration and Web Speech API voice input.
    - CCCInspector (src/components/CCCInspector.tsx): Renders virtualized semantic graph representation of repository symbols.
    - SkillsView (src/components/SkillsView.tsx): Manages installation and creation of marketplace skills.
    - ProjectSettings (src/components/ProjectSettings.tsx): Handles project updates and custom template creation.
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - server.ts
    - src/store/useStore.ts
    - src/components/
  notes: ""

responsibilities:
  value:
    server: Express handles static serving in production, Vite middleware in dev, AI calls to Gemini SDK, CCC semantic indexing, and WS telemetry broadcasting.
    client: React single-page application manages UI view transitions, user interactions, local state persistence, and WS event handling.
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - server.ts
    - src/App.tsx
  notes: ""

dependency_flow:
  value: "React Components -> Zustand Store -> Fetch / WebSocket -> Express Server -> Google GenAI SDK"
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - src/components/
    - src/store/useStore.ts
    - server.ts
  notes: ""

data_flow:
  value:
    - User types prompt or uses voice input in ChatPanel.
    - Request sent to /api/orchestrate on Express backend.
    - Backend calls Google GenAI SDK and returns generated response/artifacts.
    - Store updates messages and artifacts state, persisting to localStorage and IndexedDB.
    - Real-time telemetry is streamed from server to client via NSP WebSocket gateway.
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - server.ts
    - src/store/useStore.ts
    - src/components/workspace/ChatPanel.tsx
  notes: ""

source_of_truth:
  value:
    - Server: In-memory skill registry and CCC index.
    - Client: Zustand Store synced asynchronously to IndexedDB and localStorage.
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - server.ts
    - src/store/useStore.ts
  notes: ""

entry_points:
  value:
    - server.ts (HTTP and WS server listener on port 3000)
    - src/main.tsx (React DOM root hydration)
    - src/App.tsx (Main app view switcher and WS lifecycle listener)
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - package.json
    - server.ts
    - src/main.tsx
  notes: ""

external_systems:
  value:
    - Google Gemini API (@google/genai SDK)
    - Web Speech API (browser built-in)
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - server.ts
    - src/components/workspace/ChatPanel.tsx
  notes: ""

extension_points:
  value:
    - Custom Skill creation and marketplace contribution via /api/skills/registry
    - Custom template creation from existing workspace in ProjectSettings
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - server.ts
    - src/components/SkillsView.tsx
    - src/components/ProjectSettings.tsx
  notes: ""

configuration:
  value:
    - process.env.GEMINI_API_KEY
    - process.env.NODE_ENV
    - PORT (defaults to 3000)
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - server.ts
    - .env.example
  notes: ""

constraints:
  value:
    - Port 3000 is hardcoded for container ingress proxy routing.
    - API keys must remain server-side.
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - server.ts
  notes: ""

architecture_risks:
  value:
    - Network drops can temporarily disconnect WebSocket connection (mitigated by auto-reconnect loop in App.tsx).
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - src/App.tsx
  notes: ""

improvement_opportunities:
  value:
    - Persist server skill registry to cloud database (e.g., Firestore or PostgreSQL) across container restarts.
  evidence_state: INFERRED
  confidence: HIGH
  evidence:
    - server.ts
  notes: Current server skill registry is stored in-memory in server.ts.

unknown_areas:
  value: UNSET
  evidence_state: UNSET
  confidence: NONE
  evidence: []
  notes: "No architectural unknown areas detected."
