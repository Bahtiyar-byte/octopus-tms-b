import { Navigate, RouteObject } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types/user';

// Import Broker pages
import Dashboard from './pages/Dashboard';
import CreateLoad from './pages/CreateLoad';
import Loads from './pages/Loads';
import CarrierMatch from './pages/CarrierMatch';
import Contracts from './pages/Contracts';
import Invoices from './pages/Invoices';
import Documents from './pages/Documents';
import Reports from './pages/Reports';
import Customers from './pages/Customers';
import Carriers from './pages/Carriers';
import Tracking from './pages/Tracking';
import SupervisorDashboard from './pages/SupervisorDashboard';
import Commissions from './pages/Commissions';
import { SmartLoadMatch } from './pages/SmartLoadMatch';
import WorkflowBuilder from './pages/WorkflowBuilder';
import Workflows from './pages/Workflows';

// Role-based access control component
const BrokerRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Allow access to users with broker role or admin role
  if (user?.role !== UserRole.BROKER && user?.role !== UserRole.ADMIN && user?.role !== UserRole.SUPERVISOR) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

// Broker module routes
const brokerRoutes: RouteObject[] = [
  {
    path: 'broker',
    element: <BrokerRoute><Dashboard /></BrokerRoute>,
    children: []
  },
  {
    path: 'broker/dashboard',
    element: <BrokerRoute><Dashboard /></BrokerRoute>,
  },
  {
    path: 'broker/create-load',
    element: <BrokerRoute><CreateLoad /></BrokerRoute>,
  },
  {
    path: 'broker/loads',
    element: <BrokerRoute><Loads /></BrokerRoute>,
  },
  {
    path: 'broker/carrier-match',
    element: <BrokerRoute><CarrierMatch /></BrokerRoute>,
  },
  {
    path: 'broker/smart-load-match',
    element: <BrokerRoute><SmartLoadMatch /></BrokerRoute>,
  },
  {
    path: 'broker/contracts',
    element: <BrokerRoute><Contracts /></BrokerRoute>,
  },
  {
    path: 'broker/payments',
    element: <BrokerRoute><Invoices /></BrokerRoute>,
  },
  {
    path: 'broker/documents',
    element: <BrokerRoute><Documents /></BrokerRoute>,
  },
  {
    path: 'broker/reports',
    element: <BrokerRoute><Reports /></BrokerRoute>,
  },
  {
    path: 'broker/customers',
    element: <BrokerRoute><Customers /></BrokerRoute>,
  },
  {
    path: 'broker/carriers',
    element: <BrokerRoute><Carriers /></BrokerRoute>,
  },
  {
    path: 'broker/tracking',
    element: <BrokerRoute><Tracking /></BrokerRoute>,
  },
  {
    path: 'broker/supervisor',
    element: <BrokerRoute><SupervisorDashboard /></BrokerRoute>,
  },
  {
    path: 'broker/commissions',
    element: <BrokerRoute><Commissions /></BrokerRoute>,
  },
  {
    path: 'broker/workflows',
    element: <BrokerRoute><Workflows /></BrokerRoute>,
  },
  {
    path: 'broker/workflows/builder',
    element: <BrokerRoute><WorkflowBuilder /></BrokerRoute>,
  },
];

export default brokerRoutes;