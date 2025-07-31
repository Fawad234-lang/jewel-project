// backend/server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Import all route modules
// Ensure these files exist in backend/routes/ and correctly export 'router'
const warehouseRoutes = require('./routes/warehouseRoutes');
const statRoutes = require('./routes/statRoutes');
const orderRoutes = require('./routes/orderRoutes');
const branchRoutes = require('./routes/branchRoutes');
const userRoutes = require('./routes/userRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const subcategoryRoutes = require('./routes/subcategoryRoutes');
const productRoutes = require('./routes/productRoutes');
const expenseRoutes = require('./routes/expenseRoutes');

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Use all route modules
// The error is likely caused if any of these imported modules are 'undefined' or not a proper router
app.use('/api/warehouses', warehouseRoutes);
app.use('/api/stats', statRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/branches', branchRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/subcategories', subcategoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/expenses', expenseRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});