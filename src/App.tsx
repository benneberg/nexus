import React from 'react';
import { Sidebar } from './components/Sidebar';
import { Workspace } from './components/workspace/Workspace';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useStore } from './store/useStore';
import { LayoutGrid, MessageSquare, Share2, Box, Info, Cpu } from 'lucide-react';
import { cn } from './lib/utils';

const queryClient = new QueryClient();

export default function App() {
  const { activeView, setActiveView, loadPersistedState, fetchMarketplaceSkills } = useStore();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  React.useEffect(() => {
    loadPersistedState();
    fetchMarketplaceSkills();
  }, [loadPersistedState, fetchMarketplaceSkills]);

  React.useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    const wsUrl = `${protocol}//${host}/nsp`;
    
    let ws: WebSocket | null = null;
    let reconnectTimeout: any = null;
    let pollInterval: any = null;
    let attempts = 0;

    function startPollingFallback() {
      if (pollInterval) return;
      const fetchTelemetry = async () => {
        try {
          const res = await fetch('/api/telemetry');
          if (res.ok) {
            const data = await res.json();
            useStore.getState().updateTelemetryStream(data);
          }
        } catch (e) {
          // ignore transient poll errors
        }
      };
      fetchTelemetry();
      pollInterval = setInterval(fetchTelemetry, 5000);
    }

    function stopPollingFallback() {
      if (pollInterval) {
        clearInterval(pollInterval);
        pollInterval = null;
      }
    }

    function connect() {
      try {
        ws = new WebSocket(wsUrl);

        ws.onopen = () => {
          console.log('NSP WebSocket connected successfully.');
          attempts = 0;
          stopPollingFallback();
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.type === 'NSP_TELEMETRY') {
              useStore.getState().updateTelemetryStream(data.payload);
            } else if (data.type === 'SKILL_REGISTERED') {
              useStore.setState((state) => ({
                marketplaceSkills: [data.payload, ...state.marketplaceSkills.filter(s => s.id !== data.payload.id)]
              }));
            }
          } catch (err) {
            // quiet catch
          }
        };

        ws.onclose = () => {
          attempts++;
          if (attempts >= 2) {
            startPollingFallback();
            reconnectTimeout = setTimeout(connect, 10000);
          } else {
            reconnectTimeout = setTimeout(connect, 3000);
          }
        };

        ws.onerror = () => {
          console.warn('NSP WebSocket connection unavailable, fallback active.');
          startPollingFallback();
        };
      } catch (e) {
        console.warn('NSP WebSocket initialization failed, fallback active.');
        startPollingFallback();
      }
    }

    connect();

    return () => {
      if (ws) {
        ws.onopen = null;
        ws.onmessage = null;
        ws.onclose = null;
        ws.onerror = null;
        ws.close();
      }
      clearTimeout(reconnectTimeout);
      stopPollingFallback();
    };
  }, []);

  const bottomNavItems = [
    { id: 'workspace', icon: MessageSquare, label: 'Chat' },
    { id: 'artifacts', icon: Box, label: 'Builds' },
    { id: 'deck', icon: LayoutGrid, label: 'PCards' },
    { id: 'ccc', icon: Share2, label: 'Semantic' },
    { id: 'skills', icon: Cpu, label: 'Market' },
  ];

  return (
    <QueryClientProvider client={queryClient}>
      <div className="h-screen flex flex-col bg-[#050505] text-white overflow-hidden relative selection:bg-primary/30">
        <style>
          {`
            .no-scrollbar::-webkit-scrollbar { display: none; }
            .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
          `}
        </style>
        {/* Desktop Sidebar (Only visible on large screens) */}
        <div className="hidden lg:flex h-full w-full overflow-hidden">
          <Sidebar />
          <Workspace />
        </div>

        {/* Mobile-First Layout (Visible on smaller screens) */}
        <div className="lg:hidden flex flex-col h-full w-full overflow-hidden relative">
          {/* Mobile Sidebar Drawer */}
          {isSidebarOpen && (
            <div 
              className="absolute inset-0 z-[100] bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
              onClick={() => setIsSidebarOpen(false)}
            >
              <div 
                className="w-72 h-full bg-[#0a0a0a] animate-in slide-in-from-left duration-300"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="h-full flex flex-col pt-safe">
                  <Sidebar mobileOnClose={() => setIsSidebarOpen(false)} />
                </div>
              </div>
            </div>
          )}

          {/* Main Content Area */}
          <div className="flex-1 overflow-hidden relative">
            <Workspace onMenuClick={() => setIsSidebarOpen(true)} />
          </div>

          {/* Bottom Navigation Bar */}
          <nav className="h-16 sm:h-20 bg-[#080808]/90 backdrop-blur-md border-t border-white/10 flex items-center justify-around px-2 pb-safe shrink-0">
            {bottomNavItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id as any)}
                className={cn(
                  "flex flex-col items-center gap-1 transition-all p-1.5 sm:p-2 rounded-xl active:scale-95",
                  activeView === item.id ? "text-primary" : "text-white/20"
                )}
              >
                <item.icon className={cn("w-5 h-5", activeView === item.id ? "fill-primary/5" : "")} />
                <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.1em] sm:tracking-widest">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>
    </QueryClientProvider>
  );
}
