// backend/controllers/orderController.js
const Order = require('../models/Order');

// @desc    Get all orders
// @route   GET /api/orders
// @access  Public
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({});
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create an order (for seeding or admin use)
// @route   POST /api/orders
// @access  Public (for now)
const createOrder = async (req, res) => {
  const { saleID, branchName, customerName, amount, status } = req.body;
  if (!saleID || !branchName || !customerName || amount === undefined) {
    return res.status(400).json({ message: 'Please provide all required order fields' });
  }
  try {
    const order = new Order({ saleID, branchName, customerName, amount, status });
    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getOrders,
  createOrder,
};