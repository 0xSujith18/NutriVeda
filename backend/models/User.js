const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  doshaType: { 
    type: String, 
    enum: {
      values: ['Vata', 'Pitta', 'Kapha', 'Mixed'],
      message: '{VALUE} is not a valid dosha type'
    },
    default: undefined
  },
  preferences: {
    dietaryRestrictions: [String],
    goals: [String]
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);