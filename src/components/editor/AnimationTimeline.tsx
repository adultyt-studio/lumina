import React, { useState } from 'react';
import { useDesignStore } from '../../store/designStore';
import { Play, Pause, Plus, Film, Clock, RotateCcw, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

export const AnimationTimeline: React.FC = () => {
  const {
    frames,
    selectedElementId,
    isPlayingAnimation,
    setIsPlayingAnimation,
    currentTimeMs,
    setCurrentTimeMs,
    addKeyframe,
    updateElementAnimation,
  } = useDesignStore();

  const [isExpanded, setIsExpanded] = useState(true);

  let selectedElement: any = null;
  for (const frame of frames) {
    const found = frame.elements.find((e) => e.id === selectedElementId);
    if (found) {
      selectedElement = found;
      break;
    }
  }

  if (!selectedElement) {
    return null;
  }

  const animation = selectedElement.animation || {
    duration: 1500,
    keyframes: [],
    loop: true,
  };

  const handlePlayToggle = () => {
    if (isPlayingAnimation) {
      setIsPlayingAnimation(false);
      return;
    }

    setIsPlayingAnimation(true);
    let start: number | null = null;
    const duration = animation.duration || 1500;

    const animateLoop = (timestamp: number) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;

      if (elapsed >= duration) {
        if (animation.loop) {
          start = timestamp;
          setCurrentTimeMs(0);
          requestAnimationFrame(animateLoop);
        } else {
          setIsPlayingAnimation(false);
          setCurrentTimeMs(0);
        }
        return;
      }

      setCurrentTimeMs(Math.round(elapsed));
      requestAnimationFrame(animateLoop);
    };

    requestAnimationFrame(animateLoop);
  };

  // Generate timeline ticks (every 250ms)
  const ticksCount = 6;
  const tickInterval = Math.round(animation.duration / ticksCount);
  const ticks = Array.from({ length: ticksCount + 1 }, (_, i) => i * tickInterval);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/90 backdrop-blur-2xl border-t border-white/20 text-white shadow-2xl transition-all duration-300 select-none">
      {/* Timeline Dock Header */}
      <div className="px-4 py-2 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 font-extrabold text-xs text-white">
            <Film className="w-4 h-4 text-pink-400" />
            <span>Timeline Editor</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-pink-500/20 text-pink-300 border border-pink-500/30">
              {selectedElement.name}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-[11px] text-white/70 font-mono">
            <Clock className="w-3.5 h-3.5 text-amber-300" />
            <span>
              {currentTimeMs}ms / {animation.duration}ms
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded-lg text-white/70 hover:bg-white/20 transition flex items-center gap-1 text-xs font-semibold"
          >
            <span>{isExpanded ? 'Collapse Timeline' : 'Expand Timeline'}</span>
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Full Width Motion Scrubber & Keyframe Track */}
      {isExpanded && (
        <div className="px-6 py-4 flex flex-col md:flex-row items-stretch gap-6">
          {/* Controls Bar */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handlePlayToggle}
              className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg transition active:scale-95 ${
                isPlayingAnimation
                  ? 'bg-amber-500 text-white'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white border border-white/30'
              }`}
            >
              {isPlayingAnimation ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isPlayingAnimation ? 'Pause' : 'Play Motion'}</span>
            </button>

            <button
              onClick={() => addKeyframe(selectedElement.id, currentTimeMs)}
              className="px-3.5 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-semibold text-xs border border-emerald-500/40 flex items-center gap-1.5 transition active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add Keyframe</span>
            </button>

            <div className="flex items-center gap-1.5 text-xs text-white/80">
              <label className="font-semibold text-[11px]">Duration (ms):</label>
              <input
                type="number"
                step={100}
                min={500}
                max={10000}
                value={animation.duration}
                onChange={(e) =>
                  updateElementAnimation(selectedElement.id, { duration: Number(e.target.value) })
                }
                className="w-20 px-2 py-1 rounded-lg bg-black/40 border border-white/30 font-mono text-center text-xs text-white focus:outline-none"
              />
            </div>
          </div>

          {/* Timeline Track Ruler & Keyframe Markers */}
          <div className="flex-1 flex flex-col justify-center gap-2">
            {/* Scrubber Input Bar */}
            <div className="relative w-full">
              <input
                type="range"
                min={0}
                max={animation.duration}
                value={currentTimeMs}
                onChange={(e) => setCurrentTimeMs(Number(e.target.value))}
                className="w-full accent-pink-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />

              {/* Ticks Scale Labels */}
              <div className="flex justify-between text-[10px] text-white/50 font-mono pt-1">
                {ticks.map((t, idx) => (
                  <span key={idx}>{t}ms</span>
                ))}
              </div>
            </div>

            {/* Keyframe Diamonds Track */}
            <div className="relative w-full h-7 bg-white/5 rounded-xl border border-white/10 flex items-center overflow-hidden">
              {/* Keyframe Markers */}
              {animation.keyframes.map((kf: any, i: number) => {
                const posPercent = (kf.time / animation.duration) * 100;
                return (
                  <button
                    key={i}
                    onClick={() => setCurrentTimeMs(kf.time)}
                    style={{ left: `${Math.min(97, posPercent)}%` }}
                    className="absolute -translate-x-1/2 p-1 text-amber-300 text-sm hover:scale-150 transition font-bold drop-shadow-md"
                    title={`Keyframe at ${kf.time}ms (x:${kf.properties?.x}, y:${kf.properties?.y})`}
                  >
                    ◆
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
