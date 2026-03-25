import MusicPlayer from './components/MusicPlayer';
import SnakeGame from './components/SnakeGame';
import { Terminal, Activity } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center py-16 px-4 gap-16 relative">
      <div className="crt-overlay" />
      
      <header className="text-center relative z-10">
        <div className="glitch-container">
          <h1 className="text-6xl md:text-8xl font-pixel text-[#00ffff] glitch-text mb-6" data-text="VOID_RUNNER">
            VOID_RUNNER
          </h1>
        </div>
        <p className="font-mono text-[#ff00ff] text-sm tracking-[0.8em] uppercase animate-pulse">
          Sub-Protocol: Snake_Matrix // Signal: Active
        </p>
      </header>

      <main className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-16 items-start relative z-10">
        {/* Left Sidebar - Music Player */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          <div className="flex items-center gap-4 px-2">
            <Activity size={24} className="text-[#ff00ff] animate-pulse" />
            <h2 className="font-pixel text-xs tracking-widest text-[#00ffff]">AUDIO_LINK</h2>
          </div>
          <MusicPlayer />
          
          <div className="p-6 pixel-border bg-black/80 font-mono text-[10px] text-[#00ffff]/70 leading-relaxed">
            <p className="font-pixel text-[8px] text-[#ff00ff] mb-4 tracking-tighter">SYSTEM_LOGS</p>
            <div className="space-y-2">
              <p className="flex justify-between"><span>{">"} BOOT_SEQUENCE</span> <span className="text-[#ff00ff]">OK</span></p>
              <p className="flex justify-between"><span>{">"} MEMORY_ALLOC</span> <span className="text-[#ff00ff]">OK</span></p>
              <p className="flex justify-between"><span>{">"} GRID_STABILITY</span> <span className="text-[#ffff00]">98.4%</span></p>
              <p className="flex justify-between"><span>{">"} USER_AUTH</span> <span className="text-[#ff00ff]">GRANTED</span></p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#00ffff]/20 animate-pulse">
              WARNING: UNAUTHORIZED ACCESS DETECTED IN SECTOR 7G
            </div>
          </div>
        </div>

        {/* Center - Snake Game */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          <div className="flex items-center gap-4 px-2">
            <Terminal size={24} className="text-[#00ffff] animate-pulse" />
            <h2 className="font-pixel text-xs tracking-widest text-[#ff00ff]">GRID_INTERFACE</h2>
          </div>
          <div className="p-10 pixel-border bg-black/40 backdrop-blur-sm flex justify-center items-center">
            <SnakeGame />
          </div>
        </div>
      </main>

      <footer className="mt-auto pt-16 font-mono text-[#ff00ff]/40 text-[10px] tracking-[1em] uppercase">
        TERMINAL_ID: 0x7FF_A01 // CONNECTION_SECURE
      </footer>
    </div>
  );
}
