const mongoose = require('mongoose');
const Food = require('./models/Food');
require('dotenv').config();

const parseDoshaEffect = (effect) => {
  if (effect.includes('Balances Vata')) return { vata: 'decrease', pitta: 'neutral', kapha: effect.includes('increase Kapha') ? 'increase' : 'neutral' };
  if (effect.includes('Increases Pitta')) return { vata: effect.includes('reduces Vata') ? 'decrease' : 'neutral', pitta: 'increase', kapha: effect.includes('reduces Kapha') ? 'decrease' : 'neutral' };
  if (effect.includes('Increases Kapha')) return { vata: effect.includes('balances Vata') ? 'decrease' : 'neutral', pitta: effect.includes('Pitta') ? 'increase' : 'neutral', kapha: 'increase' };
  if (effect.includes('balances Pitta/Kapha')) return { vata: 'neutral', pitta: 'decrease', kapha: 'decrease' };
  return { vata: 'neutral', pitta: 'neutral', kapha: 'neutral' };
};

const comprehensiveFoods = [
  // Grains
  { name: 'Rice (white)', category: 'grains', nutrients: { calories: 130, protein: 2.7, carbs: 28, fat: 0.3, fiber: 1 }, doshaEffect: parseDoshaEffect('Balances Vata, may increase Kapha'), benefits: ['Easy to digest', 'Energy source'], description: 'Staple grain, cooling and nourishing' },
  { name: 'Rice (brown)', category: 'grains', nutrients: { calories: 471, protein: 6.8, carbs: 77.2, fat: 12.6, fiber: 4 }, doshaEffect: parseDoshaEffect('Balances Vata, may increase Kapha'), benefits: ['High fiber', 'Nutritious'], description: 'Whole grain rice with more nutrients' },
  { name: 'Wheat (atta)', category: 'grains', nutrients: { calories: 509, protein: 2.3, carbs: 5.2, fat: 24.6, fiber: 3 }, doshaEffect: parseDoshaEffect('Balances Vata, may increase Kapha'), benefits: ['High protein', 'Energy'], description: 'Common flour for Indian breads' },
  { name: 'Jowar (sorghum)', category: 'grains', nutrients: { calories: 74, protein: 3, carbs: 64.9, fat: 47.5, fiber: 4 }, doshaEffect: parseDoshaEffect('Balances Vata, may increase Kapha'), benefits: ['Gluten-free', 'High fiber'], description: 'Nutritious millet grain' },
  { name: 'Bajra (pearl millet)', category: 'grains', nutrients: { calories: 107, protein: 19.9, carbs: 9.5, fat: 38.2, fiber: 5 }, doshaEffect: parseDoshaEffect('Balances Vata, may increase Kapha'), benefits: ['Iron rich', 'Warming'], description: 'Winter grain, good for cold weather' },
  { name: 'Ragi (finger millet)', category: 'grains', nutrients: { calories: 251, protein: 15.5, carbs: 30.4, fat: 45.4, fiber: 6 }, doshaEffect: parseDoshaEffect('Balances Vata, may increase Kapha'), benefits: ['Calcium rich', 'Good for bones'], description: 'Highly nutritious millet' },
  { name: 'Barley', category: 'grains', nutrients: { calories: 324, protein: 17.2, carbs: 79.2, fat: 15.3, fiber: 7 }, doshaEffect: parseDoshaEffect('Balances Vata, may increase Kapha'), benefits: ['High fiber', 'Cooling'], description: 'Ancient grain with cooling properties' },

  // Legumes
  { name: 'Chickpea (kabuli)', category: 'legumes', nutrients: { calories: 364, protein: 19, carbs: 61, fat: 6, fiber: 8 }, doshaEffect: parseDoshaEffect('Increases Pitta, reduces Vata'), benefits: ['High protein', 'Fiber rich'], description: 'Popular legume, versatile cooking' },
  { name: 'Chana dal', category: 'legumes', nutrients: { calories: 81, protein: 12.2, carbs: 59.2, fat: 47.4, fiber: 9 }, doshaEffect: parseDoshaEffect('Increases Pitta, reduces Vata'), benefits: ['Protein rich', 'Easy to digest'], description: 'Split chickpeas, commonly used' },
  { name: 'Toor dal (arhar)', category: 'legumes', nutrients: { calories: 232, protein: 12.5, carbs: 21.2, fat: 4.1, fiber: 10 }, doshaEffect: parseDoshaEffect('Increases Pitta, reduces Vata'), benefits: ['High protein', 'Staple dal'], description: 'Most common dal in Indian cooking' },
  { name: 'Moong dal', category: 'legumes', nutrients: { calories: 265, protein: 3.5, carbs: 6, fat: 0.1, fiber: 11 }, doshaEffect: parseDoshaEffect('Increases Pitta, reduces Vata'), benefits: ['Easy to digest', 'Detoxifying'], description: 'Light and easily digestible dal' },
  { name: 'Urad dal', category: 'legumes', nutrients: { calories: 481, protein: 13.8, carbs: 37.6, fat: 1.6, fiber: 12 }, doshaEffect: parseDoshaEffect('Increases Pitta, reduces Vata'), benefits: ['High protein', 'Strengthening'], description: 'Black gram dal, nutritious' },
  { name: 'Kidney bean (rajma)', category: 'legumes', nutrients: { calories: 315, protein: 14.1, carbs: 56.2, fat: 22.7, fiber: 13 }, doshaEffect: parseDoshaEffect('Increases Pitta, reduces Vata'), benefits: ['High protein', 'Iron rich'], description: 'Popular bean in North Indian cuisine' },
  { name: 'Black gram', category: 'legumes', nutrients: { calories: 259, protein: 18.5, carbs: 63, fat: 31.3, fiber: 14 }, doshaEffect: parseDoshaEffect('Increases Pitta, reduces Vata'), benefits: ['High protein', 'Strengthening'], description: 'Nutritious black legume' },

  // Dairy
  { name: 'Milk (cow)', category: 'dairy', nutrients: { calories: 60, protein: 3.2, carbs: 5, fat: 3.3, fiber: 0 }, doshaEffect: parseDoshaEffect('Increases Kapha, balances Vata'), benefits: ['Calcium rich', 'Nourishing'], description: 'Complete protein source' },
  { name: 'Curd (yogurt)', category: 'dairy', nutrients: { calories: 222, protein: 8.5, carbs: 43.6, fat: 32.4, fiber: 0 }, doshaEffect: parseDoshaEffect('Increases Kapha, balances Vata'), benefits: ['Probiotics', 'Digestive'], description: 'Fermented milk product' },
  { name: 'Paneer', category: 'dairy', nutrients: { calories: 292, protein: 16.5, carbs: 5.7, fat: 8.3, fiber: 0 }, doshaEffect: parseDoshaEffect('Increases Kapha, balances Vata'), benefits: ['High protein', 'Calcium'], description: 'Fresh cheese, protein rich' },
  { name: 'Ghee', category: 'dairy', nutrients: { calories: 334, protein: 11.9, carbs: 65.9, fat: 46.1, fiber: 0 }, doshaEffect: parseDoshaEffect('Increases Kapha, balances Vata'), benefits: ['Digestive', 'Nourishing'], description: 'Clarified butter, sacred in Ayurveda' },
  { name: 'Buttermilk (chaas)', category: 'dairy', nutrients: { calories: 469, protein: 2.5, carbs: 55.1, fat: 35, fiber: 0 }, doshaEffect: parseDoshaEffect('Increases Kapha, balances Vata'), benefits: ['Cooling', 'Digestive'], description: 'Fermented drink, cooling' },

  // Fruits
  { name: 'Apple', category: 'fruit', nutrients: { calories: 52, protein: 0.3, carbs: 14, fat: 0.2, fiber: 2.4 }, doshaEffect: parseDoshaEffect('Varies by fruit'), benefits: ['Fiber rich', 'Antioxidants'], description: 'Common fruit, good for digestion' },
  { name: 'Banana (ripe)', category: 'fruit', nutrients: { calories: 298, protein: 10, carbs: 39.5, fat: 4, fiber: 2.6 }, doshaEffect: parseDoshaEffect('Varies by fruit'), benefits: ['Potassium', 'Energy'], description: 'Quick energy source' },
  { name: 'Mango (ripe)', category: 'fruit', nutrients: { calories: 60, protein: 17.8, carbs: 58.8, fat: 30.2, fiber: 1.6 }, doshaEffect: parseDoshaEffect('Varies by fruit'), benefits: ['Vitamin C', 'Sweet'], description: 'King of fruits, cooling' },
  { name: 'Guava', category: 'fruit', nutrients: { calories: 46, protein: 1.8, carbs: 77, fat: 41.8, fiber: 5.4 }, doshaEffect: parseDoshaEffect('Varies by fruit'), benefits: ['Vitamin C', 'Fiber'], description: 'High vitamin C content' },
  { name: 'Papaya', category: 'fruit', nutrients: { calories: 41, protein: 20, carbs: 53.8, fat: 13.5, fiber: 1.7 }, doshaEffect: parseDoshaEffect('Varies by fruit'), benefits: ['Digestive enzymes', 'Vitamin A'], description: 'Good for digestion' },
  { name: 'Orange', category: 'fruit', nutrients: { calories: 61, protein: 15.3, carbs: 14, fat: 25.9, fiber: 2.4 }, doshaEffect: parseDoshaEffect('Varies by fruit'), benefits: ['Vitamin C', 'Citrus'], description: 'Citrus fruit, vitamin C rich' },
  { name: 'Pineapple', category: 'fruit', nutrients: { calories: 472, protein: 18.3, carbs: 14.5, fat: 29.3, fiber: 1.4 }, doshaEffect: parseDoshaEffect('Varies by fruit'), benefits: ['Enzymes', 'Tropical'], description: 'Tropical fruit with enzymes' },
  { name: 'Pomegranate', category: 'fruit', nutrients: { calories: 523, protein: 19.4, carbs: 37.6, fat: 20.4, fiber: 4 }, doshaEffect: parseDoshaEffect('Varies by fruit'), benefits: ['Antioxidants', 'Heart health'], description: 'Antioxidant rich fruit' },
  { name: 'Lychee', category: 'fruit', nutrients: { calories: 348, protein: 13.4, carbs: 68.6, fat: 16.5, fiber: 1.3 }, doshaEffect: parseDoshaEffect('Varies by fruit'), benefits: ['Sweet', 'Vitamin C'], description: 'Sweet tropical fruit' },
  { name: 'Custard apple', category: 'fruit', nutrients: { calories: 527, protein: 5.8, carbs: 75.6, fat: 40.7, fiber: 2.4 }, doshaEffect: parseDoshaEffect('Varies by fruit'), benefits: ['Creamy', 'Energy'], description: 'Creamy sweet fruit' },

  // Vegetables
  { name: 'Spinach (palak)', category: 'vegetable', nutrients: { calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, fiber: 2.2 }, doshaEffect: parseDoshaEffect('Generally balances Pitta/Kapha'), benefits: ['Iron rich', 'Leafy green'], description: 'Nutritious leafy vegetable' },
  { name: 'Fenugreek (methi)', category: 'vegetable', nutrients: { calories: 583, protein: 0.7, carbs: 7, fat: 12.6, fiber: 25 }, doshaEffect: parseDoshaEffect('Generally balances Pitta/Kapha'), benefits: ['Bitter taste', 'Medicinal'], description: 'Bitter leafy vegetable' },
  { name: 'Mustard greens (sarson)', category: 'vegetable', nutrients: { calories: 138, protein: 19.4, carbs: 32.3, fat: 25.7, fiber: 3.2 }, doshaEffect: parseDoshaEffect('Generally balances Pitta/Kapha'), benefits: ['Pungent', 'Warming'], description: 'Pungent leafy vegetable' },
  { name: 'Bottle gourd (lauki)', category: 'vegetable', nutrients: { calories: 21, protein: 13.2, carbs: 43.4, fat: 20.7, fiber: 0.5 }, doshaEffect: parseDoshaEffect('Generally balances Pitta/Kapha'), benefits: ['Cooling', 'Light'], description: 'Light and cooling vegetable' },
  { name: 'Bitter gourd (karela)', category: 'vegetable', nutrients: { calories: 212, protein: 10.4, carbs: 49.8, fat: 24.9, fiber: 2.8 }, doshaEffect: parseDoshaEffect('Generally balances Pitta/Kapha'), benefits: ['Blood sugar', 'Bitter taste'], description: 'Bitter vegetable, medicinal' },
  { name: 'Okra (bhindi)', category: 'vegetable', nutrients: { calories: 472, protein: 15.2, carbs: 16.3, fat: 27.5, fiber: 3.2 }, doshaEffect: parseDoshaEffect('Generally balances Pitta/Kapha'), benefits: ['Fiber rich', 'Mucilaginous'], description: 'Popular vegetable, fiber rich' },
  { name: 'Brinjal (eggplant)', category: 'vegetable', nutrients: { calories: 314, protein: 8.8, carbs: 55.9, fat: 6.1, fiber: 3 }, doshaEffect: parseDoshaEffect('Generally balances Pitta/Kapha'), benefits: ['Low calorie', 'Versatile'], description: 'Versatile vegetable' },
  { name: 'Tomato', category: 'vegetable', nutrients: { calories: 265, protein: 14.2, carbs: 24.9, fat: 0.7, fiber: 1.2 }, doshaEffect: parseDoshaEffect('Generally balances Pitta/Kapha'), benefits: ['Lycopene', 'Vitamin C'], description: 'Common cooking ingredient' },
  { name: 'Carrot', category: 'vegetable', nutrients: { calories: 437, protein: 1.9, carbs: 79.4, fat: 45.6, fiber: 2.8 }, doshaEffect: parseDoshaEffect('Generally balances Pitta/Kapha'), benefits: ['Beta carotene', 'Sweet'], description: 'Sweet root vegetable' },
  { name: 'Potato', category: 'vegetable', nutrients: { calories: 492, protein: 18.9, carbs: 51.8, fat: 7.7, fiber: 2.2 }, doshaEffect: parseDoshaEffect('Generally balances Pitta/Kapha'), benefits: ['Starchy', 'Energy'], description: 'Starchy tuber vegetable' },

  // Spices
  { name: 'Turmeric (haldi)', category: 'spice', nutrients: { calories: 312, protein: 9.7, carbs: 67.1, fat: 3.3, fiber: 21 }, doshaEffect: parseDoshaEffect('Increases Pitta; reduces Kapha'), benefits: ['Anti-inflammatory', 'Healing'], description: 'Golden spice with healing properties' },
  { name: 'Cumin (jeera)', category: 'spice', nutrients: { calories: 375, protein: 17.8, carbs: 44.2, fat: 22.3, fiber: 10 }, doshaEffect: parseDoshaEffect('Increases Pitta; reduces Kapha'), benefits: ['Digestive', 'Aromatic'], description: 'Common spice for tempering' },
  { name: 'Coriander (dhaniya)', category: 'spice', nutrients: { calories: 318, protein: 10.2, carbs: 21.9, fat: 41.7, fiber: 2.8 }, doshaEffect: parseDoshaEffect('Increases Pitta; reduces Kapha'), benefits: ['Cooling', 'Digestive'], description: 'Fresh herb and spice' },
  { name: 'Mustard seed', category: 'spice', nutrients: { calories: 503, protein: 4.9, carbs: 44.1, fat: 19.2, fiber: 12 }, doshaEffect: parseDoshaEffect('Increases Pitta; reduces Kapha'), benefits: ['Warming', 'Pungent'], description: 'Warming spice seed' },
  { name: 'Fenugreek seed', category: 'spice', nutrients: { calories: 540, protein: 14.9, carbs: 10.9, fat: 3.5, fiber: 25 }, doshaEffect: parseDoshaEffect('Increases Pitta; reduces Kapha'), benefits: ['Bitter', 'Medicinal'], description: 'Bitter medicinal seed' },
  { name: 'Asafoetida (hing)', category: 'spice', nutrients: { calories: 444, protein: 6.8, carbs: 63, fat: 13.4, fiber: 4 }, doshaEffect: parseDoshaEffect('Increases Pitta; reduces Kapha'), benefits: ['Digestive', 'Pungent'], description: 'Strong pungent spice' },
  { name: 'Black pepper', category: 'spice', nutrients: { calories: 255, protein: 10.4, carbs: 64, fat: 3.3, fiber: 25 }, doshaEffect: parseDoshaEffect('Increases Pitta; reduces Kapha'), benefits: ['Warming', 'Digestive'], description: 'King of spices, warming' },
  { name: 'Cardamom', category: 'spice', nutrients: { calories: 22, protein: 5.7, carbs: 23.9, fat: 29.3, fiber: 28 }, doshaEffect: parseDoshaEffect('Increases Pitta; reduces Kapha'), benefits: ['Aromatic', 'Cooling'], description: 'Aromatic sweet spice' },
  { name: 'Clove', category: 'spice', nutrients: { calories: 521, protein: 17.3, carbs: 35.7, fat: 24.2, fiber: 34 }, doshaEffect: parseDoshaEffect('Increases Pitta; reduces Kapha'), benefits: ['Warming', 'Antiseptic'], description: 'Warming aromatic spice' },
  { name: 'Nutmeg', category: 'spice', nutrients: { calories: 360, protein: 11, carbs: 43.5, fat: 22.8, fiber: 21 }, doshaEffect: parseDoshaEffect('Increases Pitta; reduces Kapha'), benefits: ['Warming', 'Aromatic'], description: 'Warming sweet spice' },
  { name: 'Cinnamon', category: 'spice', nutrients: { calories: 504, protein: 14.1, carbs: 64.9, fat: 19.3, fiber: 53 }, doshaEffect: parseDoshaEffect('Increases Pitta; reduces Kapha'), benefits: ['Sweet', 'Warming'], description: 'Sweet warming spice' },
  { name: 'Star anise', category: 'spice', nutrients: { calories: 175, protein: 9.9, carbs: 3, fat: 25.1, fiber: 15 }, doshaEffect: parseDoshaEffect('Increases Pitta; reduces Kapha'), benefits: ['Aromatic', 'Digestive'], description: 'Star-shaped aromatic spice' },
  { name: 'Fennel seed', category: 'spice', nutrients: { calories: 359, protein: 17.4, carbs: 69.9, fat: 22, fiber: 40 }, doshaEffect: parseDoshaEffect('Increases Pitta; reduces Kapha'), benefits: ['Cooling', 'Digestive'], description: 'Sweet cooling spice' },
  { name: 'Carom seed (ajwain)', category: 'spice', nutrients: { calories: 558, protein: 18.2, carbs: 1.2, fat: 7.2, fiber: 39 }, doshaEffect: parseDoshaEffect('Increases Pitta; reduces Kapha'), benefits: ['Digestive', 'Warming'], description: 'Strong digestive spice' },
  { name: 'Dry ginger', category: 'spice', nutrients: { calories: 427, protein: 13, carbs: 68.1, fat: 42.6, fiber: 14 }, doshaEffect: parseDoshaEffect('Increases Pitta; reduces Kapha'), benefits: ['Warming', 'Digestive'], description: 'Warming digestive spice' },
  { name: 'Saffron', category: 'spice', nutrients: { calories: 566, protein: 7.6, carbs: 25.3, fat: 35.9, fiber: 4 }, doshaEffect: parseDoshaEffect('Increases Pitta; reduces Kapha'), benefits: ['Aromatic', 'Precious'], description: 'Most expensive spice' },

  // Nuts and Seeds
  { name: 'Almond', category: 'nuts_seeds', nutrients: { calories: 579, protein: 21.2, carbs: 21.6, fat: 49.9, fiber: 12 }, doshaEffect: parseDoshaEffect('Increases Kapha and Pitta'), benefits: ['Healthy fats', 'Protein'], description: 'Nutritious tree nut' },
  { name: 'Cashew', category: 'nuts_seeds', nutrients: { calories: 77, protein: 5.9, carbs: 30, fat: 7.3, fiber: 3.3 }, doshaEffect: parseDoshaEffect('Increases Kapha and Pitta'), benefits: ['Creamy texture', 'Minerals'], description: 'Creamy nut, good for cooking' },
  { name: 'Peanut (groundnut)', category: 'nuts_seeds', nutrients: { calories: 563, protein: 8.2, carbs: 54.5, fat: 9, fiber: 8.5 }, doshaEffect: parseDoshaEffect('Increases Kapha and Pitta'), benefits: ['Protein rich', 'Affordable'], description: 'Common legume nut' },
  { name: 'Sesame seed (til)', category: 'nuts_seeds', nutrients: { calories: 199, protein: 1.6, carbs: 69.7, fat: 31, fiber: 11 }, doshaEffect: parseDoshaEffect('Increases Kapha and Pitta'), benefits: ['Calcium', 'Healthy oils'], description: 'Oil-rich seeds' },
  { name: 'Flaxseed', category: 'nuts_seeds', nutrients: { calories: 266, protein: 10, carbs: 46.7, fat: 11.6, fiber: 27 }, doshaEffect: parseDoshaEffect('Increases Kapha and Pitta'), benefits: ['Omega-3', 'Fiber'], description: 'Omega-3 rich seeds' },

  // Oils
  { name: 'Mustard oil', category: 'oil', nutrients: { calories: 884, protein: 0, carbs: 0, fat: 100, fiber: 0 }, doshaEffect: parseDoshaEffect('Increases Kapha, may increase Pitta'), benefits: ['Warming', 'Traditional'], description: 'Warming cooking oil' },
  { name: 'Coconut oil', category: 'oil', nutrients: { calories: 280, protein: 9.2, carbs: 53.3, fat: 44.9, fiber: 0 }, doshaEffect: parseDoshaEffect('Increases Kapha, may increase Pitta'), benefits: ['Saturated fats', 'Cooking'], description: 'Traditional cooking oil' },
  { name: 'Groundnut oil', category: 'oil', nutrients: { calories: 496, protein: 18, carbs: 54.2, fat: 7.9, fiber: 0 }, doshaEffect: parseDoshaEffect('Increases Kapha, may increase Pitta'), benefits: ['High smoke point', 'Cooking'], description: 'Common cooking oil' },
  { name: 'Sesame oil', category: 'oil', nutrients: { calories: 472, protein: 18.9, carbs: 79, fat: 15, fiber: 0 }, doshaEffect: parseDoshaEffect('Increases Kapha, may increase Pitta'), benefits: ['Warming', 'Traditional'], description: 'Traditional oil for cooking' },

  // Snacks
  { name: 'Samosa', category: 'snack', nutrients: { calories: 262, protein: 6, carbs: 31, fat: 14, fiber: 2 }, doshaEffect: parseDoshaEffect('Increases Kapha and Pitta'), benefits: ['Tasty', 'Popular'], description: 'Fried triangular snack' },
  { name: 'Pakora', category: 'snack', nutrients: { calories: 454, protein: 13.8, carbs: 36.5, fat: 15.1, fiber: 3 }, doshaEffect: parseDoshaEffect('Increases Kapha and Pitta'), benefits: ['Crispy', 'Monsoon food'], description: 'Fried fritter snack' },
  { name: 'Idli', category: 'snack', nutrients: { calories: 413, protein: 17.1, carbs: 8.5, fat: 19.1, fiber: 1 }, doshaEffect: parseDoshaEffect('Increases Kapha and Pitta'), benefits: ['Fermented', 'Light'], description: 'Steamed fermented cake' },
  { name: 'Dosa', category: 'snack', nutrients: { calories: 387, protein: 11.5, carbs: 79.4, fat: 14.8, fiber: 2 }, doshaEffect: parseDoshaEffect('Increases Kapha and Pitta'), benefits: ['Fermented', 'Crispy'], description: 'Fermented crepe' },
  { name: 'Poha', category: 'snack', nutrients: { calories: 425, protein: 5.5, carbs: 45.3, fat: 34.3, fiber: 2 }, doshaEffect: parseDoshaEffect('Increases Kapha and Pitta'), benefits: ['Light', 'Quick'], description: 'Flattened rice dish' },
  { name: 'Upma', category: 'snack', nutrients: { calories: 70, protein: 18.2, carbs: 59.6, fat: 41.6, fiber: 2 }, doshaEffect: parseDoshaEffect('Increases Kapha and Pitta'), benefits: ['Semolina', 'Filling'], description: 'Semolina porridge' },
  { name: 'Paratha (plain)', category: 'snack', nutrients: { calories: 313, protein: 15.5, carbs: 18.4, fat: 40.1, fiber: 3 }, doshaEffect: parseDoshaEffect('Increases Kapha and Pitta'), benefits: ['Filling', 'Traditional'], description: 'Layered flatbread' },
  { name: 'Chapati', category: 'snack', nutrients: { calories: 244, protein: 12.7, carbs: 49.7, fat: 33.9, fiber: 3 }, doshaEffect: parseDoshaEffect('Increases Kapha and Pitta'), benefits: ['Simple', 'Daily bread'], description: 'Simple flatbread' },

  // Sweets
  { name: 'Gulab jamun', category: 'sweet', nutrients: { calories: 310, protein: 6, carbs: 40, fat: 12, fiber: 1 }, doshaEffect: parseDoshaEffect('Increases Kapha and Pitta'), benefits: ['Sweet', 'Festive'], description: 'Milk-based sweet balls' },
  { name: 'Jalebi', category: 'sweet', nutrients: { calories: 160, protein: 12.6, carbs: 72.3, fat: 32.3, fiber: 0 }, doshaEffect: parseDoshaEffect('Increases Kapha and Pitta'), benefits: ['Crispy', 'Sweet'], description: 'Spiral-shaped sweet' },
  { name: 'Ladoo (besan)', category: 'sweet', nutrients: { calories: 336, protein: 15.8, carbs: 2.7, fat: 18.2, fiber: 6 }, doshaEffect: parseDoshaEffect('Increases Kapha and Pitta'), benefits: ['Protein rich', 'Traditional'], description: 'Chickpea flour balls' },
  { name: 'Kheer (rice pudding)', category: 'sweet', nutrients: { calories: 154, protein: 1.8, carbs: 23.6, fat: 37.4, fiber: 0 }, doshaEffect: parseDoshaEffect('Increases Kapha and Pitta'), benefits: ['Creamy', 'Comforting'], description: 'Rice milk pudding' },

  // Beverages
  { name: 'Tea (chai)', category: 'beverage', nutrients: { calories: 1, protein: 0.1, carbs: 0.1, fat: 0, fiber: 0 }, doshaEffect: parseDoshaEffect('Varies'), benefits: ['Warming', 'Stimulating'], description: 'Spiced tea beverage' },
  { name: 'Coffee', category: 'beverage', nutrients: { calories: 199, protein: 4, carbs: 62.9, fat: 43.8, fiber: 0 }, doshaEffect: parseDoshaEffect('Varies'), benefits: ['Stimulating', 'Antioxidants'], description: 'Coffee beverage' },
  { name: 'Lassi (sweet)', category: 'beverage', nutrients: { calories: 394, protein: 10.6, carbs: 73.1, fat: 41.5, fiber: 0 }, doshaEffect: parseDoshaEffect('Varies'), benefits: ['Cooling', 'Probiotic'], description: 'Yogurt-based drink' },
  { name: 'Tender coconut water', category: 'beverage', nutrients: { calories: 283, protein: 18.3, carbs: 75.5, fat: 48.4, fiber: 0 }, doshaEffect: parseDoshaEffect('Varies'), benefits: ['Electrolytes', 'Cooling'], description: 'Natural coconut water' },
  { name: 'Lemon water', category: 'beverage', nutrients: { calories: 322, protein: 14.9, carbs: 27.1, fat: 5.8, fiber: 0 }, doshaEffect: parseDoshaEffect('Varies'), benefits: ['Vitamin C', 'Detox'], description: 'Lemon-infused water' }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    await Food.deleteMany({});
    console.log('Cleared existing foods');
    
    await Food.insertMany(comprehensiveFoods);
    console.log(`${comprehensiveFoods.length} comprehensive foods inserted successfully`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();