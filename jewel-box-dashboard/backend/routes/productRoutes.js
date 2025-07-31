// backend/routes/productRoutes.js
const express = require('express');
const router = express.Router(); // Ensure router is initialized
const {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController'); // Ensure path and exports are correct

router.route('/').get(getProducts).post(createProduct);
router.route('/:id').put(updateProduct).delete(deleteProduct);

module.exports = router; // CRUCIAL: Export the router