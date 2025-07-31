// src/context/ToastContext.jsx
import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  // State to hold toast message and type: { message: '...', type: 'success' | 'error' }
  const [toast, setToast] = useState(null);

  // Callback to show a toast message
  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    // Automatically hide the toast after 3 seconds
    setTimeout(() => {
      setToast(null);
    }, 3000);
  }, []);

  // Callback to explicitly hide the toast
  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  return (
    <ToastContext.Provider value={{ toast, showToast, hideToast }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);