import React from 'react';
import { AlertCircle, AlertTriangle, Info, Clock, Check } from 'lucide-react';
import { InventoryAlert } from '../../types/wms.types';

interface InventoryAlertCardProps {
  alert: InventoryAlert;
  onAcknowledge?: () => void;
  onViewDetails?: () => void;
}

export const InventoryAlertCard: React.FC<InventoryAlertCardProps> = ({
  alert,
  onAcknowledge,
  onViewDetails
}) => {
  const getAlertIcon = () => {
    switch (alert.severity) {
      case 'critical':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      default:
        return <Info className="h-5 w-5 text-blue-600" />;
    }
  };

  const getAlertColor = () => {
    switch (alert.severity) {
      case 'critical':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  const getTypeLabel = () => {
    switch (alert.type) {
      case 'low_stock':
        return 'Low Stock';
      case 'expiration':
        return 'Expiration Warning';
      case 'damage':
        return 'Damage Report';
      case 'cycle_count':
        return 'Cycle Count Due';
      case 'reorder':
        return 'Reorder Needed';
      default:
        return alert.type;
    }
  };

  const timeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className={`rounded-lg border p-4 ${getAlertColor()} ${alert.acknowledged ? 'opacity-75' : ''}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">{getAlertIcon()}</div>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <span className={`text-sm font-medium ${
                alert.severity === 'critical' ? 'text-red-900' :
                alert.severity === 'warning' ? 'text-yellow-900' :
                'text-blue-900'
              }`}>
                {getTypeLabel()}
              </span>
              <span className="text-xs text-gray-500 flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {timeAgo(alert.createdAt)}
              </span>
            </div>
            <p className={`text-sm ${
              alert.severity === 'critical' ? 'text-red-800' :
              alert.severity === 'warning' ? 'text-yellow-800' :
              'text-blue-800'
            }`}>
              {alert.message}
            </p>
            {alert.acknowledged && (
              <p className="text-xs text-gray-600 mt-2 flex items-center">
                <Check className="h-3 w-3 mr-1" />
                Acknowledged by {alert.acknowledgedBy} • {timeAgo(alert.acknowledgedAt!)}
              </p>
            )}
          </div>
        </div>
      </div>
      
      {!alert.acknowledged && (
        <div className="flex space-x-2 mt-3">
          <button
            onClick={onAcknowledge}
            className="flex-1 px-3 py-1.5 text-sm font-medium text-white bg-gray-800 rounded-md hover:bg-gray-900 transition-colors"
          >
            Acknowledge
          </button>
          <button
            onClick={onViewDetails}
            className="flex-1 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            View Details
          </button>
        </div>
      )}
    </div>
  );
};