@echo off
setlocal enabledelayedexpansion

echo TeenUp LMS - Quick Setup (Windows)
echo ==============================
echo.

REM Check if docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo Docker is not running. Please start Docker Desktop first.
    pause
    exit /b 1
)

echo Docker is running
echo.

REM Install dependencies
echo Installing backend dependencies...
cd be
call pnpm install
if errorlevel 1 (
    echo Failed to install backend dependencies. Make sure pnpm is installed.
    pause
    exit /b 1
)
cd ..
echo Backend dependencies installed
echo.

echo Installing frontend dependencies...
cd fe
call bun install
if errorlevel 1 (
    echo Failed to install frontend dependencies. Make sure bun is installed.
    pause
    exit /b 1
)
cd ..
echo Frontend dependencies installed
echo.

REM Copy env files
if not exist "be\.env.docker" (
    echo Creating be\.env.docker from example...
    copy be\.env.docker.example be\.env.docker
    copy be\.env.docker.example be\.env
    echo be\.env.docker created
) else (
    echo be\.env.docker already exists, skipping...
)

if not exist "fe\.env" (
    echo Creating fe\.env from example...
    copy fe\.env.example fe\.env
    echo fe\.env created
) else (
    echo fe\.env already exists, skipping...
)

echo.

REM Start Docker containers
echo Starting Docker containers (backend services)...
docker-compose -f docker-compose.dev.yml up -d --build server worker database redis mail

echo.
echo Waiting for backend services to be healthy (30 seconds)...
timeout /t 30 /nobreak >nul

echo.

REM Run migrations
echo Running database migrations...
docker exec teenup-backend-server pnpm migration:up

echo.

REM Seed data
echo Seeding initial data...
docker exec teenup-backend-worker pnpm seed:run

echo.
echo.
echo Setup complete!
echo.
echo All services are now running!
echo.
echo Access your application:
echo    - Frontend:     http://localhost:3000
echo    - Backend API:  http://localhost:8000/api
echo    - Swagger Docs: http://localhost:8000/api/docs
echo    - MailPit UI:   http://localhost:11080
echo.
echo Useful commands:
echo    - View logs:       npm run docker:dev:logs
echo    - Stop backend:    npm run docker:dev:down
echo    - Backend shell:   npm run be:shell
echo    - Database shell:  npm run db:shell
echo.
echo ==============================
echo Starting frontend development server...
echo Press Ctrl+C to stop
echo ==============================
echo.

REM Start frontend in foreground
cd fe
call bun run build
if errorlevel 1 (
    echo Frontend build failed. Starting dev server instead...
    call bun run dev
) else (
    call bun run start
)
