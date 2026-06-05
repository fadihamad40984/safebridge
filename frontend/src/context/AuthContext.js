import React, { createContext, useState, useContext, useEffect } from 'react';
import { getStoredUser, logout as logoutService } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // التحقق من وجود مستخدم مسجل دخول
    const storedUser = getStoredUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    logoutService();
    setUser(null);
  };

  const updateUser = (userData) => {
    setUser(userData);
    // Update localStorage if token exists
    const token = localStorage.getItem('token');
    if (token) {
      localStorage.setItem('user', JSON.stringify(userData));
    }
  };

  const isAuthenticated = () => {
    return !!user;
  };

  const isChild = () => {
    return user?.role === 'child';
  };

  const isParent = () => {
    return user?.role === 'parent';
  };

  const value = {
    user,
    loading,
    login,
    logout,
    updateUser,
    isAuthenticated,
    isChild,
    isParent,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
