# ARCHITECTURE.md

## HIGH-LEVEL ARCHITECTURE (VISION)

**Confidence: High (Based on PRD/Specs)**

Nexus is architected as a **Bi-Modal Distributed System**:

1.  **The Brain (Client/Orchestrator):** Processes user intent, manages semantic context (CCC), and coordinates with the LLM.
2.  **The Muscle (Server/Runtime):** Executes the instructions. It manages the filesystem, runs build scripts, and streams telemetry back to the Brain via NSP (Nexus Stream Protocol).

## COMPONENT BREAKDOWN

### 1. The Core Store (`src/store/useStore.ts`)
**Confidence: High**
The central orchestrator of the frontend. It manages:
- **Global Navigation:** Views (Deck, Chat, CCC, Artifacts).
- **Project Catalog:** Metadata for all workspaces.
- **Telemetry Buffers:** NSP packets (currently simulated).
- **Artifact Cache:** In-memory storage of generated source code.

### 2. Common Code Context (CCC) (`src/lib/ccc.ts`)
**Confidence: High**
A semantic indexer that performs "Archaeology" on the repository. It identifies:
- Symbols (Classes, Functions, Modules).
- Relationship Graphs (Impact Analysis).
- Metadata (File paths, sizes).

### 3. Intent Engine (`src/lib/gemini.ts`)
**Confidence: High**
Handles the transformation of natural language into "Distilled Intelligence" (JSON orchestration nodes).

## DATA FLOW

**Intent Execution Loop:**
1.  **Prompt:** User enters intent in `ChatPanel.tsx`.
2.  **Orchestration:** `gemini.ts` generates a plan (planning node).
3.  **Distillation:** The Brain breaks the plan into `Artifacts`.
4.  **Sync:** (Intended) The Artifacts are sent to the "Muscle" via WebSocket.
5.  **Feedback:** Real-time metrics stream back to the `TelemetryStream`.

## PROTOTYPE VS. PRODUCTION (CURRENT STATE)

| Feature | Prototype (Current) | Production (Intended) |
| :--- | :--- | :--- |
| **Logic Node** | Client-side React SPA | Distributed Express/Node server |
| **AI Integration** | Client-side SDK (Vulnerable) | Server-side proxy (Secure) |
| **Persistence** | In-memory Zustand (Ephemeral) | Firestore / Cloud SQL |
| **Filesystem** | Virtual "Artifact" State | Real OS Filesystem access |
| **Telemetry** | `Math.random()` simulation | Live Node/Docker metrics |

## EXTERNAL INTEGRATIONS

- **Google Gemini API:** Primary intelligence engine.
- **Lucide Icons:** Visual system for semantic labeling.
- **React Flow / Mermaid:** For graph/architecture visualization.

## DEPLOYMENT MODEL

**Current Reality (Confidence: High):**
- **Static Hosting:** The app is a self-contained Vite build.
- **Build Script:** `npm run build` produces a standard `dist/` folder.
- **CI/CD:** None found (Manual deployment context).

## ARCHITECTURAL RISKS

1.  **Security (Critical):** Gemini API key is currently exposed in the browser bundle.
2.  **Scale (Medium):** The CCC Graph Editor (`CCCGraphEditor.tsx`) may lag when rendering 100+ nodes without virtualization.
3.  **Consistency (High):** The "Muscle" state and "Brain" state can drift if the WebSocket connection for NSP is interrupted.

## RECOMMENDED IMPROVEMENTS

1.  **Bridge to Server:** Introduce a Node.js backend to handle Gemini requests and File IO.
2.  **Database Layer:** Replace the static `initialFiles` and mock projects with a persistent store (e.g., Firebase).
3.  **Security Proxy:** Move AI authentication to the server.
