# #!/bin/bash

# # --- Configuration ---
# USER="root"
# HOST="206.189.63.234"
# REMOTE_BACKEND_DIR="/home/app/backend"
# REMOTE_FRONTEND_DIR="/var/www/html"
# echo "Starting Full-Stack Deployment via rsync..."

# # ===============================================
# # 0. PRE-DEPLOYMENT SETUP
# # ===============================================
# echo "Ensuring remote directories exist..."
# ssh $USER@$HOST "mkdir -p $REMOTE_BACKEND_DIR $REMOTE_FRONTEND_DIR $REMOTE_BACKEND_DIR/prisma"

# # ===============================================
# # 1. DEPLOY BACKEND
# # ===============================================
# echo "Deploying backend artifacts (excluding node_modules and prisma)..."
# rsync -avz --delete --exclude='node_modules' --exclude='prisma' dist/apps/backend/ $USER@$HOST:$REMOTE_BACKEND_DIR

# # Copy Prisma schema separately
# echo "Copying schema.prisma to server..."
# rsync -avz apps/backend/src/prisma/schema.prisma $USER@$HOST:$REMOTE_BACKEND_DIR/prisma/

# # ===============================================
# # 2. DEPLOY FRONTEND
# # ===============================================
# echo "Deploying frontend assets..."
# rsync -avz --delete dist/apps/frontend/browser/ $USER@$HOST:$REMOTE_FRONTEND_DIR

# # ===============================================
# # 3. REMOTE SERVER SETUP
# # ===============================================
# echo "Setting permissions, installing dependencies, generating Prisma client, and restarting services..."
# ssh $USER@$HOST << EOF

#   # --- BACKEND SETUP ---
#   cd $REMOTE_BACKEND_DIR

#   # Install production dependencies
#   echo "Installing/updating backend dependencies..."
#   npm install --production

#   # Generate Prisma client on server
#   echo "Generating Prisma client..."
#   npx prisma generate --schema=prisma/schema.prisma

#   # Stop and restart backend with PM2
#   echo "Restarting backend with PM2..."
#   pm2 stop backend || true
#   pm2 start main.js --name backend --time --update-env || true
#   pm2 save

#   # --- FRONTEND / NGINX SETUP ---
#   echo "Setting frontend permissions..."
#   chown -R www-data:www-data $REMOTE_FRONTEND_DIR
#   chmod -R 755 $REMOTE_FRONTEND_DIR

#   echo "Restarting Nginx..."
#   systemctl restart nginx

# EOF

# echo "Deployment complete. Backend with Prisma should now be running."


#!/bin/bash

# --- Configuration ---
USER="root"
HOST="206.189.63.234"
REMOTE_BACKEND_DIR="/home/app/backend"
REMOTE_FRONTEND_DIR="/var/www/html"
REPO_URL="https://github.com/abhikapoor/my-fullstack-repo.git"
BRANCH="main"

echo "Starting deployment..."

# ===============================================
# 0. PREPARE SERVER DIRECTORIES
# ===============================================
ssh $USER@$HOST "mkdir -p $REMOTE_BACKEND_DIR; mkdir -p $REMOTE_FRONTEND_DIR"

# ===============================================
# 1. DEPLOY BACKEND
# ===============================================
ssh $USER@$HOST << EOF
    cd $REMOTE_BACKEND_DIR

    # Load environment variables
    if [ -f ~/.bashrc ]; then source ~/.bashrc; fi
    if [ -f ~/.profile ]; then source ~/.profile; fi
    if [ -f /etc/environment ]; then export \$(grep -v '^#' /etc/environment | xargs); fi
    echo "Environment variables loaded."

    # Clone repo if missing, otherwise reset to latest branch
    if [ ! -d ".git" ]; then
        echo "Cloning repository..."
        git clone -b $BRANCH $REPO_URL .
    else
        echo "Pulling latest changes..."
        git fetch origin
        git reset --hard origin/$BRANCH
    fi

    # Install dependencies
    echo "Installing dependencies..."
    npm install

    # Build backend with Nx
    echo "Building backend..."
    npx nx build backend --prod

    # Generate Prisma client in the build folder
    echo "Generating Prisma client for production..."
    npx prisma generate --schema=apps/backend/src/prisma/schema.prisma

    # Copy generated Prisma client into dist
    mkdir -p dist/apps/backend/prisma
    rsync -avz apps/backend/src/prisma/generated/ dist/apps/backend/prisma/generated/

    # Stop old PM2 process if running
    pm2 stop backend || true

    # Start backend from build folder
    echo "Starting backend via PM2..."
    pm2 start dist/apps/backend/main.js --name backend --time --update-env
    pm2 save
EOF

# ===============================================
# 2. DEPLOY FRONTEND
# ===============================================
echo "Building frontend..."
npx nx build frontend --prod

rsync -avz --delete dist/apps/frontend/browser/ $USER@$REMOTE_FRONTEND_DIR

# ===============================================
# 3. FINAL SERVER SETUP
# ===============================================
ssh $USER@$HOST << EOF
    chown -R www-data:www-data $REMOTE_FRONTEND_DIR
    chmod -R 755 $REMOTE_FRONTEND_DIR
    systemctl restart nginx
EOF

echo "Deployment complete!"

