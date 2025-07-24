import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { UserRole, CompanyType } from '../../../../types';
import { useRoleConfig } from '../../hooks/useRoleConfig';

// Notification types
type NotificationType = 'location_update' | 'delay_alert' | 'status_change' | 'weather_alert' | 'system';



// Notification interface
interface Notification {
  id: string;
  time: string;
  loadId?: string;
  type: NotificationType;
  message: string;
  isRead: boolean;
}

const Topbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isResourcesMenuOpen, setIsResourcesMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', time: '10:45 AM', loadId: 'LD1003', type: 'location_update', message: 'Truck arrived in Macon, GA', isRead: false },
    { id: '2', time: '09:30 AM', loadId: 'LD1006', type: 'delay_alert', message: 'Truck delayed due to traffic on I-5. ETA pushed by 45 min.', isRead: false },
    { id: '3', time: '08:15 AM', loadId: 'LD1007', type: 'status_change', message: 'Shipment entering final delivery zone. Arriving soon.', isRead: true },
    { id: '4', time: 'Yesterday', loadId: 'LD1002', type: 'weather_alert', message: 'Heavy rain expected along route. Driver notified.', isRead: true },
    { id: '5', time: 'Yesterday', type: 'system', message: 'System maintenance scheduled for tonight at 2 AM EST.', isRead: true }
  ]);
  const resourcesMenuRef = useRef<HTMLDivElement>(null);
  const notificationsMenuRef = useRef<HTMLDivElement>(null);

  // Resources submenu items for Carrier
  const carrierResourcesItems = [
    { path: '/carrier/workflows', label: 'Workflows' },
    { path: '/carrier/documents', label: 'Documents' },
    { path: '/carrier/invoices', label: 'Invoices' },
    { path: '/carrier/reports', label: 'Reports' },
    { path: '/carrier/drivers', label: 'Drivers' },
  ];

  // Resources submenu items for Broker
  const brokerResourcesItems = [
    { path: '/broker/workflows', label: 'Workflows' },
    { path: '/broker/reports', label: 'Reports' },
    { path: '/broker/documents', label: 'Documents' },
    { path: '/broker/contracts', label: 'Contracts' },
    { path: '/broker/payments', label: 'Invoices' },
    { path: '/broker/commissions', label: 'Commissions' },
    { path: '/broker/monetization/showcase', label: 'Monetize' },
  ];

  // Resources submenu items for Shipper
  const shipperResourcesItems = [
    { path: '/shipper/workflows', label: 'Workflows' },
    { path: '/shipper/documents', label: 'Documents' },
    { path: '/shipper/reports', label: 'Reports' },
    { path: '/shipper/payments', label: 'Invoices' },
    { path: '/shipper/settings', label: 'Settings' },
  ];


  // Main navigation routes for Carrier role
  const carrierRoutes = [
    { path: '/carrier/dashboard', label: 'Dashboard' },
    { path: '/carrier/all-loads', label: 'Loads' },
    { path: '/carrier/smart-load-search', label: 'Smart Load Search' },
    { path: '/carrier/dispatch-board', label: 'Dispatch Board' },
    { path: '/carrier/tracking', label: 'Tracking' },
    // Resources dropdown will be rendered separately
  ];

  // Routes to show based on user role
  let routes = [];

  // If user is a broker, show only broker-specific routes
  if (user?.companyType === CompanyType.BROKER) {
    routes = [
      { path: '/broker/dashboard', label: 'Dashboard' },
      { path: '/broker/loads', label: 'Loads' },
      { path: '/broker/carrier-match', label: 'Carrier Match' },
      { path: '/broker/tracking', label: 'Tracking' },
    ];
  }
  // If user is a shipper, show shipper-specific routes
  else if (user?.companyType === CompanyType.SHIPPER) {
    routes = [
      { path: '/shipper/dashboard', label: 'Dashboard' },
      { path: '/shipper/loads', label: 'Loads' },
      { path: '/shipper/warehouse', label: 'Warehouse' },
      // Documents, Reports, and Settings will be in the Resources dropdown for shippers
    ];
  }
  // Otherwise show carrier routes
  else if (user?.companyType === CompanyType.CARRIER) {
    routes = [...carrierRoutes];
  }
  // Default fallback (should not happen with proper auth)
  else {
    routes = [...carrierRoutes];
  }

  // Get notification type badge class
  const getNotificationTypeBadgeClass = (type: NotificationType) => {
    switch(type) {
      case 'location_update':
        return 'bg-blue-100 text-blue-800';
      case 'delay_alert':
        return 'bg-red-100 text-red-800';
      case 'status_change':
        return 'bg-green-100 text-green-800';
      case 'weather_alert':
        return 'bg-yellow-100 text-yellow-800';
      case 'system':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get notification type label
  const getNotificationTypeLabel = (type: NotificationType) => {
    switch(type) {
      case 'location_update':
        return 'Location Update';
      case 'delay_alert':
        return 'Delay Alert';
      case 'status_change':
        return 'Status Change';
      case 'weather_alert':
        return 'Weather Alert';
      case 'system':
        return 'System';
      default:
        return type;
    }
  };

  // Get unread notification count
  const getUnreadCount = () => {
    return notifications.filter(notification => !notification.isRead).length;
  };

  // Mark notification as read
  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notification =>
        notification.id === id ? { ...notification, isRead: true } : notification
    ));
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, isRead: true })));
    toast.success('All notifications marked as read');
  };

  // Handle notification click
  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);

    // Navigate to relevant page based on notification type
    if (notification.loadId) {
      // For load-related notifications, navigate to the load details
      navigate(`/load-details/${notification.loadId}`);
    } else if (notification.type === 'system') {
      // For system notifications, you might want to navigate to settings or just show a toast
      toast(notification.message, { icon: 'ℹ️' });
    }

    setIsNotificationsOpen(false);
  };

  // Handle click outside to close dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (resourcesMenuRef.current && !resourcesMenuRef.current.contains(event.target as Node)) {
        setIsResourcesMenuOpen(false);
      }
      if (notificationsMenuRef.current && !notificationsMenuRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      // Error handled in logout function
    }
  };

  // Get the correct dashboard path based on user role
  const getDashboardPath = () => {
    if (user?.companyType === CompanyType.BROKER || user?.role === UserRole.ADMIN) {
      return '/broker/dashboard';
    } else if (user?.companyType === CompanyType.SHIPPER) {
      return '/shipper/dashboard';
    } else if (user?.companyType === CompanyType.CARRIER) {
      return '/carrier/dashboard';
    } else {
      // Default to carrier dashboard for other roles
      return '/carrier/dashboard';
    }
  };

  return (
      <nav className="bg-blue-600 text-white sticky top-0 z-10 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link to={getDashboardPath()} className="font-bold text-xl mr-6">
              Octopus TMS
            </Link>

            <div className="hidden md:block flex-grow">
              <div className="flex justify-evenly">
                {routes.map((route) => (
                    <Link
                        key={route.path}
                        to={route.path}
                        className={`px-4 py-2 mx-1 rounded-md text-sm font-medium ${
                            location.pathname === route.path
                                ? 'bg-blue-700 text-white'
                                : 'text-white hover:bg-blue-500'
                        }`}
                    >
                      {route.label}
                    </Link>
                ))}

                {/* Resources Dropdown - Show for all users */}
                {(
                    <div className="relative" ref={resourcesMenuRef}>
                      <button
                          type="button"
                          className={`px-3 py-2 rounded-md text-sm font-medium flex items-center ${
                              (user?.companyType === CompanyType.BROKER
                                      ? location.pathname.includes('/broker/reports') ||
                                      location.pathname.includes('/broker/customers') ||
                                      location.pathname.includes('/broker/carriers') ||
                                      location.pathname.includes('/broker/documents') ||
                                      location.pathname.includes('/broker/contracts') ||
                                      location.pathname.includes('/broker/payments') ||
                                      location.pathname.includes('/broker/commissions')
                                      : user?.companyType === CompanyType.SHIPPER
                                          ? location.pathname.includes('/shipper/documents') ||
                                          location.pathname.includes('/shipper/reports') ||
                                          location.pathname.includes('/shipper/settings')
                                          : carrierResourcesItems.some(item => location.pathname === item.path)
                              ) ? 'bg-blue-700 text-white' : 'text-white hover:bg-blue-500'
                          }`}
                          onClick={() => setIsResourcesMenuOpen(!isResourcesMenuOpen)}
                      >
                        Resources
                        <svg className="ml-1 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>

                      {isResourcesMenuOpen && (
                          <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-20">
                            {(user?.companyType === CompanyType.BROKER ? brokerResourcesItems :
                                user?.companyType === CompanyType.SHIPPER ? shipperResourcesItems :
                                    carrierResourcesItems).map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    onClick={() => setIsResourcesMenuOpen(false)}
                                >
                                  {item.label}
                                </Link>
                            ))}
                          </div>
                      )}
                    </div>
                )}

              </div>
            </div>

            {/* Notifications Menu */}
            {isAuthenticated && (
                <div className="relative ml-auto mr-4" ref={notificationsMenuRef}>
                  <button
                      type="button"
                      className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-500 hover:bg-blue-600 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-600 focus:ring-white relative transition-colors"
                      onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  >
                    <span className="sr-only">View notifications</span>
                    <i className="fas fa-bell"></i>
                    {getUnreadCount() > 0 && (
                        <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                    {getUnreadCount()}
                  </span>
                    )}
                  </button>

                  {isNotificationsOpen && (
                      <div className="absolute right-0 mt-2 w-80 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-20">
                        <div className="px-4 py-2 border-b border-gray-200 flex justify-between items-center">
                          <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                          {getUnreadCount() > 0 && (
                              <button
                                  onClick={markAllAsRead}
                                  className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                              >
                                Mark all as read
                              </button>
                          )}
                        </div>

                        <div className="max-h-80 overflow-y-auto">
                          {notifications.length === 0 ? (
                              <div className="px-4 py-6 text-center text-gray-500">
                                <i className="fas fa-bell-slash text-2xl mb-2"></i>
                                <p className="text-sm">No notifications</p>
                              </div>
                          ) : (
                              notifications.map(notification => (
                                  <div
                                      key={notification.id}
                                      className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-l-4 ${notification.isRead ? 'border-transparent' : 'border-blue-500'}`}
                                      onClick={() => handleNotificationClick(notification)}
                                  >
                                    <div className="flex justify-between items-start">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getNotificationTypeBadgeClass(notification.type)}`}>
                              {getNotificationTypeLabel(notification.type)}
                            </span>
                                      <span className="text-xs text-gray-500">{notification.time}</span>
                                    </div>
                                    <p className="mt-1 text-sm text-gray-800">{notification.message}</p>
                                    {notification.loadId && (
                                        <p className="mt-1 text-xs text-gray-500">Load: {notification.loadId}</p>
                                    )}
                                  </div>
                              ))
                          )}
                        </div>

                        <div className="border-t border-gray-200 px-4 py-2">
                          <button
                              className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center w-full text-left"
                              onClick={() => {
                                setIsNotificationsOpen(false);
                                navigate('/settings', { state: { activeTab: 'notifications' } });
                              }}
                          >
                            <i className="fas fa-cog mr-1"></i> Notification settings
                          </button>
                        </div>
                      </div>
                  )}
                </div>
            )}

            {/* User Profile Menu */}
            {isAuthenticated && (
                <div className="relative">
                  <div>
                    <button
                        type="button"
                        className="flex items-center max-w-xs rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-600 focus:ring-white"
                        onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    >
                      <span className="sr-only">Open user menu</span>
                      {user?.avatarUrl ? (
                          <img className="h-8 w-8 rounded-full" src={user.avatarUrl} alt={user.firstName} />
                      ) : (
                          <div className="h-8 w-8 rounded-full bg-blue-300 flex items-center justify-center text-blue-800 font-bold">
                            {user?.firstName?.charAt(0) || 'U'}
                          </div>
                      )}
                      <span className="ml-2 hidden lg:block text-white">{user?.firstName} {user?.lastName}</span>
                      <svg className="ml-1 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>

                  {isProfileMenuOpen && (
                      <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-20">
                        <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-200">
                          <p>Signed in as</p>
                          <p className="font-semibold">{user?.username}</p>
                          <p className="text-xs mt-1 text-gray-500">Role: {user?.role}</p>
                        </div>
                        <Link
                            to="/profile"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setIsProfileMenuOpen(false)}
                        >
                          <i className="fas fa-user-circle mr-2"></i> Your Profile
                        </Link>
                        <Link
                            to="/settings"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setIsProfileMenuOpen(false)}
                        >
                          <i className="fas fa-cog mr-2"></i> Settings
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <i className="fas fa-sign-out-alt mr-2"></i> Sign out
                        </button>
                      </div>
                  )}
                </div>
            )}

            <div className="md:hidden">
              <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="text-white hover:text-gray-200 focus:outline-none"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isMenuOpen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {isMenuOpen && (
              <div className="md:hidden pb-3">
                {routes.map((route) => (
                    <Link
                        key={route.path}
                        to={route.path}
                        className={`block px-3 py-2 rounded-md text-base font-medium ${
                            location.pathname === route.path
                                ? 'bg-blue-700 text-white'
                                : 'text-white hover:bg-blue-500'
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                    >
                      {route.label}
                    </Link>
                ))}

                {/* Resources section in mobile view */}
                <div className="mt-1">
                  <button
                      className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                          (user?.companyType === CompanyType.BROKER
                              ? brokerResourcesItems.some(item => location.pathname === item.path)
                              : user?.companyType === CompanyType.SHIPPER
                                  ? shipperResourcesItems.some(item => location.pathname === item.path)
                                  : carrierResourcesItems.some(item => location.pathname === item.path))
                              ? 'bg-blue-700 text-white'
                              : 'text-white hover:bg-blue-500'
                      }`}
                      onClick={() => setIsResourcesMenuOpen(!isResourcesMenuOpen)}
                  >
                    Resources
                    <svg className="ml-1 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>

                  {isResourcesMenuOpen && (
                      <div className="pl-6 py-1">
                        {(user?.companyType === CompanyType.BROKER ? brokerResourcesItems :
                            user?.companyType === CompanyType.SHIPPER ? shipperResourcesItems :
                                carrierResourcesItems).map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-blue-500"
                                onClick={() => {
                                  setIsResourcesMenuOpen(false);
                                  setIsMenuOpen(false);
                                }}
                            >
                              {item.label}
                            </Link>
                        ))}
                      </div>
                  )}
                </div>

                {isAuthenticated && (
                    <>
                      <div className="border-t border-blue-500 my-2"></div>
                      <Link
                          to="/profile"
                          className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-blue-500"
                          onClick={() => setIsMenuOpen(false)}
                      >
                        <i className="fas fa-user-circle mr-2"></i> Your Profile
                      </Link>
                      <button
                          onClick={handleLogout}
                          className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white hover:bg-blue-500"
                      >
                        <i className="fas fa-sign-out-alt mr-2"></i> Sign out
                      </button>
                    </>
                )}
              </div>
          )}
        </div>
      </nav>
  );
};

export default Topbar;
