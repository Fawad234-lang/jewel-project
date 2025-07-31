// backend/models/branchModels.js
const mongoose = require('mongoose');

const branchSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a branch name'],
      unique: true,
    },
    location: {
      type: String,
      required: [true, 'Please add a location'],
    },
    contact: {
      type: String,
      required: [true, 'Please add a contact number'],
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  }
);

module.exports = mongoose.model('Branch', branchSchema); // This line is crucial for defining and exporting the Mongoose model