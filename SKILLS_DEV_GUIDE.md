# Nexus Skill Development Guide

Nexus Skills are portable units of engineering intelligence that encapsulate orchestration logic, retrieval rules, and autonomous workflows.

## 1. Skill Structure (NSP-Compliant)
A skill is defined by an `index.skill.json` manifest:

```json
{
  "id": "css-architect",
  "name": "Design System Architect",
  "version": "1.0.0",
  "triggers": ["layout", "styling", "theming"],
  "tools": ["FileSystem", "Linter", "StyleParser"],
  "retrievalRules": [
    "src/styles/**/*.css",
    "tailwind.config.js"
  ],
  "workflows": ["enforce_design_tokens", "generate_responsive_layout"],
  "prompts": {
    "system": "You are a senior Design Engineer. Prioritize intent-driven styling."
  }
}
```

## 2. Packaging
1. **Source**: Write your orchestration blocks in TypeScript.
2. **Compile**: Distill your logic into a semantic bundle.
3. **Verify**: Ensure the skill passes the NOI (Nexus Orchestration Intelligence) sandbox tests.

## 3. Submission Process
1. **Local Test**: Install the skill locally via `Initialize Workspace -> Import ZIP`.
2. **Distill**: Use the `nexus-cli distill --skill` command to produce the final payload.
3. **Publish**: In the **Skill System** view, click **Submit Skill**. Your module will be reviewed by the NOI for semantic safety before appearing in the Global Marketplace.

## 4. Execution Model
Skills run within the **Muscle** (Execution Node) but are steered by the **Brain** (Mobile Client) via the Nexus Synapse Protocol (NSP).
