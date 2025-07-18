import React from 'react';
import { FilterConfig } from '../../config/roleConfig';

interface LoadsFiltersProps {
  filters: FilterConfig[];
  activeFilter: string;
  searchTerm: string;
  viewMode: 'grid' | 'table';
  onFilterChange: (filter: string) => void;
  onSearchChange: (search: string) => void;
  onViewModeChange: (mode: 'grid' | 'table') => void;
  loadCounts: Record<string, number>;
}

export const LoadsFilters: React.FC<LoadsFiltersProps> = ({
  filters,
  activeFilter,
  searchTerm,
  viewMode,
  onFilterChange,
  onSearchChange,
  onViewModeChange,
  loadCounts
}) => {
  // Extract status filter options if available
  const statusFilter = filters.find(f => f.key === 'status');
  const statusOptions = statusFilter?.options || [
    { value: 'all', label: 'All' },
    { value: 'available', label: 'Available' },
    { value: 'assigned', label: 'Assigned' },
    { value: 'in_transit', label: 'In Transit' },
    { value: 'delivered', label: 'Delivered' }
  ];

  return (
    <div className="mb-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        {/* Status Filters */}
        <div className="flex flex-wrap gap-2">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onFilterChange(option.value)}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                activeFilter === option.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              {option.label} ({loadCounts[option.value] || 0})
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
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <div className="flex border border-gray-300 rounded-md overflow-hidden">
            <button
              onClick={() => onViewModeChange('grid')}
              className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
              title="Grid View"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => onViewModeChange('table')}
              className={`px-3 py-2 ${viewMode === 'table' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
              title="Table View"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Additional Filters (Date Range, etc.) */}
      {filters.length > 1 && (
        <div className="mt-4 flex flex-wrap gap-4">
          {filters.filter(f => f.key !== 'status').map((filter) => (
            <div key={filter.key}>
              {filter.type === 'dateRange' && (
                <div className="flex items-center space-x-2">
                  <label className="text-sm text-gray-600">{filter.label}:</label>
                  <input
                    type="date"
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                    placeholder="From"
                  />
                  <span className="text-gray-500">to</span>
                  <input
                    type="date"
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                    placeholder="To"
                  />
                </div>
              )}
              {filter.type === 'select' && filter.key !== 'status' && (
                <div className="flex items-center space-x-2">
                  <label className="text-sm text-gray-600">{filter.label}:</label>
                  <select className="px-3 py-1 border border-gray-300 rounded-md text-sm">
                    {filter.options?.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};