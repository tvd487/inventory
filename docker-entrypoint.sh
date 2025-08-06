#!/bin/sh
set -e

# Wait for MySQL to be ready
until nc -z -w 2 "db" "3306"; do
  echo "Waiting for MySQL at db:3306..."
  sleep 2
done

# Generate Prisma client
npm run db:generate
# Push schema to DB
npm run db:push
# Seed database
npm run db:seed

# Start the app
exec npm start
