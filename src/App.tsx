import React from 'react';
import './styles/index.css';
import './styles/glassmorphism.css';
import './styles/liquid-animation.css';
import { useDesignStore } from './store/designStore';
import { Header } from './components/Header';
import { Canvas } from './components/editor/Canvas';
import { Toolbar } from './components/editor/Toolbar';
import { LayerPanel } from './components/editor/LayerPanel';
import { PropertiesPanel } from './components/editor/PropertiesPanel';
import { AnimationTimeline } from './components/editor/AnimationTimeline';
import { PerformanceProfiler } from './components/PerformanceProfiler';

export const App: React.FC = () => {
  const { isLowEndMode, darkMode } = useDesignStore();

  return (
    <div className={`min-h-screen relative overflow-hidden ${darkMode ? 'dark bg-slate-950 text-white' : 'text-slate-900'} ${isLowEndMode ? 'low-end-mode' : ''}`}>
      {/* Background Ambient Glowing Orbs */}
      <div className="bg-orb orb-1" />
      <div className="bg-orb orb-2" />
      <div className="bg-orb orb-3" />

      {/* Lumina Figma-Style Studio Layout */}
      <Header />
      <main className="relative z-10">
        <Toolbar />
        <PerformanceProfiler />
        <LayerPanel />
        <AnimationTimeline />
        <PropertiesPanel />
        <Canvas />
      </main>
    </div>
  );
};

export default App;
