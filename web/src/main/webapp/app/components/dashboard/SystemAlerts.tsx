import React from 'react';
import Card from '../ui/Card';
import { SystemAlert } from '../../data/alerts';

interface SystemAlertsProps {
  systemAlerts: SystemAlert[];
  onResolveAlert: (alertId: string) => void;
  onViewHistory?: () => void;
}

export const SystemAlerts: React.FC<SystemAlertsProps> = ({
  systemAlerts,
  onResolveAlert,
  onViewHistory
}) => {
  const activeAlerts = systemAlerts.filter(a => !a.resolved).length;

  const handleViewDetails = (alertData: SystemAlert) => {
    window.alert(`Alert Details: ${alertData.title}\n\n${alertData.message}\n\nTimestamp: ${new Date(alertData.timestamp).toLocaleString()}\nType: ${alertData.type.toUpperCase()}`);
  };

  return (
    <section className="mb-6">
      <h2 className="flex items-center text-xl font-semibold mb-4">
        <i className="fas fa-bell mr-2 text-blue-600"></i>
        System Alerts
        <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-red-100 text-red-800 rounded-full">
          {activeAlerts}
        </span>
      </h2>
      <Card>
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Active Alerts</h3>
            {onViewHistory && (
              <button 
                onClick={onViewHistory}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                View History
              </button>
            )}
          </div>
        </div>
        <ul className="divide-y divide-gray-200">
          {systemAlerts.map((systemAlert, index) => (
            <li key={index} className={`p-4 hover:bg-gray-50 ${systemAlert.resolved ? 'opacity-60' : ''}`}>
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  {systemAlert.type === 'error' ? (
                    <i className="fas fa-exclamation-circle text-red-500"></i>
                  ) : systemAlert.type === 'warning' ? (
                    <i className="fas fa-exclamation-triangle text-yellow-500"></i>
                  ) : (
                    <i className="fas fa-info-circle text-blue-500"></i>
                  )}
                </div>
                <div className="ml-3 flex-1">
                  <div className="flex justify-between">
                    <p className="text-sm font-medium text-gray-900">{systemAlert.title}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(systemAlert.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </p>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{systemAlert.message}</p>

                  {!systemAlert.resolved && (
                    <div className="mt-2 flex space-x-2">
                      <button 
                        onClick={() => onResolveAlert(systemAlert.id)}
                        className="px-2 py-1 text-xs font-medium rounded bg-green-100 text-green-800 hover:bg-green-200"
                      >
                        Mark Resolved
                      </button>
                      <button 
                        onClick={() => handleViewDetails(systemAlert)}
                        className="px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-800 hover:bg-blue-200"
                      >
                        View Details
                      </button>
                    </div>
                  )}

                  {systemAlert.resolved && (
                    <span className="inline-flex mt-2 items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Resolved
                    </span>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </section>
  );
};