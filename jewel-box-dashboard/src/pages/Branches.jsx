// src/pages/Branches.jsx

import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/Layout/DashboardLayout';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';

const Branches = () => {
  const { isDarkMode } = useTheme();
  const { showToast } = useToast();
  const [branchesData, setBranchesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState('');
  
  const [isEditing, setIsEditing] = useState(false);
  const [editBranchId, setEditBranchId] = useState(null);
  const [newBranchName, setNewBranchName] = useState('');

  // Define the base URL, ensuring there's no trailing slash to prevent double slashes.
  const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

  useEffect(() => {
    document.title = "Branches - Jewel Box App";
  }, []);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        setLoading(true);
        setError(null);
        // Correctly construct the URL using the cleaned base URL.
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
        setError("Failed to load branches. Please ensure the backend server is running.");
        showToast("Failed to load branches!", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchBranches();
  }, [showToast, API_BASE_URL]);

  const handleAddBranch = async () => {
    const newBranch = {
      name: `New Branch ${Math.floor(Math.random() * 1000)}`,
      location: 'New Branch Location',
      contact: '0987654321',
    };
    try {
      const url = `${API_BASE_URL}/api/branches`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newBranch),
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
    }
  };

  const handleEdit = async (id) => {
    const branchToEdit = branchesData.find(b => b._id === id);
    if (!branchToEdit) return;
    
    setEditBranchId(id);
    setNewBranchName(branchToEdit.name);
    setIsEditing(true);
  };

  const submitEdit = async () => {
    if (!newBranchName || !editBranchId) {
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
        body: JSON.stringify({ name: newBranchName }),
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
      setNewBranchName('');
    }
  };

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

  const tableHeaderClasses = "px-6 py-3 text-left text-xs font-medium uppercase tracking-wider";
  const tableCellClasses = "px-6 py-4 whitespace-nowrap text-sm";

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>Branches</h1>
          <button
            onClick={handleAddBranch}
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition duration-150 ease-in-out"
          >
            Add New Branch
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md transition-colors duration-200" style={{ backgroundColor: 'var(--bg-card)' }}>
          {loading ? (
            <p style={{ color: 'var(--text-secondary)' }}>Loading branches...</p>
          ) : error ? (
            <p style={{ color: 'var(--text-red)' }}>Error: {error}</p>
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
                          <button onClick={() => handleEdit(branch._id)} className="text-blue-500 hover:text-blue-700">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.75" />
                            </svg>
                          </button>
                          <button onClick={() => handleDelete(branch._id)} className="text-red-500 hover:text-red-700">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.262 9m10.118-3.468a.75.75 0 0 0 0-1.06L18.47 3.22a.75.75 0 0 0-1.06 0l-1.06 1.06M16.5 7.5h-9m9 0H12m-2.25 4.5h3.5m-3.5 0a.75.75 0 0 1-.75.75h-.75a.75.75 0 0 1-.75-.75m1.5 0V12m0 0a.75.75 0 0 0-.75-.75h-.75a.75.75 0 0 0-.75.75m1.5 0V12m0 0a.75.75 0 0 0-.75-.75h-.75a.75.75 0 0 0-.75.75m1.5 0V12" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 7.5h-15V21a1.5 1.5 0 0 0 1.5 1.5h12a1.5 1.5 0 0 0 1.5-1.5V7.5Z" />
                            </svg>
                          </button>
                        </div>
                      </td>
                      <td className={tableCellClasses}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.75a.75.75 0 0 0 0-1.06L18.47 4.47a.75.75 0 0 0-1.06 0l-1.06 1.06M16.5 7.5h-9m9 0H12m-2.25 4.5h3.5m-3.5 0a.75.75 0 0 1-.75.75h-.75a.75.75 0 0 1-.75-.75m1.5 0V12m0 0a.75.75 0 0 0-.75-.75h-.75a.75.75 0 0 0-.75.75m1.5 0V12m0 0a.75.75 0 0 0-.75-.75h-.75a.75.75 0 0 0-.75.75m1.5 0V12" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 7.5h-15V21a1.5 1.5 0 0 0 1.5 1.5h12a1.5 1.5 0 0 0 1.5-1.5V7.5Z" />
                        </svg>
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
              <button className="px-3 py-1 border rounded-md" style={{ borderColor: 'var(--border-light)', backgroundColor: 'var(--bg-input)' }}>Previous</button>
              <button className="px-3 py-1 border rounded-md" style={{ borderColor: 'var(--border-light)', backgroundColor: 'var(--bg-input)' }}>Next</button>
            </div>
          </div>
        </div>
      </div>

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

      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-xl" style={{ backgroundColor: 'var(--bg-card)' }}>
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Edit Branch Name</h3>
            <input
              type="text"
              value={newBranchName}
              onChange={(e) => setNewBranchName(e.target.value)}
              className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ backgroundColor: 'var(--bg-input)', color: 'var(--text-primary)' }}
            />
            <div className="flex justify-end space-x-4">
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

export default Branches;
