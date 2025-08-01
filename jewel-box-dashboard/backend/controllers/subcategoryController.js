// backend/controllers/subcategoryController.js
const Subcategory = require('../models/subcategoryModels'); // Ensure path is correct

// @desc    Get all subcategories
// @route   GET /api/subcategories
// @access  Public (for now)
const getSubcategories = async (req, res) => {
  try {
    // Populate the 'category' field to get category name
    const subcategories = await Subcategory.find({}).populate('category', 'name');
    res.json(subcategories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new subcategory
// @route   POST /api/subcategories
// @access  Public (for now)
const createSubcategory = async (req, res) => {
  const { name, category, description } = req.body; // 'category' here will be the category ID

  if (!name || !category) {
    return res.status(400).json({ message: 'Please enter subcategory name and select a category' });
  }

  try {
    const subcategory = new Subcategory({
      name,
      category,
      description,
    });

    const createdSubcategory = await subcategory.save();
    // Populate the category name before sending response
    await createdSubcategory.populate('category', 'name');
    res.status(201).json(createdSubcategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a subcategory
// @route   PUT /api/subcategories/:id
// @access  Public (for now)
const updateSubcategory = async (req, res) => {
  const { name, category, description } = req.body;

  try {
    const subcategory = await Subcategory.findById(req.params.id);

    if (subcategory) {
      subcategory.name = name || subcategory.name;
      subcategory.category = category || subcategory.category;
      subcategory.description = description || subcategory.description;

      const updatedSubcategory = await subcategory.save();
      // Populate the category name before sending response
      await updatedSubcategory.populate('category', 'name');
      res.json(updatedSubcategory);
    } else {
      res.status(404).json({ message: 'Subcategory not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a subcategory
// @route   DELETE /api/subcategories/:id
// @access  Public (for now)
const deleteSubcategory = async (req, res) => {
  try {
    const subcategory = await Subcategory.findById(req.params.id);

    if (subcategory) {
      await subcategory.deleteOne();
      res.json({ message: 'Subcategory removed' });
    } else {
      res.status(404).json({ message: 'Subcategory not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getSubcategories,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
};