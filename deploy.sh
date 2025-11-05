#!/bin/bash

# --- Configuration (UPDATE THESE) ---
# NOTE: If you are not using 'root', ensure your user has sudo permissions for systemctl/chown.
USER="root"
HOST="206.189.63.234"
REMOTE_BACKEND_DIR="/home/app/backend" # Directory for your NestJS application
REMOTE_FRONTEND_DIR="/var/www/html"    # Directory for your Angular assets (Nginx root)

echo "Starting Full-Stack Deployment via rsync..."

# ===============================================
# 0. PRE-DEPLOYMENT SETUP 
# ===============================================

echo "Ensuring remote directories exist..."
# CRITICAL: Creates the target directories if they are missing
ssh $USER@$HOST "mkdir -p $REMOTE_BACKEND_DIR; mkdir -p $REMOTE_FRONTEND_DIR"

# ===============================================
# 1. DEPLOY BACKEND (NestJS/Node.js)
# ===============================================

echo "Deploying backend artifacts (preserving node_modules)..."
# --exclude='node_modules': Prevents rsync from deleting the node_modules folder on the server.
rsync -avz --delete --exclude='node_modules' dist/apps/backend/ $USER@$HOST:$REMOTE_BACKEND_DIR

# ===============================================
# 2. DEPLOY FRONTEND (Angular Assets)
# ===============================================

echo "Deploying frontend assets..."
# Ensures only the contents of the 'browser' build folder are copied to Nginx root.
rsync -avz --delete dist/apps/frontend/browser/ $USER@$HOST:$REMOTE_FRONTEND_DIR

# ===============================================
# 3. REMOTE SERVER SETUP (Automated Execution)
# ===============================================

echo "Setting permissions, installing dependencies, and restarting services on remote server..."
ssh $USER@$HOST << EOF
    
    # 3a. BACKEND SETUP (INSTALL & START)
    
    # Change directory to the newly deployed backend files
    cd $REMOTE_BACKEND_DIR
    
    # Re-install/Update dependencies (CRITICAL STEP)
    echo "Installing or updating backend node dependencies..."
    npm install --production
    
    # Stop and restart the backend process via PM2
    echo "Restarting backend with PM2..."
    pm2 stop backend || true
    pm2 start main.js --name backend --time --update-env || true
    pm2 save
    
    # 3b. FRONTEND & NGINX SETUP
    
    # Set correct Nginx ownership for the web root (fixes 403 Forbidden)
    echo "Setting Nginx permissions..."
    chown -R www-data:www-data $REMOTE_FRONTEND_DIR
    chmod -R 755 $REMOTE_FRONTEND_DIR
    
    # Restart Nginx to serve the new frontend files and use the updated API proxy
    echo "Restarting Nginx..."
    systemctl restart nginx
EOF

echo "Deployment complete. Check your IP address to view the running application."