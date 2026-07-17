import React from 'react';
import { useStore } from '../store/useStore';
import { Settings, Trash2, Box, Info, Cpu, Database, Save, RotateCcw, Activity, Archive, Copy, Download, Github, Share2 } from 'lucide-react';
import { cn } from '../lib/utils';

export const ProjectSettings = () => {
  const { projects, currentProjectId, deleteProject, updateProject, archiveProject, duplicateProject, saveAsTemplate } = useStore();
  const project = projects.find(p => p.id === currentProjectId);
  
  const [isTemplateModalOpen, setIsTemplateModalOpen] = React.useState(false);
  const [templateName, setTemplateName] = React.useState('');
  const [templateDesc, setTemplateDesc] = React.useState('');

  if (!project) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[#050505]">
        <Settings className="w-12 h-12 text-white/10 mb-4" />
        <h3 className="text-xl font-bold text-white uppercase italic tracking-widest mb-2">No Project Selected</h3>
        <p className="text-white/30 text-sm max-w-sm italic leading-relaxed">
          Select a workspace from the sidebar to modify its configuration or manage its lifecycle.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-[#050505] overflow-y-auto">
      <div className="p-6 sm:p-8 border-b border-white/5 bg-[#080808]">
        <div className="flex items-center gap-3 sm:gap-4 mb-2 sm:mb-6">
          <div className="p-2.5 sm:p-3 bg-primary/10 rounded-xl text-primary">
            <Settings className="w-5 sm:w-6 h-5 sm:h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white uppercase italic tracking-tighter">Workspace Configuration</h2>
            <p className="text-white/40 text-[9px] sm:text-sm font-mono italic">ID: {project.id}</p>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-10 sm:space-y-12 max-w-4xl">
        <section className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <Info className="w-3.5 h-3.5 text-primary" />
            <h3 className="text-[10px] sm:text-xs font-bold text-white/30 uppercase tracking-widest">Metadata & Identity</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-2">
              <label className="text-[9px] sm:text-[10px] font-bold text-white/20 uppercase tracking-widest ml-1">Workspace Name</label>
              <input 
                value={project.name}
                onChange={(e) => updateProject(project.id, { name: e.target.value })}
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] sm:text-[10px] font-bold text-white/20 uppercase tracking-widest ml-1">Template Engine</label>
              <div className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white/40 cursor-not-allowed">
                {project.scaffoldType}
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[9px] sm:text-[10px] font-bold text-white/20 uppercase tracking-widest ml-1">Manifest Description</label>
            <textarea 
              rows={3}
              value={project.description}
              onChange={(e) => updateProject(project.id, { description: e.target.value })}
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50 transition-all resize-none"
            />
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="w-3.5 h-3.5 text-primary" />
            <h3 className="text-[10px] sm:text-xs font-bold text-white/30 uppercase tracking-widest">Workspace Actions</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <button 
              onClick={() => archiveProject(project.id)}
              className="flex items-center justify-center gap-2 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-primary/30 transition-all group"
            >
              <Archive className={cn("w-4 h-4 transition-colors", project.status === 'archived' ? "text-primary" : "text-white/20 group-hover:text-primary")} />
              <div className="text-left">
                 <p className="text-[10px] font-bold text-white uppercase tracking-wider">{project.status === 'archived' ? 'Unarchive' : 'Archive'}</p>
                 <p className="text-[8px] text-white/20 uppercase">Lifecycle</p>
              </div>
            </button>

            <button 
              onClick={() => duplicateProject(project.id)}
              className="flex items-center justify-center gap-2 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-primary/30 transition-all group"
            >
              <Copy className="w-4 h-4 text-white/20 group-hover:text-primary transition-colors" />
              <div className="text-left">
                 <p className="text-[10px] font-bold text-white uppercase tracking-wider">Duplicate</p>
                 <p className="text-[8px] text-white/20 uppercase">Cloning</p>
              </div>
            </button>

            <button 
              onClick={() => alert('Preparing ZIP archive for download... (Simulated)')}
              className="flex items-center justify-center gap-2 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-primary/30 transition-all group"
            >
              <Download className="w-4 h-4 text-white/20 group-hover:text-primary transition-colors" />
              <div className="text-left">
                 <p className="text-[10px] font-bold text-white uppercase tracking-wider">Export ZIP</p>
                 <p className="text-[8px] text-white/20 uppercase">Download</p>
              </div>
            </button>

            <button 
              onClick={() => alert(`Pushing to ${project.gitUrl || 'nexus-remote'}... (Simulated)`)}
              className="flex items-center justify-center gap-2 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-primary/30 transition-all group"
            >
              <Github className="w-4 h-4 text-white/20 group-hover:text-primary transition-colors" />
              <div className="text-left">
                 <p className="text-[10px] font-bold text-white uppercase tracking-wider">Git Sync</p>
                 <p className="text-[8px] text-white/20 uppercase">Publish</p>
              </div>
            </button>

            <button 
              onClick={() => {
                setTemplateName(`${project.name} Template`);
                setTemplateDesc(`A custom blueprint saved from the ${project.name} workspace.`);
                setIsTemplateModalOpen(true);
              }}
              className="flex items-center justify-center gap-2 p-4 rounded-2xl bg-[#F27D26]/5 border border-[#F27D26]/10 hover:border-primary/40 transition-all group"
            >
              <Save className="w-4 h-4 text-[#F27D26]/40 group-hover:text-primary transition-colors animate-pulse" />
              <div className="text-left">
                 <p className="text-[10px] font-black text-white uppercase tracking-wider">Save Template</p>
                 <p className="text-[8px] text-[#F27D26]/60 font-black uppercase">Blueprint</p>
              </div>
            </button>
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <Cpu className="w-3.5 h-3.5 text-primary" />
            <h3 className="text-[10px] sm:text-xs font-bold text-white/30 uppercase tracking-widest">Runtime Analytics</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            {[
              { label: 'Latency Node', value: '42ms', icon: Activity },
              { label: 'Storage Sync', value: '88%', icon: Database },
              { label: 'Build Cache', value: '1.2GB', icon: Box },
            ].map((stat, i) => (
              <div key={i} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col gap-2">
                <stat.icon className="w-3.5 h-3.5 text-white/20" />
                <span className="text-xl font-bold text-white italic">{stat.value}</span>
                <span className="text-[8px] font-black uppercase tracking-widest text-[#F27D26]/60">{stat.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <Share2 className="w-3.5 h-3.5 text-primary" />
            <h3 className="text-[10px] sm:text-xs font-bold text-white/30 uppercase tracking-widest">Workspace Sharing</h3>
          </div>
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
             <div className="flex items-center justify-between">
                <div>
                   <p className="text-sm font-bold text-white uppercase tracking-wider">Collaborative Orchestration</p>
                   <p className="text-[10px] text-white/30 italic">Enable real-time seat pairing and multi-brain workspace sharing (In Dev).</p>
                </div>
                <div className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded text-[8px] font-black uppercase tracking-widest">Nexus Pro</div>
             </div>
             <div className="flex gap-2">
                <input 
                  disabled
                  placeholder="Invite by email or Nexus ID..."
                  className="flex-1 bg-white/[0.02] border border-white/10 rounded-xl px-4 py-2 text-xs text-white/20 cursor-not-allowed italic"
                />
                <button disabled className="px-6 py-2 bg-white/5 border border-white/10 rounded-xl font-bold text-[10px] tracking-widest uppercase text-white/20 cursor-not-allowed">Share</button>
             </div>
          </div>
        </section>

        <section className="pt-8 border-t border-white/5">
          <h3 className="text-xs font-bold text-red-500/50 uppercase tracking-widest mb-6">Danger Zone</h3>
          <div className="p-6 rounded-2xl bg-red-500/5 border border-red-500/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-1">Purge Workspace</h4>
              <p className="text-xs text-white/30 italic">This will permanently delete all artifacts and memory traces associated with this project.</p>
            </div>
            <button 
              onClick={() => {
                if (confirm('Are you sure you want to purge this workspace? All semantic data will be lost.')) {
                  deleteProject(project.id);
                }
              }}
              className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 px-6 py-2.5 rounded-xl font-bold text-[10px] tracking-widest uppercase hover:bg-red-500 hover:text-white transition-all text-red-500/80"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Purge Memory
            </button>
          </div>
        </section>

        <div className="flex items-center justify-end gap-3 pt-8">
           <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-[10px] tracking-widest uppercase text-white/30 hover:text-white transition-all">
             <RotateCcw className="w-3.5 h-3.5" />
             Rollback
           </button>
           <button className="flex items-center gap-2 bg-primary px-8 py-2.5 rounded-xl font-bold text-[10px] tracking-widest uppercase hover:bg-primary/80 transition-all shadow-lg shadow-primary/20 text-white">
             <Save className="w-3.5 h-3.5" />
             Commit Changes
           </button>
        </div>
      </div>

      {isTemplateModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 backdrop-blur-md p-6">
          <div className="w-full max-w-md bg-[#0A0A0A] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-white/5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-white italic tracking-tighter uppercase leading-none mb-1">
                  Save as <span className="text-primary italic">Template</span>
                </h2>
                <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold">Custom Boilerplate Scaffold</p>
              </div>
              <button 
                onClick={() => setIsTemplateModalOpen(false)} 
                className="p-3 hover:bg-white/5 rounded-full transition-colors text-white/40"
              >
                <Settings className="w-5 h-5 rotate-95" />
              </button>
            </div>

            <div className="p-8 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] mb-2 block">Template Name</label>
                  <input 
                    required
                    value={templateName}
                    onChange={e => setTemplateName(e.target.value)}
                    className="w-full bg-[#050505] border border-white/5 rounded-2xl px-5 py-4 text-sm text-white/80 focus:outline-none focus:border-primary transition-all font-bold placeholder:text-white/10"
                    placeholder="e.g. My Custom React Flow Blueprint"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] mb-2 block">Functional Intent Description</label>
                  <textarea 
                    required
                    value={templateDesc}
                    onChange={e => setTemplateDesc(e.target.value)}
                    className="w-full bg-[#050505] border border-white/5 rounded-2xl px-5 py-4 text-sm text-white/80 focus:outline-none focus:border-primary transition-all font-medium placeholder:text-white/10 resize-none"
                    rows={3}
                    placeholder="Describe what files and components this template scaffolds..."
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-4">
                <button 
                  type="button" 
                  onClick={() => setIsTemplateModalOpen(false)} 
                  className="flex-1 py-5 border border-white/5 rounded-3xl font-black text-[10px] uppercase tracking-[0.2em] text-white/20 hover:text-white/40 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    if (templateName.trim()) {
                      saveAsTemplate(project.id, templateName, templateDesc);
                      setIsTemplateModalOpen(false);
                      alert(`Successfully saved "${templateName}" to custom blueprints! You can now select it when initializing a new workspace.`);
                    }
                  }} 
                  className="flex-1 py-5 bg-primary text-black font-black text-[10px] uppercase tracking-[0.2em] rounded-3xl hover:scale-105 transition-all shadow-xl shadow-primary/20"
                >
                  Save Blueprint
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
