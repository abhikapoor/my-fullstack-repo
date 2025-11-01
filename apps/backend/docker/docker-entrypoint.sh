#!/bin/sh
set -e

until pg_isready -h $DB_HOST -p 5432; do
  sleep 1
done

echo "Applying Prisma schema and seeding..."
npm run db:setup

echo "Database is ready!"
