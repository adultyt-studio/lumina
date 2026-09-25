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
    <div className={`min-h-screen relative overflow-hidden ${darkMode ? 'dark bg-slate-950 text-white' : 'text-slate-900'} ${isLowEndMode ? 'low-end-mode' : ''}`}>
      {/* Background Ambient Orbs for Glass Depth */}
      <div className="bg-orb orb-1" />
      <div className="bg-orb orb-2" />
      <div className="bg-orb orb-3" />

      {/* Glass UI Studio Elements */}
      <Header />
      <main className="relative z-10">
        <PerformanceProfiler />
        <GlassInspector />
        <GlassCanvas />
        <GlassToolbar />
      </main>
    </div>
  );
};

export default App;
