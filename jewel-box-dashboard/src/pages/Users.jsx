// src/pages/Users.jsx
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/Layout/DashboardLayout';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';

const Users = () => {
  const { isDarkMode } = useTheme();
  const { showToast } = useToast();
  const [usersData, setUsersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Set Page Title ---
  useEffect(() => {
    document.title = "Users - Jewel Box App";
  }, []);

  // --- Fetch Users from Backend ---
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('http://localhost:5000/api/users'); // Your backend API URL
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setUsersData(data);
        showToast("Users loaded successfully!", "success");
      } catch (err) {
        console.error("Failed to fetch users:", err);
        setError("Failed to load users. Please ensure the backend server is running and data is seeded.");
        showToast(`Failed to load users: ${err.message}`, "error");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [showToast]);

  const handleAddUser = async () => {
    // In a real app, you'd have a form for this
    const name = prompt("Enter user name:");
    const email = prompt("Enter user email:");
    const password = prompt("Enter user password:");
    const role = prompt("Enter user role (Admin, Warehouse Manager, Branch Manager, Assistant Manager):");
    const phone = prompt("Enter user phone:");

    if (!name || !email || !password || !role || !phone) {
      showToast("All fields are required to add a user.", "error");
      return;
    }

    const newUser = { name, email, password, role, phone };

    try {
      const response = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message}`);
      }
      const addedUser = await response.json();
      setUsersData((prevData) => [...prevData, addedUser]);
      showToast("User added successfully!", "success");
    } catch (err) {
      console.error("Failed to add user:", err);
      showToast(`Failed to add user: ${err.message}`, "error");
    }
  };

  const handleEdit = async (id) => {
    const currentUser = usersData.find(u => u._id === id);
    if (!currentUser) return;

    const newName = prompt("Enter new name:", currentUser.name);
    const newEmail = prompt("Enter new email:", currentUser.email);
    const newRole = prompt("Enter new role:", currentUser.role);
    const newPhone = prompt("Enter new phone:", currentUser.phone);

    if (!newName || !newEmail || !newRole || !newPhone) {
      showToast("All fields are required for update.", "error");
      return;
    }

    const updatedFields = {
      name: newName,
      email: newEmail,
      role: newRole,
      phone: newPhone,
      // Password is not typically updated via a prompt for security reasons
      // If password needs to be updated, it should be a separate secure flow
    };

    try {
      const response = await fetch(`http://localhost:5000/api/users/${id}`, {
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
      const updatedUser = await response.json();
      setUsersData((prevData) =>
        prevData.map((user) =>
          user._id === id ? updatedUser : user
        )
      );
      showToast("User updated successfully!", "success");
    } catch (err) {
      console.error("Failed to update user:", err);
      showToast(`Failed to update user: ${err.message}`, "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }
    try {
      const response = await fetch(`http://localhost:5000/api/users/${id}`, {
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
    }
  };

  const tableHeaderClasses = "px-6 py-3 text-left text-xs font-medium uppercase tracking-wider";
  const tableCellClasses = "px-6 py-4 whitespace-nowrap text-sm";

  // Filter users by role for display
  const admins = usersData.filter(user => user.role === 'Admin');
  const warehouseManagers = usersData.filter(user => user.role === 'Warehouse Manager');
  const branchManagers = usersData.filter(user => user.role === 'Branch Manager');
  const assistantManagers = usersData.filter(user => user.role === 'Assistant Manager');


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
                <th scope="col" className={tableHeaderClasses} style={{ color: 'var(--text-secondary)' }}>Password</th> {/* Note: Displaying password is not secure in real apps */}
                <th scope="col" className={tableHeaderClasses} style={{ color: 'var(--text-secondary)' }}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-light)' }}> {/* Fixed: Removed extra '}' */}
              {users.map((user) => (
                <tr key={user._id}>
                  <td className={tableCellClasses} style={{ color: 'var(--text-primary)' }}>{user.name}</td>
                  <td className={tableCellClasses} style={{ color: 'var(--text-primary)' }}>{user.role}</td>
                  <td className={tableCellClasses} style={{ color: 'var(--text-primary)' }}>{user.email}</td>
                  <td className={tableCellClasses} style={{ color: 'var(--text-primary)' }}>{user.phone}</td>
                  <td className={tableCellClasses} style={{ color: 'var(--text-primary)' }}>{user.password}</td>
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
    </DashboardLayout>
  );
};

export default Users;