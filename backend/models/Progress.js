const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  waterIntake: { type: Number, default: 0 }, // in ml
  calories: { type: Number, default: 0 },
  weight: Number, // in kg
  mood: { type: String, enum: ['excellent', 'good', 'average', 'poor', 'terrible'] },
  notes: String
}, { timestamps: true });

module.exports = mongoose.model('Progress', progressSchema);