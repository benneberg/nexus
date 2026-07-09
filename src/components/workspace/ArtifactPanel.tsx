import React, { useState, useEffect, useRef } from 'react';
import { 
  FileCode, Eye, Database, Share2, Activity, Cpu, Zap, Columns, 
  Terminal, MessageSquare, Plus, Send, Check, Shield, GitBranch, Play, RefreshCw, AlertCircle
} from 'lucide-react';
import Editor, { DiffEditor } from '@monaco-editor/react';
import { useStore } from '../../store/useStore';
import { ArtifactType } from '../../types';
import { cn } from '../../lib/utils';
import ReactFlow, { Background, Controls } from 'reactflow';
import 'reactflow/dist/style.css';

export const ArtifactPanel = () => {
  const { 
    artifacts, 
    currentProjectId, 
    updateArtifact,
    pendingRefactor, 
    initiateRefactor, 
    applyRefactor, 
    rejectRefactor,
    telemetryStream,
    messages,
    addMessage,
    projects,
    setOrchestrating
  } = useStore();

  const [activeTab, setActiveTab] = useState<string>('code');
  const [activeArtifactId, setActiveArtifactId] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    `[${new Date().toLocaleTimeString()}] INF - Initializing Nexus Build Pipeline...`,
    `[${new Date().toLocaleTimeString()}] INF - Resolving workspace dependencies...`,
    `[${new Date().toLocaleTimeString()}] INF - Vite v5.2.11 dev server booted on host 0.0.0.0:3000`,
    `[${new Date().toLocaleTimeString()}] INF - Semantic index mapping complete. Symbol nodes stored in CCC memory.`
  ]);
  const [isRestartingLogs, setIsRestartingLogs] = useState(false);

  const logsEndRef = useRef<HTMLDivElement>(null);
  const project = projects.find(p => p.id === currentProjectId);
  const projectArtifacts = artifacts.filter(a => a.projectId === currentProjectId);

  // Filter artifacts of type CODE
  const codeArtifacts = projectArtifacts.filter(a => a.type === ArtifactType.CODE);
  const activeArtifact = codeArtifacts.find(a => a.id === activeArtifactId) || codeArtifacts[0];

  // Auto-scroll logs
  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [terminalLogs]);

  // Simulate streaming logs every few seconds when on logs tab
  useEffect(() => {
    if (activeTab !== 'logs') return;

    const interval = setInterval(() => {
      const logTypes = ['INF', 'INF', 'WRN', 'INF'];
      const messagesList = [
        'Hot Module Replacement: Checking for updates...',
        'CCC Node synchronization success. Telemetry latency stable.',
        'AST index is partially cached. Performance remains normal.',
        'File changed: src/main.ts - compiling compilation targets...',
        'Synapse connection verified.'
      ];
      const selectedType = logTypes[Math.floor(Math.random() * logTypes.length)];
      const selectedMsg = messagesList[Math.floor(Math.random() * messagesList.length)];
      const logLine = `[${new Date().toLocaleTimeString()}] ${selectedType} - ${selectedMsg}`;
      
      setTerminalLogs(prev => [...prev, logLine]);
    }, 4000);

    return () => clearInterval(interval);
  }, [activeTab]);

  const handleEditorChange = (value: string | undefined) => {
    if (activeArtifact && value !== undefined) {
      updateArtifact(activeArtifact.id, { content: value });
    }
  };

  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    addMessage({
      id: `chat-art-${Date.now()}`,
      role: 'user',
      content: chatInput,
      timestamp: Date.now()
    });
    setChatInput('');
    setOrchestrating(true);
    setTimeout(() => {
      setOrchestrating(false);
      addMessage({
        id: `chat-art-reply-${Date.now()}`,
        role: 'assistant',
        content: `I have analyzed your request in the context of the active workspace. Let me update the compilation parameters and sync the architectural dependencies.`,
        timestamp: Date.now()
      });
    }, 1500);
  };

  const handleRestartServer = () => {
    setIsRestartingLogs(true);
    setTerminalLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] WRN - Shutting down Vite server...`]);
    setTimeout(() => {
      setTerminalLogs([
        `[${new Date().toLocaleTimeString()}] INF - Initializing Nexus Build Pipeline...`,
        `[${new Date().toLocaleTimeString()}] INF - Vite dev server restarted successfully. Listening on Port 3000.`,
        `[${new Date().toLocaleTimeString()}] INF - Clean AST mapping rebuilt in 42ms.`
      ]);
      setIsRestartingLogs(false);
    }, 1200);
  };

  const tabs = [
    { id: 'chat', icon: MessageSquare, label: 'Chat' },
    { id: 'code', icon: FileCode, label: 'Code' },
    { id: 'diff', icon: Columns, label: 'Diff' },
    { id: 'preview', icon: Eye, label: 'Preview' },
    { id: 'logs', icon: Terminal, label: 'Logs' },
    { id: 'metrics', icon: Activity, label: 'Metrics' },
    { id: 'ccc', icon: Database, label: 'CCC' },
    { id: 'graph', icon: Share2, label: 'Graph' }
  ];

  const dummyGraph = {
    nodes: [
      { id: '1', data: { label: 'AuthSystem' }, position: { x: 250, y: 5 }, style: { background: '#F27D26', color: '#000', border: 'none', borderRadius: '12px', fontWeight: 'bold' } },
      { id: '2', data: { label: 'DistillationEngine' }, position: { x: 100, y: 100 }, style: { background: '#0A0A0A', color: '#fff', border: '1px solid #F27D26', borderRadius: '12px' } },
      { id: '3', data: { label: 'pCardRegistry' }, position: { x: 400, y: 100 }, style: { background: '#0A0A0A', color: '#fff', border: '1px solid #F27D26', borderRadius: '12px' } },
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#F27D26' } },
      { id: 'e1-3', source: '1', target: '3', style: { stroke: '#F27D26' } },
    ]
  };

  return (
    <div className="flex flex-col h-full bg-[#050505] flex-1">
      {/* 8 Custom Artifact Tabs Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between border-b border-white/5 bg-[#080808] shrink-0">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-2 px-3 sm:py-0 scroll-smooth">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-3 text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all shrink-0 border-b-2",
                activeTab === tab.id 
                  ? "border-primary text-primary bg-white/[0.01]" 
                  : "border-transparent text-white/30 hover:text-white/60 hover:bg-white/5"
              )}
            >
              <tab.icon className="w-3 h-3" />
              <span className="whitespace-nowrap">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 px-3 py-2 sm:py-0 border-t sm:border-t-0 border-white/5">
          {activeTab === 'code' && activeArtifact && !pendingRefactor && (
            <button 
              onClick={() => initiateRefactor(activeArtifact.id)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-purple-500/10 border border-purple-500/30 px-3 py-1.5 rounded-lg font-bold text-[8px] sm:text-[9px] tracking-widest uppercase hover:bg-purple-500/20 text-purple-400 transition-all font-mono"
            >
              <Cpu className="w-3 h-3" />
              <span>Refactor</span>
            </button>
          )}
          {activeTab === 'preview' && (
            <button 
              onClick={() => alert('Starting live server sync...')}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-lg font-bold text-[8px] sm:text-[9px] tracking-widest uppercase hover:bg-primary hover:text-black transition-all text-primary"
            >
              <Play className="w-3 h-3" />
              <span>Sync Live</span>
            </button>
          )}
        </div>
      </div>

      {/* Tab Contents Frame */}
      <div className="flex-1 overflow-hidden relative">
        {/* Pending Refactor Screen Overrides Panel */}
        {pendingRefactor && activeTab === 'code' && (
          <div className="absolute inset-0 z-50 bg-[#050505] flex flex-col animate-in fade-in zoom-in duration-300">
            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-[#080808]">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-purple-400">Proposed Refactor Changes</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={rejectRefactor}
                  className="px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-white/60 transition-all"
                >
                  Reject
                </button>
                <button 
                  onClick={applyRefactor}
                  className="px-6 py-1.5 bg-purple-500 rounded-lg text-[10px] font-black uppercase tracking-widest text-white hover:bg-purple-400 transition-all shadow-lg"
                >
                  Apply
                </button>
              </div>
            </div>
            <div className="flex-1 grid grid-cols-2 divide-x divide-white/5 overflow-hidden">
              <div className="flex flex-col h-full">
                <div className="p-2 text-[9px] font-bold text-white/20 uppercase tracking-widest border-b border-white/5 bg-[#080808]">Current State</div>
                <div className="flex-1">
                  <Editor
                    height="100%"
                    language="typescript"
                    theme="vs-dark"
                    value={pendingRefactor.originalContent}
                    options={{ readOnly: true, fontSize: 13, minimap: { enabled: false } }}
                  />
                </div>
              </div>
              <div className="flex flex-col h-full">
                <div className="p-2 text-[9px] font-bold text-purple-400 uppercase tracking-widest border-b border-white/5 bg-[#080808]">Proposed Shift</div>
                <div className="flex-1">
                  <Editor
                    height="100%"
                    language="typescript"
                    theme="vs-dark"
                    value={pendingRefactor.proposedContent}
                    options={{ readOnly: true, fontSize: 13, minimap: { enabled: false } }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 1. CHAT TAB */}
        {activeTab === 'chat' && (
          <div className="flex flex-col h-full bg-[#050505]">
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 no-scrollbar">
              {messages.map((msg, idx) => (
                <div key={msg.id || idx} className={cn(
                  "flex flex-col gap-1.5 max-w-[85%] rounded-2xl p-4 border",
                  msg.role === 'user' 
                    ? "bg-white/[0.02] border-white/10 text-white/95 ml-auto" 
                    : "bg-[#F27D26]/5 border-[#F27D26]/10 text-white/95"
                )}>
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono text-white/25 uppercase tracking-widest">
                      {msg.role === 'user' ? 'Operator' : 'Orchestrator'}
                    </span>
                    <span className="text-[8px] text-white/10">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="text-xs leading-relaxed italic">{msg.content}</p>
                </div>
              ))}
            </div>
            
            <div className="p-4 border-t border-white/5 bg-[#080808]">
              <div className="relative">
                <input 
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                  placeholder="Ask something about the current artifacts..."
                  className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-primary transition-all pr-12"
                />
                <button 
                  onClick={handleSendChat}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 bg-primary hover:bg-primary/80 transition-colors text-black rounded-lg"
                >
                  <Send className="w-3 h-3 fill-current" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 2. CODE TAB */}
        {activeTab === 'code' && (
          <div className="flex h-full overflow-hidden">
            {codeArtifacts.length > 1 && (
              <div className="w-48 border-r border-white/5 bg-[#080808] flex flex-col shrink-0 hidden sm:flex">
                <div className="p-3 border-b border-white/5 text-[9px] font-black text-white/20 uppercase tracking-widest">Workspace Files</div>
                <div className="flex-1 overflow-y-auto p-1 space-y-0.5 no-scrollbar">
                  {codeArtifacts.map((art) => (
                    <button
                      key={art.id}
                      onClick={() => setActiveArtifactId(art.id)}
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-lg text-[10px] font-bold truncate transition-all",
                        activeArtifact?.id === art.id 
                          ? "bg-primary/10 text-primary" 
                          : "text-white/40 hover:bg-white/5 hover:text-white"
                      )}
                    >
                      {art.title}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className="flex-1 relative h-full">
              {codeArtifacts.length > 1 && (
                <div className="absolute top-2 right-2 z-10 sm:hidden">
                   <select 
                     value={activeArtifact?.id} 
                     onChange={(e) => setActiveArtifactId(e.target.value)}
                     className="bg-[#0A0A0A] border border-white/10 rounded px-2 py-1 text-[10px] text-white/60 focus:outline-none"
                   >
                     {codeArtifacts.map(art => (
                       <option key={art.id} value={art.id}>{art.title}</option>
                     ))}
                   </select>
                </div>
              )}
              <Editor
                height="100%"
                defaultLanguage="typescript"
                theme="vs-dark"
                value={activeArtifact?.content || `// Active workspace: ${project?.name || 'Nexus'}\n// Request code scaffold or build template to begin distillation.`}
                options={{
                  minimap: { enabled: false },
                  fontSize: 13,
                  fontFamily: 'JetBrains Mono',
                  scrollBeyondLastLine: false,
                  readOnly: false,
                  padding: { top: 20 },
                }}
                onChange={handleEditorChange}
              />
            </div>
          </div>
        )}

        {/* 3. DIFF TAB */}
        {activeTab === 'diff' && (
          <div className="h-full flex flex-col bg-[#050505]">
            {pendingRefactor ? (
              <div className="flex-1 flex flex-col">
                <div className="p-3 border-b border-white/5 bg-[#080808] flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-purple-400">
                  <span>Reviewing Diff: Original vs Refactored</span>
                  <button 
                    onClick={applyRefactor}
                    className="bg-purple-500 hover:bg-purple-400 text-white px-3 py-1 rounded text-[9px] transition-all uppercase"
                  >
                    Accept Diff
                  </button>
                </div>
                <div className="flex-1 overflow-hidden">
                  <DiffEditor
                    height="100%"
                    language="typescript"
                    theme="vs-dark"
                    original={pendingRefactor.originalContent}
                    modified={pendingRefactor.proposedContent}
                    options={{
                      readOnly: true,
                      fontSize: 13,
                      minimap: { enabled: false },
                      renderSideBySide: true,
                      scrollBeyondLastLine: false,
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto space-y-5">
                <Columns className="w-12 h-12 text-white/10" />
                <div>
                  <h3 className="text-sm font-black text-white/80 uppercase tracking-widest">Delta Workspace Clean</h3>
                  <p className="text-xs text-white/30 italic leading-relaxed mt-2">
                    All semantic nodes match build master. Request a Code Refactor or commit new changes to render local diff.
                  </p>
                </div>
                <button 
                  onClick={() => {
                    if (activeArtifact) {
                      initiateRefactor(activeArtifact.id);
                    } else {
                      alert('Select a file in the "Code" tab to initiate refactoring scan first.');
                    }
                  }}
                  className="px-5 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all rounded-xl font-bold text-[9px] tracking-widest uppercase text-white/60 hover:text-white"
                >
                  Scan Active File
                </button>
              </div>
            )}
          </div>
        )}

        {/* 4. PREVIEW TAB */}
        {activeTab === 'preview' && (
          <div className="w-full h-full bg-[#080808] flex flex-col relative overflow-hidden">
            {/* Embedded browser address bar */}
            <div className="bg-[#0c0c0c] border-b border-white/5 px-4 py-2 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/40" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/40" />
              </div>
              <div className="bg-[#050505] border border-white/10 px-12 py-1 rounded-md text-[10px] text-white/40 tracking-wider text-center flex-1 max-w-lg mx-auto truncate select-none">
                http://localhost:3000/
              </div>
              <div className="w-12 text-right">
                <span className="text-[8px] bg-green-500/15 text-green-400 px-1.5 py-0.5 rounded uppercase font-black">LIVE</span>
              </div>
            </div>

            {/* Simulated Live preview rendering */}
            <div className="flex-1 bg-white p-12 overflow-y-auto text-black flex flex-col items-center justify-center text-center">
              <div className="max-w-md space-y-6">
                <div className="w-20 h-20 bg-primary/10 rounded-[2rem] border border-primary/20 flex items-center justify-center mx-auto text-[#F27D26] animate-pulse">
                  <Cpu className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-2xl font-black italic tracking-tighter uppercase mb-2">
                    {project?.name || 'Nexus Workspace'}
                  </h1>
                  <span className="text-[10px] font-mono text-black/40 uppercase tracking-widest block mb-4">
                    STACK: {project?.scaffoldType || 'Blank React Node'}
                  </span>
                  <p className="text-xs text-black/50 leading-relaxed font-medium">
                    This browser is connected via live secure socket to port 3000. Changes distilled from chat automatically update the preview frame.
                  </p>
                </div>
                <div className="flex items-center justify-center gap-3">
                  <button 
                    onClick={() => alert('Vitals healthy. No build issues.')}
                    className="px-4 py-2 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-black/80 transition-all"
                  >
                    Diagnose Vitals
                  </button>
                  <button 
                    onClick={() => window.open(window.location.href, '_blank')}
                    className="px-4 py-2 border border-black/10 hover:bg-black/5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all"
                  >
                    Open Tab
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 5. LOGS TAB */}
        {activeTab === 'logs' && (
          <div className="h-full flex flex-col bg-black font-mono text-xs text-white/80 p-5 overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4 shrink-0">
              <span className="text-[10px] text-white/30 uppercase tracking-widest flex items-center gap-1.5 font-bold">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping" />
                Standard Output (TTY)
              </span>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setTerminalLogs([])}
                  className="text-[9px] border border-white/10 hover:border-white/20 bg-white/5 px-2.5 py-1 rounded hover:text-white uppercase font-bold tracking-wider transition-all"
                >
                  Clear Output
                </button>
                <button 
                  disabled={isRestartingLogs}
                  onClick={handleRestartServer}
                  className="text-[9px] border border-white/10 hover:border-white/20 bg-white/5 px-2.5 py-1 rounded hover:text-white uppercase font-bold tracking-wider transition-all flex items-center gap-1"
                >
                  <RefreshCw className={cn("w-2.5 h-2.5", isRestartingLogs && "animate-spin")} />
                  Restart Dev Server
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar space-y-1.5 text-[11px] leading-relaxed pb-4">
              {terminalLogs.map((log, idx) => {
                let color = 'text-white/60';
                if (log.includes('WRN')) color = 'text-yellow-400/80';
                if (log.includes('ERR')) color = 'text-red-400/90';
                if (log.includes('success') || log.includes('restarted')) color = 'text-green-400/90';
                
                return (
                  <div key={idx} className={cn("font-mono", color)}>
                    {log}
                  </div>
                );
              })}
              <div ref={logsEndRef} />
            </div>
          </div>
        )}

        {/* 6. METRICS TAB */}
        {activeTab === 'metrics' && (
          <div className="p-6 sm:p-8 overflow-y-auto space-y-6 h-full bg-[#050505] no-scrollbar">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-black text-primary uppercase tracking-[0.2em] italic">Orchestrator NSP Vitals</h3>
              <span className="text-[9px] font-mono text-white/20 uppercase">STREAK: 100% HEALTH</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Latency Widget with Sparkline */}
              <div className="p-4 rounded-2xl bg-white/[0.01] border border-white/5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[9px] font-black text-white/30 uppercase tracking-widest mb-1">
                    <span>Active Latency</span>
                    <Activity className="w-3.5 h-3.5 text-blue-400" />
                  </div>
                  <div className="text-3xl font-mono font-bold text-white italic">{telemetryStream.latency}ms</div>
                </div>
                {/* SVG sparkline */}
                <div className="h-8 w-full mt-3 flex items-end">
                  <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
                    <path 
                      d="M 0 25 Q 15 5, 30 20 T 60 10 T 90 22 T 100 15" 
                      fill="none" 
                      stroke="#60a5fa" 
                      strokeWidth="2" 
                    />
                  </svg>
                </div>
              </div>

              {/* Memory Allocation */}
              <div className="p-4 rounded-2xl bg-white/[0.01] border border-white/5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[9px] font-black text-white/30 uppercase tracking-widest mb-1">
                    <span>Memory Utilization</span>
                    <Database className="w-3.5 h-3.5 text-purple-400" />
                  </div>
                  <div className="text-3xl font-mono font-bold text-white italic">{telemetryStream.memory}%</div>
                </div>
                {/* Visual Bar graph */}
                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden mt-3">
                  <div className="h-full bg-purple-500 transition-all duration-1000" style={{ width: `${telemetryStream.memory}%` }} />
                </div>
              </div>

              {/* Network Bandwidth */}
              <div className="p-4 rounded-2xl bg-white/[0.01] border border-white/5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[9px] font-black text-white/30 uppercase tracking-widest mb-1">
                    <span>NSP Socket Rate</span>
                    <Share2 className="w-3.5 h-3.5 text-green-400" />
                  </div>
                  <div className="text-3xl font-mono font-bold text-white italic">{telemetryStream.network} MB/s</div>
                </div>
                <div className="flex gap-0.5 h-6 items-end mt-3">
                  {[...Array(16)].map((_, i) => (
                    <div 
                      key={i} 
                      className="flex-1 bg-green-400/20 rounded-t-sm transition-all" 
                      style={{ height: `${20 + Math.random() * 80}%` }} 
                    />
                  ))}
                </div>
              </div>

              {/* CPU utilization */}
              <div className="p-4 rounded-2xl bg-white/[0.01] border border-white/5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[9px] font-black text-white/30 uppercase tracking-widest mb-1">
                    <span>Total CPU Share</span>
                    <Cpu className="w-3.5 h-3.5 text-orange-400" />
                  </div>
                  <div className="text-3xl font-mono font-bold text-white italic">{telemetryStream.cpu}%</div>
                </div>
                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden mt-3">
                  <div className="h-full bg-[#F27D26] transition-all duration-1000" style={{ width: `${telemetryStream.cpu}%` }} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 7. CCC TAB */}
        {activeTab === 'ccc' && (
          <div className="p-6 sm:p-8 overflow-y-auto space-y-6 h-full bg-[#050505] no-scrollbar">
            <h3 className="text-xs font-black text-primary uppercase tracking-widest italic">Semantic Index Snapshot (CCC)</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 bg-white/[0.01] border border-white/5 rounded-2xl">
                <p className="text-[10px] font-black text-primary mb-3 uppercase tracking-widest">Active Architectural Nodes</p>
                <ul className="text-xs space-y-3 text-white/60 font-mono italic">
                  <li className="flex items-center gap-2">
                    <Check className="w-3 h-3 text-green-500" />
                    → AuthOrchestrator v2.1
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3 h-3 text-green-500" />
                    → SynapseProtocolBridge
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3 h-3 text-green-500" />
                    → identityRegistry
                  </li>
                </ul>
              </div>

              <div className="p-5 bg-white/[0.01] border border-white/5 rounded-2xl">
                <p className="text-[10px] font-black text-primary mb-3 uppercase tracking-widest">Ingestion Rules</p>
                <div className="text-[11px] text-white/40 leading-relaxed font-mono">
                  <p>SCOPE: [src/**/*]</p>
                  <p className="mt-1">INDEX DEPTH: Abstract Syntax Tree (AST)</p>
                  <p className="mt-1">CACHING: Active - compiled nodes matching commit targets.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 8. GRAPH TAB */}
        {activeTab === 'graph' && (
          <div className="w-full h-full bg-[#050505] relative">
            <ReactFlow nodes={dummyGraph.nodes} edges={dummyGraph.edges} fitView>
              <Background color="#F27D26" gap={20} />
              <Controls className="bg-[#0A0A0A] border-white/10" />
            </ReactFlow>
          </div>
        )}
      </div>
    </div>
  );
};
