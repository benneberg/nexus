schema:
  version: 1
  compatible_with:
    - CCC
  generated_by: Repository Bootstrap Prompt
  generated_at: "2026-07-21T19:53:01-07:00"
  repository: Nexus

generator:
  value: Repository Bootstrap Engine
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - Bootstrap Execution Prompt
  notes: ""

schema_version:
  value: "1"
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - OUTPUT CONTRACT Schema Version 1
  notes: ""

generation_mode:
  value: DETERMINISTIC_IR
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - Output contract execution rules
  notes: ""

execution_mode:
  value: EXECUTION_VERIFIED
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - Successful execution of lint_applet and compile_applet
  notes: ""

detected_languages:
  value:
    - TypeScript
    - JavaScript
    - HTML
    - CSS
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - "package.json, *.ts, *.tsx, index.html, index.css"
  notes: ""

detected_frameworks:
  value:
    - React 19
    - Express 4
    - Tailwind CSS 4
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - package.json
  notes: ""

detected_build_system:
  value: Vite 6 & esbuild
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - package.json
    - vite.config.ts
  notes: ""

detected_package_manager:
  value: npm
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - package.json
  notes: ""

files_analysed:
  value:
    - package.json
    - metadata.json
    - server.ts
    - vite.config.ts
    - tsconfig.json
    - src/main.tsx
    - src/App.tsx
    - src/types.ts
    - src/store/useStore.ts
    - src/components/CCCInspector.tsx
    - src/components/SkillsView.tsx
    - src/components/ProjectSettings.tsx
    - src/components/workspace/ChatPanel.tsx
    - TODO.md
    - README.md
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - Direct view_file and list_dir verification
  notes: ""

evidence_coverage:
  value: "1.0"
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - Complete inspection and build verification of all core files
  notes: ""

unknown_coverage:
  value: "0.0"
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - Zero unknown critical files or dependencies
  notes: ""

overall_confidence:
  value: HIGH
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - Complete verification across execution and schema validation
  notes: ""

ccc_compatibility:
  value: COMPATIBLE
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - Schema version 1 and structured YAML intermediate representation
  notes: ""

purpose:
  value: Provide a deterministic, evidence-backed repository intermediate representation for human engineers and automated tooling.
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - Output contract definition
  notes: ""
