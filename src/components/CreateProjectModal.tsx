import React, { useState } from 'react';
import { X, Plus, Folder, Github, FileJson, Zap, Upload } from 'lucide-react';
import { useStore } from '../store/useStore';
import { cn } from '../lib/utils';

export const CreateProjectModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const { addProject, templates: storeTemplates } = useStore();
  const [step, setStep] = useState(1);
  const [selection, setSelection] = useState<string | null>(null);
  const [projectName, setProjectName] = useState('');
  const [projectDesc, setProjectDesc] = useState('');

  if (!isOpen) return null;

  const coreTemplates = [
    { id: 'blank', name: 'Blank Workspace', desc: 'A clean slate for your intent.', icon: Plus },
    { id: 'git', name: 'Clone Git Repository', desc: 'Import logic from GitHub/GitLab.', icon: Github },
    { id: 'upload', name: 'Upload ZIP / Files', desc: 'Ingest local codebases directly.', icon: Upload },
    { id: 'ai', name: 'AI-Generated Scaffold', desc: 'Tell Nexus what to build from scratch.', icon: Zap },
  ];

  const handleCreate = () => {
    addProject({
      id: `project-${Date.now()}`,
      name: projectName || (selection === 'ai' ? 'AI Generated App' : 'New Workspace'),
      description: projectDesc || 'Newly created nexus workspace',
      scaffoldType: selection || 'blank',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      gitStatus: selection === 'git' ? {
        branch: 'main',
        isDirty: false,
        ahead: 0,
        behind: 0,
        stagedFiles: [],
        unstagedFiles: []
      } : undefined
    });
    setStep(1);
    setSelection(null);
    setProjectName('');
    setProjectDesc('');
    onClose();
  };

  const selectedTemplate = [...coreTemplates, ...storeTemplates].find(t => t.id === selection);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl bg-[#0F1115] border border-[#2D333B] rounded-2xl overflow-hidden shadow-2xl flex flex-col">
        <div className="p-4 border-b border-[#2D333B] flex items-center justify-between">
          <h2 className="text-lg font-semibold uppercase tracking-widest text-[#F27D26]">Initialize Workspace</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors text-white/40 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-8">
          {step === 1 ? (
            <div className="space-y-6">
              <section>
                <h3 className="text-xs uppercase tracking-widest text-white/30 mb-4">Core Engines</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                        <h3 className="font-medium text-[13px] text-white/90">{t.name}</h3>
                        <p className="text-[11px] text-white/40 mt-1">{t.desc}</p>
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
                  <span className="text-sm">Configuring <span className="text-primary font-bold">{selectedTemplate?.name}</span></span>
                  <button onClick={() => setStep(1)} className="text-[10px] uppercase font-bold text-white/40 hover:text-white underline underline-offset-4">Change Selection</button>
                </div>
              </div>
              
              <div className="space-y-4">
                 {selection === 'git' && (
                   <input 
                     placeholder="Repository URL (https://github.com/...)"
                     className="w-full bg-[#050505] border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all shadow-inner"
                   />
                 )}
                 {selection === 'upload' && (
                   <div className="flex flex-col gap-3">
                     <div className="w-full border-2 border-dashed border-white/10 rounded-xl p-8 flex flex-col items-center justify-center gap-3 bg-white/[0.02] hover:bg-white/[0.05] transition-all cursor-pointer">
                        <Upload className="w-8 h-8 text-[#F27D26] opacity-50" />
                        <div className="text-center">
                          <p className="text-sm font-bold text-white/60">Drop ZIP or files here</p>
                          <p className="text-[10px] text-white/20 uppercase tracking-widest mt-1">or click to browse</p>
                        </div>
                     </div>
                     <p className="text-[10px] text-white/30 italic text-center">Nexus will semantically map the ingested files upon finalization.</p>
                   </div>
                 )}
                 <input 
                   placeholder="Workspace Name"
                   value={projectName}
                   onChange={(e) => setProjectName(e.target.value)}
                   className="w-full bg-[#050505] border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all shadow-inner"
                 />
                 <textarea 
                   placeholder="Project intent or description..."
                   rows={3}
                   value={projectDesc}
                   onChange={(e) => setProjectDesc(e.target.value)}
                   className="w-full bg-[#050505] border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all shadow-inner resize-none"
                 />
              </div>

              <div className="flex gap-4">
                <button onClick={() => { setStep(1); setSelection(null); }} className="flex-1 py-3.5 border border-white/10 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-white/5 transition-all text-white/60">Cancel</button>
                <button onClick={handleCreate} className="flex-1 py-3.5 bg-primary text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-primary/80 transition-all shadow-lg shadow-primary/20">Finalize Build</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
