// backend/models/Stat.js
const mongoose = require('mongoose');

const statSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    value: {
      type: Number,
      required: true,
    },
    change: {
      type: String,
      required: false,
    },
    isCurrency: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Stat', statSchema); // Ensure this export is correct