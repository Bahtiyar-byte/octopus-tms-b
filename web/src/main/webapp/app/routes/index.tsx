import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainLayout } from '../layouts';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { authService } from '../services';
import brokerRoutes from '../modules/broker/brokerRoutes';
import carrierRoutes from '../modules/carrier/carrierRoutes';
import shipperRoutes from '../modules/shipper/shipperRoutes';

// Import shared pages
import Reports from '../pages/Reports';
import Settings from '../modules/shared/pages/Settings/Settings';
import Login from '../pages/Login';
import Profile from '../modules/shared/pages/Profile/Profile';
import ForgotPassword from '../pages/ForgotPassword';
import LoadDetails from '../pages/LoadDetails';
import TestBackend from '../pages/TestBackend';
import DashboardRedirect from '../components/DashboardRedirect';
import Workflows from '../pages/Workflows';
import WorkflowBuilder from '../pages/WorkflowBuilder';

// Auth guard component to protect routes
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // Use the AuthContext to get authentication state and loading status
  const { isAuthenticated, isLoading, user } = useAuth();
  
  // Also check token validity directly as a fallback
  const hasValidToken = authService.isAuthenticated();
  
  // Get current path for debugging
  const location = window.location.pathname;

  console.log('[ROUTE DEBUG] ProtectedRoute check at path:', location, {
    contextAuthenticated: isAuthenticated,
    tokenValid: hasValidToken,
    isLoading,
    hasUser: !!user,
    username: user?.username || 'none'
  });

  // If still loading, show nothing yet to prevent premature redirect
  if (isLoading) {
    console.log('[ROUTE DEBUG] Still loading auth state, showing spinner');
    return <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }

  // Only redirect if both checks fail - this prevents race conditions
  if (!isAuthenticated && !hasValidToken) {
    console.log('[ROUTE DEBUG] Authentication failed, redirecting to login', {
      contextAuthenticated: isAuthenticated,
      tokenValid: hasValidToken
    });
    return <Navigate to="/login" replace />;
  }

  console.log('[ROUTE DEBUG] Authentication successful, rendering protected content');
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
        path: '/load-details/:id',
        element: <LoadDetails />,
      },
      // Unified workflow routes
      {
        path: '/workflows',
        element: <Workflows />,
      },
      {
        path: '/workflows/builder',
        element: <WorkflowBuilder />,
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
