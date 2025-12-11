#!/bin/bash

set -e

echo "TeenUp LMS - Quick Setup"
echo "=============================="
echo ""

# Check if docker is running
if ! docker info > /dev/null 2>&1; then
  echo "Docker is not running. Please start Docker first."
  exit 1
fi

echo "Docker is running"
echo ""

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
  echo "pnpm is not installed. Installing pnpm..."
  npm install -g pnpm
  echo "pnpm installed successfully"
  echo ""
fi

# Check if bun is installed
if ! command -v bun &> /dev/null; then
  echo "bun is not installed. Please install bun first:"
  echo "Visit: https://bun.sh/"
  echo "Or run: curl -fsSL https://bun.sh/install | bash"
  exit 1
fi

# Install dependencies
echo "Installing backend dependencies..."
cd be && pnpm install && cd ..
echo "Backend dependencies installed"
echo ""

echo "Installing frontend dependencies..."
cd fe && bun install && cd ..
echo "Frontend dependencies installed"
echo ""

if [ ! -f "be/.env.docker" ]; then
  echo "Creating be/.env.docker from example..."
  cp be/.env.docker.example be/.env.docker
  cp be/.env.docker.example be/.env
  echo "be/.env.docker created"
else
  echo "be/.env.docker already exists, skipping..."
fi

if [ ! -f "fe/.env" ]; then
  echo "Creating fe/.env from example..."
  cp fe/.env.example fe/.env
  echo "fe/.env created"
else
  echo "fe/.env already exists, skipping..."
fi

echo ""

# Start Docker containers (backend only, frontend runs separately)
echo "Starting Docker containers (backend services)..."
docker-compose -f docker-compose.dev.yml up -d --build server worker database redis mail

echo ""
echo "Waiting for backend services to be healthy (30 seconds)..."
sleep 30

echo ""

# Run migrations (remove -it flag for non-interactive script)
echo "Running database migrations..."
docker exec teenup-backend-server pnpm migration:up

echo ""

# Seed data
echo "Seeding initial data..."
docker exec teenup-backend-worker pnpm seed:run

echo ""

echo ""
echo "Setup complete!"
echo ""
echo "All services are now running!"
echo ""
echo "Access your application:"
echo "   - Frontend:     http://localhost:3000"
echo "   - Backend API:  http://localhost:8000/api"
echo "   - Swagger Docs: http://localhost:8000/api/docs"
echo "   - MailPit UI:   http://localhost:11080"
echo ""
echo "Useful commands:"
echo "   - View logs:       npm run docker:dev:logs"
echo "   - Stop backend:    npm run docker:dev:down"
echo "   - Backend shell:   npm run be:shell"
echo "   - Database shell:  npm run db:shell"
echo ""
echo "=============================="
echo "Starting frontend development server..."
echo "Press Ctrl+C to stop"
echo "=============================="
echo ""
echo "NOTE: If you're on Windows and this script fails, run these commands manually:"
echo "  cd fe"
echo "  bun install"
echo "  bun run dev"
echo ""

# Start frontend in foreground
cd fe
bun run build && bun run start
