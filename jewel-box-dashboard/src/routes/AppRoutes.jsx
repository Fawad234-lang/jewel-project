// src/routes/AppRoutes.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignIn from '../pages/SignIn';
import Dashboard from '../pages/Dashboard';
import Warehouses from '../pages/Warehouses';
import Branches from '../pages/Branches';
import Users from '../pages/Users';
import Categories from '../pages/Categories';
import Subcategories from '../pages/Subcategories';
import Products from '../pages/Products';
import TransferHistory from '../pages/TransferHistory';
import Expenses from '../pages/Expenses';
import SaleUpdateLogs from '../pages/SaleUpdateLogs';
import Profile from '../pages/profile'; // NEW: Import Profile page
import Settings from '../pages/settings'; // NEW: Import Settings page
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/" />;
};

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/warehouses"
          element={
            <PrivateRoute>
              <Warehouses />
            </PrivateRoute>
          }
        />
        <Route
          path="/branches"
          element={
            <PrivateRoute>
              <Branches />
            </PrivateRoute>
          }
        />
        <Route
          path="/users"
          element={
            <PrivateRoute>
              <Users />
            </PrivateRoute>
          }
        />
        <Route
          path="/categories"
          element={
            <PrivateRoute>
              <Categories />
            </PrivateRoute>
          }
        />
        <Route
          path="/subcategories"
          element={
            <PrivateRoute>
              <Subcategories />
            </PrivateRoute>
          }
        />
        <Route
          path="/products"
          element={
            <PrivateRoute>
              <Products />
            </PrivateRoute>
          }
        />
        <Route
          path="/transferhistory"
          element={
            <PrivateRoute>
              <TransferHistory />
            </PrivateRoute>
          }
        />
        <Route
          path="/expenses"
          element={
            <PrivateRoute>
              <Expenses />
            </PrivateRoute>
          }
        />
        <Route
          path="/saleupdatelogs"
          element={
            <PrivateRoute>
              <SaleUpdateLogs />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile" // NEW: Route for Profile page
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/settings" // NEW: Route for Settings page
          element={
            <PrivateRoute>
              <Settings />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default AppRoutes;