# NutriVeda - Ayurvedic Diet Planner

A full-stack web application for personalized Ayurvedic diet planning and wellness tracking.

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Radix UI components
- Framer Motion for animations
- Recharts for data visualization
- React Router DOM for navigation
- Axios for API calls

### Backend
- Node.js with Express.js
- MongoDB with Mongoose ODM
- JWT Authentication
- bcrypt for password hashing
- CORS enabled

## Features

- 🔐 **Authentication**: Secure login/signup with JWT
- 📊 **Dashboard**: Water tracker, progress widgets, nutrition charts
- 🍽️ **Diet Planner**: Personalized meal planning with dosha recommendations
- 🔍 **Food Explorer**: Search foods by dosha, season, and benefits
- 📈 **Progress Tracker**: Log calories, water intake, weight, and mood
- 👤 **Profile Management**: Dosha questionnaire and preferences
- 📱 **Responsive Design**: Mobile-friendly interface

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd NutriVeda-FrontEnd--master
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   
   # Create .env file with your MongoDB URI
   cp .env.example .env
   # Edit .env with your database credentials
   
   # Seed the database with sample data
   node seedData.js
   
   # Start the backend server
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   # From the root directory
   npm install
   
   # Start the development server
   npm run dev
   ```

4. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/nutriveda
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile

### Foods
- `GET /api/foods` - Get all foods (with filters)
- `GET /api/foods/:id` - Get specific food

### Diet Plans
- `GET /api/diet-plans` - Get user's diet plans
- `POST /api/diet-plans` - Create new diet plan
- `PUT /api/diet-plans/:id` - Update diet plan
- `DELETE /api/diet-plans/:id` - Delete diet plan

### Progress
- `POST /api/progress` - Log daily progress
- `GET /api/progress/:userId` - Get progress history

## Database Schema

### User
```javascript
{
  name: String,
  email: String (unique),
  passwordHash: String,
  doshaType: String (Vata|Pitta|Kapha|Mixed),
  preferences: {
    dietaryRestrictions: [String],
    goals: [String]
  }
}
```

### Food
```javascript
{
  name: String,
  category: String,
  doshaEffect: {
    vata: String (increase|decrease|neutral),
    pitta: String (increase|decrease|neutral),
    kapha: String (increase|decrease|neutral)
  },
  season: [String],
  nutrients: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number,
    fiber: Number
  },
  benefits: [String],
  description: String
}
```

## Development

### Frontend Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run test` - Run tests

### Backend Scripts
- `npm run dev` - Start with nodemon
- `npm start` - Start production server

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.