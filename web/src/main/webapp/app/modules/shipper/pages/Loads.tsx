import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../../components';
import { Load, ShipperLoadStatus, getLoadsForShipper, mapToShipperStatus, getStatusBadgeClass } from '../../../data/loads';

const Loads: React.FC = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  
  // Get loads for the current shipper - in a real app, this would come from auth context
  const currentShipperName = 'Acme Manufacturing'; // Mock current shipper
  const shipperLoads = getLoadsForShipper(currentShipperName);
  
  // Map loads to shipper perspective
  const mappedLoads = shipperLoads.map(load => ({
    ...load,
    status: mapToShipperStatus(load.status),
    reference: load.reference || `REF-${load.id}`
  }));
  
  // Filter loads based on active filter and search term
  const filteredLoads = mappedLoads.filter(load => {
    const matchesFilter = activeFilter === 'All' || load.status === activeFilter;
    const matchesSearch = searchTerm === '' || 
      load.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      load.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      load.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      load.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      load.commodity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (load.carrier && load.carrier.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesFilter && matchesSearch;
  });
  
  // Get count of loads by status
  const getStatusCount = (status: string) => {
    if (status === 'All') {
      return mappedLoads.length;
    }
    return mappedLoads.filter(load => load.status === status).length;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Shipments</h1>
        <button
          onClick={() => navigate('/shipper/create-load')}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md shadow-sm flex items-center"
        >
          <i className="fas fa-plus-circle mr-2"></i> Create New Shipment
        </button>
      </div>
      
      {/* Filters and Search */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          {/* Status Filters */}
          <div className="flex flex-wrap gap-2">
            {['All', 'New', 'Draft', 'Posted', 'Carrier Assigned', 'In Transit', 'Delivered', 'POD Received', 'Closed'].map((status) => (
              <button
                key={status}
                onClick={() => setActiveFilter(status)}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  activeFilter === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                {status} ({getStatusCount(status)})
              </button>
            ))}
          </div>
          
          {/* Search and View Toggle */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search shipments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <i className="fas fa-search"></i>
              </div>
            </div>
            
            <div className="flex border border-gray-300 rounded-md overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
              >
                <i className="fas fa-th"></i>
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-2 ${viewMode === 'table' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
              >
                <i className="fas fa-list"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Loads Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLoads.map((load) => (
            <Card key={load.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <div className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">{load.id}</h3>
                    <p className="text-sm text-gray-600">Ref: {load.reference}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {load.status === 'New' && (
                      <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-medium animate-pulse">
                        <i className="fas fa-sparkles mr-1"></i>NEW
                      </span>
                    )}
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadgeClass(load.status)}`}>
                      {load.status}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-start">
                    <i className="fas fa-dot-circle text-green-500 mr-2 mt-1 text-xs"></i>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{load.origin}</p>
                      <p className="text-xs text-gray-600">Pickup: {new Date(load.pickupDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <i className="fas fa-map-marker-alt text-red-500 mr-2 mt-1 text-xs"></i>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{load.destination}</p>
                      <p className="text-xs text-gray-600">Delivery: {new Date(load.deliveryDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-3 pt-3 border-t">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Commodity:</span>
                    <span className="font-medium">{load.commodity}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Weight:</span>
                    <span className="font-medium">{parseInt(load.weight).toLocaleString()} lbs</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Equipment:</span>
                    <span className="font-medium">{load.equipmentType}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Rate:</span>
                    <span className="font-medium text-green-600">${load.rate}</span>
                  </div>
                </div>
                
                {(load.carrier || load.broker) && (
                  <div className="mt-3 pt-3 border-t">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Broker:</span>
                      <span className="font-medium text-xs">{load.broker}</span>
                    </div>
                    {load.carrier && (
                      <div className="flex justify-between text-sm mt-1">
                        <span className="text-gray-600">Carrier:</span>
                        <span className="font-medium text-xs">{load.carrier}</span>
                      </div>
                    )}
                  </div>
                )}

                {load.specialInstructions && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-xs text-gray-600">
                      <i className="fas fa-info-circle mr-1"></i>
                      {load.specialInstructions}
                    </p>
                  </div>
                )}
                
                <div className="mt-4 flex space-x-2">
                  <button 
                    onClick={() => navigate(`/shipper/tracking?loadId=${load.id}`)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded text-sm"
                  >
                    View Details
                  </button>
                  {load.status === 'In Transit' && (
                    <button 
                      onClick={() => navigate(`/shipper/tracking?loadId=${load.id}`)}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded text-sm"
                    >
                      Track Shipment
                    </button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Shipment ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reference
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Origin → Destination
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dates
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Commodity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Carrier/Broker
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLoads.map((load) => (
                  <tr key={load.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {load.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {load.reference}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {load.origin} → {load.destination}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>P: {new Date(load.pickupDate).toLocaleDateString()}</div>
                      <div>D: {new Date(load.deliveryDate).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {load.commodity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>{load.broker}</div>
                      {load.carrier && <div className="text-xs">Carrier: {load.carrier}</div>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                      ${load.rate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(load.status)}`}>
                        {load.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        onClick={() => navigate(`/shipper/tracking?loadId=${load.id}`)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        View
                      </button>
                      {load.status === 'In Transit' && (
                        <button 
                          onClick={() => navigate(`/shipper/tracking?loadId=${load.id}`)}
                          className="text-green-600 hover:text-green-900"
                        >
                          Track
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Loads;