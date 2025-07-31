// backend/models/userModels.js
const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
    },
    password: { // In a real app, this would be hashed!
      type: String,
      required: [true, 'Please add a password'],
    },
    role: {
      type: String,
      enum: ['Admin', 'Warehouse Manager', 'Branch Manager', 'Assistant Manager'],
      default: 'Assistant Manager',
    },
    phone: {
      type: String,
      required: [true, 'Please add a phone number'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', userSchema); // CRUCIAL: Exports the Mongoose model