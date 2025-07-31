// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase/config'; // Make sure this path is correct

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe; // Cleanup subscription on unmount
  }, []);

  const logout = () => {
    return signOut(auth);
  };

  const value = {
    currentUser,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children} {/* Only render children when auth state is determined */}
    </AuthContext.Provider>
  );
};