# 🚀 Local Project Setup Guide

## 1. Prerequisites

Before starting, ensure you have the following installed:

- **Node.js & npm:** (We assume a modern version of Node.js is installed.)

- **Docker:** Required for running the local PostgreSQL database (recommended method).

## 2. Initial Setup

### Step 2.1: Install Dependencies

First, install all necessary node modules for the entire workspace:

`npm install`

### Step 2.2: Configure Environment

You must configure the database connection string.

1. Navigate to the backend configuration directory: `apps/backend/src/prisma/`

2. Create a file named **`.env`** (if it doesn't exist).

3. Update the `DATABASE_URL` within this file to match your local setup.

If you use the recommended Docker approach (see Step 2.3), the following URL should be used:

`DATABASE_URL="postgresql://postgres:password@localhost:5432/my_project_db?schema=public"`

### Step 2.3: Start the Database (Docker Recommended)

We recommend using the pre-built Docker image for consistency and data persistence.

1. **Build the Docker image** (only required the first time):

`npm run db:build`

2. **Start the container:**

`npm run db:start`

_(Note: This command uses the container name `my-postgres` and maps port `5432`.)_

### Step 2.4: Generate Prisma Client

Before using Prisma in the backend code, you need to generate the TypeScript client based on your schema:

`npm run prisma:generate:backend`

### Step 2.5: Initialize Schema and Seed Data

Run the setup script, which will push the schema to the database (`db:migrate`) and populate it with initial data (`db:seed`):

`npm run db:setup`

## 3. Running the Applications

With the database running and initialized, you can start the application services.

### Step 3.1: Start Backend API

Before starting the backend please add the secrets `JWT_SECRET` and `NODE_ENV` to .env file isndie `apps/backend/src/prisma/`

Run the backend service in development mode:
`npm run backend`

The API server should typically be available at `http://localhost:3000` (or similar).

### Step 3.2: Start Frontend UI

Open a new terminal window and start the frontend application:

`npm run frontend`
