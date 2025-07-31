// backend/controllers/statController.js
const Stat = require('../models/Stat');

// @desc    Get all stats
// @route   GET /api/stats
// @access  Public
const getStats = async (req, res) => {
  try {
    const stats = await Stat.find({});
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a stat (for seeding or admin use)
// @route   POST /api/stats
// @access  Public (for now)
const createStat = async (req, res) => {
  const { title, value, change, isCurrency } = req.body;
  if (!title || value === undefined) {
    return res.status(400).json({ message: 'Please provide title and value' });
  }
  try {
    const stat = new Stat({ title, value, change, isCurrency });
    const createdStat = await stat.save();
    res.status(201).json(createdStat);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getStats,
  createStat,
};