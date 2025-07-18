import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types/core/user.types';

const DashboardRedirect: React.FC = () => {
  const { user } = useAuth();
  
  if (user?.role === UserRole.BROKER || user?.role === UserRole.ADMIN) {
    return <Navigate to="/broker/dashboard" replace />;
  } else if (user?.role === UserRole.SHIPPER) {
    return <Navigate to="/shipper/dashboard" replace />;
  } else if (user?.role === UserRole.CARRIER) {
    return <Navigate to="/carrier/dashboard" replace />;
  } else {
    // Default to carrier dashboard for other roles (dispatcher, driver, etc.)
    return <Navigate to="/carrier/dashboard" replace />;
  }
};

export default DashboardRedirect;