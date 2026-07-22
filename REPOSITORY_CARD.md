schema:
  version: 1
  compatible_with:
    - CCC
  generated_by: Repository Bootstrap Prompt
  generated_at: "2026-07-21T19:53:01-07:00"
  repository: Nexus

name:
  value: Nexus
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - metadata.json
  notes: ""

short_description:
  value: The Semantic Operating System for Autonomous Engineering. A mobile-first workspace for intent-driven development with structured semantic context.
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - metadata.json
    - README.md
  notes: ""

category:
  value: Developer Tools & AI Engineering Workspaces
  evidence_state: INFERRED
  confidence: HIGH
  evidence:
    - metadata.json
    - src/components/workspace/
  notes: "Designed for intent orchestration and AI-assisted development."

repository_type:
  value: WEB_APP
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - package.json
    - server.ts
  notes: ""

repository_status:
  value: ACTIVE
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - TODO.md
    - package.json
  notes: ""

complexity:
  value: MODERATE
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - server.ts
    - src/store/useStore.ts
  notes: ""

primary_technologies:
  value:
    - React 19
    - Vite
    - TypeScript
    - Express
    - WebSockets (ws)
    - Zustand
    - @google/genai SDK
    - Tailwind CSS
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - package.json
    - server.ts
  notes: ""

problem_solved:
  value: Replaces bloated traditional IDEs with an AI-native steering workspace centered on intent orchestration, semantic workspace indexing, and custom skill execution.
  evidence_state: INFERRED
  confidence: HIGH
  evidence:
    - README.md
    - metadata.json
    - src/components/CCCInspector.tsx
  notes: ""

target_audience:
  value: Software engineers, AI developers, and technical product managers.
  evidence_state: INFERRED
  confidence: HIGH
  evidence:
    - README.md
    - metadata.json
  notes: ""

primary_users:
  value: Developers orchestrating multi-file AI applications and managing semantic workspaces.
  evidence_state: INFERRED
  confidence: HIGH
  evidence:
    - src/components/workspace/ChatPanel.tsx
    - src/components/CCCInspector.tsx
  notes: ""

unique_characteristics:
  value:
    - Card Deck (PCard) project triage system
    - Common Code Context (CCC) semantic graph inspector with list virtualization
    - NSP real-time WebSocket telemetry gateway
    - Server-side Gemini proxy to keep API keys secure
    - Custom Template blueprint saving engine
    - Client-side voice input speech engine
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - src/components/CCCInspector.tsx
    - server.ts
    - src/components/ProjectSettings.tsx
    - src/components/workspace/ChatPanel.tsx
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
    - server.ts
  notes: ""

current_state:
  value: Fully compiled, verified with lint and build checks, with complete persistence and real-time backend functionality.
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - successful compilation logs
    - TODO.md (all tasks marked completed)
  notes: ""

key_risks:
  value:
    - GEMINI_API_KEY environment variable required for server-side AI endpoints.
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - server.ts
  notes: Fallback heuristics exist if API key is not present.

overall_confidence:
  value: HIGH
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - Direct verification of file contents and build output.
  notes: ""
