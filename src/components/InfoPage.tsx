import React, { useState } from 'react';
import { Info, BookOpen, HelpCircle, ChevronRight, Zap, Target, Shield, Cpu, Github, Mail } from 'lucide-react';
import { cn } from '../lib/utils';

export const InfoPage = () => {
  const [activeTab, setActiveTab] = useState<'description' | 'guides' | 'faq'>('description');

  const tabs = [
    { id: 'description', label: 'About Nexus', icon: Info },
    { id: 'guides', label: 'User Guides', icon: BookOpen },
    { id: 'faq', label: 'FAQ', icon: HelpCircle },
  ];

  const faqs = [
    {
      q: "What is the Brain/Muscle split?",
      a: "Nexus separates high-level architectural decision-making (the Brain) from deterministic code execution and compilation (the Muscle). This allows for rapid iteration and high reliability."
    },
    {
      q: "How does the CCC engine work?",
      a: "Structured Context Compilation (CCC) creates a semantic dependency graph of your entire codebase, allowing the AI to understand relationships between modules rather than just reading individual files."
    },
    {
      q: "Can I use my own execution nodes?",
      a: "Yes. Nexus is designed to be node-agnostic. You can connect your own cloud providers or local Docker environments as custom 'Muscle' nodes."
    },
    {
       q: "Is my data secure?",
       a: "All code ingestion and transformation processes adhere to the Nexus Synapse Specification (NSP), ensuring your intellectual property stays within your controlled orchestration environment."
    }
  ];

  const guides = [
    {
      title: "Workspace Initialization",
      desc: "Learn how to seed projects from templates or ingest existing codebases via Synapse Git sync or ZIP ingestion.",
      icon: Zap
    },
    {
      title: "Intent Steering",
      desc: "Master the art of architectural intent. Use the Artifact Panel to approve shifts and manage complexity.",
      icon: Target
    },
    {
      title: "Skill Deployment",
      desc: "Extend your engine's capabilities. Discover, validate, and install procedural intelligence modules from the Marketplace.",
      icon: Cpu
    }
  ];

  return (
    <div className="flex-1 flex flex-col bg-[#050505] overflow-y-auto">
      {/* Header */}
      <div className="p-6 sm:p-10 border-b border-white/5 bg-gradient-to-b from-[#080808] to-[#050505]">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-primary/10 rounded-2xl text-primary shadow-lg shadow-primary/5">
            <Info className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none mb-1">Nexus Intelligence</h1>
            <p className="text-white/40 text-[10px] font-mono tracking-[0.2em] uppercase">Semantic Orchestration Protocol v2.5</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mt-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-[10px] tracking-widest uppercase transition-all border",
                activeTab === tab.id 
                  ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" 
                  : "bg-white/[0.03] text-white/40 border-white/5 hover:bg-white/5 hover:text-white"
              )}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6 sm:p-10 max-w-4xl mx-auto w-full pb-24">
        {activeTab === 'description' && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white italic capitalize">The Future of Software Design</h2>
              <p className="text-white/60 leading-relaxed text-sm sm:text-base">
                Nexus is an AI-native engineering workspace optimized for <span className="text-primary font-bold">Mobile-First Orchestration</span>. 
                It moves beyond traditional IDEs by implementing a Brain/Muscle split, where your device acts as the cognitive "Brain" 
                and remote execution nodes provide the computational "Muscle".
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                  <Cpu className="w-5 h-5 text-primary" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider italic">Autonomous Insights</h3>
                  <p className="text-white/40 text-xs leading-relaxed">Real-time architectural feedback loop that monitors system health and complexity.</p>
                </div>
                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                  <Shield className="w-5 h-5 text-primary" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider italic">NSP Protocol</h3>
                  <p className="text-white/40 text-xs leading-relaxed">Enterprise-grade security and semantic validation for every code transformation.</p>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-white/30" />
                 </div>
                 <div>
                    <p className="text-xs font-bold text-white uppercase tracking-widest">Connect with Nexus</p>
                    <p className="text-[10px] text-white/30">support@nexus-engine.xyz</p>
                 </div>
              </div>
              <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all">
                <Github className="w-4 h-4" />
                View Repository
              </button>
            </div>
          </div>
        )}

        {activeTab === 'guides' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {guides.map((guide, i) => (
              <div key={i} className="group p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-primary/30 transition-all cursor-pointer flex items-center gap-6">
                <div className="p-4 bg-primary/5 rounded-xl text-primary group-hover:scale-110 transition-transform shrink-0">
                  <guide.icon className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-white mb-1 group-hover:italic transition-all">{guide.title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed">{guide.desc}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-white/10 group-hover:text-primary transition-all shrink-0" />
              </div>
            ))}
          </div>
        )}

        {activeTab === 'faq' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {faqs.map((faq, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4 shadow-sm hover:bg-white/[0.03] transition-all">
                <div className="flex items-start gap-4">
                  <HelpCircle className="w-5 h-5 text-primary mt-1 shrink-0" />
                  <h3 className="font-bold text-white text-base sm:text-lg leading-snug">{faq.q}</h3>
                </div>
                <p className="text-white/50 text-sm sm:text-base leading-relaxed pl-9 border-l-2 border-white/5 ml-2.5">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
