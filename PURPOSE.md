# PURPOSE.md

## PRODUCT SUMMARY

Nexus is an **AI-native engineering workspace** that reimagines software development as a collaborative "steering" experience rather than a manual editing task. It splits the engineering lifecycle into two distinct zones:
- **The Brain (Orchestrator):** High-level architectural reasoning and intent distillation (powered by Gemini models).
- **The Muscle (Runtime/Execution):** Autonomous filesystem operations, git synchronization, and live environment telemetry.

The system emphasizes a **mobile-first, gesture-driven** interface (the "Card Deck") where complex codebases are viewed through semantic abstractions ("PCards") and relationship graphs (CCC).

## PROBLEM STATEMENT

**Confidence: High**
Traditional IDEs (VS Code, IntelliJ) are designed for fixed, large-screen, file-centric workflows. They struggle in two areas that Nexus addresses:
1. **AI Integration:** Existing IDEs treat AI as a "copilot" plugin. Nexus treats the AI as the **primary operator**, with the human acting as a "Staff Engineer" overseeing the "intent stream."
2. **Mobility:** Traditional IDEs are nearly unusable on mobile. Nexus provides a "triage and steer" interface capable of managing high-level architectural shifts without needing a keyboard-heavy manual editor.

## TARGET AUDIENCE

### 1. Intent-Driven Prototypers (Confidence: High)
Developers who want to move from "concept to scaffold" in minutes using natural language. They prioritize rapid iteration and architectural correctness over boilerplate writing.

### 2. Distributive Engineering Teams (Confidence: Medium)
Teams using a "Review-First" workflow where lead architects can steer the "Brain" of a project from any device, reviewing "Muscle" executions (builds, tests) through mobile-safe visual cards.

### 3. AI-First Engineers (Confidence: High)
Users who have moved entirely to LLM-driven development and find traditional file-trees and CLI-heavy workflows to be a bottleneck for AI speed.

## VALUE PROPOSITION

- **Semantic Navigation:** View projects not as folders, but as a graph of symbols (CCC/NSP).
- **The "Steering" Paradigm:** Control complex refactors through high-level intent rather than manual line edits.
- **PCard Framework:** Visualizing progress, unit health, and architectural "energy" through a mobile-first card deck.
- **Autonomous Sync:** The "Muscle" node handles git versions and deployment automatically as the "Brain" distills new instructions.

## CORE FEATURES

### Verified (Exists in Code)
- **CCC (Common Code Context) Indexer:** A semantic symbol extractor that maps files to a searchable graph.
- **Project Blueprints:** Intelligent multi-file scaffolding for diversos stacks (PWA, FastAPI, CRX).
- **Skill Marketplace:** A registry for discovering, installing, and contributing architectural neural modules.
- **Card Deck UI:** A mobile-optimized stack for triaging project status.
- **Orchestration Chat:** A real-time interface for prompting the "Brain" to generate logic.
- **Artifact Inspector:** A multi-tab viewer for code, builds, and architectural graphs.
- **Automated Testing Suite:** Integrated Vitest environment for core logic validation.

### Inferred (Low/Medium Confidence)
- **NSP (Nexus Stream Protocol):** A real-time protocol for streaming telemetry from runtime nodes (currently simulated with random data).
- **Distillation Pipeline:** The process of turning a prompt into a series of atomic filesystem changes (currently simulated with `setTimeout`).

### Future (From PRD / TODOs)
- **Multimodal Control:** Real voice-driven engineering commands.
- **Skill Marketplace:** Modularizing AI capabilities (e.g., "Postgres Expert," "Security Auditor") into installable skill nodes.
- **Distributed Cloud Execution:** Hosting the "Muscle" layer on remote containers.
