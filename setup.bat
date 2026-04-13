@echo off
REM Setup script for Windows

echo 🚀 Setting up Equipment Rental E-Commerce Website...

REM Check prerequisites
echo 📋 Checking prerequisites...

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js not found. Please install Node.js 20+
    exit /b 1
)

echo ✅ Prerequisites check passed

REM Install dependencies
echo 📦 Installing dependencies...
call npm run install:all

echo 📝 Setting up environment...

REM Create backend .env if not exists
if not exist "apps\backend\demo\.env" (
    echo Creating apps\backend\demo\.env from .env.example...
    copy "apps\backend\demo\.env.example" "apps\backend\demo\.env"
    echo ✅ .env created. Please edit it with your configuration
) else (
    echo ✅ .env already exists
)

REM Create frontend .env if not exists
if not exist "apps\frontend\.env" (
    echo Creating apps\frontend\.env...
    (
        echo VITE_API_URL=http://localhost:8080
    ) > "apps\frontend\.env"
    echo ✅ Frontend .env created
)

echo.
echo ✅ Setup complete!
echo.
echo 📌 Next steps:
echo 1. Edit apps\backend\demo\.env with your database credentials
echo 2. Create MySQL database: CREATE DATABASE demo_db;
echo 3. Run 'npm run dev' to start development servers
echo 4. Or run 'docker-compose up -d' to start with Docker
echo.
echo Links:
echo   Backend API: http://localhost:8080
echo   Frontend: http://localhost:5173
echo   Swagger UI: http://localhost:8080/swagger-ui.html
