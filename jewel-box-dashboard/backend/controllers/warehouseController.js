// backend/controllers/warehouseController.js
const Warehouse = require('../models/warehouseModels'); // Corrected import path

// @desc    Get all warehouses
// @route   GET /api/warehouses
// @access  Public (for now)
const getWarehouses = async (req, res) => {
  try {
    const warehouses = await Warehouse.find({});
    res.json(warehouses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new warehouse
// @route   POST /api/warehouses
// @access  Public (for now)
const createWarehouse = async (req, res) => {
  const { name, location, contact } = req.body;

  if (!name || !location || !contact) {
    return res.status(400).json({ message: 'Please enter all fields' });
  }

  try {
    const warehouse = new Warehouse({
      name,
      location,
      contact,
    });

    const createdWarehouse = await warehouse.save();
    res.status(201).json(createdWarehouse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a warehouse
// @route   PUT /api/warehouses/:id
// @access  Public (for now)
const updateWarehouse = async (req, res) => {
  const { name, location, contact } = req.body;

  try {
    const warehouse = await Warehouse.findById(req.params.id);

    if (warehouse) {
      warehouse.name = name || warehouse.name;
      warehouse.location = location || warehouse.location;
      warehouse.contact = contact || warehouse.contact;

      const updatedWarehouse = await warehouse.save();
      res.json(updatedWarehouse);
    } else {
      res.status(404).json({ message: 'Warehouse not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a warehouse
// @route   DELETE /api/warehouses/:id
// @access  Public (for now)
const deleteWarehouse = async (req, res) => {
  try {
    const warehouse = await Warehouse.findById(req.params.id);

    if (warehouse) {
      await warehouse.deleteOne();
      res.json({ message: 'Warehouse removed' });
    } else {
      res.status(404).json({ message: 'Warehouse not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getWarehouses,
  createWarehouse,
  updateWarehouse,
  deleteWarehouse,
};