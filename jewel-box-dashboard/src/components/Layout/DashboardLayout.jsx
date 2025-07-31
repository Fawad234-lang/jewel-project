// src/components/Layout/DashboardLayout.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  MoonIcon, SunIcon, HomeIcon, BuildingStorefrontIcon, UsersIcon, TagIcon,
  ShoppingCartIcon, CurrencyDollarIcon, ArrowPathRoundedSquareIcon, ClipboardDocumentListIcon,
  Bars3Icon, XMarkIcon // Added XMarkIcon for closing sidebar
} from '@heroicons/react/24/outline';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext'; // Assuming you have an AuthContext
import { signOut } from 'firebase/auth'; // Import signOut
import { auth } from '../../firebase/config'; // Import auth instance

const DashboardLayout = ({ children }) => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { currentUser, logout: authContextLogout } = useAuth(); // Get currentUser and logout from AuthContext
  const [showProfileDropdown, setShowProfileDropdown] = useState(false); // State for profile dropdown
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for mobile sidebar visibility
  const navigate = useNavigate();

  const handleProfileClick = () => {
    setShowProfileDropdown(prev => !prev); // Toggle dropdown visibility
  };

  const handleLogout = async () => {
    try {
      await signOut(auth); // Use Firebase signOut
      authContextLogout(); // Update AuthContext state
      navigate('/'); // Redirect to sign-in page after logout
      setShowProfileDropdown(false); // Close dropdown after logout
    } catch (error) {
      console.error("Error logging out:", error.message);
      // Optionally show a toast notification for logout error
    }
  };

  // Toggle sidebar for mobile
  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  // Base classes for inputs and selects, now responsive
  const inputAndSelectClasses = "w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors duration-200";

  const navItems = [
    { name: 'Dashboard', icon: HomeIcon, path: '/dashboard' },
    { name: 'Warehouses', icon: BuildingStorefrontIcon, path: '/warehouses' },
    { name: 'Branches', icon: BuildingStorefrontIcon, path: '/branches' }, // Reused icon, consider distinct if available
    { name: 'Users', icon: UsersIcon, path: '/users' },
    { name: 'Categories', icon: TagIcon, path: '/categories' },
    { name: 'Subcategories', icon: TagIcon, path: '/subcategories' }, // Reused icon
    { name: 'Products', icon: ShoppingCartIcon, path: '/products' },
    { name: 'Transfer History', icon: ArrowPathRoundedSquareIcon, path: '/transferhistory' },
    { name: 'Expenses', icon: CurrencyDollarIcon, path: '/expenses' },
    { name: 'Sale Update Logs', icon: ClipboardDocumentListIcon, path: '/saleupdatelogs' },
  ];

  return (
    <div className="flex min-h-screen transition-colors duration-200" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Sidebar - Responsive */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 shadow-md p-4 flex flex-col transition-transform duration-300 lg:translate-x-0
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`} // Apply dark mode background
        style={{ backgroundColor: 'var(--bg-card)' }}
      >
        <div className="flex items-center justify-between py-4 border-b mb-6" style={{ borderColor: 'var(--border-light)' }}>
          <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Jewel Box</h2>
          {/* Close button for mobile sidebar */}
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
            style={{ color: 'var(--text-secondary)' }}
            aria-label="Close sidebar"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <nav className="flex-grow overflow-y-auto">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className="flex items-center p-3 rounded-lg font-medium transition-colors duration-150 group"
                  style={{ color: 'var(--text-secondary)', '--hover-bg': 'var(--bg-button-secondary)', '--hover-text': 'var(--text-link)' }}
                  onMouseOver={e => { e.currentTarget.style.backgroundColor = e.currentTarget.style.getPropertyValue('--hover-bg'); e.currentTarget.style.color = e.currentTarget.style.getPropertyValue('--hover-text'); }}
                  onMouseOut={e => { e.currentTarget.style.backgroundColor = ''; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                  onClick={() => setIsSidebarOpen(false)} // Close sidebar on link click for mobile
                >
                  <item.icon className="h-5 w-5 mr-3" style={{ color: 'var(--text-secondary)' }} />
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={toggleSidebar} // Close sidebar when clicking overlay
        ></div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto lg:ml-64 transition-all duration-300"> {/* Adjusted margin for sidebar */}
        {/* Header (with Dark Mode Toggle and Profile Dropdown) */}
        <header className="shadow-sm p-4 flex items-center justify-between sticky top-0 z-20 transition-colors duration-200" style={{ backgroundColor: 'var(--bg-card)' }}>
          {/* Hamburger menu for mobile */}
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150 mr-4"
            style={{ color: 'var(--text-secondary)' }}
            aria-label="Open sidebar"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>

          <div className="flex items-center space-x-4 flex-grow"> {/* flex-grow to push items right */}
            {/* Search Bar */}
            <div className="relative flex items-center w-full max-w-xs sm:max-w-sm lg:max-w-md"> {/* Responsive max-width */}
              <input
                type="text"
                placeholder="Search via barcode"
                className={inputAndSelectClasses}
                style={{
                  borderColor: 'var(--border-light)',
                  backgroundColor: 'var(--bg-input)',
                  color: 'var(--text-primary)',
                  '--tw-placeholder-color': 'var(--text-placeholder)'
                }}
              />
              <button type="button" className="absolute left-3" style={{ color: 'var(--text-placeholder)' }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
              </button>
            </div>
          </div>
          <div className="flex items-center space-x-4 ml-auto"> {/* ml-auto to push to right */}
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full shadow-md hover:scale-105 transition-transform"
              aria-label="Toggle Dark Mode"
              style={{ backgroundColor: 'var(--bg-button-secondary)', color: 'var(--text-secondary)' }}
            >
              {isDarkMode ? (
                <SunIcon className="h-6 w-6" />
              ) : (
                <MoonIcon className="h-6 w-6" />
              )}
            </button>
            {/* User Profile / Admin dropdown */}
            <div className="relative">
              <button
                onClick={handleProfileClick} // Toggle dropdown on click
                className="flex items-center space-x-2 cursor-pointer p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-150"
              >
                <img
                  className="h-8 w-8 rounded-full object-cover"
                  src={currentUser?.photoURL || "https://via.placeholder.com/40"} // Use currentUser photoURL
                  alt="User Avatar"
                />
                <span className="font-medium hidden sm:block" style={{ color: 'var(--text-primary)' }}>{currentUser ? currentUser.email : 'Admin'}</span> {/* Display user email */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4" style={{ color: 'var(--text-secondary)' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </button>

              {/* Dropdown content - Conditionally rendered */}
              {showProfileDropdown && (
                <div
                  className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg py-1 z-20 transition-all duration-200 ease-out transform origin-top-right scale-100 opacity-100"
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    borderColor: 'var(--border-light)',
                    color: 'var(--text-primary)'
                  }}
                >
                  <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 border-b" style={{ borderColor: 'var(--border-light)' }}>
                    Signed in as<br />
                    <span className="font-semibold">{currentUser ? currentUser.email : 'Guest'}</span>
                  </div>
                  <Link to="/profile" className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-150" style={{ color: 'var(--text-primary)' }}>
                    Your Profile
                  </Link>
                  <Link to="/settings" className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-150" style={{ color: 'var(--text-primary)' }}>
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100 dark:hover:bg-red-800 dark:text-red-300 transition-colors duration-150"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 sm:p-6 lg:p-8"> {/* Responsive padding for content */}
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
