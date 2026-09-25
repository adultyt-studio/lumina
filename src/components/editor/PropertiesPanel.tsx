import React from 'react';
import { useDesignStore } from '../../store/designStore';
import { Sliders, X, Sparkles, Type, Square, Image as ImageIcon, Frame as FrameIcon, Move, RotateCw } from 'lucide-react';
import type { GlassPanelElement, TextElement, ShapeElement, ImageElement } from '../../types/design';

export const PropertiesPanel: React.FC = () => {
  const { frames, activeFrameId, selectedElementId, updateElement, updateFrame, setSelectedElement, isLowEndMode } =
    useDesignStore();

  const activeFrame = frames.find((f) => f.id === activeFrameId) || frames[0];

  let selectedElement: any = null;
  if (activeFrame && selectedElementId) {
    selectedElement = activeFrame.elements.find((e) => e.id === selectedElementId);
  }

  // If no element selected, render active Frame properties
  if (!selectedElement) {
    if (!activeFrame) return null;
    return (
      <div className="fixed top-20 right-4 z-30 w-80 max-w-[calc(100vw-2rem)]">
        <div className="glass-panel p-4 shadow-2xl border border-white/40 backdrop-blur-xl animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-white/20">
            <div className="flex items-center gap-2 font-bold text-sm text-white">
              <FrameIcon className="w-4 h-4 text-indigo-300" />
              <span>Frame Properties</span>
            </div>
          </div>

          <div className="py-3 space-y-3 text-xs text-white/90">
            <div>
              <label className="block font-semibold mb-1 text-white/80">Frame Name</label>
              <input
                type="text"
                value={activeFrame.name}
                onChange={(e) => updateFrame(activeFrame.id, { name: e.target.value })}
                className="w-full px-3 py-1.5 rounded-xl bg-black/30 border border-white/30 text-white font-medium focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold mb-1 text-white/80">Width</label>
                <input
                  type="number"
                  value={activeFrame.width}
                  onChange={(e) => updateFrame(activeFrame.id, { width: Number(e.target.value) })}
                  className="w-full px-3 py-1.5 rounded-xl bg-black/30 border border-white/30 text-white font-mono"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1 text-white/80">Height</label>
                <input
                  type="number"
                  value={activeFrame.height}
                  onChange={(e) => updateFrame(activeFrame.id, { height: Number(e.target.value) })}
                  className="w-full px-3 py-1.5 rounded-xl bg-black/30 border border-white/30 text-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1 text-white/80">Background Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={activeFrame.backgroundColor.startsWith('#') ? activeFrame.backgroundColor : '#6366f1'}
                  onChange={(e) => updateFrame(activeFrame.id, { backgroundColor: e.target.value })}
                  className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                />
                <input
                  type="text"
                  value={activeFrame.backgroundColor}
                  onChange={(e) => updateFrame(activeFrame.id, { backgroundColor: e.target.value })}
                  className="flex-1 px-3 py-1.5 rounded-xl bg-black/30 border border-white/30 text-white font-mono"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handlePropChange = (field: string, value: any) => {
    updateElement(selectedElement.id, { [field]: value });
  };

  return (
    <div className="fixed top-20 right-4 z-30 w-80 max-w-[calc(100vw-2rem)] max-h-[calc(100vh-6rem)] overflow-y-auto pr-1 scrollbar-none">
      <div className="glass-panel p-4 shadow-2xl border border-white/40 backdrop-blur-xl animate-in fade-in duration-200 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-white/20">
          <div className="flex items-center gap-2 font-bold text-sm text-white">
            <Sliders className="w-4 h-4 text-amber-300" />
            <span>Inspector ({selectedElement.name})</span>
          </div>
          <button
            onClick={() => setSelectedElement(null)}
            className="p-1 rounded-lg text-white/70 hover:bg-white/20 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Section 1: Transform (X, Y, W, H, Rotation, Opacity) */}
        <div className="space-y-2 text-xs text-white/90">
          <h5 className="font-bold text-amber-300 uppercase tracking-wider text-[10px] flex items-center gap-1">
            <Move className="w-3 h-3" /> Transform & Size
          </h5>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] text-white/70 font-semibold">X Position</label>
              <input
                type="number"
                value={selectedElement.x}
                onChange={(e) => handlePropChange('x', Number(e.target.value))}
                className="w-full px-2.5 py-1 rounded-lg bg-black/30 border border-white/30 font-mono"
              />
            </div>
            <div>
              <label className="text-[11px] text-white/70 font-semibold">Y Position</label>
              <input
                type="number"
                value={selectedElement.y}
                onChange={(e) => handlePropChange('y', Number(e.target.value))}
                className="w-full px-2.5 py-1 rounded-lg bg-black/30 border border-white/30 font-mono"
              />
            </div>
            <div>
              <label className="text-[11px] text-white/70 font-semibold">Width</label>
              <input
                type="number"
                value={selectedElement.width}
                onChange={(e) => handlePropChange('width', Number(e.target.value))}
                className="w-full px-2.5 py-1 rounded-lg bg-black/30 border border-white/30 font-mono"
              />
            </div>
            <div>
              <label className="text-[11px] text-white/70 font-semibold">Height</label>
              <input
                type="number"
                value={selectedElement.height}
                onChange={(e) => handlePropChange('height', Number(e.target.value))}
                className="w-full px-2.5 py-1 rounded-lg bg-black/30 border border-white/30 font-mono"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[11px] font-semibold text-white/80">
              <span>Rotation</span>
              <span>{selectedElement.rotation}°</span>
            </div>
            <input
              type="range"
              min={0}
              max={360}
              value={selectedElement.rotation}
              onChange={(e) => handlePropChange('rotation', Number(e.target.value))}
              className="w-full accent-indigo-400"
            />
          </div>

          <div>
            <div className="flex justify-between text-[11px] font-semibold text-white/80">
              <span>Opacity</span>
              <span>{Math.round((selectedElement.opacity || 1) * 100)}%</span>
            </div>
            <input
              type="range"
              min={0.1}
              max={1}
              step={0.05}
              value={selectedElement.opacity}
              onChange={(e) => handlePropChange('opacity', Number(e.target.value))}
              className="w-full accent-indigo-400"
            />
          </div>
        </div>

        {/* Section 2: Glass Panel Specific Controls */}
        {selectedElement.type === 'glass-panel' && (
          <div className="pt-2 border-t border-white/20 space-y-2 text-xs text-white/90">
            <h5 className="font-bold text-amber-300 uppercase tracking-wider text-[10px] flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Glassmorphism Specs
            </h5>

            <div>
              <div className="flex justify-between font-semibold text-white/80">
                <span>Backdrop Blur</span>
                <span>{(selectedElement as GlassPanelElement).blurAmount}px</span>
              </div>
              <input
                type="range"
                min={0}
                max={40}
                disabled={isLowEndMode}
                value={(selectedElement as GlassPanelElement).blurAmount}
                onChange={(e) => handlePropChange('blurAmount', Number(e.target.value))}
                className="w-full accent-amber-400"
              />
            </div>

            <div>
              <div className="flex justify-between font-semibold text-white/80">
                <span>Glass Opacity</span>
                <span>{(selectedElement as GlassPanelElement).glassOpacity}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={(selectedElement as GlassPanelElement).glassOpacity}
                onChange={(e) => handlePropChange('glassOpacity', Number(e.target.value))}
                className="w-full accent-amber-400"
              />
            </div>

            <div>
              <div className="flex justify-between font-semibold text-white/80">
                <span>Corner Radius</span>
                <span>{(selectedElement as GlassPanelElement).cornerRadius}px</span>
              </div>
              <input
                type="range"
                min={0}
                max={60}
                value={(selectedElement as GlassPanelElement).cornerRadius}
                onChange={(e) => handlePropChange('cornerRadius', Number(e.target.value))}
                className="w-full accent-amber-400"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="font-semibold text-white/80">Liquid Morphing Animation</span>
              <input
                type="checkbox"
                checked={(selectedElement as GlassPanelElement).liquidEffect}
                onChange={(e) => handlePropChange('liquidEffect', e.target.checked)}
                className="w-4 h-4 accent-pink-500 rounded cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* Section 3: Text Typography Controls */}
        {selectedElement.type === 'text' && (
          <div className="pt-2 border-t border-white/20 space-y-2 text-xs text-white/90">
            <h5 className="font-bold text-pink-300 uppercase tracking-wider text-[10px] flex items-center gap-1">
              <Type className="w-3 h-3" /> Typography
            </h5>

            <div>
              <label className="block font-semibold mb-1 text-white/80">Content</label>
              <textarea
                value={(selectedElement as TextElement).content}
                onChange={(e) => handlePropChange('content', e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-black/30 border border-white/30 text-white font-medium focus:outline-none"
                rows={2}
              />
            </div>

            <div>
              <label className="block font-semibold mb-1 text-white/80">Font Family</label>
              <select
                value={(selectedElement as TextElement).fontFamily}
                onChange={(e) => handlePropChange('fontFamily', e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-black/30 border border-white/30 text-white font-medium"
              >
                <option value="Plus Jakarta Sans">Plus Jakarta Sans</option>
                <option value="Inter">Inter</option>
                <option value="Roboto">Roboto</option>
                <option value="Poppins">Poppins</option>
                <option value="Montserrat">Montserrat</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-white/80 mb-1">Font Size</label>
                <input
                  type="number"
                  value={(selectedElement as TextElement).fontSize}
                  onChange={(e) => handlePropChange('fontSize', Number(e.target.value))}
                  className="w-full px-2.5 py-1 rounded-lg bg-black/30 border border-white/30 font-mono"
                />
              </div>
              <div>
                <label className="block font-semibold text-white/80 mb-1">Text Color</label>
                <input
                  type="color"
                  value={(selectedElement as TextElement).color}
                  onChange={(e) => handlePropChange('color', e.target.value)}
                  className="w-full h-8 rounded-lg bg-transparent border-0 cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {/* Section 4: Shape Controls */}
        {selectedElement.type === 'shape' && (
          <div className="pt-2 border-t border-white/20 space-y-2 text-xs text-white/90">
            <h5 className="font-bold text-indigo-300 uppercase tracking-wider text-[10px] flex items-center gap-1">
              <Square className="w-3 h-3" /> Shape Options
            </h5>

            <div>
              <label className="block font-semibold text-white/80 mb-1">Shape Type</label>
              <select
                value={(selectedElement as ShapeElement).shapeType}
                onChange={(e) => handlePropChange('shapeType', e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-black/30 border border-white/30 text-white font-medium"
              >
                <option value="rectangle">Rectangle</option>
                <option value="circle">Circle</option>
                <option value="triangle">Triangle</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-white/80 mb-1">Fill Color</label>
                <input
                  type="color"
                  value={
                    (selectedElement as ShapeElement).fillColor.startsWith('#')
                      ? (selectedElement as ShapeElement).fillColor
                      : '#6366f1'
                  }
                  onChange={(e) => handlePropChange('fillColor', e.target.value)}
                  className="w-full h-8 rounded-lg bg-transparent border-0 cursor-pointer"
                />
              </div>
              <div>
                <label className="block font-semibold text-white/80 mb-1">Stroke Color</label>
                <input
                  type="color"
                  value={
                    (selectedElement as ShapeElement).strokeColor.startsWith('#')
                      ? (selectedElement as ShapeElement).strokeColor
                      : '#ffffff'
                  }
                  onChange={(e) => handlePropChange('strokeColor', e.target.value)}
                  className="w-full h-8 rounded-lg bg-transparent border-0 cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
