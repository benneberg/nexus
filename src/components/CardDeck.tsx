import React from 'react';
import { useStore } from '../store/useStore';
import { PCard as PCardType } from '../types';
import { cn } from '../lib/utils';
import { Zap, Activity, Shield, AlertTriangle, ChevronRight, Cpu } from 'lucide-react';
import { motion } from 'motion/react';

export const CardDeck = () => {
  const { pCards, currentProjectId } = useStore();
  const cards = currentProjectId ? pCards[currentProjectId] || [] : [];

  return (
    <div className="flex-1 overflow-y-auto bg-[#050505] p-6 lg:p-8">
      <header className="mb-8 lg:mb-12">
        <h1 className="text-3xl lg:text-4xl font-bold italic tracking-tight text-white mb-2 font-serif uppercase">
          Nexus Deck
        </h1>
        <p className="text-white/30 text-[10px] tracking-[0.2em] uppercase">
          Autonomous Orchestration • intentidy v1.0
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 pb-20">
        {cards.map((card, idx) => (
          <PCard key={card.pcard_id} card={card} index={idx} />
        ))}
      </div>
    </div>
  );
};

const PCard = ({ card, index }: { card: PCardType, index: number }) => {
  const isDraft = card.type === 'PROJECT_DRAFT';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={cn(
        "bg-[#0A0A0A] border rounded-3xl p-6 flex flex-col gap-6 group transition-all relative overflow-hidden",
        isDraft ? "border-blue-500/30 bg-blue-500/[0.02]" : "border-white/5 hover:border-[#F27D26]/30"
      )}
    >
      {/* Identity */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className={cn(
            "text-xl font-bold transition-colors",
            isDraft ? "text-blue-400" : "text-white group-hover:text-[#F27D26]"
          )}>
            {card.identity.name}
          </h3>
          <p className="text-xs text-white/40 tracking-tight uppercase mt-1">
            {card.identity.tagline}
          </p>
        </div>
        <div className={cn(
          "w-3 h-3 rounded-full",
          card.runtime.build_status === 'SUCCESS' ? "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" : 
          card.runtime.build_status === 'PENDING' ? "bg-blue-400 animate-pulse shadow-[0_0_10px_rgba(96,165,250,0.5)]" : "bg-red-500"
        )}></div>
      </div>

      {/* Creation Status for Drafts */}
      {isDraft && card.creation_status && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-widest text-blue-400">
            <span>{card.creation_status.phase}</span>
            <span>{card.creation_status.progress}%</span>
          </div>
          <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
             <motion.div 
               initial={{ width: 0 }}
               animate={{ width: `${card.creation_status.progress}%` }}
               className="bg-blue-400 h-full"
             />
          </div>
          <p className="text-[9px] text-white/30 italic">Target: {card.creation_status.current_action}</p>
        </div>
      )}

      {/* Proposed Architecture for Drafts */}
      {isDraft && card.proposed_architecture && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
             <Cpu className="w-3 h-3 text-blue-400" />
             <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400">Proposed Stack</span>
          </div>
          <div className="space-y-1.5">
            {card.proposed_architecture.map(item => (
              <div key={item} className="flex items-center gap-2 text-[11px] text-white/60">
                <div className="w-1 h-1 bg-blue-400 rounded-full" />
                {item}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Telemetry Gauges (Hidden for Drafts if pending) */}
      {!isDraft && (
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 rounded-2xl p-3 flex flex-col items-center justify-center border border-white/5">
            <Activity className="w-4 h-4 text-white/20 mb-1" />
            <span className="text-lg font-mono font-bold text-white">
              {card.runtime.telemetry.latency}ms
            </span>
            <span className="text-[9px] uppercase tracking-tighter text-white/20">Latency</span>
          </div>
          <div className="bg-white/5 rounded-2xl p-3 flex flex-col items-center justify-center border border-white/5">
            <Shield className="w-4 h-4 text-white/20 mb-1" />
            <span className="text-lg font-mono font-bold text-white">
              {card.runtime.telemetry.errors === 0 ? 'HEALTHY' : `${card.runtime.telemetry.errors} ERR`}
            </span>
            <span className="text-[9px] uppercase tracking-tighter text-white/20">Status</span>
          </div>
        </div>
      )}

      {/* Intent Layer */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
           <Zap className={cn("w-3 h-3", isDraft ? "text-blue-400" : "text-[#F27D26]")} />
           <span className={cn("text-[10px] font-bold uppercase tracking-widest", isDraft ? "text-blue-400" : "text-[#F27D26]")}>
             {isDraft ? 'Seed Intents' : 'Active Intent'}
           </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {card.intent_layer.active_goals.map(goal => (
            <span key={goal} className={cn(
              "px-2.5 py-1 border rounded-full text-[10px]",
              isDraft ? "bg-blue-400/10 border-blue-400/20 text-white/80" : "bg-[#F27D26]/10 border-[#F27D26]/20 text-white/80"
            )}>
              {goal}
            </span>
          ))}
          {card.intent_layer.blockers.map(blocker => (
            <span key={blocker} className="px-2.5 py-1 bg-red-500/10 border border-red-500/20 rounded-full text-[10px] text-red-400">
              {blocker}
            </span>
          ))}
        </div>
      </div>

      {/* Autonomous Insights */}
      {!isDraft && card.autonomous_insights.length > 0 && (
        <div className="mt-2 p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl">
          <div className="flex items-center gap-2 mb-2">
            <Cpu className="w-3 h-3 text-blue-400" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400">Autonomous Insight</span>
          </div>
          <p className="text-[11px] text-white/60 italic leading-snug">
            "{card.autonomous_insights[0].observation}"
          </p>
          <div className="mt-3 flex justify-end">
            <button className="text-[10px] font-bold uppercase tracking-widest text-blue-400 flex items-center gap-1 hover:text-white transition-colors">
              Deploy Fix <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* Quick Actions for Drafts */}
      {isDraft && card.quick_actions && (
        <div className="mt-auto grid grid-cols-2 gap-2">
          {card.quick_actions.map(action => (
            <button key={action} className="px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-[9px] font-bold uppercase tracking-widest text-white/40 hover:text-white hover:bg-white/10 transition-all">
              {action}
            </button>
          ))}
        </div>
      )}

      {/* Steering Trigger */}
      <div className={cn(
        "pt-4 flex items-center justify-between",
        !isDraft && "mt-auto border-t border-white/5"
      )}>
        <span className="text-[9px] font-mono text-white/20 uppercase">#{card.pcard_id}</span>
        <button className={cn(
          "px-4 py-1.5 font-bold text-[10px] uppercase tracking-widest rounded-full transition-all",
          isDraft ? "bg-blue-400 text-black hover:bg-white" : "bg-white text-black hover:bg-[#F27D26]"
        )}>
          {isDraft ? 'Scaffold' : 'Steer Card'}
        </button>
      </div>
    </motion.div>
  );
};
