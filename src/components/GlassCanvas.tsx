import React, { useState } from 'react';
import { useLuminaStore, GlassNode } from '../store/useLuminaStore';
import { Sparkles, Layers, Square, Type, CheckCircle2 } from 'lucide-react';
import { WebPImage } from './WebPImage';

export const GlassCanvas: React.FC = () => {
  const { nodes, selectedNodeId, selectNode, updateNode, zoom, isLowEndMode } =
    useLuminaStore();

  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const handlePointerDown = (e: React.PointerEvent, node: GlassNode) => {
    e.stopPropagation();
    selectNode(node.id);
    setDraggingId(node.id);
    setDragOffset({
      x: e.clientX - node.x,
      y: e.clientY - node.y,
    });
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggingId) return;
    updateNode(draggingId, {
      x: Math.max(0, Math.round(e.clientX - dragOffset.x)),
      y: Math.max(0, Math.round(e.clientY - dragOffset.y)),
    });
  };

  const handlePointerUp = () => {
    setDraggingId(null);
  };

  return (
    <div
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onClick={() => selectNode(null)}
      className="relative w-full h-[calc(100vh-4rem)] overflow-hidden bg-gradient-to-br from-slate-100 via-indigo-50/30 to-slate-200 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/50 touch-none select-none"
    >
      {/* Background Dot Grid for Figma Canvas Feel */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#6366f1 1px, transparent 1px)',
          backgroundSize: `${24 * zoom}px ${24 * zoom}px`,
        }}
      />

      {/* Rendered Glass Nodes */}
      <div
        style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}
        className="w-full h-full relative"
      >
        {nodes.map((node) => {
          const isSelected = selectedNodeId === node.id;

          const dynamicStyle: React.CSSProperties = {
            position: 'absolute',
            left: `${node.x}px`,
            top: `${node.y}px`,
            width: `${node.width}px`,
            height: `${node.height}px`,
            borderRadius: `${node.borderRadius}px`,
            opacity: node.opacity,
            backdropFilter: isLowEndMode ? 'none' : `blur(${node.blur}px)`,
            WebkitBackdropFilter: isLowEndMode ? 'none' : `blur(${node.blur}px)`,
          };

          return (
            <div
              key={node.id}
              style={dynamicStyle}
              onPointerDown={(e) => handlePointerDown(e, node)}
              className={`
                glass-panel p-4 cursor-grab active:cursor-grabbing liquid-interactive
                ${isSelected ? 'ring-2 ring-indigo-600 ring-offset-2 shadow-2xl scale-[1.02]' : ''}
              `}
            >
              {/* Header Label */}
              <div className="flex items-center justify-between gap-2 mb-2 pointer-events-none">
                <div className="flex items-center gap-1.5 font-bold text-xs text-slate-800 dark:text-white">
                  {node.type === 'liquid' && <Sparkles className="w-3.5 h-3.5 text-indigo-600" />}
                  {node.type === 'card' && <Square className="w-3.5 h-3.5 text-indigo-500" />}
                  {node.type === 'frame' && <Layers className="w-3.5 h-3.5 text-slate-600" />}
                  {node.type === 'text' && <Type className="w-3.5 h-3.5 text-indigo-600" />}
                  <span>{node.name}</span>
                </div>
                {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />}
              </div>

              {/* Node Body Content */}
              <div className="text-xs text-slate-600 dark:text-slate-300 font-medium pointer-events-none">
                {node.content}
              </div>

              {/* Sample WebP Image for Liquid Card */}
              {node.type === 'liquid' && (
                <div className="mt-3 pointer-events-none">
                  <div className="h-14 rounded-xl bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-white/40 flex items-center justify-center">
                    <span className="text-[10px] font-semibold text-indigo-900 dark:text-indigo-200">
                      Liquid Refraction Surface
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
