// backend/controllers/productController.js
const Product = require('../models/productModels'); // Ensure path is correct

// @desc    Get all products
// @route   GET /api/products
// @access  Public (for now)
const getProducts = async (req, res) => {
  try {
    // Populate category and subcategory names
    const products = await Product.find({})
      .populate('category', 'name')
      .populate('subcategory', 'name');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new product
// @route   POST /api/products
// @access  Public (for now)
const createProduct = async (req, res) => {
  const { name, category, subcategory, price, stock, description } = req.body;

  if (!name || !category || !subcategory || price === undefined || stock === undefined) {
    return res.status(400).json({ message: 'Please enter all required fields: name, category, subcategory, price, stock' });
  }

  try {
    const product = new Product({
      name,
      category,
      subcategory,
      price,
      stock,
      description,
    });

    const createdProduct = await product.save();
    // Populate category and subcategory names before sending response
    await createdProduct.populate('category', 'name');
    await createdProduct.populate('subcategory', 'name');
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Public (for now)
const updateProduct = async (req, res) => {
  const { name, category, subcategory, price, stock, description } = req.body;

  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.category = category || product.category;
      product.subcategory = subcategory || product.subcategory;
      product.price = price !== undefined ? price : product.price;
      product.stock = stock !== undefined ? stock : product.stock;
      product.description = description || product.description;

      const updatedProduct = await product.save();
      // Populate category and subcategory names before sending response
      await updatedProduct.populate('category', 'name');
      await updatedProduct.populate('subcategory', 'name');
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Public (for now)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};