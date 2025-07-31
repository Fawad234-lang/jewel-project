// src/context/ThemeContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check local storage for saved preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    // Default to system preference if no saved theme
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    // This effect runs whenever isDarkMode changes
    if (isDarkMode) {
      // Set the 'data-theme' attribute on the root HTML element to 'dark'
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark'); // Save preference
    } else {
      // Set the 'data-theme' attribute to 'light'
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light'); // Save preference
    }
  }, [isDarkMode]); // Re-run effect when isDarkMode state changes

  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode); // Toggle the state
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children} {/* Render wrapped components */}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);