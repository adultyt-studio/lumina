import React, { useState } from 'react';
import { useDesignStore } from '../../store/designStore';
import type { Frame, DesignElement, GlassPanelElement, TextElement, ShapeElement, ImageElement } from '../../types/design';
import { Sparkles, CheckCircle2, Lock, Copy, Trash2, Move } from 'lucide-react';

export const Canvas: React.FC = () => {
  const {
    frames,
    activeFrameId,
    setActiveFrame,
    duplicateFrame,
    deleteFrame,
    updateFrame,
    selectedElementId,
    setSelectedElement,
    updateElement,
    zoom,
    isLowEndMode,
    isPlayingAnimation,
    currentTimeMs,
  } = useDesignStore();

  // Element Dragging State
  const [draggingElId, setDraggingElId] = useState<string | null>(null);
  const [dragElOffset, setDragElOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Frame Dragging State
  const [draggingFrameId, setDraggingFrameId] = useState<string | null>(null);
  const [dragFrameOffset, setDragFrameOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Handle Element Drag Start
  const handleElementPointerDown = (e: React.PointerEvent, frameId: string, element: DesignElement) => {
    e.stopPropagation();
    setActiveFrame(frameId);
    if (element.locked) return;

    setSelectedElement(element.id);
    setDraggingElId(element.id);
    setDragElOffset({
      x: e.clientX - element.x,
      y: e.clientY - element.y,
    });
  };

  // Handle Frame Drag Start
  const handleFramePointerDown = (e: React.PointerEvent, frame: Frame) => {
    e.stopPropagation();
    setActiveFrame(frame.id);
    setDraggingFrameId(frame.id);
    setDragFrameOffset({
      x: e.clientX - frame.x,
      y: e.clientY - frame.y,
    });
  };

  // Global Pointer Move Handler
  const handlePointerMove = (e: React.PointerEvent) => {
    // Handle Element Dragging
    if (draggingElId) {
      updateElement(draggingElId, {
        x: Math.max(0, Math.round(e.clientX - dragElOffset.x)),
        y: Math.max(0, Math.round(e.clientY - dragElOffset.y)),
      });
      return;
    }

    // Handle Frame Dragging
    if (draggingFrameId) {
      updateFrame(draggingFrameId, {
        x: Math.round(e.clientX - dragFrameOffset.x),
        y: Math.round(e.clientY - dragFrameOffset.y),
      });
    }
  };

  const handlePointerUp = () => {
    setDraggingElId(null);
    setDraggingFrameId(null);
  };

  return (
    <div
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onClick={() => setSelectedElement(null)}
      className="relative w-full h-[calc(100vh-4rem)] overflow-auto pt-16 px-8 touch-none select-none scrollbar-none"
    >
      {/* Background Dot Grid */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)',
          backgroundSize: `${24 * zoom}px ${24 * zoom}px`,
        }}
      />

      {/* Scalable & Movable Multi-Frame Workspace */}
      <div
        style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}
        className="w-full h-full relative"
      >
        {frames.map((frame) => {
          const isActiveFrame = activeFrameId === frame.id;

          return (
            <div
              key={frame.id}
              onClick={(e) => {
                e.stopPropagation();
                setActiveFrame(frame.id);
              }}
              style={{
                position: 'absolute',
                left: `${frame.x}px`,
                top: `${frame.y}px`,
                width: `${frame.width}px`,
                height: `${frame.height}px`,
                backgroundColor: frame.backgroundColor,
              }}
              className={`
                rounded-3xl shadow-2xl transition-shadow duration-300 backdrop-blur-xl border border-white/30 overflow-visible
                ${isActiveFrame ? 'ring-4 ring-indigo-500/80 ring-offset-4 ring-offset-transparent' : 'hover:border-white/60'}
              `}
            >
              {/* Draggable Frame Header & Actions */}
              <div
                onPointerDown={(e) => handleFramePointerDown(e, frame)}
                className="absolute -top-10 left-0 right-0 z-30 flex items-center justify-between gap-2 px-2 py-1 cursor-grab active:cursor-grabbing bg-slate-900/80 backdrop-blur-md rounded-2xl border border-white/30 text-white text-xs shadow-lg"
              >
                <div className="flex items-center gap-1.5 font-bold">
                  <Move className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{frame.name}</span>
                  <span className="text-[10px] text-white/60 font-mono">({frame.width}×{frame.height})</span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      duplicateFrame(frame.id);
                    }}
                    className="px-2 py-0.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-[10px] flex items-center gap-1 transition"
                    title="Duplicate Frame"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Duplicate</span>
                  </button>

                  {frames.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteFrame(frame.id);
                      }}
                      className="p-1 rounded-lg hover:bg-rose-500/30 text-rose-300 transition"
                      title="Delete Frame"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Elements inside Frame */}
              <div className="w-full h-full relative overflow-hidden rounded-3xl">
                {frame.elements.map((el) => {
                  const isSelected = selectedElementId === el.id;

                  // Animation Keyframe Interpolation
                  let interpolatedX = el.x;
                  let interpolatedY = el.y;
                  let interpolatedOpacity = el.opacity;

                  if (isPlayingAnimation && el.animation && el.animation.keyframes.length > 0) {
                    const kfs = el.animation.keyframes;
                    const currentKf = kfs.reduce((prev, curr) => (curr.time <= currentTimeMs ? curr : prev), kfs[0]);
                    if (currentKf && currentKf.properties) {
                      if (currentKf.properties.x !== undefined) interpolatedX = currentKf.properties.x;
                      if (currentKf.properties.y !== undefined) interpolatedY = currentKf.properties.y;
                      if (currentKf.properties.opacity !== undefined) interpolatedOpacity = currentKf.properties.opacity;
                    }
                  }

                  const elementStyle: React.CSSProperties = {
                    position: 'absolute',
                    left: `${interpolatedX}px`,
                    top: `${interpolatedY}px`,
                    width: `${el.width}px`,
                    height: `${el.height}px`,
                    transform: `rotate(${el.rotation || 0}deg)`,
                    opacity: interpolatedOpacity,
                    zIndex: el.zIndex,
                  };

                  return (
                    <div
                      key={el.id}
                      style={elementStyle}
                      onPointerDown={(e) => handleElementPointerDown(e, frame.id, el)}
                      className={`
                        cursor-grab active:cursor-grabbing transition-shadow
                        ${isSelected ? 'ring-2 ring-amber-300 ring-offset-2 ring-offset-transparent shadow-2xl scale-[1.01]' : ''}
                      `}
                    >
                      {/* Render Glass Panel */}
                      {el.type === 'glass-panel' && (
                        <div
                          style={{
                            width: '100%',
                            height: '100%',
                            borderRadius: `${(el as GlassPanelElement).cornerRadius}px`,
                            backdropFilter: isLowEndMode ? 'none' : `blur(${(el as GlassPanelElement).blurAmount}px)`,
                            WebkitBackdropFilter: isLowEndMode ? 'none' : `blur(${(el as GlassPanelElement).blurAmount}px)`,
                            backgroundColor: `rgba(255, 255, 255, ${(el as GlassPanelElement).glassOpacity / 100})`,
                            border: `${(el as GlassPanelElement).borderWidth}px solid ${(el as GlassPanelElement).borderColor}`,
                          }}
                          className={`
                            glass-panel p-4 flex flex-col justify-between
                            ${(el as GlassPanelElement).liquidEffect && !isLowEndMode ? 'liquid-glass' : ''}
                          `}
                        >
                          <div className="flex items-center justify-between text-xs font-bold text-white drop-shadow">
                            <span className="flex items-center gap-1">
                              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                              {el.name}
                            </span>
                            {el.locked && <Lock className="w-3 h-3 text-amber-300" />}
                          </div>
                          <p className="text-xs text-white/90 font-medium drop-shadow-sm">
                            {(el as GlassPanelElement).content || 'Liquid Glass'}
                          </p>
                        </div>
                      )}

                      {/* Render Text Element */}
                      {el.type === 'text' && (
                        <div
                          style={{
                            fontFamily: (el as TextElement).fontFamily,
                            fontSize: `${(el as TextElement).fontSize}px`,
                            fontWeight: (el as TextElement).fontWeight,
                            color: (el as TextElement).color,
                            textAlign: (el as TextElement).textAlign,
                            lineHeight: (el as TextElement).lineHeight,
                          }}
                          className="w-full h-full drop-shadow-md overflow-hidden whitespace-pre-wrap select-none"
                        >
                          {(el as TextElement).content}
                        </div>
                      )}

                      {/* Render Shape Element */}
                      {el.type === 'shape' && (
                        <div
                          style={{
                            width: '100%',
                            height: '100%',
                            backgroundColor: (el as ShapeElement).fillColor,
                            border: `${(el as ShapeElement).strokeWidth}px solid ${(el as ShapeElement).strokeColor}`,
                            borderRadius:
                              (el as ShapeElement).shapeType === 'circle'
                                ? '50%'
                                : `${(el as ShapeElement).borderRadius || 16}px`,
                            background: (el as ShapeElement).gradient
                              ? `linear-gradient(${(el as ShapeElement).gradient?.angle}deg, ${(el as ShapeElement).gradient?.colors.join(', ')})`
                              : (el as ShapeElement).fillColor,
                          }}
                          className="shadow-xl"
                        />
                      )}

                      {/* Render Image Element */}
                      {el.type === 'image' && (
                        <img
                          src={(el as ImageElement).src}
                          alt={el.name}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: (el as ImageElement).objectFit,
                            borderRadius: `${(el as ImageElement).borderRadius}px`,
                          }}
                          className="shadow-xl pointer-events-none"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
