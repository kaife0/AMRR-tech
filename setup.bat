@echo off
title AMRR Tech Item Manager - Setup

echo 🚀 AMRR Tech Item Manager Setup & Test
echo ======================================

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js (v16 or higher)
    pause
    exit /b 1
)

echo ✅ Node.js is installed
node --version

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed
    pause
    exit /b 1
)

echo ✅ npm is installed
npm --version

REM Install frontend dependencies
echo.
echo 📦 Installing frontend dependencies...
call npm install

REM Install backend dependencies
echo.
echo 📦 Installing backend dependencies...
cd server
call npm install
cd ..

REM Check if .env.local exists
if not exist ".env.local" (
    echo.
    echo 📝 Creating .env.local file...
    echo VITE_WEB3FORMS_ACCESS_KEY=536c9794-b157-41d4-880b-27cc4da87b2f > .env.local
    echo ✅ .env.local created with Web3Forms access key
) else (
    echo ✅ .env.local already exists
)

REM Create necessary directories
echo.
echo 📁 Ensuring directories exist...
if not exist "server\data" mkdir server\data
if not exist "server\uploads" mkdir server\uploads
echo ✅ Directories created

echo.
echo 🎉 Setup complete! Ready to run the application.
echo.
echo To start the application:
echo 1. Backend:  cd server ^&^& npx nodemon src/index.ts
echo 2. Frontend: npm run dev
echo.
echo Features included:
echo ✅ Add/View/Delete items
echo ✅ Image upload and serving
echo ✅ Web3Forms enquiry system
echo ✅ Responsive design
echo ✅ Fallback demo data
echo.
echo Access the app at: http://localhost:5173
echo.
pause
