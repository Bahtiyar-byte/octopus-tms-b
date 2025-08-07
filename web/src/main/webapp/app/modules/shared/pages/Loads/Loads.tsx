import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../../../components';
import { useRoleConfig } from '../../hooks/useRoleConfig';
import { useAuth } from '../../../../context/AuthContext';
import { LoadCard } from '../../components/cards/LoadCard';
import { LoadsTable } from '../../components/tables/LoadsTable';
import { LoadsFilters } from '../../components/filters/LoadsFilters';
import { formatLoadId, getLoadStatusColor } from '../../../../utils/load/loadUtils';
import { loadsApi } from '../../api/loadsApi';

export interface Load {
  id: string;
  origin: string;
  destination: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  commodity: string;
  rate: number;
  carrier?: {
    id: string;
    name: string;
  };
  customer?: {
    id: string;
    name: string;
  };
  weight: number;
  equipment?: string;
  pickupDate?: string;
  deliveryDate?: string;
  distance?: number;
  driver?: string;
}

const Loads: React.FC = () => {
  const navigate = useNavigate();
  const config = useRoleConfig('loads');
  const { user } = useAuth();
  const role = user?.role?.toLowerCase();
  
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [loads, setLoads] = useState<Load[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLoads = useCallback(async () => {
    try {
      setLoading(true);
      // Fetch real data from API
      const fetchedLoads = await loadsApi.getLoads(activeFilter !== 'all' ? activeFilter : undefined);
      
      if (fetchedLoads.length === 0 && activeFilter === 'all') {
        // If no loads were returned and we're not filtering, it might be an error
        setError('No loads found. There might be an issue with the data source.');
      } else {
        setLoads(fetchedLoads);
        setError(null);
      }
    } catch (err) {
      console.error('Error fetching loads:', err);
      setError('Failed to load data. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [activeFilter]);

  useEffect(() => {
    // Fetch loads when component mounts or when fetchLoads changes
    fetchLoads();
  }, [fetchLoads]);

  const handleAction = (action: string, load?: Load) => {
    switch (action) {
      case 'createLoad':
      case 'createShipment':
        navigate(`/${role}/create-load`);
        break;
      case 'matchCarrier':
        navigate(`/${role}/carrier-match`, { state: { load } });
        break;
      case 'exportLoads':
        // Exporting loads...
        break;
      case 'schedulePickup':
        // Scheduling pickup for load
        break;
      case 'searchLoads':
      case 'filterLoads':
        // These are handled by the filter component
        break;
      default:
        // Unknown action
    }
  };

  // Filter loads based on active filter and search term
  const filteredLoads = loads.filter(load => {
    const searchTermLower = searchTerm.toLowerCase();
    
    // Check if load matches the active filter
    const matchesFilter = activeFilter === 'all' || load.status === activeFilter;
    
    // Check if load matches the search term
    const matchesSearch = searchTerm === '' || 
      load.id.toLowerCase().includes(searchTermLower) ||
      load.origin.toLowerCase().includes(searchTermLower) ||
      load.destination.toLowerCase().includes(searchTermLower) ||
      load.commodity.toLowerCase().includes(searchTermLower) ||
      (load.carrier?.name && load.carrier.name.toLowerCase().includes(searchTermLower)) ||
      (load.customer?.name && load.customer.name.toLowerCase().includes(searchTermLower));

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{config.title || 'Loads'}</h1>
        <div className="flex gap-3">
          {config.actions?.map((action, index) => (
            <button
              key={`${action.name}-${index}`}
              onClick={() => handleAction(action.handler || action.name)}
              className={`${
                action.name === 'create' || action.name === 'match' 
                  ? 'bg-blue-600 hover:bg-blue-700' 
                  : 'bg-gray-600 hover:bg-gray-700'
              } text-white py-2 px-4 rounded-md shadow-sm flex items-center`}
            >
              {getActionIcon(action.icon || action.name)}
              <span className="ml-2 capitalize">{action.name.replace(/_/g, ' ')}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <LoadsFilters
        filters={config.filters || []}
        activeFilter={activeFilter}
        searchTerm={searchTerm}
        viewMode={viewMode}
        onFilterChange={setActiveFilter}
        onSearchChange={setSearchTerm}
        onViewModeChange={setViewMode}
        loadCounts={{
          all: loads.length,
          available: loads.filter(l => l.status === 'available').length,
          assigned: loads.filter(l => l.status === 'assigned').length,
          in_transit: loads.filter(l => l.status === 'in_transit').length,
          delivered: loads.filter(l => l.status === 'delivered').length,
        }}
      />

      {/* Loads Display */}
      {loading ? (
        <Card className="bg-white shadow-md p-8 text-center">
          <div className="text-gray-500">
            <div className="animate-spin inline-block w-12 h-12 border-4 border-current border-t-transparent rounded-full mb-4" />
            <h3 className="text-xl font-medium mb-2">Loading loads...</h3>
            <p>Please wait while we fetch your loads.</p>
          </div>
        </Card>
      ) : error ? (
        <Card className="bg-white shadow-md p-8 text-center">
          <div className="text-gray-500">
            <svg className="w-12 h-12 mx-auto mb-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="text-xl font-medium mb-2">Error</h3>
            <p>{error}</p>
          </div>
        </Card>
      ) : filteredLoads.length === 0 ? (
        <Card className="bg-white shadow-md p-8 text-center">
          <div className="text-gray-500">
            <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
            </svg>
            <h3 className="text-xl font-medium mb-2">No loads found</h3>
            <p>Try adjusting your filters or create a new load.</p>
          </div>
        </Card>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLoads.map((load) => (
            <LoadCard 
              key={load.id} 
              load={load} 
              onAction={handleAction}
              role={role || 'broker'}
            />
          ))}
        </div>
      ) : (
        <LoadsTable 
          loads={filteredLoads} 
          columns={config.columns || []}
          onAction={handleAction}
          role={role || 'broker'}
        />
      )}
    </div>
  );
};

function getActionIcon(iconName: string): JSX.Element {
  const icons: Record<string, JSX.Element> = {
    plus: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    ),
    create: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    ),
    search: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
    match: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
      </svg>
    ),
    download: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
      </svg>
    ),
    export: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    calendar: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    schedule: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    filter: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
      </svg>
    )
  };
  
  return icons[iconName] || icons.plus;
}

export default Loads;