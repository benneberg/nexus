import React, { useMemo, useCallback, useState } from 'react';
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
import { CCCObject } from '../types';
import { Cpu, Box, Database, GitBranch, Zap, Share2, Info, Activity, ChevronUp, ChevronDown, X as CloseIcon } from 'lucide-react';
import { cn } from '../lib/utils';

const NODE_TYPES: Record<string, any> = {
  Project: { icon: Box, color: '#F27D26' },
  Service: { icon: Cpu, color: '#4ADE80' },
  Dependency: { icon: Database, color: '#60A5FA' },
  Module: { icon: Zap, color: '#FCD34D' },
  Route: { icon: GitBranch, color: '#A78BFA' },
  Artifact: { icon: Share2, color: '#EC4899' },
};

const CustomNode = ({ data }: { data: any }) => {
  const meta = NODE_TYPES[data.type] || { icon: Info, color: '#94A3B8' };
  const Icon = meta.icon;

  return (
    <div className="px-4 py-3 rounded-xl bg-[#0F1115] border-2 border-white/10 shadow-2xl min-w-[180px] group hover:border-primary/50 transition-all">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg" style={{ backgroundColor: `${meta.color}20`, color: meta.color }}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[10px] uppercase tracking-widest font-black opacity-40 mb-0.5">{data.type}</div>
          <div className="text-[13px] font-bold text-white truncate">{data.name}</div>
        </div>
      </div>
      {Object.keys(data.metadata || {}).length > 0 && (
         <div className="mt-3 pt-3 border-t border-white/5 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {Object.entries(data.metadata || {}).map(([key, val]: [string, any], i) => (
              <span key={i} className="text-[8px] px-1.5 py-0.5 rounded bg-white/5 text-white/40 uppercase tracking-tighter whitespace-nowrap">
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
  const { currentProjectId, cccIR, updateCCC } = useStore();
  const ir = currentProjectId ? cccIR[currentProjectId] : null;

  const initialNodes: Node[] = useMemo(() => {
    if (!ir) return [];
    return ir.nodes.map((node, i) => ({
      id: node.id,
      type: 'ccc',
      position: { x: (i % 3) * 300, y: Math.floor(i / 3) * 200 },
      data: { ...node },
    }));
  }, [ir]);

  const initialEdges: Edge[] = useMemo(() => {
    if (!ir) return [];
    const edges: Edge[] = [];
    ir.nodes.forEach(node => {
      node.connections.forEach(targetId => {
        edges.push({
          id: `edge-${node.id}-${targetId}`,
          source: node.id,
          target: targetId,
          animated: true,
          style: { stroke: '#F27D26', strokeWidth: 2, opacity: 0.4 },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: '#F27D26',
          },
        });
      });
    });
    return edges;
  }, [ir]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback((_: any, node: Node) => {
    setSelectedNode(node);
  }, []);

  const addNode = (type: string) => {
    const id = `node-${Date.now()}`;
    const newNode: Node = {
      id,
      type: 'ccc',
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: {
        id,
        name: `New ${type}`,
        type,
        metadata: {},
        connections: []
      }
    };
    setNodes(nds => [...nds, newNode]);
  };

  if (!ir) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#050505] p-8 text-center">
        <Activity className="w-12 h-12 text-white/10 mb-4 animate-pulse" />
        <h3 className="text-xl font-bold text-white uppercase italic tracking-widest mb-2 font-black">No Semantic Index</h3>
        <p className="text-white/30 text-sm max-w-sm italic leading-relaxed font-medium">
          Initialize a workspace or trigger a CCC compilation to visualize the architecture graph.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-[#050505] overflow-hidden relative">
      {/* Tool Palette */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 max-w-[calc(100vw-8rem)]">
        <div className="px-4 py-2 bg-[#0F1115]/80 backdrop-blur-md border border-white/10 rounded-full flex items-center gap-3 w-fit">
          <div className="w-2 h-2 rounded-full bg-[#F27D26] animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest text-white/60">CCC Real-time Editor</span>
        </div>
        
        <div className="flex flex-col gap-1 p-1 bg-[#0F1115]/80 backdrop-blur-md border border-white/10 rounded-xl w-fit">
          {Object.keys(NODE_TYPES).map(type => {
            const Icon = NODE_TYPES[type].icon;
            return (
              <button
                key={type}
                onClick={() => addNode(type)}
                title={`Add ${type}`}
                className="p-2 hover:bg-white/5 text-white/40 hover:text-white rounded-lg transition-all flex items-center gap-2"
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="text-[10px] uppercase font-bold tracking-wider pr-2 hidden sm:inline">{type}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Node Inspector Sidebar */}
      {selectedNode && (
        <div className="absolute top-4 right-4 z-20 w-64 max-w-[calc(100vw-2rem)] bg-[#0F1115]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-right duration-300">
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
                    setNodes(nds => nds.map(n => n.id === selectedNode.id ? { ...n, data: { ...n.data, name: newName } } : n));
                    setSelectedNode(prev => prev ? { ...prev, data: { ...prev.data, name: newName } } : null);
                  }}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-primary/50"
                />
              </div>
              <div>
                <label className="text-[8px] font-bold text-white/20 uppercase tracking-[0.2em] block mb-1">Engine Type</label>
                <div className="text-xs font-mono text-white/40 italic">{selectedNode.data.type}</div>
              </div>
              <div className="pt-4 border-t border-white/5">
                <button 
                  onClick={() => {
                    setNodes(nds => nds.filter(n => n.id !== selectedNode.id));
                    setEdges(eds => eds.filter(e => e.source !== selectedNode.id && e.target !== selectedNode.id));
                    setSelectedNode(null);
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
      <div className="flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          className="bg-dot-white/[0.05]"
          minZoom={0.2}
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
        "absolute bottom-0 left-0 right-0 z-30 bg-[#080808]/95 backdrop-blur-md border-t border-white/5 transition-all duration-300",
        isInspectorOpen ? "h-[50vh] sm:h-64" : "h-12 sm:h-12"
      )}>
        <button 
          onClick={() => setIsInspectorOpen(!isInspectorOpen)}
          className="w-full h-12 flex items-center justify-between px-6 hover:bg-white/[0.02] transition-all"
        >
          <div className="flex items-center gap-3">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#F27D26]">Engine Inspector</h3>
            <span className="text-[8px] font-mono text-white/20 italic">v{ir.lastUpdated}</span>
          </div>
          {isInspectorOpen ? <ChevronDown className="w-4 h-4 text-white/20" /> : <ChevronUp className="w-4 h-4 text-white/20" />}
        </button>
        
        <div className="p-6 overflow-y-auto h-[calc(100%-3rem)]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ir.nodes.map(node => (
              <div key={node.id} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest">{node.type}</span>
                  <span className="text-[8px] font-mono text-white/10">{node.id}</span>
                </div>
                <div className="text-sm font-bold text-white italic">{node.name}</div>
                <div className="flex flex-wrap gap-2">
                  {node.connections.map(c => (
                    <span key={c} className="text-[8px] px-1.5 py-0.5 rounded bg-[#F27D26]/10 text-[#F27D26] font-black uppercase tracking-tighter border border-[#F27D26]/20">
                      → {c}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
