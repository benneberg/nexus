import React, { useState } from 'react';
import { LayoutGrid, MessageSquare, Box, PenTool, Cpu, Settings, Plus, Share2, GitBranch, X, Info, Archive, Home } from 'lucide-react';
import { useStore } from '../store/useStore';
import { cn } from '../lib/utils';
import { CreateProjectModal } from './CreateProjectModal';

export const Sidebar = ({ mobileOnClose }: { mobileOnClose?: () => void }) => {
  const { projects, currentProjectId, setCurrentProject, activeView, setActiveView } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navItems = [
    { icon: Home, label: 'Dashboard', id: 'dashboard' },
    { icon: MessageSquare, label: 'Workspace', id: 'workspace' },
    { icon: Box, label: 'Builds', id: 'artifacts' },
    { icon: LayoutGrid, label: 'PCards', id: 'deck' },
    { icon: Share2, label: 'Semantic', id: 'ccc' },
    { icon: Cpu, label: 'Marketplace', id: 'skills' },
    { icon: GitBranch, label: 'Git Sync', id: 'git' },
    { icon: Info, label: 'Support', id: 'info' },
  ];

  return (
    <div className="w-64 bg-[#0A0A0A] border-r border-white/5 flex flex-col h-screen overflow-hidden shrink-0">
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
            <LayoutGrid className="text-black w-5 h-5" />
          </div>
          <span className="font-black text-xl tracking-tighter text-white italic">NEXUS</span>
        </div>
        {mobileOnClose && (
          <button onClick={mobileOnClose} className="p-2 -mr-2 text-white/40 hover:text-white lg:hidden">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-4 flex flex-col gap-8 no-scrollbar">
        <section>
          <div className="px-3 mb-3 flex items-center justify-between">
            <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">Workspaces</span>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="p-1 px-2 bg-primary/10 border border-primary/20 rounded-lg transition-all text-primary hover:bg-primary/20"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-1.5 px-1">
            <div className="px-3 py-1 flex items-center justify-between mb-2">
              <span className="text-[8px] font-bold text-white/10 uppercase tracking-widest">Active</span>
            </div>
            {projects.filter(p => p.status === 'active').length === 0 ? (
              <div className="px-3 py-4 text-center rounded-xl border border-dashed border-white/5 bg-white/[0.01]">
                <p className="text-[10px] text-white/20 italic font-medium uppercase tracking-wider">No Active Workspaces</p>
              </div>
            ) : (
              projects.filter(p => p.status === 'active').map((project) => (
                <button
                  key={project.id}
                  onClick={() => {
                    setCurrentProject(project.id);
                    setActiveView('workspace');
                    mobileOnClose?.();
                  }}
                  className={cn(
                    "w-full flex flex-col items-start px-3 py-3 rounded-2xl text-xs transition-all group border relative overflow-hidden",
                    currentProjectId === project.id 
                      ? "bg-white/5 text-white border-white/10 shadow-[inset_0_0_20px_rgba(255,255,255,0.02)]" 
                      : "text-white/40 hover:bg-white/5 hover:text-white border-transparent"
                  )}
                >
                  <span className="font-bold truncate w-full flex items-center justify-between relative z-10">
                    {project.name}
                    {currentProjectId === project.id && (
                      <div className="flex items-center gap-1">
                        <div className="w-1 h-1 bg-primary rounded-full animate-pulse" />
                        <div className="w-3 h-px bg-primary/40" />
                      </div>
                    )}
                  </span>
                  <span className="text-[8px] text-white/20 mt-1 uppercase font-black tracking-[0.1em] truncate w-full relative z-10">{project.scaffoldType}</span>
                </button>
              ))
            )}

            {projects.filter(p => p.status === 'archived').length > 0 && (
              <>
                <div className="px-3 py-1 mt-6 flex items-center justify-between mb-2">
                  <span className="text-[8px] font-bold text-white/10 uppercase tracking-widest">Archived</span>
                </div>
                <div className="opacity-40 grayscale space-y-1.5">
                  {projects.filter(p => p.status === 'archived').map((project) => (
                    <button
                      key={project.id}
                      onClick={() => {
                        setCurrentProject(project.id);
                        setActiveView('settings');
                        mobileOnClose?.();
                      }}
                      className={cn(
                        "w-full flex flex-col items-start px-3 py-3 rounded-2xl text-[10px] transition-all group border relative border-transparent text-white/30 hover:bg-white/5"
                      )}
                    >
                      <span className="font-bold truncate w-full flex items-center justify-between">
                        {project.name}
                        <Archive className="w-3 h-3 text-white/20" />
                      </span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>

        <section>
          <div className="px-3 mb-3">
            <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">Navigation</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5 px-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveView(item.id as any);
                  mobileOnClose?.();
                }}
                className={cn(
                  "flex flex-col items-center justify-center gap-2 p-3 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all border",
                  activeView === item.id 
                    ? "bg-primary text-black border-primary shadow-lg shadow-primary/20" 
                    : "bg-white/[0.02] border-white/5 text-white/40 hover:bg-white/5 hover:text-white"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
          </div>
        </section>
      </div>

      <div className="p-4 border-t border-white/5 bg-[#080808]">
        <button 
          onClick={() => {
            setActiveView('settings');
            mobileOnClose?.();
          }}
          className={cn(
            "w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all border",
            activeView === 'settings' 
              ? "bg-white/5 border-white/20 text-white" 
              : "bg-white/[0.02] border-white/5 text-white/40 hover:bg-white/5 hover:text-white"
          )}
        >
          <Settings className="w-4 h-4" />
          <span className="text-[10px] font-black uppercase tracking-widest">Preferences</span>
        </button>
      </div>

      <CreateProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};
