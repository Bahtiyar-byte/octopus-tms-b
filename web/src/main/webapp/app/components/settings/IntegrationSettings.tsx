import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Integration } from '../../types/settings';
import ToggleSwitch from '../ToggleSwitch';

interface IntegrationSettingsProps {
  initialIntegrations: Integration[];
}

const IntegrationSettings: React.FC<IntegrationSettingsProps> = ({ initialIntegrations }) => {
  const [integrations, setIntegrations] = useState<Integration[]>(initialIntegrations);
  const [showAddIntegrationModal, setShowAddIntegrationModal] = useState(false);

  const handleToggleIntegration = (integrationId: string) => {
    setIntegrations(integrations.map(integration => {
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
    const integration = integrations.find(i => i.id === integrationId);
    if (integration) {
      toast.success(`Syncing data with ${integration.name}...`);
      setTimeout(() => {
        toast.success(`Sync with ${integration.name} completed successfully`);
      }, 2000);
    }
  };

  const handleIntegrationSettings = (integrationId: string) => {
    const integration = integrations.find(i => i.id === integrationId);
    if (integration) {
      toast.success(`Opening settings for ${integration.name}`);
    }
  };

  const handleAddIntegration = () => {
    setShowAddIntegrationModal(true);
    toast.success('Add Integration modal would open here');
  };

  return (
    <div>
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h2 className="text-xl font-semibold text-gray-900">API Integrations</h2>
        <p className="text-sm text-gray-600 mt-1">Connect with third-party services and APIs</p>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Connected Services</h3>
          <p className="text-sm text-gray-600">Manage your API connections and integrations</p>
        </div>
        <button 
          className="btn btn-sm btn-primary"
          onClick={handleAddIntegration}
        >
          <i className="fas fa-plus mr-2"></i> Add Integration
        </button>
      </div>

      <div className="space-y-4">
        {integrations.map(integration => (
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
                      onClick={() => handleIntegrationSettings(integration.id)}
                    >
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
  );
};

export default IntegrationSettings;