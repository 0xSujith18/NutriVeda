@echo off
echo Starting NutriVeda Development Environment...
echo.

echo Checking if Node.js is installed...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js version:
node --version

echo.
echo Installing frontend dependencies...
call npm install

if %errorlevel% neq 0 (
    echo ERROR: Failed to install frontend dependencies
    pause
    exit /b 1
)

echo.
echo Starting backend server...
start "Backend Server" cmd /k "cd backend && npm install && npm run dev"

echo.
echo Waiting for backend to start...
timeout /t 5 /nobreak >nul

echo.
echo Starting frontend development server...
echo.
echo The application will open in your browser at http://localhost:3000
echo Backend API will be available at http://localhost:5000
echo.
echo Press Ctrl+C to stop the development server
echo.

npm run dev

pause