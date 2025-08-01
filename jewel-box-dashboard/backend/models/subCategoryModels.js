// backend/models/subcategoryModels.js
const mongoose = require('mongoose');

const subcategorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a subcategory name'],
      unique: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId, // Reference to the Category model
      ref: 'Category', // The name of the model it refers tos
      required: [true, 'Please select a parent category'],
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

module.exports = mongoose.model('Subcategory', subcategorySchema);