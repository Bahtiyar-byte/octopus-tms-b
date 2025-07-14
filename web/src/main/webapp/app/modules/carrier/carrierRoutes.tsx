import { Navigate, RouteObject } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types/user';

// Import Carrier pages
import Dashboard from './pages/Dashboard';
import SmartLoadSearch from './pages/SmartLoadSearch';
import DispatchBoard from './pages/DispatchBoard';
// import Documents from './pages/Documents'; // Replaced with shared Documents
import Documents from '../shared/pages/Documents/Documents';
import Tracking from './pages/Tracking';
import AllLoads from './pages/AllLoads';
import Drivers from './pages/Drivers';
import Invoices from './pages/Invoices';
import Reports from './pages/Reports';
import Workflows from './pages/Workflows';
import WorkflowBuilder from './pages/WorkflowBuilder';

// Role-based access control component
const CarrierRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Allow access to users with carrier-related roles or admin role
  const allowedRoles = [
    UserRole.CARRIER,
    UserRole.DISPATCHER,
    UserRole.DRIVER,
    UserRole.SUPERVISOR,
    UserRole.ADMIN
  ];
  
  if (!user?.role || !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Carrier module routes
const carrierRoutes: RouteObject[] = [
  {
    path: 'dashboard',
    element: <CarrierRoute><Dashboard /></CarrierRoute>,
  },
  {
    path: 'smart-load-search',
    element: <CarrierRoute><SmartLoadSearch /></CarrierRoute>,
  },
  {
    path: 'dispatch-board',
    element: <CarrierRoute><DispatchBoard /></CarrierRoute>,
  },
  {
    path: 'documents',
    element: <CarrierRoute><Documents /></CarrierRoute>,
  },
  {
    path: 'tracking',
    element: <CarrierRoute><Tracking /></CarrierRoute>,
  },
  {
    path: 'all-loads',
    element: <CarrierRoute><AllLoads /></CarrierRoute>,
  },
  {
    path: 'drivers',
    element: <CarrierRoute><Drivers /></CarrierRoute>,
  },
  {
    path: 'invoices',
    element: <CarrierRoute><Invoices /></CarrierRoute>,
  },
  {
    path: 'reports',
    element: <CarrierRoute><Reports /></CarrierRoute>,
  },
  {
    path: 'workflows',
    element: <CarrierRoute><Workflows /></CarrierRoute>,
  },
  {
    path: 'workflows/builder',
    element: <CarrierRoute><WorkflowBuilder /></CarrierRoute>,
  },
];

export default carrierRoutes;