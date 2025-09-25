import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Plus, Trash2, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { dietPlanAPI, foodAPI } from '../utils/api';

const DietPlanner: React.FC = () => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [meals, setMeals] = useState<any[]>([]);
  const [foods, setFoods] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadFoods();
    loadMealPlan();
  }, [selectedDate]);

  const DEFAULT_MEALS = [
    { type: 'breakfast', foods: [], time: '08:00' },
    { type: 'lunch', foods: [], time: '12:30' },
    { type: 'dinner', foods: [], time: '19:00' }
  ];

  useEffect(() => {
    // Add default meals if none exist
    if (meals.length === 0) {
      setMeals([...DEFAULT_MEALS]);
    }
  }, [meals.length]);

  const loadFoods = async () => {
    try {
      const response = await foodAPI.getFoods();
      // Handle new paginated response format
      const foodsData = response.data.foods || response.data;
      setFoods(foodsData);
    } catch (error) {
      console.error('Failed to load foods:', error);
    }
  };

  const loadMealPlan = async () => {
    if (!user) return;
    try {
      const response = await dietPlanAPI.getDietPlans({ date: selectedDate });
      const plan = response.data.find((p: any) => p.date.split('T')[0] === selectedDate);
      if (plan?.meals && plan.meals.length > 0) {
        setMeals(plan.meals);
      } else {
        // Set default meals if no plan exists
        setMeals([...DEFAULT_MEALS]);
      }
    } catch (error) {
      // Set default meals on error
      setMeals([...DEFAULT_MEALS]);
    }
  };

  const addMeal = () => {
    setMeals([...meals, {
      type: 'breakfast',
      foods: [],
      time: '08:00'
    }]);
  };

  const updateMeal = (index: number, field: string, value: any) => {
    const updated = [...meals];
    updated[index] = { ...updated[index], [field]: value };
    setMeals(updated);
  };

  const addFoodToMeal = (mealIndex: number, foodId: string) => {
    const updated = [...meals];
    updated[mealIndex].foods.push({
      foodId,
      quantity: 1,
      unit: 'serving'
    });
    setMeals(updated);
  };

  const removeFoodFromMeal = (mealIndex: number, foodIndex: number) => {
    const updated = [...meals];
    updated[mealIndex].foods.splice(foodIndex, 1);
    setMeals(updated);
  };

  const savePlan = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await dietPlanAPI.createDietPlan({
        date: selectedDate,
        meals,
        totalNutrition: { calories: 0, protein: 0, carbs: 0, fat: 0 }
      });
      alert('Diet plan saved successfully!');
    } catch (error) {
      alert('Failed to save diet plan');
    }
    setLoading(false);
  };

  const getFoodName = (foodId: string) => {
    const food = foods.find(f => f._id === foodId);
    return food?.name || 'Unknown Food';
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Diet Planner</h1>
        <div className="flex items-center gap-4">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          />
          <button
            onClick={savePlan}
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Plan'}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Meal Planning */}
        <div className="lg:col-span-2 space-y-6">
          {meals.map((meal, mealIndex) => (
            <motion.div
              key={mealIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <select
                    value={meal.type}
                    onChange={(e) => updateMeal(mealIndex, 'type', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  >
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                    <option value="snack">Snack</option>
                  </select>
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-gray-400" />
                    <input
                      type="time"
                      value={meal.time}
                      onChange={(e) => updateMeal(mealIndex, 'time', e.target.value)}
                      className="px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>
                <button
                  onClick={() => setMeals(meals.filter((_, i) => i !== mealIndex))}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="space-y-2 mb-4">
                {meal.foods.length > 0 ? (
                  meal.foods.map((food: any, foodIndex: number) => (
                    <div key={foodIndex} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <span>{getFoodName(food.foodId)}</span>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={food.quantity || 1}
                          onChange={(e) => {
                            const updated = [...meals];
                            updated[mealIndex].foods[foodIndex].quantity = Number(e.target.value) || 1;
                            setMeals(updated);
                          }}
                          className="w-16 px-2 py-1 border border-gray-300 rounded"
                          min="0.1"
                          step="0.1"
                        />
                        <span className="text-sm text-gray-500">{food.unit || 'serving'}</span>
                        <button
                          onClick={() => removeFoodFromMeal(mealIndex, foodIndex)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-500 bg-gray-50 rounded">
                    <p className="text-sm">No foods added yet</p>
                    <p className="text-xs">Use the dropdown below to add foods</p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      addFoodToMeal(mealIndex, e.target.value);
                      e.target.value = '';
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Add food...</option>
                  {foods.map(food => (
                    <option key={food._id} value={food._id}>{food.name}</option>
                  ))}
                </select>
                
                {/* Quick add buttons */}
                <div className="flex flex-wrap gap-1">
                  {foods.slice(0, 3).map(food => (
                    <button
                      key={food._id}
                      onClick={() => addFoodToMeal(mealIndex, food._id)}
                      className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200"
                    >
                      + {food.name}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}

          <button
            onClick={addMeal}
            className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-gray-500 hover:border-green-500 hover:text-green-500 flex items-center justify-center gap-2"
          >
            <Plus size={20} />
            Add Meal
          </button>
        </div>

        {/* Nutrition Summary */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Calendar className="text-green-600" size={20} />
              Daily Summary
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Total Meals:</span>
                <span className="font-medium">{meals.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Foods:</span>
                <span className="font-medium">{meals.reduce((total, meal) => total + meal.foods.length, 0)}</span>
              </div>
              <div className="text-sm text-gray-500 mt-2">
                Nutrition calculations coming soon
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h3 className="text-lg font-semibold mb-4">Dosha Balance</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span>Vata</span>
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div className="bg-orange-500 h-2 rounded-full" style={{ width: '30%' }}></div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span>Pitta</span>
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span>Kapha</span>
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DietPlanner;