import { Navigate, RouteObject } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types/user';

// Import Shipper pages
import Dashboard from './pages/Dashboard';
import Loads from './pages/Loads';
import CreateLoad from './pages/CreateLoad';
// import Documents from './pages/Documents'; // Replaced with shared Documents
import Documents from '../shared/pages/Documents/Documents';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Tracking from './pages/Tracking';
import { WarehouseDashboard } from './pages/WarehouseDashboard';
import Workflows from './pages/Workflows';
import WorkflowBuilder from './pages/WorkflowBuilder';
import Payments from './pages/Payments';

// Role-based access control component
const ShipperRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Allow access to users with shipper role or admin role
  if (user?.role !== UserRole.SHIPPER && user?.role !== UserRole.ADMIN && user?.role !== UserRole.SUPERVISOR) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

// Shipper module routes
const shipperRoutes: RouteObject[] = [
  {
    path: 'shipper',
    element: <ShipperRoute><Dashboard /></ShipperRoute>,
    children: []
  },
  {
    path: 'shipper/dashboard',
    element: <ShipperRoute><Dashboard /></ShipperRoute>,
  },
  {
    path: 'shipper/loads',
    element: <ShipperRoute><Loads /></ShipperRoute>,
  },
  {
    path: 'shipper/create-load',
    element: <ShipperRoute><CreateLoad /></ShipperRoute>,
  },
  {
    path: 'shipper/documents',
    element: <ShipperRoute><Documents /></ShipperRoute>,
  },
  {
    path: 'shipper/reports',
    element: <ShipperRoute><Reports /></ShipperRoute>,
  },
  {
    path: 'shipper/settings',
    element: <ShipperRoute><Settings /></ShipperRoute>,
  },
  {
    path: 'shipper/tracking',
    element: <ShipperRoute><Tracking /></ShipperRoute>,
  },
  {
    path: 'shipper/warehouse',
    element: <ShipperRoute><WarehouseDashboard /></ShipperRoute>,
  },
  {
    path: 'shipper/payments',
    element: <ShipperRoute><Payments /></ShipperRoute>,
  },
  {
    path: 'shipper/workflows',
    element: <ShipperRoute><Workflows /></ShipperRoute>,
  },
  {
    path: 'shipper/workflows/builder',
    element: <ShipperRoute><WorkflowBuilder /></ShipperRoute>,
  },
];

export default shipperRoutes;