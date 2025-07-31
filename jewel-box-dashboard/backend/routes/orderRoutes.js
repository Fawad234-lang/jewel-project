// backend/routes/orderRoutes.js
const express = require('express');
const router = express.Router(); // Ensure router is initialized
const { getOrders, createOrder } = require('../controllers/orderController'); // Ensure path and exports are correct

router.route('/').get(getOrders).post(createOrder);

module.exports = router; // CRUCIAL: Export the router