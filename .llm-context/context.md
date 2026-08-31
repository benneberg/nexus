# AI Agent Operational Context

This document provides critical runtime constraints, conventions, and operational instructions specifically for automated coding agents working within this repository.

---

## 1. Authoritative Documentation Map

- **Product purpose & usage:** `README.md`
- **Technical design & architecture:** `ARCHITECTURE.md`
- **Development & skill authoring:** `CONTRIBUTING.md`
- **Security & vulnerability policy:** `SECURITY.md`
- **Codebase semantic artifacts:** `.llm-context/context-manifest.json` (token estimates and recommended artifact selection)

---

## 2. Inviolable Runtime Invariants

1. **Port & Host Hardening:**
   - The server **MUST** listen exclusively on port `3000` bound to host `0.0.0.0`.
   - Never change the port or attempt to read dynamic port environment variables. The Cloud Run reverse proxy routes external traffic strictly to port 3000.
2. **Server-Side Secret Isolation:**
   - `GEMINI_API_KEY` and all third-party secrets must **NEVER** be referenced in client code (`src/`).
   - Secrets are accessible only on the server (`server.ts`) via `process.env`.
   - Never introduce UI inputs or modals for users to type API keys.
3. **Build & Bundling Flow:**
   - Production build command is `npm run build`, which executes `vite build` followed by `esbuild server.ts --bundle --platform=node --format=cjs --packages=external --sourcemap --outfile=dist/server.cjs`.
   - The production server entry point is `node dist/server.cjs`. Do not introduce separate server compilation steps that break this single bundle.
4. **Code is the Source of Truth:**
   - If historical notes conflict with code and passing tests, trust the code and tests.
   - Do not modify code merely to match obsolete documentation.

---

## 3. Dangerous Areas & Common Traps

- **Dev Server Restarts:** After editing `server.ts` routes, middlewares, or dev script configurations, restart the development server process.
- **WebSocket Route Invariant:** The WebSocket gateway is mounted on path `/nsp` on the HTTP server. Do not remove the path option or change the path without updating both `server.ts` and `src/App.tsx`.
- **Proxy Headers:** `server.ts` sets `app.set('trust proxy', 1)`. When adding rate limiters with `express-rate-limit`, ensure key generators account for trusted forwarded headers.
- **Client Persistence:** Zustand store in `src/store/useStore.ts` synchronizes with IndexedDB asynchronously. In Node/Vitest test environments where `indexedDB` is undefined, `src/lib/db.ts` safely returns null/noop. Do not remove this guard.
- **Tailwind CSS v4:** Tailwind is configured via `@tailwindcss/vite` plugin in `vite.config.ts` and imported via `@import "tailwindcss";` in `src/index.css`. Do not add a legacy `tailwind.config.js` or PostCSS plugins.
- **Icons:** All UI icons must be imported from `lucide-react`.

---

## 4. CCC (Common Code Context) CLI Commands

When inspecting or refreshing codebase context:
```bash
# Fast incremental update of .llm-context/
npm run ccc:quick     # (runs ccc -q)

# Full context re-compilation
npm run ccc           # (runs ccc)

# Query symbols, schemas, or routes directly
ccc query --format json "<symbol_name>"

# Inspect extracted AST entities for a specific file
ccc inspect src/types.ts

# Run environment diagnostics
npm run ccc:doctor    # (runs ccc --doctor)
```

---

## 5. Post-Task Observation Logging

After completing an AI agent interaction on this repository, append your session observations to `.llm-context/ai-observations.md` using the template provided therein.
