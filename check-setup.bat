@echo off
echo Checking NutriVeda Setup...
echo.

echo 1. Checking Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js not found. Please install Node.js first.
    pause
    exit /b 1
) else (
    echo ✓ Node.js is installed
)

echo.
echo 2. Checking if backend dependencies are installed...
cd backend
if not exist node_modules (
    echo Installing backend dependencies...
    npm install
) else (
    echo ✓ Backend dependencies are installed
)

echo.
echo 3. Checking if frontend dependencies are installed...
cd ..
if not exist node_modules (
    echo Installing frontend dependencies...
    npm install
) else (
    echo ✓ Frontend dependencies are installed
)

echo.
echo 4. Checking MongoDB connection...
cd backend
node -e "const mongoose = require('mongoose'); mongoose.connect('mongodb://localhost:27017/nutriveda').then(() => { console.log('✓ MongoDB connection successful'); process.exit(0); }).catch((err) => { console.log('✗ MongoDB connection failed:', err.message); process.exit(1); });" 2>nul
if %errorlevel% neq 0 (
    echo WARNING: MongoDB connection failed. Make sure MongoDB is running.
    echo You can start MongoDB with: mongod --dbpath "C:\data\db"
) else (
    echo ✓ MongoDB is accessible
)

echo.
echo Setup check complete!
echo.
echo To start the application:
echo 1. Make sure MongoDB is running
echo 2. Run start-app.bat
echo.
pause