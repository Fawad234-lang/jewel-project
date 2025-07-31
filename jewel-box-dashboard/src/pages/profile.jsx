// src/pages/Profile.jsx
import React, { useEffect } from 'react';
import DashboardLayout from '../components/Layout/DashboardLayout';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { UserCircleIcon, EnvelopeIcon, IdentificationIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';

const Profile = () => {
  const { isDarkMode } = useTheme();
  const { currentUser } = useAuth(); // Get current user info

  useEffect(() => {
    document.title = "Your Profile - Jewel Box App";
  }, []);

  return (
    <DashboardLayout>
      <div className="min-h-screen p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <div className="max-w-4xl w-full bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 sm:p-8 lg:p-10 transition-colors duration-200 text-center"
             style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-light)' }}>

          <h1 className="text-3xl sm:text-4xl font-extrabold mb-8" style={{ color: 'var(--text-primary)' }}>
            Your Profile
          </h1>

          {currentUser ? (
            <div className="flex flex-col items-center gap-8">
              {/* Profile Picture Section */}
              <div className="flex-shrink-0 relative">
                <img
                  src={currentUser.photoURL || "https://placehold.co/150x150/A0A0A0/FFFFFF?text=User"}
                  alt="User Avatar"
                  className="w-36 h-36 sm:w-40 sm:h-40 rounded-full object-cover border-4 border-blue-500 shadow-lg"
                />
                {/* Online indicator - purely visual */}
                <span className="absolute bottom-2 right-2 bg-green-500 rounded-full w-5 h-5 border-2 border-white dark:border-gray-800"></span>
              </div>

              {/* User Details Section */}
              <div className="flex-grow text-center">
                <h2 className="text-2xl sm:text-3xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                  {currentUser.displayName || 'Admin User'}
                </h2>
                <div className="space-y-3 text-lg sm:text-xl text-left inline-block"> {/* Aligned left within its container */}
                  <p className="flex items-center gap-3" style={{ color: 'var(--text-secondary)' }}>
                    <EnvelopeIcon className="h-6 w-6 text-blue-500" />
                    <span>Email: {currentUser.email || 'N/A'}</span>
                  </p>
                  <p className="flex items-center gap-3" style={{ color: 'var(--text-secondary)' }}>
                    <IdentificationIcon className="h-6 w-6 text-blue-500" />
                    <span>User ID: {currentUser.uid || 'N/A'}</span>
                  </p>
                  {/* Placeholder for role if you want to display it statically */}
                  <p className="flex items-center gap-3" style={{ color: 'var(--text-secondary)' }}>
                    <UserCircleIcon className="h-6 w-6 text-blue-500" />
                    <span>Role: Admin (Placeholder)</span>
                  </p>
                  <p className="flex items-center gap-3" style={{ color: 'var(--text-secondary)'}}>
                    <CalendarDaysIcon className="h-6 w-6 text-blue-500" />
                    <span>Joined: {currentUser.metadata?.creationTime ? new Date(currentUser.metadata.creationTime).toLocaleDateString() : 'N/A'}</span>
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-xl font-medium" style={{ color: 'var(--text-red)' }}>
                No user logged in.
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;