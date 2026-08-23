import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { Search, Plus, Cpu, Code, Shield, Zap, Terminal, Sparkles, X, Check, RefreshCw, AlertCircle, Layers, Box, Tag, Download, Star, Power } from 'lucide-react';
import { cn } from '../lib/utils';
import { Skill } from '../types';

export const SkillsView = () => {
  const { 
    skills, 
    marketplaceSkills, 
    installSkill, 
    removeSkill, 
    toggleSkillActive, 
    updateSkillToLatest,
    checkSkillUpdates 
  } = useStore();

  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'installed' | 'marketplace'>('installed');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isContributing, setIsContributing] = useState(false);
  const [selectedSkillForModal, setSelectedSkillForModal] = useState<Skill | null>(null);

  const categories = ['All', 'Frontend', 'Backend', 'Git', 'Cloud', 'Design'];

  // Periodically check for skill updates on load
  useEffect(() => {
    checkSkillUpdates();
  }, [marketplaceSkills]);

  const list = activeTab === 'installed' ? skills : marketplaceSkills;

  const filtered = list.filter(s => {
    const searchStr = search.toLowerCase();
    const matchesSearch = 
      s.name.toLowerCase().includes(searchStr) || 
      s.description.toLowerCase().includes(searchStr) ||
      (s.dependencies && s.dependencies.some(d => d.toLowerCase().includes(searchStr))) ||
      s.triggers.some(t => t.toLowerCase().includes(searchStr));
    
    if (selectedCategory !== 'All') {
      if (s.category) {
        if (s.category.toLowerCase() !== selectedCategory.toLowerCase()) return false;
      } else {
        const categoryMap: Record<string, string[]> = {
          'Frontend': ['react-skill', 'tailwind-wizard'],
          'Backend': ['fastapi-node', 'db-gen'],
          'Git': ['advanced-git', 'github-integration'],
          'Cloud': ['dockerize']
        };
        if (!categoryMap[selectedCategory]?.includes(s.id)) return false;
      }
    }
    
    return matchesSearch;
  });

  const activeCount = skills.filter(s => s.enabled !== false).length;
  const updatesPendingCount = skills.filter(s => {
    const mkt = marketplaceSkills.find(m => m.id === s.id);
    return mkt && mkt.version !== s.version;
  }).length;

  return (
    <div className="flex-1 flex flex-col bg-[#050505] p-8 overflow-y-auto no-scrollbar relative">
      {/* Background Decorative Element */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-6 relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-3">
            <Zap className="w-3 h-3 animate-pulse" />
            Nexus Capability & Skill Engine v2.5
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white italic tracking-tighter leading-none mb-3">
             Skill <span className="text-primary">Management</span>
          </h1>
          <p className="text-white/40 text-sm max-w-xl italic">
            Discover, install, update, and manage autonomous intelligence skills and tools.
          </p>
        </div>
        
        <div className="flex bg-white/5 border border-white/10 rounded-2xl p-1 shrink-0">
          <button 
            onClick={() => setActiveTab('installed')}
            className={cn(
              "px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all flex items-center gap-2",
              activeTab === 'installed' ? "bg-white/10 text-white shadow-xl border border-white/10" : "text-white/30 hover:text-white/60"
            )}
          >
            <span>Installed</span>
            <span className="px-1.5 py-0.5 rounded-full bg-primary/20 text-primary text-[9px] font-mono">{skills.length}</span>
          </button>
          <button 
            onClick={() => setActiveTab('marketplace')}
            className={cn(
              "px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all flex items-center gap-2",
              activeTab === 'marketplace' ? "bg-white/10 text-white shadow-xl border border-white/10" : "text-white/30 hover:text-white/60"
            )}
          >
            <span>Marketplace</span>
            <span className="px-1.5 py-0.5 rounded-full bg-white/10 text-white/50 text-[9px] font-mono">{marketplaceSkills.length}</span>
          </button>
        </div>
      </div>

      {/* Overview Statistics Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 relative z-10">
        <StatCard label="Total Installed" value={skills.length.toString()} sub="Registered Skills" icon={Box} />
        <StatCard label="Active Status" value={`${activeCount} / ${skills.length}`} sub="Capabilities Enabled" icon={Power} color="text-green-400" />
        <StatCard label="Pending Updates" value={updatesPendingCount.toString()} sub="Upgrades Available" icon={RefreshCw} color={updatesPendingCount > 0 ? "text-yellow-400" : "text-white/40"} />
        <StatCard label="Marketplace Pool" value={marketplaceSkills.length.toString()} sub="Available Modules" icon={Sparkles} color="text-primary" />
      </div>

      {/* Categories Filter */}
      <div className="mb-6 relative z-10">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all shrink-0",
                selectedCategory === cat 
                  ? "bg-primary border-primary text-black" 
                  : "bg-white/5 border-white/10 text-white/40 hover:border-white/20 hover:text-white"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Banner (Marketplace only) */}
      {activeTab === 'marketplace' && !search && selectedCategory === 'All' && (
        <div className="mb-8 relative z-10">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary/20 via-primary/5 to-transparent border border-primary/20 p-8 group">
            <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:scale-110 transition-transform duration-1000">
              <Zap className="w-36 h-36 text-primary" />
            </div>
            <div className="max-w-xl relative z-10">
              <div className="flex items-center gap-2 text-primary text-[10px] font-black uppercase tracking-[0.3em] mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                Featured Module
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white italic tracking-tighter mb-2 uppercase">
                GitHub <span className="text-primary">Sync & Clone</span> Node
              </h2>
              <p className="text-white/60 text-xs mb-6 leading-relaxed italic">
                Direct remote repository cloning into active workspaces and automated secure Git operations.
              </p>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => installSkill('github-integration')}
                  disabled={skills.some(s => s.id === 'github-integration')}
                  className="px-6 py-3 bg-primary text-black font-black text-[10px] uppercase tracking-[0.2em] rounded-xl hover:scale-105 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
                >
                  {skills.some(s => s.id === 'github-integration') ? 'Module Installed' : 'Install Capability'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search Bar & Action Buttons */}
      <div className="relative mb-8 flex flex-col sm:flex-row gap-4 relative z-10">
        <div className="relative flex-1">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={activeTab === 'installed' ? "Search installed skills, triggers, or dependencies..." : "Search global marketplace registry..."}
            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-12 py-3.5 text-xs focus:outline-none focus:border-primary/50 transition-all font-medium text-white/80 placeholder:text-white/20"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <button 
          onClick={() => setIsContributing(true)}
          className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 px-6 py-3.5 rounded-2xl font-black text-[10px] tracking-[0.2em] uppercase hover:bg-white/10 transition-all text-white/70 hover:text-white"
        >
          <Plus className="w-3.5 h-3.5" />
          Contribute Skill
        </button>
      </div>

      {/* Skill List Grid */}
      <div className="relative z-10 mb-20">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 border border-dashed border-white/10 rounded-3xl bg-white/[0.01]">
             <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                <Cpu className="w-8 h-8 text-white/20" />
             </div>
             <p className="text-white/30 font-bold uppercase tracking-[0.2em] text-xs italic">No matching skills found</p>
             <p className="text-white/20 text-[11px] mt-1">Try clearing your search query or selecting a different category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map((skill) => {
              const installedSkill = skills.find(s => s.id === skill.id);
              const isInstalled = !!installedSkill;
              const marketplaceMatch = marketplaceSkills.find(m => m.id === skill.id);
              const updateAvailable = isInstalled && marketplaceMatch && marketplaceMatch.version !== installedSkill.version;

              return (
                <SkillCard 
                  key={skill.id} 
                  skill={installedSkill || skill} 
                  isInstalled={isInstalled}
                  updateAvailable={!!updateAvailable}
                  latestVersion={marketplaceMatch?.version}
                  onInstall={() => installSkill(skill.id)}
                  onRemove={() => removeSkill(skill.id)}
                  onToggleActive={() => toggleSkillActive(skill.id)}
                  onUpdate={() => updateSkillToLatest(skill.id)}
                  onInspect={() => setSelectedSkillForModal(installedSkill || skill)}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedSkillForModal && (
        <SkillDetailModal 
          skill={selectedSkillForModal} 
          marketplaceSkill={marketplaceSkills.find(m => m.id === selectedSkillForModal.id)}
          isInstalled={skills.some(s => s.id === selectedSkillForModal.id)}
          onClose={() => setSelectedSkillForModal(null)} 
          onInstall={() => { installSkill(selectedSkillForModal.id); setSelectedSkillForModal(null); }}
          onRemove={() => { removeSkill(selectedSkillForModal.id); setSelectedSkillForModal(null); }}
          onToggleActive={() => toggleSkillActive(selectedSkillForModal.id)}
          onUpdate={() => { updateSkillToLatest(selectedSkillForModal.id); setSelectedSkillForModal(null); }}
        />
      )}

      {/* Contribution Modal */}
      {isContributing && (
        <ContributionModal onClose={() => setIsContributing(false)} />
      )}
    </div>
  );
};

const StatCard = ({ label, value, sub, icon: Icon, color = "text-white/90" }: { label: string, value: string, sub: string, icon: any, color?: string }) => (
  <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-4 flex items-center gap-4">
    <div className="p-3 bg-white/5 rounded-xl text-primary shrink-0">
      <Icon className="w-5 h-5" />
    </div>
    <div className="overflow-hidden">
      <p className="text-[9px] uppercase tracking-widest text-white/30 font-bold">{label}</p>
      <p className={cn("text-xl font-black tracking-tight", color)}>{value}</p>
      <p className="text-[9px] text-white/20 italic truncate">{sub}</p>
    </div>
  </div>
);

const SkillCard = ({ 
  skill, 
  isInstalled, 
  updateAvailable,
  latestVersion,
  onInstall, 
  onRemove,
  onToggleActive,
  onUpdate,
  onInspect
}: { 
  skill: Skill;
  isInstalled: boolean;
  updateAvailable?: boolean;
  latestVersion?: string;
  onInstall: () => void;
  onRemove: () => void;
  onToggleActive: () => void;
  onUpdate: () => void;
  onInspect: () => void;
}) => {
  const isEnabled = skill.enabled !== false;

  return (
    <div className={cn(
      "bg-[#0A0A0A] border rounded-2xl p-6 flex flex-col transition-all group relative overflow-hidden",
      isInstalled 
        ? (isEnabled ? "border-white/10 hover:border-primary/40" : "border-white/5 opacity-70") 
        : "border-white/5 hover:border-white/20"
    )}>
      {/* Update Banner */}
      {updateAvailable && (
        <div className="bg-yellow-500/10 border-b border-yellow-500/20 text-yellow-400 px-4 py-1.5 -mx-6 -mt-6 mb-4 flex items-center justify-between text-[10px] font-bold">
          <span className="flex items-center gap-1.5">
            <AlertCircle className="w-3 h-3" />
            Update Available: v{latestVersion}
          </span>
          <button 
            onClick={(e) => { e.stopPropagation(); onUpdate(); }}
            className="px-2 py-0.5 bg-yellow-400 text-black rounded text-[9px] font-black uppercase hover:bg-yellow-300"
          >
            Update
          </button>
        </div>
      )}

      {/* Top Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className={cn(
            "p-3 rounded-xl shrink-0 transition-colors",
            isInstalled && isEnabled ? "bg-primary/10 text-primary" : "bg-white/5 text-white/40"
          )}>
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <h3 
              onClick={onInspect}
              className="font-bold text-white text-sm hover:text-primary transition-colors cursor-pointer flex items-center gap-2"
            >
              {skill.name}
            </h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] text-primary/70 font-mono italic font-bold">v{skill.version}</span>
              <span className="text-[10px] text-white/30 uppercase tracking-widest font-bold">• {skill.author}</span>
            </div>
          </div>
        </div>

        {/* Installed Toggle Switch */}
        {isInstalled && (
          <button 
            onClick={onToggleActive}
            title={isEnabled ? "Disable Skill" : "Enable Skill"}
            className={cn(
              "px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all flex items-center gap-1.5",
              isEnabled 
                ? "bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20" 
                : "bg-white/5 border-white/10 text-white/30 hover:bg-white/10"
            )}
          >
            <Power className="w-2.5 h-2.5" />
            {isEnabled ? 'Active' : 'Disabled'}
          </button>
        )}
      </div>

      {/* Category Badge */}
      {skill.category && (
        <div className="mb-3">
          <span className="px-2 py-0.5 bg-white/5 border border-white/5 text-white/50 text-[9px] font-bold rounded-md uppercase tracking-wider">
            {skill.category}
          </span>
        </div>
      )}

      {/* Description */}
      <p className="text-xs text-white/50 mb-4 flex-1 italic leading-relaxed line-clamp-2">
        {skill.description}
      </p>

      {/* Dependencies Section */}
      {skill.dependencies && skill.dependencies.length > 0 && (
        <div className="mb-4 pt-3 border-t border-white/5">
          <span className="text-[9px] uppercase tracking-widest text-white/30 block mb-1.5 font-bold">
            Dependencies ({skill.dependencies.length})
          </span>
          <div className="flex flex-wrap gap-1.5">
            {skill.dependencies.slice(0, 3).map(dep => (
              <span key={dep} className="px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded text-[9px] font-mono">
                {dep}
              </span>
            ))}
            {skill.dependencies.length > 3 && (
              <span className="px-1.5 py-0.5 bg-white/5 text-white/40 rounded text-[9px] font-mono">
                +{skill.dependencies.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Triggers */}
      <div className="space-y-3 mt-auto">
        <div>
          <span className="text-[9px] uppercase tracking-widest text-white/30 block mb-1.5 font-bold">Triggers</span>
          <div className="flex flex-wrap gap-1.5">
            {skill.triggers.slice(0, 3).map(t => (
              <span key={t} className="px-2 py-0.5 bg-white/5 border border-white/5 rounded text-[9px] text-white/60 font-mono">{t}</span>
            ))}
          </div>
        </div>

        {/* Footer Controls */}
        <div className="pt-3 border-t border-white/5 flex items-center justify-between">
           <button 
             onClick={onInspect}
             className="text-[10px] font-bold text-white/40 hover:text-white transition-colors"
           >
             View Details
           </button>

           {isInstalled ? (
             <button 
               onClick={onRemove}
               className="text-[10px] font-bold uppercase tracking-widest text-red-400/60 hover:text-red-400 transition-colors"
             >
               Uninstall
             </button>
           ) : (
             <button 
               onClick={onInstall}
               className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-white transition-colors flex items-center gap-1"
             >
               <Plus className="w-3 h-3" />
               Install
             </button>
           )}
        </div>
      </div>
    </div>
  );
};

const SkillDetailModal = ({ 
  skill, 
  marketplaceSkill,
  isInstalled, 
  onClose, 
  onInstall, 
  onRemove,
  onToggleActive,
  onUpdate
}: { 
  skill: Skill;
  marketplaceSkill?: Skill;
  isInstalled: boolean;
  onClose: () => void;
  onInstall: () => void;
  onRemove: () => void;
  onToggleActive: () => void;
  onUpdate: () => void;
}) => {
  const isEnabled = skill.enabled !== false;
  const updateAvailable = isInstalled && marketplaceSkill && marketplaceSkill.version !== skill.version;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-6">
      <div className="w-full max-w-2xl bg-[#0A0A0A] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-white/10 bg-[#0D0D0D] flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-primary/10 rounded-2xl text-primary">
              <Terminal className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-bold text-white">{skill.name}</h2>
                <span className="text-xs text-primary font-mono bg-primary/10 px-2 py-0.5 rounded font-bold">v{skill.version}</span>
              </div>
              <p className="text-xs text-white/40">By {skill.author} {skill.category ? `• ${skill.category}` : ''}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-white/40 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {updateAvailable && (
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-2xl flex items-center justify-between text-yellow-400">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span className="text-xs font-bold">A newer version (v{marketplaceSkill?.version}) is available in registry.</span>
              </div>
              <button 
                onClick={onUpdate}
                className="px-4 py-2 bg-yellow-400 text-black font-bold text-xs uppercase rounded-xl hover:bg-yellow-300 transition-colors"
              >
                Update Now
              </button>
            </div>
          )}

          <div>
            <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Description</h4>
            <p className="text-sm text-white/80 leading-relaxed italic bg-white/[0.02] p-4 border border-white/5 rounded-2xl">
              {skill.description}
            </p>
          </div>

          {/* Dependencies Breakdown */}
          <div>
            <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-2 flex items-center gap-2">
              <Box className="w-3.5 h-3.5 text-blue-400" />
              Required Dependencies ({skill.dependencies?.length || 0})
            </h4>
            {skill.dependencies && skill.dependencies.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {skill.dependencies.map(dep => (
                  <span key={dep} className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl text-xs font-mono font-bold">
                    {dep}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-white/30 italic">No external package dependencies specified for this module.</p>
            )}
          </div>

          {/* Triggers & Tools */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Triggers</h4>
              <div className="flex flex-wrap gap-1.5">
                {skill.triggers.map(t => (
                  <span key={t} className="px-2.5 py-1 bg-white/5 border border-white/5 rounded-lg text-xs text-white/70 font-mono">{t}</span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Tools Provided</h4>
              <div className="flex flex-wrap gap-1.5">
                {skill.tools.map(t => (
                  <span key={t} className="px-2.5 py-1 bg-white/5 border border-white/5 rounded-lg text-xs text-white/70 font-mono">{t}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Workflows & Prompts */}
          {skill.workflows && skill.workflows.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Automated Workflows</h4>
              <div className="flex flex-wrap gap-2">
                {skill.workflows.map(w => (
                  <span key={w} className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary rounded-xl text-xs font-mono">{w}</span>
                ))}
              </div>
            </div>
          )}

          {skill.prompts && skill.prompts.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Agent System Instructions</h4>
              <div className="space-y-2">
                {skill.prompts.map((p, i) => (
                  <pre key={i} className="p-3 bg-[#050505] border border-white/5 rounded-xl text-xs text-white/70 font-mono whitespace-pre-wrap">{p}</pre>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-6 border-t border-white/10 bg-[#0D0D0D] flex items-center justify-between">
          <div>
            {isInstalled && (
              <button 
                onClick={onToggleActive}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest border transition-all flex items-center gap-2",
                  isEnabled ? "bg-green-500/10 border-green-500/30 text-green-400" : "bg-white/5 border-white/10 text-white/40"
                )}
              >
                <Power className="w-3.5 h-3.5" />
                {isEnabled ? 'Skill Active' : 'Skill Disabled'}
              </button>
            )}
          </div>

          <div className="flex gap-3">
            <button onClick={onClose} className="px-5 py-2.5 bg-white/5 rounded-xl text-xs font-bold uppercase text-white/50 hover:text-white">Close</button>
            {isInstalled ? (
              <button onClick={onRemove} className="px-5 py-2.5 bg-red-500/20 text-red-400 rounded-xl text-xs font-bold uppercase hover:bg-red-500/30">Uninstall</button>
            ) : (
              <button onClick={onInstall} className="px-5 py-2.5 bg-primary text-black rounded-xl text-xs font-bold uppercase hover:bg-primary/80">Install Module</button>
            )}
          </div>
        </div>
      </div>
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
    category: 'Frontend',
    triggers: '',
    tools: '',
    dependencies: '',
    price: 'Free'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    contributeSkill({
      ...formData,
      triggers: formData.triggers.split(',').map(t => t.trim()).filter(Boolean),
      tools: formData.tools.split(',').map(t => t.trim()).filter(Boolean),
      dependencies: formData.dependencies.split(',').map(d => d.trim()).filter(Boolean),
      retrievalRules: [],
      workflows: [],
      validations: [],
      prompts: []
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-6">
      <div className="w-full max-w-lg bg-[#0A0A0A] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
         <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white uppercase italic">
                Contribute Skill <span className="text-primary italic">Module</span>
              </h2>
              <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold">Register capability with Nexus Ecosystem</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-white/40">
              <X className="w-5 h-5" />
            </button>
         </div>

         <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1 block">Skill Name</label>
              <input 
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-primary font-bold"
                placeholder="e.g. GraphQL Query Engine"
              />
            </div>
            <div>
              <label className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1 block">Category</label>
              <select 
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-primary font-bold"
              >
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="Git">Git</option>
                <option value="Cloud">Cloud</option>
                <option value="Design">Design</option>
              </select>
            </div>
            <div>
              <label className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1 block">Description</label>
              <textarea 
                required
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-primary font-medium resize-none"
                rows={3}
                placeholder="Describe skill capabilities and intent..."
              />
            </div>
            <div>
              <label className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1 block">Dependencies (comma separated npm packages)</label>
              <input 
                value={formData.dependencies}
                onChange={e => setFormData({ ...formData, dependencies: e.target.value })}
                className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-primary"
                placeholder="graphql, @apollo/client"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1 block">Triggers (comma separated)</label>
                <input 
                  value={formData.triggers}
                  onChange={e => setFormData({ ...formData, triggers: e.target.value })}
                  className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-primary"
                  placeholder="graphql, query, fetch"
                />
              </div>
              <div>
                <label className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1 block">Tools Provided</label>
                <input 
                  value={formData.tools}
                  onChange={e => setFormData({ ...formData, tools: e.target.value })}
                  className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-primary"
                  placeholder="GraphQLClient"
                />
              </div>
            </div>

            <div className="pt-4 flex gap-3">
               <button type="button" onClick={onClose} className="flex-1 py-3 border border-white/10 rounded-xl font-bold text-xs uppercase text-white/40 hover:text-white">Cancel</button>
               <button type="submit" className="flex-1 py-3 bg-primary text-black font-bold text-xs uppercase rounded-xl hover:bg-primary/80">Submit to Registry</button>
            </div>
         </form>
      </div>
    </div>
  );
};
