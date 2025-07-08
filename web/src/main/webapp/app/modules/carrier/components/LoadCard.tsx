import React from 'react';
import { Link } from 'react-router-dom';

interface LoadCardProps {
  load: {
    id: string;
    origin: string;
    destination: string;
    customer: string;
    equipment: string;
    date: string;
    price: number;
    driver?: string;
    status: 'Booked' | 'Assigned' | 'Picked Up' | 'Delivered';
    eta?: string;
    miles?: number;
  };
  viewMode?: 'grid' | 'table';
  onAssignDriver?: (loadId: string) => void;
  onEditLoad?: (loadId: string) => void;
  onDeleteLoad?: (loadId: string) => void;
}

export const LoadCard: React.FC<LoadCardProps> = ({ 
  load, 
  viewMode = 'grid',
  onAssignDriver,
  onEditLoad,
  onDeleteLoad
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered': return 'text-green-600 bg-green-100';
      case 'Picked Up': return 'text-blue-600 bg-blue-100';
      case 'Assigned': return 'text-yellow-600 bg-yellow-100';
      case 'Booked': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (viewMode === 'table') {
    return (
      <tr className="hover:bg-gray-50">
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
          <Link to={`/load-details/${load.id}`} className="text-blue-600 hover:text-blue-800">
            {load.id}
          </Link>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{load.origin}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{load.destination}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{load.customer}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{load.equipment}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{load.date}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${load.price.toLocaleString()}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{load.driver || '-'}</td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(load.status)}`}>
            {load.status}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
          <div className="flex space-x-2">
            {!load.driver && onAssignDriver && (
              <button
                onClick={() => onAssignDriver(load.id)}
                className="text-blue-600 hover:text-blue-900"
              >
                Assign
              </button>
            )}
            {onEditLoad && (
              <button
                onClick={() => onEditLoad(load.id)}
                className="text-indigo-600 hover:text-indigo-900"
              >
                Edit
              </button>
            )}
            {onDeleteLoad && (
              <button
                onClick={() => onDeleteLoad(load.id)}
                className="text-red-600 hover:text-red-900"
              >
                Delete
              </button>
            )}
          </div>
        </td>
      </tr>
    );
  }

  // Grid view
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <Link to={`/load-details/${load.id}`} className="text-lg font-semibold text-blue-600 hover:text-blue-800">
          {load.id}
        </Link>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(load.status)}`}>
          {load.status}
        </span>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center text-sm text-gray-600">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>{load.origin} → {load.destination}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <span>{load.customer} • {load.equipment}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>{load.date}</span>
        </div>
        
        <div className="flex justify-between items-center pt-2 border-t">
          <span className="text-lg font-semibold text-gray-900">${load.price.toLocaleString()}</span>
          {load.miles && (
            <span className="text-sm text-gray-500">{load.miles} miles</span>
          )}
        </div>
        
        {load.driver && (
          <div className="flex items-center text-sm text-gray-600 pt-2">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>Driver: {load.driver}</span>
          </div>
        )}
      </div>
      
      <div className="flex gap-2 mt-4 pt-4 border-t">
        {!load.driver && onAssignDriver && (
          <button
            onClick={() => onAssignDriver(load.id)}
            className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors"
          >
            Assign Driver
          </button>
        )}
        {onEditLoad && (
          <button
            onClick={() => onEditLoad(load.id)}
            className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded hover:bg-gray-200 transition-colors"
          >
            Edit
          </button>
        )}
        <Link
          to={`/load-details/${load.id}`}
          className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded hover:bg-gray-200 transition-colors text-center"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default LoadCard;