import React from 'react';
import { useLuminaStore, ToolType } from '../store/useLuminaStore';
import { MousePointer, Square, Sparkles, Type, Layers, Plus, RotateCcw } from 'lucide-react';

export const GlassToolbar: React.FC = () => {
  const { activeTool, setActiveTool, addNode, resetCanvas } = useLuminaStore();

  const tools: { type: ToolType; label: string; icon: React.ReactNode }[] = [
    { type: 'select', label: 'Select', icon: <MousePointer className="w-5 h-5" /> },
    { type: 'liquid', label: 'Liquid Glass', icon: <Sparkles className="w-5 h-5" /> },
    { type: 'card', label: 'Glass Card', icon: <Square className="w-5 h-5" /> },
    { type: 'frame', label: 'Frame', icon: <Layers className="w-5 h-5" /> },
    { type: 'text', label: 'Text Node', icon: <Type className="w-5 h-5" /> },
  ];

  const handleToolClick = (type: ToolType) => {
    setActiveTool(type);
    if (type !== 'select') {
      addNode({
        type,
        name: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
        x: Math.floor(Math.random() * 80) + 20,
        y: Math.floor(Math.random() * 120) + 40,
        width: type === 'liquid' ? 280 : 160,
        height: type === 'liquid' ? 140 : 120,
      });
      // Automatically return to select mode
      setTimeout(() => setActiveTool('select'), 300);
    }
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-sm w-[92vw]">
      <div className="glass-panel p-2 flex items-center justify-around gap-1 shadow-2xl backdrop-blur-xl border border-white/40">
        {tools.map((tool) => {
          const isActive = activeTool === tool.type;
          return (
            <button
              key={tool.type}
              onClick={() => handleToolClick(tool.type)}
              title={tool.label}
              className={`
                p-3 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all duration-300
                ${
                  isActive
                    ? 'bg-slate-900/90 text-white shadow-lg scale-105 border border-white/30'
                    : 'text-slate-700 hover:bg-white/40 active:scale-95'
                }
              `}
            >
              {tool.icon}
              <span className="text-[10px] font-semibold tracking-tight">{tool.label}</span>
            </button>
          );
        })}

        <div className="w-[1px] h-8 bg-slate-300/40 my-auto" />

        <button
          onClick={resetCanvas}
          title="Reset Canvas"
          className="p-3 rounded-2xl text-slate-700 hover:bg-rose-500/20 hover:text-rose-700 active:scale-95 transition-all flex flex-col items-center justify-center gap-1"
        >
          <RotateCcw className="w-5 h-5" />
          <span className="text-[10px] font-semibold tracking-tight">Reset</span>
        </button>
      </div>
    </div>
  );
};
