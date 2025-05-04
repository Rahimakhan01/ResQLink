
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface PrivateRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, profile, isLoading } = useAuth();

  // Show loading or nothing while checking authentication
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // If there are role restrictions and user doesn't have permission
  if (allowedRoles && profile && !allowedRoles.includes(profile.role)) {
    // For debugging purposes
    console.log("Role check failed:", profile.role, allowedRoles);
    return <Navigate to="/dashboard" />;
  }

  // If authenticated and has permission, render the route
  return <>{children}</>;
};

export default PrivateRoute;
