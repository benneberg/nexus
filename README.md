# Nexus

## Overview
Nexus is the Semantic Operating System for Autonomous Engineering. It is a full-stack, mobile-first workspace designed for intent-driven development, semantic codebase indexing, and real-time AI orchestration.

## Requirements
- Node.js (v18 or higher)
- npm (v9 or higher)
- Modern Web Browser (Chrome, Firefox, Safari, Edge)

## Installation
```bash
npm install
```

## Configuration
Declare required environment variables in `.env` or container environment:
- `GEMINI_API_KEY`: API key for Google Gemini AI orchestration (optional, fallback heuristics active if absent).
- `PORT`: Hardcoded container entry port (defaults to 3000).

## Usage
Start the development server with real-time Express backend and Vite middleware:
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

## Testing
Run unit tests using Vitest:
```bash
npm run test
```

Run lint checks using TypeScript:
```bash
npm run lint
```

## Build
Compile frontend static assets and bundle server.ts into CommonJS format (`dist/server.cjs`):
```bash
npm run build
```

## Deployment
Nexus is configured for Cloud Run container execution. Launch production bundled server on port 3000:
```bash
npm run start
```

## Repository Structure
```
├── server.ts                   # Express server, WebSocket gateway, Gemini AI routes
├── src/
│   ├── main.tsx                # Client React entry point
│   ├── App.tsx                 # Main layout and WebSocket lifecycle
│   ├── types.ts                # TypeScript interfaces and types
│   ├── store/
│   │   └── useStore.ts         # Zustand state store with persistent storage
│   ├── components/
│   │   ├── CCCInspector.tsx    # Virtualized semantic graph inspector
│   │   ├── SkillsView.tsx      # Skill marketplace management
│   │   ├── ProjectSettings.tsx # Workspace settings and template generator
│   │   └── workspace/
│   │       └── ChatPanel.tsx   # AI orchestration chat with voice input
│   └── __tests__/              # Vitest test suite
├── package.json                # Dependencies and npm scripts
├── metadata.json               # Applet name, description, capabilities
├── vite.config.ts              # Vite and Tailwind CSS configuration
└── tsconfig.json               # TypeScript compiler rules
```
