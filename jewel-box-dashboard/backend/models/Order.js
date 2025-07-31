// backend/models/Order.js
const mongoose = require('mongoose');

const orderSchema = mongoose.Schema(
  {
    saleID: {
      type: String,
      required: true,
      unique: true,
    },
    branchName: {
      type: String,
      required: true,
    },
    customerName: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['Completed', 'Pending', 'Cancelled'],
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Order', orderSchema); // Ensure this export is correct