import { create } from 'zustand';

export type ToolType = 'select' | 'frame' | 'card' | 'shape' | 'text' | 'liquid';

export interface GlassNode {
  id: string;
  type: ToolType;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  opacity: number;
  blur: number;
  borderRadius: number;
  color: string;
  content?: string;
  elevation: number;
  visible: boolean;
}

interface LuminaState {
  // Canvas & Node Management
  nodes: GlassNode[];
  selectedNodeId: string | null;
  activeTool: ToolType;
  zoom: number;

  // Performance Engine State
  isLowEndMode: boolean;
  fpsCap: 30 | 60;
  currentFps: number;
  renderTimeMs: number;
  darkMode: boolean;

  // Actions
  setActiveTool: (tool: ToolType) => void;
  selectNode: (id: string | null) => void;
  addNode: (node: Partial<GlassNode>) => void;
  updateNode: (id: string, updates: Partial<GlassNode>) => void;
  deleteNode: (id: string) => void;
  setZoom: (zoom: number) => void;
  toggleLowEndMode: () => void;
  setFpsCap: (cap: 30 | 60) => void;
  updatePerformanceStats: (fps: number, renderTimeMs: number) => void;
  toggleDarkMode: () => void;
  resetCanvas: () => void;
}

const initialNodes: GlassNode[] = [
  {
    id: 'node-1',
    type: 'liquid',
    name: 'Liquid Hero Panel',
    x: 20,
    y: 20,
    width: 320,
    height: 180,
    opacity: 0.8,
    blur: 10,
    borderRadius: 24,
    color: 'rgba(255, 255, 255, 0.8)',
    content: 'Figma-Inspired Liquid UI',
    elevation: 2,
    visible: true,
  },
  {
    id: 'node-2',
    type: 'card',
    name: 'Frosted Glass Widget',
    x: 20,
    y: 220,
    width: 150,
    height: 140,
    opacity: 0.85,
    blur: 12,
    borderRadius: 24,
    color: 'rgba(240, 246, 255, 0.85)',
    content: 'Low-End Optimized',
    elevation: 1,
    visible: true,
  },
  {
    id: 'node-3',
    type: 'shape',
    name: 'Glass Prism Orb',
    x: 190,
    y: 220,
    width: 150,
    height: 140,
    opacity: 0.75,
    blur: 8,
    borderRadius: 24,
    color: 'rgba(236, 253, 245, 0.8)',
    content: '60 FPS Motion',
    elevation: 3,
    visible: true,
  },
];

export const useLuminaStore = create<LuminaState>((set) => ({
  nodes: initialNodes,
  selectedNodeId: 'node-1',
  activeTool: 'select',
  zoom: 1.0,

  isLowEndMode: false,
  fpsCap: 60,
  currentFps: 60,
  renderTimeMs: 4.2,
  darkMode: false,

  setActiveTool: (tool) => set({ activeTool: tool }),
  selectNode: (id) => set({ selectedNodeId: id }),
  
  addNode: (newNode) =>
    set((state) => {
      const id = `node-${Date.now()}`;
      const created: GlassNode = {
        id,
        type: newNode.type || 'card',
        name: newNode.name || `New ${newNode.type || 'Element'}`,
        x: newNode.x ?? 40,
        y: newNode.y ?? 40,
        width: newNode.width ?? 160,
        height: newNode.height ?? 120,
        opacity: newNode.opacity ?? 0.8,
        blur: newNode.blur ?? 10,
        borderRadius: newNode.borderRadius ?? 24,
        color: newNode.color || 'rgba(255, 255, 255, 0.8)',
        content: newNode.content || 'Glass Component',
        elevation: newNode.elevation ?? 1,
        visible: true,
      };
      return {
        nodes: [...state.nodes, created],
        selectedNodeId: id,
      };
    }),

  updateNode: (id, updates) =>
    set((state) => ({
      nodes: state.nodes.map((n) => (n.id === id ? { ...n, ...updates } : n)),
    })),

  deleteNode: (id) =>
    set((state) => ({
      nodes: state.nodes.filter((n) => n.id !== id),
      selectedNodeId: state.selectedNodeId === id ? null : state.selectedNodeId,
    })),

  setZoom: (zoom) => set({ zoom: Math.min(Math.max(zoom, 0.5), 2.0) }),

  toggleLowEndMode: () =>
    set((state) => {
      const newLowEnd = !state.isLowEndMode;
      return {
        isLowEndMode: newLowEnd,
        fpsCap: newLowEnd ? 30 : 60,
      };
    }),

  setFpsCap: (cap) => set({ fpsCap: cap }),

  updatePerformanceStats: (fps, renderTimeMs) =>
    set({ currentFps: fps, renderTimeMs }),

  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),

  resetCanvas: () => set({ nodes: initialNodes, selectedNodeId: 'node-1' }),
}));
