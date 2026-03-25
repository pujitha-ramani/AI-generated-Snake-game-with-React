import { Play, Pause, SkipForward, SkipBack, Cpu } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface Track {
  id: number;
  title: string;
  artist: string;
  url: string;
}

const TRACKS: Track[] = [
  {
    id: 1,
    title: "DATA_STREAM_01",
    artist: "CORE_PROCESSOR",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  },
  {
    id: 2,
    title: "VOID_SIGNAL_02",
    artist: "NULL_POINTER",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  },
  {
    id: 3,
    title: "GRID_FAILURE_03",
    artist: "SYSTEM_ERROR",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("SIGNAL_INTERRUPTED", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  return (
    <div className="p-6 pixel-border bg-black/90 w-full max-w-md">
      <div className="flex flex-col items-center gap-6">
        <div className="w-48 h-48 bg-[#00ffff]/10 border-2 border-[#ff00ff] flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] animate-pulse" />
          <Cpu size={80} className="text-[#00ffff] relative z-10 animate-bounce" />
          <div className="absolute bottom-0 left-0 w-full h-1 bg-[#ff00ff] animate-[noise_2s_infinite]" />
        </div>

        <div className="text-center w-full">
          <div className="glitch-container">
            <h3 className="text-xl font-pixel text-[#ff00ff] glitch-text" data-text={currentTrack.title}>
              {currentTrack.title}
            </h3>
          </div>
          <p className="text-xs font-mono text-[#00ffff] mt-2 tracking-[0.4em]">{currentTrack.artist}</p>
        </div>

        <div className="w-full border-2 border-[#00ffff] h-4 bg-black p-0.5">
          <div 
            className="h-full bg-[#ff00ff] transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center gap-8">
          <button onClick={handlePrev} className="text-[#00ffff] hover:text-[#ff00ff] transition-colors">
            <SkipBack size={32} />
          </button>
          <button 
            onClick={togglePlay}
            className="w-16 h-16 border-2 border-[#ff00ff] flex items-center justify-center bg-[#00ffff] text-black hover:bg-[#ff00ff] hover:text-white transition-all"
          >
            {isPlaying ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
          </button>
          <button onClick={handleNext} className="text-[#00ffff] hover:text-[#ff00ff] transition-colors">
            <SkipForward size={32} />
          </button>
        </div>

        <div className="text-[10px] font-pixel text-[#00ffff]/50 mt-4">
          STATUS: {isPlaying ? "TRANSMITTING..." : "STANDBY"}
        </div>
      </div>

      <audio 
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleNext}
      />
    </div>
  );
}
