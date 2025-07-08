import React from 'react';
import { Warehouse, Building2, Package, AlertCircle, TrendingUp } from 'lucide-react';
import { Warehouse as WarehouseType } from '../../types/wms.types';

interface WarehouseOverviewProps {
  warehouse: WarehouseType;
  metrics?: {
    totalItems: number;
    lowStockItems: number;
    pendingShipments: number;
    utilizationRate: number;
  };
  onManageClick?: () => void;
}

export const WarehouseOverview: React.FC<WarehouseOverviewProps> = ({
  warehouse,
  metrics,
  onManageClick
}) => {
  const utilizationPercentage = (warehouse.usedCapacity / warehouse.capacity) * 100;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Building2 className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{warehouse.name}</h3>
            <p className="text-sm text-gray-500">Code: {warehouse.code}</p>
          </div>
        </div>
        <span className={`px-3 py-1 text-xs font-medium rounded-full ${
          warehouse.status === 'active' ? 'bg-green-100 text-green-800' :
          warehouse.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {warehouse.status.charAt(0).toUpperCase() + warehouse.status.slice(1)}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="space-y-1">
          <p className="text-sm text-gray-600">Manager</p>
          <p className="font-medium text-gray-900">{warehouse.manager.name}</p>
          <p className="text-xs text-gray-500">{warehouse.manager.phone}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-gray-600">Address</p>
          <p className="text-sm text-gray-900">
            {warehouse.address.city}, {warehouse.address.state} {warehouse.address.zipCode}
          </p>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-gray-600">Capacity Utilization</span>
            <span className="text-sm font-medium">{utilizationPercentage.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                utilizationPercentage > 90 ? 'bg-red-500' :
                utilizationPercentage > 75 ? 'bg-yellow-500' :
                'bg-green-500'
              }`}
              style={{ width: `${Math.min(utilizationPercentage, 100)}%` }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-xs text-gray-500">
              {warehouse.usedCapacity.toLocaleString()} / {warehouse.capacity.toLocaleString()} units
            </span>
          </div>
        </div>
      </div>

      {metrics && (
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <Package className="h-4 w-4 text-gray-500" />
              <span className="text-lg font-semibold">{metrics.totalItems}</span>
            </div>
            <p className="text-xs text-gray-600 mt-1">Total Items</p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <span className="text-lg font-semibold">{metrics.lowStockItems}</span>
            </div>
            <p className="text-xs text-gray-600 mt-1">Low Stock</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              <span className="text-lg font-semibold">{metrics.pendingShipments}</span>
            </div>
            <p className="text-xs text-gray-600 mt-1">Pending Shipments</p>
          </div>
          <div className="bg-green-50 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <Warehouse className="h-4 w-4 text-green-600" />
              <span className="text-lg font-semibold">{metrics.utilizationRate}%</span>
            </div>
            <p className="text-xs text-gray-600 mt-1">Utilization</p>
          </div>
        </div>
      )}

      <button
        onClick={onManageClick}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium text-sm"
      >
        Manage Warehouse
      </button>
    </div>
  );
};