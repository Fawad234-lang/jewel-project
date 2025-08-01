// src/pages/Products.jsx

import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/Layout/DashboardLayout';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';

const Products = () => {
  const { isDarkMode } = useTheme();
  const { showToast } = useToast();
  const [productsData, setProductsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for delete confirmation modal
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState('');

  // State for edit modal
  const [isEditing, setIsEditing] = useState(false);
  const [editProductId, setEditProductId] = useState(null);
  const [newProductName, setNewProductName] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');
  const [newProductStock, setNewProductStock] = useState('');

  // This will read the environment variable set in Vercel.
  // The .replace(/\/$/, '') part ensures no double slashes.
  const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

  useEffect(() => {
    // Set the document title for the browser tab
    document.title = "Products - Jewel Box App";
  }, []);

  // Effect hook to fetch products when the component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        // Correctly construct the URL using the base URL and the /api/products endpoint
        const url = `${API_BASE_URL}/api/products`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProductsData(data);
        showToast("Products loaded successfully!", "success");
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError("Failed to load products. Please ensure the backend server is running and accessible.");
        showToast("Failed to load products!", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [showToast, API_BASE_URL]);

  // Handler for adding a new product
  const handleAddProduct = async () => {
    // Create a new product object with dummy data
    const newProduct = {
      name: `New Product ${Math.floor(Math.random() * 1000)}`,
      price: Math.floor(Math.random() * 500) + 50,
      stock: Math.floor(Math.random() * 100),
    };
    try {
      const url = `${API_BASE_URL}/api/products`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProduct),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const addedProduct = await response.json();
      // Update the state with the newly added product
      setProductsData((prevData) => [...prevData, addedProduct]);
      showToast("Product added successfully!", "success");
    } catch (err) {
      console.error("Failed to add product:", err);
      showToast("Failed to add product!", "error");
    }
  };

  // Handler to prepare the edit modal with the selected product's data
  const handleEdit = (id) => {
    const productToEdit = productsData.find(p => p._id === id);
    if (!productToEdit) return;

    setEditProductId(id);
    setNewProductName(productToEdit.name);
    setNewProductPrice(productToEdit.price);
    setNewProductStock(productToEdit.stock);
    setIsEditing(true);
  };

  // Handler to submit the edited product data
  const submitEdit = async () => {
    if (!newProductName) {
      showToast("Product name cannot be empty.", "error");
      return;
    }

    try {
      const url = `${API_BASE_URL}/api/products/${editProductId}`;
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newProductName,
          price: parseFloat(newProductPrice), // Convert to float
          stock: parseInt(newProductStock, 10), // Convert to int
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const updatedProduct = await response.json();
      // Update the state with the modified product
      setProductsData((prevData) =>
        prevData.map((product) =>
          product._id === editProductId ? updatedProduct : product
        )
      );
      showToast("Product updated successfully!", "success");
    } catch (err) {
      console.error("Failed to update product:", err);
      showToast("Failed to update product!", "error");
    } finally {
      // Reset the edit state
      setIsEditing(false);
      setEditProductId(null);
      setNewProductName('');
      setNewProductPrice('');
      setNewProductStock('');
    }
  };

  // Handler to show the delete confirmation modal
  const handleDelete = (id) => {
    setConfirmAction(() => () => performDelete(id));
    setConfirmMessage("Are you sure you want to delete this product?");
    setShowConfirm(true);
  };

  // Handler to perform the actual delete operation
  const performDelete = async (id) => {
    try {
      const url = `${API_BASE_URL}/api/products/${id}`;
      const response = await fetch(url, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      // Filter out the deleted product from the state
      setProductsData((prevData) => prevData.filter((product) => product._id !== id));
      showToast("Product deleted successfully!", "success");
    } catch (err) {
      console.error("Failed to delete product:", err);
      showToast("Failed to delete product!", "error");
    } finally {
      // Reset the confirmation state
      setShowConfirm(false);
      setConfirmAction(null);
    }
  };

  // Tailwind CSS classes for table headers and cells
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
                    <th scope="col" className={tableHeaderClasses} style={{ color: 'var(--text-secondary)' }}>Price</th>
                    <th scope="col" className={tableHeaderClasses} style={{ color: 'var(--text-secondary)' }}>Stock</th>
                    <th scope="col" className={tableHeaderClasses} style={{ color: 'var(--text-secondary)' }}>Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-light)' }}>
                  {productsData.map((product) => (
                    <tr key={product._id}>
                      <td className={tableCellClasses} style={{ color: 'var(--text-primary)' }}>{product.name}</td>
                      <td className={tableCellClasses} style={{ color: 'var(--text-primary)' }}>${product.price}</td>
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
          {/* Pagination and summary (static for this example) */}
          <div className="flex justify-between items-center mt-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
            <span>{productsData.length > 0 ? `1 to ${productsData.length} of ${productsData.length}` : '0 to 0 of 0'}</span>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 border rounded-md" style={{ borderColor: 'var(--border-light)', backgroundColor: 'var(--bg-input)' }}>Previous</button>
              <button className="px-3 py-1 border rounded-md" style={{ borderColor: 'var(--border-light)', backgroundColor: 'var(--bg-input)' }}>Next</button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-xl" style={{ backgroundColor: 'var(--bg-card)' }}>
            <p className="text-lg mb-4" style={{ color: 'var(--text-primary)' }}>{confirmMessage}</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 text-sm font-medium rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmAction}
                className="px-4 py-2 text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-xl" style={{ backgroundColor: 'var(--bg-card)' }}>
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Edit Product</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="product-name" className="block text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Product Name</label>
                <input
                  id="product-name"
                  type="text"
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ backgroundColor: 'var(--bg-input)', color: 'var(--text-primary)' }}
                />
              </div>
              <div>
                <label htmlFor="product-price" className="block text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Price</label>
                <input
                  id="product-price"
                  type="number"
                  value={newProductPrice}
                  onChange={(e) => setNewProductPrice(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ backgroundColor: 'var(--bg-input)', color: 'var(--text-primary)' }}
                />
              </div>
              <div>
                <label htmlFor="product-stock" className="block text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Stock</label>
                <input
                  id="product-stock"
                  type="number"
                  value={newProductStock}
                  onChange={(e) => setNewProductStock(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ backgroundColor: 'var(--bg-input)', color: 'var(--text-primary)' }}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-sm font-medium rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={submitEdit}
                className="px-4 py-2 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Products;
