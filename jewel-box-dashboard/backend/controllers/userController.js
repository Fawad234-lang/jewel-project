// backend/controllers/userController.js
const User = require('../models/userModels'); // CRUCIAL: Correct import path for the model

// @desc    Get all users
// @route   GET /api/users
// @access  Public (for now)
const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new user
// @route   POST /api/users
// @access  Public (for now)
const createUser = async (req, res) => {
  const { name, email, password, role, phone } = req.body;

  if (!name || !email || !password || !role || !phone) {
    return res.status(400).json({ message: 'Please enter all fields' });
  }

  try {
    const user = new User({
      name,
      email,
      password,
      role,
      phone,
    });

    const createdUser = await user.save();
    res.status(201).json(createdUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a user
// @route   PUT /api/users/:id
// @access  Public (for now)
const updateUser = async (req, res) => {
  const { name, email, password, role, phone } = req.body;

  try {
    const user = await User.findById(req.params.id);

    if (user) {
      user.name = name || user.name;
      user.email = email || user.email;
      user.password = password || user.password;
      user.role = role || user.role;
      user.phone = phone || user.phone;

      const updatedUser = await user.save();
      res.json(updatedUser);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a user
// @route   DELETE /api/users/:id
// @access  Public (for now)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      await user.deleteOne();
      res.json({ message: 'User removed' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
};