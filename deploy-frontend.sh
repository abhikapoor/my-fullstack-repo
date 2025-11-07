#!/bin/bash

# --- Configuration ---
USER="root"
HOST="206.189.63.234"
REMOTE_FRONTEND_DIR="/var/www/html"

echo "🚀 Starting frontend deployment..."

# ===============================================
# 0. PREPARE SERVER DIRECTORIES
# ===============================================
echo "Ensuring remote frontend directory exists..."
ssh $USER@$HOST "mkdir -p $REMOTE_FRONTEND_DIR && echo '✅ Frontend directory ready'"

# ===============================================
# 1. BUILD FRONTEND LOCALLY
# ===============================================
echo "Building frontend locally..."
npx nx build frontend --prod

# Copy production config
cp apps/frontend/src/config/config.prod.json dist/apps/frontend/browser/assets/config.json

# ===============================================
# 2. TRANSFER FRONTEND TO SERVER
# ===============================================
echo "Transferring frontend build..."
rsync -avz --delete dist/apps/frontend/browser/ $USER@$HOST:$REMOTE_FRONTEND_DIR

echo "✅ Frontend deployment finished successfully!"
