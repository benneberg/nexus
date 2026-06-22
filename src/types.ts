export enum ArtifactType {
  CODE = 'code',
  DIFF = 'diff',
  GRAPH = 'graph',
  REPORT = 'report',
  PREVIEW = 'preview',
  MEDIA = 'media',
  CCC = 'ccc'
}

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

export interface OrchestrationStep {
  id: string;
  label: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  details?: string;
  timestamp: number;
}

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
  telemetry?: {
    model: string;
    latency: number;
    tokens: number;
    tools: string[];
  };
}

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

export interface GitStatus {
  branch: string;
  isDirty: boolean;
  ahead: number;
  behind: number;
  stagedFiles: string[];
  unstagedFiles: string[];
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  version: string;
  author: string;
  downloads?: number;
  rating?: number;
  price?: string; // "Free" or price
  triggers: string[];
  tools: string[];
  retrievalRules: string[];
  workflows: string[];
  validations: string[];
  prompts: string[];
}

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

export interface CCCObject {
  type: 'Project' | 'Module' | 'Symbol' | 'Dependency' | 'Route' | 'Schema' | 'Service' | 'Workflow' | 'Capability' | 'Intent' | 'Artifact';
  id: string;
  name: string;
  metadata: Record<string, any>;
  connections: string[]; // List of other symbol IDs
}

export interface CCCIR {
  nodes: CCCObject[];
  lastUpdated: number;
}

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

export type ViewType = 'workspace' | 'artifacts' | 'skills' | 'models' | 'settings' | 'ccc' | 'deck' | 'git' | 'marketplace' | 'info';

export interface TelemetryStream {
  cpu: number;
  memory: number;
  network: number;
  latency: number;
  uptime: string;
}

export interface AppState {
  projects: Project[];
  currentProjectId: string | null;
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
}
