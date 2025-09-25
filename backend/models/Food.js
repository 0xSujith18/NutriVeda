const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  doshaEffect: {
    vata: { type: String, enum: ['increase', 'decrease', 'neutral'] },
    pitta: { type: String, enum: ['increase', 'decrease', 'neutral'] },
    kapha: { type: String, enum: ['increase', 'decrease', 'neutral'] }
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
}, { timestamps: true });

module.exports = mongoose.model('Food', foodSchema);