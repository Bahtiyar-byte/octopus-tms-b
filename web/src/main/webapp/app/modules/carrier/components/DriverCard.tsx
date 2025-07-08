import React from 'react';
import { StatusBadge } from './StatusBadge';

interface DriverCardProps {
  driver: {
    id: string;
    name: string;
    phone: string;
    email: string;
    truck: string;
    status: 'Available' | 'On Route' | 'Off Duty' | 'On Break';
    location: string;
    hoursOfService: {
      driving: number;
      onDuty: number;
      remaining: number;
    };
    stats?: {
      totalMiles: number;
      deliveries: number;
      onTimeRate: number;
      rating: number;
    };
  };
  onAssign?: () => void;
  onContact?: () => void;
  onViewDetails?: () => void;
  compact?: boolean;
}

export const DriverCard: React.FC<DriverCardProps> = ({ 
  driver, 
  onAssign, 
  onContact,
  onViewDetails,
  compact = false 
}) => {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (compact) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-3 hover:shadow-sm transition-shadow">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-bold">
              {getInitials(driver.name)}
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900">{driver.name}</h4>
              <p className="text-xs text-gray-500">{driver.truck} • {driver.location}</p>
            </div>
          </div>
          <StatusBadge status={driver.status} size="sm" />
        </div>
        {onAssign && driver.status === 'Available' && (
          <button
            onClick={onAssign}
            className="mt-3 w-full px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors"
          >
            Assign
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-bold text-lg">
            {getInitials(driver.name)}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{driver.name}</h3>
            <p className="text-sm text-gray-500">{driver.truck}</p>
          </div>
        </div>
        <StatusBadge status={driver.status} />
      </div>

      <div className="space-y-3">
        <div className="flex items-center text-sm text-gray-600">
          <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>{driver.location}</span>
        </div>

        <div className="flex items-center text-sm text-gray-600">
          <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          <span>{driver.phone}</span>
        </div>

        <div className="flex items-center text-sm text-gray-600">
          <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span>{driver.email}</span>
        </div>

        <div className="pt-3 border-t">
          <h4 className="text-xs font-medium text-gray-700 uppercase mb-2">Hours of Service</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Driving</span>
              <span className="font-medium">{driver.hoursOfService.driving}h / 11h</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${(driver.hoursOfService.driving / 11) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">On Duty</span>
              <span className="font-medium">{driver.hoursOfService.onDuty}h / 14h</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full" 
                style={{ width: `${(driver.hoursOfService.onDuty / 14) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {driver.stats && (
          <div className="pt-3 border-t">
            <h4 className="text-xs font-medium text-gray-700 uppercase mb-2">Performance</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{driver.stats.totalMiles.toLocaleString()}</p>
                <p className="text-xs text-gray-500">Total Miles</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{driver.stats.deliveries}</p>
                <p className="text-xs text-gray-500">Deliveries</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{driver.stats.onTimeRate}%</p>
                <p className="text-xs text-gray-500">On-Time Rate</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center">
                  <p className="text-2xl font-bold text-gray-900 mr-1">{driver.stats.rating}</p>
                  <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <p className="text-xs text-gray-500">Rating</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2 mt-5">
        {onAssign && driver.status === 'Available' && (
          <button
            onClick={onAssign}
            className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors"
          >
            Assign to Load
          </button>
        )}
        {onContact && (
          <button
            onClick={onContact}
            className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded hover:bg-gray-200 transition-colors"
          >
            Contact
          </button>
        )}
        {onViewDetails && (
          <button
            onClick={onViewDetails}
            className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded hover:bg-gray-200 transition-colors"
          >
            View Details
          </button>
        )}
      </div>
    </div>
  );
};

export default DriverCard;