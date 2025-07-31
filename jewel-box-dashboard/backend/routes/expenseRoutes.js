// backend/routes/expenseRoutes.js
const express = require('express');
const router = express.Router(); // CRUCIAL: Initialize Express router
const {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
} = require('../controllers/expenseController'); // CRUCIAL: Correct import path for the controller

router.route('/').get(getExpenses).post(createExpense);
router.route('/:id').put(updateExpense).delete(deleteExpense);

module.exports = router; // CRUCIAL: Export the router