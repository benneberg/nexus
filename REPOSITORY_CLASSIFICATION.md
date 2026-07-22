schema:
  version: 1
  compatible_with:
    - CCC
  generated_by: Repository Bootstrap Prompt
  generated_at: "2026-07-21T19:53:01-07:00"
  repository: Nexus

repository_type:
  value: WEB_APP
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - package.json
    - server.ts
    - src/App.tsx
  notes: Full-stack web application featuring Express backend and Vite/React frontend.

repository_status:
  value: ACTIVE
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - git commit history
    - TODO.md
    - package.json
  notes: Active development with completed TODO features and active scripts.

complexity:
  value: MODERATE
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - server.ts
    - src/store/useStore.ts
    - src/components/
  notes: Full-stack architecture with Express API routes, WebSocket real-time gateway, Zustand store, and virtualized components.

primary_language:
  value: TypeScript
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - tsconfig.json
    - package.json
    - "src/**/*.ts"
    - "src/**/*.tsx"
  notes: Strict TypeScript configured across server and client codebases.

secondary_languages:
  value:
    - HTML
    - CSS
    - JavaScript
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - index.html
    - src/index.css
    - dist/server.cjs
  notes: Standard web technologies for client rendering and bundled server distribution.

primary_framework:
  value: React
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - package.json
    - src/main.tsx
    - src/App.tsx
  notes: React 19 SPA served via Vite and Express.

build_system:
  value: Vite
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - package.json
    - vite.config.ts
  notes: Vite for frontend bundling and esbuild for server compilation.

package_manager:
  value: npm
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - package.json
  notes: Standard npm scripts and package declaration.

test_framework:
  value: Vitest
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - package.json
    - "src/__tests__/"
  notes: Vitest configured with @testing-library/react and jsdom.

workspace_or_single_repository:
  value: Single Repository
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - package.json
    - tsconfig.json
  notes: Single root package managing full-stack Express and Vite application.

repository_maturity:
  value: PROTOTYPE
  evidence_state: INFERRED
  confidence: HIGH
  evidence:
    - package.json (version 0.0.0)
    - metadata.json
  notes: High-fidelity AI engineering operating system prototype.

overall_confidence:
  value: HIGH
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - Full codebase inspection and successful lint/build compilation.
  notes: Complete verification of structure and execution output.

evidence_summary:
  value:
    - package.json
    - server.ts
    - metadata.json
    - src/App.tsx
    - src/store/useStore.ts
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - Direct verification of file trees and configuration entries.
  notes: ""

unknown_areas:
  value:
    - Production Cloud Run deployment manifests (handled via container platform).
  evidence_state: OBSERVED
  confidence: MEDIUM
  evidence:
    - Environment metadata indicates Cloud Run hosting environment.
  notes: Container specs managed externally by platform.
