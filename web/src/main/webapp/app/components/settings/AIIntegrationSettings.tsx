import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Key, CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react';

interface AIProvider {
  provider: 'ANTHROPIC' | 'OPENAI' | 'GOOGLE';
  name: string;
  description: string;
}

interface AIProviderConfig {
  id: number;
  provider: string;
  apiKey: string;
  oauthToken?: string;
  oauthRefreshToken?: string;
  isActive: boolean;
  connectionStatus: 'VALID' | 'INVALID' | 'PENDING';
  lastTested?: string;
  createdAt: string;
  updatedAt: string;
}

const AI_PROVIDERS: AIProvider[] = [
  {
    provider: 'ANTHROPIC',
    name: 'Anthropic (Claude)',
    description: 'Advanced AI assistant with strong reasoning capabilities'
  },
  {
    provider: 'OPENAI',
    name: 'OpenAI (ChatGPT)',
    description: 'Popular AI model with versatile capabilities'
  },
  {
    provider: 'GOOGLE',
    name: 'Google AI (Gemini)',
    description: 'Google\'s advanced multimodal AI model'
  }
];

export const AIIntegrationSettings: React.FC = () => {
  const [configurations, setConfigurations] = useState<AIProviderConfig[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [testingConnection, setTestingConnection] = useState<string | null>(null);
  const DEFAULT_GEMINI_TOKEN = 'AIzaSyDdDZPX0c_pWLZHgiWdzimDFcYhDrF7XD4';

  const getDefaultModel = (provider: string): string => {
    switch (provider) {
      case 'OPENAI':
        return 'gpt-4';
      case 'ANTHROPIC':
        return 'claude-3-opus-20240229';
      case 'GOOGLE':
        return 'gemini-pro';
      default:
        return '';
    }
  };

  useEffect(() => {
    fetchConfigurations();
  }, []);

  const fetchConfigurations = async () => {
    try {
      const response = await fetch('/api/integrations/ai/configurations', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('octopus_tms_token') || sessionStorage.getItem('octopus_tms_token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setConfigurations(data);
      }
    } catch (error) {
      console.error('Failed to fetch configurations:', error);
    }
  };

  const handleAddProvider = async () => {
    if (!selectedProvider || !apiKey) {
      alert('Please select a provider and enter an API key');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/integrations/ai/configure', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('octopus_tms_token') || sessionStorage.getItem('octopus_tms_token')}`
        },
        body: JSON.stringify({
          provider: selectedProvider,
          apiKey: apiKey,
          isActive: true
        })
      });

      if (response.ok) {
        await fetchConfigurations();
        setSelectedProvider('');
        setApiKey('');
      } else {
        alert('Failed to save configuration');
      }
    } catch (error) {
      console.error('Failed to save configuration:', error);
      alert('Failed to save configuration');
    } finally {
      setLoading(false);
    }
  };

  const handleTestConnection = async (provider: string) => {
    setTestingConnection(provider);
    try {
      const response = await fetch('/api/integrations/ai/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('octopus_tms_token') || sessionStorage.getItem('octopus_tms_token')}`
        },
        body: JSON.stringify({
          provider: provider
        })
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          alert('Connection successful!');
        } else {
          alert('Connection failed: ' + (result.message || 'Please check your API key.'));
        }
        await fetchConfigurations();
      }
    } catch (error) {
      console.error('Failed to test connection:', error);
      alert('Failed to test connection');
    } finally {
      setTestingConnection(null);
    }
  };

  const handleToggleActive = async (config: AIProviderConfig) => {
    try {
      const response = await fetch(`/api/integrations/ai/configurations/${config.id}/toggle`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('octopus_tms_token') || sessionStorage.getItem('octopus_tms_token')}`
        }
      });

      if (response.ok) {
        await fetchConfigurations();
      }
    } catch (error) {
      console.error('Failed to toggle configuration:', error);
    }
  };

  const handleDelete = async (configId: number) => {
    if (!confirm('Are you sure you want to delete this configuration?')) {
      return;
    }

    try {
      const response = await fetch(`/api/integrations/ai/configurations/${configId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('octopus_tms_token') || sessionStorage.getItem('octopus_tms_token')}`
        }
      });

      if (response.ok) {
        await fetchConfigurations();
      }
    } catch (error) {
      console.error('Failed to delete configuration:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'VALID':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'INVALID':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold">AI Model Integration</h2>
        <p className="text-gray-600 mt-1">Connect AI models to enhance your TMS capabilities</p>
      </div>

      <div className="p-6">
        {/* Add New Provider */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">Add AI Provider</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Provider
              </label>
              <select
                value={selectedProvider}
                onChange={(e) => {
                  setSelectedProvider(e.target.value);
                  // Auto-fill default Gemini token when Google is selected
                  if (e.target.value === 'GOOGLE') {
                    setApiKey(DEFAULT_GEMINI_TOKEN);
                  } else {
                    setApiKey('');
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Choose a provider...</option>
                {AI_PROVIDERS.map((provider) => (
                  <option key={provider.provider} value={provider.provider}>
                    {provider.name}
                  </option>
                ))}
              </select>
            </div>

            {selectedProvider && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  API Key
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="Enter your API key"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button
                    onClick={handleAddProvider}
                    disabled={loading || !apiKey}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Provider
                  </button>
                </div>
                {selectedProvider === 'GOOGLE' && (
                  <div className="mt-2">
                    <button
                      onClick={() => setApiKey(DEFAULT_GEMINI_TOKEN)}
                      className="text-sm text-blue-600 hover:text-blue-700 underline"
                    >
                      Use default Gemini token
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Configured Providers */}
        <div>
          <h3 className="text-lg font-medium mb-4">Configured Providers</h3>
          {configurations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <AlertCircle className="w-12 h-12 mx-auto mb-2" />
              <p>No AI providers configured yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {configurations.map((config) => {
                const provider = AI_PROVIDERS.find(p => p.provider === config.provider);
                return (
                  <div key={config.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h4 className="text-lg font-medium">{provider?.name || config.provider}</h4>
                          {getStatusIcon(config.connectionStatus)}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{provider?.description}</p>
                        
                        <div className="flex items-center gap-4 mt-3 text-sm">
                          <span className={`px-2 py-1 rounded-full ${config.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {config.isActive ? 'Active' : 'Inactive'}
                          </span>
                          {config.lastTested && (
                            <span className="text-gray-500">
                              Last tested: {new Date(config.lastTested).toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleTestConnection(config.provider)}
                          disabled={testingConnection === config.provider}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-md disabled:opacity-50"
                          title="Test Connection"
                        >
                          <RefreshCw className={`w-4 h-4 ${testingConnection === config.provider ? 'animate-spin' : ''}`} />
                        </button>
                        <button
                          onClick={() => handleToggleActive(config)}
                          className="p-2 text-gray-600 hover:bg-gray-50 rounded-md"
                          title={config.isActive ? 'Deactivate' : 'Activate'}
                        >
                          {config.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => handleDelete(config.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};