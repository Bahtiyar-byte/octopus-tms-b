import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../../../components';
import { Load } from '../../pages/Loads/Loads';
import { ColumnConfig } from '../../config/roleConfig';
import { formatLoadId, getLoadStatusColor, formatLoadStatus } from '../../../../utils/load/loadUtils';
import { formatCurrency, formatDate, formatWeight, formatDistance } from '../../../../utils/format';

interface LoadsTableProps {
  loads: Load[];
  columns: ColumnConfig[];
  onAction: (action: string, load: Load) => void;
  role: string;
}

export const LoadsTable: React.FC<LoadsTableProps> = ({ loads, columns, onAction, role }) => {
  const navigate = useNavigate();

  const renderCell = (load: Load, column: ColumnConfig) => {
    switch (column.key) {
      case 'loadId':
        return formatLoadId(load.id);
      case 'origin':
        return load.origin;
      case 'destination':
        return load.destination;
      case 'route':
        return `${load.origin} → ${load.destination}`;
      case 'status':
        return (
          <div className="flex items-center gap-2">
            {load.status === 'draft' && (
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium animate-pulse">
                DRAFT
              </span>
            )}
            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getLoadStatusColor(load.status)}`}>
              {formatLoadStatus(load.status)}
            </span>
          </div>
        );
      case 'pickupDate':
        return load.pickupDate ? formatDate(load.pickupDate) : '-';
      case 'deliveryDate':
        return load.deliveryDate ? formatDate(load.deliveryDate) : '-';
      case 'customer':
        return load.customer?.name || '-';
      case 'carrier':
        return load.carrier?.name || '-';
      case 'rate':
        return <span className="font-medium text-green-600">{formatCurrency(load.rate)}</span>;
      case 'commodity':
        return load.commodity;
      case 'weight':
        return formatWeight(load.weight);
      case 'quantity':
        return formatWeight(load.weight);
      case 'warehouse':
        return '-'; // Would come from load data in real app
      case 'product':
        return load.commodity;
      case 'miles':
      case 'distance':
        return load.distance ? formatDistance(load.distance) : '-';
      case 'equipment':
        return load.equipment || '-';
      case 'driver':
        return load.driver || '-';
      case 'createdAt':
        return formatDate(load.createdAt);
      case 'updatedAt':
        return formatDate(load.updatedAt);
      default:
        return '-';
    }
  };

  const handleViewDetails = (load: Load) => {
    navigate(`/${role}/load-details/${load.id}`, { state: { load } });
  };

  return (
    <Card className="bg-white shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    column.sortable ? 'cursor-pointer hover:text-gray-700' : ''
                  }`}
                >
                  {column.header}
                  {column.sortable && (
                    <span className="ml-1 inline-block">
                      <svg className="w-3 h-3 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                      </svg>
                    </span>
                  )}
                </th>
              ))}
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loads.map((load) => (
              <tr key={load.id} className="hover:bg-gray-50">
                {columns.map((column) => (
                  <td key={`${load.id}-${column.key}`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {renderCell(load, column)}
                  </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    onClick={() => handleViewDetails(load)}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    View
                  </button>
                  
                  {/* Role-specific actions */}
                  {role === 'broker' && load.status === 'available' && (
                    <button 
                      onClick={() => onAction('matchCarrier', load)}
                      className="text-green-600 hover:text-green-900"
                    >
                      Match
                    </button>
                  )}
                  
                  {role === 'shipper' && load.status === 'draft' && (
                    <button 
                      onClick={() => onAction('schedulePickup', load)}
                      className="text-green-600 hover:text-green-900"
                    >
                      Schedule
                    </button>
                  )}
                  
                  {role === 'carrier' && load.status === 'available' && (
                    <button 
                      onClick={() => onAction('acceptLoad', load)}
                      className="text-green-600 hover:text-green-900"
                    >
                      Accept
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};