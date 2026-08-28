// Auto-extracted TypeScript type definitions
// Generated: 2026-08-28 03:34 UTC
// Types annotated with 'used in:' show cross-file import relationships.


// -- src/lib/cccQueryEngine.ts --
export type Operator = '=' | '!=' | '>' | '<' | '>=' | '<=' | 'contains' | 'startsWith' | 'endsWith' | 'in' | 'matches';
// used in: src/components/CCCInspector.tsx

export interface QueryCondition {
  field: string;
  operator: Operator;
  value: any;
}
// used in: src/components/CCCInspector.tsx

export interface ConditionGroup {
  logicalOp: 'AND' | 'OR';
  conditions: (QueryCondition | ConditionGroup)[];
}
// used in: src/components/CCCInspector.tsx

export interface CCCAggregateResult {
  totalNodes: number;
  byType: Record<string, number>;
  avgConnections: number;
  maxConnections: { id: string; name: string; count: number } | null;
  criticalHubsCount: number;
  orphanNodesCount: number;
  totalLinesOfCode: number;
  dependencyDensityRatio: number;
}

export interface CCCPresetQuery {
  id: string;
  name: string;
  description: string;
  dsl: string;
  conditionGroup: ConditionGroup;
}


// -- src/lib/gemini.ts --
export interface OrchestrationOptions {
  brainMode?: 'flash' | 'deep-reasoning' | 'multi-brain' | 'security-auditor';
  model?: string;
  context?: any;
}


// -- src/types.ts --
export enum ArtifactType {
  CODE = 'code',
  DIFF = 'diff',
  GRAPH = 'graph',
  REPORT = 'report',
  PREVIEW = 'preview',
  MEDIA = 'media',
  CCC = 'ccc'
}
// used in: src/components/CCCGraphEditor.tsx, src/components/workspace/ArtifactPanel.tsx, src/components/workspace/ChatPanel.tsx, src/store/useStore.ts

export interface Artifact {
  id: string;
  projectId: string;
  type: ArtifactType;
  title: string;
  content: string;
  metadata?: Record<string, any>;
  createdAt: number;
  verificationState?: 'SUCCESS' | 'FAILURE' | 'PENDING';
}
// used in: src/store/useStore.ts

export interface OrchestrationStep {
  id: string;
  label: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  details?: string;
  timestamp: number;
}
// used in: src/store/useStore.ts

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  reasoning?: string;
  graphUpdate?: string;
  retrievalNodes?: string[];
  steps?: OrchestrationStep[];
  artifactsIds?: string[];
  timestamp: number;
  brainMode?: 'flash' | 'deep-reasoning' | 'multi-brain' | 'security-auditor';
  telemetry?: {
    model: string;
    latency: number;
    tokens: number;
    tools: string[];
    brainMode?: string;
  };
  multiBrainTrace?: {
    plannerModel?: string;
    verifierModel?: string;
    consensusStatus?: string;
    auditedAspects?: string[];
  };
}
// used in: src/components/workspace/ChatPanel.tsx, src/store/useStore.ts

export interface Project {
  id: string;
  name: string;
  description: string;
  scaffoldType: string;
  createdAt: number;
  updatedAt: number;
  gitStatus?: GitStatus;
  status: 'active' | 'archived';
  gitUrl?: string;
}
// used in: src/store/useStore.ts

export interface GitCommit {
  hash: string;
  shortHash: string;
  author: string;
  date: string;
  message: string;
}
// used in: src/components/GitPanel.tsx

export interface GitStatus {
  initialized?: boolean;
  branch: string;
  isDirty: boolean;
  ahead: number;
  behind: number;
  stagedFiles: string[];
  unstagedFiles: string[];
  untrackedFiles?: string[];
  isClean?: boolean;
  remoteUrl?: string;
  commits?: GitCommit[];
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  version: string;
  author: string;
  category?: string;
  downloads?: number;
  rating?: number;
  price?: string; // "Free" or price
  triggers: string[];
  tools: string[];
  retrievalRules: string[];
  workflows: string[];
  validations: string[];
  prompts: string[];
  dependencies?: string[];
  enabled?: boolean;
  latestVersion?: string;
  changelog?: string;
  updatedAt?: number;
  // Manifest v2 UI & Telemetry Bindings
  permissions?: string[];
  visual_priority?: number | string;
  telemetry_mapping?: Record<string, string>;
  insight_triggers?: string[];
}
// used in: src/components/SkillsView.tsx, src/store/useStore.ts

export interface TemplateFile {
  path: string;
  content: string;
  type: ArtifactType;
}

export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  category: 'Frontend' | 'Backend' | 'Fullstack' | 'Mobile';
  stack: string[];
  scaffoldCmd: string;
  icon: string;
  initialFiles: TemplateFile[];
  config?: Record<string, any>;
}

export type CCCGraphType = 'Dependency' | 'Architecture' | 'Intent';

export interface CCCObject {
  type: 'Project' | 'Module' | 'Symbol' | 'Dependency' | 'Route' | 'Schema' | 'Service' | 'Workflow' | 'Capability' | 'Intent' | 'Artifact';
  id: string;
  name: string;
  metadata: Record<string, any>;
  connections: string[]; // List of other symbol IDs
  graphType?: CCCGraphType;
}
// used in: src/components/CCCInspector.tsx, src/lib/ccc.ts, src/lib/cccQueryEngine.ts

export interface CCCQueryRequest {
  query: string;
  scope?: 'project' | 'file' | 'global';
  depth?: number;
  include?: Array<'symbols' | 'routes' | 'dependencies' | 'schemas' | 'services'>;
}
// used in: src/store/useStore.ts

export interface CCCQueryResponse {
  symbols: Array<{ id: string; name: string; type: string; file?: string; signature?: string }>;
  dependencies: Array<{ name: string; version?: string }>;
  related_files: Array<{ path: string; relevance: number }>;
  confidence: number;
}
// used in: src/store/useStore.ts

export interface CCCIR {
  nodes: CCCObject[];
  lastUpdated: number;
}
// used in: src/components/CCCInspector.tsx, src/lib/ccc.ts, src/lib/cccQueryEngine.ts, src/store/useStore.ts

export type OrchestrationEventType =
  | 'USER_MESSAGE_RECEIVED'
  | 'CCC_CONTEXT_BUILT'
  | 'PLAN_GENERATED'
  | 'ARTIFACT_CREATED'
  | 'FILES_MODIFIED'
  | 'TOOL_EXECUTED'
  | 'VERIFICATION_COMPLETED'
  | 'TASK_APPROVED'
  | 'ERROR_OCCURRED';

export interface OrchestrationEvent {
  event_id: string;
  type: OrchestrationEventType;
  timestamp: number;
  session_id?: string;
  project_id?: string;
  payload: Record<string, any>;
}
// used in: src/store/useStore.ts

export interface ModelInfo {
  id: string;
  name: string;
  contextWindow: string;
  reasoning: boolean;
  inputPrice?: string;
  outputPrice?: string;
  description?: string;
}

export interface ModelProvider {
  id: string;
  name: string;
  endpoint: string;
  active: boolean;
  capabilities: Array<'chat' | 'reasoning' | 'multimodal' | 'embeddings' | 'speech' | 'voice' | 'image'>;
  models: ModelInfo[];
  latencyMs?: number;
  status: 'connected' | 'unreachable' | 'configured';
  authType: 'api-key' | 'bearer' | 'local';
}
// used in: src/store/useStore.ts

export interface ToolDefinition {
  id: string;
  name: string;
  description: string;
  category: 'filesystem' | 'git' | 'terminal' | 'ccc' | 'browser' | 'test' | 'search' | 'media' | 'deploy';
  permissions: string[];
  inputs: Record<string, any>;
  outputs: Record<string, any>;
  execution_mode: 'sync' | 'async' | 'streaming' | 'background';
  builtin?: boolean;
}
// used in: src/store/useStore.ts

export interface CognitiveMemory {
  memory_id: string;
  memory_type: 'Session' | 'Project' | 'User' | 'Intent' | 'Skill';
  timestamp: number;
  scope: string;
  content: Record<string, any>;
  confidence?: number;
}
// used in: src/store/useStore.ts

export interface PCard {
  pcard_id: string;
  identity: {
    name: string;
    tagline: string;
  };
  runtime: {
    build_status: 'SUCCESS' | 'FAILURE' | 'PENDING';
    telemetry: {
      latency: number;
      errors: number;
    };
  };
  intent_layer: {
    active_goals: string[];
    blockers: string[];
  };
  autonomous_insights: {
    observation: string;
    suggestions: string[];
  }[];
  // New Seed/Draft fields
  type?: 'SYSTEM_CARD' | 'PROJECT_DRAFT';
  creation_status?: {
    phase: string;
    progress: number;
    current_action: string;
  };
  proposed_architecture?: string[];
  quick_actions?: string[];
}
// used in: src/components/CardDeck.tsx, src/store/useStore.ts

export type ViewType = 'workspace' | 'artifacts' | 'skills' | 'models' | 'settings' | 'ccc' | 'deck' | 'git' | 'marketplace' | 'info' | 'dashboard';
// used in: src/store/useStore.ts

export interface TelemetryStream {
  cpu: number;
  memory: number;
  network: number;
  latency: number;
  uptime: string;
}

export interface ActivityLog {
  id: string;
  projectId?: string;
  text: string;
  timestamp: number;
  type: 'create' | 'git' | 'skill' | 'scaffold' | 'other';
}

export interface AppState {
  projects: Project[];
  currentProjectId: string | null;
  pinnedProjectIds: string[];
  dashboardWidgets: string[];
  recentActivity: ActivityLog[];
  messages: Message[];
  artifacts: Artifact[];
  skills: Skill[]; // Installed skills
  marketplaceSkills: Skill[]; // Available in marketplace
  templates: ProjectTemplate[];
  cccIR: Record<string, CCCIR>;
  pCards: Record<string, PCard[]>; // ProjectID -> PCards
  activeView: ViewType;
  isOrchestrating: boolean;
  currentStepIndex: number;
  telemetryStream: TelemetryStream;
  pendingRefactor: {
    artifactId: string;
    originalContent: string;
    proposedContent: string;
    improvements: string[];
  } | null;
  orchestrationEvents: OrchestrationEvent[];
  modelProviders: ModelProvider[];
  tools: ToolDefinition[];
  cognitiveMemories: CognitiveMemory[];
}
// used in: src/store/useStore.ts
