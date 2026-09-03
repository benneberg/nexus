# Security Policy

## Scope

Nexus is an experimental AI-native engineering workspace capable of interacting with repositories, executing Git operations, processing code context, and invoking external AI services.

Security is therefore particularly important around:

- repository access

- filesystem access

- Git operations

- AI credentials

- skill execution

- generated artifacts

- workspace state

---

## Current Security Posture

The current implementation includes several security-oriented controls:

- AI credentials remain server-side.

- Resource-intensive API routes use rate limiting.

- Git operations are performed through explicit backend routes.

- Skill manifests expose permission scopes.

- The application validates structured request data where applicable.

- The frontend does not receive the Gemini API key.

---

## Known Limitations

Nexus is not currently presented as a production-hardened multi-tenant platform.

Additional work is required for:

- strong authentication

- authorization

- tenant isolation

- filesystem sandboxing

- production secret management

- comprehensive security testing

- audit logging

- production deployment monitoring

The current architecture assumes a trusted or controlled deployment environment.

---

## Reporting

Please use GitHub's private vulnerability reporting mechanism where available.

Do not publish credentials, API keys, private repository contents, or exploitable security details in public issues.

---

## Supported Version

The current `main` branch is the supported development version.

No long-term support commitment is currently made.
