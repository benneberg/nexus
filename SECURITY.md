# Security Policy

## Reporting Security Vulnerabilities

We take the security of Nexus seriously. If you discover a vulnerability or security issue, please do not disclose it publicly in GitHub Issues or pull requests.

Please report security issues via email to **security@nexus-engineering.dev** (or contact the repository maintainer directly). 

When reporting, please include:
- A description of the vulnerability and its potential impact.
- Step-by-step reproduction steps or a minimal proof-of-concept.
- Any suggested mitigations or remediation steps.

You should expect an acknowledgment within 48 hours and regular updates as the issue is investigated and patched.

---

## Supported Versions

| Version | Supported |
| :--- | :--- |
| `0.0.x` (Current `main` branch) | ✅ Supported |
| Prior branches / tags | ❌ Not supported |

---

## Core Security Invariants & Architecture

Nexus enforces strict security boundaries between the user interface ("Brain") and the execution runtime ("Muscle"):

### 1. Server-Side Secret Isolation
- All third-party API keys (including `GEMINI_API_KEY`) are kept exclusively on the server side (`server.ts`).
- Secrets are never bundled into client assets, exported to browser scripts, or sent in WebSocket payloads.
- Client requests for AI orchestration, code generation, and multi-brain consensus are proxied through authenticated server endpoints (`/api/orchestrate`).
- SDK instances (such as `@google/genai`) use lazy initialization inside endpoint handlers so missing or unconfigured keys do not cause container boot crashes.

### 2. Ingress & Rate Limiting Behind Cloud Proxies
- Express is configured with `app.set('trust proxy', 1)` to correctly inspect forwarded headers (`X-Forwarded-For`) from Cloud Run, Nginx, and reverse-proxy load balancers without IP spoofing vulnerabilities.
- Rate limiting is enforced via `express-rate-limit` on resource-intensive endpoints:
  - `/api/orchestrate` (AI execution proxy)
  - `/api/ccc/*` (Codebase indexing and compilation)
  - `/api/skills/registry` (Skill registration)
- Rate limiting key generators safely normalize IPv4/IPv6 client addresses behind container ingress routers.

### 3. Skill Sandbox & Permission Scoping
Skills in the Manifest v2 ecosystem are permission-scoped. Each skill declares its operational boundaries:
- `git:read` / `git:write` — Access to repository version control operations.
- `fs:read` / `fs:write` — Workspace filesystem modifications.
- `terminal:exec` — Execution of shell tasks.
- `network:fetch` — External HTTP access.

The execution engine audits these declared scopes before allowing skills to trigger autonomous actions.

### 4. Container Network Isolation
- Dev and production servers bind strictly to host `0.0.0.0` on port `3000` to comply with isolated container ingress networks.
- External access is mediated by reverse proxies; arbitrary listening ports are disabled.
