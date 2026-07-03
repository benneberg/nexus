import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { 
  GitBranch, GitCommit, GitPullRequest, GitMerge, Check, Plus, Minus, 
  AlertCircle, RefreshCw, Github, Key, Globe, ShieldCheck, ArrowUpRight, ArrowDownLeft 
} from 'lucide-react';
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
    fetchChanges,
    skills,
    addProject,
    addActivityLog
  } = useStore();

  const project = projects.find(p => p.id === currentProjectId);
  const git = project?.gitStatus;
  const isGitHubSkillInstalled = skills.some(s => s.id === 'github-integration');

  // Input states
  const [commitMsg, setCommitMsg] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [isPushing, setIsPushing] = useState(false);
  const [isCloning, setIsCloning] = useState(false);

  // GitHub integration states
  const [githubToken, setGithubToken] = useState(() => localStorage.getItem('nexus_git_token') || '');
  const [remoteUrl, setRemoteUrl] = useState(() => project?.gitUrl || localStorage.getItem(`nexus_git_remote_${currentProjectId}`) || '');
  const [selectedBranch, setSelectedBranch] = useState(() => git?.branch || 'main');
  const [isLinked, setIsLinked] = useState(() => !!githubToken && !!remoteUrl);
  const [newBranchName, setNewBranchName] = useState('');
  const [branches, setBranches] = useState<string[]>(['main', 'dev', 'feature/auth-layer']);
  const [gitTerminalLogs, setGitTerminalLogs] = useState<string[]>([]);

  // Clone repo states
  const [cloneUrl, setCloneUrl] = useState('');
  const [cloneName, setCloneName] = useState('');

  useEffect(() => {
    if (project) {
      setRemoteUrl(project.gitUrl || localStorage.getItem(`nexus_git_remote_${project.id}`) || '');
    }
  }, [project, currentProjectId]);

  const addLogLine = (line: string) => {
    setGitTerminalLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${line}`]);
  };

  const handleInitialize = () => {
    if (!currentProjectId) return;
    updateGitStatus(currentProjectId, {
      branch: selectedBranch || 'main',
      isDirty: true,
      ahead: 0,
      behind: 0,
      stagedFiles: [],
      unstagedFiles: ['src/App.tsx', 'src/store/useStore.ts', 'src/components/Sidebar.tsx', 'package.json']
    });
    addActivityLog(`Initialized local git repository for "${project?.name}"`, 'git', currentProjectId);
    addLogLine("Initialized empty Git repository in workspace root.");
  };

  const handleStage = (file: string) => {
    if (!currentProjectId) return;
    stageFile(currentProjectId, file);
    addLogLine(`Staged file: ${file}`);
  };

  const handleUnstage = (file: string) => {
    if (!currentProjectId) return;
    unstageFile(currentProjectId, file);
    addLogLine(`Unstaged file: ${file}`);
  };

  const handleCommit = () => {
    if (!currentProjectId || !commitMsg.trim() || !git || git.stagedFiles.length === 0) return;
    commitChanges(currentProjectId, commitMsg.trim());
    addLogLine(`Committed delta: "${commitMsg.trim()}"`);
    setCommitMsg('');
  };

  const handlePush = () => {
    if (!currentProjectId || !git || git.ahead === 0) return;
    setIsPushing(true);
    addLogLine("Contacting remote git server...");
    
    if (isGitHubSkillInstalled && isLinked) {
      addLogLine("Authenticating securely with GitHub Personal Access Token...");
      addLogLine(`Pushing deltas to origin/${git.branch}...`);
    }

    setTimeout(() => {
      pushChanges(currentProjectId);
      setIsPushing(false);
      addLogLine("Push complete. Remote is synchronized.");
    }, 1500);
  };

  const handleFetch = () => {
    if (!currentProjectId) return;
    setIsFetching(true);
    addLogLine("Fetching latest changes from origin...");
    
    if (isGitHubSkillInstalled && isLinked) {
      addLogLine("Checking for remote structural updates via GitHub Sync...");
    }

    setTimeout(() => {
      fetchChanges(currentProjectId);
      setIsFetching(false);
      addLogLine("Fetch finished. Synced with remote tracking branch.");
    }, 1200);
  };

  const handleLinkGitHub = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProjectId) return;
    if (githubToken && remoteUrl) {
      localStorage.setItem('nexus_git_token', githubToken);
      localStorage.setItem(`nexus_git_remote_${currentProjectId}`, remoteUrl);
      setIsLinked(true);
      
      // Update store project gitUrl
      useStore.getState().updateProject(currentProjectId, { gitUrl: remoteUrl });
      
      addLogLine(`Linked workspace to GitHub repository: ${remoteUrl}`);
      addActivityLog(`Linked workspace "${project?.name}" to remote repository`, 'git', currentProjectId);
    }
  };

  const handleUnlink = () => {
    if (!currentProjectId) return;
    localStorage.removeItem('nexus_git_token');
    localStorage.removeItem(`nexus_git_remote_${currentProjectId}`);
    setIsLinked(false);
    setGithubToken('');
    setRemoteUrl('');
    addLogLine("Removed GitHub remote reference from workspace.");
  };

  const handleCreateBranch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBranchName.trim() || !currentProjectId || !git) return;
    
    const branch = newBranchName.trim();
    if (!branches.includes(branch)) {
      setBranches(prev => [...prev, branch]);
    }
    
    updateGitStatus(currentProjectId, { branch });
    setSelectedBranch(branch);
    addLogLine(`Switched to new branch: ${branch}`);
    addActivityLog(`Created and checked out branch "${branch}"`, 'git', currentProjectId);
    setNewBranchName('');
  };

  const handleSwitchBranch = (branch: string) => {
    if (!currentProjectId || !git) return;
    updateGitStatus(currentProjectId, { branch });
    setSelectedBranch(branch);
    addLogLine(`Checked out branch: ${branch}`);
  };

  const handleCloneRepo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cloneUrl || !cloneName) return;

    setIsCloning(true);
    addLogLine(`Connecting to GitHub at ${cloneUrl}...`);
    
    setTimeout(() => {
      const newProjectId = `git-cloned-${Date.now()}`;
      
      // Add the new project
      addProject({
        id: newProjectId,
        name: cloneName,
        description: `Cloned from ${cloneUrl}`,
        scaffoldType: 'git',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        status: 'active',
        gitUrl: cloneUrl,
        gitStatus: {
          branch: 'main',
          isDirty: false,
          ahead: 0,
          behind: 0,
          stagedFiles: [],
          unstagedFiles: []
        }
      });

      // Add a couple of initial files representing a standard repository checkout
      useStore.getState().addArtifact({
        id: `clone-readme-${Date.now()}`,
        projectId: newProjectId,
        type: 'code' as any,
        title: 'README.md',
        content: `# ${cloneName}\n\nThis repository was successfully cloned into Nexus.\n\nRemote URL: \`${cloneUrl}\``,
        createdAt: Date.now()
      });

      useStore.getState().addArtifact({
        id: `clone-main-${Date.now()}`,
        projectId: newProjectId,
        type: 'code' as any,
        title: 'src/index.ts',
        content: `// Main Entry Point from repository\nconsole.log("Welcome to ${cloneName}");\n`,
        createdAt: Date.now()
      });

      // Navigate to project
      useStore.getState().setCurrentProject(newProjectId);
      useStore.getState().setActiveView('workspace');

      setIsCloning(false);
      setCloneUrl('');
      setCloneName('');
      addLogLine(`Clone successful! Created workspace "${cloneName}"`);
      addActivityLog(`Cloned remote Git repository "${cloneName}" into workspace`, 'git', newProjectId);
    }, 2000);
  };

  return (
    <div className="flex-grow flex flex-col bg-[#050505] overflow-y-auto no-scrollbar min-h-screen p-6 sm:p-8">
      {/* Skill Banner */}
      {!isGitHubSkillInstalled && (
        <div className="mb-6 p-4 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/20 rounded-xl text-primary">
              <Github className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-white">GitHub Integration Available</h4>
              <p className="text-[10px] text-white/40 leading-relaxed mt-0.5">
                Install the <span className="text-primary font-bold">GitHub Sync & Clone</span> skill from the Marketplace to enable secure remote synchronization, personal tokens, and repo cloning.
              </p>
            </div>
          </div>
          <button 
            onClick={() => useStore.getState().setActiveView('skills')}
            className="px-4 py-2 bg-primary text-black font-black text-[9px] uppercase tracking-widest rounded-xl hover:bg-primary/80 transition-all"
          >
            Get Skill
          </button>
        </div>
      )}

      <header className="border-b border-white/5 pb-6 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
           <div className="flex items-center gap-3 mb-2">
             <GitBranch className="w-6 h-6 text-primary" />
             <h1 className="text-3xl font-black tracking-tight uppercase italic text-white leading-none">Version Control</h1>
           </div>
           <p className="text-white/40 text-xs italic">Tracking semantic evolution at commit-level granularity.</p>
        </div>
        {git && (
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
        )}
      </header>

      {!git ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mb-20">
          {/* Create local repo */}
          <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-8 text-center flex flex-col items-center justify-center min-h-[350px]">
            <GitBranch className="w-16 h-16 text-white/5 mb-6" />
            <h2 className="text-lg font-bold text-white/80 uppercase tracking-widest mb-2">Initialize Local Workspace</h2>
            <p className="text-white/30 text-xs text-center max-w-sm italic leading-relaxed">
              This workspace is not currently indexed as a Git repository. Initialize one to start tracking semantic deltas.
            </p>
            <button 
              onClick={handleInitialize}
              className="mt-8 px-8 py-3 bg-primary text-black rounded-xl font-bold text-xs uppercase tracking-[0.2em] hover:bg-primary/80 transition-all shadow-xl shadow-primary/20 active:scale-95"
            >
              Initialize Repository
            </button>
          </div>

          {/* Remote Repository Cloning */}
          <div className={cn(
            "bg-[#0A0A0A] border border-white/5 rounded-3xl p-8 min-h-[350px] relative overflow-hidden transition-all",
            !isGitHubSkillInstalled && "opacity-40 pointer-events-none"
          )}>
            <div className="flex items-center gap-3 mb-4">
              <Github className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-xs uppercase tracking-widest text-white/80">Clone Remote Repository</h3>
            </div>
            <p className="text-white/40 text-[11px] mb-6 leading-relaxed">
              Clone an existing repository from GitHub directly into a new project workspace. Requires the GitHub Integration skill.
            </p>

            <form onSubmit={handleCloneRepo} className="space-y-4">
              <input 
                type="text" 
                placeholder="Repository Name (e.g. My Website)"
                value={cloneName}
                onChange={(e) => setCloneName(e.target.value)}
                required
                className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-primary transition-all text-white"
              />
              <input 
                type="url" 
                placeholder="Repository URL (https://github.com/...)"
                value={cloneUrl}
                onChange={(e) => setCloneUrl(e.target.value)}
                required
                className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-primary transition-all text-white"
              />
              <button 
                type="submit"
                disabled={isCloning || !cloneUrl || !cloneName}
                className="w-full py-3 bg-[#F27D26] hover:bg-[#F27D26]/85 rounded-xl font-black text-xs uppercase tracking-widest text-black transition-all flex items-center justify-center gap-2"
              >
                {isCloning ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Cloning Codebase...
                  </>
                ) : (
                  <>
                    <Github className="w-4 h-4" />
                    Clone with GitHub Sync
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20">
          {/* Left Column: Changes (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
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

            {/* Git Terminal Output logs */}
            {gitTerminalLogs.length > 0 && (
              <section className="bg-black border border-white/5 rounded-2xl p-4 font-mono text-[10px] text-white/50 space-y-1 max-h-48 overflow-y-auto no-scrollbar">
                <div className="flex justify-between items-center text-white/20 uppercase tracking-widest text-[8px] mb-2 font-sans font-black">
                  <span>Git Terminal Logs</span>
                  <button onClick={() => setGitTerminalLogs([])} className="hover:text-white">Clear</button>
                </div>
                {gitTerminalLogs.map((log, i) => (
                  <div key={i}>{log}</div>
                ))}
              </section>
            )}
          </div>

          {/* Right Column: Commit, Auth, Branch (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Semantic Commit Block */}
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
            </div>

            {/* GitHub Remote Integration configuration */}
            <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Github className="w-5 h-5 text-primary" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">GitHub Sync Settings</h3>
              </div>

              {!isGitHubSkillInstalled ? (
                <div className="p-4 bg-white/[0.01] border border-dashed border-white/10 rounded-xl text-center">
                  <p className="text-[11px] text-white/30 italic leading-relaxed">
                    Install "GitHub Sync & Clone" from the marketplace to configure Personal Access Tokens and remote endpoints.
                  </p>
                </div>
              ) : isLinked ? (
                <div className="space-y-4">
                  <div className="p-4 bg-primary/5 border border-primary/10 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="w-5 h-5 text-green-400" />
                      <div>
                        <span className="text-xs font-black uppercase text-white block">Connected</span>
                        <span className="text-[9px] font-mono text-white/30 truncate block max-w-[160px]">{remoteUrl}</span>
                      </div>
                    </div>
                    <button 
                      onClick={handleUnlink}
                      className="text-[9px] font-bold text-red-400 bg-red-400/10 border border-red-400/20 px-2 py-1 rounded hover:bg-red-400/20"
                    >
                      Unlink
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleLinkGitHub} className="space-y-3">
                  <div className="relative">
                    <Globe className="absolute left-3 top-3.5 w-4 h-4 text-white/20" />
                    <input 
                      type="url" 
                      placeholder="Repository Remote URL (HTTPS)"
                      value={remoteUrl}
                      onChange={(e) => setRemoteUrl(e.target.value)}
                      required
                      className="w-full bg-[#050505] border border-white/5 rounded-xl pl-10 pr-4 py-3 text-xs focus:outline-none focus:border-primary/40 transition-all text-white"
                    />
                  </div>
                  <div className="relative">
                    <Key className="absolute left-3 top-3.5 w-4 h-4 text-white/20" />
                    <input 
                      type="password" 
                      placeholder="GitHub Personal Access Token (PAT)"
                      value={githubToken}
                      onChange={(e) => setGithubToken(e.target.value)}
                      required
                      className="w-full bg-[#050505] border border-white/5 rounded-xl pl-10 pr-4 py-3 text-xs focus:outline-none focus:border-primary/40 transition-all text-white"
                    />
                  </div>
                  <button 
                    type="submit"
                    className="w-full py-2.5 bg-primary hover:bg-primary/80 transition-all text-black font-black text-xs uppercase tracking-widest rounded-xl"
                  >
                    Authorize & Link Origin
                  </button>
                </form>
              )}
            </div>

            {/* Branch status and checkouts */}
            <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-4">Branch Management</h3>
              <div className="space-y-4">
                 <div className="flex flex-col gap-2 p-3 bg-white/[0.01] rounded-xl border border-white/5">
                    <div className="flex items-center justify-between mb-2 pb-2 border-b border-white/5">
                      <div className="flex items-center gap-3">
                        <GitBranch className="w-4 h-4 text-primary" />
                        <span className="text-xs font-bold text-white/80">Active: {git.branch}</span>
                      </div>
                      <span className="text-[8px] text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded uppercase font-black font-mono">Staged</span>
                    </div>

                    <div className="space-y-1 max-h-24 overflow-y-auto no-scrollbar">
                      {branches.map(b => (
                        <button 
                          key={b}
                          onClick={() => handleSwitchBranch(b)}
                          className={cn(
                            "w-full text-left px-3 py-1.5 rounded-lg text-[10px] font-mono flex items-center justify-between transition-all",
                            git.branch === b 
                              ? "bg-white/5 text-primary border border-primary/20" 
                              : "text-white/40 hover:bg-white/[0.02] hover:text-white"
                          )}
                        >
                          <span>{b}</span>
                          {git.branch === b && <Check className="w-3 h-3 text-primary" />}
                        </button>
                      ))}
                    </div>
                 </div>

                 <form onSubmit={handleCreateBranch} className="flex gap-2">
                    <input 
                      type="text"
                      placeholder="New branch name..."
                      value={newBranchName}
                      onChange={(e) => setNewBranchName(e.target.value)}
                      required
                      className="flex-grow bg-[#050505] border border-white/5 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-primary/40 transition-all text-white font-mono"
                    />
                    <button 
                      type="submit"
                      className="px-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-xl text-xs font-bold uppercase transition-all"
                    >
                      Checkout -b
                    </button>
                 </form>
                 
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
      )}
    </div>
  );
};
