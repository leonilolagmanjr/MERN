const express = require('express');
const authenticate = require('../middleware/authenticate');
const User = require('../models/User');

const router = express.Router();

// Route to Get User Profile
router.get('/profile', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Route to Update User Profile
router.put('/profile', authenticate, async (req, res) => {
  const { name, email } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user, // User's ID from JWT
      { name, email },
      { new: true } // Return the updated user
    );
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
