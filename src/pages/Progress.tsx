import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Droplets, Zap, Scale } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { progressAPI } from '../utils/api';

const Progress: React.FC = () => {
  const { user } = useAuth();
  const [progressData, setProgressData] = useState<any[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState('7');
  const [newEntry, setNewEntry] = useState({
    date: new Date().toISOString().split('T')[0],
    waterIntake: 0,
    calories: 0,
    weight: '',
    mood: 'good' as 'excellent' | 'good' | 'average' | 'poor' | 'terrible',
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProgressData();
  }, [selectedPeriod, user]);

  const loadProgressData = async () => {
    if (!user) return;
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - parseInt(selectedPeriod));
      
      const userId = user._id || user.id;
      if (!userId) return;
      const response = await progressAPI.getProgress(userId, {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      });
      setProgressData(response.data);
    } catch (error) {
      console.error('Failed to load progress data:', error);
      setProgressData([]);
    }
  };

  const logProgress = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const userId = user._id || user.id;
      if (!userId) return;
      await progressAPI.logProgress({
        ...newEntry,
        weight: newEntry.weight ? parseFloat(newEntry.weight) : undefined
      });
      setNewEntry({
        date: new Date().toISOString().split('T')[0],
        waterIntake: 0,
        calories: 0,
        weight: '',
        mood: 'good',
        notes: ''
      });
      loadProgressData();
      alert('Progress logged successfully!');
    } catch (error) {
      alert('Failed to log progress');
    }
    setLoading(false);
  };

  const getAverages = () => {
    if (progressData.length === 0) return { water: 0, calories: 0, weight: 0 };
    
    const totals = progressData.reduce((acc, entry) => ({
      water: acc.water + (entry.waterIntake || 0),
      calories: acc.calories + (entry.calories || 0),
      weight: acc.weight + (entry.weight || 0)
    }), { water: 0, calories: 0, weight: 0 });

    return {
      water: Math.round(totals.water / progressData.length),
      calories: Math.round(totals.calories / progressData.length),
      weight: Math.round((totals.weight / progressData.filter((e: any) => e.weight).length) * 10) / 10 || 0
    };
  };

  const moodEmojis = {
    excellent: '😄',
    good: '😊',
    average: '😐',
    poor: '😞',
    terrible: '😢'
  };

  const averages = getAverages();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Progress Tracker</h1>
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
        >
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 3 months</option>
        </select>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Progress Charts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Overview */}
          <div className="grid md:grid-cols-3 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-md p-6 text-center"
            >
              <Droplets className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-600">{averages.water}ml</p>
              <p className="text-sm text-gray-600">Avg Water Intake</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg shadow-md p-6 text-center"
            >
              <Zap className="w-8 h-8 text-orange-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-orange-600">{averages.calories}</p>
              <p className="text-sm text-gray-600">Avg Calories</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg shadow-md p-6 text-center"
            >
              <Scale className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-purple-600">{averages.weight}kg</p>
              <p className="text-sm text-gray-600">Avg Weight</p>
            </motion.div>
          </div>

          {/* Water & Calories Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h3 className="text-lg font-semibold mb-4">Water Intake & Calories</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tickFormatter={(date) => new Date(date).toLocaleDateString()} />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Line yAxisId="left" type="monotone" dataKey="waterIntake" stroke="#3B82F6" strokeWidth={2} name="Water (ml)" />
                <Line yAxisId="right" type="monotone" dataKey="calories" stroke="#F59E0B" strokeWidth={2} name="Calories" />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Weight Trend */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h3 className="text-lg font-semibold mb-4">Weight Trend</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={progressData.filter((d: any) => d.weight)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tickFormatter={(date) => new Date(date).toLocaleDateString()} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="weight" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Log New Entry */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Calendar className="text-green-600" size={20} />
              Log Today's Progress
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={newEntry.date}
                  onChange={(e) => setNewEntry({...newEntry, date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Water Intake (ml)</label>
                <input
                  type="number"
                  value={newEntry.waterIntake}
                  onChange={(e) => setNewEntry({...newEntry, waterIntake: Number(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Calories</label>
                <input
                  type="number"
                  value={newEntry.calories}
                  onChange={(e) => setNewEntry({...newEntry, calories: Number(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                <input
                  type="number"
                  value={newEntry.weight}
                  onChange={(e) => setNewEntry({...newEntry, weight: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  step="0.1"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mood</label>
                <select
                  value={newEntry.mood}
                  onChange={(e) => setNewEntry({...newEntry, mood: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="excellent">😄 Excellent</option>
                  <option value="good">😊 Good</option>
                  <option value="average">😐 Average</option>
                  <option value="poor">😞 Poor</option>
                  <option value="terrible">😢 Terrible</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={newEntry.notes}
                  onChange={(e) => setNewEntry({...newEntry, notes: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  rows={3}
                  placeholder="How are you feeling today?"
                />
              </div>

              <button
                onClick={logProgress}
                disabled={loading}
                className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? 'Logging...' : 'Log Progress'}
              </button>
            </div>
          </motion.div>

          {/* Recent Entries */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h3 className="text-lg font-semibold mb-4">Recent Entries</h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {progressData.slice(0, 5).map((entry, index) => (
                <div key={index} className="border-l-4 border-green-500 pl-3 py-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{new Date(entry.date).toLocaleDateString()}</span>
                    <span className="text-2xl">{moodEmojis[entry.mood as keyof typeof moodEmojis] || '😊'}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {entry.waterIntake}ml water • {entry.calories} cal
                    {entry.weight && ` • ${entry.weight}kg`}
                  </div>
                  {entry.notes && (
                    <p className="text-sm text-gray-500 mt-1">{entry.notes}</p>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Progress;