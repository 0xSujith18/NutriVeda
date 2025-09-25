# NutriVeda Setup Guide

## Quick Start (Windows)

1. **Run the application:**
   ```
   double-click start-app.bat
   ```

2. **Seed the database (first time only):**
   ```
   double-click seed-database.bat
   ```

## Manual Setup

### Prerequisites
- Node.js (v16+)
- MongoDB (running on localhost:27017)
- Git

### Installation Steps

1. **Install Dependencies:**
   ```bash
   # Frontend dependencies
   npm install
   
   # Backend dependencies
   cd backend
   npm install
   ```

2. **Environment Setup:**
   - Backend `.env` file is already configured
   - MongoDB URI: `mongodb://localhost:27017/nutriveda`
   - JWT Secret is set

3. **Database Setup:**
   ```bash
   cd backend
   node seedDataComprehensive.js
   ```

4. **Start Services:**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev
   
   # Terminal 2 - Frontend
   npm run dev
   ```

## Application URLs
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Features Fixed
- ✅ Complete Food Explorer with 81+ Indian foods
- ✅ Security vulnerabilities patched
- ✅ Authorization checks added
- ✅ Input validation and sanitization
- ✅ Error handling improvements
- ✅ Performance optimizations
- ✅ Null safety checks
- ✅ Database pagination

## Test Credentials
Create an account through the signup page or use the application normally.

## Troubleshooting
- Ensure MongoDB is running before starting the backend
- Check that ports 3000 and 5000 are available
- Run `npm install` if you encounter dependency issues