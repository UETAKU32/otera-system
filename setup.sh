#!/bin/bash

# backendディレクトリの処理
echo "Starting backend services..."
cd backend || exit
docker compose up -d
npx prisma migrate dev
npx prisma studio &
npm run dev &
cd ..

# frontendディレクトリの処理
echo "Starting frontend services..."
cd frontend || exit
npm run dev &
cd ..

echo "All services started successfully!"