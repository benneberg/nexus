# Nexus PRD
## Product Requirements Document
Version: 2.0
Status: Refined Specification - Autonomous Orchestration
Codename: Nexus
---
# 1. Product Overview
Nexus is a **Standalone Engineering Engine** designed for high-producing technical creators. It is the first platform where the primary creative environment is mobile, allowing developers to go from **Idea → System Design → Deployed Scaffold** in minutes using only a mobile device.

Nexus operates on a **Brain/Muscle split**: Mobile serves as the 'Brain' (Orchestration, Design, & Intent), while **Execution Nodes** (Cloud, Docker, or Desktop) serve as the 'Muscle' (Execution & Compilation).

Unlike traditional IDEs, Nexus introduces CCC (Structured Context Compilation), a deterministic semantic runtime that continuously models architecture, dependencies, implementation state, and intent alignment.
---
# 2. Strategic Positioning
## Nexus Is NOT
- a traditional IDE
- a text editor with AI
- a mobile code editor
- a wrapper around LLM APIs
## Nexus IS
- a semantic orchestration environment
- an AI-native engineering workspace
- a persistent software cognition system
- an autonomous engineering operating layer
---
# 3. Core Product Thesis
Traditional AI coding systems:
Files → Embeddings → LLM
Nexus:
Repository
→ CCC Semantic Runtime
→ Structured Retrieval
→ Orchestration Engine
→ Agents / Tools / Models
CCC acts as the authoritative semantic representation layer.
---
# 4. Core Product Principles
## 4.1 Intent-Driven Development
Users describe goals and architecture rather than manually implementing every detail.
---
## 4.2 Semantic Context Over Raw Tokens
Structured semantic retrieval replaces brute-force file injection.
---
## 4.3 Architecture First
The system optimizes for coherence, maintainability, and long-term alignment.
---
## 4.4 Card-Based Orchestration
The interface is not a file tree; it is a **Deck of PortableCards**. Users manage software by interacting with autonomous entities that possess their own telemetry, goals, and intelligence. The experience prioritizes steering, reviewing, and approving rather than manual file editing.
---
## 4.5 Standalone Creative Mission
Nexus is a primary creative environment. It provisions cloud-hosted Execution Nodes instantly, allowing for a complete Idea-to-Preview loop on mobile.
---
# 5. Target Users
## Primary
- AI-assisted developers
- indie hackers
- startup founders
- systems architects
- rapid prototypers
- AI-native engineering teams
## Secondary
- educational coding environments
- multimodal creators
- AI workflow researchers
- enterprise architecture teams
---
# 6. Core User Workflow
Intent
↓
CCC Retrieval
↓
Planning
↓
Artifact Generation
↓
Verification
↓
Approval
↓
Iteration
---
# 7. Strategic Scaffolding
### 7.1 Seed & Pivot
As a high-producer, I want to describe a concept on my phone, have Nexus provision a cloud node, and scaffold a full React/PostgreSQL app in seconds so I can test the MVP instantly.
### 7.2 Remote Orchestration
As an architect, I want to review an "Autonomous Insight" card about a race condition, swipe to "Approve Fix," and see the verification status update in real-time.
---
# 8. Core Features
# 8.1 Project Management
## Create Project
- blank workspace
- template scaffold
- import ZIP / Upload Files
- clone Git repository
- AI-generated scaffold
## Manage Projects (Workspace Settings)
- rename metadata
- description updates
- lifecycle management (purge/delete)
- runtime analytics (latency, storage, cache)
- archive / duplicate
- export ZIP
- push to GitHub
- workspace sharing
---
# 8.2 AI Workspace
## Capabilities
- streaming responses
- orchestration traces
- reasoning summaries
- tool execution logs
- artifact generation
- semantic retrieval visibility
- diff previews
- architecture previews
## Metrics
Per interaction:
- model used
- latency
- token usage
- retrieval stats
- orchestration steps
- estimated cost
---
# 8.3 Artifact System
Artifacts are redefined as **Autonomous System Cards**.
Examples:
- generated code
- architecture diagrams
- migrations
- patch sets (Diffs)
- Muscle Refactoring proposed shifts
- verification reports
- semantic graphs
- UI previews
- deployment plans
## Artifact Tabs
| Tab | Purpose |
|------|----------|
| Chat | Conversation & Multi-agent orchestration |
| Card Deck | Primary Orchestration |
| Code | Generated code & Refactoring previews |
| Diff | Side-by-side file changes |
| Preview | UI rendering |
| Logs | Tool execution |
| Metrics | Runtime analytics |
| CCC | Semantic context & Node searching |
| Graph | Dependency visualization |
| Settings | Workspace lifecycle & analytics |
---
# 8.4 CCC Integration
CCC is the canonical semantic runtime.
## Responsibilities
- semantic indexing
- searching & filtering (Name, Type, Metadata)
- architecture extraction
- dependency analysis
- intent alignment
- impact analysis
- context compilation
- orchestration retrieval
- semantic verification
---
# 8.5 Skill System
Skills are reusable procedural intelligence modules.
## Skill Examples
- React Skill
- FastAPI Skill
- Supabase Skill
- Deployment Skill
- Refactor Skill (Muscle Refactor)
- UI Generation Skill
- Voice Workflow Skill
## Skill Marketplace
- Discovery portal for third-party intelligence modules.
- Semantic validation for NSP-compliant bundles (.nsk).
- Versioning and dependency management.
- User ratings and download analytics.
## Skill Structure
```yaml
skill:
  name:
  description:
  triggers:
  tools:
  retrieval_rules:
  workflows:
  validations:
  prompts:
```

## 8.6 Tool Runtime

Built-In Tools

| Tool | Purpose |
|------|---------|
| GitHub | Repository operations |
| Filesystem | File editing |
| Terminal | Shell commands |
| CCC Query | Semantic retrieval |
| Browser Preview | Live rendering |
| Test Runner | Validation |
| Web Search | Research |
| Media Tools | Image/audio/video |
| Deployment | CI/CD workflows |

## 8.7 Multi-Agent System

Initial Agents

| Agent | Responsibility |
|-------|----------------|
| Planner | Task decomposition |
| Retriever | CCC retrieval |
| Builder | Artifact generation |
| Verifier | Validation |

## 8.8 Multimodal Workflows

Inputs
- screenshots
- voice
- PDFs
- diagrams
- repositories
- sketches

Outputs
- code
- diagrams
- UI
- voice
- images
- generated assets

## 8.9 intentidy UI Layer
A motion-driven, semantic projection of the workspace. It prioritizes high-level system health and 'Autonomous Insights' over line-by-line syntax.

## 9. UX Philosophy

Primary Interaction Layer
Conversation-centric orchestration workspace with **Rich Text / Markdown input** (Bold, Italic, Code, Link tags).

Workspace Priorities
- orchestration over editing
- artifacts over files
- cognition over navigation
- architecture over implementation detail

Advanced UX Features
- Responsive Shell: **Mobile-First drawer system** for project navigation on portrait devices.
- contextual drawers
- semantic inspectors with search capabilities
- docking panels
- command palette
- gesture-driven workflows
- adaptive layouts (optimized for iPhone/Safari mobile)

## 10. Performance Targets

| Metric | Goal |
|--------|------|
| Initial response | <500ms |
| Retrieval | <100ms |
| Context compilation | <1s |
| Streaming latency | realtime |
| Incremental indexing | background |

## 11. Security

Principles
- sandboxed execution
- encrypted storage
- scoped permissions
- audit logging
- BYOK model access

Supported Providers
- Xiaomi MiMo
- OpenAI
- Anthropic
- OpenRouter
- Groq
- local models

## 12. Monetization

Potential Models
- local-only free tier
- orchestration subscription
- hosted CCC runtime
- enterprise semantic indexing
- collaborative workspaces
- skill marketplace
- hosted memory graph

## 13. Long-Term Vision

Nexus evolves toward:
- autonomous engineering workflows
- persistent software cognition
- architecture-aware AI systems
- semantic CI/CD orchestration
- collaborative semantic workspaces
- distributed agent ecosystems
