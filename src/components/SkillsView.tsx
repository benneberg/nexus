import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Search, Plus, Cpu, Code, Shield, Zap, Terminal } from 'lucide-react';
import { cn } from '../lib/utils';
import { Skill } from '../types';

export const SkillsView = () => {
  const { skills, marketplaceSkills, installSkill, removeSkill } = useStore();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'installed' | 'marketplace'>('installed');

  const list = activeTab === 'installed' ? skills : marketplaceSkills;

  const filtered = list.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col bg-[#050505] p-8 overflow-y-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2 uppercase italic text-[#F27D26]">Skill System</h1>
          <p className="text-white/40 text-sm italic">Autonomous procedural intelligence modules for advanced orchestration.</p>
        </div>
        <div className="flex gap-4">
            {activeTab === 'installed' && (
              <button 
                onClick={() => alert('Nexus Skill Submission Portal: Upload your NSP-compliant skill bundle (.nsk) for semantic validation.')}
                className="flex items-center gap-2 bg-white/5 border border-white/10 px-6 py-2.5 rounded-full font-bold text-xs tracking-widest uppercase hover:bg-white/10 transition-all text-white/60"
              >
                <Plus className="w-4 h-4" />
                Submit Skill
              </button>
            )}
           <button 
             onClick={() => setActiveTab(activeTab === 'installed' ? 'marketplace' : 'installed')}
             className="flex items-center gap-2 bg-primary px-6 py-2.5 rounded-full font-bold text-xs tracking-widest uppercase hover:bg-primary/80 transition-all shadow-lg shadow-primary/20 text-white"
           >
             <Zap className="w-4 h-4" />
             {activeTab === 'installed' ? 'Browse Marketplace' : 'View Installed'}
           </button>
        </div>
      </div>

      <div className="relative mb-8 flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={activeTab === 'installed' ? "Search your skills..." : "Find intelligence in the marketplace..."}
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-12 py-4 text-sm focus:outline-none focus:border-primary/50 transition-all"
          />
        </div>
        <div className="flex bg-white/5 border border-white/10 rounded-2xl p-1 shrink-0">
          <button 
            onClick={() => setActiveTab('installed')}
            className={cn(
              "px-6 py-2 text-xs font-bold uppercase tracking-widest rounded-xl transition-all",
              activeTab === 'installed' ? "bg-white/10 text-[#F27D26]" : "text-white/20 hover:text-white/40"
            )}
          >Installed</button>
          <button 
            onClick={() => setActiveTab('marketplace')}
            className={cn(
              "px-6 py-2 text-xs font-bold uppercase tracking-widest rounded-xl transition-all",
              activeTab === 'marketplace' ? "bg-white/10 text-[#F27D26]" : "text-white/20 hover:text-white/40"
            )}
          >Marketplace</button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-3xl p-12">
           <Cpu className="w-12 h-12 text-white/5 mb-4" />
           <p className="text-white/20 font-bold uppercase tracking-widest text-sm">No neural modules found in current scope</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((skill) => (
            <SkillCard 
              key={skill.id} 
              skill={skill} 
              isInstalled={skills.some(s => s.id === skill.id)} 
              onInstall={() => installSkill(skill.id)}
              onRemove={() => removeSkill(skill.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const SkillCard = ({ skill, isInstalled, onInstall, onRemove }: { skill: Skill, isInstalled: boolean, onInstall: () => void, onRemove: () => void }) => (
  <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-6 flex flex-col hover:border-primary/20 transition-all group relative overflow-hidden">
    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
       <Cpu className="w-12 h-12 text-[#F27D26]/20" />
    </div>
    
    <div className="flex items-center gap-4 mb-4">
      <div className="p-3 bg-primary/10 rounded-xl text-primary shrink-0">
        <Terminal className="w-6 h-6" />
      </div>
      <div>
        <h3 className="font-bold text-white/90 text-sm leading-tight flex items-center gap-2">
          {skill.name}
          {!isInstalled && skill.price !== 'Free' && (
            <span className="text-[9px] bg-[#F27D26]/20 text-[#F27D26] px-1.5 py-0.5 rounded uppercase font-black">{skill.price}</span>
          )}
        </h3>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[10px] text-primary/60 font-mono tracking-tighter italic">v{skill.version}</span>
          <span className="text-[10px] text-white/20 uppercase tracking-widest font-black shrink-0">• BY {skill.author}</span>
        </div>
      </div>
    </div>

    <p className="text-xs text-white/40 mb-6 flex-1 italic leading-relaxed">{skill.description}</p>

    <div className="space-y-4">
      <div>
        <span className="text-[9px] uppercase tracking-widest text-white/20 block mb-2 font-black">Orchestration Triggers</span>
        <div className="flex flex-wrap gap-2">
          {skill.triggers.map(t => (
            <span key={t} className="px-2 py-1 bg-white/5 border border-white/5 rounded-lg text-[9px] text-white/50 font-mono">{t}</span>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t border-white/5 flex items-center justify-between">
         <div className="flex gap-3">
           <Zap className="w-3.5 h-3.5 text-yellow-500/30" />
           <Shield className="w-3.5 h-3.5 text-blue-500/30" />
           <Code className="w-3.5 h-3.5 text-green-500/30" />
         </div>
         {isInstalled ? (
           <button 
             onClick={onRemove}
             className="text-[10px] font-black uppercase tracking-widest text-red-400/60 hover:text-red-400 transition-colors"
           >Uninstall</button>
         ) : (
           <button 
             onClick={onInstall}
             className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-white transition-colors flex items-center gap-1.5"
           >
             <Plus className="w-3 h-3" />
             Install Module
           </button>
         )}
      </div>
    </div>
  </div>
);
