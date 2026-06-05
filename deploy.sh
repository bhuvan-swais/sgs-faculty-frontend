#!/bin/bash
# ─── SGS Faculty Frontend — Deployment Script ──────────────────────────────
# Builds Next.js standalone and cleans up to minimize disk usage

set -e

echo "🚀 Starting frontend deployment..."

# 1. Pull latest code
echo "📥 Pulling latest code..."
git pull origin main

# 2. Install dependencies
echo "📦 Installing dependencies..."
npm install --prefer-offline --no-audit --no-fund

# 3. Build (standalone output)
echo "🔨 Building Next.js app..."
npm run build

# 4. Copy static assets into standalone folder
echo "📂 Preparing standalone build..."
cp -r public .next/standalone/public
cp -r .next/static .next/standalone/.next/static

# 5. Clean up heavy folders (saves ~500MB)
echo "🧹 Cleaning up..."
rm -rf node_modules
rm -rf .next/cache

# 6. Clean npm cache
npm cache clean --force 2>/dev/null || true

# 7. Restart PM2 process
echo "⚙️  Restarting PM2..."
pm2 describe sgs-faculty-frontend > /dev/null 2>&1 \
  && pm2 restart sgs-faculty-frontend \
  || PORT=4002 pm2 start "node .next/standalone/server.js" --name "sgs-faculty-frontend"

pm2 save

echo "✅ Frontend deployed successfully!"
echo "   Running on: http://localhost:4002"
