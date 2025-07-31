// src/App.jsx
import React from 'react';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider, useToast } from './context/ToastContext'; // Import ToastProvider and useToast
import Toast from './components/Shared/Toast'; // Import Toast component

// A wrapper component to display the toast globally
const AppContent = () => {
  const { toast, hideToast } = useToast();
  return (
    <>
      <AppRoutes />
      {/* Render the Toast component if there's a toast message */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <ToastProvider> {/* Wrap AppContent with ToastProvider */}
          <AppContent />
        </ToastProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;