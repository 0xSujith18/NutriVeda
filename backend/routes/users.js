const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get user profile
router.get('/:id', auth, async (req, res) => {
  try {
    // Check if user can access this profile
    if (req.params.id !== req.user.userId) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }
    
    const user = await User.findById(req.params.id).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user profile
router.put('/:id', auth, async (req, res) => {
  try {
    // Check if user can update this profile
    if (req.params.id !== req.user.userId) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }
    
    const { name, doshaType, preferences } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, doshaType, preferences },
      { new: true }
    ).select('-passwordHash');
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;