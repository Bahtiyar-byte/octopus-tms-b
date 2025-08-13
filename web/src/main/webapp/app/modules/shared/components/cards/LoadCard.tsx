import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../../../components';
import { Load } from '../../pages/Loads/Loads';
import { formatLoadId, getLoadStatusColor, formatLoadStatus } from '../../../../utils/load/loadUtils';
import { formatCurrency, formatDate, formatWeight } from '../../../../utils/format';

interface LoadCardProps {
  load: Load;
  onAction: (action: string, load: Load) => void;
  role: string;
}

export const LoadCard: React.FC<LoadCardProps> = ({ load, onAction, role }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/${role}/load-details/${load.id}`, { state: { load } });
  };

  return (
    <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold">{formatLoadId(load.id)}</h3>
          <div className="flex items-center gap-2">
            {load.status === 'draft' && (
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium animate-pulse">
                DRAFT
              </span>
            )}
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLoadStatusColor(load.status)}`}>
              {formatLoadStatus(load.status)}
            </span>
          </div>
        </div>

        <div className="mb-3">
          <div className="text-sm text-gray-500 mb-1">Route:</div>
          <div className="font-medium">{load.origin} → {load.destination}</div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <div className="text-sm text-gray-500 mb-1">Created:</div>
            <div className="font-medium">{formatDate(load.createdAt)}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-1">Updated:</div>
            <div className="font-medium">{formatDate(load.updatedAt)}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <div className="text-sm text-gray-500 mb-1">Commodity:</div>
            <div className="font-medium">{load.commodity}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-1">Rate:</div>
            <div className="font-medium text-green-600">{formatCurrency(load.rate)}</div>
          </div>
        </div>

        {load.carrier && (
          <div className="mb-3">
            <div className="text-sm text-gray-500 mb-1">Carrier:</div>
            <div className="font-medium">{load.carrier.name}</div>
          </div>
        )}

        {load.customer && role === 'BROKER' && (
          <div className="mb-3">
            <div className="text-sm text-gray-500 mb-1">Customer:</div>
            <div className="font-medium">{load.customer.name}</div>
          </div>
        )}

        {load.driver && role === 'CARRIER' && (
          <div className="mb-3">
            <div className="text-sm text-gray-500 mb-1">Driver:</div>
            <div className="font-medium">{load.driver}</div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <div className="text-sm text-gray-500 mb-1">Weight:</div>
            <div className="font-medium">{formatWeight(load.weight)}</div>
          </div>
          {load.equipment && (
            <div>
              <div className="text-sm text-gray-500 mb-1">Equipment:</div>
              <div className="font-medium">{load.equipment}</div>
            </div>
          )}
        </div>

        {load.pickupDate && (
          <div className="mb-3">
            <div className="text-sm text-gray-500 mb-1">Pickup Date:</div>
            <div className="font-medium">{formatDate(load.pickupDate)}</div>
          </div>
        )}

        <div className="mt-4 flex justify-between">
          <button 
            onClick={handleViewDetails}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            View Details
          </button>
          
          {/* Role-specific actions */}
          {role === 'broker' && load.status === 'available' && (
            <button 
              onClick={() => onAction('matchCarrier', load)}
              className="text-green-600 hover:text-green-800 text-sm font-medium"
            >
              Find Carriers
            </button>
          )}
          
          {role === 'shipper' && load.status === 'draft' && (
            <button 
              onClick={() => onAction('schedulePickup', load)}
              className="text-green-600 hover:text-green-800 text-sm font-medium"
            >
              Schedule Pickup
            </button>
          )}
          
          {role === 'carrier' && load.status === 'available' && (
            <button 
              onClick={() => onAction('acceptLoad', load)}
              className="text-green-600 hover:text-green-800 text-sm font-medium"
            >
              Accept Load
            </button>
          )}
        </div>
      </div>
    </Card>
  );
};