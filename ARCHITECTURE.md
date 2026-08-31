# Nexus Architecture Specification

This document provides the authoritative technical architecture, system components, data flows, persistence models, and architectural invariants of Nexus.

---

## 1. System Overview & The Bi-Modal Split

Nexus is designed around a **Bi-Modal Architecture** that cleanly separates high-level architectural cognition from execution and runtime operations:

```
┌────────────────────────────────────────────────────────────┐
│                    THE BRAIN (Frontend)                    │
│   React 19 SPA • Zustand State Engine • Monaco Editor     │
│   Mobile-First Card Deck • CCC Inspector • Git Panel       │
└───────────────────────────┬────────────────────────────────┘
                            │
               HTTP REST &  │  WebSocket Stream (/nsp)
             Bi-Directional │  Nexus Synapse Protocol
                            │
┌───────────────────────────▼────────────────────────────────┐
│                    THE MUSCLE (Backend)                    │
│   Node.js / Express Server (0.0.0.0:3000)                  │
│   CCC Semantic Engine & Native CLI • Native Git Runner    │
│   Multi-Brain Consensus Orchestration (Gemini 3.7 Flash)  │
│   Manifest v2 Skill Registry • Workspace Snapshot Sync     │
└────────────────────────────────────────────────────────────┘
```

1. **The Brain (Frontend SPA):**
   - Implemented in **React 19**, **Vite 6**, and **TypeScript 5.8**.
   - Responsible for intent capture, conversation steering, visual card deck triaging, semantic graph exploration, Monaco code diffing, and speech-to-intent transcription.
   - Client state is unified in a reactive **Zustand** store with multi-tier browser persistence.

2. **The Muscle (Backend Runtime):**
   - Implemented in **Node.js 20+** and **Express 4.21** in `server.ts`.
   - Responsible for code analysis, native Git CLI execution, WebSocket telemetry streaming (`/nsp`), persistent file-backed registries, and server-side AI model proxying using `@google/genai`.

---

## 2. Major Components & Responsibilities

### 2.1 Frontend Components (`src/components/`)

| Component | Responsibility |
| :--- | :--- |
| **`App.tsx`** | Top-level layout shell, view routing, and WebSocket telemetry stream manager with automatic HTTP fallback. |
| **`CardDeck.tsx`** | Mobile-first PortableCard (pCard) deck. Visualizes active systems, health metrics, blockers, autonomous insights, and triggers `INTENT_DISPATCH` over NSP. |
| **`ChatPanel.tsx`** | Multi-brain AI steering interface. Supports model mode switching (Flash 3.7, Deep Reasoning, Consensus, Auditor), speech-to-text voice input, thinking budget controls, and consensus trace visualization. |
| **`CCCInspector.tsx`** | Virtualized semantic graph inspector using `@tanstack/react-virtual`. Provides high-performance navigation of AST symbols, routes, schemas, and dependencies. |
| **`CCCGraphEditor.tsx`** | Interactive visual node-edge diagram editor for dependency, architecture, and intent graphs. |
| **`GitPanel.tsx`** | Native Git management console. Provides visual file staging, unstaging, commit creation, branch switching, and unified diff inspection. |
| **`SkillsView.tsx`** | Manifest v2 skill marketplace and active manager. Enables skill discovery, installation, sandboxed permission review, and portable `.nsk` package export/import. |
| **`ProjectSettings.tsx`** | Workspace configuration, cloud snapshot synchronization push/pull, and one-click custom template generator. |
| **`ArtifactPanel.tsx`** | Multi-tab artifact inspection supporting code editing, side-by-side diffing, live HTML preview, and validation reports. |

### 2.2 Backend Modules (`server.ts`)

| Module | Responsibility |
| :--- | :--- |
| **API & Middleware Gateway** | Express server on port 3000 handling JSON payloads, rate limiting with trusted proxy headers, and Vite dev middleware or static serving. |
| **WebSocket Gateway (`/nsp`)** | Bidirectional real-time event streaming implementing the Nexus Synapse Protocol. |
| **CCC Context Engine** | Dual-tier semantic extraction: runs native `ccc` CLI queries when available, with transparent fallback to in-memory workspace regex/AST parsing. |
| **Git Execution Engine** | Executes native git operations (`git status`, `diff`, `add`, `commit`, `checkout`, `branch`) safely via child processes with path validation. |
| **AI Orchestration Proxy** | Proxies Gemini 3.7 Flash API calls with thinking budgets and consensus synthesis while safeguarding `GEMINI_API_KEY`. |
| **Skill Registry Service** | Manages installation and retrieval of Manifest v2 skills with disk persistence in `skills.json`. |
| **Workspace Snapshot Service** | Provides cloud push/pull sync backed by `workspace-snapshot.json` on disk. |

---

## 3. Data Flow & Nexus Synapse Protocol (NSP)

### 3.1 Orchestration & Steering Flow

```
1. User Voice/Text Intent
         │
         ▼
2. ChatPanel / CardDeck (src/)
         │
         ├─────────────────────────────────────────┐
         ▼                                         ▼
   POST /api/orchestrate (REST)              INTENT_DISPATCH (WebSocket)
         │                                         │
         ▼                                         ▼
3. Express Server (server.ts)                NSP Gateway (/nsp)
         │                                         │
         ├─────────────────┬─────────────────┐     │
         ▼                 ▼                 ▼     │
   CCC Context       Gemini 3.7 Flash    Git Engine│
   (Query/Symbol)    (Consensus/Thinking) (CLI)    │
         │                 │                 │     │
         └─────────────────┼─────────────────┘     │
                           ▼                       ▼
4. Response Payload & Orchestration Events ──► NSP_TELEMETRY / PCARD_UPSERT
                           │                       │
                           ▼                       ▼
5. Zustand Store (useStore.ts) ◄───────────────────┘
         │
         ▼
6. UI Renders Updated PCards, Artifacts, & Traces
```

### 3.2 Nexus Synapse Protocol (NSP) Specification

The `/nsp` WebSocket connection carries real-time bi-directional events:

| Event Type | Direction | Payload Description |
| :--- | :--- | :--- |
| **`NSP_TELEMETRY`** | Muscle → Brain | Real-time CPU, memory, active network connections, and latency metrics broadcast every 3 seconds. |
| **`INTENT_DISPATCH`** | Brain → Muscle | High-level steering action dispatched from a card (e.g. `scaffold_system`, `deploy_fix`, `steer_card`). |
| **`INTENT_ACK`** | Muscle → Brain | Server acknowledgment confirming task acceptance or execution result. |
| **`USER_MESSAGE_RECEIVED`** | Brain → Muscle | Chat message broadcast to telemetry subscribers. |
| **`SKILL_REGISTERED`** | Muscle → Brain | Real-time notification when a new skill is installed or submitted to the registry. |
| **`CCC_CONTEXT_BUILT`** | Muscle → Brain | Notification when CCC compilation finishes generating fresh `.llm-context/` artifacts. |

### 3.3 Telemetry Resiliency & Fallback
If the WebSocket stream is blocked by container proxies or strict network filters:
1. `src/App.tsx` detects the connection drop.
2. The client automatically activates an HTTP polling loop against `GET /api/telemetry` every 5 seconds.
3. When the WebSocket connection recovers, polling ceases and low-latency streaming resumes.

---

## 4. Semantic Context Engine (CCC Integration)

Nexus treats codebases as structured semantic graphs rather than arbitrary token streams.

```
Workspace Files ──► CCC Compiler (ccc / in-memory) ──► .llm-context/
                                                            │
                                  ┌─────────────────────────┴────────────────────────┐
                                  ▼                                                  ▼
                        symbol-index.json                                   context-manifest.json
                        routes.txt                                          call-graph.json
                        types-extracted.ts                                  capabilities.json
```

### 4.1 CCC Artifacts & Schemas
- **`symbol-index.json`**: Extracted functions, classes, interfaces, and methods with exact line coordinates.
- **`routes.txt` & `public-api.txt`**: HTTP endpoints, signatures, and public contract declarations.
- **`types-extracted.ts` & `type-graph.json`**: TypeScript interfaces and dependency edges.
- **`context-manifest.json`**: Token estimates and task-type recommendations for prompt assembly.

### 4.2 Query Interface (`POST /api/ccc/query`)
- Accepts a query term, target scope (`project`, `file`, `global`), depth, and entity categories (`symbols`, `routes`, `dependencies`, `schemas`, `services`).
- Executes `ccc query --format json <term>` against native compiled context.
- Falls back to in-memory AST and regex scanning if native CCC is not compiled.
- Returns hits with an explicit `source` flag (`native-ccc` or `memory-ast`) and confidence score.

---

## 5. State Management & Multi-Tier Persistence

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENT STORAGE                         │
│                                                             │
│   Fast In-Memory State: Zustand (src/store/useStore.ts)     │
│             │                               │               │
│             ▼                               ▼               │
│   Key/Value Caching:               Large Data Persistence:  │
│   localStorage                     IndexedDB (src/lib/db.ts)│
│   (Pinned IDs, Views, UI Prefs)    (Projects, Artifacts,    │
│                                     Messages, CCC Nodes)    │
└──────────────────────────────┬──────────────────────────────┘
                               │
                Cloud Snapshot │ POST /api/workspace/snapshot
                     Sync      │ GET  /api/workspace/snapshot
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                      SERVER STORAGE                         │
│                                                             │
│   skills.json:              workspace-snapshot.json:        │
│   Persistent registry of    Multi-user workspace state      │
│   installed Manifest v2     snapshots persisted on server   │
│   skills                    disk                            │
└─────────────────────────────────────────────────────────────┘
```

1. **Client Tier (Zustand + IndexedDB + localStorage):**
   - In-memory state is managed through Zustand.
   - Heavy collections (projects, artifacts, messages, pCards, and CCC graphs) are asynchronously synchronized to IndexedDB.
   - Ephemeral UI flags (active view, pinned projects) synchronize to `localStorage`.
   - `src/lib/db.ts` contains explicit environment guards ensuring unit tests run smoothly without IndexedDB crashes in JSDOM.

2. **Server Tier (File-Backed JSON Storage):**
   - **`skills.json`**: Stores installed and marketplace skills, preserving them across server restarts.
   - **`workspace-snapshot.json`**: Stores full workspace snapshots pushed from client settings for cloud backup and team sharing.

---

## 6. Core Domain Schemas & Contracts

### 6.1 PortableCard (`pCard`)
The standardized unit of system cognition and mobile-first triaging:

```typescript
interface PCard {
  pcard_id: string;
  identity: {
    name: string;
    tagline: string;
  };
  runtime: {
    build_status: 'SUCCESS' | 'FAILURE' | 'PENDING';
    telemetry: {
      latency: number;
      errors: number;
    };
  };
  intent_layer: {
    active_goals: string[];
    blockers: string[];
  };
  autonomous_insights: Array<{
    observation: string;
    suggestions: string[];
  }>;
  type?: 'SYSTEM_CARD' | 'PROJECT_DRAFT';
  creation_status?: {
    phase: string;
    progress: number;
    current_action: string;
  };
  proposed_architecture?: string[];
  quick_actions?: string[];
}
```

### 6.2 Skill Manifest v2
The open specification for procedural intelligence packages:

```typescript
interface Skill {
  id: string;
  name: string;
  description: string;
  version: string;
  author: string;
  category?: string;
  triggers: string[];
  tools: string[];
  retrievalRules: string[];
  workflows: string[];
  validations: string[];
  prompts: string[];
  permissions?: string[];               // Sandbox access scopes (e.g. git:read, fs:write)
  visual_priority?: number | string;    // Ranking weight in the mobile card deck
  telemetry_mapping?: Record<string, string>; // Metric mapping to card gauges
  insight_triggers?: string[];          // Conditions generating Autonomous Insights
}
```

### 6.3 Orchestration Event Bus
Standardized lifecycle events tracked during engineering sessions:

```typescript
type OrchestrationEventType =
  | 'USER_MESSAGE_RECEIVED'
  | 'CCC_CONTEXT_BUILT'
  | 'PLAN_GENERATED'
  | 'ARTIFACT_CREATED'
  | 'FILES_MODIFIED'
  | 'TOOL_EXECUTED'
  | 'VERIFICATION_COMPLETED'
  | 'TASK_APPROVED'
  | 'ERROR_OCCURRED';
```

---

## 7. Security Architecture & Invariants

1. **Port 3000 Invariant:**
   - The application binds strictly to host `0.0.0.0` on port `3000`. No dynamic or alternate ports are used.
2. **Strict Server-Side Secret Isolation:**
   - `GEMINI_API_KEY` and all environment credentials are held exclusively by the server process (`server.ts`).
   - The browser client never receives, logs, or stores API keys.
3. **Cloud Run / Reverse Proxy Ingress:**
   - Express is configured with `app.set('trust proxy', 1)` to accurately evaluate proxy forwarding headers (`X-Forwarded-For`) without IP validation errors.
   - Rate limiters apply strictly to sensitive routes to prevent API quota exhaustion.
4. **Sandboxed Skill Execution:**
   - Skills must declare required permissions (`permissions` array in Manifest v2) before interacting with git or filesystem resources.
5. **Deterministic Production Bundling:**
   - The server is compiled into a single CommonJS file (`dist/server.cjs`) via `esbuild`. Relative module imports are bundled at build-time, eliminating ESM resolution errors in production containers.

---

## 8. Testing & Verification Boundaries

Testing boundaries are organized into dedicated suites executing under **Vitest**:

| Test Suite | Coverage Area | Invariants Verified |
| :--- | :--- | :--- |
| **`store.test.ts`** | Zustand store | Project creation, template instantiation, artifact generation, and active state switches. |
| **`components.test.tsx`** | UI components | CardDeck rendering, GitPanel diff rendering, and responsive drawer toggling. |
| **`SkillsView.test.tsx`** | Manifest v2 Skills | Marketplace listing, skill installation, filtering, and .nsk export/import validation. |
| **`cccQueryEngine.test.ts`** | CCC Query API | Keyword search, AST symbol matching, schema extraction, and fallback logic. |
| **`gemini.test.ts`** | AI helpers | Server proxy response parsing, error handling, and multi-brain mode payload assembly. |

All tests execute headless in JSDOM via `npm test` and are enforced by the CI pipeline (`.github/workflows/ci.yml`).
