import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Droplets, Target, Zap, Brain, Heart, 
  Activity, Sparkles,
  Sun, Moon, Coffee, Apple
} from 'lucide-react';
import { ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area, RadialBarChart, RadialBar } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { progressAPI } from '../utils/api';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [waterIntake, setWaterIntake] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedMetric, setSelectedMetric] = useState('calories');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (user) {
      setIsLoading(false);
    }
  }, [user]);

  const doshaData = [
    { name: 'Vata', value: 30, fill: '#16a34a' },
    { name: 'Pitta', value: 45, fill: '#22c55e' },
    { name: 'Kapha', value: 25, fill: '#4ade80' }
  ];

  const weeklyData = [
    { day: 'Mon', calories: 1850, water: 1800, mood: 8, weight: 70 },
    { day: 'Tue', calories: 1920, water: 2100, mood: 7, weight: 69.8 },
    { day: 'Wed', calories: 1780, water: 1900, mood: 9, weight: 69.7 },
    { day: 'Thu', calories: 2050, water: 2200, mood: 8, weight: 69.5 },
    { day: 'Fri', calories: 1890, water: 2000, mood: 8, weight: 69.4 },
    { day: 'Sat', calories: 2100, water: 1700, mood: 7, weight: 69.6 },
    { day: 'Sun', calories: 1950, water: 2300, mood: 9, weight: 69.3 }
  ];

  const quickActions = [
    { icon: <Coffee className="w-5 h-5" />, label: 'Log Meal', color: 'from-green-500 to-green-600' },
    { icon: <Droplets className="w-5 h-5" />, label: 'Add Water', color: 'from-green-400 to-green-500' },
    { icon: <Activity className="w-5 h-5" />, label: 'Log Exercise', color: 'from-green-600 to-green-700' },
    { icon: <Heart className="w-5 h-5" />, label: 'Mood Check', color: 'from-green-300 to-green-400' }
  ];



  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return { text: 'Good Morning', icon: <Sun className="w-6 h-6 text-green-500" /> };
    if (hour < 17) return { text: 'Good Afternoon', icon: <Sun className="w-6 h-6 text-green-600" /> };
    return { text: 'Good Evening', icon: <Moon className="w-6 h-6 text-green-700" /> };
  };

  const greeting = getGreeting();

  const addWater = (amount: number) => {
    const previousIntake = waterIntake;
    const newIntake = waterIntake + amount;
    setWaterIntake(newIntake);
    
    if (user) {
      const userId = user._id || user.id;
      if (userId) {
        progressAPI.logProgress({
          waterIntake: newIntake,
          date: new Date().toISOString()
        }).catch(error => {
          const errorMessage = error?.response?.data?.message || 'Failed to log water intake';
          console.error('Failed to log water intake:', errorMessage);
          setWaterIntake(previousIntake);
        });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your wellness dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="relative z-10 p-6 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              {greeting.icon}
              <div>
                <h1 className="text-4xl font-bold text-gray-900">
                  {greeting.text}, {user?.name}!
                </h1>
                <p className="text-gray-600 mt-1">Ready to continue your wellness journey?</p>
              </div>
            </div>
          </div>
          <div className="text-right bg-white rounded-2xl p-4 border border-green-100 shadow-sm">
            <p className="text-sm text-gray-500">Today</p>
            <p className="text-lg font-semibold text-gray-900">{currentTime.toLocaleDateString()}</p>
            <p className="text-sm text-green-600">{currentTime.toLocaleTimeString()}</p>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {quickActions.map((action, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className={`bg-gradient-to-r ${action.color} p-4 rounded-2xl text-white font-semibold flex items-center space-x-3 hover:shadow-lg transition-all duration-300`}
            >
              {action.icon}
              <span className="text-sm">{action.label}</span>
            </motion.button>
          ))}
        </motion.div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Water Tracker */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white border border-green-100 rounded-2xl p-6 hover:shadow-lg hover:border-green-200 transition-all duration-300 group"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Droplets className="text-green-600" size={24} />
                </div>
                <h3 className="font-semibold text-gray-900">Hydration</h3>
              </div>
              <Sparkles className="w-5 h-5 text-green-500 opacity-60" />
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">
                {waterIntake}ml
              </div>
              <div className="text-sm text-gray-500 mb-6">Goal: 2000ml</div>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                <div 
                  className="bg-green-500 h-3 rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min((waterIntake / 2000) * 100, 100)}%` }}
                ></div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => addWater(250)}
                  className="flex-1 bg-green-50 border border-green-200 text-green-700 py-2 px-3 rounded-lg text-sm hover:bg-green-100 transition-all"
                >
                  +250ml
                </button>
                <button
                  onClick={() => addWater(500)}
                  className="flex-1 bg-green-50 border border-green-200 text-green-700 py-2 px-3 rounded-lg text-sm hover:bg-green-100 transition-all"
                >
                  +500ml
                </button>
              </div>
            </div>
          </motion.div>

          {/* Daily Goals */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white border border-green-100 rounded-2xl p-6 hover:shadow-lg hover:border-green-200 transition-all duration-300 group"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Target className="text-green-600" size={24} />
              </div>
              <h3 className="font-semibold text-gray-900">Daily Goals</h3>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Calories</span>
                  <span className="text-sm font-medium text-gray-900">1,850 / 2,000</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '92.5%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Protein</span>
                  <span className="text-sm font-medium text-gray-900">45g / 60g</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-400 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Fiber</span>
                  <span className="text-sm font-medium text-gray-900">28g / 35g</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '80%' }}></div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Dosha Balance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white border border-green-100 rounded-2xl p-6 hover:shadow-lg hover:border-green-200 transition-all duration-300 group"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Brain className="text-green-600" size={24} />
              </div>
              <h3 className="font-semibold text-gray-900">Dosha Balance</h3>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {user?.doshaType || 'Not Set'}
              </div>
              <div className="text-sm text-gray-500 mb-4">Primary Constitution</div>
              <ResponsiveContainer width="100%" height={120}>
                <RadialBarChart cx="50%" cy="50%" innerRadius="30%" outerRadius="90%" data={doshaData}>
                  <RadialBar dataKey="value" cornerRadius={10} fill="#16a34a" />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* AI Insights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white border border-green-100 rounded-2xl p-6 hover:shadow-lg hover:border-green-200 transition-all duration-300 group"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Zap className="text-green-600" size={24} />
              </div>
              <h3 className="font-semibold text-gray-900">AI Insights</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Energy Level</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-medium text-green-600">High</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Mood Score</span>
                <span className="font-medium text-gray-900">8.5/10</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Sleep Quality</span>
                <span className="font-medium text-green-600">Good</span>
              </div>
              <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-xs text-green-700">💡 Consider adding more leafy greens to balance your Pitta dosha</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Progress Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white border border-green-100 rounded-2xl p-6 hover:shadow-lg hover:border-green-200 transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Weekly Progress</h3>
            <div className="flex space-x-2">
              {['calories', 'water', 'mood', 'weight'].map((metric) => (
                <button
                  key={metric}
                  onClick={() => setSelectedMetric(metric)}
                  className={`px-3 py-1 rounded-lg text-sm capitalize transition-all ${
                    selectedMetric === metric
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {metric}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={weeklyData}>
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#16a34a" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#16a34a" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="day" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #d1d5db',
                  borderRadius: '12px',
                  color: '#374151'
                }} 
              />
              <Area 
                type="monotone" 
                dataKey={selectedMetric} 
                stroke="#16a34a" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorGradient)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;