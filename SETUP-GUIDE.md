# NutriVeda - Hi-Tech Setup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher) - [Download here](https://nodejs.org/)
- MongoDB (local or cloud) - [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

### Automated Setup (Recommended)
1. **Run the automated setup script:**
   ```bash
   # Double-click on start-dev.bat (Windows)
   # Or run in command prompt:
   start-dev.bat
   ```

### Manual Setup

#### 1. Backend Setup
```bash
cd backend
npm install

# Create .env file
copy .env.example .env
# Edit .env with your MongoDB URI and JWT secret

# Seed the database
node seedData.js

# Start backend server
npm run dev
```

#### 2. Frontend Setup
```bash
# From root directory
npm install

# Start development server
npm run dev
```

#### 3. Environment Variables
Create `backend/.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/nutriveda
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
NODE_ENV=development
```

## 🎨 New Hi-Tech Features

### Modern Design Elements
- **Glassmorphism UI**: Translucent cards with backdrop blur effects
- **Gradient Animations**: Dynamic color transitions and hover effects
- **Interactive Particles**: Mouse-following background animations
- **Smooth Transitions**: Framer Motion powered animations
- **Dark Theme**: Modern dark interface with neon accents

### Enhanced Dashboard
- **Real-time Stats**: Live updating metrics and progress tracking
- **AI Insights**: Intelligent recommendations based on user data
- **Interactive Charts**: Advanced data visualization with Recharts
- **Quick Actions**: One-click meal logging and water tracking
- **Achievement System**: Gamified wellness milestones

### Advanced Navigation
- **Collapsible Sidebar**: Space-efficient navigation with smooth animations
- **Active State Indicators**: Visual feedback for current page
- **User Profile Integration**: Personalized sidebar with dosha information
- **Gradient Icons**: Color-coded navigation with hover effects

## 🔧 Troubleshooting

### Blank Page Issues
1. **Check Console**: Open browser DevTools (F12) and look for errors
2. **Verify Backend**: Ensure backend is running on http://localhost:5000
3. **Clear Cache**: Hard refresh (Ctrl+Shift+R) or clear browser cache
4. **Check Network**: Verify API calls are reaching the backend

### Common Fixes
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Reset database
cd backend
node seedData.js
```

### Port Conflicts
If ports 3000 or 5000 are in use:
```bash
# Frontend (change in package.json or use different port)
npm run dev -- --port 3001

# Backend (change PORT in .env file)
PORT=5001
```

## 🌟 Key Improvements

### Performance
- **Lazy Loading**: Components load on demand
- **Optimized Animations**: Hardware-accelerated transitions
- **Efficient State Management**: Reduced re-renders
- **Image Optimization**: Compressed assets and lazy loading

### User Experience
- **Responsive Design**: Perfect on all screen sizes
- **Accessibility**: WCAG compliant with keyboard navigation
- **Loading States**: Smooth loading animations
- **Error Handling**: Graceful error recovery

### Developer Experience
- **TypeScript**: Full type safety
- **ESLint**: Code quality enforcement
- **Prettier**: Consistent code formatting
- **Hot Reload**: Instant development feedback

## 📱 Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🎯 Usage Tips

### First Time Setup
1. Complete the dosha questionnaire in your profile
2. Set your daily goals (water, calories, etc.)
3. Explore the food database to understand dosha effects
4. Start logging your meals and track progress

### Best Practices
- Log meals immediately after eating
- Update water intake throughout the day
- Check AI insights for personalized recommendations
- Review weekly progress charts for trends

## 🆘 Support

If you encounter any issues:
1. Check this guide first
2. Look at browser console for errors
3. Verify all dependencies are installed
4. Ensure MongoDB is running
5. Check network connectivity

## 🔄 Updates

The application now features:
- Modern hi-tech design with glassmorphism effects
- Enhanced animations and micro-interactions
- Improved data visualization
- Better mobile responsiveness
- Advanced AI-powered insights

Enjoy your enhanced NutriVeda experience! 🌿✨