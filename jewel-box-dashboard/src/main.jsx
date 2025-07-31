// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css'; // Keep your main CSS import

// All AG Grid imports and module registrations are removed.
// Table styling will now be handled by Tailwind CSS and custom components.

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);