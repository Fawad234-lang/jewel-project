import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  MoonIcon, SunIcon, HomeIcon, BuildingStorefrontIcon, UsersIcon, TagIcon,
  ShoppingCartIcon, CurrencyDollarIcon, ArrowPathRoundedSquareIcon, ClipboardDocumentListIcon,
  Bars3Icon, XMarkIcon, MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/config';

// A component for the user avatar, with a subtle animated effect.
const UserAvatar = ({ displayName, photoURL }) => {
  return (
    <div className="relative h-9 w-9 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg group-hover:ring-2 group-hover:ring-blue-500 transition-all duration-200">
      {photoURL ? (
        <img
          className="h-full w-full rounded-full object-cover"
          src={photoURL}
          alt="User Avatar"
          // Add a simple error handler for the image
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = `https://placehold.co/36x36/3b82f6/ffffff?text=${displayName ? displayName.charAt(0).toUpperCase() : 'A'}`;
          }}
        />
      ) : (
        <span className="text-sm">
          {displayName ? displayName.charAt(0).toUpperCase() : 'A'}
        </span>
      )}
    </div>
  );
};

// The main DashboardLayout component, combining all logic and UI.
const DashboardLayout = ({ children }) => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { currentUser, logout: authContextLogout } = useAuth();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const navigate = useNavigate();

  const handleProfileClick = () => {
    setShowProfileDropdown(prev => !prev);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      authContextLogout();
      navigate('/');
      setShowProfileDropdown(false);
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  const toggleSearch = () => {
    setIsSearchVisible(prev => !prev);
  };

  const navItems = [
    { name: 'Dashboard', icon: HomeIcon, path: '/dashboard' },
    { name: 'Warehouses', icon: BuildingStorefrontIcon, path: '/warehouses' },
    { name: 'Branches', icon: BuildingStorefrontIcon, path: '/branches' },
    { name: 'Users', icon: UsersIcon, path: '/users' },
    { name: 'Categories', icon: TagIcon, path: '/categories' },
    { name: 'Subcategories', icon: TagIcon, path: '/subcategories' },
    { name: 'Products', icon: ShoppingCartIcon, path: '/products' },
    { name: 'Transfer History', icon: ArrowPathRoundedSquareIcon, path: '/transferhistory' },
    { name: 'Expenses', icon: CurrencyDollarIcon, path: '/expenses' },
    { name: 'Sale Update Logs', icon: ClipboardDocumentListIcon, path: '/saleupdatelogs' },
  ];

  return (
    <div className="flex min-h-screen transition-colors duration-200 font-sans" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Sidebar - Responsive */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 shadow-md p-4 flex flex-col transition-transform duration-300 lg:translate-x-0
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
        style={{ backgroundColor: 'var(--bg-card)' }}
      >
        <div className="flex items-center justify-between py-4 border-b mb-6" style={{ borderColor: 'var(--border-light)' }}>
          <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Jewel Box</h2>
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
                  onMouseOver={e => { e.currentTarget.style.backgroundColor = 'var(--hover-bg)'; e.currentTarget.style.color = 'var(--hover-text)'; }}
                  onMouseOut={e => { e.currentTarget.style.backgroundColor = ''; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                  onClick={() => setIsSidebarOpen(false)}
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
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto lg:ml-64 transition-all duration-300">
        {/* Header (with Dark Mode Toggle and Profile Dropdown) */}
        <header
          className="py-3 px-4 sm:px-6 fixed top-0 right-0 w-full lg:w-[calc(100%-16rem)] z-20 shadow-md transition-colors duration-200"
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

            {/* Search Bar - only visible on large screens */}
            <div className="relative flex-grow max-w-xs sm:max-w-sm md:max-w-md hidden lg:flex items-center">
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

            {/* Right Side Icons */}
            <div className="flex items-center space-x-2 sm:space-x-4 ml-auto">
              {/* Mobile search toggle button */}
              <button
                onClick={toggleSearch}
                className="lg:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
                style={{ color: 'var(--text-secondary)' }}
                aria-label="Toggle search"
              >
                <MagnifyingGlassIcon className="w-6 h-6" />
              </button>

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

              <div className="relative">
                <button
                  onClick={handleProfileClick}
                  className="flex items-center space-x-2 cursor-pointer p-1 rounded-full
                             hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none
                             focus:ring-2 focus:ring-blue-500 transition-colors duration-150
                             group transform hover:scale-105 transition-transform duration-200"
                >
                  <UserAvatar displayName={currentUser?.displayName} photoURL={currentUser?.photoURL} />
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
          {/* Mobile Search Bar - only visible when toggled */}
          {isSearchVisible && (
            <div className="lg:hidden mt-2 relative flex items-center">
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
          )}
        </header>

        {/* Page Content */}
        <div className="p-4 sm:p-6 lg:p-8 mt-16">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
