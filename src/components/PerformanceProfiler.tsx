import React, { useEffect, useState } from 'react';
import { useDesignStore } from '../store/designStore';
import { FpsLimiter } from '../utils/fpsLimiter';
import { getPerformanceMetrics, PerfMetrics } from '../utils/performanceMonitor';
import { Activity, Zap, Cpu, HardDrive, ShieldCheck, Gauge } from 'lucide-react';

export const PerformanceProfiler: React.FC = () => {
  const { isLowEndMode, toggleLowEndMode } = useDesignStore();
  const fpsCap = isLowEndMode ? 30 : 60;

  const [metrics, setMetrics] = useState<PerfMetrics>({
    fps: 60,
    frameTimeMs: 4.2,
    domNodeCount: 42,
    estimatedMemoryMb: 14.8,
    bundleSizeKb: 138.4,
  });

  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    let frames = 0;
    let startTime = performance.now();

    const limiter = new FpsLimiter(fpsCap, (now, delta) => {
      frames++;
      if (now - startTime >= 1000) {
        const m = getPerformanceMetrics(frames, now - startTime);
        setMetrics(m);
        frames = 0;
        startTime = now;
      }
    });

    limiter.start();
    return () => limiter.stop();
  }, [fpsCap]);

  const fpsColor = metrics.fps >= 50 ? 'text-emerald-400' : metrics.fps >= 28 ? 'text-amber-400' : 'text-rose-400';

  return (
    <div className="fixed top-20 left-4 z-30 max-w-xs">
      <div className="glass-panel p-3 shadow-xl border border-white/40 backdrop-blur-xl text-white">
        {/* Header HUD Bar */}
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-2 font-bold text-xs text-white hover:text-white/80"
          >
            <Gauge className="w-4 h-4 text-indigo-300" />
            <span>Perf Profiler</span>
            <span className={`font-mono font-black text-sm ${fpsColor}`}>
              {metrics.fps} FPS
            </span>
          </button>

          <button
            onClick={toggleLowEndMode}
            title="Toggle Low-End Device Profile"
            className={`
              px-2 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1 transition-all
              ${
                isLowEndMode
                  ? 'bg-amber-500 text-white shadow-md'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              }
            `}
          >
            <Zap className="w-3.5 h-3.5" />
            {isLowEndMode ? '30 FPS Cap' : '60 FPS Ultra'}
          </button>
        </div>

        {/* Detailed Metrics Breakdown */}
        {expanded && (
          <div className="mt-3 pt-3 border-t border-white/20 space-y-2 text-[11px] animate-in fade-in duration-200 text-white/90">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1 font-medium">
                <Cpu className="w-3.5 h-3.5 text-indigo-300" /> Frame Render Time
              </span>
              <span className="font-mono font-bold text-white">{metrics.frameTimeMs} ms</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1 font-medium">
                <Activity className="w-3.5 h-3.5 text-indigo-300" /> Active DOM Nodes
              </span>
              <span className="font-mono font-bold text-white">{metrics.domNodeCount}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1 font-medium">
                <HardDrive className="w-3.5 h-3.5 text-indigo-300" /> Heap Memory
              </span>
              <span className="font-mono font-bold text-white">{metrics.estimatedMemoryMb} MB</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Bundle Size (&lt;200KB)
              </span>
              <span className="font-mono font-bold text-emerald-300">{metrics.bundleSizeKb} KB</span>
            </div>

            <div className="mt-2 p-2 rounded-xl bg-white/10 border border-white/20 text-[10px] text-white/90 leading-tight">
              <strong>Optimization Active:</strong> {isLowEndMode ? 'Backdrop blur disabled, RAF locked to 30fps for Android 5.0+' : 'Hardware GPU accelerated glass blur & liquid spring motion active.'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
