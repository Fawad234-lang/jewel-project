// backend/routes/statRoutes.js
const express = require('express');
const router = express.Router(); // Ensure router is initialized
const { getStats, createStat } = require('../controllers/statController'); // Ensure path and exports are correct

router.route('/').get(getStats).post(createStat);

module.exports = router; // CRUCIAL: Export the router