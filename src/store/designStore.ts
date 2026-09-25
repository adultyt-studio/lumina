import { create } from 'zustand';
import type { Frame, DesignElement, ElementType, AnimationConfig, Keyframe } from '../types/design';

interface DesignState {
  frames: Frame[];
  activeFrameId: string;
  selectedElementId: string | null;
  zoom: number;
  isLowEndMode: boolean;
  isPlayingAnimation: boolean;
  currentTimeMs: number;

  // Frame Actions
  addFrame: (frame?: Partial<Frame>) => void;
  duplicateFrame: (id: string) => void;
  deleteFrame: (id: string) => void;
  updateFrame: (id: string, updates: Partial<Frame>) => void;
  setActiveFrame: (id: string) => void;

  // Element Actions
  addElement: (type: ElementType, customProps?: Partial<DesignElement>) => void;
  duplicateElement: (elementId: string) => void;
  deleteElement: (elementId: string) => void;
  updateElement: (elementId: string, updates: Partial<DesignElement>) => void;
  reorderElement: (sourceId: string, targetId: string) => void;
  toggleLock: (elementId: string) => void;
  setSelectedElement: (elementId: string | null) => void;

  // Animation Actions
  updateElementAnimation: (elementId: string, animation: Partial<AnimationConfig>) => void;
  addKeyframe: (elementId: string, time: number) => void;
  setIsPlayingAnimation: (playing: boolean) => void;
  setCurrentTimeMs: (timeMs: number) => void;

  // Global Engine Actions
  setZoom: (zoom: number) => void;
  toggleLowEndMode: () => void;
  loadProjectData: (frames: Frame[]) => void;
}

const initialFrames: Frame[] = [
  {
    id: 'frame-1',
    name: 'Mobile Canvas',
    x: 40,
    y: 30,
    width: 375,
    height: 667,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    visible: true,
    elements: [
      {
        id: 'el-1',
        type: 'glass-panel',
        name: 'Liquid Hero Panel',
        x: 24,
        y: 40,
        width: 327,
        height: 180,
        rotation: 0,
        opacity: 0.9,
        locked: false,
        zIndex: 1,
        blurAmount: 16,
        glassOpacity: 25,
        cornerRadius: 24,
        borderColor: 'rgba(255, 255, 255, 0.4)',
        borderWidth: 1,
        shadowIntensity: 20,
        liquidEffect: true,
        content: 'Figma-Inspired Liquid Design',
      },
      {
        id: 'el-2',
        type: 'text',
        name: 'Header Title',
        x: 44,
        y: 250,
        width: 280,
        height: 50,
        rotation: 0,
        opacity: 1,
        locked: false,
        zIndex: 2,
        content: 'Lumina Studio v2.0',
        fontFamily: 'Plus Jakarta Sans',
        fontSize: 24,
        fontWeight: 700,
        color: '#ffffff',
        textAlign: 'left',
        lineHeight: 1.2,
        letterSpacing: 0,
      },
      {
        id: 'el-3',
        type: 'shape',
        name: 'Glow Orb Shape',
        x: 44,
        y: 320,
        width: 287,
        height: 120,
        rotation: 0,
        opacity: 0.85,
        locked: false,
        zIndex: 3,
        shapeType: 'rectangle',
        fillColor: 'rgba(99, 102, 241, 0.3)',
        strokeColor: 'rgba(255, 255, 255, 0.5)',
        strokeWidth: 1,
        borderRadius: 20,
        gradient: {
          type: 'linear',
          colors: ['rgba(124, 58, 237, 0.6)', 'rgba(219, 39, 119, 0.4)'],
          angle: 135,
        },
      },
    ],
  },
];

export const useDesignStore = create<DesignState>((set) => ({
  frames: initialFrames,
  activeFrameId: 'frame-1',
  selectedElementId: 'el-1',
  zoom: 1.0,
  isLowEndMode: false,
  isPlayingAnimation: false,
  currentTimeMs: 0,

  addFrame: (custom) =>
    set((state) => {
      const id = `frame-${Date.now()}`;
      const newFrame: Frame = {
        id,
        name: custom?.name || `Frame ${state.frames.length + 1}`,
        x: (state.frames.length * 400) + 40,
        y: 30,
        width: custom?.width || 375,
        height: custom?.height || 667,
        backgroundColor: custom?.backgroundColor || 'rgba(255, 255, 255, 0.15)',
        visible: true,
        elements: [],
      };
      return {
        frames: [...state.frames, newFrame],
        activeFrameId: id,
      };
    }),

  duplicateFrame: (id) =>
    set((state) => {
      const original = state.frames.find((f) => f.id === id);
      if (!original) return state;
      const copy: Frame = {
        ...JSON.parse(JSON.stringify(original)),
        id: `frame-${Date.now()}`,
        name: `${original.name} Copy`,
        x: original.x + 400,
      };
      return {
        frames: [...state.frames, copy],
        activeFrameId: copy.id,
      };
    }),

  deleteFrame: (id) =>
    set((state) => {
      const filtered = state.frames.filter((f) => f.id !== id);
      return {
        frames: filtered,
        activeFrameId: filtered[0]?.id || '',
      };
    }),

  updateFrame: (id, updates) =>
    set((state) => ({
      frames: state.frames.map((f) => (f.id === id ? { ...f, ...updates } : f)),
    })),

  setActiveFrame: (id) => set({ activeFrameId: id }),

  addElement: (type, customProps) =>
    set((state) => {
      const frame = state.frames.find((f) => f.id === state.activeFrameId) || state.frames[0];
      if (!frame) return state;

      const elementId = `el-${Date.now()}`;
      let created: DesignElement;

      const base = {
        id: elementId,
        type,
        name: customProps?.name || `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
        x: customProps?.x ?? 30,
        y: customProps?.y ?? 30,
        width: customProps?.width ?? 160,
        height: customProps?.height ?? 100,
        rotation: customProps?.rotation ?? 0,
        opacity: customProps?.opacity ?? 1,
        locked: false,
        zIndex: frame.elements.length + 1,
      };

      if (type === 'glass-panel') {
        created = {
          ...base,
          type: 'glass-panel',
          blurAmount: 12,
          glassOpacity: 20,
          cornerRadius: 24,
          borderColor: 'rgba(255, 255, 255, 0.4)',
          borderWidth: 1,
          shadowIntensity: 15,
          liquidEffect: true,
          content: 'Liquid Glass Panel',
        };
      } else if (type === 'text') {
        created = {
          ...base,
          type: 'text',
          content: 'Text Element',
          fontFamily: 'Plus Jakarta Sans',
          fontSize: 18,
          fontWeight: 600,
          color: '#ffffff',
          textAlign: 'left',
          lineHeight: 1.3,
          letterSpacing: 0,
        };
      } else if (type === 'image') {
        created = {
          ...base,
          type: 'image',
          src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80',
          objectFit: 'cover',
          borderRadius: 16,
          filter: 'none',
        };
      } else {
        created = {
          ...base,
          type: 'shape',
          shapeType: 'rectangle',
          fillColor: 'rgba(99, 102, 241, 0.5)',
          strokeColor: 'rgba(255, 255, 255, 0.6)',
          strokeWidth: 1,
          borderRadius: 16,
        };
      }

      const updatedFrames = state.frames.map((f) =>
        f.id === frame.id ? { ...f, elements: [...f.elements, created] } : f
      );

      return {
        frames: updatedFrames,
        selectedElementId: elementId,
      };
    }),

  duplicateElement: (elementId) =>
    set((state) => {
      const updatedFrames = state.frames.map((frame) => {
        const el = frame.elements.find((e) => e.id === elementId);
        if (!el) return frame;
        const copy: DesignElement = {
          ...JSON.parse(JSON.stringify(el)),
          id: `el-${Date.now()}`,
          name: `${el.name} Copy`,
          x: el.x + 20,
          y: el.y + 20,
          zIndex: frame.elements.length + 1,
        };
        return { ...frame, elements: [...frame.elements, copy] };
      });
      return { frames: updatedFrames };
    }),

  deleteElement: (elementId) =>
    set((state) => ({
      frames: state.frames.map((f) => ({
        ...f,
        elements: f.elements.filter((e) => e.id !== elementId),
      })),
      selectedElementId: state.selectedElementId === elementId ? null : state.selectedElementId,
    })),

  updateElement: (elementId, updates) =>
    set((state) => ({
      frames: state.frames.map((f) => ({
        ...f,
        elements: f.elements.map((e) => (e.id === elementId ? { ...e, ...updates } as DesignElement : e)),
      })),
    })),

  reorderElement: (sourceId, targetId) =>
    set((state) => {
      const updatedFrames = state.frames.map((frame) => {
        const sourceIdx = frame.elements.findIndex((e) => e.id === sourceId);
        const targetIdx = frame.elements.findIndex((e) => e.id === targetId);
        if (sourceIdx === -1 || targetIdx === -1) return frame;

        const newElements = [...frame.elements];
        const [moved] = newElements.splice(sourceIdx, 1);
        newElements.splice(targetIdx, 0, moved);

        // Reassign zIndex
        newElements.forEach((el, i) => {
          el.zIndex = i + 1;
        });

        return { ...frame, elements: newElements };
      });
      return { frames: updatedFrames };
    }),

  toggleLock: (elementId) =>
    set((state) => ({
      frames: state.frames.map((f) => ({
        ...f,
        elements: f.elements.map((e) => (e.id === elementId ? { ...e, locked: !e.locked } : e)),
      })),
    })),

  setSelectedElement: (elementId) => set({ selectedElementId: elementId }),

  updateElementAnimation: (elementId, animUpdates) =>
    set((state) => ({
      frames: state.frames.map((f) => ({
        ...f,
        elements: f.elements.map((e) => {
          if (e.id !== elementId) return e;
          const currentAnim = e.animation || {
            id: `anim-${Date.now()}`,
            name: 'Transform Motion',
            duration: 1500,
            keyframes: [],
            loop: true,
            delay: 0,
            fillMode: 'both',
          };
          return {
            ...e,
            animation: { ...currentAnim, ...animUpdates },
          };
        }),
      })),
    })),

  addKeyframe: (elementId, time) =>
    set((state) => {
      const updatedFrames = state.frames.map((f) => ({
        ...f,
        elements: f.elements.map((e) => {
          if (e.id !== elementId) return e;
          const currentAnim = e.animation || {
            id: `anim-${Date.now()}`,
            name: 'Transform Motion',
            duration: 1500,
            keyframes: [],
            loop: true,
            delay: 0,
            fillMode: 'both',
          };
          const newKeyframe: Keyframe = {
            time,
            properties: { x: e.x, y: e.y, width: e.width, height: e.height, rotation: e.rotation, opacity: e.opacity },
            easing: 'ease-in-out',
          };
          return {
            ...e,
            animation: {
              ...currentAnim,
              keyframes: [...currentAnim.keyframes.filter((k) => k.time !== time), newKeyframe].sort(
                (a, b) => a.time - b.time
              ),
            },
          };
        }),
      }));
      return { frames: updatedFrames };
    }),

  setIsPlayingAnimation: (playing) => set({ isPlayingAnimation: playing }),
  setCurrentTimeMs: (timeMs) => set({ currentTimeMs: timeMs }),

  setZoom: (zoom) => set({ zoom: Math.min(Math.max(zoom, 0.4), 2.5) }),
  toggleLowEndMode: () => set((state) => ({ isLowEndMode: !state.isLowEndMode })),
  loadProjectData: (frames) =>
    set({
      frames,
      activeFrameId: frames[0]?.id || '',
      selectedElementId: null,
    }),
}));
