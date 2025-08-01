// src/pages/Products.jsx
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/Layout/DashboardLayout';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';

const Products = () => {
  const { isDarkMode } = useTheme();
  const { showToast } = useToast();
  const [productsData, setProductsData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Set Page Title ---
  useEffect(() => {
    document.title = "Products - Jewel Box App";
  }, []);

  // --- Fetch Products, Categories, and Subcategories from Backend ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch Products
        const productsResponse = await fetch('http://localhost:5000/api/products');
        if (!productsResponse.ok) {
          throw new Error(`HTTP error! status: ${productsResponse.status} for products`);
        }
        const products = await productsResponse.json();
        setProductsData(products);

        // Fetch Categories
        const categoriesResponse = await fetch('http://localhost:5000/api/categories');
        if (!categoriesResponse.ok) {
          throw new Error(`HTTP error! status: ${categoriesResponse.status} for categories`);
        }
        const categories = await categoriesResponse.json();
        setCategories(categories);

        // Fetch Subcategories
        const subcategoriesResponse = await fetch('http://localhost:5000/api/subcategories');
        if (!subcategoriesResponse.ok) {
          throw new Error(`HTTP error! status: ${subcategoriesResponse.status} for subcategories`);
        }
        const subcategories = await subcategoriesResponse.json();
        setSubcategories(subcategories);

        showToast("Products, Categories, and Subcategories loaded successfully!", "success");
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Failed to load products or related data. Please ensure the backend server is running and data is seeded.");
        showToast(`Failed to load data: ${err.message}`, "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [showToast]);

  const handleAddProduct = async () => {
    const name = prompt("Enter product name:");
    const categoryName = prompt("Enter category name (e.g., Jewellery, Electronics):");
    const subcategoryName = prompt("Enter subcategory name (e.g., Rings, Smartphones):");
    const price = parseFloat(prompt("Enter price:"));
    const stock = parseInt(prompt("Enter stock quantity:"));
    const description = prompt("Enter description (optional):");

    if (!name || !categoryName || !subcategoryName || isNaN(price) || isNaN(stock)) {
      showToast("All required fields must be filled correctly.", "error");
      return;
    }

    const parentCategory = categories.find(cat => cat.name.toLowerCase() === categoryName.toLowerCase());
    if (!parentCategory) {
      showToast("Category not found. Please enter an existing category name.", "error");
      return;
    }

    const parentSubcategory = subcategories.find(sub =>
      sub.name.toLowerCase() === subcategoryName.toLowerCase() && sub.category._id === parentCategory._id
    );
    if (!parentSubcategory) {
      showToast("Subcategory not found under the selected category. Please enter an existing subcategory name.", "error");
      return;
    }

    const newProduct = {
      name,
      category: parentCategory._id,
      subcategory: parentSubcategory._id,
      price,
      stock,
      description,
    };

    try {
      const response = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProduct),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message}`);
      }
      const addedProduct = await response.json();
      setProductsData((prevData) => [...prevData, addedProduct]);
      showToast("Product added successfully!", "success");
    } catch (err) {
      console.error("Failed to add product:", err);
      showToast(`Failed to add product: ${err.message}`, "error");
    }
  };

  const handleEdit = async (id) => {
    const currentProduct = productsData.find(p => p._id === id);
    if (!currentProduct) return;

    const newName = prompt("Enter new name:", currentProduct.name);
    const newCategoryName = prompt("Enter new category name:", currentProduct.category.name);
    const newSubcategoryName = prompt("Enter new subcategory name:", currentProduct.subcategory.name);
    const newPrice = parseFloat(prompt("Enter new price:", currentProduct.price));
    const newStock = parseInt(prompt("Enter new stock quantity:", currentProduct.stock));
    const newDescription = prompt("Enter new description:", currentProduct.description);

    if (!newName || !newCategoryName || !newSubcategoryName || isNaN(newPrice) || isNaN(newStock)) {
      showToast("All required fields must be filled correctly for update.", "error");
      return;
    }

    const parentCategory = categories.find(cat => cat.name.toLowerCase() === newCategoryName.toLowerCase());
    if (!parentCategory) {
      showToast("New category not found. Please enter an existing category name.", "error");
      return;
    }

    const parentSubcategory = subcategories.find(sub =>
      sub.name.toLowerCase() === newSubcategoryName.toLowerCase() && sub.category._id === parentCategory._id
    );
    if (!parentSubcategory) {
      showToast("New subcategory not found under the selected category. Please enter an existing subcategory name.", "error");
      return;
    }

    const updatedFields = {
      name: newName,
      category: parentCategory._id,
      subcategory: parentSubcategory._id,
      price: newPrice,
      stock: newStock,
      description: newDescription,
    };

    try {
      const response = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedFields),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message}`);
      }
      const updatedProduct = await response.json();
      setProductsData((prevData) =>
        prevData.map((product) =>
          product._id === id ? updatedProduct : product
        )
      );
      showToast("Product updated successfully!", "success");
    } catch (err) {
      console.error("Failed to update product:", err);
      showToast(`Failed to update product: ${err.message}`, "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }
    try {
      const response = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message}`);
      }
      setProductsData((prevData) => prevData.filter((product) => product._id !== id));
      showToast("Product deleted successfully!", "success");
    } catch (err) {
      console.error("Failed to delete product:", err);
      showToast(`Failed to delete product: ${err.message}`, "error");
    }
  };

  const tableHeaderClasses = "px-6 py-3 text-left text-xs font-medium uppercase tracking-wider";
  const tableCellClasses = "px-6 py-4 whitespace-nowrap text-sm";

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>Products</h1>
          <button
            onClick={handleAddProduct}
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition duration-150 ease-in-out"
          >
            Add New Product
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md transition-colors duration-200" style={{ backgroundColor: 'var(--bg-card)' }}>
          {loading ? (
            <p style={{ color: 'var(--text-secondary)' }}>Loading products...</p>
          ) : error ? (
            <p style={{ color: 'var(--text-red)' }}>Error: {error}</p>
          ) : productsData.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)' }}>No products found. Add one!</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y" style={{ borderColor: 'var(--border-light)' }}>
                <thead style={{ backgroundColor: 'var(--bg-table-header)' }}>
                  <tr>
                    <th scope="col" className={tableHeaderClasses} style={{ color: 'var(--text-secondary)' }}>Name</th>
                    <th scope="col" className={tableHeaderClasses} style={{ color: 'var(--text-secondary)' }}>Category</th>
                    <th scope="col" className={tableHeaderClasses} style={{ color: 'var(--text-secondary)' }}>Subcategory</th>
                    <th scope="col" className={tableHeaderClasses} style={{ color: 'var(--text-secondary)' }}>Price</th>
                    <th scope="col" className={tableHeaderClasses} style={{ color: 'var(--text-secondary)' }}>Stock</th>
                    <th scope="col" className={tableHeaderClasses} style={{ color: 'var(--text-secondary)' }}>Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-light)' }}>
                  {productsData.map((product) => (
                    <tr key={product._id}>
                      <td className={tableCellClasses} style={{ color: 'var(--text-primary)' }}>{product.name}</td>
                      <td className={tableCellClasses} style={{ color: 'var(--text-primary)' }}>{product.category ? product.category.name : 'N/A'}</td>
                      <td className={tableCellClasses} style={{ color: 'var(--text-primary)' }}>{product.subcategory ? product.subcategory.name : 'N/A'}</td>
                      <td className={tableCellClasses} style={{ color: 'var(--text-primary)' }}>Rs {product.price.toLocaleString('en-IN')}</td>
                      <td className={tableCellClasses} style={{ color: 'var(--text-primary)' }}>{product.stock}</td>
                      <td className={tableCellClasses}>
                        <div className="flex items-center space-x-2">
                          <button onClick={() => handleEdit(product._id)} className="text-blue-500 hover:text-blue-700">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.75" />
                            </svg>
                          </button>
                          <button onClick={() => handleDelete(product._id)} className="text-red-500 hover:text-red-700">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.262 9m10.118-3.468a.75.75 0 0 0 0-1.06L18.47 3.22a.75.75 0 0 0-1.06 0l-1.06 1.06M16.5 7.5h-9m9 0H12m-2.25 4.5h3.5m-3.5 0a.75.75 0 0 1-.75.75h-.75a.75.75 0 0 1-.75-.75m1.5 0V12m0 0a.75.75 0 0 0-.75-.75h-.75a.75.75 0 0 0-.75.75m1.5 0V12m0 0a.75.75 0 0 0-.75-.75h-.75a.75.75 0 0 0-.75.75m1.5 0V12" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 7.5h-15V21a1.5 1.5 0 0 0 1.5 1.5h12a1.5 1.5 0 0 0 1.5-1.5V7.5Z" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {/* Pagination Placeholder */}
          <div className="flex justify-between items-center mt-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
            <span>{productsData.length > 0 ? `1 to ${productsData.length} of ${productsData.length}` : '0 to 0 of 0'}</span>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 border rounded-md" style={{ borderColor: 'var(--border-light)', backgroundColor: 'var(--bg-input)' }}>Previous</button>
              <button className="px-3 py-1 border rounded-md" style={{ borderColor: 'var(--border-light)', backgroundColor: 'var(--bg-input)' }}>Next</button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Products;