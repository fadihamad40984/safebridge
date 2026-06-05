import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import ToastContainer from './components/Toast/ToastContainer';

// Pages
import Login from './pages/Login/Login';
import RegisterChild from './pages/Register/RegisterChild';
import RegisterParent from './pages/Register/RegisterParent';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import ResetPassword from './pages/ResetPassword/ResetPassword';
import Settings from './pages/Settings/Settings';
import ChildDashboard from './pages/ChildDashboard/ChildDashboard';
import ParentDashboard from './pages/ParentDashboard/ParentDashboard';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <ToastContainer />
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register/child" element={<RegisterChild />} />
          <Route path="/register/parent" element={<RegisterParent />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Protected Routes - Child */}
          <Route
            path="/child/dashboard"
            element={
              <PrivateRoute requiredRole="child">
                <ChildDashboard />
              </PrivateRoute>
            }
          />

          {/* Protected Routes - Parent */}
          <Route
            path="/parent/dashboard"
            element={
              <PrivateRoute requiredRole="parent">
                <ParentDashboard />
              </PrivateRoute>
            }
          />

          {/* Protected Routes - Settings (All authenticated users) */}
          <Route
            path="/settings"
            element={
              <PrivateRoute>
                <Settings />
              </PrivateRoute>
            }
          />

          {/* Default Route */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* 404 Route */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
