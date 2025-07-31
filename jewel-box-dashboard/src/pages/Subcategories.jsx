// src/pages/Subcategories.jsx
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/Layout/DashboardLayout';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';

const Subcategories = () => {
  const { isDarkMode } = useTheme();
  const { showToast } = useToast();
  const [subcategoriesData, setSubcategoriesData] = useState([]);
  const [categories, setCategories] = useState([]); // To store categories for dropdown
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Set Page Title ---
  useEffect(() => {
    document.title = "Subcategories - Jewel Box App";
  }, []);

  // --- Fetch Subcategories and Categories from Backend ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch Subcategories
        const subcategoriesResponse = await fetch('http://localhost:5000/api/subcategories');
        if (!subcategoriesResponse.ok) {
          throw new Error(`HTTP error! status: ${subcategoriesResponse.status} for subcategories`);
        }
        const subcategoriesData = await subcategoriesResponse.json();
        setSubcategoriesData(subcategoriesData);

        // Fetch Categories (for the dropdown in add/edit forms)
        const categoriesResponse = await fetch('http://localhost:5000/api/categories');
        if (!categoriesResponse.ok) {
          throw new Error(`HTTP error! status: ${categoriesResponse.status} for categories`);
        }
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);

        showToast("Subcategories and Categories loaded successfully!", "success");
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Failed to load subcategories or categories. Please ensure the backend server is running and data is seeded.");
        showToast(`Failed to load data: ${err.message}`, "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [showToast]);

  const handleAddSubcategory = async () => {
    const name = prompt("Enter subcategory name:");
    // Prompt for category ID or name and then find ID
    const categoryName = prompt("Enter parent category name (e.g., Jewellery, Electronics):");
    const description = prompt("Enter subcategory description (optional):");

    if (!name || !categoryName) {
      showToast("Subcategory name and parent category are required.", "error");
      return;
    }

    const parentCategory = categories.find(cat => cat.name.toLowerCase() === categoryName.toLowerCase());
    if (!parentCategory) {
      showToast("Parent category not found. Please enter an existing category name.", "error");
      return;
    }

    const newSubcategory = {
      name,
      category: parentCategory._id, // Send category ID to backend
      description
    };

    try {
      const response = await fetch('http://localhost:5000/api/subcategories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSubcategory),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message}`);
      }
      const addedSubcategory = await response.json();
      setSubcategoriesData((prevData) => [...prevData, addedSubcategory]);
      showToast("Subcategory added successfully!", "success");
    } catch (err) {
      console.error("Failed to add subcategory:", err);
      showToast(`Failed to add subcategory: ${err.message}`, "error");
    }
  };

  const handleEdit = async (id) => {
    const currentSubcategory = subcategoriesData.find(s => s._id === id);
    if (!currentSubcategory) return;

    const newName = prompt("Enter new name:", currentSubcategory.name);
    const newCategoryName = prompt("Enter new parent category name:", currentSubcategory.category.name);
    const newDescription = prompt("Enter new description:", currentSubcategory.description);

    if (!newName || !newCategoryName) {
      showToast("Subcategory name and parent category are required for update.", "error");
      return;
    }

    const parentCategory = categories.find(cat => cat.name.toLowerCase() === newCategoryName.toLowerCase());
    if (!parentCategory) {
      showToast("New parent category not found. Please enter an existing category name.", "error");
      return;
    }

    const updatedFields = {
      name: newName,
      category: parentCategory._id, // Send category ID
      description: newDescription,
    };

    try {
      const response = await fetch(`http://localhost:5000/api/subcategories/${id}`, {
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
      const updatedSubcategory = await response.json();
      setSubcategoriesData((prevData) =>
        prevData.map((subcategory) =>
          subcategory._id === id ? updatedSubcategory : subcategory
        )
      );
      showToast("Subcategory updated successfully!", "success");
    } catch (err) {
      console.error("Failed to update subcategory:", err);
      showToast(`Failed to update subcategory: ${err.message}`, "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this subcategory?")) {
      return;
    }
    try {
      const response = await fetch(`http://localhost:5000/api/subcategories/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message}`);
      }
      setSubcategoriesData((prevData) => prevData.filter((subcategory) => subcategory._id !== id));
      showToast("Subcategory deleted successfully!", "success");
    } catch (err) {
      console.error("Failed to delete subcategory:", err);
      showToast(`Failed to delete subcategory: ${err.message}`, "error");
    }
  };

  const tableHeaderClasses = "px-6 py-3 text-left text-xs font-medium uppercase tracking-wider";
  const tableCellClasses = "px-6 py-4 whitespace-nowrap text-sm";

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>Subcategories</h1>
          <button
            onClick={handleAddSubcategory}
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition duration-150 ease-in-out"
          >
            Add New Subcategory
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md transition-colors duration-200" style={{ backgroundColor: 'var(--bg-card)' }}>
          {loading ? (
            <p style={{ color: 'var(--text-secondary)' }}>Loading subcategories...</p>
          ) : error ? (
            <p style={{ color: 'var(--text-red)' }}>Error: {error}</p>
          ) : subcategoriesData.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)' }}>No subcategories found. Add one!</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y" style={{ borderColor: 'var(--border-light)' }}>
                <thead style={{ backgroundColor: 'var(--bg-table-header)' }}>
                  <tr>
                    <th scope="col" className={tableHeaderClasses} style={{ color: 'var(--text-secondary)' }}>Name</th>
                    <th scope="col" className={tableHeaderClasses} style={{ color: 'var(--text-secondary)' }}>Category</th>
                    <th scope="col" className={tableHeaderClasses} style={{ color: 'var(--text-secondary)' }}>Description</th>
                    <th scope="col" className={tableHeaderClasses} style={{ color: 'var(--text-secondary)' }}>Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-light)' }}>
                  {subcategoriesData.map((subcategory) => (
                    <tr key={subcategory._id}>
                      <td className={tableCellClasses} style={{ color: 'var(--text-primary)' }}>{subcategory.name}</td>
                      <td className={tableCellClasses} style={{ color: 'var(--text-primary)' }}>{subcategory.category ? subcategory.category.name : 'N/A'}</td> {/* Display category name */}
                      <td className={tableCellClasses} style={{ color: 'var(--text-primary)' }}>{subcategory.description}</td>
                      <td className={tableCellClasses}>
                        <div className="flex items-center space-x-2">
                          <button onClick={() => handleEdit(subcategory._id)} className="text-blue-500 hover:text-blue-700">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.75" />
                            </svg>
                          </button>
                          <button onClick={() => handleDelete(subcategory._id)} className="text-red-500 hover:text-red-700">
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
            <span>{subcategoriesData.length > 0 ? `1 to ${subcategoriesData.length} of ${subcategoriesData.length}` : '0 to 0 of 0'}</span>
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

export default Subcategories;