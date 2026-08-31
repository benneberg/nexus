# Contributing to Nexus

Thank you for contributing to Nexus! This document outlines development setup, coding standards, skill authoring, and the pull request process.

---

## 1. Development Environment Setup

### Prerequisites
- **Node.js**: `20.x` or later (or **Bun** latest)
- **Package Manager**: `npm` (or `bun`)
- **Python**: `3.10+` (optional, for native `ccc-contextcompiler` CLI)

### Installation
```bash
# Clone the repository
git clone https://github.com/benneberg/nexus.git
cd nexus

# Install dependencies
npm install
# or with Bun:
bun install
```

### Environment Configuration
Copy the example environment file:
```bash
cp .env.example .env
```
Configure your `GEMINI_API_KEY` in `.env` for AI orchestration features. Note that the application gracefully falls back to deterministic mock schemas if an API key is not present.

---

## 2. Development Commands

| Command | Purpose |
| :--- | :--- |
| `npm run dev` | Starts Express backend with Vite middleware on `http://localhost:3000` |
| `npm run build` | Builds client static bundle (`dist/`) and compiles server into `dist/server.cjs` |
| `npm run start` | Boots the compiled production server (`node dist/server.cjs`) |
| `npm run test` | Runs the Vitest automated test suite |
| `npm run lint` | Runs TypeScript type checking (`tsc --noEmit`) |
| `npm run ccc` | Runs full Common Code Context compilation into `.llm-context/` |
| `npm run ccc:quick` | Runs fast incremental CCC update (`ccc -q`) |
| `npm run ccc:doctor` | Runs CCC system diagnostics and environment checks |

---

## 3. Architecture & Code Conventions

Nexus follows a **Bi-Modal Architecture**:
- **The Brain (Frontend):** React 19 SPA running in `src/`. Handles UI rendering, user intent capture, Monaco editor sessions, and client state in Zustand.
- **The Muscle (Backend):** Node.js/Express server in `server.ts`. Manages native Git execution, CCC semantic indexing, WebSocket streaming (`/nsp`), and Gemini API proxying.

### TypeScript & React Standards
- **Strict Typing:** All modules must be strictly typed. Avoid `any` where possible; define shared interfaces in `src/types.ts`.
- **Functional Components:** All React components must be functional components with React hooks.
- **Icons:** All icons must be imported from `lucide-react`. Do not embed raw SVG strings or use other icon libraries.
- **Styling:** Style components using Tailwind CSS utility classes. Avoid inline style objects and custom CSS files.
- **Animations:** Use `motion/react` for layout transitions and subtle entrance animations.
- **State Persistence:** UI and workspace state is managed via Zustand in `src/store/useStore.ts` with dual-layer persistence (localStorage + IndexedDB in `src/lib/db.ts`).

---

## 4. Developing Nexus Skills (Manifest v2)

Skills are portable units of procedural engineering intelligence that can be installed or contributed through the Skill Marketplace.

### Manifest v2 Schema
A skill defines its capabilities and metadata in a JSON structure:

```json
{
  "id": "css-architect",
  "name": "Design System Architect",
  "description": "Enforces design token consistency and responsive layouts.",
  "version": "1.0.0",
  "author": "Nexus Core",
  "triggers": ["layout", "styling", "theming"],
  "tools": ["FileSystem", "Linter", "StyleParser"],
  "retrievalRules": ["src/styles/**/*.css", "tailwind.config.js"],
  "workflows": ["enforce_design_tokens", "generate_responsive_layout"],
  "prompts": ["You are a senior Design Engineer. Prioritize intent-driven styling."],
  "permissions": ["fs:read", "fs:write"],
  "visual_priority": 85,
  "telemetry_mapping": {
    "latency": "render_time_ms",
    "errors": "css_warnings"
  },
  "insight_triggers": ["unbounded_container_width", "missing_dark_mode_tokens"]
}
```

### Packaging & Testing Skills
1. **Local Test:** Open the **Skills** tab in the UI and click **Submit Skill** or test locally by registering via `POST /api/skills/registry`.
2. **Export Package:** In the UI, use the **Export .nsk** action to download the bundle as a portable Nexus Skill package.
3. **Audit:** Ensure permissions are scoped minimally (e.g. avoid `fs:write` if the skill is read-only).

---

## 5. Pull Request & Verification Workflow

Before submitting a pull request:

1. **Run Tests:** Ensure all unit and integration tests pass:
   ```bash
   npm run test
   ```
2. **Check Types:** Ensure zero TypeScript compilation errors:
   ```bash
   npm run lint
   ```
3. **Verify Build:** Verify that production compilation succeeds without errors:
   ```bash
   npm run build
   ```
4. **Continuous Integration:** Pull requests trigger the automated GitHub Actions CI workflow (`.github/workflows/ci.yml`), which validates linting, tests, and bundling.
