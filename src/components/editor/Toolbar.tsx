import React, { useRef } from 'react';
import { useDesignStore } from '../../store/designStore';
import { exportAsJSON, exportAsPNG, exportAsSVG, importFromJSON, importImageFile } from '../../utils/importExport';
import {
  Plus,
  Copy,
  Download,
  Upload,
  Sparkles,
  Type,
  Square,
  Image as ImageIcon,
  Layers,
  FileCode,
  Image,
  Zap,
} from 'lucide-react';

export const Toolbar: React.FC = () => {
  const {
    frames,
    activeFrameId,
    selectedElementId,
    addFrame,
    duplicateFrame,
    addElement,
    duplicateElement,
    loadProjectData,
    isLowEndMode,
    toggleLowEndMode,
  } = useDesignStore();

  const jsonInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const activeFrame = frames.find((f) => f.id === activeFrameId) || frames[0];

  const handleJsonImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const imported = await importFromJSON(file);
      loadProjectData(imported);
    } catch (err: any) {
      alert(err.message || 'Failed to import JSON file');
    }
    if (e.target) e.target.value = '';
  };

  const handleImageImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const src = await importImageFile(file);
      addElement('image', { src, name: file.name.replace(/\.[^/.]+$/, '') });
    } catch (err: any) {
      alert(err.message || 'Failed to upload image');
    }
    if (e.target) e.target.value = '';
  };

  return (
    <div className="fixed top-3 left-1/2 -translate-x-1/2 z-40 max-w-4xl w-[95vw]">
      <div className="glass-panel p-2 flex items-center justify-between gap-1 shadow-2xl backdrop-blur-xl border border-white/40">
        {/* Left: Frame & Element Creation Tools */}
        <div className="flex items-center gap-1 overflow-x-auto py-0.5 scrollbar-none">
          <button
            onClick={() => addFrame()}
            className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white font-semibold text-xs flex items-center gap-1.5 hover:bg-indigo-700 transition active:scale-95 shadow-md"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New Frame</span>
          </button>

          <div className="w-[1px] h-6 bg-white/30 my-auto" />

          <button
            onClick={() => addElement('glass-panel')}
            className="px-2.5 py-1.5 rounded-xl text-slate-900 dark:text-white hover:bg-white/30 text-xs font-semibold flex items-center gap-1 transition"
            title="Add Liquid Glass Panel"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden md:inline">Glass</span>
          </button>

          <button
            onClick={() => addElement('text')}
            className="px-2.5 py-1.5 rounded-xl text-slate-900 dark:text-white hover:bg-white/30 text-xs font-semibold flex items-center gap-1 transition"
            title="Add Text Element"
          >
            <Type className="w-3.5 h-3.5 text-pink-300" />
            <span className="hidden md:inline">Text</span>
          </button>

          <button
            onClick={() => addElement('shape')}
            className="px-2.5 py-1.5 rounded-xl text-slate-900 dark:text-white hover:bg-white/30 text-xs font-semibold flex items-center gap-1 transition"
            title="Add Shape Element"
          >
            <Square className="w-3.5 h-3.5 text-indigo-300" />
            <span className="hidden md:inline">Shape</span>
          </button>

          <button
            onClick={() => imageInputRef.current?.click()}
            className="px-2.5 py-1.5 rounded-xl text-slate-900 dark:text-white hover:bg-white/30 text-xs font-semibold flex items-center gap-1 transition"
            title="Upload Image"
          >
            <ImageIcon className="w-3.5 h-3.5 text-emerald-300" />
            <span className="hidden md:inline">Image</span>
          </button>

          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handleImageImport}
          />
        </div>

        {/* Center: Duplication & Low-End Mode */}
        <div className="flex items-center gap-1">
          {selectedElementId && (
            <button
              onClick={() => duplicateElement(selectedElementId)}
              className="px-2.5 py-1.5 rounded-xl bg-white/20 text-slate-900 dark:text-white hover:bg-white/30 text-xs font-semibold flex items-center gap-1 transition"
            >
              <Copy className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Duplicate</span>
            </button>
          )}

          <button
            onClick={toggleLowEndMode}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition ${
              isLowEndMode ? 'bg-amber-500 text-white' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isLowEndMode ? '30 FPS' : '60 FPS'}</span>
          </button>
        </div>

        {/* Right: Import / Export Hub */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => exportAsJSON(frames)}
            className="p-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-semibold flex items-center gap-1 transition"
            title="Export Project JSON"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Export JSON</span>
          </button>

          {activeFrame && (
            <>
              <button
                onClick={() => exportAsPNG(activeFrame)}
                className="p-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-semibold flex items-center gap-1 transition"
                title="Export Frame as PNG"
              >
                <Image className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">PNG</span>
              </button>

              <button
                onClick={() => exportAsSVG(activeFrame)}
                className="p-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-semibold flex items-center gap-1 transition"
                title="Export Frame as SVG"
              >
                <FileCode className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">SVG</span>
              </button>
            </>
          )}

          <button
            onClick={() => jsonInputRef.current?.click()}
            className="p-1.5 rounded-xl bg-indigo-500/30 hover:bg-indigo-500/50 text-white text-xs font-semibold flex items-center gap-1 transition"
            title="Import JSON Project"
          >
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Import</span>
          </button>

          <input
            ref={jsonInputRef}
            type="file"
            accept=".json"
            hidden
            onChange={handleJsonImport}
          />
        </div>
      </div>
    </div>
  );
};
