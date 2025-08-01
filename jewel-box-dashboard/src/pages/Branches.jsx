// src/pages/Branches.jsx
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/Layout/DashboardLayout';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import { createPortal } from 'react-dom';

// Custom Modal Component for confirmation and input, replacing window.confirm and prompt
const Modal = ({ children, title, onClose, show, backdropClose = true }) => {
  if (!show) return null;
  return createPortal(
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
      onClick={backdropClose ? onClose : undefined}
    >
      <div 
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm mx-auto transition-transform scale-100 dark:bg-gray-800"
        onClick={e => e.stopPropagation()}
      >
        <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">{title}</h3>
        {children}
      </div>
    </div>,
    document.body
  );
};

const Branches = () => {
  const { isDarkMode } = useTheme();
  const { showToast } = useToast();
  const [branchesData, setBranchesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for the custom modals
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [branchToEdit, setBranchToEdit] = useState(null);
  const [branchToDeleteId, setBranchToDeleteId] = useState(null);
  const [updatedBranchName, setUpdatedBranchName] = useState('');

  // -------------------------------------------------------------------------
  // This is the CRITICAL change. We use Vite's `import.meta.env` to get the
  // environment variable. This will work correctly on your Vercel deployment.
  // The fallback to localhost is for local development.
  // -------------------------------------------------------------------------
  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

  useEffect(() => {
    document.title = "Branches - Jewel Box App";
  }, []);

  // --- Fetch Branches from Backend with improved debugging ---
  useEffect(() => {
    // A log for debugging purposes to see which URL is being used.
    console.log("Branches component: API_BASE_URL is", API_BASE_URL);

    // If the environment variable isn't set, we show an error.
    if (!API_BASE_URL || API_BASE_URL === 'http://localhost:5000') {
      setError("API_URL is not set. Please add the VITE_BACKEND_URL environment variable to Vercel.");
      setLoading(false);
      return;
    }

    const fetchBranches = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // We use the environment variable and append the correct endpoint.
        const url = `${API_BASE_URL}/branches`;
        const response = await fetch(url);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Fetch failed for URL: ${url}. Status: ${response.status}. Response body: ${errorText}`);
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        setBranchesData(data);
        showToast("Branches loaded successfully!", "success");
      } catch (err) {
        console.error("Failed to fetch branches:", err);
        setError(`Failed to load branches. Error: ${err.message}. Please check the console for more details.`);
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
      const response = await fetch(`${API_BASE_URL}/branches`, {
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

  const openEditModal = (branch) => {
    setBranchToEdit(branch);
    setUpdatedBranchName(branch.name);
    setShowEditModal(true);
  };
  
  const handleEdit = async () => {
    if (!updatedBranchName || !branchToEdit) {
      showToast("Branch name cannot be empty!", "error");
      return;
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/branches/${branchToEdit._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: updatedBranchName }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const updatedBranch = await response.json();
      setBranchesData((prevData) =>
        prevData.map((branch) =>
          branch._id === branchToEdit._id ? updatedBranch : branch
        )
      );
      showToast("Branch updated successfully!", "success");
      setShowEditModal(false);
    } catch (err) {
      console.error("Failed to update branch:", err);
      showToast("Failed to update branch!", "error");
      setShowEditModal(false);
    }
  };

  const openDeleteModal = (id) => {
    setBranchToDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!branchToDeleteId) return;

    try {
      const response = await fetch(`${API_BASE_URL}/branches/${branchToDeleteId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setBranchesData((prevData) => prevData.filter((branch) => branch._id !== branchToDeleteId));
      showToast("Branch deleted successfully!", "success");
      setShowDeleteModal(false);
      setBranchToDeleteId(null);
    } catch (err) {
      console.error("Failed to delete branch:", err);
      showToast("Failed to delete branch!", "error");
      setShowDeleteModal(false);
      setBranchToDeleteId(null);
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
                          <button onClick={() => openEditModal(branch)} className="text-blue-500 hover:text-blue-700">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.75" />
                            </svg>
                          </button>
                          <button onClick={() => openDeleteModal(branch._id)} className="text-red-500 hover:text-red-700">
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
          {/* Pagination Placeholder */}
          <div className="flex justify-between items-center mt-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
            <span>{branchesData.length > 0 ? `1 to ${branchesData.length} of ${branchesData.length}` : '0 to 0 of 0'}</span>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 border rounded-md" style={{ borderColor: 'var(--border-light)', backgroundColor: 'var(--bg-input)' }}>Previous</button>
              <button className="px-3 py-1 border rounded-md" style={{ borderColor: 'var(--border-light)', backgroundColor: 'var(--bg-input)' }}>Next</button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Confirm Deletion">
        <p className="mb-4 text-gray-700 dark:text-gray-300">Are you sure you want to delete this branch?</p>
        <div className="flex justify-end space-x-2">
          <button 
            onClick={() => setShowDeleteModal(false)}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          <button 
            onClick={handleDelete}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </Modal>

      {/* Edit Branch Modal */}
      <Modal show={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Branch">
        <input
          type="text"
          value={updatedBranchName}
          onChange={(e) => setUpdatedBranchName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        />
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => setShowEditModal(false)}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleEdit}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Update
          </button>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default Branches;
