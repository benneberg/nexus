***Temp***
Add github issues
Issue 1: Tree-sitter / TypeScript Compiler API Integration for Deep AST Extraction
Type: Enhancement / Performance

Description: Currently, /api/ccc/index uses pattern scanning and token matching when native ccc is absent. Upgrade the fallback parser to use the TypeScript Compiler API (ts.createSourceFile) to extract comprehensive call-hierarchy graphs, interface references, and precise symbol types.

Issue 2: Ephemeral Execution Sandboxes for Untrusted Generated Code
Type: Security / Feature

Description: Isolate the backend execution runtime ("Muscle") into ephemeral sandboxed containers (e.g. WebAssembly micro-runtimes or isolated container nodes) to execute generated code without exposing the host container.

Issue 3: Live OS Process Telemetry Pipeline
Type: Feature / Observability

Description: Connect the /nsp WebSocket stream and /api/telemetry endpoint to actual Node.js runtime process stats (process.cpuUsage(), process.memoryUsage(), event loop lag) to drive live dashboard gauges alongside simulated health feeds.

Issue 4: Multi-Operator Concurrent Room Collaboration
Type: Feature

Description: Extend the /nsp WebSocket gateway with room management and CRDT/presence broadcasting so multiple developers can steer the same workspace simultaneously with shared intent traces.