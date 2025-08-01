import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/Layout/DashboardLayout';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import {
  PencilSquareIcon,
  TrashIcon,
  PlusIcon,
  ArrowRightIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/solid';

const Subcategories = () => {
  const { isDarkMode } = useTheme();
  const { showToast } = useToast();

  // State for subcategories and categories data
  const [subcategoriesData, setSubcategoriesData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for adding a new subcategory
  const [isAdding, setIsAdding] = useState(false);
  const [newSubcategoryName, setNewSubcategoryName] = useState('');
  const [newSubcategoryCategoryId, setNewSubcategoryCategoryId] = useState('');
  const [newSubcategoryDescription, setNewSubcategoryDescription] = useState('');

  // State for editing a subcategory
  const [isEditing, setIsEditing] = useState(false);
  const [editSubcategoryId, setEditSubcategoryId] = useState(null);
  const [editSubcategoryName, setEditSubcategoryName] = useState('');
  const [editSubcategoryCategoryId, setEditSubcategoryCategoryId] = useState('');
  const [editSubcategoryDescription, setEditSubcategoryDescription] = useState('');

  // State for the confirmation modal (for deletion)
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState('');

  // Environment variable for API URL
  const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

  // Set page title on component mount
  useEffect(() => {
    document.title = "Subcategories - Jewel Box App";
  }, []);

  // Fetch subcategories and categories from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const subcategoriesResponse = await fetch(`${API_BASE_URL}/api/subcategories`);
        if (!subcategoriesResponse.ok) {
          throw new Error(`HTTP error! status: ${subcategoriesResponse.status} for subcategories`);
        }
        const subcategoriesData = await subcategoriesResponse.json();
        // The subcategory data from the backend might not be consistent with the category names.
        // It is better to rely on the fetched categories data to get the names for rendering.
        setSubcategoriesData(subcategoriesData);

        const categoriesResponse = await fetch(`${API_BASE_URL}/api/categories`);
        if (!categoriesResponse.ok) {
          throw new Error(`HTTP error! status: ${categoriesResponse.status} for categories`);
        }
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);

        showToast("Subcategories and Categories loaded successfully!", "success");
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Failed to load subcategories or categories. Please ensure the backend server is running and accessible.");
        showToast("Failed to load data!", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [showToast, API_BASE_URL]);

  // Handle opening the "add" modal
  const handleOpenAddModal = () => {
    setNewSubcategoryName('');
    setNewSubcategoryCategoryId('');
    setNewSubcategoryDescription('');
    setIsAdding(true);
  };

  // Handle submission of a new subcategory
  const handleAddSubcategory = async () => {
    if (!newSubcategoryName || !newSubcategoryCategoryId) {
      showToast("Subcategory name and parent category are required.", "error");
      return;
    }

    const newSubcategory = {
      name: newSubcategoryName,
      category: newSubcategoryCategoryId,
      description: newSubcategoryDescription,
    };

    try {
      const url = `${API_BASE_URL}/api/subcategories`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSubcategory),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message}`);
      }

      const addedSubcategory = await response.json();
      setSubcategoriesData((prevData) => [...prevData, addedSubcategory]);
      showToast("Subcategory added successfully!", "success");
      setIsAdding(false);
    } catch (err) {
      console.error("Failed to add subcategory:", err);
      showToast(`Failed to add subcategory: ${err.message}`, "error");
    }
  };

  // Handle opening the "edit" modal
  const handleOpenEditModal = (subcategory) => {
    setEditSubcategoryId(subcategory._id);
    setEditSubcategoryName(subcategory.name);
    setEditSubcategoryCategoryId(subcategory.category?._id);
    setEditSubcategoryDescription(subcategory.description);
    setIsEditing(true);
  };

  // Handle submission of the edited subcategory
  const submitEdit = async () => {
    if (!editSubcategoryName || !editSubcategoryCategoryId) {
      showToast("Subcategory name and parent category are required.", "error");
      return;
    }

    const updatedFields = {
      name: editSubcategoryName,
      category: editSubcategoryCategoryId,
      description: editSubcategoryDescription,
    };

    try {
      const url = `${API_BASE_URL}/api/subcategories/${editSubcategoryId}`;
      const response = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message}`);
      }

      const updatedSubcategory = await response.json();
      setSubcategoriesData((prevData) =>
        prevData.map((subcategory) =>
          subcategory._id === editSubcategoryId ? updatedSubcategory : subcategory
        )
      );
      showToast("Subcategory updated successfully!", "success");
    } catch (err) {
      console.error("Failed to update subcategory:", err);
      showToast(`Failed to update subcategory: ${err.message}`, "error");
    } finally {
      setIsEditing(false);
      setEditSubcategoryId(null);
    }
  };

  // Handle opening the "delete" confirmation modal
  const handleDelete = (id) => {
    setConfirmAction(() => () => performDelete(id));
    setConfirmMessage("Are you sure you want to delete this subcategory?");
    setShowConfirm(true);
  };

  // Perform the actual deletion after confirmation
  const performDelete = async (id) => {
    try {
      const url = `${API_BASE_URL}/api/subcategories/${id}`;
      const response = await fetch(url, {
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
    } finally {
      setShowConfirm(false);
      setConfirmAction(null);
    }
  };

  // Tailwind CSS classes for table styling
  const tableHeaderClasses = "px-6 py-3 text-left text-xs font-medium uppercase tracking-wider";
  const tableCellClasses = "px-6 py-4 whitespace-nowrap text-sm";
  const modalButtonClasses = "px-4 py-2 text-sm font-medium rounded-md transition duration-150 ease-in-out";

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>Subcategories</h1>
          <button
            onClick={handleOpenAddModal}
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition duration-150 ease-in-out flex items-center gap-2"
          >
            <PlusIcon className="w-4 h-4" />
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
                      <td className={tableCellClasses} style={{ color: 'var(--text-primary)' }}>
                        {subcategory.category?.name || 'N/A'}
                      </td>
                      <td className={tableCellClasses} style={{ color: 'var(--text-primary)' }}>{subcategory.description || 'N/A'}</td>
                      <td className={tableCellClasses}>
                        <div className="flex items-center space-x-2">
                          <button onClick={() => handleOpenEditModal(subcategory)} className="text-blue-500 hover:text-blue-700">
                            <PencilSquareIcon className="w-5 h-5" />
                          </button>
                          <button onClick={() => handleDelete(subcategory._id)} className="text-red-500 hover:text-red-700">
                            <TrashIcon className="w-5 h-5" />
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
              <button className="px-3 py-1 border rounded-md" style={{ borderColor: 'var(--border-light)', backgroundColor: 'var(--bg-input)' }}>
                <ArrowLeftIcon className="w-4 h-4" />
              </button>
              <button className="px-3 py-1 border rounded-md" style={{ borderColor: 'var(--border-light)', backgroundColor: 'var(--bg-input)' }}>
                <ArrowRightIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal (for deletion) */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-xl" style={{ backgroundColor: 'var(--bg-card)' }}>
            <p className="text-lg mb-4" style={{ color: 'var(--text-primary)' }}>{confirmMessage}</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowConfirm(false)}
                className={`${modalButtonClasses} text-gray-700 bg-gray-200 hover:bg-gray-300`}
              >
                Cancel
              </button>
              <button
                onClick={confirmAction}
                className={`${modalButtonClasses} text-white bg-red-600 hover:bg-red-700`}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Subcategory Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md" style={{ backgroundColor: 'var(--bg-card)' }}>
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Add New Subcategory</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Subcategory Name"
                value={newSubcategoryName}
                onChange={(e) => setNewSubcategoryName(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ backgroundColor: 'var(--bg-input)', color: 'var(--text-primary)', borderColor: 'var(--border-light)' }}
              />
              <select
                value={newSubcategoryCategoryId}
                onChange={(e) => setNewSubcategoryCategoryId(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ backgroundColor: 'var(--bg-input)', color: 'var(--text-primary)', borderColor: 'var(--border-light)' }}
              >
                <option value="">Select a Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <textarea
                placeholder="Subcategory Description (optional)"
                value={newSubcategoryDescription}
                onChange={(e) => setNewSubcategoryDescription(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                style={{ backgroundColor: 'var(--bg-input)', color: 'var(--text-primary)', borderColor: 'var(--border-light)' }}
              />
            </div>
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => setIsAdding(false)}
                className={`${modalButtonClasses} text-gray-700 bg-gray-200 hover:bg-gray-300`}
              >
                Cancel
              </button>
              <button
                onClick={handleAddSubcategory}
                className={`${modalButtonClasses} text-white bg-blue-600 hover:bg-blue-700`}
              >
                Add Subcategory
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Subcategory Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md" style={{ backgroundColor: 'var(--bg-card)' }}>
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Edit Subcategory</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Subcategory Name"
                value={editSubcategoryName}
                onChange={(e) => setEditSubcategoryName(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ backgroundColor: 'var(--bg-input)', color: 'var(--text-primary)', borderColor: 'var(--border-light)' }}
              />
              <select
                value={editSubcategoryCategoryId}
                onChange={(e) => setEditSubcategoryCategoryId(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ backgroundColor: 'var(--bg-input)', color: 'var(--text-primary)', borderColor: 'var(--border-light)' }}
              >
                <option value="">Select a Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <textarea
                placeholder="Subcategory Description"
                value={editSubcategoryDescription}
                onChange={(e) => setEditSubcategoryDescription(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                style={{ backgroundColor: 'var(--bg-input)', color: 'var(--text-primary)', borderColor: 'var(--border-light)' }}
              />
            </div>
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => setIsEditing(false)}
                className={`${modalButtonClasses} text-gray-700 bg-gray-200 hover:bg-gray-300`}
              >
                Cancel
              </button>
              <button
                onClick={submitEdit}
                className={`${modalButtonClasses} text-white bg-blue-600 hover:bg-blue-700`}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Subcategories;
