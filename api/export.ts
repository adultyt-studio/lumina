import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sampleExport = {
    framework: 'Lumina Glassmorphism Framework v1.0',
    timestamp: new Date().toISOString(),
    specifications: {
      targetDevices: 'Android 5.0+ / iOS 11+',
      glassOpacity: 0.8,
      backdropBlurPx: 10,
      borderRadiusPx: 24,
      bounceEasing: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
      gzippedBundleKb: 138.4,
    },
    canvas: {
      nodesCount: 3,
      status: 'ready_for_vercel_deployment',
    },
  };

  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
  return res.status(200).json(sampleExport);
}
