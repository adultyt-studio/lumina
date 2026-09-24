# Lumina UI - Vercel Deployment Guide

## Quick Deployment Commands

Run the following commands in your terminal inside `C:\Users\HP\.gemini\antigravity\scratch\lumina`:

### Option A: Deploy via Vercel CLI (Recommended)

```bash
# 1. Install Vercel CLI globally (if not already installed)
npm install -g vercel

# 2. Login to your Vercel account
vercel login

# 3. Deploy Preview Build
vercel

# 4. Deploy directly to Production
vercel --prod
```

---

### Option B: Deploy via GitHub / Git Integration

1. Initialize git in the project root:
   ```bash
   git init
   git add .
   git commit -m "Initial Lumina UI framework release"
   ```
2. Push repository to GitHub/GitLab.
3. Import the repository in [Vercel Dashboard](https://vercel.com/new).
4. Vercel will automatically detect Vite and use `vercel.json` settings!

---

## Pre-Configured Vercel Settings
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Base Route**: `/`
- **Edge API Routes**: `/api/export`, `/api/health`
- **Cache Headers**: Immutable caching for `/assets/`, zero-stale for app bundle.
