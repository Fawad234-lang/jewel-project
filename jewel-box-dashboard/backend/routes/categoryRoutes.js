// backend/routes/categoryRoutes.js
const express = require('express');
const router = express.Router(); // Ensure router is initialized
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController'); // Ensure path and exports are correct

router.route('/').get(getCategories).post(createCategory);
router.route('/:id').put(updateCategory).delete(deleteCategory);

module.exports = router; // CRUCIAL: Export the router