// src/pages/Warehouses.jsx
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/Layout/DashboardLayout';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';

const Warehouses = () => {
  const { isDarkMode } = useTheme();
  const { showToast } = useToast();
  const [warehousesData, setWarehousesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        const response = await fetch('http://localhost:5000/api/warehouses'); // Your backend API URL
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

  const handleAddWarehouse = async () => {
    const name = prompt("Enter warehouse name:");
    const location = prompt("Enter warehouse location:");
    const contact = prompt("Enter warehouse contact number:");

    if (!name || !location || !contact) {
      showToast("All fields are required to add a warehouse.", "error");
      return;
    }

    const newWarehouse = { name, location, contact };
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
    } catch (err) {
      console.error("Failed to add warehouse:", err);
      showToast(`Failed to add warehouse: ${err.message}`, "error");
    }
  };

  const handleEdit = async (id) => {
    const currentWarehouse = warehousesData.find(w => w._id === id);
    if (!currentWarehouse) return;

    const newName = prompt("Enter new name for warehouse:", currentWarehouse.name);
    const newLocation = prompt("Enter new location:", currentWarehouse.location);
    const newContact = prompt("Enter new contact:", currentWarehouse.contact);

    if (!newName || !newLocation || !newContact) {
      showToast("All fields are required for update.", "error");
      return;
    }

    const updatedFields = { name: newName, location: newLocation, contact: newContact };

    try {
      const response = await fetch(`http://localhost:5000/api/warehouses/${id}`, {
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
      const updatedWarehouse = await response.json();
      setWarehousesData((prevData) =>
        prevData.map((warehouse) =>
          warehouse._id === id ? updatedWarehouse : warehouse
        )
      );
      showToast("Warehouse updated successfully!", "success");
    } catch (err) {
      console.error("Failed to update warehouse:", err);
      showToast(`Failed to update warehouse: ${err.message}`, "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this warehouse?")) {
      return;
    }
    try {
      const response = await fetch(`http://localhost:5000/api/warehouses/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message}`);
      }
      setWarehousesData((prevData) => prevData.filter((warehouse) => warehouse._id !== id));
      showToast("Warehouse deleted successfully!", "success");
    } catch (err) {
      console.error("Failed to delete warehouse:", err);
      showToast(`Failed to delete warehouse: ${err.message}`, "error");
    }
  };

  const tableHeaderClasses = "px-6 py-3 text-left text-xs font-medium uppercase tracking-wider";
  const tableCellClasses = "px-6 py-4 whitespace-nowrap text-sm";

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>Warehouses</h1>
          <button
            onClick={handleAddWarehouse}
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition duration-150 ease-in-out"
          >
            Add New Warehouse
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md transition-colors duration-200" style={{ backgroundColor: 'var(--bg-card)' }}>
          {loading ? (
            <p style={{ color: 'var(--text-secondary)' }}>Loading warehouses...</p>
          ) : error ? (
            <p style={{ color: 'var(--text-red)' }}>Error: {error}</p>
          ) : warehousesData.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)' }}>No warehouses found. Add one!</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y" style={{ borderColor: 'var(--border-light)' }}>
                <thead style={{ backgroundColor: 'var(--bg-table-header)' }}>
                  <tr>
                    <th scope="col" className={tableHeaderClasses} style={{ color: 'var(--text-secondary)' }}>Name</th>
                    <th scope="col" className={tableHeaderClasses} style={{ color: 'var(--text-secondary)' }}>Location</th>
                    <th scope="col" className={tableHeaderClasses} style={{ color: 'var(--text-secondary)' }}>Contact</th>
                    <th scope="col" className={tableHeaderClasses} style={{ color: 'var(--text-secondary)' }}>Created At</th>
                    <th scope="col" className={tableHeaderClasses} style={{ color: 'var(--text-secondary)' }}>Last Modified</th>
                    <th scope="col" className={tableHeaderClasses} style={{ color: 'var(--text-secondary)' }}>Actions</th>
                    <th scope="col" className={tableHeaderClasses} style={{ color: 'var(--text-secondary)' }}>Inventory</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-light)' }}>
                  {warehousesData.map((warehouse) => (
                    <tr key={warehouse._id}>
                      <td className={tableCellClasses} style={{ color: 'var(--text-primary)' }}>{warehouse.name}</td>
                      <td className={tableCellClasses} style={{ color: 'var(--text-primary)' }}>{warehouse.location}</td>
                      <td className={tableCellClasses} style={{ color: 'var(--text-primary)' }}>{warehouse.contact}</td>
                      <td className={tableCellClasses} style={{ color: 'var(--text-primary)' }}>{new Date(warehouse.createdAt).toLocaleString()}</td>
                      <td className={tableCellClasses} style={{ color: 'var(--text-primary)' }}>{new Date(warehouse.updatedAt).toLocaleString()}</td>
                      <td className={tableCellClasses}>
                        <div className="flex items-center space-x-2">
                          <button onClick={() => handleEdit(warehouse._id)} className="text-blue-500 hover:text-blue-700">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.75" />
                            </svg>
                          </button>
                          <button onClick={() => handleDelete(warehouse._id)} className="text-red-500 hover:text-red-700">
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
            <span>{warehousesData.length > 0 ? `1 to ${warehousesData.length} of ${warehousesData.length}` : '0 to 0 of 0'}</span>
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

export default Warehouses;