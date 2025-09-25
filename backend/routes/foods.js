const express = require('express');
const Food = require('../models/Food');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all foods with filtering
router.get('/', auth, async (req, res) => {
  try {
    const { category, season, dosha, page = 1, limit = 50 } = req.query;
    let filter = {};
    
    // Validate and sanitize inputs
    if (category && typeof category === 'string') {
      filter.category = category;
    }
    if (season && typeof season === 'string') {
      filter.season = { $in: [season] };
    }
    if (dosha && typeof dosha === 'string' && ['vata', 'pitta', 'kapha'].includes(dosha)) {
      filter[`doshaEffect.${dosha}`] = 'decrease';
    }

    // Add pagination
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 50));
    const skip = (pageNum - 1) * limitNum;

    const foods = await Food.find(filter).limit(limitNum).skip(skip);
    const total = await Food.countDocuments(filter);
    
    res.json({
      foods,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get food by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) {
      return res.status(404).json({ message: 'Food not found' });
    }
    res.json(food);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;