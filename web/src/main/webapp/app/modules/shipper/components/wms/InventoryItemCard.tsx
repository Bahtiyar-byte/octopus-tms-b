import React from 'react';
import { Package, AlertTriangle, TrendingDown } from 'lucide-react';
import { InventoryItem, StockLevel } from '../../types/wms.types';

interface InventoryItemCardProps {
  item: InventoryItem;
  stockLevel: StockLevel;
  onEdit?: () => void;
  onViewDetails?: () => void;
}

export const InventoryItemCard: React.FC<InventoryItemCardProps> = ({
  item,
  stockLevel,
  onEdit,
  onViewDetails
}) => {
  const stockPercentage = (stockLevel.availableQuantity / (stockLevel.quantity || 1)) * 100;
  const isLowStock = stockLevel.availableQuantity <= item.reorderPoint;
  const isOutOfStock = stockLevel.availableQuantity === 0;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${isOutOfStock ? 'bg-red-100' : isLowStock ? 'bg-yellow-100' : 'bg-blue-100'}`}>
            <Package className={`h-5 w-5 ${isOutOfStock ? 'text-red-600' : isLowStock ? 'text-yellow-600' : 'text-blue-600'}`} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{item.name}</h3>
            <p className="text-sm text-gray-500">SKU: {item.sku}</p>
          </div>
        </div>
        {(isLowStock || isOutOfStock) && (
          <div className={`flex items-center space-x-1 ${isOutOfStock ? 'text-red-600' : 'text-yellow-600'}`}>
            {isOutOfStock ? <AlertTriangle className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            <span className="text-xs font-medium">
              {isOutOfStock ? 'Out of Stock' : 'Low Stock'}
            </span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Available</span>
          <span className="font-medium">{stockLevel.availableQuantity} {item.unitOfMeasure}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Reserved</span>
          <span className="font-medium">{stockLevel.reservedQuantity} {item.unitOfMeasure}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Location</span>
          <span className="text-sm font-medium">
            {stockLevel.location.zone}-{stockLevel.location.aisle}-{stockLevel.location.rack}-{stockLevel.location.bin}
          </span>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-100">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${
              isOutOfStock ? 'bg-red-500' : isLowStock ? 'bg-yellow-500' : 'bg-green-500'
            }`}
            style={{ width: `${Math.min(stockPercentage, 100)}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {stockPercentage.toFixed(0)}% stock available
        </p>
      </div>

      <div className="flex space-x-2 mt-4">
        <button
          onClick={onViewDetails}
          className="flex-1 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
        >
          View Details
        </button>
        <button
          onClick={onEdit}
          className="flex-1 px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
        >
          Edit
        </button>
      </div>
    </div>
  );
};