import React from 'react';
import { Sidebar } from './components/Sidebar';
import { Workspace } from './components/workspace/Workspace';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useStore } from './store/useStore';
import { LayoutGrid, MessageSquare, Share2, Box, Info } from 'lucide-react';
import { cn } from './lib/utils';

const queryClient = new QueryClient();

export default function App() {
  const { activeView, setActiveView } = useStore();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const bottomNavItems = [
    { id: 'workspace', icon: MessageSquare, label: 'Chat' },
    { id: 'artifacts', icon: Box, label: 'Builds' },
    { id: 'deck', icon: LayoutGrid, label: 'PCards' },
    { id: 'ccc', icon: Share2, label: 'Semantic' },
    { id: 'info', icon: Info, label: 'Support' },
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
