schema:
  version: 1
  compatible_with:
    - CCC
  generated_by: Repository Bootstrap Prompt
  generated_at: "2026-07-21T19:53:01-07:00"
  repository: Nexus

overview:
  value: Nexus is an AI-native engineering workspace and semantic operating system that streamlines intent-driven software development through a mobile-first card deck UI, semantic codebase indexing, and real-time AI orchestration.
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - metadata.json
    - README.md
  notes: ""

purpose:
  value: Provide software engineers with a unified environment to plan, orchestrate, generate, and inspect code applications using structured AI intent and common code context graphs.
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - metadata.json
    - src/store/useStore.ts
  notes: ""

scope:
  value: Full-stack single repository managing frontend UI components, Zustand state persistence, Express backend routes, WebSocket stream gateway, and Gemini AI endpoints.
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - package.json
    - server.ts
    - src/
  notes: ""

capabilities:
  value:
    - Real-time AI chat orchestration with Gemini 2.5 Flash
    - Common Code Context (CCC) semantic repository graph generation and virtualized inspection
    - Custom Skill marketplace discovery, installation, and live WebSocket registration
    - Workspace blueprint scaffold generation for PWA, FastAPI, Chrome Extensions, and Data Science hubs
    - Save existing workspace as a custom template blueprint
    - Voice-to-text input via browser Web Speech API
    - Real-time NSP WebSocket telemetry streaming
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - server.ts
    - src/components/CCCInspector.tsx
    - src/components/SkillsView.tsx
    - src/components/ProjectSettings.tsx
    - src/components/workspace/ChatPanel.tsx
  notes: ""

verified_features:
  value:
    - Express backend server with Vite middleware support
    - WebSocket server attached to Express HTTP server
    - Zustand persistent store backed by localStorage and IndexedDB
    - CCC semantic indexing endpoint (/api/ccc/index)
    - Skill marketplace endpoints (/api/skills/registry)
    - Virtualized node rendering in CCCInspector using @tanstack/react-virtual
    - Unit test suite using Vitest and React Testing Library
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - server.ts
    - src/store/useStore.ts
    - src/components/CCCInspector.tsx
    - package.json
  notes: ""

inferred_features:
  value:
    - Automatic fallback orchestration when GEMINI_API_KEY is not configured
    - Seamless reconnection for NSP WebSocket stream on network drops
  evidence_state: INFERRED
  confidence: HIGH
  evidence:
    - server.ts
    - src/App.tsx
  notes: "Code explicitly handles missing API key and WS close events."

future_indicators:
  value:
    - Expanded multi-brain orchestration protocols
    - Cloud SQL / persistent database integration options
  evidence_state: INFERRED
  confidence: MEDIUM
  evidence:
    - TODO.md
    - skills/system_skills/
  notes: ""

technology_stack:
  value:
    language: TypeScript 5.8
    runtime: Node.js (Express 4)
    frontend_framework: React 19
    build_tool: Vite 6 & esbuild
    styling: Tailwind CSS 4
    state_management: Zustand 5
    virtualization: "@tanstack/react-virtual 3"
    ai_sdk: "@google/genai 1.29"
    testing: Vitest 4
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - package.json
  notes: ""

repository_structure:
  value:
    - server.ts: Main Express server entry point with API routes and WebSocket gateway
    - src/main.tsx: React application root entry point
    - src/App.tsx: Main layout wrapper, top/bottom navigation, and WebSocket connection listener
    - src/store/useStore.ts: Zustand state store managing projects, messages, artifacts, skills, and persistence
    - src/types.ts: Global TypeScript interface and type definitions
    - src/components/CCCInspector.tsx: Virtualized semantic graph inspector component
    - src/components/SkillsView.tsx: Marketplace and active skill management component
    - src/components/ProjectSettings.tsx: Workspace configuration and template creation modal
    - src/components/workspace/ChatPanel.tsx: AI chat orchestration panel with voice input
    - src/__tests__/: Unit test suite
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - File system structure
  notes: ""

configuration:
  value:
    - package.json: Dependencies, build scripts, test script
    - tsconfig.json: TypeScript compiler configuration
    - vite.config.ts: Vite bundler and Tailwind plugin setup
    - metadata.json: Applet title, description, and capabilities
    - .env.example: Environment variable declarations
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - Root directory files
  notes: ""

build_process:
  value:
    command: npm run build
    outputs:
      - dist/ (static client assets)
      - dist/server.cjs (bundled CommonJS server binary)
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - package.json
    - build execution log
  notes: ""

deployment:
  value:
    platform: Cloud Run
    container_port: 3000
    start_command: npm run start (node dist/server.cjs)
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - environment metadata
    - package.json
  notes: ""

repository_boundaries:
  value:
    - Server code strictly proxies Gemini API calls and does not expose secrets to client
    - Client code operates via Express API endpoints and WebSocket messages
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - server.ts
    - src/App.tsx
  notes: ""

known_unknowns:
  value:
    - External LLM provider quotas in production deployments
  evidence_state: OBSERVED
  confidence: MEDIUM
  evidence:
    - server.ts
  notes: ""

confidence_summary:
  value: HIGH
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - All code inspected and validated.
  notes: ""
