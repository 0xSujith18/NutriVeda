const express = require('express');
const DietPlan = require('../models/DietPlan');
const auth = require('../middleware/auth');

const router = express.Router();

// Get diet plans for user
router.get('/', auth, async (req, res) => {
  try {
    const { date, startDate, endDate } = req.query;
    let filter = { userId: req.user.userId };
    
    // Validate and sanitize date inputs
    if (date && typeof date === 'string') {
      const parsedDate = new Date(date);
      if (!isNaN(parsedDate.getTime())) {
        filter.date = parsedDate;
      }
    } else if (startDate && endDate && typeof startDate === 'string' && typeof endDate === 'string') {
      const parsedStartDate = new Date(startDate);
      const parsedEndDate = new Date(endDate);
      if (!isNaN(parsedStartDate.getTime()) && !isNaN(parsedEndDate.getTime())) {
        filter.date = { $gte: parsedStartDate, $lte: parsedEndDate };
      }
    }

    const dietPlans = await DietPlan.find(filter).populate('meals.foods.foodId');
    res.json(dietPlans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create diet plan
router.post('/', auth, async (req, res) => {
  try {
    // Only allow specific fields from request body
    const { date, meals, totalNutrition } = req.body;
    
    const dietPlan = new DietPlan({
      userId: req.user.userId,
      date,
      meals,
      totalNutrition
    });
    await dietPlan.save();
    res.status(201).json(dietPlan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update diet plan
router.put('/:id', auth, async (req, res) => {
  try {
    // Check if diet plan exists and belongs to user
    const existingPlan = await DietPlan.findById(req.params.id);
    if (!existingPlan) {
      return res.status(404).json({ message: 'Diet plan not found' });
    }
    if (existingPlan.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }
    
    // Only allow specific fields to be updated
    const allowedFields = ['meals', 'totalNutrition'];
    const updateData = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });
    
    const dietPlan = await DietPlan.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    res.json(dietPlan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete diet plan
router.delete('/:id', auth, async (req, res) => {
  try {
    // Check if diet plan exists and belongs to user
    const existingPlan = await DietPlan.findById(req.params.id);
    if (!existingPlan) {
      return res.status(404).json({ message: 'Diet plan not found' });
    }
    if (existingPlan.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }
    
    await DietPlan.findByIdAndDelete(req.params.id);
    res.json({ message: 'Diet plan deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;