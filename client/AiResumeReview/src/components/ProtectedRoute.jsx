import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('access_token');
  const userRole = localStorage.getItem('user_role'); // Ensure your Login page saves this!

  // 1. Check if user is logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 2. Check if user has the correct role (if roles are specified)
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // Optional: Add a toast notification here saying "Access Denied"
    return <Navigate to="/" replace />;
  }

  // 3. If passed, render the page
  return children;
};

export default ProtectedRoute;