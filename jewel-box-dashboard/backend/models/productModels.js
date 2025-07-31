// backend/models/productModels.js
const mongoose = require('mongoose');

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a product name'],
      unique: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category', // Refers to the 'Category' model
      required: [true, 'Please select a category'],
    },
    subcategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subcategory', // Refers to the 'Subcategory' model
      required: [true, 'Please select a subcategory'],
    },
    price: {
      type: Number,
      required: [true, 'Please add a price'],
    },
    stock: {
      type: Number,
      required: [true, 'Please add stock quantity'],
      default: 0,
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

module.exports = mongoose.model('Product', productSchema);