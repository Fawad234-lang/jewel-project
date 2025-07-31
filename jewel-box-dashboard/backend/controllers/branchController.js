// backend/controllers/branchController.js
const Branch = require('../models/branchModels'); // CHANGED: Updated import to branchModels

// @desc    Get all branches
// @route   GET /api/branches
// @access  Public (for now)
const getBranches = async (req, res) => {
  try {
    const branches = await Branch.find({});
    res.json(branches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new branch
// @route   POST /api/branches
// @access  Public (for now)
const createBranch = async (req, res) => {
  const { name, location, contact } = req.body;

  if (!name || !location || !contact) {
    return res.status(400).json({ message: 'Please enter all fields' });
  }

  try {
    const branch = new Branch({
      name,
      location,
      contact,
    });

    const createdBranch = await branch.save();
    res.status(201).json(createdBranch);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a branch
// @route   PUT /api/branches/:id
// @access  Public (for now)
const updateBranch = async (req, res) => {
  const { name, location, contact } = req.body;

  try {
    const branch = await Branch.findById(req.params.id);

    if (branch) {
      branch.name = name || branch.name;
      branch.location = location || branch.location;
      branch.contact = contact || branch.contact;

      const updatedBranch = await branch.save();
      res.json(updatedBranch);
    } else {
      res.status(404).json({ message: 'Branch not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a branch
// @route   DELETE /api/branches/:id
// @access  Public (for now)
const deleteBranch = async (req, res) => {
  try {
    const branch = await Branch.findById(req.params.id);

    if (branch) {
      await branch.deleteOne();
      res.json({ message: 'Branch removed' });
    } else {
      res.status(404).json({ message: 'Branch not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getBranches,
  createBranch,
  updateBranch,
  deleteBranch,
};