// backend/routes/userRoutes.js
const express = require('express');
const router = express.Router(); // Initialize Express router
const {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} = require('../controllers/userController'); // Correct import path for the user controller

// Define routes for /api/users
router.route('/')
  .get(getUsers)    // GET /api/users - Get all users
  .post(createUser); // POST /api/users - Create a new user

// Define routes for /api/users/:id
router.route('/:id')
  .put(updateUser)    // PUT /api/users/:id - Update a user by ID
  .delete(deleteUser); // DELETE /api/users/:id - Delete a user by ID

module.exports = router; // Export the configured router