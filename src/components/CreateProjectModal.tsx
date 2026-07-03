import React, { useState, useEffect } from 'react';
import { X, Plus, Folder, Github, FileJson, Zap, Upload, Cpu, Loader2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import { cn } from '../lib/utils';

export const CreateProjectModal = ({ isOpen, onClose, initialSelection }: { isOpen: boolean, onClose: () => void, initialSelection?: string | null }) => {
  const { addProject, templates: storeTemplates, importProjectFromZip, cloneProjectFromGit } = useStore();
  const [step, setStep] = useState(1);
  const [selection, setSelection] = useState<string | null>(null);
  const [projectName, setProjectName] = useState('');
  const [projectDesc, setProjectDesc] = useState('');
  const [gitUrl, setGitUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);

  // AI Scaffold variables
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(1);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationError, setGenerationError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (initialSelection) {
        setSelection(initialSelection);
        setStep(2);
      } else {
        setStep(1);
        setSelection(null);
      }
      setIsGenerating(false);
      setGenerationStep(1);
      setGenerationProgress(0);
      setGenerationError(null);
    }
  }, [isOpen, initialSelection]);

  if (!isOpen) return null;

  const coreTemplates = [
    { id: 'blank', name: 'Blank Workspace', desc: 'A clean slate for your intent.', icon: Plus },
    { id: 'git', name: 'Clone Git Repository', desc: 'Import logic from GitHub/GitLab.', icon: Github },
    { id: 'upload', name: 'Upload ZIP / Files', desc: 'Ingest local codebases directly.', icon: Upload },
    { id: 'ai', name: 'AI-Generated Scaffold', desc: 'Tell Nexus what to build from scratch.', icon: Zap },
  ];

  const handleCreate = () => {
    if (selection === 'ai') {
      setIsGenerating(true);
      setGenerationStep(1);
      setGenerationProgress(10);
      setGenerationError(null);

      const timer1 = setTimeout(() => { setGenerationStep(2); setGenerationProgress(35); }, 1500);
      const timer2 = setTimeout(() => { setGenerationStep(3); setGenerationProgress(65); }, 3000);
      const timer3 = setTimeout(() => { setGenerationStep(4); setGenerationProgress(85); }, 4500);

      fetch('/api/scaffold', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: projectDesc || 'React application structure',
          projectName: projectName || 'AI Generated Workspace'
        })
      })
      .then(res => {
        if (!res.ok) throw new Error('API Scaffold Generation failed');
        return res.json();
      })
      .then(data => {
        setGenerationProgress(100);
        setTimeout(() => {
          const newProjectId = `project-${Date.now()}`;
          
          // 1. Add project
          addProject({
            id: newProjectId,
            name: data.name || projectName || 'AI Generated Workspace',
            description: data.description || projectDesc || 'Nexus Synthesized Application',
            scaffoldType: 'ai',
            createdAt: Date.now(),
            updatedAt: Date.now(),
            status: 'active'
          });

          // 2. Add files as code artifacts
          if (Array.isArray(data.files)) {
            data.files.forEach((f: any, idx: number) => {
              useStore.getState().addArtifact({
                id: `ai-art-${Date.now()}-${idx}`,
                projectId: newProjectId,
                type: 'code' as any,
                title: f.path,
                content: f.content,
                createdAt: Date.now()
              });
            });
          }

          // 3. Add CCC semantic nodes
          if (Array.isArray(data.cccNodes)) {
            useStore.getState().updateCCC(newProjectId, {
              nodes: data.cccNodes,
              lastUpdated: Date.now()
            });
          }

          // 4. Set PCards
          if (Array.isArray(data.pCards)) {
            useStore.getState().setPCards(newProjectId, data.pCards);
          }

          // 5. Add activity logs
          useStore.getState().addActivityLog(`Nexus AI cognitive compiler completed synthesis of "${data.name}"`, 'scaffold', newProjectId);

          // 6. Navigate and highlight
          useStore.getState().setCurrentProject(newProjectId);
          useStore.getState().setActiveView('workspace');

          setIsGenerating(false);
          setStep(1);
          setSelection(null);
          setProjectName('');
          setProjectDesc('');
          onClose();
        }, 800);
      })
      .catch(err => {
        console.error(err);
        setGenerationError(err.message || 'An unexpected error occurred during synthesis');
        setIsGenerating(false);
      })
      .finally(() => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      });
      return;
    }

    if (selection === 'git' && gitUrl) {
      cloneProjectFromGit(projectName || 'Cloned Repository', gitUrl);
    } else if (selection === 'upload' && file) {
      importProjectFromZip(projectName || file.name, file);
    } else {
      addProject({
        id: `project-${Date.now()}`,
        name: projectName || 'New Workspace',
        description: projectDesc || 'Newly created nexus workspace',
        scaffoldType: selection || 'blank',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        status: 'active',
        gitStatus: selection === 'git' ? {
          branch: 'main',
          isDirty: false,
          ahead: 0,
          behind: 0,
          stagedFiles: [],
          unstagedFiles: []
        } : undefined
      });
    }
    setStep(1);
    setSelection(null);
    setProjectName('');
    setProjectDesc('');
    setGitUrl('');
    setFile(null);
    onClose();
  };

  const selectedTemplate = [...coreTemplates, ...storeTemplates].find(t => t.id === selection);

  const generationSteps = [
    { id: 1, label: "Synthesizing Nexus Cogito Layer..." },
    { id: 2, label: "Assembling AST dependencies & packages..." },
    { id: 3, label: "Analyzing semantic intent with Gemini AI..." },
    { id: 4, label: "Compiling CCC files & system architecture..." }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl bg-[#0F1115] border border-[#2D333B] rounded-2xl overflow-hidden shadow-2xl flex flex-col">
        <div className="p-4 border-b border-[#2D333B] flex items-center justify-between bg-[#15181E]">
          <h2 className="text-lg font-semibold uppercase tracking-widest text-[#F27D26] flex items-center gap-2">
            <Cpu className="w-5 h-5 text-[#F27D26]" />
            Initialize Workspace
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors text-white/40 hover:text-white" disabled={isGenerating}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-8">
          {isGenerating ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-8">
              <div className="relative flex items-center justify-center">
                <div className="w-24 h-24 rounded-full border border-primary/20 border-t-primary animate-spin" />
                <div className="absolute w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Zap className="w-8 h-8 text-primary animate-pulse" />
                </div>
              </div>

              <div className="text-center space-y-2 max-w-md">
                <h3 className="text-lg font-black tracking-tight text-white uppercase font-mono">Cognitive Synthesizer Active</h3>
                <div className="text-sm text-primary/80 font-semibold h-6">
                  {generationSteps.find(s => s.id === generationStep)?.label || "Compiling..."}
                </div>
                <p className="text-xs text-white/40 leading-relaxed font-mono">
                  {projectName || "AI Generated Workspace"} is being scaffolded under the cognitive AST controller...
                </p>
              </div>

              <div className="w-full max-w-md bg-white/5 h-2 rounded-full overflow-hidden border border-white/10">
                <div 
                  className="bg-primary h-full transition-all duration-1000 ease-out"
                  style={{ width: `${generationProgress}%` }}
                />
              </div>

              <div className="text-[10px] text-white/20 font-mono uppercase tracking-[0.2em]">
                Ingestion progress: {generationProgress}%
              </div>
            </div>
          ) : generationError ? (
            <div className="py-8 text-center space-y-6">
              <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto">
                <X className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white">Synthesis Failed</h3>
                <p className="text-sm text-white/40 max-w-md mx-auto">{generationError}</p>
              </div>
              <button 
                onClick={() => { setGenerationError(null); setIsGenerating(false); }}
                className="px-6 py-2 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl text-xs uppercase tracking-widest font-bold transition-all"
              >
                Retry Configuration
              </button>
            </div>
          ) : step === 1 ? (
            <div className="space-y-6">
              <section>
                <h3 className="text-xs uppercase tracking-widest text-white/30 mb-4 font-black">Core Engines</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {coreTemplates.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => { setSelection(t.id); setStep(2); }}
                      className="flex flex-col gap-3 p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:border-primary/50 hover:bg-primary/5 transition-all text-left group"
                    >
                      <div className="p-3 bg-white/5 rounded-lg group-hover:bg-primary/20 group-hover:text-primary transition-colors w-fit">
                        <t.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-[12px] text-white/90">{t.name}</h3>
                        <p className="text-[10px] text-white/40 mt-1 leading-snug">{t.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 mb-6 flex items-center gap-3">
                  <div className="w-8 h-px bg-white/10" />
                  Scaffold Blueprints
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {storeTemplates.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => { setSelection(t.id); setStep(2); }}
                      className="flex flex-col gap-4 p-5 rounded-2xl border border-white/5 bg-white/[0.02] hover:border-primary/50 hover:bg-primary/5 transition-all text-left group"
                    >
                      <div className="flex items-center justify-between">
                         <div className="p-3 bg-white/5 rounded-xl group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                           <Folder className="w-5 h-5" />
                         </div>
                         <span className="text-[9px] font-black bg-white/5 text-white/40 px-2 py-1 rounded uppercase tracking-wider">{t.category}</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-white/90 group-hover:text-primary transition-colors">{t.name}</h3>
                        <p className="text-[12px] text-white/30 mt-1 leading-relaxed">{t.description}</p>
                      </div>
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {t.stack.map(s => (
                          <span key={s} className="text-[9px] font-medium text-white/20 bg-white/5 px-2 py-0.5 rounded-full">{s}</span>
                        ))}
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <label className="text-xs uppercase tracking-widest text-white/30 mb-2 block">Configure Selection</label>
                <div className="p-4 bg-white/5 rounded-lg border border-white/10 flex items-center justify-between">
                  <span className="text-sm">Configuring <span className="text-primary font-bold">{selectedTemplate?.name || (selection === 'ai' ? 'AI-Generated Scaffold' : 'Custom App')}</span></span>
                  <button onClick={() => setStep(1)} className="text-[10px] uppercase font-bold text-white/40 hover:text-white underline underline-offset-4">Change Selection</button>
                </div>
              </div>
              
              <div className="space-y-4">
                 {selection === 'git' && (
                    <input 
                      placeholder="Repository URL (https://github.com/...)"
                      value={gitUrl}
                      onChange={(e) => setGitUrl(e.target.value)}
                      className="w-full bg-[#050505] border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all shadow-inner text-white"
                    />
                 )}
                 {selection === 'upload' && (
                    <div className="flex flex-col gap-3">
                      <label className="w-full border-2 border-dashed border-[#2D333B] rounded-xl p-8 flex flex-col items-center justify-center gap-3 bg-white/[0.02] hover:bg-white/[0.05] transition-all cursor-pointer">
                         <input 
                           type="file" 
                           className="hidden" 
                           accept=".zip"
                           onChange={(e) => setFile(e.target.files?.[0] || null)}
                         />
                         <Upload className={cn("w-8 h-8 transition-colors", file ? "text-green-500" : "text-[#F27D26] opacity-50")} />
                         <div className="text-center">
                           <p className="text-sm font-bold text-white/60">{file ? file.name : "Drop ZIP or files here"}</p>
                           <p className="text-[10px] text-white/20 uppercase tracking-widest mt-1">or click to browse</p>
                         </div>
                      </label>
                      <p className="text-[10px] text-white/30 italic text-center">Nexus will semantically map the ingested files upon finalization.</p>
                    </div>
                 )}
                 
                 <input 
                   placeholder="Workspace Name"
                   value={projectName}
                   onChange={(e) => setProjectName(e.target.value)}
                   className="w-full bg-[#050505] border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all shadow-inner text-white"
                 />

                 {selection === 'ai' ? (
                   <div className="space-y-2">
                     <textarea 
                       placeholder="Describe what you want to build in plain English (e.g., 'An off-grid solar-monitoring dashboard with real-time current indicators and animated state-of-charge gauges')"
                       rows={4}
                       value={projectDesc}
                       onChange={(e) => setProjectDesc(e.target.value)}
                       className="w-full bg-[#050505] border border-[#2D333B] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all shadow-inner resize-none text-white leading-relaxed"
                     />
                     <p className="text-[10px] text-[#F27D26] italic font-mono uppercase tracking-wider">
                       ⚡ Gemini 3.5 Flash cognitive pipeline is configured to synthesize structural file scopes.
                     </p>
                   </div>
                 ) : (
                   <textarea 
                     placeholder="Project intent or description..."
                     rows={3}
                     value={projectDesc}
                     onChange={(e) => setProjectDesc(e.target.value)}
                     className="w-full bg-[#050505] border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all shadow-inner resize-none text-white"
                   />
                 )}
              </div>

              <div className="flex gap-4">
                <button onClick={() => { setStep(1); setSelection(null); }} className="flex-1 py-3.5 border border-[#2D333B] rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-white/5 transition-all text-white/60">Cancel</button>
                <button onClick={handleCreate} className="flex-1 py-3.5 bg-primary text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-primary/80 transition-all shadow-lg shadow-primary/20">Finalize Build</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
