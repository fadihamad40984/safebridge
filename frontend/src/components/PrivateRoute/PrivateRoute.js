import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PrivateRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={styles.loading}>
        <div style={styles.spinner}></div>
        <p>جاري التحميل...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const styles = {
  loading: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    fontFamily: 'Arial, sans-serif',
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '5px solid #f3f3f3',
    borderTop: '5px solid #4CAF50',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
};

export default PrivateRoute;
