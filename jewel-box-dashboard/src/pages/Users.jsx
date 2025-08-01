// src/pages/Branches.jsx

import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/Layout/DashboardLayout';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import { PlusIcon, PencilSquareIcon, TrashIcon, ArchiveBoxIcon } from '@heroicons/react/24/outline';

const Branches = () => {
  // States for general data and UI
  const { isDarkMode } = useTheme();
  const { showToast } = useToast();
  const [branchesData, setBranchesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // States for Modals and Confirmations
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState('');

  const [isEditing, setIsEditing] = useState(false);
  const [editBranchId, setEditBranchId] = useState(null);
  const [editBranchData, setEditBranchData] = useState({ name: '', location: '', contact: '' });

  const [showAddModal, setShowAddModal] = useState(false);
  const [newBranchData, setNewBranchData] = useState({ name: '', location: '', contact: '' });

  // This will read the environment variable set in Vercel.
  // The .replace(/\/$/, '') part ensures no double slashes.
  const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

  useEffect(() => {
    document.title = "Branches - Jewel Box App";
  }, []);

  // --- Fetch Branches from Backend ---
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        setLoading(true);
        setError(null);
        const url = `${API_BASE_URL}/api/branches`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setBranchesData(data);
        showToast("Branches loaded successfully!", "success");
      } catch (err) {
        console.error("Failed to fetch branches:", err);
        setError("Failed to load branches. Please ensure the backend server is running and accessible.");
        showToast("Failed to load branches!", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchBranches();
  }, [showToast, API_BASE_URL]);

  // --- Add Branch functionality with a modal ---
  const handleAddModalOpen = () => {
    setNewBranchData({ name: '', location: '', contact: '' });
    setShowAddModal(true);
  };

  const handleAddModalClose = () => {
    setShowAddModal(false);
    setNewBranchData({ name: '', location: '', contact: '' });
  };

  const handleAddBranchSubmit = async () => {
    if (!newBranchData.name || !newBranchData.location || !newBranchData.contact) {
      showToast("All fields are required to add a branch.", "error");
      return;
    }
    try {
      const url = `${API_BASE_URL}/api/branches`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newBranchData),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const addedBranch = await response.json();
      setBranchesData((prevData) => [...prevData, addedBranch]);
      showToast("Branch added successfully!", "success");
    } catch (err) {
      console.error("Failed to add branch:", err);
      showToast("Failed to add branch!", "error");
    } finally {
      handleAddModalClose();
    }
  };

  // --- Edit Branch functionality with a modal ---
  const handleEdit = (id) => {
    const branchToEdit = branchesData.find(b => b._id === id);
    if (!branchToEdit) return;
    
    setEditBranchId(id);
    setEditBranchData(branchToEdit);
    setIsEditing(true);
  };

  const handleEditSubmit = async () => {
    if (!editBranchData.name) {
      showToast("Branch name cannot be empty.", "error");
      return;
    }
    
    try {
      const url = `${API_BASE_URL}/api/branches/${editBranchId}`;
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editBranchData),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const updatedBranch = await response.json();
      setBranchesData((prevData) =>
        prevData.map((branch) =>
          branch._id === editBranchId ? updatedBranch : branch
        )
      );
      showToast("Branch updated successfully!", "success");
    } catch (err) {
      console.error("Failed to update branch:", err);
      showToast("Failed to update branch!", "error");
    } finally {
      setIsEditing(false);
      setEditBranchId(null);
      setEditBranchData({ name: '', location: '', contact: '' });
    }
  };

  // --- Delete Branch functionality with a custom confirmation modal ---
  const handleDelete = (id) => {
    setConfirmAction(() => () => performDelete(id));
    setConfirmMessage("Are you sure you want to delete this branch?");
    setShowConfirm(true);
  };
  
  const performDelete = async (id) => {
    try {
      const url = `${API_BASE_URL}/api/branches/${id}`;
      const response = await fetch(url, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setBranchesData((prevData) => prevData.filter((branch) => branch._id !== id));
      showToast("Branch deleted successfully!", "success");
    } catch (err) {
      console.error("Failed to delete branch:", err);
      showToast("Failed to delete branch!", "error");
    } finally {
      setShowConfirm(false);
      setConfirmAction(null);
    }
  };

  const handleInventoryClick = (branchId) => {
    showToast(`Navigating to inventory for branch ID: ${branchId}`, "info");
    // In a real application, you would navigate to a new route here.
    // e.g., navigate(`/inventory/${branchId}`);
  };

  const tableHeaderClasses = "px-6 py-3 text-left text-xs font-medium uppercase tracking-wider";
  const tableCellClasses = "px-6 py-4 whitespace-nowrap text-sm";

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>Branches</h1>
          <button
            onClick={handleAddModalOpen}
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition duration-150 ease-in-out flex items-center gap-2"
          >
            <PlusIcon className="w-4 h-4" />
            Add New Branch
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md transition-colors duration-200" style={{ backgroundColor: 'var(--bg-card)' }}>
          {loading ? (
            <p style={{ color: 'var(--text-secondary)' }}>Loading branches...</p>
          ) : error ? (
            <p className="text-center p-4 rounded-md" style={{ color: 'var(--text-red)', backgroundColor: 'var(--bg-danger-light)' }}>Error: {error}</p>
          ) : branchesData.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)' }}>No branches found. Add one!</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y" style={{ borderColor: 'var(--border-light)' }}>
                <thead style={{ backgroundColor: 'var(--bg-table-header)' }}>
                  <tr>
                    <th scope="col" className={tableHeaderClasses} style={{ color: 'var(--text-secondary)' }}>Name</th>
                    <th scope="col" className={tableHeaderClasses} style={{ color: 'var(--text-secondary)' }}>Location</th>
                    <th scope="col" className={tableHeaderClasses} style={{ color: 'var(--text-secondary)' }}>Contact</th>
                    <th scope="col" className={tableHeaderClasses} style={{ color: 'var(--text-secondary)' }}>Actions</th>
                    <th scope="col" className={tableHeaderClasses} style={{ color: 'var(--text-secondary)' }}>Inventory</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-light)' }}>
                  {branchesData.map((branch) => (
                    <tr key={branch._id}>
                      <td className={tableCellClasses} style={{ color: 'var(--text-primary)' }}>{branch.name}</td>
                      <td className={tableCellClasses} style={{ color: 'var(--text-primary)' }}>{branch.location}</td>
                      <td className={tableCellClasses} style={{ color: 'var(--text-primary)' }}>{branch.contact}</td>
                      <td className={tableCellClasses}>
                        <div className="flex items-center space-x-2">
                          <button onClick={() => handleEdit(branch._id)} className="text-blue-500 hover:text-blue-700 p-1 rounded-full hover:bg-gray-100 transition-colors">
                            <PencilSquareIcon className="w-5 h-5" />
                          </button>
                          <button onClick={() => handleDelete(branch._id)} className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-gray-100 transition-colors">
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                      <td className={tableCellClasses}>
                        <button onClick={() => handleInventoryClick(branch._id)} className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors">
                            <ArchiveBoxIcon className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="flex justify-between items-center mt-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
            <span>{branchesData.length > 0 ? `1 to ${branchesData.length} of ${branchesData.length}` : '0 to 0 of 0'}</span>
            <div className="flex items-center space-x-2">
              <button disabled className="px-3 py-1 border rounded-md cursor-not-allowed opacity-50" style={{ borderColor: 'var(--border-light)', backgroundColor: 'var(--bg-input)' }}>Previous</button>
              <button disabled className="px-3 py-1 border rounded-md cursor-not-allowed opacity-50" style={{ borderColor: 'var(--border-light)', backgroundColor: 'var(--bg-input)' }}>Next</button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-xl min-w-[300px]" style={{ backgroundColor: 'var(--bg-card)' }}>
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

      {/* Edit Branch Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-xl min-w-[400px]" style={{ backgroundColor: 'var(--bg-card)' }}>
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Edit Branch Details</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="edit-name" className="block text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Branch Name</label>
                <input
                  id="edit-name"
                  type="text"
                  value={editBranchData.name}
                  onChange={(e) => setEditBranchData({ ...editBranchData, name: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ backgroundColor: 'var(--bg-input)', color: 'var(--text-primary)' }}
                />
              </div>
              <div>
                <label htmlFor="edit-location" className="block text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Location</label>
                <input
                  id="edit-location"
                  type="text"
                  value={editBranchData.location}
                  onChange={(e) => setEditBranchData({ ...editBranchData, location: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ backgroundColor: 'var(--bg-input)', color: 'var(--text-primary)' }}
                />
              </div>
              <div>
                <label htmlFor="edit-contact" className="block text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Contact</label>
                <input
                  id="edit-contact"
                  type="text"
                  value={editBranchData.contact}
                  onChange={(e) => setEditBranchData({ ...editBranchData, contact: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                onClick={handleEditSubmit}
                className="px-4 py-2 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Branch Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-xl min-w-[400px]" style={{ backgroundColor: 'var(--bg-card)' }}>
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Add New Branch</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="add-name" className="block text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Branch Name</label>
                <input
                  id="add-name"
                  type="text"
                  value={newBranchData.name}
                  onChange={(e) => setNewBranchData({ ...newBranchData, name: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ backgroundColor: 'var(--bg-input)', color: 'var(--text-primary)' }}
                />
              </div>
              <div>
                <label htmlFor="add-location" className="block text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Location</label>
                <input
                  id="add-location"
                  type="text"
                  value={newBranchData.location}
                  onChange={(e) => setNewBranchData({ ...newBranchData, location: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ backgroundColor: 'var(--bg-input)', color: 'var(--text-primary)' }}
                />
              </div>
              <div>
                <label htmlFor="add-contact" className="block text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Contact</label>
                <input
                  id="add-contact"
                  type="text"
                  value={newBranchData.contact}
                  onChange={(e) => setNewBranchData({ ...newBranchData, contact: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ backgroundColor: 'var(--bg-input)', color: 'var(--text-primary)' }}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={handleAddModalClose}
                className="px-4 py-2 text-sm font-medium rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAddBranchSubmit}
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

export default Branches;
