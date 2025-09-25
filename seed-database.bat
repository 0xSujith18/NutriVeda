@echo off
echo Seeding NutriVeda Database with Comprehensive Food Data...
echo.

cd backend

echo Running comprehensive seed script...
node seedDataComprehensive.js

echo.
echo Database seeding completed!
echo Press any key to exit...
pause >nul