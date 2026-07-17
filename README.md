# NEXUS

**The AI-Native Engineering Workspace.**

Nexus is a next-generation engineering environment designed for a world where AI is the primary operator of code. It replaces the traditional, file-heavy IDE with a mobile-first "steering" interface centered on **Intent Orchestration**.

---

## 🚀 Vision: Brain & Muscle

Nexus operates on a bi-modal architecture:
- **The Brain:** High-level architectural reasoning and intent distillation via server-side Gemini.
- **The Muscle:** Autonomous execution, real-time telemetry, and WebSocket-driven synchronization.

---

## ✨ Features (Production Ready - v3.0)

- **Mobile-First Card Deck:** Triage your projects and engineering intents through the high-fidelity "PCard" interface.
- **Project Blueprints:** Intelligent multi-file scaffolding for React PWAs, FastAPI backends, Chrome Extensions, and Data Science hubs.
- **Custom Template Blueprint Engine:** Save any active project workspace as a reusable custom template with one click.
- **Skill Marketplace:** Discover, install, and contribute specialized capabilities connected to a live server-side registry backend.
- **CCC (Common Code Context):** A semantic graph explorer with dynamic `@tanstack/react-virtual` virtualization to support fluid rendering of massive repository codebases.
- **Orchestration Chat:** Instruct the Nexus Brain to architect features, refactor logic, or audit security through natural language.
- **Voice-to-Intent Speech Engine:** Integrated client-side Web Speech API to stream voice commands as direct workspace intents.
- **Live Build Artifacts:** Inspect distilled source code in a real-time, tabbed engineering dashboard.
- **Automated Testing:** Dedicated Vitest suite for verifying Store logic and AI orchestration.
- **NSP Telemetry Stream (Real Gateway):** Event-driven WebSocket connection broadcasting real-time multi-brain synchronization messages and telemetry.

---

## 🛠️ Architecture Summary

- **Frontend:** React 19 + Vite + TypeScript + @tanstack/react-virtual
- **Backend:** Node.js + Express (Port 3000)
- **Real-Time Gateway:** Node WS (WebSockets) attached to Express server
- **Styling:** Tailwind CSS + Framer Motion
- **State Management:** Zustand (Store-centric architecture) + localStorage & IndexedDB Persistence
- **Visuals:** React Flow (Graph Visuals) + Lucide (Icons)
- **Intelligence:** Server-side Google Gemini API integration (securely proxying requests and masking API keys)

---

## ⚡ Quick Start

### Installation
```bash
npm install
```

### Development
Starts the workspace with the real Express/WebSocket backend and Vite HMR assets on port 3000.
```bash
npm run dev
```

### Build
Compiles frontend static files to `/dist` and compiles backend `server.ts` into a standalone, bundled CJS file at `dist/server.cjs` via `esbuild`.
```bash
npm run build
```

### Production Start
Launches the compiled production build:
```bash
npm run start
```

---

## 📋 Status & Audit Triage (v3.0)

**Current Status: Production Ready & Secure**

1. **Security:** Gemini API key integration is fully server-side. No API keys are exposed to the client.
2. **Persistence:** Workspace state is persistent across browser sessions using high-capacity client-side storage backup.
3. **Real-time Gateway:** Added a real WebSocket backend to synchronize telemetry and register custom skills instantly across all clients.
4. **Performance:** Implemented `@tanstack/react-virtual` in the CCC Inspector to support heavy repository symbol lists with no frame drop.
5. **Multimodal:** Added voice transcription input support using the browser's Web Speech API.

---

## 🤝 Contributing

Nexus is an open-spec project. Refer to `ARCHITECTURE.md` and `OPEN_SPECS.md` for deep-dives into the protocol and semantic layers.
