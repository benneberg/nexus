# PURPOSE.md

## PRODUCT SUMMARY

Nexus is an **AI-native autonomous engineering operating system**. It reimagines software development as a collaborative "steering" experience rather than a manual line-by-line editing task. It splits the engineering lifecycle into two distinct execution layers:
- **The Brain (Orchestrator):** High-level architectural reasoning, intent distillation, and code generation (powered by Google Gemini models).
- **The Muscle (Runtime/Execution):** Autonomous filesystem updates, git synchronization, WebSocket stream gateway, and real-time environment telemetry.

The system emphasizes a **mobile-first, gesture-driven** interface (the "Card Deck") where complex codebases are viewed through semantic abstractions ("PCards") and relationship graphs (CCC - Common Code Context).

---

## PROBLEM STATEMENT

**Confidence: High**

Traditional IDEs (VS Code, JetBrains) were architected for fixed, desktop-bound, file-tree centric workflows. They suffer from two core limitations that Nexus solves:
1. **AI Integration:** Legacy IDEs treat AI as a sidecar autocompletion plugin. Nexus treats the AI as the **primary operator**, with the engineer acting as a Staff Architect overseeing the "intent stream."
2. **Mobility & Ergonomics:** Traditional IDEs are unusable on mobile or touch devices. Nexus provides a gesture-driven "triage and steer" interface capable of executing high-level architectural shifts without needing a physical keyboard or manual file editing.

---

## TARGET AUDIENCE

### 1. Intent-Driven Prototypers (Confidence: High)
Engineers and founders who move from "concept to multi-file scaffold" in seconds using natural language. They prioritize speed, architectural correctness, and rapid validation over manual boilerplate creation.

### 2. Distributive Engineering Staff & Lead Architects (Confidence: High)
Lead engineers managing AI agents across multiple repos. They can steer project "Brains" from any mobile device, reviewing "Muscle" execution outputs (builds, tests, linting, git status) via visual card stacks.

### 3. AI-First Developers (Confidence: High)
Developers who rely on LLMs for code generation and find manual file tree navigation and CLI commands to be bottlenecks to AI execution speed.

---

## VALUE PROPOSITION

- **Semantic Repository Navigation:** View projects as an indexed symbol relationship graph (Common Code Context / CCC) with virtualized rendering for instant repository navigation.
- **Intent Orchestration:** Guide multi-file feature additions and security refactors through natural language or voice commands rather than manual edits.
- **PCard Engineering Deck:** Triage build health, unit metrics, and architectural status via mobile-first visual cards.
- **NSP Telemetry Gateway:** Real-time WebSocket connection streaming system telemetry and instant skill registry sync, backed by HTTP fallback endpoints.
- **Custom Template Blueprint Engine:** Turn any active workspace into a reusable template scaffold with one click.

---

## CORE FEATURES & VERIFICATION STATUS

### Verified (Observed in Code & Verified by Tests)
- **CCC (Common Code Context) Indexer:** Real server-side symbol extractor (`/api/ccc/index`) mapping TypeScript/JavaScript workspace files to a graph structure with virtualized display (`@tanstack/react-virtual`).
- **Project Scaffold Blueprints:** Instant multi-file template instantiation for React PWAs, FastAPI backends, Chrome Extensions, and Data Science hubs.
- **Custom Template Engine:** One-click custom blueprint generation from active project workspaces.
- **Skill Marketplace:** Real server-side skill registry (`/api/skills/registry`) with `skills.json` file persistence, supporting installation, discovery, and contribution.
- **Security & Rate Limiting:** API rate limiters (`express-rate-limit`) applied to orchestration and CCC endpoints to prevent quota exhaustion.
- **Voice-to-Intent Speech Engine:** Integrated client-side Web Speech API voice command streaming.
- **Orchestration Chat:** Real-time AI steering interface proxying Gemini API calls server-side.
- **NSP Telemetry Stream:** Dual-mode real-time WebSocket telemetry with polling fallback.
- **Automated Testing Suite:** Vitest unit test suite covering store operations, component panels, SkillsView, and Gemini API parsing.

### Inferred & Future Roadmap
- **Cloud Database Persistence:** Moving file-backed storage (`skills.json`) to Cloud SQL / Firestore for enterprise multi-tenant sync.
- **Multi-Brain Orchestration:** Connecting multiple specialized LLMs in parallel.
