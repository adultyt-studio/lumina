import React from 'react';
import { useLuminaStore } from '../store/useLuminaStore';
import { Sliders, Trash2, X, Eye, Sparkles } from 'lucide-react';

export const GlassInspector: React.FC = () => {
  const { nodes, selectedNodeId, selectNode, updateNode, deleteNode, isLowEndMode } =
    useLuminaStore();

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  if (!selectedNode) {
    return null;
  }

  return (
    <div className="fixed top-20 right-4 z-30 w-80 max-w-[calc(100vw-2rem)]">
      <div className="glass-panel p-4 shadow-2xl border border-white/50 backdrop-blur-xl animate-in fade-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200/50">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span className="font-bold text-sm text-slate-900">Glass Properties</span>
          </div>
          <button
            onClick={() => selectNode(null)}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="py-3 space-y-3 text-xs">
          {/* Node Name */}
          <div>
            <label className="block text-slate-500 font-semibold mb-1">Element Name</label>
            <input
              type="text"
              value={selectedNode.name}
              onChange={(e) => updateNode(selectedNode.id, { name: e.target.value })}
              className="w-full px-3 py-1.5 rounded-xl bg-white/60 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
            />
          </div>

          {/* Text Content if applicable */}
          <div>
            <label className="block text-slate-500 font-semibold mb-1">Label Content</label>
            <input
              type="text"
              value={selectedNode.content || ''}
              onChange={(e) => updateNode(selectedNode.id, { content: e.target.value })}
              className="w-full px-3 py-1.5 rounded-xl bg-white/60 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
            />
          </div>

          {/* Backdrop Blur Control */}
          <div>
            <div className="flex justify-between text-slate-600 font-semibold mb-1">
              <span>Backdrop Blur</span>
              <span>{selectedNode.blur}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="24"
              value={selectedNode.blur}
              disabled={isLowEndMode}
              onChange={(e) => updateNode(selectedNode.id, { blur: Number(e.target.value) })}
              className="w-full accent-indigo-600"
            />
            {isLowEndMode && (
              <span className="text-[10px] text-amber-600 font-medium">
                (Disabled in Low-End Mode for speed)
              </span>
            )}
          </div>

          {/* Opacity Control */}
          <div>
            <div className="flex justify-between text-slate-600 font-semibold mb-1">
              <span>Glass Opacity</span>
              <span>{Math.round(selectedNode.opacity * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="1.0"
              step="0.05"
              value={selectedNode.opacity}
              onChange={(e) => updateNode(selectedNode.id, { opacity: Number(e.target.value) })}
              className="w-full accent-indigo-600"
            />
          </div>

          {/* Border Radius */}
          <div>
            <div className="flex justify-between text-slate-600 font-semibold mb-1">
              <span>Corner Radius</span>
              <span>{selectedNode.borderRadius}px</span>
            </div>
            <input
              type="range"
              min="8"
              max="40"
              value={selectedNode.borderRadius}
              onChange={(e) =>
                updateNode(selectedNode.id, { borderRadius: Number(e.target.value) })
              }
              className="w-full accent-indigo-600"
            />
          </div>

          {/* Surface Elevation */}
          <div>
            <div className="flex justify-between text-slate-600 font-semibold mb-1">
              <span>Liquid Elevation</span>
              <span>Level {selectedNode.elevation}</span>
            </div>
            <div className="flex gap-2 pt-1">
              {[1, 2, 3].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => updateNode(selectedNode.id, { elevation: lvl })}
                  className={`flex-1 py-1 rounded-lg border font-bold transition ${
                    selectedNode.elevation === lvl
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white/50 text-slate-700 border-slate-200'
                  }`}
                >
                  L{lvl}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Delete Action */}
        <div className="pt-2 border-t border-slate-200/50 flex justify-end">
          <button
            onClick={() => deleteNode(selectedNode.id)}
            className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 font-semibold flex items-center gap-1.5 text-xs transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete Element
          </button>
        </div>
      </div>
    </div>
  );
};
