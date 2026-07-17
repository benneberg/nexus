import { create } from 'zustand';
import { AppState, Project, Message, Artifact, ArtifactType, OrchestrationStep, Skill, CCCIR, ViewType, PCard } from '../types';
import { setItem, getItem } from '../lib/db';

interface AppActions {
  addProject: (project: Project) => void;
  setCurrentProject: (id: string | null) => void;
  addMessage: (message: Message) => void;
  addArtifact: (artifact: Artifact) => void;
  updateArtifact: (id: string, updates: Partial<Artifact>) => void;
  setOrchestrating: (val: boolean) => void;
  setSteps: (messageId: string, steps: OrchestrationStep[]) => void;
  updateStep: (messageId: string, stepId: string, updates: Partial<OrchestrationStep>) => void;
  addSkill: (skill: Skill) => void;
  removeSkill: (skillId: string) => void;
  installSkill: (skillId: string) => void;
  contributeSkill: (skill: Omit<Skill, 'id' | 'downloads' | 'rating'>) => void;
  updateCCC: (projectId: string, ir: CCCIR) => void;
  setActiveView: (view: ViewType) => void;
  updateTelemetryStream: (data: Partial<AppState['telemetryStream']>) => void;
  updatePCardTelemetry: (projectId: string, pcardId: string, latency: number, errors: number) => void;
  updatePCardInsight: (projectId: string, pcardId: string, insight: string) => void;
  updateGitStatus: (projectId: string, status: Partial<AppState['projects'][0]['gitStatus']>) => void;
  deleteProject: (projectId: string) => void;
  archiveProject: (projectId: string) => void;
  duplicateProject: (projectId: string) => void;
  updateProject: (projectId: string, updates: Partial<Project>) => void;
  importProjectFromZip: (name: string, file: File) => void;
  cloneProjectFromGit: (name: string, url: string) => void;
  initiateRefactor: (artifactId: string) => void;
  applyRefactor: () => void;
  rejectRefactor: () => void;
  togglePinProject: (projectId: string) => void;
  reorderWidgets: (widgets: string[]) => void;
  removeWidget: (widgetId: string) => void;
  addWidget: (widgetId: string) => void;
  addActivityLog: (text: string, type: 'create' | 'git' | 'skill' | 'scaffold' | 'other', projectId?: string) => void;
  stageFile: (projectId: string, file: string) => void;
  unstageFile: (projectId: string, file: string) => void;
  commitChanges: (projectId: string, message: string) => void;
  pushChanges: (projectId: string) => void;
  fetchChanges: (projectId: string) => void;
  setPCards: (projectId: string, cards: PCard[]) => void;
  loadPersistedState: () => Promise<void>;
  saveAsTemplate: (projectId: string, name: string, description: string) => void;
  fetchMarketplaceSkills: () => Promise<void>;
}

const getLocalItem = <T>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.error('Error parsing localStorage key:', key, e);
    return defaultValue;
  }
};

export const useStore = create<AppState & AppActions>((set) => ({
  activeView: (typeof window !== 'undefined' && localStorage.getItem('nexus_activeView') as ViewType) || 'dashboard',
  pinnedProjectIds: ['nexus-core'],
  dashboardWidgets: ['pinned-projects', 'recent-activity', 'scaffold-templates', 'telemetry-status'],
  recentActivity: [
    {
      id: 'act-1',
      projectId: 'nexus-core',
      text: 'Compiled the semantic index (CCC) for Nexus Core',
      timestamp: Date.now() - 3600000 * 2,
      type: 'scaffold'
    },
    {
      id: 'act-2',
      projectId: 'nexus-core',
      text: 'Added React Expert skill to the registry',
      timestamp: Date.now() - 3600000,
      type: 'skill'
    }
  ],
  telemetryStream: {
    cpu: 18,
    memory: 42,
    network: 12,
    latency: 88,
    uptime: '12d 4h'
  },
  pendingRefactor: null,
  projects: getLocalItem<Project[]>('nexus_projects', [
    {
      id: 'nexus-core',
      name: 'Nexus Core',
      description: 'The main Nexus prototype workspace',
      scaffoldType: 'Next.js + Tailwind',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      status: 'active'
    }
  ]),
  currentProjectId: (typeof window !== 'undefined' && localStorage.getItem('nexus_currentProjectId')) || 'nexus-core',
  messages: getLocalItem<Message[]>('nexus_messages', [
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Hello, I am the Nexus Semantic Orchestrator. I have compiled the semantic index (CCC) for your current workspace. How can I assist your engineering work today?',
      timestamp: Date.now(),
      steps: [
        { id: '1', label: 'CCC Semantic Compilation', status: 'completed', timestamp: Date.now() },
      ]
    }
  ]),
  artifacts: getLocalItem<Artifact[]>('nexus_artifacts', []),
  skills: getLocalItem<Skill[]>('nexus_skills', [
    {
      id: 'react-skill',
      name: 'React Expert',
      description: 'Advanced React patterns and hooks orchestration',
      version: '1.2.0',
      author: 'Nexus Core',
      triggers: ['UI', 'component', 'hook'],
      tools: ['Filesystem', 'Linter'],
      retrievalRules: ['src/**/*.tsx'],
      workflows: ['generate_component'],
      validations: ['Typecheck'],
      prompts: ['System: You are an expert React architect.']
    }
  ]),
  marketplaceSkills: [
    {
      id: 'github-integration',
      name: 'GitHub Sync & Clone',
      description: 'Clone remote repositories directly into new Nexus workspaces, and push code changes back to GitHub securely.',
      version: '1.5.0',
      author: 'GitOps Core',
      downloads: 9800,
      rating: 4.9,
      price: 'Free',
      triggers: ['github', 'clone', 'push', 'git', 'sync'],
      tools: ['GitClient', 'CredentialManager'],
      retrievalRules: ['.github/**/*', '.git/**/*'],
      workflows: ['clone_repository', 'push_code_changes'],
      validations: ['GitAuth', 'BranchSync'],
      prompts: ['System: Orchestrate clean commit history. Ensure credentials are secure.']
    },
    {
      id: 'tailwind-wizard',
      name: 'Tailwind Wizard',
      description: 'Zero-config utility-first styling automation.',
      version: '2.1.0',
      author: 'DesignOps',
      downloads: 12400,
      rating: 4.9,
      price: 'Free',
      triggers: ['style', 'css', 'layout'],
      tools: ['FileEditor'],
      retrievalRules: ['**/*.css', 'tailwind.config.ts'],
      workflows: ['apply_style'],
      validations: ['CSSLint'],
      prompts: ['System: Design with intent.']
    },
    {
      id: 'advanced-git',
      name: 'Advanced Git Operations',
      description: 'Rebase orchestration, cherry-pick automation, and conflict resolution intelligence.',
      version: '1.0.5',
      author: 'GitFlow',
      downloads: 5400,
      rating: 4.8,
      price: 'Free',
      triggers: ['rebase', 'merge', 'git'],
      tools: ['GitClient'],
      retrievalRules: ['.git/**/*'],
      workflows: ['resolve_conflicts'],
      validations: ['GitStatus'],
      prompts: ['System: Handle history with care.']
    },
    {
      id: 'dockerize',
      name: 'Dockerize Application',
      description: 'Automated containerization with optimized multi-stage build generation.',
      version: '1.2.0',
      author: 'CloudNative',
      downloads: 8200,
      rating: 4.7,
      price: '$2/mo',
      triggers: ['docker', 'container', 'deploy'],
      tools: ['DockerEngine'],
      retrievalRules: ['Dockerfile', 'docker-compose.yml'],
      workflows: ['generate_dockerfile'],
      validations: ['DockerLinter'],
      prompts: ['System: Minimize image size.']
    },
    {
      id: 'db-gen',
      name: 'Database Schema Generator',
      description: 'Transform natural language into optimized SQL schemas and Prisma models.',
      version: '2.0.1',
      author: 'DataSense',
      downloads: 15400,
      rating: 4.9,
      price: 'Free',
      triggers: ['schema', 'database', 'sql'],
      tools: ['DatabaseClient'],
      retrievalRules: ['schema.sql', '**.prisma'],
      workflows: ['generate_schema'],
      validations: ['SQLCheck'],
      prompts: ['System: Enforce relational integrity.']
    }
  ],
  templates: [
    {
       id: 'react-pwa',
       name: 'React PWA',
       description: 'Offline-ready React app with Service Workers and manifest configuration.',
       category: 'Frontend',
       stack: ['Vite', 'React', 'TypeScript', 'Tailwind', 'Workbox'],
       scaffoldCmd: 'npx create-pwa-app',
       icon: 'Zap',
       initialFiles: [
         {
           path: 'src/service-worker.ts',
           type: ArtifactType.CODE,
           content: `// Service Worker for PWA\nself.addEventListener('fetch', (event) => {\n  // Implementation\n});`
         },
         {
           path: 'manifest.json',
           type: ArtifactType.CODE,
           content: `{\n  "name": "Nexus PWA",\n  "short_name": "Nexus",\n  "start_url": "."\n}`
         }
       ]
    },
    {
       id: 'fastapi-node',
       name: 'FastAPI Backend',
       description: 'High-performance Python backend with Pydantic v2 and async support.',
       category: 'Backend',
       stack: ['Python', 'FastAPI', 'Pydantic', 'SQLAlchemy'],
       scaffoldCmd: 'pip install fastapi',
       icon: 'Cpu',
       initialFiles: [
         {
           path: 'main.py',
           type: ArtifactType.CODE,
           content: `from fastapi import FastAPI\n\napp = FastAPI()\n\n@app.get("/")\ndef read_root():\n    return {"Hello": "Nexus"}\n`
         },
         {
           path: 'requirements.txt',
           type: ArtifactType.CODE,
           content: 'fastapi\nuvicorn'
         }
       ]
    },
    {
       id: 'react-fastapi',
       name: 'Fullstack React + FastAPI',
       description: 'Combined architecture with a React frontend and FastAPI backend.',
       category: 'Fullstack',
       stack: ['Vite', 'React', 'FastAPI', 'PostgreSQL'],
       scaffoldCmd: 'nexus create fullstack',
       icon: 'LayoutGrid',
       initialFiles: [
         {
           path: 'frontend/src/App.tsx',
           type: ArtifactType.CODE,
           content: 'export default function App() { return <h1>Nexus Fullstack</h1> }'
         },
         {
           path: 'backend/main.py',
           type: ArtifactType.CODE,
           content: 'from fastapi import FastAPI\napp = FastAPI()'
         }
       ]
    },
    {
       id: 'supabase-fullstack',
       name: 'Fullstack + Supabase',
       description: 'React application with Supabase for Auth, Database, and Realtime.',
       category: 'Fullstack',
       stack: ['React', 'Supabase', 'TypeScript', 'Tailwind'],
       scaffoldCmd: 'nexus create supabase',
       icon: 'Database',
       initialFiles: [
         {
           path: 'src/lib/supabase.ts',
           type: ArtifactType.CODE,
           content: `import { createClient } from '@supabase/supabase-js';\n\nconst supabaseUrl = import.meta.env.VITE_SUPABASE_URL;\nconst supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;\n\nexport const supabase = createClient(supabaseUrl, supabaseAnonKey);`
         }
       ]
    },
    {
       id: 'chrome-ext',
       name: 'AI Chrome Extension',
       description: 'Manifest V3 extension with built-in sidepanel and AI processing hooks.',
       category: 'Frontend',
       stack: ['Vite', 'React', 'CRXJS', 'Tailwind'],
       scaffoldCmd: 'npx create-chrome-ext',
       icon: 'Box',
       initialFiles: [
         {
           path: 'manifest.json',
           type: ArtifactType.CODE,
           content: `{\n  "manifest_version": 3,\n  "name": "Nexus Extension",\n  "version": "1.0.0",\n  "side_panel": { "default_path": "sidepanel.html" }\n}`
         }
       ]
    },
    {
       id: 'data-science',
       name: 'Data Science Hub',
       description: 'Python environment for EDA and model orchestration with Jupyter integration.',
       category: 'Backend',
       stack: ['Python', 'Pandas', 'Scikit-learn', 'Jupyter'],
       scaffoldCmd: 'pip install pandas scikit-learn jupyter',
       icon: 'Activity',
       initialFiles: [
         {
           path: 'notebook.ipynb',
           type: ArtifactType.CODE,
           content: `{"cells": [], "metadata": {}, "nbformat": 4, "nbformat_minor": 5}`
         }
       ]
    }
  ],
  cccIR: getLocalItem<Record<string, CCCIR>>('nexus_cccIR', {
    'nexus-core': {
      nodes: [
        { type: 'Project', id: 'root', name: 'Nexus Core', metadata: {}, connections: ['auth-service'] },
        { type: 'Service', id: 'auth-service', name: 'AuthService', metadata: { language: 'TypeScript' }, connections: ['root', 'supabase-dep'] },
        { type: 'Dependency', id: 'supabase-dep', name: '@supabase/supabase-js', metadata: { version: '^2.0.0' }, connections: ['auth-service'] },
      ],
      lastUpdated: Date.now()
    }
  }),
  pCards: getLocalItem<Record<string, PCard[]>>('nexus_pCards', {
    'nexus-core': [
      {
        pcard_id: 'auth-system',
        identity: {
          name: 'Authentication System',
          tagline: 'Supabase-powered identity layer'
        },
        runtime: {
          build_status: 'SUCCESS',
          telemetry: {
            latency: 142,
            errors: 0
          }
        },
        intent_layer: {
          active_goals: ['OAuth Migration', 'Profile Sync'],
          blockers: []
        },
        autonomous_insights: [
          {
            observation: 'Detected legacy JWT handling in secondary module',
            suggestions: ['Migrate to unified SDK', 'Enable refresh token rotation']
          }
        ]
      },
      {
        pcard_id: 'ccc-runtime',
        identity: {
          name: 'CCC Runtime',
          tagline: 'Semantic Compilation Engine'
        },
        runtime: {
          build_status: 'SUCCESS',
          telemetry: {
            latency: 88,
            errors: 2
          }
        },
        intent_layer: {
          active_goals: ['AST caching', 'Tree-sitter stabilization'],
          blockers: ['Cycled dependency in parser']
        },
        autonomous_insights: [
          {
            observation: 'Indexer throughput peak detected',
            suggestions: ['Shard ingestion worker', 'Optimize AST serialization']
          }
        ]
      },
      {
        pcard_id: 'seed-neuro-stream',
        type: 'PROJECT_DRAFT',
        identity: {
          name: 'NeuroStream',
          tagline: 'Real-time EEG data visualizer'
        },
        runtime: {
          build_status: 'PENDING',
          telemetry: {
            latency: 0,
            errors: 0
          }
        },
        intent_layer: {
          active_goals: ['Scaffold Three.js view', 'WebSocket connection'],
          blockers: []
        },
        creation_status: {
          phase: 'SCAFFOLDING',
          progress: 85,
          current_action: 'Injecting WebSocket handlers...'
        },
        proposed_architecture: [
          'Frontend: React + Three.js',
          'Backend: Go + WebSockets',
          'Database: TimescaleDB'
        ],
        quick_actions: ['Change Stack', 'View Live Preview', 'Commit to GitHub'],
        autonomous_insights: []
      }
    ]
  }),
  isOrchestrating: false,
  currentStepIndex: 0,
  
  addProject: (project) => set((state) => {
    const template = state.templates.find(t => t.id === project.scaffoldType);
    const initialArtifacts: Artifact[] = [];
    
    if (template) {
      initialArtifacts.push({
        id: `readme-${Date.now()}`,
        projectId: project.id,
        type: ArtifactType.REPORT,
        title: 'Project Manifest (README)',
        content: `# ${project.name}\n\nBuilt with ${template.name} template.\n\n## Stack\n${template.stack.join(', ')}\n\n## Getting Started\n1. Run \`${template.scaffoldCmd}\`\n2. Nexus semantic orchestration is active.`,
        createdAt: Date.now()
      });

      // Instantiate template files
      template.initialFiles.forEach((file, index) => {
        initialArtifacts.push({
          id: `file-${Date.now()}-${index}`,
          projectId: project.id,
          type: file.type,
          title: file.path,
          content: file.content,
          createdAt: Date.now()
        });
      });
    } else if (project.scaffoldType === 'upload') {
      initialArtifacts.push({
        id: `upload-manifest-${Date.now()}`,
        projectId: project.id,
        type: ArtifactType.REPORT,
        title: 'Ingestion Report',
        content: `# Ingested Workspace: ${project.name}\n\nNexus has completed the semantic mapping of the uploaded codebase.\n\n## Detected Components\n- UI Components: 12\n- API Services: 3\n- Config layers: 2\n\n## CCC Status\nOrchestration ready.`,
        createdAt: Date.now()
      });
      initialArtifacts.push({
        id: `main-core-${Date.now()}`,
        projectId: project.id,
        type: ArtifactType.CODE,
        title: 'src/main.ts',
        content: `// Ingested Core Logic\nconsole.log("Nexus Node Initialized");`,
        createdAt: Date.now()
      });
    }

    const newActivity = {
      id: `act-${Date.now()}`,
      projectId: project.id,
      text: template ? `Scaffolded workspace "${project.name}" using template "${template.name}"` : `Created workspace "${project.name}" from scratch`,
      timestamp: Date.now(),
      type: template ? 'scaffold' as const : 'create' as const
    };

    return { 
      projects: [...state.projects, { ...project, status: 'active' }],
      artifacts: [...state.artifacts, ...initialArtifacts],
      recentActivity: [newActivity, ...state.recentActivity]
    };
  }),
  setCurrentProject: (id) => set({ currentProjectId: id }),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  addArtifact: (artifact) => set((state) => ({ artifacts: [...state.artifacts, artifact] })),
  updateArtifact: (id, updates) => set((state) => ({
    artifacts: state.artifacts.map(a => a.id === id ? { ...a, ...updates } : a)
  })),
  setOrchestrating: (val) => set({ isOrchestrating: val }),
  setSteps: (messageId, steps) => set((state) => ({
    messages: state.messages.map(m => m.id === messageId ? { ...m, steps } : m)
  })),
  updateStep: (messageId, stepId, updates) => set((state) => ({
    messages: state.messages.map(m => 
      m.id === messageId && m.steps 
        ? { ...m, steps: m.steps.map(s => s.id === stepId ? { ...s, ...updates } : s) } 
        : m
    )
  })),
  addSkill: (skill) => set((state) => ({ skills: [...state.skills, skill] })),
  removeSkill: (skillId) => set((state) => {
    const skill = state.skills.find(s => s.id === skillId);
    const newActivity = {
      id: `act-${Date.now()}`,
      text: skill ? `Uninstalled skill capability "${skill.name}"` : `Uninstalled skill capability`,
      timestamp: Date.now(),
      type: 'skill' as const
    };
    return { 
      skills: state.skills.filter(s => s.id !== skillId),
      recentActivity: [newActivity, ...state.recentActivity]
    };
  }),
  installSkill: (skillId) => set((state) => {
    const skill = state.marketplaceSkills.find(s => s.id === skillId);
    if (skill && !state.skills.find(s => s.id === skillId)) {
      const newActivity = {
        id: `act-${Date.now()}`,
        text: `Installed specialized capability "${skill.name}" (v${skill.version})`,
        timestamp: Date.now(),
        type: 'skill' as const
      };
      return { 
        skills: [...state.skills, skill],
        recentActivity: [newActivity, ...state.recentActivity]
      };
    }
    return state;
  }),
  contributeSkill: async (skillData) => {
    try {
      const response = await fetch('/api/skills/registry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(skillData)
      });
      if (response.ok) {
        const newSkill = await response.json();
        set((state) => ({
          marketplaceSkills: [newSkill, ...state.marketplaceSkills]
        }));
      } else {
        set((state) => ({
          marketplaceSkills: [
            {
              ...skillData,
              id: `skill-${Date.now()}`,
              downloads: 0,
              rating: 5.0,
            } as Skill,
            ...state.marketplaceSkills
          ]
        }));
      }
    } catch (e) {
      set((state) => ({
        marketplaceSkills: [
          {
            ...skillData,
            id: `skill-${Date.now()}`,
            downloads: 0,
            rating: 5.0,
          } as Skill,
          ...state.marketplaceSkills
        ]
      }));
    }
  },
  fetchMarketplaceSkills: async () => {
    try {
      const response = await fetch('/api/skills/registry');
      if (response.ok) {
        const skillsList = await response.json();
        set({ marketplaceSkills: skillsList });
      }
    } catch (err) {
      console.error('Error fetching marketplace skills:', err);
    }
  },
  saveAsTemplate: (projectId, name, description) => set((state) => {
    const project = state.projects.find(p => p.id === projectId);
    if (!project) return state;

    const projectArtifacts = state.artifacts.filter(a => a.projectId === projectId && a.type === 'code');
    const initialFiles = projectArtifacts.map(art => ({
      path: art.title,
      content: art.content,
      type: art.type
    }));

    const newTemplate: any = {
      id: `custom-template-${Date.now()}`,
      name: name,
      description: description || `Custom template saved from ${project.name}`,
      category: 'Frontend',
      stack: ['Vite', 'React', 'Custom'],
      scaffoldCmd: 'nexus create custom',
      icon: 'Folder',
      initialFiles
    };

    const newActivity = {
      id: `act-${Date.now()}`,
      text: `Saved workspace "${project.name}" as custom template "${name}"`,
      timestamp: Date.now(),
      type: 'other' as const
    };

    return {
      templates: [...state.templates, newTemplate],
      recentActivity: [newActivity, ...state.recentActivity]
    };
  }),
  updateCCC: (projectId, ir) => set((state) => ({
    cccIR: { ...state.cccIR, [projectId]: ir }
  })),
  setPCards: (projectId, cards) => set((state) => ({
    pCards: { ...state.pCards, [projectId]: cards }
  })),
  setActiveView: (activeView) => set({ activeView }),
  updateTelemetryStream: (data) => set((state) => ({
    telemetryStream: { ...state.telemetryStream, ...data }
  })),
  updatePCardTelemetry: (projectId, pcardId, latency, errors) => set((state) => ({
    pCards: {
      ...state.pCards,
      [projectId]: state.pCards[projectId]?.map(p => 
        p.pcard_id === pcardId 
          ? { ...p, runtime: { ...p.runtime, telemetry: { latency, errors } } } 
          : p
      ) || []
    }
  })),
  updatePCardInsight: (projectId, pcardId, insight) => set((state) => ({
    pCards: {
      ...state.pCards,
      [projectId]: state.pCards[projectId]?.map(p => 
        p.pcard_id === pcardId 
          ? { ...p, autonomous_insights: [{ observation: insight, suggestions: ["Review architectural shift"] }, ...p.autonomous_insights] } 
          : p
      ) || []
    }
  })),
  updateGitStatus: (projectId, status) => set((state) => ({
    projects: state.projects.map(p => 
      p.id === projectId 
        ? { ...p, gitStatus: { ...(p.gitStatus || { branch: 'main', isDirty: false, ahead: 0, behind: 0, stagedFiles: [], unstagedFiles: [] }), ...status } } 
        : p
    )
  })),
  deleteProject: (projectId) => set((state) => {
    const newProjects = state.projects.filter(p => p.id !== projectId);
    return {
      projects: newProjects,
      currentProjectId: state.currentProjectId === projectId 
        ? (newProjects.length > 0 ? newProjects[0].id : null) 
        : state.currentProjectId,
      artifacts: state.artifacts.filter(a => a.projectId !== projectId),
      pCards: { ...state.pCards, [projectId]: undefined },
      cccIR: { ...state.cccIR, [projectId]: undefined }
    };
  }),
  archiveProject: (projectId) => set((state) => ({
    projects: state.projects.map(p => 
      p.id === projectId 
        ? { ...p, status: p.status === 'active' ? 'archived' : 'active' } 
        : p
    )
  })),
  duplicateProject: (projectId) => set((state) => {
    const original = state.projects.find(p => p.id === projectId);
    if (!original) return state;

    const newId = `${original.id}-copy-${Date.now()}`;
    const newProject: Project = {
      ...original,
      id: newId,
      name: `${original.name} (Copy)`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      status: 'active'
    };

    const newArtifacts = state.artifacts
      .filter(a => a.projectId === projectId)
      .map(a => ({
        ...a,
        id: `${a.id}-copy-${Date.now()}`,
        projectId: newId,
        createdAt: Date.now()
      }));

    return {
      projects: [...state.projects, newProject],
      artifacts: [...state.artifacts, ...newArtifacts],
      pCards: { ...state.pCards, [newId]: state.pCards[projectId] || [] },
      cccIR: { ...state.cccIR, [newId]: state.cccIR[projectId] }
    };
  }),
  updateProject: (projectId, updates) => set((state) => ({
    projects: state.projects.map(p => p.id === projectId ? { ...p, ...updates } : p)
  })),
  importProjectFromZip: (name, file) => {
    const id = `import-${Date.now()}`;
    set((state) => {
      const newProject: Project = {
        id,
        name,
        description: `Imported from ${file.name}`,
        scaffoldType: 'upload',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        status: 'active'
      };
      
      const initialArtifacts: Artifact[] = [
        {
          id: `manifest-${Date.now()}`,
          projectId: id,
          type: ArtifactType.REPORT,
          title: 'Import Manifest',
          content: `# Ingested from ZIP: ${file.name}\n\nNexus has expanded the archive. Proceeding with semantic mapping.`,
          createdAt: Date.now()
        }
      ];

      const newActivity = {
        id: `act-${Date.now()}`,
        projectId: id,
        text: `Imported workspace "${name}" from ZIP file "${file.name}"`,
        timestamp: Date.now(),
        type: 'create' as const
      };

      return {
        projects: [...state.projects, newProject],
        artifacts: [...state.artifacts, ...initialArtifacts],
        recentActivity: [newActivity, ...state.recentActivity]
      };
    });
  },
  cloneProjectFromGit: (name, url) => {
    const id = `git-${Date.now()}`;
    set((state) => {
      const newProject: Project = {
        id,
        name,
        description: `Cloned from ${url}`,
        scaffoldType: 'git',
        gitUrl: url,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        status: 'active',
        gitStatus: {
          branch: 'main',
          isDirty: false,
          ahead: 0,
          behind: 0,
          stagedFiles: [],
          unstagedFiles: []
        }
      };
      
      const initialArtifacts: Artifact[] = [
        {
          id: `git-report-${Date.now()}`,
          projectId: id,
          type: ArtifactType.REPORT,
          title: 'Git Clone Intelligence',
          content: `# Repository: ${url}\n\nCloning successful. Indexing branches and semantic symbols.`,
          createdAt: Date.now()
        }
      ];

      const newActivity = {
        id: `act-${Date.now()}`,
        projectId: id,
        text: `Cloned Git repository "${name}" from "${url}"`,
        timestamp: Date.now(),
        type: 'git' as const
      };

      return {
        projects: [...state.projects, newProject],
        artifacts: [...state.artifacts, ...initialArtifacts],
        recentActivity: [newActivity, ...state.recentActivity]
      };
    });
  },

  initiateRefactor: (artifactId) => {
    set((state) => {
      const artifact = state.artifacts.find(a => a.id === artifactId);
      if (!artifact) return state;

      // Mocking AI analysis
      const proposed = artifact.content + "\n\n// AI Refactored Version\n// Refactored for better complexity and CCC adherence\n" + artifact.content.replace(/var/g, 'const').replace(/function/g, 'const');
      
      return {
        pendingRefactor: {
          artifactId,
          originalContent: artifact.content,
          proposedContent: proposed,
          improvements: [
            'Converted var to const for block scoping',
            'Transformed named functions to arrow functions',
            'Simplified relational mapping in CCC context',
            'Reduced cyclomatic complexity (-12)'
          ]
        }
      };
    });
  },

  applyRefactor: () => {
    set((state) => {
      if (!state.pendingRefactor) return state;
      const { artifactId, proposedContent } = state.pendingRefactor;
      
      const newArtifacts = state.artifacts.map(a => 
        a.id === artifactId ? { ...a, content: proposedContent } : a
      );

      return {
        artifacts: newArtifacts,
        pendingRefactor: null
      };
    });
  },

  rejectRefactor: () => set({ pendingRefactor: null }),
  togglePinProject: (projectId) => set((state) => {
    const isPinned = state.pinnedProjectIds.includes(projectId);
    const pinnedProjectIds = isPinned 
      ? state.pinnedProjectIds.filter(id => id !== projectId)
      : [...state.pinnedProjectIds, projectId];
    return { pinnedProjectIds };
  }),
  reorderWidgets: (widgets) => set({ dashboardWidgets: widgets }),
  removeWidget: (widgetId) => set((state) => ({
    dashboardWidgets: state.dashboardWidgets.filter(w => w !== widgetId)
  })),
  addWidget: (widgetId) => set((state) => ({
    dashboardWidgets: state.dashboardWidgets.includes(widgetId)
      ? state.dashboardWidgets
      : [...state.dashboardWidgets, widgetId]
  })),
  addActivityLog: (text, type, projectId) => set((state) => ({
    recentActivity: [
      {
        id: `act-${Date.now()}`,
        projectId,
        text,
        timestamp: Date.now(),
        type
      },
      ...state.recentActivity
    ]
  })),
  stageFile: (projectId, file) => set((state) => ({
    projects: state.projects.map(p => {
      if (p.id !== projectId || !p.gitStatus) return p;
      const git = p.gitStatus;
      return {
        ...p,
        gitStatus: {
          ...git,
          isDirty: true,
          stagedFiles: [...git.stagedFiles, file],
          unstagedFiles: git.unstagedFiles.filter(f => f !== file)
        }
      };
    })
  })),
  unstageFile: (projectId, file) => set((state) => ({
    projects: state.projects.map(p => {
      if (p.id !== projectId || !p.gitStatus) return p;
      const git = p.gitStatus;
      return {
        ...p,
        gitStatus: {
          ...git,
          stagedFiles: git.stagedFiles.filter(f => f !== file),
          unstagedFiles: [...git.unstagedFiles, file]
        }
      };
    })
  })),
  commitChanges: (projectId, message) => set((state) => {
    const proj = state.projects.find(p => p.id === projectId);
    if (!proj || !proj.gitStatus) return state;
    const git = proj.gitStatus;
    
    const newActivity = {
      id: `act-${Date.now()}`,
      projectId,
      text: `Committed to ${git.branch}: "${message}"`,
      timestamp: Date.now(),
      type: 'git' as const
    };

    const updatedProjects = state.projects.map(p => {
      if (p.id !== projectId || !p.gitStatus) return p;
      return {
        ...p,
        gitStatus: {
          ...p.gitStatus,
          isDirty: false,
          ahead: p.gitStatus.ahead + 1,
          stagedFiles: []
        }
      };
    });

    return {
      projects: updatedProjects,
      recentActivity: [newActivity, ...state.recentActivity]
    };
  }),
  pushChanges: (projectId) => set((state) => {
    const proj = state.projects.find(p => p.id === projectId);
    if (!proj || !proj.gitStatus) return state;
    const git = proj.gitStatus;

    const newActivity = {
      id: `act-${Date.now()}`,
      projectId,
      text: `Pushed ${git.ahead} commit(s) to remote branch "${git.branch}"`,
      timestamp: Date.now(),
      type: 'git' as const
    };

    const updatedProjects = state.projects.map(p => {
      if (p.id !== projectId || !p.gitStatus) return p;
      return {
        ...p,
        gitStatus: {
          ...p.gitStatus,
          ahead: 0
        }
      };
    });

    return {
      projects: updatedProjects,
      recentActivity: [newActivity, ...state.recentActivity]
    };
  }),
  fetchChanges: (projectId) => set((state) => {
    const proj = state.projects.find(p => p.id === projectId);
    if (!proj || !proj.gitStatus) return state;
    
    const updatedProjects = state.projects.map(p => {
      if (p.id !== projectId || !p.gitStatus) return p;
      return {
        ...p,
        gitStatus: {
          ...p.gitStatus,
          behind: Math.random() > 0.5 ? 1 : 0
        }
      };
    });

    return {
      projects: updatedProjects
    };
  }),
  loadPersistedState: async () => {
    const activeView = await getItem<ViewType | null>('nexus_activeView', null);
    const currentProjectId = await getItem<string | null>('nexus_currentProjectId', null);
    const projects = await getItem<Project[] | null>('nexus_projects', null);
    const cccIR = await getItem<Record<string, CCCIR> | null>('nexus_cccIR', null);
    const pCards = await getItem<Record<string, PCard[]> | null>('nexus_pCards', null);
    const messages = await getItem<Message[] | null>('nexus_messages', null);
    const artifacts = await getItem<Artifact[] | null>('nexus_artifacts', null);
    const skills = await getItem<Skill[] | null>('nexus_skills', null);
    const templates = await getItem<any[] | null>('nexus_templates', null);

    const updates: Partial<AppState> = {};
    if (activeView) updates.activeView = activeView;
    if (currentProjectId) updates.currentProjectId = currentProjectId;
    if (projects) updates.projects = projects;
    if (cccIR) updates.cccIR = cccIR;
    if (pCards) updates.pCards = pCards;
    if (messages) updates.messages = messages;
    if (artifacts) updates.artifacts = artifacts;
    if (skills) updates.skills = skills;
    if (templates) updates.templates = templates;

    if (Object.keys(updates).length > 0) {
      set(updates);
    }
  },
}));

if (typeof window !== 'undefined') {
  useStore.subscribe((state) => {
    try {
      localStorage.setItem('nexus_activeView', state.activeView);
      if (state.currentProjectId) {
        localStorage.setItem('nexus_currentProjectId', state.currentProjectId);
      } else {
        localStorage.removeItem('nexus_currentProjectId');
      }
      localStorage.setItem('nexus_projects', JSON.stringify(state.projects));
      localStorage.setItem('nexus_cccIR', JSON.stringify(state.cccIR));
      localStorage.setItem('nexus_pCards', JSON.stringify(state.pCards));
      localStorage.setItem('nexus_messages', JSON.stringify(state.messages));
      localStorage.setItem('nexus_artifacts', JSON.stringify(state.artifacts));
      localStorage.setItem('nexus_skills', JSON.stringify(state.skills));
      localStorage.setItem('nexus_templates', JSON.stringify(state.templates));

      // Asynchronously backup to IndexedDB for unlimited capacity
      setItem('nexus_activeView', state.activeView);
      if (state.currentProjectId) {
        setItem('nexus_currentProjectId', state.currentProjectId);
      }
      setItem('nexus_projects', state.projects);
      setItem('nexus_cccIR', state.cccIR);
      setItem('nexus_pCards', state.pCards);
      setItem('nexus_messages', state.messages);
      setItem('nexus_artifacts', state.artifacts);
      setItem('nexus_skills', state.skills);
      setItem('nexus_templates', state.templates);
    } catch (e) {
      console.error('Error saving state to database persistence:', e);
    }
  });
}
