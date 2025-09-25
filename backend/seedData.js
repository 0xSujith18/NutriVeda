const mongoose = require('mongoose');
const Food = require('./models/Food');
require('dotenv').config();

const parseDoshaEffect = (effect) => {
  if (effect.includes('Balances Vata')) return { vata: 'decrease', pitta: 'neutral', kapha: 'neutral' };
  if (effect.includes('increase Kapha')) return { vata: 'neutral', pitta: 'neutral', kapha: 'increase' };
  if (effect.includes('Increases Pitta')) return { vata: 'neutral', pitta: 'increase', kapha: 'neutral' };
  if (effect.includes('reduces Vata')) return { vata: 'decrease', pitta: 'neutral', kapha: 'neutral' };
  return { vata: 'neutral', pitta: 'neutral', kapha: 'neutral' };
};

const sampleFoods = [
  // Grains
  { name: 'Rice (white)', category: 'grains', nutrients: { calories: 133, protein: 2.67, carbs: 29, fat: 0.45, fiber: 1 }, doshaEffect: parseDoshaEffect('Balances Vata, may increase Kapha'), benefits: ['Easy to digest', 'Energy source'], description: 'Staple grain, cooling and nourishing' },
  { name: 'Rice (brown)', category: 'grains', nutrients: { calories: 110, protein: 2.55, carbs: 25, fat: 0.98, fiber: 2 }, doshaEffect: parseDoshaEffect('Balances Vata, may increase Kapha'), benefits: ['High fiber', 'Nutritious'], description: 'Whole grain rice with more nutrients' },
  { name: 'Wheat (atta)', category: 'grains', nutrients: { calories: 319, protein: 13.77, carbs: 70, fat: 2.42, fiber: 3 }, doshaEffect: parseDoshaEffect('Balances Vata, may increase Kapha'), benefits: ['High protein', 'Energy'], description: 'Common flour for Indian breads' },
  { name: 'Jowar (sorghum)', category: 'grains', nutrients: { calories: 333, protein: 8.81, carbs: 64, fat: 3.17, fiber: 4 }, doshaEffect: parseDoshaEffect('Balances Vata, may increase Kapha'), benefits: ['Gluten-free', 'High fiber'], description: 'Nutritious millet grain' },
  { name: 'Bajra (pearl millet)', category: 'grains', nutrients: { calories: 343, protein: 11.89, carbs: 63, fat: 4.51, fiber: 5 }, doshaEffect: parseDoshaEffect('Balances Vata, may increase Kapha'), benefits: ['Iron rich', 'Warming'], description: 'Winter grain, good for cold weather' },
  { name: 'Ragi (finger millet)', category: 'grains', nutrients: { calories: 352, protein: 7.17, carbs: 72, fat: 1.35, fiber: 6 }, doshaEffect: parseDoshaEffect('Balances Vata, may increase Kapha'), benefits: ['Calcium rich', 'Good for bones'], description: 'Highly nutritious millet' },
  { name: 'Barley', category: 'grains', nutrients: { calories: 344, protein: 12.61, carbs: 68, fat: 2.36, fiber: 7 }, doshaEffect: parseDoshaEffect('Balances Vata, may increase Kapha'), benefits: ['High fiber', 'Cooling'], description: 'Ancient grain with cooling properties' },

  // Legumes
  { name: 'Chickpea (kabuli)', category: 'legumes', nutrients: { calories: 353, protein: 18.56, carbs: 59, fat: 6.78, fiber: 8 }, doshaEffect: parseDoshaEffect('Increases Pitta, reduces Vata'), benefits: ['High protein', 'Fiber rich'], description: 'Popular legume, versatile cooking' },
  { name: 'Chana dal', category: 'legumes', nutrients: { calories: 360, protein: 19.22, carbs: 63, fat: 4.12, fiber: 9 }, doshaEffect: parseDoshaEffect('Increases Pitta, reduces Vata'), benefits: ['Protein rich', 'Easy to digest'], description: 'Split chickpeas, commonly used' },
  { name: 'Toor dal (arhar)', category: 'legumes', nutrients: { calories: 354, protein: 18.55, carbs: 53, fat: 2.84, fiber: 10 }, doshaEffect: parseDoshaEffect('Increases Pitta, reduces Vata'), benefits: ['High protein', 'Staple dal'], description: 'Most common dal in Indian cooking' },
  { name: 'Moong dal', category: 'legumes', nutrients: { calories: 360, protein: 24.33, carbs: 58, fat: 1.37, fiber: 11 }, doshaEffect: parseDoshaEffect('Increases Pitta, reduces Vata'), benefits: ['Easy to digest', 'Detoxifying'], description: 'Light and easily digestible dal' },
  { name: 'Urad dal', category: 'legumes', nutrients: { calories: 321, protein: 23.56, carbs: 56, fat: 1.72, fiber: 12 }, doshaEffect: parseDoshaEffect('Increases Pitta, reduces Vata'), benefits: ['High protein', 'Strengthening'], description: 'Black gram dal, nutritious' },
  { name: 'Kidney bean (rajma)', category: 'legumes', nutrients: { calories: 339, protein: 20.61, carbs: 61, fat: 0.76, fiber: 13 }, doshaEffect: parseDoshaEffect('Increases Pitta, reduces Vata'), benefits: ['High protein', 'Iron rich'], description: 'Popular bean in North Indian cuisine' },

  // Dairy
  { name: 'Milk (cow)', category: 'dairy', nutrients: { calories: 58, protein: 3.12, carbs: 5.17, fat: 3.53, fiber: 0 }, doshaEffect: parseDoshaEffect('Increases Kapha, balances Vata'), benefits: ['Calcium rich', 'Nourishing'], description: 'Complete protein source' },
  { name: 'Curd (yogurt)', category: 'dairy', nutrients: { calories: 60, protein: 3.45, carbs: 4.15, fat: 3.02, fiber: 0 }, doshaEffect: parseDoshaEffect('Increases Kapha, balances Vata'), benefits: ['Probiotics', 'Digestive'], description: 'Fermented milk product' },
  { name: 'Paneer', category: 'dairy', nutrients: { calories: 276, protein: 20.29, carbs: 1.16, fat: 22.26, fiber: 0 }, doshaEffect: parseDoshaEffect('Increases Kapha, balances Vata'), benefits: ['High protein', 'Calcium'], description: 'Fresh cheese, protein rich' },
  { name: 'Ghee', category: 'dairy', nutrients: { calories: 916, protein: 0, carbs: 0.18, fat: 110.77, fiber: 0 }, doshaEffect: parseDoshaEffect('Increases Kapha, balances Vata'), benefits: ['Digestive', 'Nourishing'], description: 'Clarified butter, sacred in Ayurveda' },

  // Fruits
  { name: 'Apple', category: 'fruit', nutrients: { calories: 52, protein: 0.27, carbs: 14, fat: 0, fiber: 2.4 }, doshaEffect: parseDoshaEffect('Varies by fruit'), benefits: ['Fiber rich', 'Antioxidants'], description: 'Common fruit, good for digestion' },
  { name: 'Banana (ripe)', category: 'fruit', nutrients: { calories: 88, protein: 1.14, carbs: 25, fat: 0.25, fiber: 2.6 }, doshaEffect: parseDoshaEffect('Varies by fruit'), benefits: ['Potassium', 'Energy'], description: 'Quick energy source' },
  { name: 'Mango (ripe)', category: 'fruit', nutrients: { calories: 58, protein: 0.75, carbs: 16, fat: 0.43, fiber: 1.6 }, doshaEffect: parseDoshaEffect('Varies by fruit'), benefits: ['Vitamin C', 'Sweet'], description: 'King of fruits, cooling' },
  { name: 'Guava', category: 'fruit', nutrients: { calories: 66, protein: 2.71, carbs: 14, fat: 1.1, fiber: 5.4 }, doshaEffect: parseDoshaEffect('Varies by fruit'), benefits: ['Vitamin C', 'Fiber'], description: 'High vitamin C content' },
  { name: 'Papaya', category: 'fruit', nutrients: { calories: 42, protein: 0.47, carbs: 11, fat: 0.15, fiber: 1.7 }, doshaEffect: parseDoshaEffect('Varies by fruit'), benefits: ['Digestive enzymes', 'Vitamin A'], description: 'Good for digestion' },
  { name: 'Orange', category: 'fruit', nutrients: { calories: 44, protein: 0.93, carbs: 9, fat: 0.08, fiber: 2.4 }, doshaEffect: parseDoshaEffect('Varies by fruit'), benefits: ['Vitamin C', 'Citrus'], description: 'Citrus fruit, vitamin C rich' },
  { name: 'Pomegranate', category: 'fruit', nutrients: { calories: 82, protein: 1.75, carbs: 21, fat: 1.22, fiber: 4 }, doshaEffect: parseDoshaEffect('Varies by fruit'), benefits: ['Antioxidants', 'Heart health'], description: 'Antioxidant rich fruit' },

  // Vegetables
  { name: 'Spinach (palak)', category: 'vegetable', nutrients: { calories: 23, protein: 2.63, carbs: 4.17, fat: 0.48, fiber: 2.2 }, doshaEffect: parseDoshaEffect('Generally balances Pitta/Kapha'), benefits: ['Iron rich', 'Leafy green'], description: 'Nutritious leafy vegetable' },
  { name: 'Bottle gourd (lauki)', category: 'vegetable', nutrients: { calories: 14, protein: 0.55, carbs: 2.62, fat: 0.21, fiber: 0.5 }, doshaEffect: parseDoshaEffect('Generally balances Pitta/Kapha'), benefits: ['Cooling', 'Light'], description: 'Light and cooling vegetable' },
  { name: 'Bitter gourd (karela)', category: 'vegetable', nutrients: { calories: 16, protein: 1.05, carbs: 3.54, fat: 0.35, fiber: 2.8 }, doshaEffect: parseDoshaEffect('Generally balances Pitta/Kapha'), benefits: ['Blood sugar', 'Bitter taste'], description: 'Bitter vegetable, medicinal' },
  { name: 'Okra (bhindi)', category: 'vegetable', nutrients: { calories: 32, protein: 1.85, carbs: 7.91, fat: 0.08, fiber: 3.2 }, doshaEffect: parseDoshaEffect('Generally balances Pitta/Kapha'), benefits: ['Fiber rich', 'Mucilaginous'], description: 'Popular vegetable, fiber rich' },
  { name: 'Brinjal (eggplant)', category: 'vegetable', nutrients: { calories: 25, protein: 1.13, carbs: 5.2, fat: 0.22, fiber: 3 }, doshaEffect: parseDoshaEffect('Generally balances Pitta/Kapha'), benefits: ['Low calorie', 'Versatile'], description: 'Versatile vegetable' },
  { name: 'Tomato', category: 'vegetable', nutrients: { calories: 18, protein: 0.98, carbs: 3.28, fat: 0.07, fiber: 1.2 }, doshaEffect: parseDoshaEffect('Generally balances Pitta/Kapha'), benefits: ['Lycopene', 'Vitamin C'], description: 'Common cooking ingredient' },
  { name: 'Carrot', category: 'vegetable', nutrients: { calories: 42, protein: 0.93, carbs: 10, fat: 0.23, fiber: 2.8 }, doshaEffect: parseDoshaEffect('Generally balances Pitta/Kapha'), benefits: ['Beta carotene', 'Sweet'], description: 'Sweet root vegetable' },
  { name: 'Potato', category: 'vegetable', nutrients: { calories: 74, protein: 2.04, carbs: 17, fat: 0.03, fiber: 2.2 }, doshaEffect: parseDoshaEffect('Generally balances Pitta/Kapha'), benefits: ['Starchy', 'Energy'], description: 'Starchy tuber vegetable' },

  // Spices
  { name: 'Turmeric (haldi)', category: 'spice', nutrients: { calories: 341, protein: 10.07, carbs: 62, fat: 3.45, fiber: 21 }, doshaEffect: parseDoshaEffect('Increases Pitta; reduces Kapha'), benefits: ['Anti-inflammatory', 'Healing'], description: 'Golden spice with healing properties' },
  { name: 'Cumin (jeera)', category: 'spice', nutrients: { calories: 357, protein: 18.92, carbs: 47, fat: 21.02, fiber: 10 }, doshaEffect: parseDoshaEffect('Increases Pitta; reduces Kapha'), benefits: ['Digestive', 'Aromatic'], description: 'Common spice for tempering' },
  { name: 'Coriander (dhaniya)', category: 'spice', nutrients: { calories: 24, protein: 2.17, carbs: 4.11, fat: 0.69, fiber: 2.8 }, doshaEffect: parseDoshaEffect('Increases Pitta; reduces Kapha'), benefits: ['Cooling', 'Digestive'], description: 'Fresh herb and spice' },
  { name: 'Black pepper', category: 'spice', nutrients: { calories: 263, protein: 9.69, carbs: 60, fat: 3.41, fiber: 25 }, doshaEffect: parseDoshaEffect('Increases Pitta; reduces Kapha'), benefits: ['Warming', 'Digestive'], description: 'King of spices, warming' },

  // Nuts and Seeds
  { name: 'Almond', category: 'nuts_seeds', nutrients: { calories: 573, protein: 22.41, carbs: 22, fat: 49.65, fiber: 12 }, doshaEffect: parseDoshaEffect('Increases Kapha and Pitta'), benefits: ['Healthy fats', 'Protein'], description: 'Nutritious tree nut' },
  { name: 'Cashew', category: 'nuts_seeds', nutrients: { calories: 530, protein: 15.99, carbs: 29, fat: 46.53, fiber: 3.3 }, doshaEffect: parseDoshaEffect('Increases Kapha and Pitta'), benefits: ['Creamy texture', 'Minerals'], description: 'Creamy nut, good for cooking' },
  { name: 'Sesame seed (til)', category: 'nuts_seeds', nutrients: { calories: 548, protein: 17.92, carbs: 24, fat: 45.72, fiber: 11 }, doshaEffect: parseDoshaEffect('Increases Kapha and Pitta'), benefits: ['Calcium', 'Healthy oils'], description: 'Oil-rich seeds' },

  // Oils
  { name: 'Coconut oil', category: 'oil', nutrients: { calories: 916, protein: 0.39, carbs: 0.29, fat: 107.95, fiber: 0 }, doshaEffect: parseDoshaEffect('Increases Kapha, may increase Pitta'), benefits: ['Saturated fats', 'Cooking'], description: 'Traditional cooking oil' },
  { name: 'Sesame oil', category: 'oil', nutrients: { calories: 850, protein: 0, carbs: 0, fat: 100.57, fiber: 0 }, doshaEffect: parseDoshaEffect('Increases Kapha, may increase Pitta'), benefits: ['Warming', 'Traditional'], description: 'Traditional oil for cooking' }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    await Food.deleteMany({});
    console.log('Cleared existing foods');
    
    await Food.insertMany(sampleFoods);
    console.log(`${sampleFoods.length} foods inserted successfully`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();