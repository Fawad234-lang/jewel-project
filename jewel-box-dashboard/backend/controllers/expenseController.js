// backend/controllers/expenseController.js
const Expense = require('../models/expenseModels'); // CRUCIAL: Correct import path for the model

// @desc    Get all expenses
// @route   GET /api/expenses
// @access  Public (for now)
const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({});
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new expense
// @route   POST /api/expenses
// @access  Public (for now)
const createExpense = async (req, res) => {
  const { name, amount, date, description } = req.body;

  if (!name || amount === undefined) {
    return res.status(400).json({ message: 'Please enter expense name and amount' });
  }

  try {
    const expense = new Expense({
      name,
      amount,
      date: date ? new Date(date) : Date.now(), // Use provided date or current date
      description,
    });

    const createdExpense = await expense.save();
    res.status(201).json(createdExpense);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update an expense
// @route   PUT /api/expenses/:id
// @access  Public (for now)
const updateExpense = async (req, res) => {
  const { name, amount, date, description } = req.body;

  try {
    const expense = await Expense.findById(req.params.id);

    if (expense) {
      expense.name = name !== undefined ? name : expense.name;
      expense.amount = amount !== undefined ? amount : expense.amount;
      expense.date = date ? new Date(date) : expense.date;
      expense.description = description !== undefined ? description : expense.description;

      const updatedExpense = await expense.save();
      res.json(updatedExpense);
    } else {
      res.status(404).json({ message: 'Expense not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete an expense
// @route   DELETE /api/expenses/:id
// @access  Public (for now)
const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (expense) {
      await expense.deleteOne();
      res.json({ message: 'Expense removed' });
    } else {
      res.status(404).json({ message: 'Expense not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { // CRUCIAL: Ensure this export is correct
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
};