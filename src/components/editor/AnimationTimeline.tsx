import React from 'react';
import { useDesignStore } from '../../store/designStore';
import { Play, Pause, Plus, Film, Clock } from 'lucide-react';

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

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-30 max-w-lg w-[92vw]">
      <div className="glass-panel p-3 shadow-2xl border border-white/40 backdrop-blur-xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-white/20 text-xs">
          <div className="flex items-center gap-2 font-bold text-white">
            <Film className="w-4 h-4 text-pink-300" />
            <span>Animation Timeline ({selectedElement.name})</span>
          </div>
          <div className="flex items-center gap-1 font-mono text-white/80 text-[11px]">
            <Clock className="w-3 h-3 text-amber-300" />
            <span>{currentTimeMs}ms / {animation.duration}ms</span>
          </div>
        </div>

        {/* Timeline Scrubber Track */}
        <div className="py-2 relative">
          <input
            type="range"
            min={0}
            max={animation.duration}
            value={currentTimeMs}
            onChange={(e) => setCurrentTimeMs(Number(e.target.value))}
            className="w-full accent-pink-500 cursor-pointer"
          />

          {/* Keyframe Diamond Markers */}
          <div className="relative w-full h-4 mt-1 bg-black/20 rounded-lg overflow-hidden">
            {animation.keyframes.map((kf: any, i: number) => {
              const posPercent = (kf.time / animation.duration) * 100;
              return (
                <button
                  key={i}
                  onClick={() => setCurrentTimeMs(kf.time)}
                  style={{ left: `${Math.min(95, posPercent)}%` }}
                  className="absolute top-1/2 -translate-y-1/2 text-amber-300 text-xs hover:scale-125 transition font-bold"
                  title={`Keyframe at ${kf.time}ms`}
                >
                  ◆
                </button>
              );
            })}
          </div>
        </div>

        {/* Playback & Action Controls */}
        <div className="flex items-center justify-between pt-1 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePlayToggle}
              className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition ${
                isPlayingAnimation
                  ? 'bg-amber-500 text-white shadow-md'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md'
              }`}
            >
              {isPlayingAnimation ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlayingAnimation ? 'Pause' : 'Play'}</span>
            </button>

            <button
              onClick={() => addKeyframe(selectedElement.id, currentTimeMs)}
              className="px-3 py-1.5 rounded-xl bg-white/20 text-white font-semibold flex items-center gap-1.5 hover:bg-white/30 transition"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-300" />
              <span>+ Keyframe</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-white/80 font-semibold text-[11px]">Duration:</label>
            <input
              type="number"
              step={100}
              min={500}
              max={10000}
              value={animation.duration}
              onChange={(e) =>
                updateElementAnimation(selectedElement.id, { duration: Number(e.target.value) })
              }
              className="w-16 px-2 py-1 rounded-lg bg-black/30 border border-white/30 text-white font-mono text-center text-xs focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
