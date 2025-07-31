// backend/routes/branchRoutes.js
const express = require('express');
const router = express.Router(); // Ensure router is initialized
const {
  getBranches,
  createBranch,
  updateBranch,
  deleteBranch,
} = require('../controllers/branchController'); // Ensure path and exports are correct

router.route('/').get(getBranches).post(createBranch);
router.route('/:id').put(updateBranch).delete(deleteBranch);

module.exports = router; // CRUCIAL: Export the router