@echo off
echo Starting NutriVeda Frontend Only (for debugging)...
echo.

echo Installing dependencies if needed...
if not exist node_modules (
    echo Installing frontend dependencies...
    npm install
)

echo.
echo Starting frontend development server...
echo Frontend will be available at: http://localhost:3000
echo.
echo Note: Backend features will not work without the backend server running.
echo.

npm run dev

pause