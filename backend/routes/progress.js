const express = require('express');
const Progress = require('../models/Progress');
const auth = require('../middleware/auth');

const router = express.Router();

// Log daily progress
router.post('/', auth, async (req, res) => {
  try {
    const { waterIntake, calories, weight, mood, notes, date } = req.body;
    
    // Input validation
    if (waterIntake !== undefined && (typeof waterIntake !== 'number' || waterIntake < 0)) {
      return res.status(400).json({ message: 'Invalid water intake value' });
    }
    
    if (calories !== undefined && (typeof calories !== 'number' || calories < 0)) {
      return res.status(400).json({ message: 'Invalid calories value' });
    }
    
    const progress = new Progress({
      userId: req.user.userId,
      waterIntake: waterIntake || 0,
      calories: calories || 0,
      weight,
      mood,
      notes,
      date: date || new Date()
    });
    await progress.save();
    res.status(201).json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get progress history
router.get('/:userId', auth, async (req, res) => {
  try {
    // Authorization check - users can only access their own progress
    if (req.params.userId !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const { startDate, endDate } = req.query;
    let filter = { userId: req.params.userId };
    
    if (startDate && endDate) {
      // Validate date format
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return res.status(400).json({ message: 'Invalid date format' });
      }
      
      filter.date = { $gte: start, $lte: end };
    }

    const progress = await Progress.find(filter).sort({ date: -1 });
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;