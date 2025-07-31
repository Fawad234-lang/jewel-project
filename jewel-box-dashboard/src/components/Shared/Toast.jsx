// src/components/Shared/Toast.jsx
import React, { useEffect, useState } from 'react';
import { CheckCircleIcon, XCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

const Toast = ({ message, type, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  // Control visibility with a state for animation
  useEffect(() => {
    if (message) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [message]);

  // Determine background color and icon based on toast type
  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
  const Icon = type === 'success' ? CheckCircleIcon : XCircleIcon;

  // Don't render if no message
  if (!message) return null;

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 p-4 rounded-lg shadow-lg text-white flex items-center space-x-3 transition-all duration-300 transform
        ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        ${bgColor}`}
      role="alert"
    >
      <Icon className="h-6 w-6" />
      <span className="text-sm font-medium">{message}</span>
      {/* Close button */}
      <button onClick={onClose} className="ml-auto text-white hover:text-gray-100 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-white">
        <XMarkIcon className="h-5 w-5" />
      </button>
    </div>
  );
};

export default Toast;