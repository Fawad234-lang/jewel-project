// backend/routes/warehouseRoutes.js
const express = require('express');
const router = express.Router();
const {
  getWarehouses,
  createWarehouse,
  updateWarehouse,
  deleteWarehouse,
} = require('../controllers/warehouseController'); // Corrected import path

router.route('/').get(getWarehouses).post(createWarehouse);
router.route('/:id').put(updateWarehouse).delete(deleteWarehouse);

module.exports = router;