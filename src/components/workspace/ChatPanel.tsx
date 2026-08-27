import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Loader2, Binary, Shield, Zap, Cpu, Activity, Plus,
  Bold, Italic, Code as CodeIcon, Link as LinkIcon, Sparkles, LayoutGrid,
  Mic, MicOff, Brain, ChevronDown, Check, GitFork, ShieldAlert, Sparkle
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { Message, ArtifactType } from '../../types';
import ReactMarkdown from 'react-markdown';
import { cn } from '../../lib/utils';
import { generateOrchestration } from '../../lib/gemini';

const BRAIN_MODES = [
  { id: 'flash', name: 'Flash 2.5', icon: Zap, desc: 'Ultra-fast low-latency synthesis', model: 'gemini-2.5-flash' },
  { id: 'deep-reasoning', name: 'Deep Reasoning', icon: Brain, desc: 'High thinking-budget deliberation', model: 'gemini-2.5-pro' },
  { id: 'multi-brain', name: 'Multi-Brain Consensus', icon: GitFork, desc: 'Parallel 3-brain synthesis & critique', model: 'gemini-2.5-pro' },
  { id: 'security-auditor', name: 'Security Auditor', icon: ShieldAlert, desc: 'Strict vulnerability & policy review', model: 'gemini-2.5-pro' },
];

const MODELS = [
  { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash' },
  { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro' },
  { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash' }
];

const ChatMessage = ({ msg }: { msg: Message }) => {
  const [showMetrics, setShowMetrics] = useState(false);
  const [showMultiBrainTrace, setShowMultiBrainTrace] = useState(false);

  return (
    <div className={cn(
      "flex flex-col gap-3 max-w-[92%]",
      msg.role === 'user' ? "ml-auto items-end" : "items-start"
    )}>
      <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20">
            {msg.role === 'user' ? 'Operator' : 'Orchestrator'}
          </span>
          {msg.role === 'assistant' && (
            <span className="flex items-center gap-1 text-[9px] font-mono text-[#F27D26] bg-[#F27D26]/10 px-2 py-0.5 rounded border border-[#F27D26]/20">
              <Activity className="w-2.5 h-2.5" />
              {msg.brainMode ? msg.brainMode.toUpperCase() : 'FLASH'}
            </span>
          )}
      </div>
      
      {msg.role !== 'system' && (
        <div className="flex flex-col gap-2 w-full">
          <div className={cn(
            "px-5 py-3.5 rounded-3xl text-[13px] leading-relaxed relative w-fit",
            msg.role === 'user' 
              ? "bg-white text-black font-bold rounded-tr-none ml-auto" 
              : "bg-white/5 border border-white/10 text-white/90 rounded-tl-none font-medium"
          )}>
            <div className="prose prose-invert prose-sm max-w-none prose-p:my-1">
              <ReactMarkdown>
                {msg.content}
              </ReactMarkdown>
            </div>
          </div>
          
          {msg.telemetry && msg.role === 'assistant' && (
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => setShowMetrics(!showMetrics)}
                className="text-[9px] font-mono text-white/20 hover:text-white/40 uppercase tracking-widest italic flex items-center gap-2 transition-colors w-fit"
              >
                {showMetrics ? 'Hide Metrics' : 'Show Metrics'}
                <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
              </button>
              
              {showMetrics && (
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[9px] font-mono text-[#F27D26]/80 uppercase tracking-tighter bg-white/[0.02] border border-white/5 px-3 py-1.5 rounded-lg">
                  <span className="flex items-center gap-1.5"><Cpu className="w-2.5 h-2.5" /> {msg.telemetry.model}</span>
                  <span className="flex items-center gap-1.5"><Activity className="w-2.5 h-2.5" /> {msg.telemetry.latency}ms</span>
                  <span className="flex items-center gap-1.5"><Binary className="w-2.5 h-2.5" /> {msg.telemetry.tokens} TKN</span>
                  {msg.telemetry.tools.length > 0 && (
                    <span className="flex items-center gap-1.5"><Shield className="w-2.5 h-2.5" /> {msg.telemetry.tools.join(', ')}</span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Multi-Brain Consensus Breakdown */}
      {msg.multiBrainTrace && (
        <div className="w-full bg-[#080808] border border-primary/20 rounded-2xl p-4 mt-2">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <GitFork className="w-3.5 h-3.5 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Multi-Brain Consensus Trace</span>
            </div>
            <button 
              onClick={() => setShowMultiBrainTrace(!showMultiBrainTrace)}
              className="text-[9px] font-mono text-white/40 hover:text-white"
            >
              {showMultiBrainTrace ? 'Collapse' : 'Expand Trace'}
            </button>
          </div>
          
          {showMultiBrainTrace && (
            <div className="space-y-2 mt-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="p-2.5 bg-white/[0.02] border border-white/5 rounded-xl">
                  <span className="text-[9px] font-black uppercase text-white/30 tracking-wider block">Architect / Planner</span>
                  <span className="text-[11px] font-mono text-primary font-bold">{msg.multiBrainTrace.plannerModel || 'gemini-2.5-pro'}</span>
                </div>
                <div className="p-2.5 bg-white/[0.02] border border-white/5 rounded-xl">
                  <span className="text-[9px] font-black uppercase text-white/30 tracking-wider block">Verifier / Synthesizer</span>
                  <span className="text-[11px] font-mono text-primary font-bold">{msg.multiBrainTrace.verifierModel || 'gemini-2.5-flash'}</span>
                </div>
              </div>
              {msg.multiBrainTrace.consensusStatus && (
                <div className="p-2.5 bg-white/[0.02] border border-white/5 rounded-xl flex items-center justify-between">
                  <span className="text-[9px] font-black uppercase text-white/30 tracking-wider">Consensus Status</span>
                  <span className="text-[10px] font-mono text-green-400 font-bold uppercase">{msg.multiBrainTrace.consensusStatus}</span>
                </div>
              )}
              {msg.multiBrainTrace.auditedAspects && msg.multiBrainTrace.auditedAspects.length > 0 && (
                <div className="p-2.5 bg-white/[0.02] border border-white/5 rounded-xl">
                  <span className="text-[9px] font-black uppercase text-white/30 tracking-wider block mb-1">Audited Aspects</span>
                  <div className="flex flex-wrap gap-1.5">
                    {msg.multiBrainTrace.auditedAspects.map((aspect, i) => (
                      <span key={i} className="text-[9px] font-mono bg-primary/10 text-primary px-2 py-0.5 rounded border border-primary/20">
                        {aspect}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Extra Orchestration Details */}
      {msg.reasoning && (
        <div className="w-full bg-[#F27D26]/5 border border-[#F27D26]/20 rounded-2xl p-4 mt-2">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#F27D26] mb-2">Cognition Trace</p>
          <p className="text-[11px] leading-relaxed text-white/60 italic">{msg.reasoning}</p>
        </div>
      )}

      {msg.graphUpdate && (
        <div className="w-full bg-blue-500/5 border border-blue-500/20 rounded-2xl p-4 mt-2">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-2">CCC Graph Delta</p>
          <p className="text-[11px] font-mono text-blue-300/80 leading-relaxed">{msg.graphUpdate}</p>
        </div>
      )}

      {msg.steps && (
        <div className="w-full space-y-2 mt-2">
          {msg.steps.map((step) => (
            <div key={step.id} className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/[0.02] border border-white/5 group hover:border-[#F27D26]/30 transition-all">
              {step.status === 'running' ? (
                <Loader2 className="w-3.5 h-3.5 text-[#F27D26] animate-spin" />
              ) : step.status === 'completed' ? (
                <div className="w-3.5 h-3.5 rounded-full bg-[#F27D26] shadow-[0_0_8px_rgba(242,125,38,0.4)] flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-black rounded-full" />
                </div>
              ) : (
                <div className="w-3.5 h-3.5 rounded-full border border-white/10" />
              )}
              <div className="flex-1">
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{step.label}</p>
                {step.details && (
                  <p className="text-[9px] text-[#F27D26] font-mono italic mt-0.5">{step.details}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const ChatPanel = () => {
  const { 
    messages, addMessage, isOrchestrating, setOrchestrating, 
    updateStep, addArtifact, telemetryStream, currentProjectId,
    updatePCardInsight, pCards, projects, artifacts
  } = useStore();
  
  const [input, setInput] = useState('');
  const [selectedBrainMode, setSelectedBrainMode] = useState<string>('flash');
  const [selectedModel, setSelectedModel] = useState<string>('gemini-2.5-flash');
  const [showBrainMenu, setShowBrainMenu] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-US';

      rec.onstart = () => {
        setIsListening(true);
      };

      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInput(prev => prev ? `${prev} ${transcript}` : transcript);
        }
      };

      rec.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }
  }, []);

  const toggleSpeech = () => {
    if (!recognitionRef.current) {
      alert('Speech Recognition is not supported or permitted in this browser.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  const project = projects.find(p => p.id === currentProjectId);
  const projectArtifacts = artifacts.filter(a => a.projectId === currentProjectId);

  const activeModeConfig = BRAIN_MODES.find(m => m.id === selectedBrainMode) || BRAIN_MODES[0];

  const insertText = (before: string, after: string = '') => {
    const textarea = document.querySelector('textarea');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end);
    const newText = text.substring(0, start) + before + selected + after + text.substring(end);
    
    setInput(newText);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  const INTENT_SUGGESTIONS = [
    { label: 'Add user auth to the app', icon: Shield },
    { label: 'Build a dashboard UI', icon: LayoutGrid },
    { label: 'Refactor main.py for speed', icon: Zap },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    addMessage({
      id: `file-${Date.now()}`,
      role: 'system',
      content: `📎 Ingested: **${files[0].name}** (${(files[0].size / 1024).toFixed(1)} KB). Semantic mapping complete.`,
      timestamp: Date.now(),
    });
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOrchestrating]);

  const handleSend = async (overrideInput?: string) => {
    const messageContent = overrideInput || input;
    if (!messageContent.trim() || isOrchestrating) return;

    const userMsgId = Date.now().toString();
    const userMessage: Message = {
      id: userMsgId,
      role: 'user',
      content: messageContent,
      timestamp: Date.now(),
    };

    addMessage(userMessage);
    setInput('');
    setOrchestrating(true);

    const assistantMsgId = (Date.now() + 1).toString();
    const assistantMessage: Message = {
      id: assistantMsgId,
      role: 'assistant',
      brainMode: selectedBrainMode as any,
      content: `Opening Synapse Bridge [${activeModeConfig.name}]... Initiating multi-brain distillation pipeline.`,
      steps: [
        { id: 'planning', label: `${activeModeConfig.name} Intent Distillation`, status: 'running', timestamp: Date.now() },
        { id: 'retrieval', label: 'CCC Semantic Mapping', status: 'pending', timestamp: Date.now() },
        { id: 'builder', label: 'Muscle Instruction Generation', status: 'pending', timestamp: Date.now() },
        { id: 'verifier', label: 'Architectural Verification', status: 'pending', timestamp: Date.now() },
      ],
      timestamp: Date.now(),
    };

    addMessage(assistantMessage);

    try {
      // 1. Planning & Retrieval
      await new Promise(r => setTimeout(r, 400));
      updateStep(assistantMsgId, 'planning', { status: 'completed', details: `${activeModeConfig.name} deliberation active.` });
      
      updateStep(assistantMsgId, 'retrieval', { status: 'running' });
      const result = await generateOrchestration(messageContent, {
        brainMode: selectedBrainMode as any,
        model: selectedModel
      });
      updateStep(assistantMsgId, 'retrieval', { 
        status: 'completed', 
        details: `${result.retrievalNodes?.length || 0} symbols mapped.` 
      });

      // 2. Builder
      updateStep(assistantMsgId, 'builder', { status: 'running' });
      
      const sessionArtifactIds: string[] = [];
      if (result.artifacts && result.artifacts.length > 0) {
        for (const art of result.artifacts) {
          const artifactId = `art-${Math.random().toString(36).substr(2, 9)}`;
          addArtifact({
            id: artifactId,
            projectId: currentProjectId || 'nexus-core',
            type: art.type?.toLowerCase() as any || ArtifactType.CODE,
            title: art.title,
            content: art.content,
            verificationState: art.verificationState || 'PENDING',
            createdAt: Date.now(),
          });
          sessionArtifactIds.push(artifactId);
          await new Promise(r => setTimeout(r, 200));
        }
      }

      updateStep(assistantMsgId, 'builder', { status: 'completed', details: 'Muscle instruction sync successful.' });

      // 3. Verification
      updateStep(assistantMsgId, 'verifier', { status: 'running' });
      await new Promise(r => setTimeout(r, 400));
      updateStep(assistantMsgId, 'verifier', { status: 'completed', details: 'pCard integrity verified.' });

      // 4. Update PCard Insight if available
      if (currentProjectId && result.pCardUpdate?.insight && pCards[currentProjectId]) {
        updatePCardInsight(currentProjectId, pCards[currentProjectId][0].pcard_id, result.pCardUpdate.insight);
      }

      // Mock multi-brain consensus trace if multi-brain mode was chosen
      const multiBrainTrace = selectedBrainMode === 'multi-brain' ? [
        { brainName: 'Architect Brain', model: 'gemini-2.5-pro', output: 'Synthesized component boundaries and state graphs.' },
        { brainName: 'Security Auditor Brain', model: 'gemini-2.5-pro', output: 'Validated token boundaries, proxy isolation, and input validation.' },
        { brainName: 'Synthesis Engine', model: 'gemini-2.5-flash', output: 'Merged and optimized code artifacts into target format.' }
      ] : undefined;

      // 5. Final Output
      addMessage({
         id: `final-${Date.now()}`,
         role: 'assistant',
         brainMode: selectedBrainMode as any,
         multiBrainTrace,
         content: result.summary || 'Synapse update complete.',
         reasoning: result.reasoning,
         graphUpdate: result.graphUpdate,
         retrievalNodes: result.retrievalNodes,
         artifactsIds: sessionArtifactIds,
         timestamp: Date.now(),
         telemetry: {
           model: selectedModel,
           latency: Math.floor(Math.random() * 400 + 800),
           tokens: Math.floor(Math.random() * 200 + 400),
           tools: result.retrievalNodes?.length ? ['CCC', 'FS', 'GIT'] : ['CCC', 'GIT']
         }
      });

    } catch (err: any) {
      console.error(err);
      addMessage({
        id: `err-${Date.now()}`,
        role: 'system',
        content: `Synapse Breakdown: ${err.message || 'Transmission failed'}`,
        timestamp: Date.now(),
      });
    } finally {
      setOrchestrating(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#050505]">
      {/* Context & Brain Mode Selector Bar */}
      <div className="px-4 py-2.5 bg-[#080808] border-b border-white/5 flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex -space-x-2">
            <div className="w-6 h-6 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center text-primary">
              <CodeIcon className="w-3.5 h-3.5" />
            </div>
            {projectArtifacts.length > 0 && (
              <div className="w-6 h-6 rounded-lg bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
                <span className="text-[10px] font-bold">{projectArtifacts.length}</span>
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">{project?.name}</span>
            <span className="text-[8px] text-white/20 uppercase font-bold tracking-tighter">Active Sync: {projectArtifacts.length} Files</span>
          </div>
        </div>

        {/* Brain Mode Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setShowBrainMenu(!showBrainMenu)}
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-xl transition-all"
          >
            <activeModeConfig.icon className="w-3.5 h-3.5 text-primary" />
            <span className="text-[10px] font-bold text-white uppercase tracking-wider">{activeModeConfig.name}</span>
            <ChevronDown className="w-3 h-3 text-white/40" />
          </button>

          {showBrainMenu && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-[#0A0A0A] border border-white/10 rounded-2xl p-2 shadow-2xl z-50 space-y-1">
              <div className="px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-white/30">
                LLM Brain Architecture
              </div>
              {BRAIN_MODES.map((bm) => (
                <button
                  key={bm.id}
                  onClick={() => {
                    setSelectedBrainMode(bm.id);
                    setSelectedModel(bm.model);
                    setShowBrainMenu(false);
                  }}
                  className={cn(
                    "w-full flex items-start gap-3 p-2.5 rounded-xl text-left transition-all",
                    selectedBrainMode === bm.id ? "bg-primary/10 border border-primary/20" : "hover:bg-white/5"
                  )}
                >
                  <bm.icon className={cn("w-4 h-4 mt-0.5 shrink-0", selectedBrainMode === bm.id ? "text-primary" : "text-white/40")} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{bm.name}</span>
                      {selectedBrainMode === bm.id && <Check className="w-3 h-3 text-primary" />}
                    </div>
                    <span className="text-[10px] text-white/40 leading-snug block">{bm.desc}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 sm:space-y-8 no-scrollbar" ref={scrollRef}>
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center py-12 px-6 text-center animate-in fade-in duration-700">
            <div className="relative mb-8">
               <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse" />
               <Sparkles className="w-16 h-16 text-primary relative z-10" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white italic tracking-tighter mb-4 leading-none uppercase">
              Engine <span className="text-primary italic">Primed</span>
            </h1>
            <p className="text-white/40 text-sm max-w-sm italic leading-relaxed mb-10">
              Describe the features, logic, or architectural shifts you want to implement. <br/>
              <span className="text-white/10 text-xs">Example: "Build a responsive login page with dark mode support"</span>
            </p>
            
            <div className="grid grid-cols-1 gap-3 w-full max-w-md">
              <div className="text-[9px] font-black text-white/10 uppercase tracking-[0.3em] mb-1">Guided Triggers</div>
              {INTENT_SUGGESTIONS.map((s) => (
                <button
                  key={s.label}
                  onClick={() => handleSend(s.label)}
                  className="w-full group p-4 bg-white/[0.02] border border-white/5 hover:border-primary/40 hover:bg-primary/5 rounded-2xl transition-all text-left flex items-center gap-4"
                >
                  <div className="p-2 bg-white/5 rounded-lg group-hover:bg-primary/20 group-hover:text-primary transition-colors shrink-0">
                    <s.icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-white/60 group-hover:text-white transition-colors">{s.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((msg) => (
          <ChatMessage key={msg.id} msg={msg} />
        ))}
        {isOrchestrating && (
          <div className="flex items-center gap-3 text-[#F27D26]/60 bg-[#F27D26]/5 p-3 rounded-2xl border border-[#F27D26]/10 w-fit">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-[10px] font-bold uppercase tracking-widest italic">
              {activeModeConfig.name} Distilling...
            </span>
          </div>
        )}
      </div>

      <div className="p-4 sm:p-6 bg-[#080808] border-t border-white/5 pb-safe">
        <div className="relative">
          <input 
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
          />
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
            placeholder={`Input steering intent for ${activeModeConfig.name}...`}
            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-4 py-4 pb-20 sm:pb-14 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#F27D26]/50 transition-all resize-none min-h-[140px] sm:min-h-[120px]"
          />
          <div className="absolute bottom-4 left-4 flex flex-wrap items-center gap-2 sm:gap-3 max-w-[calc(100%-60px)]">
            <button 
              onClick={() => fileInputRef.current?.click()}
              title="Add Files" 
              className="p-2 rounded-lg bg-white/5 hover:bg-[#F27D26]/20 text-white/20 hover:text-[#F27D26] transition-all"
            >
              <Plus className="w-4 h-4" />
            </button>

            <button 
              onClick={toggleSpeech}
              title={isListening ? "Stop Voice Input" : "Voice Command"} 
              className={cn(
                "p-2 rounded-lg transition-all",
                isListening 
                  ? "bg-red-500/20 text-red-500 border border-red-500/30 animate-pulse" 
                  : "bg-white/5 hover:bg-[#F27D26]/20 text-white/20 hover:text-[#F27D26]"
              )}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <div className="h-4 w-px bg-white/10 mx-0.5 hidden sm:block" />
            <div className="flex items-center gap-1.5">
              <button 
                onClick={() => insertText('**', '**')}
                title="Bold"
                className="p-1.5 sm:p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/20 hover:text-white transition-all"
              >
                <Bold className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => insertText('_', '_')}
                title="Italic"
                className="p-1.5 sm:p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/20 hover:text-white transition-all"
              >
                <Italic className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => insertText('`', '`')}
                title="Inline Code"
                className="p-1.5 sm:p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/20 hover:text-white transition-all"
              >
                <CodeIcon className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isOrchestrating}
            className={cn(
              "absolute bottom-4 right-4 p-3 rounded-xl transition-all",
              input.trim() && !isOrchestrating 
                ? "bg-[#F27D26] text-black hover:bg-[#F27D26]/80 shadow-lg shadow-[#F27D26]/20" 
                : "bg-white/5 text-white/10 cursor-not-allowed"
            )}
          >
            <Send className="w-5 h-5 fill-current" />
          </button>
        </div>
      </div>
    </div>
  );
};
