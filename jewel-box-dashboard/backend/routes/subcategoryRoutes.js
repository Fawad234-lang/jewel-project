// backend/routes/subcategoryRoutes.js
const express = require('express');
const router = express.Router(); // Ensure router is initialized
const {
  getSubcategories,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
} = require('../controllers/subcategoryController'); // Ensure path and exports are correct

router.route('/').get(getSubcategories).post(createSubcategory);
router.route('/:id').put(updateSubcategory).delete(deleteSubcategory);

module.exports = router; // CRUCIAL: Export the router