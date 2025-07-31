// src/pages/Settings.jsx
import React, { useEffect } from 'react';
import DashboardLayout from '../components/Layout/DashboardLayout';
import { useTheme } from '../context/ThemeContext';
import { Cog6ToothIcon, GlobeAltIcon, BellAlertIcon } from '@heroicons/react/24/outline'; // Removed AdjustmentsHorizontalIcon

const Settings = () => {
  const { isDarkMode } = useTheme();

  useEffect(() => {
    document.title = "Settings - Jewel Box App";
  }, []);

  return (
    <DashboardLayout>
      <div className="min-h-screen p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <div className="max-w-4xl w-full bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 sm:p-8 lg:p-10 space-y-8 transition-colors duration-200"
             style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-light)' }}>

          <h1 className="text-3xl sm:text-4xl font-extrabold mb-8 text-center" style={{ color: 'var(--text-primary)' }}>
            Application Settings
          </h1>

          {/* General Settings Section */}
          <div className="border-b pb-6" style={{ borderColor: 'var(--border-light)' }}>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3" style={{ color: 'var(--text-primary)' }}>
              <Cog6ToothIcon className="h-7 w-7 text-blue-500" /> General
            </h2>
            <div className="space-y-4 text-lg" style={{ color: 'var(--text-secondary)' }}>
              <div className="flex items-center justify-between py-2">
                <span>Theme:</span>
                <span className="font-medium">{isDarkMode ? 'Dark Mode' : 'Light Mode'}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Language:</span>
                <span className="font-medium">English</span>
              </div>
            </div>
          </div>

          {/* Notification Settings Section */}
          <div> {/* Removed border-b from here as it's the last section now */}
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3" style={{ color: 'var(--text-primary)' }}>
              <BellAlertIcon className="h-7 w-7 text-blue-500" /> Notifications
            </h2>
            <div className="space-y-4 text-lg" style={{ color: 'var(--text-secondary)' }}>
              <div className="flex items-center justify-between py-2">
                <span>Email Alerts:</span>
                <span className="font-medium">Enabled</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Push Notifications:</span>
                <span className="font-medium">Disabled</span>
              </div>
            </div>
          </div>

          <div className="text-center mt-8 pt-6 border-t" style={{ borderColor: 'var(--border-light)' }}>
            <p className="text-sm italic" style={{ color: 'var(--text-secondary)' }}>
              (This page displays current settings. Functionality to change them is not yet implemented.)
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;