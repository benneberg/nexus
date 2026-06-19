import React from 'react';
import { Plus, Github, Upload, Zap, Sparkles, Layout, Code, Coffee } from 'lucide-react';
import { useStore } from '../store/useStore';
import { cn } from '../lib/utils';

export const OnboardingView = ({ onOpenCreate }: { onOpenCreate: () => void }) => {
  const { templates } = useStore();

  const quickEngines = [
    { id: 'blank', name: 'Blank Canvas', desc: 'Start with an empty workspace', icon: Plus, color: 'text-white' },
    { id: 'ai', name: 'AI Build', desc: 'Construct from an idea', icon: Sparkles, color: 'text-primary' },
    { id: 'git', name: 'Git Synapse', desc: 'Clone from a repository', icon: Github, color: 'text-blue-400' },
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-[#050505] p-6 sm:p-12 overflow-y-auto overflow-x-hidden relative">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-4xl w-full space-y-12 relative z-10">
        <div className="space-y-4 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest animate-in fade-in slide-in-from-bottom-2 duration-500">
            <Zap className="w-3 h-3" />
            Nexus Engineering Engine v2.5
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white italic tracking-tighter leading-none animate-in fade-in slide-in-from-bottom-4 duration-700">
            What are we <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#FF9D5C]">architecting</span> today?
          </h1>
          <p className="text-white/40 text-sm sm:text-lg max-w-2xl animate-in fade-in slide-in-from-bottom-6 duration-1000">
            Nexus is your AI-native workspace. Seed a new project, ingest existing code, or let the Brain scaffold your intent from scratch.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
          {quickEngines.map((engine) => (
            <button
              key={engine.id}
              onClick={onOpenCreate}
              className="group flex flex-col gap-6 p-6 rounded-3xl bg-[#0F1115]/80 backdrop-blur-xl border border-white/5 hover:border-primary/50 hover:bg-primary/5 transition-all text-left shadow-2xl"
            >
              <div className={cn("p-4 bg-white/5 rounded-2xl group-hover:scale-110 transition-transform w-fit shadow-inner", engine.color)}>
                <engine.icon className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-black text-white uppercase italic tracking-widest">{engine.name}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{engine.desc}</p>
              </div>
            </button>
          ))}
        </div>

        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
          <div className="flex items-center justify-between">
            <h2 className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] flex items-center gap-3">
              <div className="w-8 h-px bg-white/10" />
              Scaffold Blueprints
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {templates.slice(0, 4).map((t) => (
              <button
                key={t.id}
                onClick={onOpenCreate}
                className="flex items-center gap-4 p-4 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-primary/50 hover:bg-primary/5 transition-all text-left group"
              >
                <div className="p-3 bg-white/5 rounded-xl group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                  <Layout className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-[11px] text-white/80 uppercase tracking-wider">{t.name}</h3>
                  <p className="text-[9px] text-white/30 truncate max-w-[120px]">{t.category}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-8 animate-in fade-in duration-1000 delay-700">
          <div className="flex items-center gap-8">
             <div className="flex flex-col gap-1">
                <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Global Status</span>
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                   <span className="text-[10px] font-bold text-white/60">Muscle Node Connected</span>
                </div>
             </div>
             <div className="flex flex-col gap-1">
                <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">NSP Version</span>
                <span className="text-[10px] font-bold text-white/60">v2.5.42-Stable</span>
             </div>
          </div>
          
          <div className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-white/40 text-[10px] font-bold uppercase tracking-widest italic">
            <Coffee className="w-3.5 h-3.5" />
            Designed for high-intensity intent orchestration
          </div>
        </div>
      </div>
    </div>
  );
};
