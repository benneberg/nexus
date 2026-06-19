import React, { useState } from 'react';
import { FileCode, Eye, Database, Share2, Activity, Info, Settings, Cpu, Zap } from 'lucide-react';
import Editor from '@monaco-editor/react';
import { useStore } from '../../store/useStore';
import { ArtifactType } from '../../types';
import { cn } from '../../lib/utils';
import ReactFlow, { Background, Controls } from 'reactflow';
import 'reactflow/dist/style.css';

export const ArtifactPanel = () => {
  const { 
    artifacts, currentProjectId, updateArtifact,
    pendingRefactor, initiateRefactor, applyRefactor, rejectRefactor,
    telemetryStream 
  } = useStore();
  const [activeTab, setActiveTab] = useState<ArtifactType>(ArtifactType.CODE);
  const [activeArtifactId, setActiveArtifactId] = useState<string | null>(null);

  const projectArtifacts = artifacts.filter(a => a.projectId === currentProjectId);
  const currentCategoryArtifacts = projectArtifacts.filter(a => a.type === activeTab);
  const activeArtifact = currentCategoryArtifacts.find(a => a.id === activeArtifactId) || currentCategoryArtifacts[0];

  const handleEditorChange = (value: string | undefined) => {
    if (activeArtifact && value !== undefined) {
      updateArtifact(activeArtifact.id, { content: value });
    }
  };

  const tabs = [
    { id: ArtifactType.CODE, icon: FileCode, label: 'Code' },
    { id: ArtifactType.PREVIEW, icon: Eye, label: 'Preview' },
    { id: ArtifactType.GRAPH, icon: Share2, label: 'Architecture' },
    { id: ArtifactType.CCC, icon: Database, label: 'Metadata' },
    { id: ArtifactType.REPORT, icon: Activity, label: 'Status' }
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
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between px-2 sm:px-4 border-b border-white/5 bg-[#080808]">
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar py-2 sm:py-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as ArtifactType)}
              className={cn(
                "flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-lg text-[9px] sm:text-[10px] font-bold uppercase tracking-widest transition-all shrink-0",
                activeTab === tab.id 
                  ? "bg-[#F27D26] text-black shadow-lg shadow-[#F27D26]/20" 
                  : "text-white/20 hover:text-white hover:bg-white/5"
              )}
            >
              <tab.icon className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
              <span className="whitespace-nowrap">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 px-2 pb-3 sm:pb-0 sm:px-0">
          {activeTab === ArtifactType.CODE && activeArtifact && !pendingRefactor && (
            <button 
              onClick={() => initiateRefactor(activeArtifact.id)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-purple-500/10 border border-purple-500/30 px-3 py-1.5 rounded-lg font-bold text-[8px] sm:text-[9px] tracking-widest uppercase hover:bg-purple-500/20 text-purple-400 transition-all font-mono"
            >
              <Cpu className="w-2.5 sm:w-3 h-2.5 sm:h-3" />
              <span className="whitespace-nowrap">Refactor Scan</span>
            </button>
          )}
          {activeArtifact && (
            <button 
              onClick={() => alert('Initiating Muscle Deployment... Synergizing semantic layers.')}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg font-bold text-[8px] sm:text-[9px] tracking-widest uppercase hover:bg-[#F27D26] hover:text-black hover:border-transparent transition-all text-white/40"
            >
              <Zap className="w-2.5 sm:w-3 h-2.5 sm:h-3" />
              <span className="whitespace-nowrap">Execute</span>
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-hidden relative">
        {pendingRefactor && (
          <div className="absolute inset-0 z-50 bg-[#050505] flex flex-col animate-in fade-in zoom-in duration-300">
            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-[#080808]">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-purple-400">Refactoring Analysis Complete</span>
                </div>
                <div className="h-4 w-px bg-white/10" />
                <div className="flex gap-4">
                  {pendingRefactor.improvements.map((imp, i) => (
                    <span key={i} className="text-[9px] text-white/40 font-mono italic">#{imp}</span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={rejectRefactor}
                  className="px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-white/60 transition-all"
                >
                  Reject
                </button>
                <button 
                  onClick={applyRefactor}
                  className="px-6 py-1.5 bg-purple-500 rounded-lg text-[10px] font-black uppercase tracking-widest text-white hover:bg-purple-400 transition-all shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                >
                  Accept & Apply
                </button>
              </div>
            </div>
            <div className="flex-1 grid grid-cols-2 divide-x divide-white/5">
              <div className="flex flex-col">
                <div className="p-2 text-[9px] font-bold text-white/20 uppercase tracking-widest border-b border-white/5">Current State</div>
                <Editor
                  height="100%"
                  language="typescript"
                  theme="vs-dark"
                  value={pendingRefactor.originalContent}
                  options={{ readOnly: true, fontSize: 13, minimap: { enabled: false } }}
                />
              </div>
              <div className="flex flex-col">
                <div className="p-2 text-[9px] font-bold text-purple-400 uppercase tracking-widest border-b border-white/5">Proposed Shift</div>
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
        )}
        {activeTab === ArtifactType.CODE && (
          <div className="flex h-full overflow-hidden">
            {currentCategoryArtifacts.length > 1 && (
              <div className="w-48 border-r border-white/5 bg-[#080808] flex flex-col shrink-0 hidden sm:flex">
                <div className="p-3 border-b border-white/5 text-[9px] font-black text-white/20 uppercase tracking-widest">Workspace Files</div>
                <div className="flex-1 overflow-y-auto p-1 space-y-0.5 no-scrollbar">
                  {currentCategoryArtifacts.map((art) => (
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
              {currentCategoryArtifacts.length > 1 && (
                <div className="absolute top-2 right-2 z-10 sm:hidden">
                   <select 
                     value={activeArtifact?.id} 
                     onChange={(e) => setActiveArtifactId(e.target.value)}
                     className="bg-[#0A0A0A] border border-white/10 rounded px-2 py-1 text-[10px] text-white/60 focus:outline-none"
                   >
                     {currentCategoryArtifacts.map(art => (
                       <option key={art.id} value={art.id}>{art.title}</option>
                     ))}
                   </select>
                </div>
              )}
              <Editor
                height="100%"
                defaultLanguage="typescript"
                theme="vs-dark"
                value={activeArtifact?.content || '// No artifacts distilled yet.'}
                options={{
                  minimap: { enabled: false },
                  fontSize: 13,
                  fontFamily: 'JetBrains Mono',
                  scrollBeyondLastLine: false,
                  readOnly: true,
                  padding: { top: 20 },
                }}
              />
            </div>
          </div>
        )}
        
        {activeTab === ArtifactType.PREVIEW && (
          <div className="w-full h-full bg-white flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute top-4 right-4 z-10 flex gap-2">
               <button 
                 onClick={() => window.open(window.location.href, '_blank')}
                 className="flex items-center gap-2 px-4 py-2 bg-[#F27D26] text-black rounded-xl font-bold text-xs uppercase tracking-widest shadow-xl hover:scale-105 transition-all"
               >
                 <Eye className="w-4 h-4" />
                 Open App
               </button>
            </div>
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 0)', backgroundSize: '24px 24px' }} />
            <div className="relative text-center space-y-6 max-w-md px-6">
              <div className="w-24 h-24 bg-[#F27D26]/10 rounded-3xl flex items-center justify-center mx-auto border border-[#F27D26]/20">
                <Eye className="w-10 h-10 text-[#F27D26]" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-black uppercase italic tracking-tighter mb-2">Nexus Preview Engine</h2>
                <p className="text-black/40 text-sm font-medium">Real-time visualization of distilled muscle instructions. Use the "Open App" button for a full-screen instance.</p>
              </div>
              <div className="flex items-center justify-center gap-4 text-[10px] font-mono text-black/20 uppercase font-black">
                <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-green-500" /> Port 3000</span>
                <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> NSP Sync</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === ArtifactType.GRAPH && (
          <div className="w-full h-full bg-[#050505]">
            <ReactFlow nodes={dummyGraph.nodes} edges={dummyGraph.edges} fitView>
              <Background color="#F27D26" gap={20} />
              <Controls className="bg-[#0A0A0A] border-white/10" />
            </ReactFlow>
          </div>
        )}

        {activeTab === ArtifactType.CCC && (
          <div className="p-8 overflow-y-auto space-y-6 h-full bg-[#050505]">
            <h3 className="text-xs font-bold text-[#F27D26] uppercase tracking-widest italic">Semantic Distillation Snapshot</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-[#0A0A0A] border border-white/10 rounded-2xl">
                <p className="text-[10px] font-bold text-[#F27D26] mb-3 uppercase tracking-widest">Active Architectural Nodes</p>
                <ul className="text-xs space-y-3 text-white/40 font-mono italic">
                  <li>→ AuthOrchestrator v2.1</li>
                  <li>→ SynapseProtocolBridge</li>
                  <li>→ intentidyRegistry</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === ArtifactType.REPORT && (
          <div className="p-8 overflow-y-auto space-y-8 h-full bg-[#050505]">
             <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold text-[#F27D26] uppercase tracking-[0.2em] italic">Real-time NSP Telemetry (Muscle Node)</h3>
                <span className="text-[9px] font-mono text-white/20 uppercase">UPTIME: {telemetryStream.uptime}</span>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-[#0A0A0A] border border-white/5 rounded-3xl group hover:border-[#F27D26]/30 transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">CPU Orchestration</span>
                    <Cpu className="w-4 h-4 text-[#F27D26]" />
                  </div>
                  <div className="text-4xl font-mono font-bold text-white mb-4 italic">{telemetryStream.cpu}%</div>
                  <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                    <div className="h-full bg-[#F27D26] transition-all duration-1000" style={{ width: `${telemetryStream.cpu}%` }} />
                  </div>
                </div>

                <div className="p-6 bg-[#0A0A0A] border border-white/5 rounded-3xl group hover:border-blue-400/30 transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Synapse Latency</span>
                    <Activity className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="text-4xl font-mono font-bold text-white mb-4 italic">{telemetryStream.latency}ms</div>
                  <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-400 transition-all duration-1000" style={{ width: `${Math.min(100, telemetryStream.latency / 2)}%` }} />
                  </div>
                </div>

                <div className="p-6 bg-[#0A0A0A] border border-white/5 rounded-3xl group hover:border-green-400/30 transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Network Throughput</span>
                    <Share2 className="w-4 h-4 text-green-400" />
                  </div>
                  <div className="text-4xl font-mono font-bold text-white mb-4 italic">{telemetryStream.network}MB/s</div>
                  <div className="flex gap-1 h-8 items-end">
                    {[...Array(12)].map((_, i) => (
                      <div 
                        key={i} 
                        className="flex-1 bg-green-400/20 rounded-t-sm transition-all duration-500" 
                        style={{ height: `${Math.random() * 100}%` }} 
                      />
                    ))}
                  </div>
                </div>

                <div className="p-6 bg-[#0A0A0A] border border-white/5 rounded-3xl group hover:border-purple-400/30 transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">CCC Memory Graph</span>
                    <Database className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="text-4xl font-mono font-bold text-white mb-4 italic">{telemetryStream.memory}%</div>
                  <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-400 transition-all duration-1000" style={{ width: `${telemetryStream.memory}%` }} />
                  </div>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};
