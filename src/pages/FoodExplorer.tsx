import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Leaf } from 'lucide-react';
import { foodAPI } from '../utils/api';
import { Food } from '../types';

const FoodExplorer: React.FC = () => {
  const [foods, setFoods] = useState<Food[]>([]);
  const [filteredFoods, setFilteredFoods] = useState<Food[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDosha, setSelectedDosha] = useState('');
  const [selectedSeason, setSelectedSeason] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFoods();
  }, []);

  useEffect(() => {
    filterFoods();
  }, [foods, searchTerm, selectedCategory, selectedDosha, selectedSeason]);

  const loadFoods = async () => {
    try {
      // Always load CSV data
      const csvData = await loadCSVData();
      setFoods(csvData);
    } catch (error) {
      console.error('Failed to load foods:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCSVData = async () => {
    try {
      // Load both CSV files
      const [response1, response2] = await Promise.all([
        fetch('/indian_foods_500.csv'),
        fetch('/2indian_foods_spices_500.csv')
      ]);
      
      const [csv1Text, csv2Text] = await Promise.all([
        response1.text(),
        response2.text()
      ]);
      
      // Parse CSV data
      const { parseCSVData, convertToFoodFormat } = await import('../utils/csvParser');
      const foods1 = parseCSVData(csv1Text);
      const foods2 = parseCSVData(csv2Text);
      
      // Combine and convert to food format
      const allCSVFoods = [...foods1, ...foods2];
      const convertedFoods = convertToFoodFormat(allCSVFoods);
      
      // Remove duplicates based on name
      const uniqueFoods = convertedFoods.filter((food, index, self) => 
        index === self.findIndex(f => f.name.toLowerCase() === food.name.toLowerCase())
      );
      
      return uniqueFoods;
    } catch (error) {
      console.error('Failed to load CSV data:', error);
      return [];
    }
  };

  const filterFoods = () => {
    let filtered = foods;

    if (searchTerm) {
      filtered = filtered.filter(food =>
        food.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        food.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(food => food.category === selectedCategory);
    }

    if (selectedDosha) {
      filtered = filtered.filter(food => 
        food.doshaEffect[selectedDosha as keyof typeof food.doshaEffect] === 'decrease'
      );
    }

    if (selectedSeason) {
      filtered = filtered.filter(food => food.season.includes(selectedSeason));
    }

    setFilteredFoods(filtered);
  };

  const getDoshaColor = (effect: string) => {
    switch (effect) {
      case 'increase': return 'text-red-500';
      case 'decrease': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  const getDoshaIcon = (effect: string) => {
    switch (effect) {
      case 'increase': return '↑';
      case 'decrease': return '↓';
      default: return '→';
    }
  };

  const categories = [...new Set(foods.map(food => food.category))];
  const seasons = [...new Set(foods.flatMap(food => food.season))];

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading foods...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Food Explorer</h1>
        <p className="text-gray-600">Discover Ayurvedic foods and their effects on your dosha</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search foods..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          <select
            value={selectedDosha}
            onChange={(e) => setSelectedDosha(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          >
            <option value="">All Doshas</option>
            <option value="vata">Good for Vata</option>
            <option value="pitta">Good for Pitta</option>
            <option value="kapha">Good for Kapha</option>
          </select>

          <select
            value={selectedSeason}
            onChange={(e) => setSelectedSeason(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          >
            <option value="">All Seasons</option>
            {seasons.map(season => (
              <option key={season} value={season}>{season}</option>
            ))}
          </select>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {filteredFoods.length} of {foods.length} foods
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('');
              setSelectedDosha('');
              setSelectedSeason('');
            }}
            className="text-sm text-green-600 hover:text-green-700"
          >
            Clear filters
          </button>
        </div>
      </div>

      {/* Food Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFoods.map((food, index) => (
          <motion.div
            key={food._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900">{food.name}</h3>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                  {food.category}
                </span>
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{food.description}</p>

              {/* Nutrition Info */}
              <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                <div className="bg-gray-50 p-2 rounded">
                  <span className="text-gray-500">Calories:</span>
                  <span className="font-medium ml-1">{food.nutrients?.calories || 0}</span>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <span className="text-gray-500">Protein:</span>
                  <span className="font-medium ml-1">{food.nutrients?.protein || 0}g</span>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <span className="text-gray-500">Carbs:</span>
                  <span className="font-medium ml-1">{food.nutrients?.carbs || 0}g</span>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <span className="text-gray-500">Fat:</span>
                  <span className="font-medium ml-1">{food.nutrients?.fat || 0}g</span>
                </div>
              </div>

              {/* Dosha Effects */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Dosha Effects:</h4>
                <div className="flex space-x-4 text-sm">
                  <div className="flex items-center">
                    <span className="text-gray-600">Vata:</span>
                    <span className={`ml-1 font-medium ${getDoshaColor(food.doshaEffect?.vata || 'neutral')}`}>
                      {getDoshaIcon(food.doshaEffect?.vata || 'neutral')}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-600">Pitta:</span>
                    <span className={`ml-1 font-medium ${getDoshaColor(food.doshaEffect?.pitta || 'neutral')}`}>
                      {getDoshaIcon(food.doshaEffect?.pitta || 'neutral')}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-600">Kapha:</span>
                    <span className={`ml-1 font-medium ${getDoshaColor(food.doshaEffect?.kapha || 'neutral')}`}>
                      {getDoshaIcon(food.doshaEffect?.kapha || 'neutral')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Benefits */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Benefits:</h4>
                <div className="flex flex-wrap gap-1">
                  {(food.benefits || []).slice(0, 3).map((benefit, idx) => (
                    <span
                      key={idx}
                      className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                    >
                      {benefit}
                    </span>
                  ))}
                  {(food.benefits?.length || 0) > 3 && (
                    <span className="text-xs text-gray-500">+{(food.benefits?.length || 0) - 3} more</span>
                  )}
                </div>
              </div>

              {/* Season */}
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-600">
                  <Leaf size={14} className="mr-1" />
                  <span>Best in: {food.season?.join(', ') || 'All seasons'}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredFoods.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search size={48} className="mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No foods found</h3>
          <p className="text-gray-600">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};

export default FoodExplorer;