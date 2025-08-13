import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole, CompanyType } from '../types/core/user.types';

const DashboardRedirect: React.FC = () => {
  const { user } = useAuth();
  
  if (user?.role === UserRole.ADMIN) {
    return <Navigate to="/broker/dashboard" replace />; // Admin defaults to broker dashboard
  } else if (user?.companyType === CompanyType.BROKER) {
    return <Navigate to="/broker/dashboard" replace />;
  } else if (user?.companyType === CompanyType.SHIPPER) {
    return <Navigate to="/shipper/dashboard" replace />;
  } else if (user?.companyType === CompanyType.CARRIER) {
    return <Navigate to="/carrier/dashboard" replace />;
  } else {
    // Default to carrier dashboard for other roles (dispatcher, driver, etc.)
    return <Navigate to="/carrier/dashboard" replace />;
  }
};

export default DashboardRedirect;