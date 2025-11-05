pipeline {
    agent any

    environment {
        // Server paths on the droplet
        FRONTEND_DIR = "/home/ubuntu/frontend"
        BACKEND_DIR  = "/home/ubuntu/backend"
        SHARED_DIR   = "/home/ubuntu/libs/shared"

        NODE_VERSION = "20"
        // Env variables already set on the server
    }

    stages {

        stage('Checkout') {
            steps {
                echo 'Cloning GitHub repository with necessary history depth...'
                // *** FIX APPLIED HERE: Add depth: 2 to ensure HEAD~1 is available ***
                git url: 'https://github.com/abhikapoor/my-fullstack-repo.git', branch: 'main', depth: 2
            }
        }

        stage('Install Dependencies') {
            steps {
                echo "Installing dependencies..."
                sh 'npm ci'
            }
        }

        stage('Determine Changes') {
            steps {
                script {
                    // This command is now guaranteed to work because the clone depth is 2
                    def changes = sh(
                        script: "git diff --name-only HEAD~1 HEAD",
                        returnStdout: true
                    ).trim().split("\\n")

                    // Check if frontend changed
                    env.BUILD_FRONTEND = changes.any { it.startsWith('apps/frontend') || it.startsWith('libs/shared') } ? 'true' : 'false'
                    // Check if backend changed
                    env.BUILD_BACKEND  = changes.any { it.startsWith('apps/backend') || it.startsWith('libs/shared') } ? 'true' : 'false'

                    echo "Frontend build needed: ${env.BUILD_FRONTEND}"
                    echo "Backend build needed: ${env.BUILD_BACKEND}"
                }
            }
        }

        stage('Build Shared Library') {
            when {
                expression { return env.BUILD_FRONTEND == 'true' || env.BUILD_BACKEND == 'true' }
            }
            steps {
                echo "Building shared library..."
                sh 'npx nx build shared'
            }
        }

        stage('Build Frontend') {
            when {
                expression { return env.BUILD_FRONTEND == 'true' }
            }
            steps {
                echo "Building frontend..."
                sh 'npx nx build frontend'
            }
        }

        stage('Build Backend') {
            when {
                expression { return env.BUILD_BACKEND == 'true' }
            }
            steps {
                echo "Building backend..."
                sh 'npx nx build backend'
            }
        }

        stage('Run Seed') {
            when {
                expression { return env.BUILD_BACKEND == 'true' }
            }
            steps {
                echo "Running seed.ts..."
                sh 'node dist/apps/backend/seed.js'
            }
        }

        stage('Deploy Frontend') {
            when {
                expression { return env.BUILD_FRONTEND == 'true' }
            }
            steps {
                echo "Deploying frontend to Nginx..."
                // NOTE: Using 'sh' with multiple lines can be prone to issues;
                // I've kept your original format, but ensure your shell executes these commands correctly.
                sh """
                    sudo rm -rf /var/www/html/*
                    sudo cp -r dist/apps/frontend/* /var/www/html/
                    sudo systemctl restart nginx
                """
            }
        }

        stage('Deploy Backend') {
            when {
                expression { return env.BUILD_BACKEND == 'true' }
            }
            steps {
                echo "Deploying backend with PM2..."
                sh """
                    pm2 stop backend || true
                    pm2 start dist/apps/backend/main.js --name backend
                    pm2 save
                """
            }
        }
    }

    post {
        success {
            echo 'Deployment completed successfully!'
        }
        failure {
            echo 'Deployment failed. Check logs!'
        }
    }
}