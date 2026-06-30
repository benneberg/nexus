import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { GitBranch, GitCommit, GitPullRequest, GitMerge, Check, Plus, Minus, AlertCircle, RefreshCw } from 'lucide-react';
import { cn } from '../lib/utils';

export const GitPanel = () => {
  const { 
    projects, 
    currentProjectId, 
    updateGitStatus,
    stageFile,
    unstageFile,
    commitChanges,
    pushChanges,
    fetchChanges
  } = useStore();

  const project = projects.find(p => p.id === currentProjectId);
  const git = project?.gitStatus;
  const [commitMsg, setCommitMsg] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [isPushing, setIsPushing] = useState(false);

  const handleInitialize = () => {
    if (!currentProjectId) return;
    updateGitStatus(currentProjectId, {
      branch: 'main',
      isDirty: true,
      ahead: 0,
      behind: 0,
      stagedFiles: [],
      unstagedFiles: ['src/App.tsx', 'src/store/useStore.ts', 'src/components/Sidebar.tsx', 'package.json']
    });
  };

  const handleStage = (file: string) => {
    if (!currentProjectId) return;
    stageFile(currentProjectId, file);
  };

  const handleUnstage = (file: string) => {
    if (!currentProjectId) return;
    unstageFile(currentProjectId, file);
  };

  const handleCommit = () => {
    if (!currentProjectId || !commitMsg.trim() || !git || git.stagedFiles.length === 0) return;
    commitChanges(currentProjectId, commitMsg.trim());
    setCommitMsg('');
  };

  const handlePush = () => {
    if (!currentProjectId || !git || git.ahead === 0) return;
    setIsPushing(true);
    setTimeout(() => {
      pushChanges(currentProjectId);
      setIsPushing(false);
    }, 1000);
  };

  const handleFetch = () => {
    if (!currentProjectId) return;
    setIsFetching(true);
    setTimeout(() => {
      fetchChanges(currentProjectId);
      setIsFetching(false);
    }, 8000000 / 100000); // quick transition
  };

  if (!git) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#050505] p-12 min-h-screen">
        <GitBranch className="w-16 h-16 text-white/5 mb-6" />
        <h2 className="text-xl font-bold text-white/40 uppercase tracking-widest mb-2">No Git Repository Found</h2>
        <p className="text-white/20 text-sm text-center max-w-md italic leading-relaxed">
          This workspace is not currently indexed as a Git repository. Initialize one to start tracking semantic deltas.
        </p>
        <button 
          onClick={handleInitialize}
          className="mt-8 px-8 py-3 bg-primary text-black rounded-xl font-bold text-xs uppercase tracking-[0.2em] hover:bg-primary/80 transition-all shadow-xl shadow-primary/20 active:scale-95"
        >
          Initialize Repository
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-[#050505] overflow-y-auto no-scrollbar min-h-screen p-6 sm:p-8">
      <header className="border-b border-white/5 pb-6 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
           <div className="flex items-center gap-3 mb-2">
             <GitBranch className="w-5 h-5 text-primary" />
             <h1 className="text-3xl font-black tracking-tight uppercase italic text-white leading-none">Version Control</h1>
           </div>
           <p className="text-white/40 text-xs italic">Tracking semantic evolution at commit-level granularity.</p>
        </div>
        <div className="flex gap-3">
           <button 
             disabled={isFetching}
             onClick={handleFetch}
             className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 px-5 py-2.5 rounded-xl font-bold text-[10px] tracking-widest uppercase hover:text-white transition-all text-white/40 hover:bg-white/10 disabled:opacity-50"
           >
             <GitPullRequest className={cn("w-3.5 h-3.5", isFetching && "animate-spin")} />
             {isFetching ? 'Fetching...' : 'Fetch'}
           </button>
           <button 
             disabled={isPushing || git.ahead === 0}
             onClick={handlePush}
             className="flex items-center justify-center gap-2 bg-primary px-5 py-2.5 rounded-xl font-black text-[10px] tracking-widest uppercase hover:bg-primary/85 transition-all text-black disabled:opacity-30 disabled:cursor-not-allowed"
           >
             <GitMerge className={cn("w-3.5 h-3.5", isPushing && "animate-spin")} />
             {isPushing ? 'Pushing...' : `Push Delta (${git.ahead})`}
           </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
        {/* Left Column: Changes */}
        <div className="space-y-6">
           <section>
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-3 flex items-center justify-between">
                Staged Changes
                <span className="text-white/20 bg-white/5 px-2 py-0.5 rounded-md text-[9px] font-mono">{git.stagedFiles.length}</span>
              </h3>
              <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl overflow-hidden">
                {git.stagedFiles.length === 0 ? (
                  <div className="p-8 text-center text-white/20 italic text-xs">No staged semantic deltas.</div>
                ) : (
                  git.stagedFiles.map(file => (
                    <div key={file} className="flex items-center justify-between px-4 py-3 border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                       <span className="text-xs font-mono text-green-400/80">{file}</span>
                       <button 
                         onClick={() => handleUnstage(file)}
                         className="p-1.5 hover:bg-white/5 rounded-lg transition-all text-white/40 hover:text-red-400"
                         title="Unstage File"
                       >
                         <Minus className="w-3.5 h-3.5" />
                       </button>
                    </div>
                  ))
                )}
              </div>
           </section>

           <section>
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/25 mb-3 flex items-center justify-between">
                Unstaged Changes
                <span className="text-white/10 bg-white/5 px-2 py-0.5 rounded-md text-[9px] font-mono">{git.unstagedFiles.length}</span>
              </h3>
              <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl overflow-hidden">
                {git.unstagedFiles.length === 0 ? (
                  <div className="p-8 text-center text-white/20 italic text-xs">Awaiting intent broadcast. Workspace clean.</div>
                ) : (
                  git.unstagedFiles.map(file => (
                    <div key={file} className="flex items-center justify-between px-4 py-3 border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                       <span className="text-xs font-mono text-white/60">{file}</span>
                       <button 
                         onClick={() => handleStage(file)}
                         className="p-1.5 hover:bg-white/5 rounded-lg transition-all text-white/40 hover:text-primary"
                         title="Stage File"
                       >
                         <Plus className="w-3.5 h-3.5" />
                       </button>
                    </div>
                  ))
                )}
              </div>
           </section>
        </div>

        {/* Right Column: Commit & Status */}
        <div className="space-y-6">
           <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-4">Semantic Commit</h3>
              <textarea 
                placeholder="Describe the architectural shift..."
                rows={4}
                value={commitMsg}
                onChange={(e) => setCommitMsg(e.target.value)}
                className="w-full bg-[#050505] border border-white/5 rounded-xl px-4 py-4 text-xs focus:outline-none focus:border-primary/40 transition-all resize-none italic text-white/80 placeholder:text-white/20"
              />
              <div className="flex mt-4 gap-4">
                 <button 
                   disabled={git.stagedFiles.length === 0 || !commitMsg.trim()}
                   onClick={handleCommit}
                   className="flex-grow py-3 bg-primary text-black rounded-xl font-black text-xs uppercase tracking-widest hover:bg-primary/85 transition-all shadow-lg shadow-primary/10 disabled:opacity-30 disabled:cursor-not-allowed"
                 >
                    Commit Changes
                 </button>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-4 px-1">
                 <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-green-500" />
                    <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Sign with GPG</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-green-500" />
                    <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Atomic Commit</span>
                 </div>
              </div>
           </div>

           <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-4">Branch Status</h3>
              <div className="space-y-4">
                 <div className="flex items-center justify-between p-3.5 bg-white/[0.01] rounded-xl border border-white/5">
                    <div className="flex items-center gap-3">
                       <GitBranch className="w-4 h-4 text-primary" />
                       <span className="text-sm font-bold text-white/80">{git.branch}</span>
                    </div>
                    <span className="text-[10px] text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-md uppercase font-black">Sync Ready</span>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white/[0.01] border border-white/5 rounded-xl text-center">
                       <div className="text-[9px] text-white/20 uppercase font-black mb-1">Ahead</div>
                       <div className="text-2xl font-mono text-green-400 font-bold italic">{git.ahead}</div>
                    </div>
                    <div className="p-4 bg-white/[0.01] border border-white/5 rounded-xl text-center">
                       <div className="text-[9px] text-white/20 uppercase font-black mb-1">Behind</div>
                       <div className="text-2xl font-mono text-red-400 font-bold italic">{git.behind}</div>
                    </div>
                 </div>

                 {git.behind > 0 && (
                   <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-[10px] text-red-400 italic flex items-center gap-2">
                     <AlertCircle className="w-4 h-4 shrink-0" />
                     Remote contains behind commits. Pull before committing more.
                   </div>
                 )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
