import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('X-Lumina-Performance-Profile', 'low-end-optimized');

  return res.status(200).json({
    status: 'ok',
    service: 'lumina-ui-framework',
    edgeRegion: process.env.VERCEL_REGION || 'global-edge',
    bundleMetrics: {
      initialChunkKb: 138.4,
      targetTtiMs: 850,
      lighthouseScoreTarget: 95,
    },
  });
}
