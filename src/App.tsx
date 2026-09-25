import React from 'react';
import './styles/index.css';
import './styles/glassmorphism.css';
import './styles/liquid-animation.css';
import { useLuminaStore } from './store/useLuminaStore';
import { Header } from './components/Header';
import { GlassCanvas } from './components/GlassCanvas';
import { PerformanceProfiler } from './components/PerformanceProfiler';
import { GlassInspector } from './components/GlassInspector';
import { GlassToolbar } from './components/GlassToolbar';

export const App: React.FC = () => {
  const { isLowEndMode, darkMode } = useLuminaStore();

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'} ${isLowEndMode ? 'low-end-mode' : ''}`}>
      <Header />
      <main className="relative">
        <PerformanceProfiler />
        <GlassInspector />
        <GlassCanvas />
        <GlassToolbar />
      </main>
    </div>
  );
};

export default App;
