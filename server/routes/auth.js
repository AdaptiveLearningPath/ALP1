const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Utility to generate random parent ID
const generateParentId = () => {
  return 'PARENT-' + Math.random().toString(36).substring(2, 10).toUpperCase();
};

// Signup Route
router.post('/signup', async (req, res) => {
  let { name, email, password, role, parentId } = req.body;

  try {
    // Generate parentId if the user is a parent
    if (role === 'parent') {
      parentId = generateParentId();
    }

    const user = new User({ name, email, password, role, parentId });
    await user.save();

    if (role === 'parent') {
      return res.status(201).json({
        message: 'User registered successfully',
        role,
        parentId
      });
    }

    res.status(201).json({ message: 'User registered successfully', role });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login Route
// Login Route (updated)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email, password });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({
      message: 'Login successful',
      role: user.role,
      parentId: user.parentId,
      _id: user._id,
      name: user.name
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Test route
router.get('/', (req, res) => {
  res.send('Auth API is working!');
});

module.exports = router;
