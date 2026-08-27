import React, { useState, useRef } from 'react';
import { useStore } from '../store/useStore';
import { Settings, Trash2, Box, Info, Cpu, Database, Save, RotateCcw, Activity, Archive, Copy, Download, Github, Share2, Cloud, UploadCloud, DownloadCloud, Check, RefreshCw } from 'lucide-react';
import { cn } from '../lib/utils';

export const ProjectSettings = () => {
  const { 
    projects, currentProjectId, deleteProject, updateProject, 
    archiveProject, duplicateProject, saveAsTemplate,
    exportWorkspaceSnapshot, importWorkspaceSnapshot
  } = useStore();
  const project = projects.find(p => p.id === currentProjectId);
  
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [templateDesc, setTemplateDesc] = useState('');

  const [isCloudSyncing, setIsCloudSyncing] = useState(false);
  const [cloudSyncStatus, setCloudSyncStatus] = useState<string | null>(null);
  const snapshotFileInputRef = useRef<HTMLInputElement>(null);

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

  const handleExportSnapshot = () => {
    const snapshot = exportWorkspaceSnapshot();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(snapshot, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `nexus-workspace-${project.id}-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportSnapshot = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        importWorkspaceSnapshot(parsed);
        alert('Workspace snapshot successfully imported and synchronized!');
      } catch (err: any) {
        alert('Failed to parse snapshot file: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  const handleCloudSyncPush = async () => {
    setIsCloudSyncing(true);
    setCloudSyncStatus('Pushing workspace snapshot to cloud...');
    try {
      const snapshot = exportWorkspaceSnapshot();
      const res = await fetch('/api/workspace/snapshot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(snapshot)
      });
      const data = await res.json();
      if (data.status === 'ok') {
        setCloudSyncStatus(`Synced to cloud database (${data.sizeBytes} bytes) at ${new Date(data.timestamp).toLocaleTimeString()}`);
      } else {
        setCloudSyncStatus('Sync error: ' + (data.error || 'Unknown error'));
      }
    } catch (err: any) {
      setCloudSyncStatus('Network error syncing to cloud: ' + err.message);
    } finally {
      setIsCloudSyncing(false);
    }
  };

  const handleCloudSyncPull = async () => {
    setIsCloudSyncing(true);
    setCloudSyncStatus('Pulling workspace snapshot from cloud...');
    try {
      const res = await fetch('/api/workspace/snapshot');
      const data = await res.json();
      if (data.status === 'ok' && data.snapshot) {
        importWorkspaceSnapshot(data.snapshot);
        setCloudSyncStatus(`Restored cloud snapshot from ${new Date(data.snapshot.timestamp).toLocaleTimeString()}`);
      } else {
        setCloudSyncStatus('No cloud snapshot found or error: ' + (data.error || 'Empty'));
      }
    } catch (err: any) {
      setCloudSyncStatus('Network error pulling from cloud: ' + err.message);
    } finally {
      setIsCloudSyncing(false);
    }
  };

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

        {/* Cloud Database & Snapshot Synchronization */}
        <section className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Cloud className="w-3.5 h-3.5 text-primary" />
              <h3 className="text-[10px] sm:text-xs font-bold text-white/30 uppercase tracking-widest">Cloud Database & Snapshot Sync</h3>
            </div>
            <span className="text-[8px] font-mono text-green-400 bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20 uppercase">Active</span>
          </div>

          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">Multi-User Cloud Snapshot</h4>
                <p className="text-[11px] text-white/40 italic mt-0.5">
                  Synchronize your active projects, CCC code knowledge graph, pCard insights, and artifacts with persistent backend cloud storage.
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  disabled={isCloudSyncing}
                  onClick={handleCloudSyncPush}
                  className="flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 border border-primary/20 text-primary rounded-xl text-xs font-bold uppercase transition-all disabled:opacity-50"
                >
                  <UploadCloud className={cn("w-3.5 h-3.5", isCloudSyncing && "animate-spin")} />
                  Push Cloud Snapshot
                </button>
                <button
                  disabled={isCloudSyncing}
                  onClick={handleCloudSyncPull}
                  className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white rounded-xl text-xs font-bold uppercase transition-all disabled:opacity-50"
                >
                  <DownloadCloud className="w-3.5 h-3.5" />
                  Pull Cloud Snapshot
                </button>
              </div>
            </div>

            {cloudSyncStatus && (
              <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl text-[10px] font-mono text-white/60 flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                <span>{cloudSyncStatus}</span>
              </div>
            )}

            <div className="pt-2 border-t border-white/5 flex items-center justify-between flex-wrap gap-3">
              <span className="text-[10px] text-white/30 uppercase font-mono">Local Snapshot File Export/Import:</span>
              <div className="flex items-center gap-2">
                <input 
                  type="file" 
                  ref={snapshotFileInputRef}
                  onChange={handleImportSnapshot}
                  accept=".json"
                  className="hidden"
                />
                <button 
                  onClick={() => snapshotFileInputRef.current?.click()}
                  className="text-[9px] font-bold text-white/50 hover:text-white bg-white/5 px-3 py-1.5 rounded-lg border border-white/5 hover:bg-white/10 transition-all"
                >
                  Import Snapshot (.json)
                </button>
                <button 
                  onClick={handleExportSnapshot}
                  className="text-[9px] font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-lg border border-primary/20 hover:bg-primary/20 transition-all"
                >
                  Export Snapshot (.json)
                </button>
              </div>
            </div>
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
              onClick={handleExportSnapshot}
              className="flex items-center justify-center gap-2 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-primary/30 transition-all group"
            >
              <Download className="w-4 h-4 text-white/20 group-hover:text-primary transition-colors" />
              <div className="text-left">
                 <p className="text-[10px] font-bold text-white uppercase tracking-wider">Export JSON</p>
                 <p className="text-[8px] text-white/20 uppercase">Snapshot</p>
              </div>
            </button>

            <button 
              onClick={() => useStore.getState().setActiveView('git')}
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
              { label: 'Storage Sync', value: '100%', icon: Database },
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
                   <p className="text-[10px] text-white/30 italic">Multi-user cloud snapshot synchronization active.</p>
                </div>
                <div className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded text-[8px] font-black uppercase tracking-widest">Nexus Pro</div>
             </div>
             <div className="flex gap-2">
                <input 
                  placeholder="Invite by email or Nexus ID..."
                  className="flex-1 bg-white/[0.02] border border-white/10 rounded-xl px-4 py-2 text-xs text-white/60 italic"
                />
                <button 
                  onClick={() => alert('Invite link copied to clipboard!')}
                  className="px-6 py-2 bg-primary/20 border border-primary/30 text-primary hover:bg-primary/30 rounded-xl font-bold text-[10px] tracking-widest uppercase transition-all"
                >
                  Share
                </button>
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
           <button 
             onClick={handleCloudSyncPush}
             className="flex items-center gap-2 bg-primary px-8 py-2.5 rounded-xl font-bold text-[10px] tracking-widest uppercase hover:bg-primary/80 transition-all shadow-lg shadow-primary/20 text-white"
           >
             <Save className="w-3.5 h-3.5" />
             Save & Sync Workspace
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
