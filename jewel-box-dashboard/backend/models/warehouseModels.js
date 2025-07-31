// backend/models/warehouseModels.js
const mongoose = require('mongoose');

const warehouseSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
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
    timestamps: true,
  }
);

module.exports = mongoose.model('Warehouse', warehouseSchema);