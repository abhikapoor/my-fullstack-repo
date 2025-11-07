#!/bin/bash

# --- Configuration ---
USER="root"
HOST="206.189.63.234"
REMOTE_BACKEND_DIR="/home/app/backend"

echo "🚀 Starting backend deployment..."

# ===============================================
# 0. PREPARE SERVER DIRECTORIES
# ===============================================
echo "Ensuring remote backend directories exist..."
ssh $USER@$HOST "mkdir -p $REMOTE_BACKEND_DIR && mkdir -p $REMOTE_BACKEND_DIR/prisma && echo '✅ Backend directories ready'"

# ===============================================
# 1. BUILD BACKEND LOCALLY
# ===============================================
echo "Building backend locally..."
npx nx build backend --prod

# ===============================================
# 2. TRANSFER BACKEND TO SERVER
# ===============================================
echo "Transferring backend build..."
rsync -avz --delete dist/apps/backend/ $USER@$HOST:$REMOTE_BACKEND_DIR

echo "Transferring Prisma schema..."
rsync -avz apps/backend/src/prisma/schema.prisma $USER@$HOST:$REMOTE_BACKEND_DIR/prisma/ --rsync-path="mkdir -p $REMOTE_BACKEND_DIR/prisma && rsync"

# ===============================================
# 3. REMOTE SERVER SETUP
# ===============================================
ssh $USER@$HOST << EOF
    cd $REMOTE_BACKEND_DIR

    echo "Installing production dependencies..."
    npm install --production

    echo "Generating Prisma client..."
    npx prisma generate --schema=prisma/schema.prisma

    echo "Restarting backend with PM2..."
    pm2 delete backend || true
    pm2 start main.js --name backend --update-env
    pm2 save
EOF

echo "✅ Backend deployment finished successfully!"
