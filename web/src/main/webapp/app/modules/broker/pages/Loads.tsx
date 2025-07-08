import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../../components';
import { getStatusBadgeClass } from '../../../data/loads';
import { brokerApi, Load as BrokerLoad } from '../api/brokerApi';

const Loads: React.FC = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [brokerLoads, setBrokerLoads] = useState<BrokerLoad[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Get loads for the current broker
  useEffect(() => {
    const fetchLoads = async () => {
      try {
        setLoading(true);
        const loads = await brokerApi.getLoads();
        setBrokerLoads(loads);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch loads:', err);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchLoads();
  }, []);

  // Filter loads based on active filter and search term
  const filteredLoads = brokerLoads.filter(load => {
    const matchesFilter = activeFilter === 'All' || load.status.replace('_', ' ').toUpperCase() === activeFilter.toUpperCase();
    const matchesSearch = searchTerm === '' || 
      load.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      load.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      load.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (load.carrier?.name && load.carrier.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesFilter && matchesSearch;
  });

  // Get count of loads by status
  const getStatusCount = (status: string) => {
    if (status === 'All') {
      return brokerLoads.length;
    }
    return brokerLoads.filter(load => load.status.replace('_', ' ').toUpperCase() === status.toUpperCase()).length;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Loads</h1>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/broker/smart-load-match')}
            className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md shadow-sm flex items-center"
          >
            <i className="fas fa-magic mr-2"></i> Smart Match
          </button>
          <button
            onClick={() => navigate('/broker/create-load')}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md shadow-sm flex items-center"
          >
            <i className="fas fa-plus-circle mr-2"></i> Create New Load
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          {/* Status Filters */}
          <div className="flex flex-wrap gap-2">
            {['All', 'New', 'Posted', 'Assigned', 'En Route', 'Delivered', 'Awaiting Docs', 'Paid'].map((status) => (
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
                placeholder="Search loads..."
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
                <i className="fas fa-th-large"></i>
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
      {loading ? (
        <Card className="bg-white shadow-md p-8 text-center">
          <div className="text-gray-500">
            <i className="fas fa-spinner fa-spin text-5xl mb-4"></i>
            <h3 className="text-xl font-medium mb-2">Loading loads...</h3>
            <p>Please wait while we fetch your loads.</p>
          </div>
        </Card>
      ) : error ? (
        <Card className="bg-white shadow-md p-8 text-center">
          <div className="text-gray-500">
            <i className="fas fa-exclamation-triangle text-5xl mb-4 text-red-500"></i>
            <h3 className="text-xl font-medium mb-2">Error</h3>
            <p>{error}</p>
          </div>
        </Card>
      ) : filteredLoads.length === 0 ? (
        <Card className="bg-white shadow-md p-8 text-center">
          <div className="text-gray-500">
            <i className="fas fa-truck text-5xl mb-4"></i>
            <h3 className="text-xl font-medium mb-2">No loads found</h3>
            <p>Try adjusting your filters or create a new load.</p>
          </div>
        </Card>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLoads.map((load) => (
            <Card key={load.id} className="bg-white shadow-md hover:shadow-lg transition-shadow">
              <div className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold">{load.id}</h3>
                  <div className="flex items-center gap-2">
                    {load.status === 'new' && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium animate-pulse">
                        NEW
                      </span>
                    )}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(load.status.replace('_', ' '))}`}>
                      {load.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
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
                    <div className="font-medium">{new Date(load.createdAt).toLocaleDateString()}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Updated:</div>
                    <div className="font-medium">{new Date(load.updatedAt).toLocaleDateString()}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Commodity:</div>
                    <div className="font-medium">{load.commodity}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Rate:</div>
                    <div className="font-medium text-green-600">${load.rate}</div>
                  </div>
                </div>

                {load.carrier && (
                  <div className="mb-3">
                    <div className="text-sm text-gray-500 mb-1">Carrier:</div>
                    <div className="font-medium">{load.carrier.name}</div>
                  </div>
                )}

                <div className="mb-3">
                  <div className="text-sm text-gray-500 mb-1">Weight:</div>
                  <div className="font-medium">{load.weight} lbs</div>
                </div>

                <div className="mt-4 flex justify-between">
                  <button 
                    onClick={() => navigate('/load-details/' + load.id, { state: { load } })}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    View Details
                  </button>
                  {load.status === 'posted' && (
                    <button 
                      onClick={() => navigate('/broker/carrier-match', { state: { load } })}
                      className="text-green-600 hover:text-green-800 text-sm font-medium"
                    >
                      Find Carriers
                    </button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-white shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Load #
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Route
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created - Updated
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Commodity
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rate
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Carrier
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                      {load.origin} → {load.destination}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(load.createdAt).toLocaleDateString()} - {new Date(load.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {load.commodity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                      ${load.rate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {load.carrier ? load.carrier.name : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {load.status === 'new' && (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium animate-pulse">
                            NEW
                          </span>
                        )}
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(load.status.replace('_', ' '))}`}>
                          {load.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => navigate('/load-details/' + load.id, { state: { load } })}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        View
                      </button>
                      {load.status === 'posted' && (
                        <button 
                          onClick={() => navigate('/broker/carrier-match', { state: { load } })}
                          className="text-green-600 hover:text-green-900"
                        >
                          Match
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
