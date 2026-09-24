/**
 * FPS Limiter Utility for Low-End Mobile Hardware
 * Standard requestAnimationFrame runs at 60fps/120fps.
 * On low-end Android Go / older devices, locking to 30fps prevents thermal throttling & stuttering.
 */

export class FpsLimiter {
  private targetFps: number;
  private intervalMs: number;
  private lastFrameTime: number = 0;
  private animFrameId: number | null = null;
  private callback: (timestamp: number, delta: number) => void;

  constructor(targetFps: number = 60, callback: (timestamp: number, delta: number) => void) {
    this.targetFps = targetFps;
    this.intervalMs = 1000 / targetFps;
    this.callback = callback;
  }

  public setFps(targetFps: number) {
    this.targetFps = targetFps;
    this.intervalMs = 1000 / targetFps;
  }

  public start() {
    if (this.animFrameId !== null) return;
    this.lastFrameTime = performance.now();
    const loop = (now: number) => {
      const elapsed = now - this.lastFrameTime;

      if (elapsed >= this.intervalMs) {
        // Adjust lastFrameTime for potential frame rate drift
        this.lastFrameTime = now - (elapsed % this.intervalMs);
        this.callback(now, elapsed);
      }

      this.animFrameId = requestAnimationFrame(loop);
    };

    this.animFrameId = requestAnimationFrame(loop);
  }

  public stop() {
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
  }
}
