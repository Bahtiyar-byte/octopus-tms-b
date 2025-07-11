import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Card } from '../components';
import { TabType } from '../types/settings';
import CompanySettings from '../components/settings/CompanySettings';
import UserSettings from '../components/settings/UserSettings';
import IntegrationSettings from '../components/settings/IntegrationSettings';
import { AIIntegrationSettings } from '../components/settings/AIIntegrationSettings';
import NotificationSettings from '../components/settings/NotificationSettings';
import BillingSettings from '../components/settings/BillingSettings';
import AppearanceSettings from '../components/settings/AppearanceSettings';
import BackupSettings from '../components/settings/BackupSettings';
import LogSettings from '../components/settings/LogSettings';
import ToggleSwitch from '../components/ToggleSwitch';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types/user';
import { toast } from 'react-hot-toast';

// Broker-specific types
type BrokerTabType = 'broker-integrations' | 'automation' | 'commissions' | 'team';
type ExtendedTabType = TabType | BrokerTabType | 'ai-integration';

interface BrokerIntegration {
  id: string;
  name: string;
  description: string;
  isConnected: boolean;
  apiKey: string;
  icon: string;
  iconBg: string;
  category: 'loadboard' | 'tracking' | 'accounting' | 'communication' | 'compliance';
}

const Settings: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const isBroker = user?.role === UserRole.BROKER || user?.role === UserRole.ADMIN || user?.role === UserRole.SUPERVISOR;
  const [activeTab, setActiveTab] = useState<ExtendedTabType>('company');

  // Check if we're navigating from the notification settings link
  useEffect(() => {
    if (location.state && (location.state as any).activeTab) {
      setActiveTab((location.state as any).activeTab);
    }
  }, [location.state]);

  // Initial state values for components
  const initialCompanyInfo = {
    name: 'Octopus Transport LLC',
    mcNumber: 'MC-123456',
    dotNumber: 'DOT-789012',
    ein: '12-3456789',
    address: '123 Logistics Way',
    city: 'Chicago',
    state: 'IL',
    zip: '60007',
    phone: '(555) 123-4567',
    email: 'info@octopustms.com'
  };

  // Users are now fetched from backend

  const initialRoles = [
    {
      id: '1',
      name: 'Admin' as const,
      description: 'Full system access and control',
      userCount: 1,
      icon: 'fa-user-shield',
      iconBg: 'bg-purple-100 text-purple-600'
    },
    {
      id: '2',
      name: 'Dispatcher' as const,
      description: 'Manage loads and drivers',
      userCount: 2,
      icon: 'fa-tasks',
      iconBg: 'bg-blue-100 text-blue-600'
    },
    {
      id: '3',
      name: 'Accountant' as const,
      description: 'Access to financial data and reports',
      userCount: 1,
      icon: 'fa-calculator',
      iconBg: 'bg-yellow-100 text-yellow-600'
    },
    {
      id: '4',
      name: 'Viewer' as const,
      description: 'Read-only access to system',
      userCount: 0,
      icon: 'fa-eye',
      iconBg: 'bg-gray-100 text-gray-600'
    }
  ];

  const initialIntegrations = [
    {
      id: '1',
      name: 'QuickBooks Integration',
      description: 'Sync invoices, expenses, and payments with QuickBooks',
      isConnected: true,
      apiKey: 'QB-API-KEY-12345-ABCDE',
      icon: 'fa-calculator',
      iconBg: 'bg-blue-100 text-blue-600'
    },
    {
      id: '2',
      name: 'Samsara ELD Integration',
      description: 'Connect to Samsara for real-time ELD and GPS data',
      isConnected: true,
      apiKey: 'SAMSARA-API-67890-FGHIJ',
      icon: 'fa-truck',
      iconBg: 'bg-green-100 text-green-600'
    },
    {
      id: '3',
      name: 'DAT Load Board API',
      description: 'Connect to DAT Load Board for automated load searches',
      isConnected: false,
      apiKey: '',
      icon: 'fa-search',
      iconBg: 'bg-gray-100 text-gray-600'
    }
  ];

  const initialNotificationChannels = {
    email: true,
    sms: true,
    inApp: true
  };

  const initialNotificationTypes = {
    locationUpdates: { email: true, sms: false, inApp: true },
    delayAlerts: { email: true, sms: true, inApp: true },
    statusChanges: { email: true, sms: false, inApp: true },
    weatherAlerts: { email: true, sms: true, inApp: true },
    systemNotifications: { email: true, sms: false, inApp: true }
  };

  const initialAppearance = {
    theme: 'default',
    sidebarPosition: 'left',
    navbarStyle: 'fixed',
    contentWidth: 'container',
    density: 'comfortable',
    fontFamily: 'poppins',
    fontSize: 'medium',
    primaryColor: '#2563eb',
    secondaryColor: '#4f46e5'
  };

  const initialBackupSettings = {
    autoBackupEnabled: true,
    frequency: 'daily',
    retentionPeriod: '30'
  };

  // Broker-specific state
  const [brokerIntegrations, setBrokerIntegrations] = useState<BrokerIntegration[]>([
    {
      id: '1',
      name: 'DAT Load Board',
      description: 'Real-time load posting and searching on DAT network',
      isConnected: true,
      apiKey: 'DAT-API-KEY-12345-ABCDE',
      icon: 'fa-truck-loading',
      iconBg: 'bg-blue-100 text-blue-600',
      category: 'loadboard'
    },
    {
      id: '2',
      name: 'Truck Stop Load Board',
      description: 'Access to Truckstop.com load network and carrier verification',
      isConnected: true,
      apiKey: 'TRUCKSTOP-API-67890-FGHIJ',
      icon: 'fa-truck',
      iconBg: 'bg-green-100 text-green-600',
      category: 'loadboard'
    },
    {
      id: '3',
      name: '123LoadBoard',
      description: 'Connect to 123LoadBoard for additional load opportunities',
      isConnected: false,
      apiKey: '',
      icon: 'fa-search',
      iconBg: 'bg-gray-100 text-gray-600',
      category: 'loadboard'
    },
    {
      id: '4',
      name: 'Project44 Visibility',
      description: 'Real-time shipment tracking and visibility platform',
      isConnected: true,
      apiKey: 'P44-API-KEY-98765-LMNOP',
      icon: 'fa-map-marked-alt',
      iconBg: 'bg-purple-100 text-purple-600',
      category: 'tracking'
    },
    {
      id: '5',
      name: 'FourKites Tracking',
      description: 'Supply chain visibility and predictive analytics',
      isConnected: false,
      apiKey: '',
      icon: 'fa-satellite',
      iconBg: 'bg-gray-100 text-gray-600',
      category: 'tracking'
    },
    {
      id: '6',
      name: 'QuickBooks Integration',
      description: 'Sync invoices, payments, and financial data',
      isConnected: true,
      apiKey: 'QB-API-KEY-45678-QRSTU',
      icon: 'fa-calculator',
      iconBg: 'bg-yellow-100 text-yellow-600',
      category: 'accounting'
    },
    {
      id: '7',
      name: 'Triumph Factoring',
      description: 'Automated factoring and quick pay services',
      isConnected: false,
      apiKey: '',
      icon: 'fa-money-check-alt',
      iconBg: 'bg-gray-100 text-gray-600',
      category: 'accounting'
    },
    {
      id: '8',
      name: 'RMIS Insurance',
      description: 'Carrier insurance verification and monitoring',
      isConnected: true,
      apiKey: 'RMIS-API-KEY-87654-VWXYZ',
      icon: 'fa-shield-alt',
      iconBg: 'bg-red-100 text-red-600',
      category: 'compliance'
    },
    {
      id: '9',
      name: 'CarrierWatch',
      description: 'Carrier vetting and compliance monitoring',
      isConnected: false,
      apiKey: '',
      icon: 'fa-user-check',
      iconBg: 'bg-gray-100 text-gray-600',
      category: 'compliance'
    },
    {
      id: '10',
      name: 'Twilio SMS',
      description: 'Automated SMS notifications for carriers and customers',
      isConnected: true,
      apiKey: 'TWILIO-API-KEY-34567-ABCDE',
      icon: 'fa-sms',
      iconBg: 'bg-indigo-100 text-indigo-600',
      category: 'communication'
    }
  ]);

  const [automationSettings, setAutomationSettings] = useState({
    autoPostLoads: true,
    autoMatchCarriers: true,
    autoSendRateConfirmations: false,
    autoTrackShipments: true,
    autoUpdateCustomers: true,
    carrierResponseTimeout: 30,
    minCarrierRating: 4.0,
    maxLoadsPerCarrier: 5
  });

  const [commissionSettings, setCommissionSettings] = useState({
    baseRate: 6,
    tier1Rate: 8,
    tier1Threshold: 100000,
    tier2Rate: 10,
    tier2Threshold: 250000,
    tier3Rate: 12,
    tier3Threshold: 500000,
    paymentSchedule: 'monthly',
    paymentDay: 15
  });

  const [teamSettings, setTeamSettings] = useState({
    requireLoadApproval: false,
    approvalThreshold: 50000,
    enableTeamChat: true,
    shareCommissions: false,
    loadAssignmentMethod: 'round-robin'
  });

  const baseTabItems = [
    { id: 'company' as ExtendedTabType, label: 'Company Information', icon: 'fa-building' },
    { id: 'users' as ExtendedTabType, label: 'Users & Permissions', icon: 'fa-users' },
    { id: 'integrations' as ExtendedTabType, label: 'API Integrations', icon: 'fa-plug' },
    { id: 'ai-integration' as ExtendedTabType, label: 'AI Integration', icon: 'fa-robot' },
    { id: 'notifications' as ExtendedTabType, label: 'Notification Settings', icon: 'fa-bell' },
    { id: 'billing' as ExtendedTabType, label: 'Billing & Subscription', icon: 'fa-credit-card' },
    { id: 'appearance' as ExtendedTabType, label: 'Appearance', icon: 'fa-paint-brush' },
    { id: 'backup' as ExtendedTabType, label: 'Backup & Restore', icon: 'fa-database' },
    { id: 'logs' as ExtendedTabType, label: 'System Logs', icon: 'fa-history' }
  ];

  const brokerTabItems = [
    { id: 'broker-integrations' as ExtendedTabType, label: 'Broker Integrations', icon: 'fa-link' },
    { id: 'automation' as ExtendedTabType, label: 'Automation', icon: 'fa-cogs' },
    { id: 'commissions' as ExtendedTabType, label: 'Commission Structure', icon: 'fa-percentage' },
    { id: 'team' as ExtendedTabType, label: 'Team Settings', icon: 'fa-users-cog' }
  ];

  const tabItems = isBroker 
    ? [...baseTabItems.slice(0, 3), ...brokerTabItems, ...baseTabItems.slice(3)]
    : baseTabItems;

  // Broker-specific handlers
  const handleToggleIntegration = (integrationId: string) => {
    setBrokerIntegrations(brokerIntegrations.map(integration => {
      if (integration.id === integrationId) {
        const newStatus = !integration.isConnected;
        toast.success(`${integration.name} ${newStatus ? 'connected' : 'disconnected'}`);
        return { 
          ...integration, 
          isConnected: newStatus,
          apiKey: newStatus ? `${integration.name.toUpperCase().replace(/\s+/g, '-')}-API-KEY-${Math.floor(Math.random() * 90000) + 10000}` : ''
        };
      }
      return integration;
    }));
  };

  const handleSyncIntegration = (integrationId: string) => {
    const integration = brokerIntegrations.find(i => i.id === integrationId);
    if (integration) {
      toast.success(`Syncing data with ${integration.name}...`);
      setTimeout(() => {
        toast.success(`Sync with ${integration.name} completed successfully`);
      }, 2000);
    }
  };

  const handleTestIntegration = (integrationId: string) => {
    const integration = brokerIntegrations.find(i => i.id === integrationId);
    if (integration) {
      toast.success(`Testing connection to ${integration.name}...`);
      setTimeout(() => {
        toast.success(`${integration.name} connection test successful`);
      }, 1500);
    }
  };

  const handleSaveAutomationSettings = () => {
    toast.success('Automation settings saved successfully');
  };

  const handleSaveCommissionSettings = () => {
    toast.success('Commission settings updated successfully');
  };

  const handleSaveTeamSettings = () => {
    toast.success('Team settings saved successfully');
  };

  const groupedIntegrations = brokerIntegrations.reduce((acc, integration) => {
    if (!acc[integration.category]) {
      acc[integration.category] = [];
    }
    acc[integration.category].push(integration);
    return acc;
  }, {} as Record<string, BrokerIntegration[]>);

  const categoryLabels = {
    loadboard: 'Load Boards',
    tracking: 'Tracking & Visibility',
    accounting: 'Accounting & Finance',
    communication: 'Communication',
    compliance: 'Compliance & Verification'
  };

  return (
    <div className="fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Configure your TMS system settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <Card className="shadow-sm overflow-hidden">
            <nav className="flex flex-col">
              {tabItems.map(item => (
                <button 
                  key={item.id}
                  className={`flex items-center px-4 py-3 text-left transition-colors hover:bg-gray-50 focus:outline-none
                    ${activeTab === item.id 
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500' 
                      : 'text-gray-700 border-l-4 border-transparent'}`}
                  onClick={() => setActiveTab(item.id)}
                >
                  <i className={`fas ${item.icon} w-5 mr-3 ${activeTab === item.id ? 'text-blue-600' : 'text-gray-500'}`}></i>
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </nav>
          </Card>
        </div>

        <div className="lg:col-span-3">
          {activeTab === 'company' && (
            <Card className="shadow-sm">
              <CompanySettings initialCompanyInfo={initialCompanyInfo} />
            </Card>
          )}

          {activeTab === 'users' && (
            <Card className="shadow-sm">
              <UserSettings initialRoles={initialRoles} />
            </Card>
          )}

          {activeTab === 'integrations' && (
            <Card className="shadow-sm">
              <IntegrationSettings initialIntegrations={initialIntegrations} />
            </Card>
          )}

          {activeTab === 'ai-integration' && (
            <AIIntegrationSettings />
          )}

          {activeTab === 'notifications' && (
            <Card className="shadow-sm">
              <NotificationSettings 
                initialNotificationChannels={initialNotificationChannels} 
                initialNotificationTypes={initialNotificationTypes} 
              />
            </Card>
          )}

          {activeTab === 'billing' && (
            <Card className="shadow-sm">
              <BillingSettings />
            </Card>
          )}

          {activeTab === 'appearance' && (
            <Card className="shadow-sm">
              <AppearanceSettings initialAppearance={initialAppearance} />
            </Card>
          )}

          {activeTab === 'backup' && (
            <Card className="shadow-sm">
              <BackupSettings initialBackupSettings={initialBackupSettings} />
            </Card>
          )}

          {activeTab === 'logs' && (
            <Card className="shadow-sm">
              <LogSettings />
            </Card>
          )}

          {/* Broker-specific tabs */}
          {activeTab === 'broker-integrations' && (
            <div>
              <Card className="shadow-sm mb-6">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">Broker Services</h2>
                    <button className="btn btn-sm btn-primary">
                      <i className="fas fa-plus mr-2"></i> Add Integration
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 mb-6">
                    Connect your broker account with industry-leading platforms for seamless operations
                  </p>

                  {Object.entries(groupedIntegrations).map(([category, categoryIntegrations]) => (
                    <div key={category} className="mb-8">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">
                        {categoryLabels[category as keyof typeof categoryLabels]}
                      </h3>
                      <div className="space-y-4">
                        {categoryIntegrations.map(integration => (
                          <div key={integration.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                            <div className="p-4">
                              <div className="flex items-start justify-between">
                                <div className="flex items-start">
                                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${integration.iconBg}`}>
                                    <i className={`fas ${integration.icon}`}></i>
                                  </div>
                                  <div className="ml-3">
                                    <h4 className="text-base font-medium text-gray-900">{integration.name}</h4>
                                    <p className="text-sm text-gray-600 mt-1">{integration.description}</p>
                                  </div>
                                </div>
                                <ToggleSwitch 
                                  isOn={integration.isConnected} 
                                  onToggle={() => handleToggleIntegration(integration.id)}
                                />
                              </div>

                              {integration.isConnected && (
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                  <div className="mb-3">
                                    <label className="block text-xs font-medium text-gray-700 mb-1">API Key</label>
                                    <div className="flex">
                                      <input 
                                        type="text" 
                                        value={integration.apiKey} 
                                        readOnly 
                                        className="form-control text-sm bg-gray-50 flex-grow"
                                      />
                                      <button 
                                        className="btn btn-sm btn-white ml-2"
                                        onClick={() => {
                                          navigator.clipboard.writeText(integration.apiKey);
                                          toast.success('API key copied to clipboard');
                                        }}
                                      >
                                        <i className="fas fa-copy"></i>
                                      </button>
                                    </div>
                                  </div>
                                  
                                  <div className="flex space-x-2">
                                    <button 
                                      className="btn btn-sm btn-white"
                                      onClick={() => handleSyncIntegration(integration.id)}
                                    >
                                      <i className="fas fa-sync-alt mr-1"></i> Sync Now
                                    </button>
                                    <button 
                                      className="btn btn-sm btn-white"
                                      onClick={() => handleTestIntegration(integration.id)}
                                    >
                                      <i className="fas fa-vial mr-1"></i> Test Connection
                                    </button>
                                    <button className="btn btn-sm btn-white">
                                      <i className="fas fa-cog mr-1"></i> Settings
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'automation' && (
            <Card className="shadow-sm">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Automation Settings</h2>
                <p className="text-sm text-gray-600 mb-6">
                  Configure automated workflows to streamline your brokerage operations
                </p>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Load Management</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="font-medium text-gray-700">Auto-post loads to connected boards</label>
                          <p className="text-sm text-gray-500">Automatically post new loads to DAT, Truckstop, etc.</p>
                        </div>
                        <ToggleSwitch 
                          isOn={automationSettings.autoPostLoads} 
                          onToggle={() => setAutomationSettings({...automationSettings, autoPostLoads: !automationSettings.autoPostLoads})}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <label className="font-medium text-gray-700">Auto-match carriers</label>
                          <p className="text-sm text-gray-500">Automatically suggest best carrier matches for loads</p>
                        </div>
                        <ToggleSwitch 
                          isOn={automationSettings.autoMatchCarriers} 
                          onToggle={() => setAutomationSettings({...automationSettings, autoMatchCarriers: !automationSettings.autoMatchCarriers})}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <label className="font-medium text-gray-700">Auto-send rate confirmations</label>
                          <p className="text-sm text-gray-500">Automatically email rate cons when loads are booked</p>
                        </div>
                        <ToggleSwitch 
                          isOn={automationSettings.autoSendRateConfirmations} 
                          onToggle={() => setAutomationSettings({...automationSettings, autoSendRateConfirmations: !automationSettings.autoSendRateConfirmations})}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Tracking & Updates</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="font-medium text-gray-700">Auto-track shipments</label>
                          <p className="text-sm text-gray-500">Automatically fetch tracking updates from integrated systems</p>
                        </div>
                        <ToggleSwitch 
                          isOn={automationSettings.autoTrackShipments} 
                          onToggle={() => setAutomationSettings({...automationSettings, autoTrackShipments: !automationSettings.autoTrackShipments})}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <label className="font-medium text-gray-700">Auto-update customers</label>
                          <p className="text-sm text-gray-500">Send automatic status updates to customers</p>
                        </div>
                        <ToggleSwitch 
                          isOn={automationSettings.autoUpdateCustomers} 
                          onToggle={() => setAutomationSettings({...automationSettings, autoUpdateCustomers: !automationSettings.autoUpdateCustomers})}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Carrier Settings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Carrier Response Timeout
                        </label>
                        <div className="flex items-center">
                          <input
                            type="number"
                            value={automationSettings.carrierResponseTimeout}
                            onChange={(e) => setAutomationSettings({...automationSettings, carrierResponseTimeout: parseInt(e.target.value)})}
                            className="form-control"
                          />
                          <span className="ml-2 text-gray-500">minutes</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Minimum Carrier Rating
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          min="1"
                          max="5"
                          value={automationSettings.minCarrierRating}
                          onChange={(e) => setAutomationSettings({...automationSettings, minCarrierRating: parseFloat(e.target.value)})}
                          className="form-control"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Max Loads per Carrier
                        </label>
                        <input
                          type="number"
                          value={automationSettings.maxLoadsPerCarrier}
                          onChange={(e) => setAutomationSettings({...automationSettings, maxLoadsPerCarrier: parseInt(e.target.value)})}
                          className="form-control"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button 
                      onClick={handleSaveAutomationSettings}
                      className="btn btn-primary"
                    >
                      Save Automation Settings
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'commissions' && (
            <Card className="shadow-sm">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Commission Structure</h2>
                <p className="text-sm text-gray-600 mb-6">
                  Configure commission rates and payment schedules for your sales team
                </p>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Commission Tiers</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Base Rate (0 - ${commissionSettings.tier1Threshold.toLocaleString()})
                          </label>
                          <div className="flex items-center">
                            <input
                              type="number"
                              step="0.5"
                              value={commissionSettings.baseRate}
                              onChange={(e) => setCommissionSettings({...commissionSettings, baseRate: parseFloat(e.target.value)})}
                              className="form-control"
                            />
                            <span className="ml-2 text-gray-500">%</span>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tier 1 Threshold
                          </label>
                          <div className="flex items-center">
                            <span className="mr-2 text-gray-500">$</span>
                            <input
                              type="number"
                              value={commissionSettings.tier1Threshold}
                              onChange={(e) => setCommissionSettings({...commissionSettings, tier1Threshold: parseInt(e.target.value)})}
                              className="form-control"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tier 1 Rate (${commissionSettings.tier1Threshold.toLocaleString()} - ${commissionSettings.tier2Threshold.toLocaleString()})
                          </label>
                          <div className="flex items-center">
                            <input
                              type="number"
                              step="0.5"
                              value={commissionSettings.tier1Rate}
                              onChange={(e) => setCommissionSettings({...commissionSettings, tier1Rate: parseFloat(e.target.value)})}
                              className="form-control"
                            />
                            <span className="ml-2 text-gray-500">%</span>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tier 2 Threshold
                          </label>
                          <div className="flex items-center">
                            <span className="mr-2 text-gray-500">$</span>
                            <input
                              type="number"
                              value={commissionSettings.tier2Threshold}
                              onChange={(e) => setCommissionSettings({...commissionSettings, tier2Threshold: parseInt(e.target.value)})}
                              className="form-control"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tier 2 Rate (${commissionSettings.tier2Threshold.toLocaleString()} - ${commissionSettings.tier3Threshold.toLocaleString()})
                          </label>
                          <div className="flex items-center">
                            <input
                              type="number"
                              step="0.5"
                              value={commissionSettings.tier2Rate}
                              onChange={(e) => setCommissionSettings({...commissionSettings, tier2Rate: parseFloat(e.target.value)})}
                              className="form-control"
                            />
                            <span className="ml-2 text-gray-500">%</span>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tier 3 Threshold
                          </label>
                          <div className="flex items-center">
                            <span className="mr-2 text-gray-500">$</span>
                            <input
                              type="number"
                              value={commissionSettings.tier3Threshold}
                              onChange={(e) => setCommissionSettings({...commissionSettings, tier3Threshold: parseInt(e.target.value)})}
                              className="form-control"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tier 3 Rate (${commissionSettings.tier3Threshold.toLocaleString()}+)
                          </label>
                          <div className="flex items-center">
                            <input
                              type="number"
                              step="0.5"
                              value={commissionSettings.tier3Rate}
                              onChange={(e) => setCommissionSettings({...commissionSettings, tier3Rate: parseFloat(e.target.value)})}
                              className="form-control"
                            />
                            <span className="ml-2 text-gray-500">%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Schedule</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Payment Frequency
                        </label>
                        <select 
                          value={commissionSettings.paymentSchedule}
                          onChange={(e) => setCommissionSettings({...commissionSettings, paymentSchedule: e.target.value})}
                          className="form-control"
                        >
                          <option value="weekly">Weekly</option>
                          <option value="biweekly">Bi-weekly</option>
                          <option value="monthly">Monthly</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Payment Day
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="31"
                          value={commissionSettings.paymentDay}
                          onChange={(e) => setCommissionSettings({...commissionSettings, paymentDay: parseInt(e.target.value)})}
                          className="form-control"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button 
                      onClick={handleSaveCommissionSettings}
                      className="btn btn-primary"
                    >
                      Save Commission Settings
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'team' && (
            <Card className="shadow-sm">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Team Settings</h2>
                <p className="text-sm text-gray-600 mb-6">
                  Configure how your brokerage team collaborates and manages loads
                </p>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Load Management</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="font-medium text-gray-700">Require approval for high-value loads</label>
                          <p className="text-sm text-gray-500">Loads above threshold require supervisor approval</p>
                        </div>
                        <ToggleSwitch 
                          isOn={teamSettings.requireLoadApproval} 
                          onToggle={() => setTeamSettings({...teamSettings, requireLoadApproval: !teamSettings.requireLoadApproval})}
                        />
                      </div>

                      {teamSettings.requireLoadApproval && (
                        <div className="ml-12">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Approval Threshold
                          </label>
                          <div className="flex items-center w-64">
                            <span className="mr-2 text-gray-500">$</span>
                            <input
                              type="number"
                              value={teamSettings.approvalThreshold}
                              onChange={(e) => setTeamSettings({...teamSettings, approvalThreshold: parseInt(e.target.value)})}
                              className="form-control"
                            />
                          </div>
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Load Assignment Method
                        </label>
                        <select 
                          value={teamSettings.loadAssignmentMethod}
                          onChange={(e) => setTeamSettings({...teamSettings, loadAssignmentMethod: e.target.value})}
                          className="form-control w-64"
                        >
                          <option value="manual">Manual Assignment</option>
                          <option value="round-robin">Round Robin</option>
                          <option value="performance">Performance-based</option>
                          <option value="territory">Territory-based</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Collaboration</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="font-medium text-gray-700">Enable team chat</label>
                          <p className="text-sm text-gray-500">Allow brokers to communicate within the platform</p>
                        </div>
                        <ToggleSwitch 
                          isOn={teamSettings.enableTeamChat} 
                          onToggle={() => setTeamSettings({...teamSettings, enableTeamChat: !teamSettings.enableTeamChat})}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <label className="font-medium text-gray-700">Share commissions on team deals</label>
                          <p className="text-sm text-gray-500">Split commissions when multiple brokers work on a load</p>
                        </div>
                        <ToggleSwitch 
                          isOn={teamSettings.shareCommissions} 
                          onToggle={() => setTeamSettings({...teamSettings, shareCommissions: !teamSettings.shareCommissions})}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button 
                      onClick={handleSaveTeamSettings}
                      className="btn btn-primary"
                    >
                      Save Team Settings
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;