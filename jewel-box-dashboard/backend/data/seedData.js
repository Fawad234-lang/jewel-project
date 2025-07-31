// backend/data/seedData.js
const dotenv = require('dotenv');
const connectDB = require('../config/db');
const Stat = require('../models/Stat');
const Order = require('../models/Order');
const Warehouse = require('../models/warehouseModels');
const Branch = require('../models/branchModels');
const User = require('../models/userModels'); // Re-confirmed import
const Category = require('../models/categoryModels');
const Subcategory = require('../models/subcategoryModels');
const Product = require('../models/productModels');
const Expense = require('../models/expenseModels');

// Load environment variables from .env file, relative to seedData.js
dotenv.config({ path: './.env' });

// Call connectDB as an async function
const runSeed = async () => {
  await connectDB(); // Ensure connection is awaited

  try {
    // Clear existing data
    console.log('Destroying existing data...');
    await Stat.deleteMany();
    await Order.deleteMany();
    await Warehouse.deleteMany();
    await Branch.deleteMany();
    await User.deleteMany(); // This should now work correctly
    await Category.deleteMany();
    await Subcategory.deleteMany();
    await Product.deleteMany();
    await Expense.deleteMany();
    console.log('Existing data destroyed.');

    // Hardcoded Dashboard data
    const topStats = [
      { title: 'Customers', value: 6, change: '1.2%' },
      { title: 'Branch Managers', value: 7, change: '0.8%' },
      { title: 'A. Branch Managers', value: 4, change: '0.5%' },
      { title: 'Warehouse Managers', value: 6, change: '1.5%' },
      { title: 'Monthly Sales', value: 32, change: '2.1%' },
    ];

    const recentOrders = [
      { saleID: 'SALE001', branchName: 'Main Branch', customerName: 'Alice Johnson', amount: 15000, status: 'Completed' },
      { saleID: 'SALE002', branchName: 'North Branch', customerName: 'Bob Williams', amount: 22000, status: 'Pending' },
      { saleID: 'SALE003', branchName: 'South Branch', customerName: 'Charlie Brown', amount: 8500, status: 'Completed' },
      { saleID: 'SALE004', branchName: 'Main Branch', customerName: 'Diana Prince', amount: 30000, status: 'Completed' },
      { saleID: 'SALE005', branchName: 'East Branch', customerName: 'Eve Adams', amount: 12000, status: 'Pending' },
    ];

    // Hardcoded Warehouse Data
    const warehousesData = [
      { name: 'Dark Gaming', location: 'Multan', contact: '03188899415' },
      { name: 'random name_Update', location: 'jkgaj/fak', contact: '3458522059' },
      { name: 'testing final', location: 'lahore', contact: '123456789' },
      { name: 'Bandhan Warehouse', location: 'Chungi no:6, Jlal Masjid C...', contact: '0314562025' },
      { name: 'Wapda Town Phase 2', location: 'Wapda Town Phase 2', contact: '03089612255' },
      { name: 'Multan Cantt', location: 'Multan Cantt', contact: '03089612255' },
      { name: 'HomeWarehouse', location: 'Multan', contact: '03188899415' },
      { name: 'Qasim Warehouse', location: 'Wapda Town Phase 1 D.B. ...', contact: '03007529908' },
      { name: 'Test Warehouse', location: 'lahore', contact: '15378588' },
      { name: 'muneeb', location: 'lahore', contact: '62222222' },
    ];

    // Hardcoded Branches Data
    const branchesData = [
      { name: 'Dark Gaming Branch', location: 'Multan', contact: '03188899415' },
      { name: 'testing new Branch', location: 'lahore', contact: '123456789' },
      { name: 'random name_update Branch', location: 'jkgaj/fak', contact: '3458522059' },
      { name: 'testing final Branch', location: 'lahore', contact: '123456789' },
      { name: 'JewelBox Main Branch', location: 'Mall Of Multan, Bypass Chowk, Multan', contact: '+92 314 6201005' },
      { name: 'Suleman Branch', location: 'Model Town Punjab', contact: '03089612255' },
      { name: 'First folder Branch', location: 'Kasur', contact: '12345678910' },
      { name: 'Qasim Naz Branch', location: 'Model Town Multan, Punjab', contact: '0300529905' },
      { name: 'jewl box Branch', location: 'Multn', contact: '874982379' },
    ];

    // Hardcoded Users Data
    const usersData = [
      { name: 'Muhammad Suleman', email: 'sulemanari239@gmail.com', password: 'Aztac@12', role: 'Admin', phone: '3188899415' },
      { name: 'admin', email: 'admin@jewelbox.com', password: 'password123', role: 'Admin', phone: '32121456' },
      { name: 'Warehouse User 1', email: 'whuser1@example.com', password: 'password123', role: 'Warehouse Manager', phone: '1112223333' },
      { name: 'Branch User 1', email: 'bruser1@example.com', password: 'password123', role: 'Branch Manager', phone: '4445556666' },
    ];

    // Hardcoded Categories Data (these need to be inserted first to get their IDs)
    const categoriesToInsert = [
      { name: 'Jewellery', description: 'All kinds of jewellery items.' },
      { name: 'Electronics', description: 'Electronic gadgets and devices.' },
      { name: 'Clothing', description: 'Apparel and fashion items.' },
    ];

    console.log('Importing new data...');
    await Stat.insertMany(topStats);
    await Order.insertMany(recentOrders);
    await Warehouse.insertMany(warehousesData);
    await Branch.insertMany(branchesData);
    await User.insertMany(usersData);

    // Insert categories and store their IDs for subcategories and products
    const insertedCategories = await Category.insertMany(categoriesToInsert);
    const jewelleryCategory = insertedCategories.find(cat => cat.name === 'Jewellery');
    const electronicsCategory = insertedCategories.find(cat => cat.name === 'Electronics');
    const clothingCategory = insertedCategories.find(cat => cat.name === 'Clothing');


    // Insert subcategories and store their IDs for products
    const subcategoriesToInsert = [
      { name: 'Rings', category: jewelleryCategory._id, description: 'Finger rings of various designs.' },
      { name: 'Necklaces', category: jewelleryCategory._id, description: 'Necklaces and pendants.' },
      { name: 'Earrings', category: jewelleryCategory._id, description: 'Earrings of different styles.' },
      { name: 'Smartphones', category: electronicsCategory._id, description: 'Mobile phones and accessories.' },
      { name: 'Laptops', category: electronicsCategory._id, description: 'Portable computers.' },
      { name: 'Shirts', category: clothingCategory._id, description: 'Various types of shirts.' },
      { name: 'Pants', category: clothingCategory._id, description: 'Different styles of pants.' },
    ];
    const insertedSubcategories = await Subcategory.insertMany(subcategoriesToInsert);
    const ringsSubcategory = insertedSubcategories.find(sub => sub.name === 'Rings');
    const smartphonesSubcategory = insertedSubcategories.find(sub => sub.name === 'Smartphones');
    const shirtsSubcategory = insertedSubcategories.find(sub => sub.name === 'Shirts');


    // Hardcoded Products Data (using IDs from inserted categories and subcategories)
    const productsData = [
      { name: 'Diamond Ring', category: jewelleryCategory._id, subcategory: ringsSubcategory._id, price: 50000, stock: 10, description: 'Elegant diamond ring.' },
      { name: 'Gold Necklace', category: jewelleryCategory._id, subcategory: insertedSubcategories.find(sub => sub.name === 'Necklaces')._id, price: 75000, stock: 5, description: '24k gold necklace.' },
      { name: 'iPhone 15', category: electronicsCategory._id, subcategory: smartphonesSubcategory._id, price: 120000, stock: 20, description: 'Latest model smartphone.' },
      { name: 'Gaming Laptop', category: electronicsCategory._id, subcategory: insertedSubcategories.find(sub => sub.name === 'Laptops')._id, price: 180000, stock: 8, description: 'High-performance gaming laptop.' },
      { name: 'Casual Shirt', category: clothingCategory._id, subcategory: shirtsSubcategory._id, price: 2500, stock: 50, description: 'Comfortable cotton shirt.' },
    ];
    await Product.insertMany(productsData);

    // Hardcoded Expenses Data
    const expensesData = [
      { name: 'Office Rent', amount: 50000, date: new Date('2024-07-01'), description: 'Monthly office rent payment.' },
      { name: 'Electricity Bill', amount: 15000, date: new Date('2024-07-10'), description: 'July electricity bill.' },
      { name: 'Internet Bill', amount: 5000, date: new Date('2024-07-15'), description: 'Monthly internet service.' },
      { name: 'Employee Salaries', amount: 200000, date: new Date('2024-07-25'), description: 'July salaries for staff.' },
    ];
    await Expense.insertMany(expensesData);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error during data operation: ${error.message}`);
    process.exit(1);
  }
};

// Determine whether to import or destroy data based on command line argument
if (process.argv[2] === '-d') {
  console.log('Initiating data destruction...');
  runSeed().then(() => console.log('Data destruction complete.')).catch(error => console.error('Data destruction failed:', error));
} else {
  console.log('Initiating data import...');
  runSeed().then(() => console.log('Data import complete.')).catch(error => console.error('Data import failed:', error));
}