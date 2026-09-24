import React from 'react';
import { useLuminaStore } from '../store/useLuminaStore';
import { Sparkles, ZoomIn, ZoomOut, Moon, Sun, Smartphone } from 'lucide-react';

export const Header: React.FC = () => {
  const { zoom, setZoom, isLowEndMode, darkMode, toggleDarkMode } = useLuminaStore();

  return (
    <header className="h-16 px-4 z-40 relative flex items-center justify-between border-b border-white/30 backdrop-blur-xl bg-white/70 dark:bg-slate-900/80 dark:border-slate-800">
      {/* Brand & Framework Name */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            Lumina Studio
            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
              v1.0 Low-End
            </span>
          </h1>
          <p className="text-[11px] text-slate-500 font-medium">
            Figma-Inspired Glassmorphism Engine
          </p>
        </div>
      </div>

      {/* Center Zoom Controls */}
      <div className="hidden sm:flex items-center gap-2 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
        <button
          onClick={() => setZoom(zoom - 0.1)}
          className="p-1.5 rounded-xl hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <span className="text-xs font-mono font-bold px-2 text-slate-800 dark:text-slate-200">
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={() => setZoom(zoom + 0.1)}
          className="p-1.5 rounded-xl hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Profile Indicators */}
      <div className="flex items-center gap-2">
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
          <Smartphone className="w-3.5 h-3.5 text-indigo-500" />
          <span>Target: Android 5.0+ / iOS 11+</span>
        </div>

        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
        >
          {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};
