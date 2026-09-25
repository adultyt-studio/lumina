import React from 'react';
import { useDesignStore } from '../store/designStore';
import { Sparkles, ZoomIn, ZoomOut, Moon, Sun, Smartphone } from 'lucide-react';

export const Header: React.FC = () => {
  const { zoom, setZoom, isLowEndMode } = useDesignStore();
  const [darkMode, setDarkMode] = React.useState(false);

  return (
    <header className="h-16 px-4 z-40 relative flex items-center justify-between border-b border-white/20 backdrop-blur-xl bg-white/10 dark:bg-slate-900/60 text-white">
      {/* Brand & Framework Name */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="font-extrabold text-base tracking-tight text-white flex items-center gap-2 drop-shadow">
            Lumina Studio
            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-indigo-500/30 text-indigo-200 border border-indigo-400/40">
              v2.0 Figma Engine
            </span>
          </h1>
          <p className="text-[11px] text-white/70 font-medium">
            Full-Featured Mobile Design Studio
          </p>
        </div>
      </div>

      {/* Center Zoom Controls */}
      <div className="hidden sm:flex items-center gap-2 p-1 rounded-2xl bg-black/20 border border-white/20">
        <button
          onClick={() => setZoom(zoom - 0.1)}
          className="p-1.5 rounded-xl hover:bg-white/20 text-white transition"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <span className="text-xs font-mono font-bold px-2 text-white">
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={() => setZoom(zoom + 0.1)}
          className="p-1.5 rounded-xl hover:bg-white/20 text-white transition"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Profile Indicators */}
      <div className="flex items-center gap-2">
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-black/20 text-xs font-semibold text-white/90 border border-white/20">
          <Smartphone className="w-3.5 h-3.5 text-indigo-300" />
          <span>Target: Android 5.0+ / iOS 11+</span>
        </div>

        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-xl bg-black/20 text-white hover:bg-white/20 transition border border-white/20"
        >
          {darkMode ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};
