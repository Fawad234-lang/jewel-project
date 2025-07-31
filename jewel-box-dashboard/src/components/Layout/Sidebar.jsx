// src/components/Layout/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  HomeIcon, // Changed from RectangleStackIcon for Dashboard for consistency
  BuildingStorefrontIcon,
  BuildingOffice2Icon, // Used for Branches
  UsersIcon,
  TagIcon, // Used for Categories
  Squares2X2Icon, // Used for Subcategories
  ArchiveBoxIcon, // Used for Products
  ArrowPathIcon, // Used for Transfer History
  BanknotesIcon, // Used for Expenses
  ClipboardDocumentListIcon // Added for Sale Update Logs
} from '@heroicons/react/24/outline'; // Outline for stroke icons
import { useTheme } from '../../context/ThemeContext'; // Import useTheme

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const { isDarkMode } = useTheme(); // Use the theme context

  const navItems = [
    { name: 'Dashboard', icon: HomeIcon, path: '/dashboard' },
    { name: 'Warehouses', icon: BuildingStorefrontIcon, path: '/warehouses' },
    { name: 'Branches', icon: BuildingOffice2Icon, path: '/branches' },
    { name: 'Users', icon: UsersIcon, path: '/users' },
    { name: 'Categories', icon: TagIcon, path: '/categories' },
    { name: 'Subcategories', icon: Squares2X2Icon, path: '/subcategories' },
    { name: 'Products', icon: ArchiveBoxIcon, path: '/products' },
    { name: 'Transfer History', icon: ArrowPathIcon, path: '/transferhistory' }, // Corrected path
    { name: 'Expenses', icon: BanknotesIcon, path: '/expenses' },
    { name: 'Sale Update Logs', icon: ClipboardDocumentListIcon, path: '/saleupdatelogs' }, // Corrected path
  ];

  return (
    // Conditional classes for responsiveness and dark mode
    <div
      className={`fixed inset-y-0 left-0 z-40 w-64 shadow-lg flex flex-col pt-6 pb-4 transition-transform duration-300 lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
      style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-light)' }}
    >
      <div className="px-6 mb-8 flex items-center justify-between"> {/* Added justify-between for potential close button */}
        <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Jewel Box</h2>
        {/* Close button for mobile sidebar (only visible on small screens when open) */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
          style={{ color: 'var(--text-secondary)' }}
          aria-label="Close sidebar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <nav className="flex-grow overflow-y-auto custom-scrollbar">
        <ul className="space-y-2 px-4">
          {navItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center p-3 rounded-lg font-medium text-sm transition-colors duration-150 ease-in-out
                   ${isActive
                     ? 'bg-blue-500 text-white shadow-md' // Active state for dark and light mode
                     : isDarkMode
                       ? 'text-gray-300 hover:bg-gray-700 hover:text-white' // Dark mode hover
                       : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900' // Light mode hover
                   }`
                }
                onClick={toggleSidebar} // Close sidebar on link click for mobile
              >
                <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
