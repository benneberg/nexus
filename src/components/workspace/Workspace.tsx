import React from 'react';
import { ChatPanel } from './ChatPanel';
import { ArtifactPanel } from './ArtifactPanel';
import { Cpu, Wifi, Battery, Bell, Activity, Database, Zap, GitBranch, Menu } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { SkillsView } from '../SkillsView';
import { CCCGraphEditor } from '../CCCGraphEditor';
import { CardDeck } from '../CardDeck';
import { GitPanel } from '../GitPanel';
import { ProjectSettings } from '../ProjectSettings';
import { InfoPage } from '../InfoPage';
import { OnboardingView } from '../OnboardingView';
import { CreateProjectModal } from '../CreateProjectModal';
import { useTelemetry } from '../../hooks/useTelemetry';

const ViewContainer = ({ children, onMenuClick }: { children: React.ReactNode, onMenuClick?: () => void }) => (
  <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#0a0a0a]">
    <header className="h-14 border-b border-white/5 bg-[#080808] flex items-center px-4 shrink-0 lg:hidden">
       <button 
         onClick={onMenuClick}
         className="p-2 -ml-2 text-white/40 hover:text-white active:scale-95 transition-transform"
       >
         <Menu className="w-5 h-5" />
       </button>
       <span className="ml-3 text-[10px] font-black tracking-widest text-white/20 uppercase">Navigation</span>
    </header>
    {children}
  </div>
);

export const Workspace = ({ onMenuClick }: { onMenuClick?: () => void }) => {
  const { projects, currentProjectId, activeView, telemetryStream } = useStore();
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const project = projects.find(p => p.id === currentProjectId);

  // Initialize NSP Telemetry Stream
  useTelemetry();

  if (activeView === 'skills') return <ViewContainer onMenuClick={onMenuClick}><SkillsView /></ViewContainer>;
  if (activeView === 'ccc') return <ViewContainer onMenuClick={onMenuClick}><CCCGraphEditor /></ViewContainer>;
  if (activeView === 'deck') return <ViewContainer onMenuClick={onMenuClick}><CardDeck /></ViewContainer>;
  if (activeView === 'artifacts') return <ViewContainer onMenuClick={onMenuClick}><ArtifactPanel /></ViewContainer>;
  if (activeView === 'git') return <ViewContainer onMenuClick={onMenuClick}><GitPanel /></ViewContainer>;
  if (activeView === 'settings') return <ViewContainer onMenuClick={onMenuClick}><ProjectSettings /></ViewContainer>;
  if (activeView === 'info') return <ViewContainer onMenuClick={onMenuClick}><InfoPage /></ViewContainer>;

  if (!project && activeView === 'workspace') {
    return (
      <ViewContainer onMenuClick={onMenuClick}>
        <OnboardingView onOpenCreate={() => setIsCreateModalOpen(true)} />
        <CreateProjectModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
      </ViewContainer>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#0a0a0a]">
      <header className="h-14 border-b border-white/5 bg-[#080808] flex items-center justify-between px-4 shrink-0 lg:h-12">
        <div className="flex items-center gap-3">
          <button 
            onClick={onMenuClick}
            className="p-2 -ml-2 text-white/40 hover:text-white lg:hidden active:scale-95 transition-transform"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
             <div className="w-1.5 h-1.5 rounded-full bg-[#F27D26] animate-pulse" />
             <span className="text-[9px] font-bold text-white/40 uppercase tracking-[0.2em] hidden sm:inline">Engine Active</span>
          </div>
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="text-xs font-bold text-white uppercase tracking-wider italic truncate max-w-[100px] sm:max-w-none">{project?.name || 'No Project'}</span>
            <span className="hidden sm:inline text-[8px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-white/40 font-mono italic">v2.5</span>
            {project?.gitStatus && (
              <div className="flex items-center gap-1.5 ml-2 text-white/40">
                <GitBranch className="w-3 h-3 text-green-500/50" />
                <span className="text-[9px] font-mono italic">{project.gitStatus.branch}</span>
                {project.gitStatus.isDirty && <div className="w-1 h-1 bg-yellow-500 rounded-full" />}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
           <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 group hover:border-[#F27D26]/40 transition-all cursor-crosshair">
             <Cpu className="w-3.5 h-3.5 text-[#F27D26]" />
             <span className="text-[9px] font-mono text-white/40 uppercase tracking-tighter w-8">{telemetryStream.cpu}%</span>
           </div>
           <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 group hover:border-[#F27D26]/40 transition-all cursor-crosshair">
             <Activity className="w-3.5 h-3.5 text-blue-400" />
             <span className="text-[9px] font-mono text-white/40 uppercase tracking-tighter w-8">{telemetryStream.latency}ms</span>
           </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        <div className="flex-1 lg:w-[480px] lg:border-r lg:border-white/5 shrink-0 bg-[#050505] flex flex-col h-full overflow-hidden">
          <ChatPanel />
        </div>
        <div className="hidden lg:block flex-1 overflow-hidden bg-[#080808]">
          <ArtifactPanel />
        </div>
      </main>

      <footer className="h-8 border-t border-white/5 bg-[#050505] flex items-center justify-between px-3 shrink-0 hidden lg:flex">
        <div className="flex items-center gap-6">
          <span className="text-[9px] text-white/20 font-bold uppercase tracking-widest flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F27D26] shadow-[0_0_8px_rgba(242,125,38,0.4)]" />
            NSP Stream: {telemetryStream.network}MB/s
          </span>
          <span className="text-[9px] text-white/20 font-bold uppercase tracking-widest flex items-center gap-2">
            <Database className="w-3 h-3 text-white/10" />
            MEM: {telemetryStream.memory}%
          </span>
          <span className="text-[9px] text-white/20 font-bold uppercase tracking-widest">
            Uptime: {telemetryStream.uptime}
          </span>
        </div>
        <div className="flex items-center gap-4 text-white/20">
          <span className="text-[9px] font-bold uppercase tracking-widest italic">Muscle Connection: Latency {telemetryStream.latency}ms</span>
          <Bell className="w-3 h-3 hover:text-[#F27D26] transition-colors cursor-pointer" />
        </div>
      </footer>
    </div>
  );
};
