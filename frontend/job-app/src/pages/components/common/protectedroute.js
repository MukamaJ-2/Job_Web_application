import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const location = useLocation();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    // Redirect to login page but save the location they were trying to access
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // If user's role is not in the allowed roles, redirect to home
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute; 