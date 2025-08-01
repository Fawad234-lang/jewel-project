import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/Layout/DashboardLayout';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';

// Define the base URL from the environment variables.
// This is more flexible for deployment environments like Vercel.
const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

const Users = () => {
  const { isDarkMode } = useTheme();
  const { showToast } = useToast();
  
  // State for storing and managing user data.
  const [usersData, setUsersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for the confirmation modal.
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState('');

  // State for the edit user modal.
  const [showEditModal, setShowEditModal] = useState(false);
  const [editUserId, setEditUserId] = useState(null);
  const [editUserForm, setEditUserForm] = useState({
    name: '',
    email: '',
    role: '',
    phone: '',
  });

  // State for the add user modal.
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUserForm, setNewUserForm] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    phone: '',
  });

  // Set the document title on component mount.
  useEffect(() => {
    document.title = "Users - Jewel Box App";
  }, []);

  // Fetch users from the backend API.
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const url = `${API_BASE_URL}/api/users`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setUsersData(data);
      showToast("Users loaded successfully!", "success");
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setError("Failed to load users. Please ensure the backend server is running and accessible.");
      showToast("Failed to load users!", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [showToast]);

  // Handler for opening the add user modal.
  const handleAddUser = () => {
    setNewUserForm({ name: '', email: '', password: '', role: '', phone: '' });
    setShowAddModal(true);
  };

  // Handler for submitting the new user form.
  const submitAddUser = async () => {
    if (!newUserForm.name || !newUserForm.email || !newUserForm.password || !newUserForm.role || !newUserForm.phone) {
      showToast("All fields are required to add a user.", "error");
      return;
    }

    try {
      const url = `${API_BASE_URL}/api/users`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUserForm),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message}`);
      }
      const addedUser = await response.json();
      setUsersData((prevData) => [...prevData, addedUser]);
      showToast("User added successfully!", "success");
      setShowAddModal(false);
    } catch (err) {
      console.error("Failed to add user:", err);
      showToast(`Failed to add user: ${err.message}`, "error");
    }
  };

  // Handler for opening the edit user modal.
  const handleEdit = (id) => {
    const userToEdit = usersData.find(u => u._id === id);
    if (!userToEdit) return;

    setEditUserId(id);
    setEditUserForm({
      name: userToEdit.name,
      email: userToEdit.email,
      role: userToEdit.role,
      phone: userToEdit.phone,
    });
    setShowEditModal(true);
  };

  // Handler for submitting the edit user form.
  const submitEdit = async () => {
    if (!editUserForm.name || !editUserForm.email || !editUserForm.role || !editUserForm.phone) {
      showToast("All fields are required for update.", "error");
      return;
    }
    
    try {
      const url = `${API_BASE_URL}/api/users/${editUserId}`;
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editUserForm),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message}`);
      }
      const updatedUser = await response.json();
      setUsersData((prevData) =>
        prevData.map((user) =>
          user._id === editUserId ? updatedUser : user
        )
      );
      showToast("User updated successfully!", "success");
      setShowEditModal(false);
    } catch (err) {
      console.error("Failed to update user:", err);
      showToast(`Failed to update user: ${err.message}`, "error");
    }
  };

  // Handler for showing the delete confirmation modal.
  const handleDelete = (id) => {
    setConfirmAction(() => () => performDelete(id));
    setConfirmMessage("Are you sure you want to delete this user?");
    setShowConfirm(true);
  };
  
  // The actual function to perform the delete API call.
  const performDelete = async (id) => {
    try {
      const url = `${API_BASE_URL}/api/users/${id}`;
      const response = await fetch(url, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message}`);
      }
      setUsersData((prevData) => prevData.filter((user) => user._id !== id));
      showToast("User deleted successfully!", "success");
    } catch (err) {
      console.error("Failed to delete user:", err);
      showToast(`Failed to delete user: ${err.message}`, "error");
    } finally {
      setShowConfirm(false);
      setConfirmAction(null);
    }
  };

  // Tailwind CSS classes for table styling.
  const tableHeaderClasses = "px-6 py-3 text-left text-xs font-medium uppercase tracking-wider";
  const tableCellClasses = "px-6 py-4 whitespace-nowrap text-sm";

  // Filter users by role for display.
  const admins = usersData.filter(user => user.role === 'Admin');
  const warehouseManagers = usersData.filter(user => user.role === 'Warehouse Manager');
  const branchManagers = usersData.filter(user => user.role === 'Branch Manager');
  const assistantManagers = usersData.filter(user => user.role === 'Assistant Manager');

  // A reusable function to render a table for a specific user group.
  const renderUserTable = (users, title) => (
    <div className="bg-white p-6 rounded-lg shadow-md mt-6 transition-colors duration-200" style={{ backgroundColor: 'var(--bg-card)' }}>
      <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>{title}</h2>
      {loading ? (
        <p style={{ color: 'var(--text-secondary)' }}>Loading users...</p>
      ) : error ? (
        <p style={{ color: 'var(--text-red)' }}>Error: {error}</p>
      ) : users.length === 0 ? (
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>No {title.toLowerCase()} found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y" style={{ borderColor: 'var(--border-light)' }}>
            <thead style={{ backgroundColor: 'var(--bg-table-header)' }}>
              <tr>
                <th scope="col" className={tableHeaderClasses} style={{ color: 'var(--text-secondary)' }}>Name</th>
                <th scope="col" className={tableHeaderClasses} style={{ color: 'var(--text-secondary)' }}>Role</th>
                <th scope="col" className={tableHeaderClasses} style={{ color: 'var(--text-secondary)' }}>Email</th>
                <th scope="col" className={tableHeaderClasses} style={{ color: 'var(--text-secondary)' }}>Phone Number</th>
                <th scope="col" className={tableHeaderClasses} style={{ color: 'var(--text-secondary)' }}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-light)' }}>
              {users.map((user) => (
                <tr key={user._id}>
                  <td className={tableCellClasses} style={{ color: 'var(--text-primary)' }}>{user.name}</td>
                  <td className={tableCellClasses} style={{ color: 'var(--text-primary)' }}>{user.role}</td>
                  <td className={tableCellClasses} style={{ color: 'var(--text-primary)' }}>{user.email}</td>
                  <td className={tableCellClasses} style={{ color: 'var(--text-primary)' }}>{user.phone}</td>
                  <td className={tableCellClasses}>
                    <div className="flex items-center space-x-2">
                      <button onClick={() => handleEdit(user._id)} className="text-blue-500 hover:text-blue-700">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.75" />
                        </svg>
                      </button>
                      <button onClick={() => handleDelete(user._id)} className="text-red-500 hover:text-red-700">
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
    </div>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>User Management</h1>
          <button
            onClick={handleAddUser}
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition duration-150 ease-in-out"
          >
            Add New User
          </button>
        </div>

        {/* Render tables for each user role */}
        {renderUserTable(admins, "Admins")}
        {renderUserTable(warehouseManagers, "Warehouse Managers")}
        {renderUserTable(branchManagers, "Branch Managers")}
        {renderUserTable(assistantManagers, "Assistant Managers")}

        {/* Pagination Placeholder */}
        <div className="flex justify-between items-center mt-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
          <span>{usersData.length > 0 ? `1 to ${usersData.length} of ${usersData.length}` : '0 to 0 of 0'}</span>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 border rounded-md" style={{ borderColor: 'var(--border-light)', backgroundColor: 'var(--bg-input)' }}>Previous</button>
            <button className="px-3 py-1 border rounded-md" style={{ borderColor: 'var(--border-light)', backgroundColor: 'var(--bg-input)' }}>Next</button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Deletion */}
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

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md" style={{ backgroundColor: 'var(--bg-card)' }}>
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Add New User</h3>
            <form onSubmit={(e) => { e.preventDefault(); submitAddUser(); }}>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Name"
                  value={newUserForm.name}
                  onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ backgroundColor: 'var(--bg-input)', color: 'var(--text-primary)' }}
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={newUserForm.email}
                  onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ backgroundColor: 'var(--bg-input)', color: 'var(--text-primary)' }}
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={newUserForm.password}
                  onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ backgroundColor: 'var(--bg-input)', color: 'var(--text-primary)' }}
                />
                <select
                  value={newUserForm.role}
                  onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ backgroundColor: 'var(--bg-input)', color: 'var(--text-primary)' }}
                >
                  <option value="">Select Role</option>
                  <option value="Admin">Admin</option>
                  <option value="Warehouse Manager">Warehouse Manager</option>
                  <option value="Branch Manager">Branch Manager</option>
                  <option value="Assistant Manager">Assistant Manager</option>
                </select>
                <input
                  type="text"
                  placeholder="Phone Number"
                  value={newUserForm.phone}
                  onChange={(e) => setNewUserForm({ ...newUserForm, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ backgroundColor: 'var(--bg-input)', color: 'var(--text-primary)' }}
                />
              </div>
              <div className="flex justify-end space-x-4 mt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-sm font-medium rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition"
                >
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md" style={{ backgroundColor: 'var(--bg-card)' }}>
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Edit User</h3>
            <form onSubmit={(e) => { e.preventDefault(); submitEdit(); }}>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Name"
                  value={editUserForm.name}
                  onChange={(e) => setEditUserForm({ ...editUserForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ backgroundColor: 'var(--bg-input)', color: 'var(--text-primary)' }}
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={editUserForm.email}
                  onChange={(e) => setEditUserForm({ ...editUserForm, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ backgroundColor: 'var(--bg-input)', color: 'var(--text-primary)' }}
                />
                <select
                  value={editUserForm.role}
                  onChange={(e) => setEditUserForm({ ...editUserForm, role: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ backgroundColor: 'var(--bg-input)', color: 'var(--text-primary)' }}
                >
                  <option value="Admin">Admin</option>
                  <option value="Warehouse Manager">Warehouse Manager</option>
                  <option value="Branch Manager">Branch Manager</option>
                  <option value="Assistant Manager">Assistant Manager</option>
                </select>
                <input
                  type="text"
                  placeholder="Phone Number"
                  value={editUserForm.phone}
                  onChange={(e) => setEditUserForm({ ...editUserForm, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ backgroundColor: 'var(--bg-input)', color: 'var(--text-primary)' }}
                />
              </div>
              <div className="flex justify-end space-x-4 mt-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-sm font-medium rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Users;
