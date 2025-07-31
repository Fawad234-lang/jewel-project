// backend/models/expenseModels.js
const mongoose = require('mongoose');

const expenseSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add an expense name'],
    },
    amount: {
      type: Number,
      required: [true, 'Please add an amount'],
    },
    date: {
      type: Date,
      default: Date.now, // Automatically set to current date if not provided
    },
    description: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Expense', expenseSchema); // CRUCIAL: Correct export