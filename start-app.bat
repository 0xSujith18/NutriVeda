@echo off
echo Starting NutriVeda Application...
echo.

echo Checking if MongoDB is running...
tasklist /FI "IMAGENAME eq mongod.exe" 2>NUL | find /I /N "mongod.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo MongoDB is already running.
) else (
    echo Starting MongoDB...
    start "MongoDB" mongod --dbpath "C:\data\db"
    timeout /t 3 >nul
)

echo.
echo Starting Backend Server...
cd backend
start "Backend" cmd /k "npm run dev"

echo.
echo Waiting for backend to start...
timeout /t 5 >nul

echo.
echo Starting Frontend Development Server...
cd ..
start "Frontend" cmd /k "npm run dev"

echo.
echo Application is starting up...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Press any key to exit...
pause >nul