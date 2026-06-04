import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const getDashboardPathByRole = (role) => {
  if (role === 'admin') return '/dashboard';
  if (role === 'managing director') return '/dashboard-md';
  if (role === 'worker') return '/dashboard-worker';
  if (role === 'technical worker') return '/dashboard-technical';

  return '/';
};

const isTokenExpired = (decodedToken) => {
  if (!decodedToken?.exp) {
    return true;
  }

  return decodedToken.exp * 1000 < Date.now();
};

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/" replace />;
  }

  try {
    const decodedToken = jwtDecode(token);

    if (isTokenExpired(decodedToken)) {
      localStorage.removeItem('token');
      return <Navigate to="/" replace />;
    }

    const userRole = decodedToken.role;

    if (allowedRoles && !allowedRoles.includes(userRole)) {
      return (
        <Navigate
          to={getDashboardPathByRole(userRole)}
          replace
        />
      );
    }

    return children;
  } catch (err) {
    localStorage.removeItem('token');
    return <Navigate to="/" replace />;
  }
};

export default ProtectedRoute;