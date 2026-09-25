import React, { useState } from 'react';
import { useDesignStore } from '../../store/designStore';
import { Sparkles, Type, Square, Image, Lock, Unlock, Trash2, Layers, GripVertical, ChevronDown, ChevronRight } from 'lucide-react';
import type { ElementType } from '../../types/design';

export const LayerPanel: React.FC = () => {
  const { frames, activeFrameId, selectedElementId, setSelectedElement, reorderElement, toggleLock, deleteElement } = useDesignStore();
  const [isOpen, setIsOpen] = useState(true);

  const activeFrame = frames.find((f) => f.id === activeFrameId) || frames[0];
  if (!activeFrame) return null;

  const getIconForType = (type: ElementType) => {
    switch (type) {
      case 'glass-panel':
        return <Sparkles className="w-3.5 h-3.5 text-amber-300" />;
      case 'text':
        return <Type className="w-3.5 h-3.5 text-pink-300" />;
      case 'shape':
        return <Square className="w-3.5 h-3.5 text-indigo-300" />;
      case 'image':
        return <Image className="w-3.5 h-3.5 text-emerald-300" />;
      default:
        return <Layers className="w-3.5 h-3.5 text-slate-300" />;
    }
  };

  return (
    <div className="fixed bottom-4 left-4 z-30 w-72 max-w-[calc(100vw-2rem)]">
      <div className="glass-panel p-3 shadow-2xl border border-white/40 backdrop-blur-xl">
        {/* Panel Header */}
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between cursor-pointer select-none pb-2 border-b border-white/20"
        >
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-300" />
            <span className="font-bold text-xs text-white">Layers</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200">
              {activeFrame.elements.length}
            </span>
          </div>
          {isOpen ? <ChevronDown className="w-4 h-4 text-white/70" /> : <ChevronRight className="w-4 h-4 text-white/70" />}
        </div>

        {/* Layer Stack Items */}
        {isOpen && (
          <div className="mt-2 space-y-1.5 max-h-60 overflow-y-auto pr-1">
            {activeFrame.elements.length === 0 ? (
              <div className="text-center py-4 text-xs text-white/60 font-medium">
                No layers in frame. Click + to add.
              </div>
            ) : (
              [...activeFrame.elements].reverse().map((el) => {
                const isSelected = selectedElementId === el.id;
                return (
                  <div
                    key={el.id}
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData('text/plain', el.id)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      const draggedId = e.dataTransfer.getData('text/plain');
                      if (draggedId && draggedId !== el.id) {
                        reorderElement(draggedId, el.id);
                      }
                    }}
                    onClick={() => setSelectedElement(el.id)}
                    className={`
                      p-2 rounded-xl flex items-center justify-between gap-2 text-xs font-semibold cursor-pointer transition-all
                      ${
                        isSelected
                          ? 'bg-indigo-600/80 text-white shadow-md border border-white/40'
                          : 'bg-white/10 text-white/90 hover:bg-white/20'
                      }
                      ${el.locked ? 'opacity-60' : ''}
                    `}
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <GripVertical className="w-3.5 h-3.5 text-white/40 cursor-grab" />
                      {getIconForType(el.type)}
                      <span className="truncate max-w-[110px]">{el.name}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLock(el.id);
                        }}
                        className="p-1 rounded-lg hover:bg-white/20 text-white/80 transition"
                        title={el.locked ? 'Unlock Layer' : 'Lock Layer'}
                      >
                        {el.locked ? <Lock className="w-3.5 h-3.5 text-amber-300" /> : <Unlock className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteElement(el.id);
                        }}
                        className="p-1 rounded-lg hover:bg-rose-500/30 text-rose-300 transition"
                        title="Delete Layer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
};
