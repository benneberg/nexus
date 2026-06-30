import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { 
  Pin, PinOff, Trash2, ArrowUp, ArrowDown, Plus, Cpu, Activity, 
  GitBranch, Folder, Terminal, Settings, MessageSquare, Clock, 
  ArrowRight, ExternalLink, RefreshCw, LayoutGrid, Sparkles
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { CreateProjectModal } from './CreateProjectModal';

export const DashboardView = () => {
  const { 
    projects, 
    pinnedProjectIds, 
    dashboardWidgets, 
    recentActivity, 
    templates, 
    telemetryStream,
    togglePinProject, 
    reorderWidgets, 
    removeWidget, 
    addWidget, 
    setCurrentProject, 
    setActiveView 
  } = useStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [initialScaffoldType, setInitialScaffoldType] = useState<string | null>(null);

  // Helper to reorder widgets
  const moveWidget = (index: number, direction: 'up' | 'down') => {
    const newWidgets = [...dashboardWidgets];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex >= 0 && targetIndex < newWidgets.length) {
      const temp = newWidgets[index];
      newWidgets[index] = newWidgets[targetIndex];
      newWidgets[targetIndex] = temp;
      reorderWidgets(newWidgets);
    }
  };

  const allAvailableWidgets = [
    { id: 'pinned-projects', label: 'Pinned Projects' },
    { id: 'recent-activity', label: 'Recent Activity Feed' },
    { id: 'scaffold-templates', label: 'Project Templates' },
    { id: 'telemetry-status', label: 'Telemetry Status' }
  ];

  const removedWidgets = allAvailableWidgets.filter(w => !dashboardWidgets.includes(w.id));

  // Time formatter
  const formatTime = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return new Date(timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const handleScaffoldClick = (templateId: string) => {
    setInitialScaffoldType(templateId);
    setIsModalOpen(true);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#050505] p-6 sm:p-8 overflow-y-auto no-scrollbar relative min-h-screen">
      {/* Ambient background decoration */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/3 pointer-events-none" />

      {/* Header section */}
      <header className="mb-10 relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-3">
            <Sparkles className="w-3 h-3" />
            Nexus Intelligence Hub v3.0
          </div>
          <h1 className="text-4xl font-black text-white italic tracking-tighter leading-none mb-2">
            NEXUS <span className="text-primary">DASHBOARD</span>
          </h1>
          <p className="text-white/40 text-xs italic">
            Analyze, orchestrate, and control your active projects from a single unified view.
          </p>
        </div>

        {/* Restore widget menu if any are hidden */}
        {removedWidgets.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 bg-white/5 border border-white/5 p-2 rounded-2xl">
            <span className="text-[10px] font-black uppercase tracking-widest text-white/30 px-2">Hidden Widgets:</span>
            {removedWidgets.map(widget => (
              <button
                key={widget.id}
                onClick={() => addWidget(widget.id)}
                className="flex items-center gap-1.5 bg-white/5 hover:bg-primary/20 hover:text-primary border border-white/5 hover:border-primary/30 px-3 py-1.5 rounded-xl font-bold text-[9px] tracking-widest uppercase transition-all text-white/60"
              >
                <Plus className="w-2.5 h-2.5" />
                {widget.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Main Grid for Widgets */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 relative z-10 mb-20">
        <AnimatePresence mode="popLayout">
          {dashboardWidgets.map((widgetId, index) => {
            const isFirst = index === 0;
            const isLast = index === dashboardWidgets.length - 1;

            const widgetHeader = (title: string, icon: React.ReactNode) => (
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="text-primary">{icon}</div>
                  <h2 className="text-xs font-black uppercase tracking-widest text-white/80">{title}</h2>
                </div>
                {/* Control utility rail for customization */}
                <div className="flex items-center gap-1.5">
                  <button
                    disabled={isFirst}
                    onClick={() => moveWidget(index, 'up')}
                    className={cn(
                      "p-1.5 rounded bg-white/5 border border-white/5 hover:border-white/20 transition-all",
                      isFirst ? "opacity-20 cursor-not-allowed" : "hover:bg-white/10 text-white/60"
                    )}
                    title="Move Up"
                  >
                    <ArrowUp className="w-3 h-3" />
                  </button>
                  <button
                    disabled={isLast}
                    onClick={() => moveWidget(index, 'down')}
                    className={cn(
                      "p-1.5 rounded bg-white/5 border border-white/5 hover:border-white/20 transition-all",
                      isLast ? "opacity-20 cursor-not-allowed" : "hover:bg-white/10 text-white/60"
                    )}
                    title="Move Down"
                  >
                    <ArrowDown className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => removeWidget(widgetId)}
                    className="p-1.5 rounded bg-white/5 border border-white/5 hover:bg-red-500/20 hover:border-red-500/40 text-white/40 hover:text-red-400 transition-all"
                    title="Remove Widget"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );

            if (widgetId === 'pinned-projects') {
              const pinnedProjects = projects.filter(p => pinnedProjectIds.includes(p.id));
              return (
                <motion.div
                  key="pinned-projects"
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-5 sm:p-6 flex flex-col justify-between"
                >
                  <div>
                    {widgetHeader('Pinned Projects', <Pin className="w-4 h-4 fill-current text-primary" />)}
                    
                    {pinnedProjects.length === 0 ? (
                      <div className="py-12 flex flex-col items-center justify-center text-center">
                        <PinOff className="w-10 h-10 text-white/10 mb-4" />
                        <p className="text-white/40 text-xs italic">No pinned projects in workspace context.</p>
                        <p className="text-[10px] text-white/20 uppercase tracking-widest mt-1">Pin your active projects for instant staging.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {pinnedProjects.map(proj => {
                          const hasGit = !!proj.gitStatus;
                          return (
                            <div 
                              key={proj.id} 
                              className="bg-white/[0.02] border border-white/5 hover:border-primary/20 rounded-2xl p-4 transition-all group flex flex-col justify-between"
                            >
                              <div>
                                <div className="flex items-start justify-between gap-2 mb-2">
                                  <div className="truncate">
                                    <h3 className="font-bold text-white/95 text-xs truncate leading-snug">{proj.name}</h3>
                                    <span className="text-[9px] font-mono text-primary/60 italic leading-none">{proj.scaffoldType}</span>
                                  </div>
                                  <button 
                                    onClick={() => togglePinProject(proj.id)}
                                    className="p-1 rounded bg-white/5 hover:bg-white/10 border border-white/5 text-[#F27D26]"
                                    title="Unpin"
                                  >
                                    <PinOff className="w-3 h-3" />
                                  </button>
                                </div>
                                <p className="text-[11px] text-white/40 mb-4 italic line-clamp-2 min-h-[2rem]">{proj.description}</p>
                              </div>

                              <div className="border-t border-white/5 pt-3 mt-1 flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                  {hasGit ? (
                                    <span className="inline-flex items-center gap-1 text-[9px] font-mono bg-green-500/10 text-green-400 border border-green-500/20 px-1.5 py-0.5 rounded uppercase">
                                      <GitBranch className="w-2.5 h-2.5" />
                                      {proj.gitStatus?.branch || 'main'}
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center text-[9px] font-mono bg-white/5 text-white/30 px-1.5 py-0.5 rounded uppercase">
                                      Local
                                    </span>
                                  )}
                                </div>

                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => { setCurrentProject(proj.id); setActiveView('workspace'); }}
                                    className="px-3 py-1 bg-primary text-black rounded-lg font-black text-[9px] uppercase tracking-wider hover:bg-primary/85 transition-all"
                                  >
                                    Workspace
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Pin more helper footer */}
                  {projects.length > pinnedProjects.length && (
                    <div className="mt-6 pt-4 border-t border-white/5">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-black uppercase tracking-widest text-white/20">Other Projects ({projects.length - pinnedProjects.length}):</span>
                        <div className="flex gap-2 max-w-full overflow-x-auto no-scrollbar py-1">
                          {projects.filter(p => !pinnedProjectIds.includes(p.id)).map(p => (
                            <button
                              key={p.id}
                              onClick={() => togglePinProject(p.id)}
                              className="px-2.5 py-1 bg-white/5 border border-white/5 hover:border-primary/30 rounded-lg text-[9px] font-bold text-white/50 hover:text-primary transition-all flex items-center gap-1.5 shrink-0"
                            >
                              <Pin className="w-2.5 h-2.5" />
                              {p.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            }

            if (widgetId === 'recent-activity') {
              return (
                <motion.div
                  key="recent-activity"
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-5 sm:p-6"
                >
                  {widgetHeader('Recent Activity Feed', <Clock className="w-4 h-4 text-primary" />)}
                  
                  {recentActivity.length === 0 ? (
                    <div className="py-12 text-center text-white/20 italic text-xs">No recorded telemetry. Initiate workspace builds to populate stream.</div>
                  ) : (
                    <div className="space-y-4 max-h-[300px] overflow-y-auto no-scrollbar pr-1">
                      {recentActivity.map((act) => {
                        let icon = <Folder className="w-3.5 h-3.5 text-blue-400" />;
                        if (act.type === 'git') icon = <GitBranch className="w-3.5 h-3.5 text-orange-400" />;
                        if (act.type === 'skill') icon = <Cpu className="w-3.5 h-3.5 text-purple-400" />;
                        if (act.type === 'scaffold') icon = <Terminal className="w-3.5 h-3.5 text-green-400" />;

                        return (
                          <div 
                            key={act.id} 
                            className="flex items-start gap-3.5 p-3 rounded-2xl bg-white/[0.01] hover:bg-white/[0.03] border border-white/5 transition-colors"
                          >
                            <div className="p-2 bg-white/5 rounded-xl shrink-0 mt-0.5">
                              {icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-white/80 font-medium italic leading-relaxed">{act.text}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-[9px] font-mono text-white/20 uppercase tracking-tighter">{formatTime(act.timestamp)}</span>
                                {act.projectId && (
                                  <>
                                    <span className="text-white/10 text-[8px] font-black shrink-0">•</span>
                                    <span className="text-[9px] font-mono text-primary/40 uppercase tracking-widest truncate max-w-[120px]">
                                      {projects.find(p => p.id === act.projectId)?.name || 'Nexus'}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              );
            }

            if (widgetId === 'scaffold-templates') {
              return (
                <motion.div
                  key="scaffold-templates"
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-5 sm:p-6"
                >
                  {widgetHeader('Project Templates', <LayoutGrid className="w-4 h-4 text-primary" />)}
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[300px] overflow-y-auto no-scrollbar pr-1">
                    {templates.slice(0, 4).map((tpl) => (
                      <div 
                        key={tpl.id}
                        className="p-4 rounded-2xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] hover:border-[#F27D26]/20 transition-all flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[8px] font-black bg-white/5 text-white/40 px-1.5 py-0.5 rounded uppercase tracking-wider">
                              {tpl.category}
                            </span>
                          </div>
                          <h3 className="text-xs font-bold text-white/90 leading-tight mb-1">{tpl.name}</h3>
                          <p className="text-[10px] text-white/45 italic line-clamp-2 mb-3">{tpl.description}</p>
                        </div>

                        <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-2">
                          <div className="flex flex-wrap gap-1">
                            {tpl.stack.slice(0, 2).map(s => (
                              <span key={s} className="text-[8px] bg-white/5 text-white/30 px-1 rounded-sm">{s}</span>
                            ))}
                          </div>
                          <button
                            onClick={() => handleScaffoldClick(tpl.id)}
                            className="px-2 py-1 bg-white/5 hover:bg-primary text-white hover:text-black rounded-lg font-black text-[9px] uppercase tracking-wider transition-all flex items-center gap-1"
                          >
                            Scaffold
                            <ArrowRight className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            }

            if (widgetId === 'telemetry-status') {
              return (
                <motion.div
                  key="telemetry-status"
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-5 sm:p-6"
                >
                  {widgetHeader('Telemetry Status', <Activity className="w-4 h-4 text-primary" />)}
                  
                  <div className="grid grid-cols-2 gap-4">
                    {/* Live Latency */}
                    <div className="p-4 rounded-2xl bg-white/[0.01] border border-white/5 flex flex-col justify-between hover:border-blue-400/20 transition-colors">
                      <div className="flex items-center justify-between text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">
                        <span>Latency</span>
                        <Activity className="w-3.5 h-3.5 text-blue-400" />
                      </div>
                      <div className="text-2xl font-mono font-bold text-white italic">{telemetryStream.latency}ms</div>
                      <span className="text-[9px] font-mono text-green-400/60 mt-1 uppercase">● Normal</span>
                    </div>

                    {/* CPU load */}
                    <div className="p-4 rounded-2xl bg-white/[0.01] border border-white/5 flex flex-col justify-between hover:border-orange-400/20 transition-colors">
                      <div className="flex items-center justify-between text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">
                        <span>CPU load</span>
                        <Cpu className="w-3.5 h-3.5 text-orange-400" />
                      </div>
                      <div className="text-2xl font-mono font-bold text-white italic">{telemetryStream.cpu}%</div>
                      <span className="text-[9px] font-mono text-green-400/60 mt-1 uppercase">● Optimized</span>
                    </div>

                    {/* Active Workspaces */}
                    <div className="p-4 rounded-2xl bg-white/[0.01] border border-white/5 flex flex-col justify-between hover:border-purple-400/20 transition-colors">
                      <div className="flex items-center justify-between text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">
                        <span>Projects</span>
                        <Folder className="w-3.5 h-3.5 text-purple-400" />
                      </div>
                      <div className="text-2xl font-mono font-bold text-white italic">{projects.length}</div>
                      <span className="text-[9px] font-mono text-white/20 mt-1 uppercase">{projects.filter(p => p.status === 'archived').length} Archived</span>
                    </div>

                    {/* Uptime */}
                    <div className="p-4 rounded-2xl bg-white/[0.01] border border-white/5 flex flex-col justify-between hover:border-green-400/20 transition-colors">
                      <div className="flex items-center justify-between text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">
                        <span>Uptime</span>
                        <Clock className="w-3.5 h-3.5 text-green-400" />
                      </div>
                      <div className="text-xl font-mono font-bold text-white italic truncate">{telemetryStream.uptime}</div>
                      <span className="text-[9px] font-mono text-white/20 mt-1 uppercase">Sync Active</span>
                    </div>
                  </div>
                </motion.div>
              );
            }

            return null;
          })}
        </AnimatePresence>
      </div>

      <CreateProjectModal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setInitialScaffoldType(null); }} 
      />
    </div>
  );
};
