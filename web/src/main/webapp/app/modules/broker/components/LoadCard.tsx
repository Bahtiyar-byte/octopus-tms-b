import React from 'react';
import { Link } from 'react-router-dom';
import { Load } from '../api/brokerApi';
import LoadStatusBadge from './LoadStatusBadge';

interface LoadCardProps {
  load: Load;
  compact?: boolean;
}

const LoadCard: React.FC<LoadCardProps> = ({ load, compact = false }) => {
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (compact) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-sm font-medium text-gray-900">{load.id}</h3>
            <p className="text-xs text-gray-500 mt-1">
              {load.origin} → {load.destination}
            </p>
          </div>
          <LoadStatusBadge status={load.status} />
        </div>
        <div className="mt-2 flex justify-between items-center">
          <p className="text-sm font-medium text-gray-900">{formatCurrency(load.rate)}</p>
          <Link 
            to={`/broker/loads/${load.id}`} 
            className="text-xs text-blue-600 hover:text-blue-800"
          >
            View Details
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-5 border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-medium text-gray-900">{load.id}</h3>
          <p className="text-sm text-gray-500 mt-1">Created: {formatDate(load.createdAt)}</p>
        </div>
        <LoadStatusBadge status={load.status} />
      </div>
      
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-gray-500">Origin</p>
          <p className="text-sm font-medium">{load.origin}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Destination</p>
          <p className="text-sm font-medium">{load.destination}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Distance</p>
          <p className="text-sm font-medium">{load.distance} mi</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Rate</p>
          <p className="text-sm font-medium text-green-600">{formatCurrency(load.rate)}</p>
        </div>
      </div>
      
      {load.carrier && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">Assigned Carrier</p>
          <p className="text-sm font-medium">{load.carrier.name}</p>
          <p className="text-xs text-gray-500 mt-1">
            {load.carrier.contact} • {load.carrier.phone}
          </p>
        </div>
      )}
      
      <div className="mt-4 flex justify-end">
        <Link 
          to={`/broker/loads/${load.id}`} 
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          View Details →
        </Link>
      </div>
    </div>
  );
};

export default LoadCard;