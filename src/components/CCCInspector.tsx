import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';
import { Box, Share2, Database, Code, Activity, Search, RefreshCw } from 'lucide-react';
import { cn } from '../lib/utils';
import { useVirtualizer } from '@tanstack/react-virtual';

export const CCCInspector = () => {
  const { cccIR, currentProjectId, updateCCC } = useStore();
  const ir = currentProjectId ? cccIR[currentProjectId] : null;
  const [filter, setFilter] = useState('');
  const [isIndexing, setIsIndexing] = useState(false);

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

  const nodes = ir?.nodes.filter(n => {
    const searchStr = filter.toLowerCase();
    const matchesName = n.name.toLowerCase().includes(searchStr);
    const matchesMetadata = Object.values(n.metadata).some(v => 
      v.toString().toLowerCase().includes(searchStr)
    );
    const matchesType = n.type.toLowerCase().includes(searchStr);
    return matchesName || matchesMetadata || matchesType;
  }) || [];

  // Chunk items into rows for grid-compatible virtualization
  const columns = 3;
  const rows: any[][] = [];
  for (let i = 0; i < nodes.length; i += columns) {
    rows.push(nodes.slice(i, i + columns));
  }

  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 180,
    overscan: 5,
  });

  return (
    <div className="flex-1 flex flex-col bg-[#050505] overflow-hidden">
      <div className="p-8 border-b border-white/5 bg-[#080808]">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-[#F27D26] italic uppercase">CCC Semantic Inspector</h2>
            <p className="text-white/40 text-sm">Real-time repository ingestion and architectural compilation.</p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={handleReIndex}
              disabled={isIndexing}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-all border border-white/5 disabled:opacity-50"
            >
              <RefreshCw className={cn("w-3 h-3", isIndexing && "animate-spin")} />
              {isIndexing ? 'Indexing...' : 'Re-Index'}
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#F27D26] text-black rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-[#F27D26]/80 transition-all">
              <Share2 className="w-3 h-3" />
              Export IR
            </button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <Stat name="Total Symbols" value={nodes.length.toString()} icon={Database} />
          <Stat name="Dependencies" value={nodes.filter(n => n.type === 'Dependency').length.toString()} icon={Box} />
          <Stat name="Active Services" value={nodes.filter(n => n.type === 'Service').length.toString()} icon={Activity} />
          <Stat name="Alignment" value="0.992" icon={Code} color="text-green-500" />
        </div>
      </div>

      <div className="flex-1 flex flex-col p-8 overflow-hidden">
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
          <input 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Query semantic graph..."
            className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-3 text-sm focus:outline-none focus:border-primary/50"
          />
        </div>

        {nodes.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <Database className="w-12 h-12 text-white/10 mb-4 animate-pulse" />
            <p className="text-white/40 italic">No semantic symbols match your query.</p>
          </div>
        ) : (
          <div 
            ref={parentRef}
            className="flex-1 overflow-y-auto no-scrollbar"
          >
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
                      <div key={node.id} className="p-4 bg-[#0A0A0A] border border-white/5 rounded-xl hover:border-white/10 transition-all flex flex-col gap-3 h-full">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] uppercase font-bold tracking-widest text-[#F27D26]">{node.type}</span>
                          <span className="text-[9px] text-white/20 font-mono italic">#{node.id}</span>
                        </div>
                        <h4 className="font-bold text-white/90 truncate">{node.name}</h4>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {Object.entries(node.metadata).map(([k, v]) => (
                            <span key={k} className="px-2 py-0.5 bg-white/5 rounded text-[9px] text-white/40">{k}: {String(v)}</span>
                          ))}
                        </div>
                        <div className="mt-auto pt-4 border-t border-white/5 flex items-center gap-2">
                           <span className="text-[9px] uppercase tracking-widest text-white/20">Connections:</span>
                           <div className="flex gap-1 overflow-x-auto no-scrollbar">
                             {node.connections.map(c => (
                               <span key={c} className="shrink-0 px-1.5 py-0.5 bg-primary/10 text-primary text-[8px] rounded font-mono">{c}</span>
                             ))}
                           </div>
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
    </div>
  );
};

const Stat = ({ name, value, icon: Icon, color = "text-white/90" }: { name: string, value: string, icon: any, color?: string }) => (
  <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 flex items-center gap-4">
    <div className="p-2 bg-white/5 rounded-lg text-[#F27D26]">
      <Icon className="w-5 h-5" />
    </div>
    <div>
      <p className="text-[10px] uppercase tracking-widest text-white/30">{name}</p>
      <p className={cn("text-xl font-bold tracking-tight", color)}>{value}</p>
    </div>
  </div>
);
