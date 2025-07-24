import { Navigate, RouteObject } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole, CompanyType } from '../../types/core/user.types';

// Import Shared pages
import Dashboard from '../shared/pages/Dashboard/Dashboard';
import Documents from '../shared/pages/Documents/Documents';
import Reports from '../shared/pages/Reports/Reports';
import Tracking from '../shared/pages/Tracking/Tracking';
import Invoices from '../shared/pages/Invoices/Invoices';
import Loads from '../shared/pages/Loads/Loads';

// Import Shipper-specific pages
import CreateLoad from './pages/CreateLoad';
import Settings from './pages/Settings';
import { WarehouseDashboard } from './pages/WarehouseDashboard';
import Workflows from '../../pages/Workflows';
import WorkflowBuilder from '../../pages/WorkflowBuilder';
import Payments from './pages/Payments';

// Role-based access control component
const ShipperRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Allow access to users from shipper companies or admins
  if (user?.role !== UserRole.ADMIN && user?.role !== UserRole.SUPERVISOR && user?.companyType !== CompanyType.SHIPPER) {
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