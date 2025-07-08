import React from 'react';
import { Truck, Clock, CheckCircle, AlertTriangle, Package } from 'lucide-react';
import { ShipmentReadiness } from '../../types/wms.types';

interface ShipmentReadinessCardProps {
  readiness: ShipmentReadiness;
  onNotifyTMS?: () => void;
  onViewDetails?: () => void;
  onCreatePickList?: () => void;
}

export const ShipmentReadinessCard: React.FC<ShipmentReadinessCardProps> = ({
  readiness,
  onNotifyTMS,
  onViewDetails,
  onCreatePickList
}) => {
  const readyItems = readiness.items.filter(item => item.status === 'picked' || item.status === 'packed').length;
  const totalItems = readiness.items.length;
  const readinessPercentage = (readyItems / totalItems) * 100;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready':
        return 'bg-green-100 text-green-800';
      case 'partially_ready':
        return 'bg-yellow-100 text-yellow-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'high':
        return <Clock className="h-4 w-4 text-orange-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${readiness.status === 'ready' ? 'bg-green-100' : 'bg-yellow-100'}`}>
            <Truck className={`h-5 w-5 ${readiness.status === 'ready' ? 'text-green-600' : 'text-yellow-600'}`} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              {readiness.orderId ? `Order #${readiness.orderId}` : `Readiness #${readiness.id.slice(0, 8)}`}
            </h3>
            <p className="text-sm text-gray-500">
              Required by {new Date(readiness.requiredDate).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {getPriorityIcon(readiness.priority)}
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(readiness.status)}`}>
            {readiness.status.replace('_', ' ').charAt(0).toUpperCase() + readiness.status.slice(1).replace('_', ' ')}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-gray-600">Items Ready</span>
            <span className="text-sm font-medium">{readyItems} of {totalItems}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                readinessPercentage === 100 ? 'bg-green-500' :
                readinessPercentage > 0 ? 'bg-yellow-500' :
                'bg-gray-400'
              }`}
              style={{ width: `${readinessPercentage}%` }}
            />
          </div>
        </div>

        <div className="max-h-32 overflow-y-auto space-y-2">
          {readiness.items.slice(0, 3).map((item, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <Package className="h-3 w-3 text-gray-400" />
                <span className="text-gray-700">{item.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-500">
                  {item.pickedQuantity}/{item.requiredQuantity}
                </span>
                {item.status === 'picked' || item.status === 'packed' ? (
                  <CheckCircle className="h-3 w-3 text-green-500" />
                ) : (
                  <div className="h-3 w-3 rounded-full border border-gray-300" />
                )}
              </div>
            </div>
          ))}
          {readiness.items.length > 3 && (
            <p className="text-xs text-gray-500">+{readiness.items.length - 3} more items</p>
          )}
        </div>

        {readiness.specialInstructions && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-2">
            <p className="text-xs text-yellow-800">
              <span className="font-medium">Special Instructions:</span> {readiness.specialInstructions}
            </p>
          </div>
        )}
      </div>

      <div className="flex space-x-2 mt-4 pt-4 border-t border-gray-100">
        {readiness.status === 'pending' && (
          <button
            onClick={onCreatePickList}
            className="flex-1 px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            Create Pick List
          </button>
        )}
        {(readiness.status === 'ready' || readiness.status === 'partially_ready') && (
          <button
            onClick={onNotifyTMS}
            className="flex-1 px-3 py-1.5 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors"
          >
            Notify TMS
          </button>
        )}
        <button
          onClick={onViewDetails}
          className="flex-1 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
        >
          View Details
        </button>
      </div>
    </div>
  );
};