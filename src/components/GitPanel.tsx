import React from 'react';
import { useStore } from '../store/useStore';
import { GitBranch, GitCommit, GitPullRequest, GitMerge, Check, Plus, Minus } from 'lucide-react';
import { cn } from '../lib/utils';

export const GitPanel = () => {
  const { projects, currentProjectId, updateGitStatus } = useStore();
  const project = projects.find(p => p.id === currentProjectId);
  const git = project?.gitStatus;

  if (!git) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#050505] p-12">
        <GitBranch className="w-16 h-16 text-white/5 mb-6" />
        <h2 className="text-xl font-bold text-white/40 uppercase tracking-widest mb-2">No Git Repository Found</h2>
        <p className="text-white/20 text-sm text-center max-w-md italic leading-relaxed">
          This workspace is not currently indexed as a Git repository. Initialize one to start tracking semantic deltas.
        </p>
        <button 
          onClick={() => updateGitStatus(currentProjectId!, { branch: 'main', isDirty: false, ahead: 0, behind: 0, stagedFiles: [], unstagedFiles: [] })}
          className="mt-8 px-8 py-3 bg-primary text-white rounded-full font-bold text-xs uppercase tracking-[0.2em] hover:bg-primary/80 transition-all shadow-xl shadow-primary/20"
        >
          Initialize Repository
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-[#050505] overflow-y-auto">
      <header className="p-8 border-b border-white/5 flex items-center justify-between">
        <div>
           <div className="flex items-center gap-3 mb-2">
             <GitBranch className="w-5 h-5 text-[#F27D26]" />
             <h1 className="text-3xl font-bold tracking-tight uppercase italic text-white">Version Control</h1>
           </div>
           <p className="text-white/40 text-sm italic">Tracking semantic evolution at commit-level granularity.</p>
        </div>
        <div className="flex gap-4">
           <button className="flex items-center gap-2 bg-white/5 border border-white/10 px-6 py-2.5 rounded-full font-bold text-xs tracking-widest uppercase hover:text-white transition-all text-white/40">
             <GitPullRequest className="w-4 h-4" />
             Fetch 
           </button>
           <button className="flex items-center gap-2 bg-primary px-6 py-2.5 rounded-full font-bold text-xs tracking-widest uppercase hover:bg-primary/80 transition-all shadow-lg shadow-primary/20 text-white">
             <GitMerge className="w-4 h-4" />
             Push Delta
           </button>
        </div>
      </header>

      <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Changes */}
        <div className="space-y-8">
           <section>
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#F27D26] mb-4 flex items-center justify-between">
                Staged Changes
                <span className="text-white/20">{git.stagedFiles.length}</span>
              </h3>
              <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl overflow-hidden">
                {git.stagedFiles.length === 0 ? (
                  <div className="p-8 text-center text-white/20 italic text-xs">No staged semantic deltas.</div>
                ) : (
                  git.stagedFiles.map(file => (
                    <div key={file} className="flex items-center justify-between px-4 py-3 border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                       <span className="text-xs font-mono text-green-400/80">{file}</span>
                       <button className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-white/5 rounded transition-all">
                         <Minus className="w-3 h-3 text-white/40" />
                       </button>
                    </div>
                  ))
                )}
              </div>
           </section>

           <section>
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 mb-4 flex items-center justify-between">
                Unstaged Changes
                <span className="text-white/10">{git.unstagedFiles.length}</span>
              </h3>
              <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl overflow-hidden">
                {git.unstagedFiles.length === 1 && git.unstagedFiles[0] === 'mock' ? (
                  <div className="p-8 text-center text-white/20 italic text-xs">Awaiting intent broadcast.</div>
                ) : (
                  git.unstagedFiles.map(file => (
                    <div key={file} className="flex items-center justify-between px-4 py-3 border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                       <span className="text-xs font-mono text-white/60">{file}</span>
                       <button className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-white/5 rounded transition-all">
                         <Plus className="w-3 h-3 text-white/40" />
                       </button>
                    </div>
                  ))
                )}
              </div>
           </section>
        </div>

        {/* Right Column: Commit */}
        <div className="space-y-6">
           <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-6">Semantic Commit</h3>
              <textarea 
                placeholder="Describe the architectural shift..."
                rows={4}
                className="w-full bg-[#050505] border border-white/5 rounded-xl px-4 py-4 text-sm focus:outline-none focus:border-[#F27D26]/40 transition-all resize-none italic text-white/80"
              />
              <div className="flex mt-4 gap-4">
                 <button className="flex-1 py-3 bg-[#F27D26] text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-[#F27D26]/80 transition-all shadow-lg shadow-[#F27D26]/20">
                    Commit Changes
                 </button>
              </div>
              <div className="mt-4 flex items-center gap-4 px-2">
                 <div className="flex items-center gap-2">
                    <Check className="w-3 h-3 text-green-500" />
                    <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Sign with GPG</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <Check className="w-3 h-3 text-green-500" />
                    <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Atomic Commit</span>
                 </div>
              </div>
           </div>

           <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-4">Branch Status</h3>
              <div className="space-y-4">
                 <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                    <div className="flex items-center gap-3">
                       <GitBranch className="w-4 h-4 text-[#F27D26]" />
                       <span className="text-sm font-bold text-white/80">{git.branch}</span>
                    </div>
                    <span className="text-[10px] text-white/20 uppercase font-black">Sync Ready</span>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-white/5 rounded-xl text-center">
                       <div className="text-xs text-white/20 uppercase font-black mb-1">Ahead</div>
                       <div className="text-lg font-mono text-green-400 font-bold">{git.ahead}</div>
                    </div>
                    <div className="p-3 bg-white/5 rounded-xl text-center">
                       <div className="text-xs text-white/20 uppercase font-black mb-1">Behind</div>
                       <div className="text-lg font-mono text-red-400 font-bold">{git.behind}</div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
