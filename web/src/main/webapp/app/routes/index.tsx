import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainLayout } from '../layouts';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { UserRole } from '../types/user';
import brokerRoutes from '../modules/broker/brokerRoutes';
import carrierRoutes from '../modules/carrier/carrierRoutes';
import shipperRoutes from '../modules/shipper/shipperRoutes';

// Import shared pages
import Reports from '../pages/Reports';
import Settings from '../pages/Settings';
import Login from '../pages/Login';
import Profile from '../pages/Profile';
import SupervisorDashboard from '../pages/SupervisorDashboard';
import ForgotPassword from '../pages/ForgotPassword';
import LoadDetails from '../pages/LoadDetails';
import TestBackend from '../pages/TestBackend';
import DashboardRedirect from '../components/DashboardRedirect';

// Auth guard component to protect routes
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // In a real app, this would check if the user is authenticated
  const isAuthenticated = localStorage.getItem('octopus_tms_token') || 
                          sessionStorage.getItem('octopus_tms_token');

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Create and export the router with future flags
const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <AuthProvider>
        <Login />
      </AuthProvider>
    ),
  },
  {
    path: '/forgot-password',
    element: (
      <AuthProvider>
        <ForgotPassword />
      </AuthProvider>
    ),
  },
  {
    path: '/test-backend',
    element: (
      <AuthProvider>
        <TestBackend />
      </AuthProvider>
    ),
  },
  {
    path: '/',
    element: (
      <AuthProvider>
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      </AuthProvider>
    ),
    children: [
      {
        path: '/',
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: '/dashboard',
        element: <DashboardRedirect />,
      },
      // Shared pages
      {
        path: '/reports',
        element: <Reports />,
      },
      {
        path: '/settings',
        element: <Settings />,
      },
      {
        path: '/profile',
        element: <Profile />,
      },
      {
        path: '/supervisor',
        element: <SupervisorDashboard />,
      },
      {
        path: '/load-details/:id',
        element: <LoadDetails />,
      },
      // Carrier module routes
      {
        path: 'carrier/*',
        children: carrierRoutes,
      },
      ...carrierRoutes.map(route => ({
        ...route,
        path: `carrier/${route.path}`
      })), // Map carrier routes to include 'carrier' prefix
      // Broker module routes
      ...brokerRoutes,
      // Shipper module routes
      ...shipperRoutes,
    ],
  },
]);

export default router;
