import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Search, Plus, Cpu, Code, Shield, Zap, Terminal, Sparkles, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { Skill } from '../types';

export const SkillsView = () => {
  const { skills, marketplaceSkills, installSkill, removeSkill } = useStore();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'installed' | 'marketplace'>('installed');

  const list = activeTab === 'installed' ? skills : marketplaceSkills;
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Frontend', 'Backend', 'Git', 'Cloud', 'Design'];

  const filtered = list.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || 
      s.description.toLowerCase().includes(search.toLowerCase());
    
    if (activeTab === 'marketplace' && selectedCategory !== 'All') {
      const categoryMap: Record<string, string[]> = {
        'Frontend': ['react-skill', 'tailwind-wizard'],
        'Backend': ['fastapi-node', 'db-gen'],
        'Git': ['advanced-git'],
        'Cloud': ['dockerize']
      };
      // Simple heuristic for demo
      return matchesSearch && (categoryMap[selectedCategory]?.includes(s.id));
    }
    
    return matchesSearch;
  });

  const [isContributing, setIsContributing] = useState(false);

  return (
    <div className="flex-1 flex flex-col bg-[#050505] p-8 overflow-y-auto no-scrollbar relative">
      {/* Background Decorative Element */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-6 relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 px-2 py-1 rounded bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-4">
            <Zap className="w-3 h-3" />
            Active Intelligence Registry v2.5
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white italic tracking-tighter leading-none mb-3">
             Skill <span className="text-primary">Marketplace</span>
          </h1>
          <p className="text-white/40 text-sm max-w-xl italic">
            Distill specialized engineering capabilities into your workspace. Browse neural modules or contribute your own architectural patterns.
          </p>
        </div>
        
        <div className="flex bg-white/5 border border-white/10 rounded-2xl p-1 shrink-0">
          <button 
            onClick={() => setActiveTab('installed')}
            className={cn(
              "px-8 py-3 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all",
              activeTab === 'installed' ? "bg-white/10 text-white shadow-xl" : "text-white/20 hover:text-white/40"
            )}
          >Installed</button>
          <button 
            onClick={() => setActiveTab('marketplace')}
            className={cn(
              "px-8 py-3 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all",
              activeTab === 'marketplace' ? "bg-white/10 text-white shadow-xl" : "text-white/20 hover:text-white/40"
            )}
          >Marketplace</button>
        </div>
      </div>

      {activeTab === 'marketplace' && (
        <div className="mb-12 relative z-10">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all shrink-0",
                  selectedCategory === cat 
                    ? "bg-primary border-primary text-black" 
                    : "bg-white/5 border-white/10 text-white/40 hover:border-white/20"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'marketplace' && !search && selectedCategory === 'All' && (
        <div className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700 relative z-10">
          <div className="relative rounded-[2rem] overflow-hidden bg-gradient-to-br from-primary/20 via-primary/5 to-transparent border border-primary/20 p-8 sm:p-12 mb-8 group">
            <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:scale-110 transition-transform duration-1000">
              <Zap className="w-48 h-48 text-primary" />
            </div>
            <div className="max-w-xl relative z-10">
              <div className="flex items-center gap-3 text-primary text-[11px] font-black uppercase tracking-[0.3em] mb-4">
                <Sparkles className="w-4 h-4" />
                Featured Module
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white italic tracking-tighter mb-4 uppercase">
                Nexus <span className="text-primary">Cloud Deploy</span> Node
              </h2>
              <p className="text-white/60 text-sm mb-8 leading-relaxed italic">
                One-click orchestration for multi-cloud deployments. Automated Kubernetes scaffolding, ingress rules, and SSL provisioning optimized for mobile-first intent.
              </p>
              <button className="px-8 py-4 bg-primary text-black font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:scale-105 transition-all shadow-xl shadow-primary/20">
                Unlock Intelligence
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="relative mb-8 flex flex-col sm:flex-row gap-4 relative z-10">
        <div className="relative flex-1">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={activeTab === 'installed' ? "Filter your neural modules..." : "Search the global intelligence registry..."}
            className="w-full bg-white/[0.03] border border-white/5 rounded-3xl px-14 py-5 text-sm focus:outline-none focus:border-primary/50 transition-all font-medium text-white/80"
          />
        </div>
        <button 
          onClick={() => setIsContributing(true)}
          className="flex items-center justify-center gap-3 bg-white/5 border border-white/5 px-8 py-5 rounded-3xl font-black text-[10px] tracking-[0.2em] uppercase hover:bg-white/10 transition-all text-white/60"
        >
          <Plus className="w-4 h-4" />
          Contribute Skill
        </button>
      </div>

      <div className="relative z-10 mb-20">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-white/5 rounded-[3rem] bg-white/[0.01]">
             <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                <Cpu className="w-8 h-8 text-white/10" />
             </div>
             <p className="text-white/20 font-black uppercase tracking-[0.3em] text-[10px] italic">No compatible modules in current registry</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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

      {isContributing && (
        <ContributionModal onClose={() => setIsContributing(false)} />
      )}
    </div>
  );
};

const ContributionModal = ({ onClose }: { onClose: () => void }) => {
  const { contributeSkill } = useStore();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    version: '1.0.0',
    author: 'Agent Smith',
    triggers: '',
    tools: '',
    price: 'Free'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    contributeSkill({
      ...formData,
      triggers: formData.triggers.split(',').map(t => t.trim()),
      tools: formData.tools.split(',').map(t => t.trim()),
      retrievalRules: [],
      workflows: [],
      validations: [],
      prompts: []
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-6">
      <div className="w-full max-w-lg bg-[#0A0A0A] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-300">
         <div className="p-8 border-b border-white/5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-white italic tracking-tighter uppercase leading-none mb-1">
                Registry <span className="text-primary italic">Submission</span>
              </h2>
              <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold">NSP-Compliant Protocol v2.5</p>
            </div>
            <button onClick={onClose} className="p-3 hover:bg-white/5 rounded-full transition-colors text-white/40">
              <X className="w-5 h-5" />
            </button>
         </div>

         <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="space-y-4">
               <div>
                  <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] mb-2 block">Identity Name</label>
                  <input 
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#050505] border border-white/5 rounded-2xl px-5 py-4 text-sm text-white/80 focus:outline-none focus:border-primary transition-all font-bold placeholder:text-white/10"
                    placeholder="e.g. Postgres Architect"
                  />
               </div>
               <div>
                  <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] mb-2 block">Functional Intent (Description)</label>
                  <textarea 
                    required
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-[#050505] border border-white/5 rounded-2xl px-5 py-4 text-sm text-white/80 focus:outline-none focus:border-primary transition-all font-medium placeholder:text-white/10 resize-none"
                    rows={3}
                    placeholder="Describe the architectural capabilities..."
                  />
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] mb-2 block">Neural Triggers</label>
                    <input 
                      value={formData.triggers}
                      onChange={e => setFormData({ ...formData, triggers: e.target.value })}
                      className="w-full bg-[#050505] border border-white/5 rounded-xl px-4 py-3 text-xs text-white/60 focus:outline-none focus:border-primary transition-all"
                      placeholder="db, sql, postgres"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] mb-2 block">Tool Access</label>
                    <input 
                      value={formData.tools}
                      onChange={e => setFormData({ ...formData, tools: e.target.value })}
                      className="w-full bg-[#050505] border border-white/5 rounded-xl px-4 py-3 text-xs text-white/60 focus:outline-none focus:border-primary transition-all"
                      placeholder="SQLClient, FS"
                    />
                  </div>
               </div>
            </div>

            <div className="pt-4 flex gap-4">
               <button type="button" onClick={onClose} className="flex-1 py-5 border border-white/5 rounded-3xl font-black text-[10px] uppercase tracking-[0.2em] text-white/20 hover:text-white/40 transition-all">Cancel</button>
               <button type="submit" className="flex-1 py-5 bg-primary text-black font-black text-[10px] uppercase tracking-[0.2em] rounded-3xl hover:scale-105 transition-all shadow-xl shadow-primary/20">Distill to Registry</button>
            </div>
         </form>
      </div>
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
