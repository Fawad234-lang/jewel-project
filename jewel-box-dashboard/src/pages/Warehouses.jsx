import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/Layout/DashboardLayout';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import {
  Pencil,
  Trash2,
  Package,
  X,
  Plus
} from 'lucide-react';

const Warehouses = () => {
  const { isDarkMode } = useTheme();
  const { showToast } = useToast();
  const [warehousesData, setWarehousesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Modal State Management ---
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentWarehouse, setCurrentWarehouse] = useState(null);
  const [newWarehouse, setNewWarehouse] = useState({ name: '', location: '', contact: '' });
  const [updatedWarehouse, setUpdatedWarehouse] = useState({ name: '', location: '', contact: '' });

  // --- Set Page Title ---
  useEffect(() => {
    document.title = "Warehouses - Jewel Box App";
  }, []);

  // --- Fetch Warehouses from Backend ---
  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        setLoading(true);
        setError(null);
        // Using a mock API call for demonstration
        const response = await fetch('http://localhost:5000/api/warehouses');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setWarehousesData(data);
        showToast("Warehouses loaded successfully!", "success");
      } catch (err) {
        console.error("Failed to fetch warehouses:", err);
        setError("Failed to load warehouses. Please ensure the backend server is running.");
        showToast("Failed to load warehouses!", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchWarehouses();
  }, [showToast]);

  // --- Handlers for CRUD operations ---
  const handleAddWarehouse = async () => {
    if (!newWarehouse.name || !newWarehouse.location || !newWarehouse.contact) {
      showToast("All fields are required to add a warehouse.", "error");
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/warehouses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newWarehouse),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message}`);
      }
      const addedWarehouse = await response.json();
      setWarehousesData((prevData) => [...prevData, addedWarehouse]);
      showToast("Warehouse added successfully!", "success");
      setIsAddModalOpen(false);
      setNewWarehouse({ name: '', location: '', contact: '' });
    } catch (err) {
      console.error("Failed to add warehouse:", err);
      showToast(`Failed to add warehouse: ${err.message}`, "error");
    }
  };

  const handleEdit = async () => {
    if (!updatedWarehouse.name || !updatedWarehouse.location || !updatedWarehouse.contact) {
      showToast("All fields are required for update.", "error");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/warehouses/${currentWarehouse._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedWarehouse),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message}`);
      }
      const updatedData = await response.json();
      setWarehousesData((prevData) =>
        prevData.map((warehouse) =>
          warehouse._id === currentWarehouse._id ? updatedData : warehouse
        )
      );
      showToast("Warehouse updated successfully!", "success");
      setIsEditModalOpen(false);
      setCurrentWarehouse(null);
      setUpdatedWarehouse({ name: '', location: '', contact: '' });
    } catch (err) {
      console.error("Failed to update warehouse:", err);
      showToast(`Failed to update warehouse: ${err.message}`, "error");
    }
  };

  const handleDelete = async () => {
    if (!currentWarehouse) return;
    try {
      const response = await fetch(`http://localhost:5000/api/warehouses/${currentWarehouse._id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message}`);
      }
      setWarehousesData((prevData) => prevData.filter((warehouse) => warehouse._id !== currentWarehouse._id));
      showToast("Warehouse deleted successfully!", "success");
      setIsDeleteModalOpen(false);
      setCurrentWarehouse(null);
    } catch (err) {
      console.error("Failed to delete warehouse:", err);
      showToast(`Failed to delete warehouse: ${err.message}`, "error");
    }
  };

  const openEditModal = (warehouse) => {
    setCurrentWarehouse(warehouse);
    setUpdatedWarehouse({
      name: warehouse.name,
      location: warehouse.location,
      contact: warehouse.contact,
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (warehouse) => {
    setCurrentWarehouse(warehouse);
    setIsDeleteModalOpen(true);
  };

  const tableHeaderClasses = "px-6 py-3 text-left text-xs font-medium uppercase tracking-wider";
  const tableCellClasses = "px-6 py-4 whitespace-nowrap text-sm";
  const inputClasses = "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200";
  const modalButtonClasses = "px-4 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out";

  return (
    <DashboardLayout>
      <div className="space-y-6 p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Warehouses</h1>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="mt-4 sm:mt-0 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition duration-150 ease-in-out flex items-center space-x-2"
          >
            <Plus size={16} />
            <span>Add New Warehouse</span>
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-colors duration-200">
          {loading ? (
            <p className="text-gray-500 dark:text-gray-400">Loading warehouses...</p>
          ) : error ? (
            <p className="text-red-600 dark:text-red-400">Error: {error}</p>
          ) : warehousesData.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No warehouses found. Add one!</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className={`${tableHeaderClasses} text-gray-500 dark:text-gray-300`}>Name</th>
                    <th scope="col" className={`${tableHeaderClasses} text-gray-500 dark:text-gray-300`}>Location</th>
                    <th scope="col" className={`${tableHeaderClasses} text-gray-500 dark:text-gray-300`}>Contact</th>
                    <th scope="col" className={`${tableHeaderClasses} text-gray-500 dark:text-gray-300`}>Created At</th>
                    <th scope="col" className={`${tableHeaderClasses} text-gray-500 dark:text-gray-300`}>Last Modified</th>
                    <th scope="col" className={`${tableHeaderClasses} text-gray-500 dark:text-gray-300`}>Actions</th>
                    <th scope="col" className={`${tableHeaderClasses} text-gray-500 dark:text-gray-300`}>Inventory</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {warehousesData.map((warehouse) => (
                    <tr key={warehouse._id}>
                      <td className={`${tableCellClasses} text-gray-900 dark:text-gray-100`}>{warehouse.name}</td>
                      <td className={`${tableCellClasses} text-gray-900 dark:text-gray-100`}>{warehouse.location}</td>
                      <td className={`${tableCellClasses} text-gray-900 dark:text-gray-100`}>{warehouse.contact}</td>
                      <td className={`${tableCellClasses} text-gray-500 dark:text-gray-400`}>{new Date(warehouse.createdAt).toLocaleString()}</td>
                      <td className={`${tableCellClasses} text-gray-500 dark:text-gray-400`}>{new Date(warehouse.updatedAt).toLocaleString()}</td>
                      <td className={tableCellClasses}>
                        <div className="flex items-center space-x-2">
                          <button onClick={() => openEditModal(warehouse)} className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-600">
                            <Pencil size={20} />
                          </button>
                          <button onClick={() => openDeleteModal(warehouse)} className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-600">
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </td>
                      <td className={tableCellClasses}>
                        <a href={`/inventory/${warehouse._id}`} className="text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400">
                          <Package size={20} />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="flex justify-between items-center mt-4 text-sm text-gray-500 dark:text-gray-400">
            <span>{warehousesData.length > 0 ? `Showing 1 to ${warehousesData.length} of ${warehousesData.length} entries` : 'No entries'}</span>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">Previous</button>
              <button className="px-3 py-1 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">Next</button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Warehouse Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Add New Warehouse</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Warehouse Name"
                value={newWarehouse.name}
                onChange={(e) => setNewWarehouse({ ...newWarehouse, name: e.target.value })}
                className={`${inputClasses} bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100`}
              />
              <input
                type="text"
                placeholder="Location"
                value={newWarehouse.location}
                onChange={(e) => setNewWarehouse({ ...newWarehouse, location: e.target.value })}
                className={`${inputClasses} bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100`}
              />
              <input
                type="text"
                placeholder="Contact Number"
                value={newWarehouse.contact}
                onChange={(e) => setNewWarehouse({ ...newWarehouse, contact: e.target.value })}
                className={`${inputClasses} bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100`}
              />
            </div>
            <div className="flex justify-end mt-6 space-x-2">
              <button onClick={() => setIsAddModalOpen(false)} className={`${modalButtonClasses} text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 border border-transparent`}>
                Cancel
              </button>
              <button onClick={handleAddWarehouse} className={`${modalButtonClasses} bg-blue-600 text-white hover:bg-blue-700`}>
                Add Warehouse
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Warehouse Modal */}
      {isEditModalOpen && currentWarehouse && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Edit Warehouse</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Warehouse Name"
                value={updatedWarehouse.name}
                onChange={(e) => setUpdatedWarehouse({ ...updatedWarehouse, name: e.target.value })}
                className={`${inputClasses} bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100`}
              />
              <input
                type="text"
                placeholder="Location"
                value={updatedWarehouse.location}
                onChange={(e) => setUpdatedWarehouse({ ...updatedWarehouse, location: e.target.value })}
                className={`${inputClasses} bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100`}
              />
              <input
                type="text"
                placeholder="Contact Number"
                value={updatedWarehouse.contact}
                onChange={(e) => setUpdatedWarehouse({ ...updatedWarehouse, contact: e.target.value })}
                className={`${inputClasses} bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100`}
              />
            </div>
            <div className="flex justify-end mt-6 space-x-2">
              <button onClick={() => setIsEditModalOpen(false)} className={`${modalButtonClasses} text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 border border-transparent`}>
                Cancel
              </button>
              <button onClick={handleEdit} className={`${modalButtonClasses} bg-blue-600 text-white hover:bg-blue-700`}>
                Update Warehouse
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && currentWarehouse && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-sm text-center">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Confirm Deletion</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to delete the warehouse <strong>{currentWarehouse.name}</strong>? This action cannot be undone.
            </p>
            <div className="flex justify-center space-x-4">
              <button onClick={() => setIsDeleteModalOpen(false)} className={`${modalButtonClasses} bg-gray-300 text-gray-800 hover:bg-gray-400 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600`}>
                Cancel
              </button>
              <button onClick={handleDelete} className={`${modalButtonClasses} bg-red-600 text-white hover:bg-red-700`}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Warehouses;
