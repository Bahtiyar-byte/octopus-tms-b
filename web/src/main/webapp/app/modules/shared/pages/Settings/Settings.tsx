import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Card } from '../../../../components';
import { TabType } from '../../../../types/settings';
import CompanySettings from '../../../../components/settings/CompanySettings';
import UserSettings from '../../../../components/settings/UserSettings';
import IntegrationSettings from '../../../../components/settings/IntegrationSettings';
import { AIIntegrationSettings } from '../../../../components/settings/AIIntegrationSettings';
import NotificationSettings from '../../../../components/settings/NotificationSettings';
import BillingSettings from '../../../../components/settings/BillingSettings';
import BackupSettings from '../../../../components/settings/BackupSettings';
import LogSettings from '../../../../components/settings/LogSettings';
import ToggleSwitch from '../../../../components/ToggleSwitch';
import { useAuth } from '../../../../context/AuthContext';
import { UserRole } from '../../../../types/core/user.types';
import { toast } from 'react-hot-toast';
import { useRoleConfig } from '../../hooks/useRoleConfig';



// Broker-specific types
type BrokerTabType = 'automation' | 'commissions' | 'team';
type ShipperTabType = 'inventory-settings' | 'warehouse' | 'shipping-preferences';
type CarrierTabType = 'fleet' | 'driver-management' | 'compliance' | 'routes';
type ExtendedTabType = TabType | BrokerTabType | ShipperTabType | CarrierTabType | 'ai-integration';

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
      name: 'Samsara ELD Integration',
      description: 'Connect to Samsara for real-time ELD and GPS data',
      isConnected: true,
      apiKey: 'SAMSARA-API-67890-FGHIJ',
      icon: 'fa-truck',
      iconBg: 'bg-green-100 text-green-600',
      category: 'tracking'
    },
    {
      id: '5',
      name: 'Project44 Visibility',
      description: 'Real-time shipment tracking and visibility platform',
      isConnected: true,
      apiKey: 'P44-API-KEY-98765-LMNOP',
      icon: 'fa-map-marked-alt',
      iconBg: 'bg-purple-100 text-purple-600',
      category: 'tracking'
    },
    {
      id: '6',
      name: 'FourKites Tracking',
      description: 'Supply chain visibility and predictive analytics',
      isConnected: false,
      apiKey: '',
      icon: 'fa-satellite',
      iconBg: 'bg-gray-100 text-gray-600',
      category: 'tracking'
    },
    {
      id: '7',
      name: 'QuickBooks Integration',
      description: 'Sync invoices, payments, and financial data',
      isConnected: true,
      apiKey: 'QB-API-KEY-45678-QRSTU',
      icon: 'fa-calculator',
      iconBg: 'bg-yellow-100 text-yellow-600',
      category: 'accounting'
    },
    {
      id: '8',
      name: 'Triumph Factoring',
      description: 'Automated factoring and quick pay services',
      isConnected: false,
      apiKey: '',
      icon: 'fa-money-check-alt',
      iconBg: 'bg-gray-100 text-gray-600',
      category: 'accounting'
    },
    {
      id: '9',
      name: 'RMIS Insurance',
      description: 'Carrier insurance verification and monitoring',
      isConnected: true,
      apiKey: 'RMIS-API-KEY-87654-VWXYZ',
      icon: 'fa-shield-alt',
      iconBg: 'bg-red-100 text-red-600',
      category: 'compliance'
    },
    {
      id: '10',
      name: 'CarrierWatch',
      description: 'Carrier vetting and compliance monitoring',
      isConnected: false,
      apiKey: '',
      icon: 'fa-user-check',
      iconBg: 'bg-gray-100 text-gray-600',
      category: 'compliance'
    },
    {
      id: '11',
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
    { id: 'backup' as ExtendedTabType, label: 'Backup & Restore', icon: 'fa-database' },
    { id: 'logs' as ExtendedTabType, label: 'System Logs', icon: 'fa-history' }
  ];

  const brokerTabItems = [
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
                <div>
                  <Card className="shadow-sm mb-6">
                    <IntegrationSettings initialIntegrations={initialIntegrations} />
                  </Card>
                  {/* Broker Integrations Section */}
                  {isBroker && (
                    <Card className="shadow-sm">
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
                  )}
                </div>
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

// Role-specific types
// type BrokerTabType = 'broker-integrations' | 'automation' | 'commissions' | 'team';
// type ShipperTabType = 'inventory-settings' | 'warehouse' | 'shipping-preferences';
// type CarrierTabType = 'fleet' | 'driver-management' | 'compliance' | 'routes';
// type ExtendedTabType = TabType | BrokerTabType | ShipperTabType | CarrierTabType | 'ai-integration';
//
// interface RoleIntegration {
//   id: string;
//   name: string;
//   description: string;
//   isConnected: boolean;
//   apiKey: string;
//   icon: string;
//   iconBg: string;
//   category: string;
// }
//
// const Settings: React.FC = () => {
//   const { user } = useAuth();
//   const location = useLocation();
//   const config = useRoleConfig('settings');
//   const [activeTab, setActiveTab] = useState<ExtendedTabType>('company');
//
//   // Check if we're navigating from the notification settings link
//   useEffect(() => {
//     if (location.state && (location.state as any).activeTab) {
//       setActiveTab((location.state as any).activeTab);
//     }
//   }, [location.state]);
//
//   // Initial state values for components
//   const initialCompanyInfo = {
//     name: 'Octopus Transport LLC',
//     mcNumber: 'MC-123456',
//     dotNumber: 'DOT-789012',
//     ein: '12-3456789',
//     address: '123 Logistics Way',
//     city: 'Chicago',
//     state: 'IL',
//     zip: '60007',
//     phone: '(555) 123-4567',
//     email: 'info@octopustms.com'
//   };
//
//   const initialRoles = [
//     {
//       id: '1',
//       name: 'Admin' as const,
//       description: 'Full system access and control',
//       userCount: 1,
//       icon: 'fa-user-shield',
//       iconBg: 'bg-purple-100 text-purple-600'
//     },
//     {
//       id: '2',
//       name: 'Dispatcher' as const,
//       description: 'Manage loads and drivers',
//       userCount: 2,
//       icon: 'fa-tasks',
//       iconBg: 'bg-blue-100 text-blue-600'
//     },
//     {
//       id: '3',
//       name: 'Accountant' as const,
//       description: 'Access to financial data and reports',
//       userCount: 1,
//       icon: 'fa-calculator',
//       iconBg: 'bg-yellow-100 text-yellow-600'
//     },
//     {
//       id: '4',
//       name: 'Viewer' as const,
//       description: 'Read-only access to system',
//       userCount: 0,
//       icon: 'fa-eye',
//       iconBg: 'bg-gray-100 text-gray-600'
//     }
//   ];
//
//   // Role-based integrations
//   const getRoleIntegrations = (): RoleIntegration[] => {
//     const role = user?.role;
//
//     const integrationsByRole: Record<string, RoleIntegration[]> = {
//       BROKER: [
//         {
//           id: '1',
//           name: 'DAT Load Board',
//           description: 'Access millions of loads and trucks',
//           isConnected: false,
//           apiKey: '',
//           icon: 'fa-truck-loading',
//           iconBg: 'bg-blue-100 text-blue-600',
//           category: 'loadboard'
//         },
//         {
//           id: '2',
//           name: 'Truckstop.com',
//           description: 'Load matching and freight management',
//           isConnected: false,
//           apiKey: '',
//           icon: 'fa-route',
//           iconBg: 'bg-green-100 text-green-600',
//           category: 'loadboard'
//         },
//         {
//           id: '3',
//           name: 'QuickBooks',
//           description: 'Accounting and invoicing integration',
//           isConnected: false,
//           apiKey: '',
//           icon: 'fa-calculator',
//           iconBg: 'bg-purple-100 text-purple-600',
//           category: 'accounting'
//         },
//       ],
//       SHIPPER: [
//         {
//           id: '1',
//           name: 'WMS Integration',
//           description: 'Connect your warehouse management system',
//           isConnected: false,
//           apiKey: '',
//           icon: 'fa-warehouse',
//           iconBg: 'bg-orange-100 text-orange-600',
//           category: 'warehouse'
//         },
//         {
//           id: '2',
//           name: 'EDI Gateway',
//           description: 'Electronic data interchange for orders',
//           isConnected: false,
//           apiKey: '',
//           icon: 'fa-exchange-alt',
//           iconBg: 'bg-indigo-100 text-indigo-600',
//           category: 'communication'
//         },
//         {
//           id: '3',
//           name: 'Inventory Sync',
//           description: 'Real-time inventory level synchronization',
//           isConnected: false,
//           apiKey: '',
//           icon: 'fa-sync',
//           iconBg: 'bg-teal-100 text-teal-600',
//           category: 'inventory'
//         },
//       ],
//       CARRIER: [
//         {
//           id: '1',
//           name: 'ELD Provider',
//           description: 'Electronic logging device integration',
//           isConnected: false,
//           apiKey: '',
//           icon: 'fa-tachometer-alt',
//           iconBg: 'bg-red-100 text-red-600',
//           category: 'compliance'
//         },
//         {
//           id: '2',
//           name: 'Fuel Card',
//           description: 'Track fuel expenses and usage',
//           isConnected: false,
//           apiKey: '',
//           icon: 'fa-gas-pump',
//           iconBg: 'bg-yellow-100 text-yellow-600',
//           category: 'fuel'
//         },
//         {
//           id: '3',
//           name: 'GPS Tracking',
//           description: 'Real-time fleet tracking system',
//           isConnected: false,
//           apiKey: '',
//           icon: 'fa-map-marked-alt',
//           iconBg: 'bg-blue-100 text-blue-600',
//           category: 'tracking'
//         },
//       ]
//     };
//
//     return integrationsByRole[role || 'BROKER'] || [];
//   };
//
//   const initialIntegrations = getRoleIntegrations();
//
//   // Role-based tabs configuration
//   const getRoleTabs = () => {
//     const role = user?.role;
//     const baseTabs = [
//       { id: 'company', label: 'Company', icon: 'fa-building' },
//       { id: 'users', label: 'Users & Permissions', icon: 'fa-users' },
//       { id: 'integrations', label: 'Integrations', icon: 'fa-plug' },
//       { id: 'ai-integration', label: 'AI Integration', icon: 'fa-robot' },
//       { id: 'notifications', label: 'Notifications', icon: 'fa-bell' },
//       { id: 'billing', label: 'Billing', icon: 'fa-credit-card' },
//       { id: 'appearance', label: 'Appearance', icon: 'fa-paint-brush' },
//       { id: 'backup', label: 'Backup & Security', icon: 'fa-shield-alt' },
//       { id: 'logs', label: 'Activity Logs', icon: 'fa-history' },
//     ];
//
//     const roleTabs: Record<string, any[]> = {
//       BROKER: [
//         ...baseTabs.slice(0, 3),
//         { id: 'broker-integrations', label: 'Broker Tools', icon: 'fa-handshake' },
//         { id: 'automation', label: 'Automation', icon: 'fa-cogs' },
//         { id: 'commissions', label: 'Commissions', icon: 'fa-percent' },
//         { id: 'team', label: 'Team Management', icon: 'fa-users-cog' },
//         ...baseTabs.slice(3),
//       ],
//       SHIPPER: [
//         ...baseTabs.slice(0, 3),
//         { id: 'inventory-settings', label: 'Inventory Settings', icon: 'fa-boxes' },
//         { id: 'warehouse', label: 'Warehouse Config', icon: 'fa-warehouse' },
//         { id: 'shipping-preferences', label: 'Shipping Preferences', icon: 'fa-shipping-fast' },
//         ...baseTabs.slice(3),
//       ],
//       CARRIER: [
//         ...baseTabs.slice(0, 3),
//         { id: 'fleet', label: 'Fleet Settings', icon: 'fa-truck' },
//         { id: 'driver-management', label: 'Driver Management', icon: 'fa-id-card' },
//         { id: 'compliance', label: 'Compliance', icon: 'fa-clipboard-check' },
//         { id: 'routes', label: 'Route Preferences', icon: 'fa-route' },
//         ...baseTabs.slice(3),
//       ],
//     };
//
//     return roleTabs[role || 'BROKER'] || baseTabs;
//   };
//
//   const tabs = getRoleTabs();
//
//   // Handle save functions for different settings
//   const handleCompanySave = async (data: any) => {
//     try {
//       console.log('Saving company info:', data);
//       toast.success('Company information updated successfully!');
//     } catch (error) {
//       toast.error('Failed to update company information');
//     }
//   };
//
//   const handleIntegrationToggle = async (integrationId: string, enabled: boolean) => {
//     try {
//       console.log(`${enabled ? 'Enabling' : 'Disabling'} integration ${integrationId}`);
//       toast.success(`Integration ${enabled ? 'enabled' : 'disabled'} successfully!`);
//     } catch (error) {
//       toast.error('Failed to update integration');
//     }
//   };
//
//   // Render role-specific tab content
//   const renderRoleSpecificContent = () => {
//     const role = user?.role;
//
//     switch (activeTab) {
//       // Broker-specific tabs
//       case 'broker-integrations':
//         return (
//           <Card className="p-6">
//             <h2 className="text-xl font-semibold mb-4">Broker Tools & Integrations</h2>
//             <div className="space-y-4">
//               <div className="border rounded-lg p-4">
//                 <h3 className="font-medium mb-2">Load Board Connections</h3>
//                 <p className="text-gray-600 text-sm mb-4">Connect to major load boards for seamless load posting and searching</p>
//                 <div className="space-y-2">
//                   {initialIntegrations.filter(i => i.category === 'loadboard').map(integration => (
//                     <div key={integration.id} className="flex items-center justify-between p-3 border rounded">
//                       <div className="flex items-center">
//                         <i className={`${integration.icon} ${integration.iconBg} p-2 rounded mr-3`}></i>
//                         <div>
//                           <h4 className="font-medium">{integration.name}</h4>
//                           <p className="text-sm text-gray-600">{integration.description}</p>
//                         </div>
//                       </div>
//                       <ToggleSwitch
//                         isOn={integration.isConnected}
//                         onToggle={() => handleIntegrationToggle(integration.id, !integration.isConnected)}
//                       />
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </Card>
//         );
//
//       case 'automation':
//         return (
//           <Card className="p-6">
//             <h2 className="text-xl font-semibold mb-4">Automation Rules</h2>
//             <div className="space-y-4">
//               <div className="border rounded-lg p-4">
//                 <h3 className="font-medium mb-2">Load Matching</h3>
//                 <div className="space-y-3">
//                   <label className="flex items-center justify-between">
//                     <span>Auto-match loads to available carriers</span>
//                     <ToggleSwitch isOn={true} onToggle={() => {}} />
//                   </label>
//                   <label className="flex items-center justify-between">
//                     <span>Send notifications for high-value loads</span>
//                     <ToggleSwitch isOn={false} onToggle={() => {}} />
//                   </label>
//                 </div>
//               </div>
//             </div>
//           </Card>
//         );
//
//       // Shipper-specific tabs
//       case 'inventory-settings':
//         return (
//           <Card className="p-6">
//             <h2 className="text-xl font-semibold mb-4">Inventory Management Settings</h2>
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium mb-1">Low Stock Alert Threshold</label>
//                 <input type="number" className="w-full px-3 py-2 border rounded-lg" defaultValue="100" />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">Reorder Point Formula</label>
//                 <select className="w-full px-3 py-2 border rounded-lg">
//                   <option>Average Daily Usage × Lead Time + Safety Stock</option>
//                   <option>Economic Order Quantity (EOQ)</option>
//                   <option>Just-In-Time (JIT)</option>
//                 </select>
//               </div>
//             </div>
//           </Card>
//         );
//
//       case 'warehouse':
//         return (
//           <Card className="p-6">
//             <h2 className="text-xl font-semibold mb-4">Warehouse Configuration</h2>
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium mb-1">Default Warehouse</label>
//                 <select className="w-full px-3 py-2 border rounded-lg">
//                   <option>Chicago Main Warehouse</option>
//                   <option>Dallas Distribution Center</option>
//                   <option>Los Angeles Hub</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">Operating Hours</label>
//                 <div className="grid grid-cols-2 gap-4">
//                   <input type="time" className="px-3 py-2 border rounded-lg" defaultValue="06:00" />
//                   <input type="time" className="px-3 py-2 border rounded-lg" defaultValue="22:00" />
//                 </div>
//               </div>
//             </div>
//           </Card>
//         );
//
//       // Carrier-specific tabs
//       case 'fleet':
//         return (
//           <Card className="p-6">
//             <h2 className="text-xl font-semibold mb-4">Fleet Settings</h2>
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium mb-1">Maintenance Alert (Miles)</label>
//                 <input type="number" className="w-full px-3 py-2 border rounded-lg" defaultValue="5000" />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">Fuel Efficiency Target (MPG)</label>
//                 <input type="number" className="w-full px-3 py-2 border rounded-lg" defaultValue="6.5" step="0.1" />
//               </div>
//               <div>
//                 <label className="flex items-center justify-between">
//                   <span>Enable automatic maintenance scheduling</span>
//                   <ToggleSwitch isOn={true} onToggle={() => {}} />
//                 </label>
//               </div>
//             </div>
//           </Card>
//         );
//
//       case 'driver-management':
//         return (
//           <Card className="p-6">
//             <h2 className="text-xl font-semibold mb-4">Driver Management</h2>
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium mb-1">HOS Warning Threshold (Hours)</label>
//                 <input type="number" className="w-full px-3 py-2 border rounded-lg" defaultValue="10" max="11" />
//               </div>
//               <div>
//                 <label className="flex items-center justify-between">
//                   <span>Auto-assign loads based on driver preferences</span>
//                   <ToggleSwitch isOn={false} onToggle={() => {}} />
//                 </label>
//               </div>
//               <div>
//                 <label className="flex items-center justify-between">
//                   <span>Send daily driver performance reports</span>
//                   <ToggleSwitch isOn={true} onToggle={() => {}} />
//                 </label>
//               </div>
//             </div>
//           </Card>
//         );
//
//       default:
//         return null;
//     }
//   };
//
//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="flex">
//         {/* Sidebar */}
//         <div className="w-64 bg-white shadow-lg h-screen sticky top-0">
//           <div className="p-6">
//             <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
//           </div>
//           <nav className="px-4 pb-6">
//             {tabs.map((tab) => (
//               <button
//                 key={tab.id}
//                 onClick={() => setActiveTab(tab.id as ExtendedTabType)}
//                 className={`w-full text-left px-4 py-3 rounded-lg mb-1 transition-colors flex items-center ${
//                   activeTab === tab.id
//                     ? 'bg-blue-50 text-blue-600'
//                     : 'text-gray-700 hover:bg-gray-50'
//                 }`}
//               >
//                 <i className={`${tab.icon} mr-3 w-5 text-center`}></i>
//                 {tab.label}
//               </button>
//             ))}
//           </nav>
//         </div>
//
//         {/* Main Content */}
//         <div className="flex-1 p-8">
//           <div className="max-w-4xl mx-auto">
//             {/* Base tabs content */}
//             {activeTab === 'company' && (
//               <CompanySettings
//                 initialCompanyInfo={initialCompanyInfo}
//               />
//             )}
//             {activeTab === 'users' && (
//               <UserSettings
//                 initialRoles={initialRoles}
//               />
//             )}
//             {activeTab === 'integrations' && (
//               <IntegrationSettings
//                 initialIntegrations={initialIntegrations}
//               />
//             )}
//             {activeTab === 'ai-integration' && (
//               <AIIntegrationSettings />
//             )}
//             {activeTab === 'notifications' && (
//               <NotificationSettings
//                 initialNotificationChannels={{
//                   email: true,
//                   sms: false,
//                   inApp: true
//                 }}
//                 initialNotificationTypes={{
//                   locationUpdates: { email: true, sms: false, inApp: true },
//                   delayAlerts: { email: true, sms: false, inApp: true },
//                   statusChanges: { email: true, sms: false, inApp: true },
//                   weatherAlerts: { email: false, sms: false, inApp: true },
//                   systemNotifications: { email: true, sms: false, inApp: true }
//                 }}
//               />
//             )}
//             {activeTab === 'billing' && (
//               <BillingSettings />
//             )}
//             {activeTab === 'appearance' && (
//               <AppearanceSettings
//                 initialAppearance={{
//                   theme: 'light',
//                   sidebarPosition: 'left',
//                   navbarStyle: 'sticky',
//                   contentWidth: 'full',
//                   density: 'normal',
//                   fontFamily: 'system',
//                   fontSize: 'medium',
//                   primaryColor: '#3B82F6',
//                   secondaryColor: '#10B981'
//                 }}
//               />
//             )}
//             {activeTab === 'backup' && (
//               <BackupSettings
//                 initialBackupSettings={{
//                   autoBackupEnabled: true,
//                   frequency: 'daily',
//                   retentionPeriod: '30'
//                 }}
//               />
//             )}
//             {activeTab === 'logs' && (
//               <LogSettings />
//             )}
//
//             {/* Role-specific content */}
//             {renderRoleSpecificContent()}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
//
// export default Settings;