// src/components/Layout/Header.jsx
import React, { useState } from 'react';
import { MagnifyingGlassIcon, BellIcon, MoonIcon, Bars3Icon } from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext'; // Import useTheme
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/config';
import { useNavigate, Link } from 'react-router-dom'; // Import Link

const Header = ({ toggleSidebar }) => { // Accepts toggleSidebar prop
  const { currentUser, logout: authContextLogout } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme(); // Use the theme context
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      authContextLogout(); // Update AuthContext state
      navigate('/'); // Redirect to sign-in page after logout
      setShowProfileDropdown(false); // Close dropdown after logout
    } catch (error) {
      console.error("Error logging out:", error.message);
      // Optionally show a toast notification for logout error
    }
  };

  const handleProfileClick = () => {
    setShowProfileDropdown(prev => !prev);
  };

  return (
    <header
      className={`py-3 px-4 sm:px-6 fixed top-0 right-0 w-full lg:w-[calc(100%-16rem)] z-20 shadow-md transition-colors duration-200`} // Responsive width and padding
      style={{ backgroundColor: 'var(--bg-card)', borderBottom: '1px solid var(--border-light)' }}
    >
      <div className="flex items-center justify-between h-14">
        {/* Hamburger menu for small screens */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150 mr-3"
          style={{ color: 'var(--text-secondary)' }}
          aria-label="Open sidebar"
        >
          <Bars3Icon className="h-6 w-6" />
        </button>

        {/* Search Bar */}
        <div className="relative flex items-center flex-grow max-w-xs sm:max-w-sm md:max-w-md"> {/* Responsive max-width */}
          <MagnifyingGlassIcon className="absolute left-3 w-5 h-5" style={{ color: 'var(--text-placeholder)' }} />
          <input
            type="text"
            placeholder="Search via barcode"
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors duration-200"
            style={{
              borderColor: 'var(--border-light)',
              backgroundColor: 'var(--bg-input)',
              color: 'var(--text-primary)',
              '--tw-placeholder-color': 'var(--text-placeholder)'
            }}
          />
        </div>

        {/* Right Side Icons and User */}
        <div className="flex items-center space-x-2 sm:space-x-4 ml-auto"> {/* Responsive spacing */}
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
          {/* Notification Bell Icon */}
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors duration-150">
            <BellIcon className="w-6 h-6" />
          </button>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={handleProfileClick}
              className="flex items-center space-x-2 cursor-pointer p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-150"
            >
              <img
                className="h-8 w-8 rounded-full object-cover"
                src={currentUser?.photoURL || "https://via.placeholder.com/40"}
                alt="User Avatar"
              />
              <span className="font-medium hidden sm:block" style={{ color: 'var(--text-primary)' }}>{currentUser ? currentUser.email : 'Admin'}</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4" style={{ color: 'var(--text-secondary)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            </button>

            {showProfileDropdown && (
              <div
                className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 z-20 transition-all duration-200 ease-out transform origin-top-right scale-100 opacity-100"
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
      </div>
    </header>
  );
};

export default Header;
