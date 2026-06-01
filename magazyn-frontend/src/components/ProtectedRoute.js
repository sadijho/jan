import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/" replace />;
  }

  try {
    const decodedToken = jwtDecode(token);
    const userRole = decodedToken.role;

    if (allowedRoles && !allowedRoles.includes(userRole)) {
      if (userRole === 'admin') return <Navigate to="/dashboard" replace />;
      if (userRole === 'managing director') return <Navigate to="/dashboard-md" replace />;
      if (userRole === 'worker') return <Navigate to="/dashboard-worker" replace />;

      return <Navigate to="/" replace />;
    }

    return children;
  } catch (err) {
    localStorage.removeItem('token');
    return <Navigate to="/" replace />;
  }
};

export default ProtectedRoute;