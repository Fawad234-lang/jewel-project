// src/pages/Categories.jsx
import React, { useState, useEffect, useMemo } from 'react';
import DashboardLayout from '../components/Layout/DashboardLayout';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';

const Categories = () => {
  const { isDarkMode } = useTheme();
  const { showToast } = useToast();
  const [categoriesData, setCategoriesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Custom Table State ---
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [globalFilter, setGlobalFilter] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  // --- Set Page Title ---
  useEffect(() => {
    document.title = "Categories - Jewel Box App";
  }, []);

  // --- Fetch Categories from Backend ---
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('http://localhost:5000/api/categories'); // Your backend API URL
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCategoriesData(data);
        showToast("Categories loaded successfully!", "success");
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        setError("Failed to load categories. Please ensure the backend server is running and data is seeded.");
        showToast("Failed to load categories!", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [showToast]);

  const handleAddCategory = async () => {
    const name = prompt("Enter category name:");
    const description = prompt("Enter category description (optional):");

    if (!name) {
      showToast("Category name is required.", "error");
      return;
    }

    const newCategory = { name, description };

    try {
      const response = await fetch('http://localhost:5000/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCategory),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message}`);
      }
      const addedCategory = await response.json();
      setCategoriesData((prevData) => [...prevData, addedCategory]);
      showToast("Category added successfully!", "success");
    } catch (err) {
      console.error("Failed to add category:", err);
      showToast(`Failed to add category: ${err.message}`, "error");
    }
  };

  const handleEdit = async (id) => {
    const currentCategory = categoriesData.find(c => c._id === id);
    if (!currentCategory) return;

    const newName = prompt("Enter new name:", currentCategory.name);
    const newDescription = prompt("Enter new description:", currentCategory.description);

    if (!newName) {
      showToast("Category name is required for update.", "error");
      return;
    }

    const updatedFields = {
      name: newName,
      description: newDescription,
    };

    try {
      const response = await fetch(`http://localhost:5000/api/categories/${id}`, {
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
      const updatedCategory = await response.json();
      setCategoriesData((prevData) =>
        prevData.map((category) =>
          category._id === id ? updatedCategory : category
        )
      );
      showToast("Category updated successfully!", "success");
    } catch (err) {
      console.error("Failed to update category:", err);
      showToast(`Failed to update category: ${err.message}`, "error");
    }
  };

  const handleDeleteClick = (id) => {
    setCategoryToDelete(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;

    try {
      const response = await fetch(`http://localhost:5000/api/categories/${categoryToDelete}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message}`);
      }
      setCategoriesData((prevData) => prevData.filter((category) => category._id !== categoryToDelete));
      showToast("Category deleted successfully!", "success");
    } catch (err) {
      console.error("Failed to delete category:", err);
      showToast(`Failed to delete category: ${err.message}`, "error");
    } finally {
      setShowDeleteConfirm(false);
      setCategoryToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setCategoryToDelete(null);
  };

  // --- Custom Table Logic ---
  const sortedAndFilteredCategories = useMemo(() => {
    let sortableItems = [...categoriesData];

    // Apply global filter
    if (globalFilter) {
      sortableItems = sortableItems.filter(item =>
        Object.values(item).some(value =>
          String(value).toLowerCase().includes(globalFilter.toLowerCase())
        )
      );
    }

    // Apply sorting
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [categoriesData, sortConfig, globalFilter]);

  const totalPages = Math.ceil(sortedAndFilteredCategories.length / itemsPerPage);
  const paginatedCategories = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedAndFilteredCategories.slice(startIndex, endIndex);
  }, [sortedAndFilteredCategories, currentPage, itemsPerPage]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const tableHeaderClasses = "px-6 py-3 text-left text-xs font-medium uppercase tracking-wider";
  const tableCellClasses = "px-6 py-4 whitespace-nowrap text-sm";
  const formElementClasses = "border rounded-md px-3 py-1.5 text-sm focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200";
  const searchInputClasses = "w-full sm:w-auto flex-grow px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors duration-200";


  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
          <h1 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>Categories</h1>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search categories..."
              className={searchInputClasses}
              style={{
                borderColor: 'var(--border-light)',
                backgroundColor: 'var(--bg-input)',
                color: 'var(--text-primary)',
                '--tw-placeholder-color': 'var(--text-placeholder)'
              }}
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
            />
            <button
              onClick={handleAddCategory}
              className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition duration-150 ease-in-out w-full sm:w-auto"
            >
              Add New Category
            </button>
          </div>
        </div>

        <div className="p-6 rounded-lg shadow-md transition-colors duration-200" style={{ backgroundColor: 'var(--bg-card)' }}>
          {loading ? (
            <p style={{ color: 'var(--text-secondary)' }}>Loading categories...</p>
          ) : error ? (
            <p style={{ color: 'var(--text-red)' }}>Error: {error}</p>
          ) : categoriesData.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)' }}>No categories found. Add one!</p>
          ) : (
            <>
              <div className="overflow-x-auto rounded-lg border" style={{ borderColor: 'var(--border-light)' }}>
                <table className="min-w-full divide-y" style={{ borderColor: 'var(--border-light)' }}>
                  <thead style={{ backgroundColor: 'var(--bg-table-header)' }}>
                    <tr>
                      <th scope="col" className={`${tableHeaderClasses} cursor-pointer`} style={{ color: 'var(--text-secondary)' }} onClick={() => requestSort('name')}>
                        Name {sortConfig.key === 'name' && (sortConfig.direction === 'ascending' ? '▲' : '▼')}
                      </th>
                      <th scope="col" className={`${tableHeaderClasses} cursor-pointer`} style={{ color: 'var(--text-secondary)' }} onClick={() => requestSort('description')}>
                        Description {sortConfig.key === 'description' && (sortConfig.direction === 'ascending' ? '▲' : '▼')}
                      </th>
                      <th scope="col" className={tableHeaderClasses} style={{ color: 'var(--text-secondary)' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-light)' }}>
                    {paginatedCategories.map((category) => (
                      <tr key={category._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                        <td className={tableCellClasses} style={{ color: 'var(--text-primary)' }}>{category.name}</td>
                        <td className={tableCellClasses} style={{ color: 'var(--text-primary)' }}>{category.description}</td>
                        <td className={tableCellClasses}>
                          <div className="flex items-center space-x-2">
                            <button onClick={() => handleEdit(category._id)} className="text-blue-500 hover:text-blue-700">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.75" />
                              </svg>
                            </button>
                            <button onClick={() => handleDeleteClick(category._id)} className="text-red-500 hover:text-red-700">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.262 9m10.118-3.468a.75.75 0 0 0 0-1.06L18.47 3.22a.75.75 0 0 0-1.06 0l-1.06 1.06M16.5 7.5h-9m9 0H12m-2.25 4.5h3.5m-3.5 0a.75.75 0 0 1-.75.75h-.75a.75.75 0 0 1-.75-.75m1.5 0V12m0 0a.75.75 0 0 0-.75-.75h-.75a.75.75 0 0 0-.75.75m1.5 0V12m0 0a.75.75 0 0 0-.75-.75h-.75a.75.75 0 0 0-.75.75m1.5 0V12" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 7.5h-15V21a1.5 1.5 0 0 0 1.5 1.5h12a1.5 1.5 0 0 0 1.5-1.5V7.5Z" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {paginatedCategories.length === 0 && (
                      <tr>
                        <td colSpan="3" className="px-6 py-4 text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
                          No categories found matching your criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {/* Pagination Controls */}
              <div className="flex items-center justify-between p-4 border-t rounded-b-lg" style={{ borderColor: 'var(--border-light)', backgroundColor: 'var(--bg-card)' }}>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {'<<'}
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {'<'}
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {'>'}
                  </button>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {'>>'}
                  </button>
                </div>
                <span className="flex items-center gap-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Page{' '}
                  <strong>
                    {currentPage} of{' '}
                    {totalPages}
                  </strong>
                </span>
                <span className="flex items-center gap-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  | Go to page:{' '}
                  <input
                    type="number"
                    defaultValue={currentPage}
                    onChange={e => {
                      const page = Number(e.target.value);
                      if (page > 0 && page <= totalPages) {
                        setCurrentPage(page);
                      }
                    }}
                    className="w-16 p-1 border rounded-md text-sm"
                    style={{ borderColor: 'var(--border-light)', backgroundColor: 'var(--bg-input)', color: 'var(--text-primary)' }}
                  />
                </span>
                <select
                  value={itemsPerPage}
                  onChange={e => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1); // Reset to first page when items per page changes
                  }}
                  className="p-1 border rounded-md text-sm"
                  style={{ borderColor: 'var(--border-light)', backgroundColor: 'var(--bg-input)', color: 'var(--text-primary)' }}
                >
                  {[5, 10, 20, 30, 40, 50].map(pageSize => (
                    <option key={pageSize} value={pageSize}>
                      Show {pageSize}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Custom Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-sm w-full text-center">
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Confirm Deletion</h3>
            <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>Are you sure you want to delete this category? This action cannot be undone.</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Categories;