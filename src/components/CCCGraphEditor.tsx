import React, { useMemo, useCallback, useState, useEffect } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap, 
  useNodesState, 
  useEdgesState, 
  addEdge,
  Connection,
  Edge,
  Node,
  MarkerType
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useStore } from '../store/useStore';
import { ArtifactType } from '../types';
import { 
  Cpu, Box, Database, GitBranch, Zap, Share2, Info, Activity, 
  ChevronUp, ChevronDown, FileText, Target, AlertTriangle, Eye, RefreshCw, X as CloseIcon 
} from 'lucide-react';
import { cn } from '../lib/utils';

const NODE_TYPES: Record<string, any> = {
  Project: { icon: Box, color: '#F27D26' },
  Service: { icon: Cpu, color: '#4ADE80' },
  Dependency: { icon: Database, color: '#60A5FA' },
  Module: { icon: Zap, color: '#FCD34D' },
  Route: { icon: GitBranch, color: '#A78BFA' },
  Artifact: { icon: Share2, color: '#EC4899' },
  File: { icon: FileText, color: '#38BDF8' },
  Goal: { icon: Target, color: '#F43F5E' },
  Blocker: { icon: AlertTriangle, color: '#EF4444' }
};

const CustomNode = ({ data }: { data: any }) => {
  const meta = NODE_TYPES[data.type] || { icon: Info, color: '#94A3B8' };
  const Icon = meta.icon;

  return (
    <div className={cn(
      "px-4 py-3 rounded-xl bg-[#0F1115] border-2 shadow-2xl min-w-[200px] group transition-all duration-300",
      data.type === 'Blocker' 
        ? "border-red-500/40 hover:border-red-500 bg-red-950/10" 
        : data.type === 'Goal'
          ? "border-rose-500/30 hover:border-rose-500 bg-rose-950/5"
          : "border-white/10 hover:border-primary/50"
    )}>
      <div className="flex items-center gap-3">
        <div 
          className="p-2 rounded-lg shrink-0" 
          style={{ backgroundColor: `${meta.color}15`, color: meta.color }}
        >
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[8px] uppercase tracking-widest font-mono font-black opacity-40 mb-0.5">
            {data.type}
          </div>
          <div className="text-[12px] font-black text-white truncate font-sans">
            {data.name}
          </div>
        </div>
      </div>
      {Object.keys(data.metadata || {}).length > 0 && (
         <div className="mt-2.5 pt-2.5 border-t border-white/5 flex flex-wrap gap-1">
            {Object.entries(data.metadata || {}).map(([key, val]: [string, any], i) => (
              <span key={i} className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-white/40 uppercase tracking-tighter whitespace-nowrap">
                {key}: {val}
              </span>
            ))}
         </div>
      )}
    </div>
  );
};

const nodeTypes = {
  ccc: CustomNode,
};

export const CCCGraphEditor = () => {
  const { currentProjectId, cccIR, pCards, artifacts } = useStore();
  const ir = currentProjectId ? cccIR[currentProjectId] : null;
  const projectPCards = currentProjectId ? pCards[currentProjectId] : null;
  const projectArtifacts = useMemo(() => {
    return artifacts.filter(a => a.projectId === currentProjectId);
  }, [artifacts, currentProjectId]);

  // Semantic Layers Tab Persistence
  const [graphTab, setGraphTab] = useState<'dependency' | 'architecture' | 'intent'>(() => {
    return (localStorage.getItem('nexus_active_graph_tab') as any) || 'architecture';
  });

  useEffect(() => {
    localStorage.setItem('nexus_active_graph_tab', graphTab);
  }, [graphTab]);

  const storageKey = `nexus_graph_${currentProjectId}_${graphTab}`;

  // Build high-fidelity graph nodes & edges
  const defaultGraph = useMemo(() => {
    if (!currentProjectId) return { nodes: [], edges: [] };

    // 1. DEPENDENCY GRAPH TAB
    if (graphTab === 'dependency') {
      const nodes: Node[] = [];
      const edges: Edge[] = [];

      const fileArtifacts = projectArtifacts.filter(a => a.type === ArtifactType.CODE || a.type === ArtifactType.REPORT);
      
      if (fileArtifacts.length > 0) {
        // Map actual code artifacts
        fileArtifacts.forEach((art, i) => {
          const lines = art.content ? art.content.split('\n').length : 0;
          nodes.push({
            id: art.id,
            type: 'ccc',
            position: { x: (i % 3) * 260, y: Math.floor(i / 3) * 180 + 50 },
            data: {
              id: art.id,
              name: art.title,
              type: 'File',
              metadata: {
                lines: `${lines} loc`,
                size: `${Math.round((art.content?.length || 0) / 100) / 10}kb`
              }
            }
          });
        });

        // Smart edge generator based on simple file referencing/imports
        fileArtifacts.forEach(sourceArt => {
          fileArtifacts.forEach(targetArt => {
            if (sourceArt.id === targetArt.id) return;
            const targetNameWithoutExt = targetArt.title.split('.')[0];
            const cleanTargetName = targetNameWithoutExt.split('/').pop() || '';
            
            // If file A mentions file B's name, draw an import edge!
            if (cleanTargetName && sourceArt.content?.includes(cleanTargetName)) {
              edges.push({
                id: `dep-edge-${sourceArt.id}-${targetArt.id}`,
                source: sourceArt.id,
                target: targetArt.id,
                animated: true,
                style: { stroke: '#38BDF8', strokeWidth: 1.5, opacity: 0.6 },
                markerEnd: { type: MarkerType.ArrowClosed, color: '#38BDF8' }
              });
            }
          });
        });
      } else {
        // High fidelity fallback files
        const files = [
          { name: 'main.tsx', path: 'src/main.tsx', lines: 18, imports: ['App'] },
          { name: 'App.tsx', path: 'src/App.tsx', lines: 120, imports: ['useStore', 'Sidebar'] },
          { name: 'useStore.ts', path: 'src/store/useStore.ts', lines: 450, imports: [] },
          { name: 'Sidebar.tsx', path: 'src/components/Sidebar.tsx', lines: 80, imports: ['useStore'] }
        ];

        files.forEach((f, i) => {
          nodes.push({
            id: `fallback-file-${f.name}`,
            type: 'ccc',
            position: { x: (i % 2) * 280, y: Math.floor(i / 2) * 180 + 50 },
            data: {
              id: `fallback-file-${f.name}`,
              name: f.name,
              type: 'File',
              metadata: {
                path: f.path,
                lines: `${f.lines} loc`
              }
            }
          });
        });

        files.forEach(f => {
          f.imports.forEach(imp => {
            const match = files.find(target => target.name.includes(imp));
            if (match) {
              edges.push({
                id: `fallback-edge-${f.name}-${match.name}`,
                source: `fallback-file-${f.name}`,
                target: `fallback-file-${match.name}`,
                animated: true,
                style: { stroke: '#38BDF8', strokeWidth: 1.5, opacity: 0.6 },
                markerEnd: { type: MarkerType.ArrowClosed, color: '#38BDF8' }
              });
            }
          });
        });
      }

      return { nodes, edges };
    }

    // 2. INTENT LAYER GRAPH TAB (Goal tracker based on PCards)
    if (graphTab === 'intent') {
      const nodes: Node[] = [];
      const edges: Edge[] = [];

      if (projectPCards && projectPCards.length > 0) {
        projectPCards.forEach((card, i) => {
          const cardNodeId = `pcard-${card.pcard_id}`;
          
          // Identity Goal node
          nodes.push({
            id: cardNodeId,
            type: 'ccc',
            position: { x: i * 400 + 50, y: 150 },
            data: {
              id: cardNodeId,
              name: card.identity.name,
              type: 'Goal',
              metadata: {
                tagline: card.identity.tagline,
                status: card.runtime.build_status
              }
            }
          });

          // Draw active goals
          if (card.intent_layer?.active_goals) {
            card.intent_layer.active_goals.forEach((goal, gIdx) => {
              const goalNodeId = `${cardNodeId}-goal-${gIdx}`;
              nodes.push({
                id: goalNodeId,
                type: 'ccc',
                position: { x: i * 400 + gIdx * 180, y: 320 },
                data: {
                  id: goalNodeId,
                  name: goal,
                  type: 'Module',
                  metadata: { priority: 'High' }
                }
              });

              edges.push({
                id: `edge-${cardNodeId}-${goalNodeId}`,
                source: cardNodeId,
                target: goalNodeId,
                style: { stroke: '#FCD34D', strokeWidth: 1.5, strokeDasharray: '4 4' }
              });
            });
          }

          // Draw blockers
          if (card.intent_layer?.blockers) {
            card.intent_layer.blockers.forEach((blocker, bIdx) => {
              const blockerNodeId = `${cardNodeId}-blocker-${bIdx}`;
              nodes.push({
                id: blockerNodeId,
                type: 'ccc',
                position: { x: i * 400 + bIdx * 180 + 100, y: 20 },
                data: {
                  id: blockerNodeId,
                  name: blocker,
                  type: 'Blocker',
                  metadata: { status: 'Critical' }
                }
              });

              edges.push({
                id: `edge-${blockerNodeId}-${cardNodeId}`,
                source: blockerNodeId,
                target: cardNodeId,
                style: { stroke: '#EF4444', strokeWidth: 2, opacity: 0.8 },
                animated: true
              });
            });
          }
        });
      } else {
        // Fallback cognitive targets
        nodes.push({
          id: 'intent-root',
          type: 'ccc',
          position: { x: 200, y: 150 },
          data: {
            id: 'intent-root',
            name: 'Core Cognitive Milestones',
            type: 'Goal',
            metadata: { state: 'Stabilizing' }
          }
        });
        nodes.push({
          id: 'intent-sub1',
          type: 'ccc',
          position: { x: 50, y: 320 },
          data: {
            id: 'intent-sub1',
            name: 'Scaffold layout patterns',
            type: 'Module',
            metadata: { completed: 'true' }
          }
        });
        nodes.push({
          id: 'intent-sub2',
          type: 'ccc',
          position: { x: 350, y: 320 },
          data: {
            id: 'intent-sub2',
            name: 'Inject semantic file endpoints',
            type: 'Module',
            metadata: { progress: '85%' }
          }
        });

        edges.push({ id: 'e-ir-1', source: 'intent-root', target: 'intent-sub1', style: { stroke: '#FCD34D' } });
        edges.push({ id: 'e-ir-2', source: 'intent-root', target: 'intent-sub2', style: { stroke: '#FCD34D' }, animated: true });
      }

      return { nodes, edges };
    }

    // 3. ARCHITECTURE VIEW TAB (Dynamic services and database layer)
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    if (ir && ir.nodes.length > 0) {
      ir.nodes.forEach((node, i) => {
        nodes.push({
          id: node.id,
          type: 'ccc',
          position: { x: (i % 3) * 280 + 50, y: Math.floor(i / 3) * 180 + 50 },
          data: { ...node },
        });
      });

      ir.nodes.forEach(node => {
        node.connections.forEach(targetId => {
          edges.push({
            id: `arch-edge-${node.id}-${targetId}`,
            source: node.id,
            target: targetId,
            animated: true,
            style: { stroke: '#F27D26', strokeWidth: 1.5, opacity: 0.6 },
            markerEnd: { type: MarkerType.ArrowClosed, color: '#F27D26' },
          });
        });
      });
    } else {
      // Default high fidelity architecture blueprint
      const defaultArchNodes = [
        { id: 'client-spa', name: 'Vite Client SPA', type: 'Service', metadata: { language: 'React / TS' }, connections: ['api-gateway'] },
        { id: 'api-gateway', name: 'Express API Gateway', type: 'Service', metadata: { port: '3000' }, connections: ['gemini-agent', 'supabase-db'] },
        { id: 'gemini-agent', name: 'Gemini Cognitive Agent', type: 'Dependency', metadata: { model: '3.5-flash' }, connections: [] },
        { id: 'supabase-db', name: 'Cloud Postgres Database', type: 'Dependency', metadata: { pooling: 'Session' }, connections: [] }
      ];

      defaultArchNodes.forEach((node, i) => {
        nodes.push({
          id: node.id,
          type: 'ccc',
          position: { x: (i % 2) * 320 + 40, y: Math.floor(i / 2) * 180 + 50 },
          data: { ...node }
        });
      });

      defaultArchNodes.forEach(node => {
        node.connections.forEach(targetId => {
          edges.push({
            id: `fallback-arch-edge-${node.id}-${targetId}`,
            source: node.id,
            target: targetId,
            animated: true,
            style: { stroke: '#4ADE80', strokeWidth: 1.5, opacity: 0.6 },
            markerEnd: { type: MarkerType.ArrowClosed, color: '#4ADE80' }
          });
        });
      });
    }

    return { nodes, edges };
  }, [graphTab, currentProjectId, ir, projectPCards, projectArtifacts]);

  // React Flow States
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);

  // Load and apply graph with coordinate persistence
  useEffect(() => {
    if (!currentProjectId) return;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.nodes && parsed.edges) {
          // If we have actual file updates (e.g. they added new files), merge/re-evaluate node attributes
          const currentDefaults = defaultGraph.nodes;
          const mergedNodes = parsed.nodes.map((n: Node) => {
            const fresh = currentDefaults.find(fd => fd.id === n.id);
            if (fresh) {
              return { ...n, data: { ...n.data, ...fresh.data } };
            }
            return n;
          });

          // Append any newly generated code files that weren't in saved storage yet
          currentDefaults.forEach(fd => {
            if (!mergedNodes.some((mn: Node) => mn.id === fd.id)) {
              mergedNodes.push(fd);
            }
          });

          setNodes(mergedNodes);
          setEdges(parsed.edges);
          return;
        }
      } catch (e) {
        console.error('Error parsing saved graph coordinate persistence:', e);
      }
    }
    setNodes(defaultGraph.nodes);
    setEdges(defaultGraph.edges);
  }, [storageKey, defaultGraph, currentProjectId, setNodes, setEdges]);

  // Save changes automatically on change
  const saveGraphState = useCallback((newNodes: Node[], newEdges: Edge[]) => {
    if (!currentProjectId) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify({ nodes: newNodes, edges: newEdges }));
    } catch (e) {
      console.error(e);
    }
  }, [currentProjectId, storageKey]);

  const handleNodesChange = useCallback((changes: any) => {
    onNodesChange(changes);
    // Persist dragging positions immediately
    setNodes((nds) => {
      const updated = changes.reduce((acc: Node[], change: any) => {
        if (change.type === 'position' && change.position) {
          return acc.map(n => n.id === change.id ? { ...n, position: change.position } : n);
        }
        return acc;
      }, nds);
      saveGraphState(updated, edges);
      return updated;
    });
  }, [onNodesChange, setNodes, edges, saveGraphState]);

  const handleEdgesChange = useCallback((changes: any) => {
    onEdgesChange(changes);
    setEdges((eds) => {
      saveGraphState(nodes, eds);
      return eds;
    });
  }, [onEdgesChange, setEdges, nodes, saveGraphState]);

  const onConnect = useCallback((params: Connection) => {
    setEdges((eds) => {
      const edgeColor = graphTab === 'dependency' ? '#38BDF8' : graphTab === 'intent' ? '#FCD34D' : '#F27D26';
      const newEdge: Edge = {
        ...params,
        id: `edge-custom-${Date.now()}`,
        animated: true,
        style: { stroke: edgeColor, strokeWidth: 1.5, opacity: 0.6 },
        markerEnd: { type: MarkerType.ArrowClosed, color: edgeColor }
      };
      const updated = addEdge(newEdge, eds);
      saveGraphState(nodes, updated);
      return updated;
    });
  }, [setEdges, nodes, saveGraphState, graphTab]);

  const onNodeClick = useCallback((_: any, node: Node) => {
    setSelectedNode(node);
  }, []);

  const addNode = (type: string) => {
    const id = `node-custom-${Date.now()}`;
    const colors = {
      File: '#38BDF8',
      Service: '#4ADE80',
      Dependency: '#60A5FA',
      Module: '#FCD34D',
      Route: '#A78BFA',
      Blocker: '#EF4444',
      Goal: '#F43F5E'
    };
    const color = (colors as any)[type] || '#94A3B8';

    const newNode: Node = {
      id,
      type: 'ccc',
      position: { x: 200 + Math.random() * 80, y: 150 + Math.random() * 80 },
      data: {
        id,
        name: `New ${type}`,
        type,
        metadata: { source: 'User Added' },
        connections: []
      }
    };
    
    setNodes(nds => {
      const updated = [...nds, newNode];
      saveGraphState(updated, edges);
      return updated;
    });
  };

  if (!currentProjectId) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#050505] p-8 text-center min-h-screen">
        <Activity className="w-12 h-12 text-white/10 mb-4 animate-pulse" />
        <h3 className="text-xl font-bold text-white uppercase italic tracking-widest mb-2 font-black">No Active Workspace</h3>
        <p className="text-white/30 text-sm max-w-sm italic leading-relaxed font-medium">
          Select or initialize a workspace to display semantic diagrams and compilation indexes.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-[#050505] overflow-hidden relative min-h-screen">
      {/* Header Tabs bar */}
      <div className="border-b border-white/5 bg-[#090A0E] px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <Activity className="w-5 h-5 text-primary" />
          <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white">Semantic Engine View</h2>
        </div>

        <div className="flex p-0.5 bg-white/5 border border-white/10 rounded-xl max-w-md">
          <button 
            onClick={() => setGraphTab('dependency')}
            className={cn(
              "flex-1 px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5",
              graphTab === 'dependency' ? "bg-white/15 text-[#38BDF8] shadow-inner" : "text-white/40 hover:text-white"
            )}
          >
            <FileText className="w-3.5 h-3.5" />
            Dependency Map
          </button>
          <button 
            onClick={() => setGraphTab('architecture')}
            className={cn(
              "flex-1 px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5",
              graphTab === 'architecture' ? "bg-white/15 text-[#4ADE80] shadow-inner" : "text-white/40 hover:text-white"
            )}
          >
            <Cpu className="w-3.5 h-3.5" />
            Architecture
          </button>
          <button 
            onClick={() => setGraphTab('intent')}
            className={cn(
              "flex-1 px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5",
              graphTab === 'intent' ? "bg-white/15 text-[#FCD34D] shadow-inner" : "text-white/40 hover:text-white"
            )}
          >
            <Target className="w-3.5 h-3.5" />
            Intent Layer
          </button>
        </div>
      </div>

      {/* Tool Palette */}
      <div className="absolute top-20 left-4 z-10 flex flex-col gap-2 max-w-[calc(100vw-8rem)]">
        <div className="px-4 py-2 bg-[#0F1115]/80 backdrop-blur-md border border-white/10 rounded-full flex items-center gap-3 w-fit">
          <div 
            className="w-2 h-2 rounded-full animate-pulse" 
            style={{ backgroundColor: graphTab === 'dependency' ? '#38BDF8' : graphTab === 'intent' ? '#FCD34D' : '#F27D26' }}
          />
          <span className="text-[9px] font-black uppercase tracking-[0.15em] text-white/70">
            {graphTab} viewer active
          </span>
        </div>
        
        <div className="flex flex-col gap-1 p-1 bg-[#0F1115]/80 backdrop-blur-md border border-white/10 rounded-xl w-fit">
          {Object.keys(NODE_TYPES)
            .filter(type => {
              if (graphTab === 'dependency') return type === 'File' || type === 'Dependency';
              if (graphTab === 'intent') return type === 'Goal' || type === 'Blocker' || type === 'Module';
              return type === 'Service' || type === 'Dependency' || type === 'Route' || type === 'Project';
            })
            .map(type => {
              const Icon = NODE_TYPES[type].icon;
              return (
                <button
                  key={type}
                  onClick={() => addNode(type)}
                  title={`Add ${type}`}
                  className="p-2 hover:bg-white/5 text-white/40 hover:text-white rounded-lg transition-all flex items-center gap-2"
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span className="text-[9px] uppercase font-bold tracking-wider pr-1 hidden sm:inline">{type}</span>
                </button>
              );
            })}
        </div>
      </div>

      {/* Node Inspector Sidebar */}
      {selectedNode && (
        <div className="absolute top-20 right-4 z-20 w-64 max-w-[calc(100vw-2rem)] bg-[#0F1115]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-right duration-300">
           <div className="p-4 border-b border-white/5 flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Node Inspector</span>
              <button onClick={() => setSelectedNode(null)} className="p-1 hover:bg-white/5 rounded text-white/40">
                <CloseIcon className="w-3.5 h-3.5" />
              </button>
           </div>
           <div className="p-4 space-y-4">
              <div>
                <label className="text-[8px] font-bold text-white/20 uppercase tracking-[0.2em] block mb-1">Entity Name</label>
                <input 
                  value={selectedNode.data.name}
                  onChange={(e) => {
                    const newName = e.target.value;
                    const updatedNodes = nodes.map(n => n.id === selectedNode.id ? { ...n, data: { ...n.data, name: newName } } : n);
                    setNodes(updatedNodes);
                    setSelectedNode(prev => prev ? { ...prev, data: { ...prev.data, name: newName } } : null);
                    saveGraphState(updatedNodes, edges);
                  }}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-primary/50"
                />
              </div>
              <div>
                <label className="text-[8px] font-bold text-white/20 uppercase tracking-[0.2em] block mb-1">Engine Type</label>
                <div className="text-xs font-mono text-white/40 italic">{selectedNode.data.type}</div>
              </div>
              {selectedNode.data.metadata && Object.keys(selectedNode.data.metadata).map(metaKey => (
                <div key={metaKey}>
                  <label className="text-[8px] font-bold text-white/20 uppercase tracking-[0.2em] block mb-1">{metaKey}</label>
                  <input 
                    value={(selectedNode.data.metadata as any)[metaKey]}
                    onChange={(e) => {
                      const updatedVal = e.target.value;
                      const updatedNodes = nodes.map(n => n.id === selectedNode.id ? {
                        ...n,
                        data: {
                          ...n.data,
                          metadata: {
                            ...(n.data.metadata || {}),
                            [metaKey]: updatedVal
                          }
                        }
                      } : n);
                      setNodes(updatedNodes);
                      setSelectedNode(prev => prev ? {
                        ...prev,
                        data: {
                          ...prev.data,
                          metadata: {
                            ...(prev.data.metadata || {}),
                            [metaKey]: updatedVal
                          }
                        }
                      } : null);
                      saveGraphState(updatedNodes, edges);
                    }}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-primary/50"
                  />
                </div>
              ))}
              <div className="pt-4 border-t border-white/5">
                <button 
                  onClick={() => {
                    const remainingNodes = nodes.filter(n => n.id !== selectedNode.id);
                    const remainingEdges = edges.filter(e => e.source !== selectedNode.id && e.target !== selectedNode.id);
                    setNodes(remainingNodes);
                    setEdges(remainingEdges);
                    setSelectedNode(null);
                    saveGraphState(remainingNodes, remainingEdges);
                  }}
                  className="w-full py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg text-red-400 text-[10px] font-bold uppercase tracking-widest transition-all"
                >
                  Terminate Node
                </button>
              </div>
           </div>
        </div>
      )}

      {/* Main Graph Area */}
      <div className="flex-1 min-h-[500px]">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={handleNodesChange}
          onEdgesChange={handleEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          className="bg-dot-white/[0.05]"
          minZoom={0.1}
          maxZoom={4}
        >
          <Background color="#111" gap={20} />
          <Controls className="!bg-[#0F1115] !border-white/10 !fill-white/40 mb-20 sm:mb-0" />
          <MiniMap 
            className="!bg-[#0B0C10] !border-white/10 hidden sm:block" 
            nodeColor={(n: any) => NODE_TYPES[n.data.type]?.color || '#94A3B8'} 
            maskColor="rgba(0,0,0,0.5)"
          />
        </ReactFlow>
      </div>

      {/* Collapsible Bottom Inspector */}
      <div className={cn(
        "absolute bottom-0 left-0 right-0 z-30 bg-[#080808]/95 backdrop-blur-md border-t border-white/5 transition-all duration-300 shrink-0",
        isInspectorOpen ? "h-[45vh] sm:h-64" : "h-12 sm:h-12"
      )}>
        <button 
          onClick={() => setIsInspectorOpen(!isInspectorOpen)}
          className="w-full h-12 flex items-center justify-between px-6 hover:bg-white/[0.02] transition-all border-b border-white/5"
        >
          <div className="flex items-center gap-3">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#F27D26]">Orchestrator Semantic Inventory</h3>
            <span className="text-[8px] font-mono text-white/20 italic">
              Mapped Entity Count: {nodes.length}
            </span>
          </div>
          {isInspectorOpen ? <ChevronDown className="w-4 h-4 text-white/20" /> : <ChevronUp className="w-4 h-4 text-white/20" />}
        </button>
        
        <div className="p-6 overflow-y-auto h-[calc(100%-3rem)]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nodes.map(node => (
              <div key={node.id} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest">{node.data.type}</span>
                  <span className="text-[8px] font-mono text-white/10 truncate max-w-[120px]">{node.id}</span>
                </div>
                <div className="text-xs font-black text-white italic">{node.data.name}</div>
                
                {/* Outgoing Connections summary */}
                <div className="flex flex-wrap gap-2">
                  {edges.filter(e => e.source === node.id).map(e => {
                    const destNode = nodes.find(n => n.id === e.target);
                    return (
                      <span key={e.id} className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-white/40 uppercase tracking-tighter">
                        → {destNode?.data.name || e.target}
                      </span>
                    );
                  })}
                  {edges.filter(e => e.source === node.id).length === 0 && (
                    <span className="text-[8px] font-mono text-white/15 italic">Terminal leaf node</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
