import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';
import { 
  Box, 
  Share2, 
  Database, 
  Code, 
  Activity, 
  Search, 
  RefreshCw, 
  SlidersHorizontal, 
  Plus, 
  Trash2, 
  HelpCircle, 
  ChevronRight, 
  Layers, 
  GitFork, 
  AlertTriangle, 
  FileCode, 
  Check, 
  X,
  BookOpen,
  Zap,
  Filter,
  BarChart2
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useVirtualizer } from '@tanstack/react-virtual';
import { CCCObject, CCCIR } from '../types';
import { 
  queryCCC, 
  calculateAggregates, 
  parseQueryDSL, 
  PRESET_CCC_QUERIES, 
  ConditionGroup, 
  QueryCondition, 
  Operator, 
  getFieldValue 
} from '../lib/cccQueryEngine';

export const CCCInspector = () => {
  const { cccIR, currentProjectId, updateCCC } = useStore();
  const ir = currentProjectId ? cccIR[currentProjectId] : null;

  const [queryMode, setQueryMode] = useState<'dsl' | 'visual' | 'preset'>('dsl');
  const [dslInput, setDslInput] = useState('');
  const [isIndexing, setIsIndexing] = useState(false);
  const [showDocModal, setShowDocModal] = useState(false);
  const [selectedNode, setSelectedNode] = useState<CCCObject | null>(null);

  // Visual Builder State
  const [visualLogicalOp, setVisualLogicalOp] = useState<'AND' | 'OR'>('AND');
  const [visualConditions, setVisualConditions] = useState<QueryCondition[]>([
    { field: 'type', operator: '=', value: 'Module' }
  ]);

  const handleReIndex = async () => {
    if (!currentProjectId) return;
    setIsIndexing(true);
    try {
      const response = await fetch('/api/ccc/index', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        const data = await response.json();
        updateCCC(currentProjectId, data);
      } else {
        console.error('Failed to index workspace');
      }
    } catch (err) {
      console.error('Error fetching semantic index:', err);
    } finally {
      setIsIndexing(false);
    }
  };

  useEffect(() => {
    if (!ir && currentProjectId) {
      handleReIndex();
    }
  }, [currentProjectId, ir]);

  // Derive condition group from active query mode
  const currentConditionGroup: ConditionGroup = React.useMemo(() => {
    if (queryMode === 'visual') {
      return {
        logicalOp: visualLogicalOp,
        conditions: visualConditions
      };
    }
    return parseQueryDSL(dslInput);
  }, [queryMode, dslInput, visualLogicalOp, visualConditions]);

  // Execute query on graph
  const filteredNodes = React.useMemo(() => {
    return queryCCC(ir, currentConditionGroup);
  }, [ir, currentConditionGroup]);

  // Calculate aggregates over entire graph and filtered results
  const totalAggregates = React.useMemo(() => {
    return calculateAggregates(ir?.nodes || []);
  }, [ir]);

  const filteredAggregates = React.useMemo(() => {
    return calculateAggregates(filteredNodes);
  }, [filteredNodes]);

  // Chunk items into rows for virtualized grid
  const columns = 3;
  const rows: CCCObject[][] = [];
  for (let i = 0; i < filteredNodes.length; i += columns) {
    rows.push(filteredNodes.slice(i, i + columns));
  }

  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 200,
    overscan: 5,
  });

  const applyPreset = (preset: typeof PRESET_CCC_QUERIES[0]) => {
    setDslInput(preset.dsl);
    setQueryMode('dsl');
  };

  const handleAddVisualCondition = () => {
    setVisualConditions([...visualConditions, { field: 'type', operator: '=', value: 'Module' }]);
  };

  const handleRemoveVisualCondition = (index: number) => {
    setVisualConditions(visualConditions.filter((_, i) => i !== index));
  };

  const handleUpdateVisualCondition = (index: number, updates: Partial<QueryCondition>) => {
    setVisualConditions(visualConditions.map((c, i) => i === index ? { ...c, ...updates } : c));
  };

  return (
    <div className="flex-1 flex flex-col bg-[#050505] overflow-hidden relative">
      {/* Header */}
      <div className="p-8 border-b border-white/5 bg-[#080808]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-2">
              <Zap className="w-3 h-3" />
              Common Code Context (CCC) Graph Engine
            </div>
            <h2 className="text-3xl font-black tracking-tight text-[#F27D26] italic uppercase">
              CCC Semantic Inspector
            </h2>
            <p className="text-white/40 text-xs italic">
              Ingest, query, and analyze repository architecture with nested conditions and aggregate insights.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowDocModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-white/5 rounded-xl text-xs font-bold uppercase tracking-wider text-white/70 hover:text-white hover:bg-white/10 transition-all border border-white/5"
            >
              <BookOpen className="w-3.5 h-3.5 text-primary" />
              Query Guide
            </button>
            <button 
              onClick={handleReIndex}
              disabled={isIndexing}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-all border border-white/5 disabled:opacity-50 text-white"
            >
              <RefreshCw className={cn("w-3.5 h-3.5 text-primary", isIndexing && "animate-spin")} />
              {isIndexing ? 'Indexing...' : 'Re-Index'}
            </button>
          </div>
        </div>

        {/* Live Aggregates Header Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <Stat 
            name="Matched Symbols" 
            value={`${filteredNodes.length} / ${totalAggregates.totalNodes}`} 
            sub={`LOC: ${filteredAggregates.totalLinesOfCode.toLocaleString()}`}
            icon={Database} 
            color="text-primary" 
          />
          <Stat 
            name="Critical Hubs" 
            value={totalAggregates.criticalHubsCount.toString()} 
            sub="Nodes with >= 3 connections"
            icon={GitFork} 
            color={totalAggregates.criticalHubsCount > 0 ? "text-yellow-400" : "text-white/40"}
            onClick={() => setDslInput('connections >= 3')}
          />
          <Stat 
            name="Orphan Symbols" 
            value={totalAggregates.orphanNodesCount.toString()} 
            sub="Nodes with 0 connections"
            icon={AlertTriangle} 
            color={totalAggregates.orphanNodesCount > 0 ? "text-orange-400" : "text-white/40"}
            onClick={() => setDslInput('connections = 0')}
          />
          <Stat 
            name="Dependency Density" 
            value={`${totalAggregates.avgConnections} avg`} 
            sub={`Ratio: ${totalAggregates.dependencyDensityRatio}`}
            icon={Activity} 
            color="text-green-400" 
          />
        </div>

        {/* Symbol Type Bar Breakdown */}
        {Object.keys(totalAggregates.byType).length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-2 border-t border-white/5">
            <span className="text-[9px] uppercase tracking-widest text-white/30 font-bold shrink-0">Type Breakdown:</span>
            {Object.entries(totalAggregates.byType).map(([type, count]) => (
              <button
                key={type}
                onClick={() => { setDslInput(`type = ${type}`); setQueryMode('dsl'); }}
                className="px-2.5 py-1 bg-white/5 border border-white/5 rounded-lg text-[10px] text-white/60 hover:text-white hover:border-primary/40 transition-all font-mono flex items-center gap-1.5 shrink-0"
              >
                <span className="font-bold text-primary">{type}</span>
                <span className="text-white/30">({count})</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Query Control Section */}
      <div className="p-6 border-b border-white/5 bg-[#0A0A0A] space-y-4">
        {/* Mode Switcher */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setQueryMode('dsl')}
              className={cn(
                "px-4 py-1.5 text-xs font-bold uppercase rounded-lg transition-all flex items-center gap-1.5",
                queryMode === 'dsl' ? "bg-primary text-black" : "text-white/40 hover:text-white"
              )}
            >
              <Search className="w-3 h-3" />
              DSL Query
            </button>
            <button
              onClick={() => setQueryMode('visual')}
              className={cn(
                "px-4 py-1.5 text-xs font-bold uppercase rounded-lg transition-all flex items-center gap-1.5",
                queryMode === 'visual' ? "bg-primary text-black" : "text-white/40 hover:text-white"
              )}
            >
              <SlidersHorizontal className="w-3 h-3" />
              Visual Builder
            </button>
            <button
              onClick={() => setQueryMode('preset')}
              className={cn(
                "px-4 py-1.5 text-xs font-bold uppercase rounded-lg transition-all flex items-center gap-1.5",
                queryMode === 'preset' ? "bg-primary text-black" : "text-white/40 hover:text-white"
              )}
            >
              <Filter className="w-3 h-3" />
              Architectural Presets
            </button>
          </div>

          {(dslInput || visualConditions.length > 0) && (
            <button 
              onClick={() => { setDslInput(''); setVisualConditions([]); }}
              className="text-[10px] font-bold text-white/30 hover:text-red-400 uppercase tracking-wider flex items-center gap-1"
            >
              <X className="w-3 h-3" />
              Clear Query
            </button>
          )}
        </div>

        {/* DSL Mode Input */}
        {queryMode === 'dsl' && (
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input 
              value={dslInput}
              onChange={(e) => setDslInput(e.target.value)}
              placeholder="Query semantic graph... (e.g. type = Module AND connections > 2 OR metadata.lines > 50)"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-3 text-xs text-white focus:outline-none focus:border-primary/50 font-mono placeholder:text-white/20"
            />
          </div>
        )}

        {/* Visual Builder Mode */}
        {queryMode === 'visual' && (
          <div className="space-y-3 bg-white/[0.02] border border-white/5 p-4 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-[10px] uppercase font-bold text-white/40">Logical Operator:</span>
              <button 
                onClick={() => setVisualLogicalOp('AND')}
                className={cn("px-3 py-1 rounded text-xs font-bold", visualLogicalOp === 'AND' ? "bg-primary text-black" : "bg-white/5 text-white/40")}
              >AND</button>
              <button 
                onClick={() => setVisualLogicalOp('OR')}
                className={cn("px-3 py-1 rounded text-xs font-bold", visualLogicalOp === 'OR' ? "bg-primary text-black" : "bg-white/5 text-white/40")}
              >OR</button>
            </div>

            <div className="space-y-2">
              {visualConditions.map((cond, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <select 
                    value={cond.field}
                    onChange={(e) => handleUpdateVisualCondition(idx, { field: e.target.value })}
                    className="bg-black border border-white/10 rounded px-3 py-1.5 text-xs text-white font-mono"
                  >
                    <option value="type">type</option>
                    <option value="name">name</option>
                    <option value="id">id</option>
                    <option value="connections">connections (count)</option>
                    <option value="metadata.path">metadata.path</option>
                    <option value="metadata.lines">metadata.lines</option>
                    <option value="metadata.version">metadata.version</option>
                  </select>

                  <select 
                    value={cond.operator}
                    onChange={(e) => handleUpdateVisualCondition(idx, { operator: e.target.value as Operator })}
                    className="bg-black border border-white/10 rounded px-3 py-1.5 text-xs text-white font-mono"
                  >
                    <option value="=">=</option>
                    <option value="!=">!=</option>
                    <option value=">">&gt;</option>
                    <option value="<">&lt;</option>
                    <option value=">=">&gt;=</option>
                    <option value="<=">&lt;=</option>
                    <option value="contains">contains</option>
                  </select>

                  <input 
                    value={cond.value}
                    onChange={(e) => handleUpdateVisualCondition(idx, { value: e.target.value })}
                    placeholder="value..."
                    className="flex-1 bg-black border border-white/10 rounded px-3 py-1.5 text-xs text-white font-mono"
                  />

                  <button 
                    onClick={() => handleRemoveVisualCondition(idx)}
                    className="p-1.5 hover:bg-red-500/20 text-red-400 rounded"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <button 
              onClick={handleAddVisualCondition}
              className="flex items-center gap-1.5 text-xs font-bold text-primary hover:text-white pt-2"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Condition Row
            </button>
          </div>
        )}

        {/* Presets Mode */}
        {queryMode === 'preset' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {PRESET_CCC_QUERIES.map(preset => (
              <div 
                key={preset.id}
                onClick={() => applyPreset(preset)}
                className="p-3 bg-white/[0.02] border border-white/5 rounded-xl hover:border-primary/40 hover:bg-white/[0.04] transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <h4 className="text-xs font-bold text-white mb-1 flex items-center justify-between">
                    {preset.name}
                    <ChevronRight className="w-3 h-3 text-primary" />
                  </h4>
                  <p className="text-[10px] text-white/40 italic mb-2">{preset.description}</p>
                </div>
                <code className="text-[9px] text-primary font-mono bg-primary/10 px-2 py-0.5 rounded self-start">{preset.dsl}</code>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main Results Virtualized List */}
      <div className="flex-1 flex flex-col p-6 overflow-hidden">
        {filteredNodes.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border border-dashed border-white/10 rounded-2xl bg-white/[0.01]">
            <Database className="w-12 h-12 text-white/10 mb-4 animate-pulse" />
            <p className="text-white/40 italic text-xs mb-2">No semantic symbols match your query condition.</p>
            <p className="text-white/20 text-[10px]">Try clearing filters or switching query modes.</p>
          </div>
        ) : (
          <div ref={parentRef} className="flex-1 overflow-y-auto no-scrollbar">
            <div
              style={{
                height: `${rowVirtualizer.getTotalSize()}px`,
                width: '100%',
                position: 'relative',
              }}
            >
              {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const rowItems = rows[virtualRow.index];
                return (
                  <div
                    key={virtualRow.key}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: `${virtualRow.size}px`,
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-2"
                  >
                    {rowItems.map((node) => (
                      <div 
                        key={node.id} 
                        onClick={() => setSelectedNode(node)}
                        className="p-4 bg-[#0A0A0A] border border-white/5 rounded-2xl hover:border-primary/40 transition-all flex flex-col gap-3 h-full cursor-pointer group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] uppercase font-bold tracking-widest text-[#F27D26] bg-[#F27D26]/10 px-2 py-0.5 rounded border border-[#F27D26]/20">
                            {node.type}
                          </span>
                          <span className="text-[9px] text-white/30 font-mono italic">#{node.id}</span>
                        </div>

                        <h4 className="font-bold text-white/90 truncate group-hover:text-primary transition-colors text-sm">
                          {node.name}
                        </h4>

                        <div className="flex flex-wrap gap-1.5">
                          {Object.entries(node.metadata || {}).map(([k, v]) => (
                            <span key={k} className="px-2 py-0.5 bg-white/5 rounded text-[9px] text-white/50 font-mono">
                              {k}: {String(v)}
                            </span>
                          ))}
                        </div>

                        <div className="mt-auto pt-3 border-t border-white/5 flex items-center justify-between">
                           <div className="flex items-center gap-1">
                             <GitFork className="w-3 h-3 text-white/30" />
                             <span className="text-[9px] font-bold text-white/40">{node.connections?.length || 0} connections</span>
                           </div>
                           <span className="text-[9px] text-primary font-bold uppercase tracking-wider group-hover:translate-x-1 transition-transform flex items-center gap-1">
                             Inspect <ChevronRight className="w-2.5 h-2.5" />
                           </span>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Node Detail Inspector Drawer */}
      {selectedNode && (
        <NodeDetailModal node={selectedNode} onClose={() => setSelectedNode(null)} />
      )}

      {/* Query Documentation & Syntax Reference Modal */}
      {showDocModal && (
        <QueryDocumentationModal onClose={() => setShowDocModal(false)} onApplyDsl={(dsl) => { setDslInput(dsl); setQueryMode('dsl'); setShowDocModal(false); }} />
      )}
    </div>
  );
};

const Stat = ({ name, value, sub, icon: Icon, color = "text-white/90", onClick }: { name: string, value: string, sub?: string, icon: any, color?: string, onClick?: () => void }) => (
  <div 
    onClick={onClick}
    className={cn(
      "bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex items-center gap-4 transition-all",
      onClick && "cursor-pointer hover:border-primary/40 hover:bg-white/[0.04]"
    )}
  >
    <div className="p-3 bg-white/5 rounded-xl text-[#F27D26] shrink-0">
      <Icon className="w-5 h-5" />
    </div>
    <div className="overflow-hidden">
      <p className="text-[9px] uppercase tracking-widest text-white/30 font-bold">{name}</p>
      <p className={cn("text-xl font-black tracking-tight", color)}>{value}</p>
      {sub && <p className="text-[9px] text-white/20 italic truncate">{sub}</p>}
    </div>
  </div>
);

const NodeDetailModal = ({ node, onClose }: { node: CCCObject; onClose: () => void }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-6">
    <div className="w-full max-w-xl bg-[#0A0A0A] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
      <div className="p-6 border-b border-white/10 bg-[#0D0D0D] flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase font-bold text-primary tracking-widest bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
            {node.type}
          </span>
          <h3 className="text-xl font-bold text-white mt-1">{node.name}</h3>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-white/40 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh]">
        <div>
          <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Metadata Attributes</h4>
          <div className="bg-[#050505] p-4 rounded-xl border border-white/5 space-y-2">
            {Object.entries(node.metadata || {}).map(([k, v]) => (
              <div key={k} className="flex items-center justify-between text-xs border-b border-white/5 pb-1">
                <span className="text-white/40 font-mono">{k}:</span>
                <span className="text-white font-mono font-bold">{String(v)}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-2 flex items-center justify-between">
            <span>Graph Connections ({node.connections?.length || 0})</span>
          </h4>
          {node.connections && node.connections.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {node.connections.map(c => (
                <span key={c} className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary rounded-xl text-xs font-mono font-bold">
                  #{c}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-white/30 italic">No connections registered for this node.</p>
          )}
        </div>

        <div>
          <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Raw Symbol JSON</h4>
          <pre className="p-4 bg-[#050505] border border-white/5 rounded-xl text-[10px] text-white/70 font-mono overflow-x-auto">
            {JSON.stringify(node, null, 2)}
          </pre>
        </div>
      </div>

      <div className="p-4 border-t border-white/10 bg-[#0D0D0D] flex justify-end">
        <button onClick={onClose} className="px-5 py-2 bg-primary text-black font-bold text-xs uppercase rounded-xl">Done</button>
      </div>
    </div>
  </div>
);

const QueryDocumentationModal = ({ onClose, onApplyDsl }: { onClose: () => void; onApplyDsl: (dsl: string) => void }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md p-6">
    <div className="w-full max-w-3xl bg-[#0A0A0A] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
      <div className="p-6 border-b border-white/10 bg-[#0D0D0D] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BookOpen className="w-6 h-6 text-primary" />
          <div>
            <h3 className="text-lg font-bold text-white uppercase italic">CCC Query Documentation & Syntax Guide</h3>
            <p className="text-[10px] text-white/40 uppercase tracking-widest">Advanced Architectural Querying Engine</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-white/40 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs text-white/80 leading-relaxed">
        <div>
          <h4 className="text-sm font-bold text-primary uppercase mb-2">1. Overview & Query Structures</h4>
          <p className="text-white/60 mb-3">
            The Common Code Context (CCC) inspector enables precise graph queries across repository symbols, files, dependencies, routes, and services. You can query using simple DSL strings or the Visual Condition Builder.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-bold text-primary uppercase mb-2">2. Supported Query Fields</h4>
          <div className="grid grid-cols-2 gap-2 bg-[#050505] p-3 rounded-xl border border-white/5 font-mono text-[11px]">
            <div><span className="text-primary font-bold">type</span>: Node type (Module, Dependency, Service, File)</div>
            <div><span className="text-primary font-bold">name</span>: Node or package name</div>
            <div><span className="text-primary font-bold">connections</span>: Number of outgoing links</div>
            <div><span className="text-primary font-bold">metadata.lines</span>: Lines of code (LOC)</div>
            <div><span className="text-primary font-bold">metadata.path</span>: Relative file path</div>
            <div><span className="text-primary font-bold">metadata.version</span>: Dependency semver</div>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-bold text-primary uppercase mb-2">3. Operators & Logical Expressions</h4>
          <p className="text-white/60 mb-2">
            Operators include <code className="text-primary font-bold">=</code>, <code className="text-primary font-bold">!=</code>, <code className="text-primary font-bold">&gt;</code>, <code className="text-primary font-bold">&lt;</code>, <code className="text-primary font-bold">&gt;=</code>, <code className="text-primary font-bold">&lt;=</code>, and <code className="text-primary font-bold">contains</code>. Connect expressions with <code className="text-primary font-bold">AND</code> or <code className="text-primary font-bold">OR</code>.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-bold text-primary uppercase mb-2">4. Real-World Architectural Examples</h4>
          <div className="space-y-2">
            {[
              { label: 'Find High Complexity Modules', dsl: 'metadata.lines > 50 AND type = Module' },
              { label: 'Locate Core Choke Points & Hubs', dsl: 'connections >= 3' },
              { label: 'Inspect All Express Services & Endpoints', dsl: 'type = Service OR metadata.path contains server' },
              { label: 'Isolate Unconnected Orphan Files', dsl: 'connections = 0' },
              { label: 'Filter Third-Party Packages', dsl: 'type = Dependency' }
            ].map((ex, i) => (
              <div key={i} className="p-3 bg-[#050505] border border-white/5 rounded-xl flex items-center justify-between">
                <div>
                  <p className="font-bold text-white text-[11px]">{ex.label}</p>
                  <code className="text-[10px] text-primary font-mono">{ex.dsl}</code>
                </div>
                <button 
                  onClick={() => onApplyDsl(ex.dsl)}
                  className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary rounded-lg text-[10px] font-bold uppercase hover:bg-primary hover:text-black transition-colors"
                >
                  Apply Query
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-white/10 bg-[#0D0D0D] flex justify-end">
        <button onClick={onClose} className="px-5 py-2 bg-primary text-black font-bold text-xs uppercase rounded-xl">Close Guide</button>
      </div>
    </div>
  </div>
);
