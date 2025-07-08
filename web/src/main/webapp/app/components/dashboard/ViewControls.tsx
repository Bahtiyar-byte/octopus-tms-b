import React from 'react';

interface ViewControlsProps {
  activePeriod: string;
  viewType: string;
  onPeriodChange: (period: string) => void;
  onViewTypeChange: (type: string) => void;
  onExport: () => void;
}

export const ViewControls: React.FC<ViewControlsProps> = ({
  activePeriod,
  viewType,
  onPeriodChange,
  onViewTypeChange,
  onExport
}) => {
  return (
    <div className="flex space-x-3">
      <div className="inline-flex rounded-md shadow-sm">
        <button
          type="button"
          onClick={() => onPeriodChange('day')}
          className={`px-4 py-2 text-sm font-medium rounded-l-md ${
            activePeriod === 'day' 
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          } border border-gray-300`}
        >
          Day
        </button>
        <button
          type="button"
          onClick={() => onPeriodChange('week')}
          className={`px-4 py-2 text-sm font-medium border-t border-b ${
            activePeriod === 'week' 
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          } border-t border-b border-r border-gray-300`}
        >
          Week
        </button>
        <button
          type="button"
          onClick={() => onPeriodChange('month')}
          className={`px-4 py-2 text-sm font-medium rounded-r-md border ${
            activePeriod === 'month' 
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          } border-t border-b border-r border-gray-300`}
        >
          Month
        </button>
      </div>

      <div className="inline-flex rounded-md shadow-sm">
        <button
          type="button"
          onClick={() => onViewTypeChange('grid')}
          className={`px-3 py-2 text-sm font-medium rounded-l-md ${
            viewType === 'grid' 
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          } border border-gray-300`}
          title="Grid View"
        >
          <i className="fas fa-th-large"></i>
        </button>
        <button
          type="button"
          onClick={() => onViewTypeChange('detail')}
          className={`px-3 py-2 text-sm font-medium rounded-r-md border ${
            viewType === 'detail' 
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          } border-t border-b border-r border-gray-300`}
          title="Detail View"
        >
          <i className="fas fa-list"></i>
        </button>
      </div>

      <button
        type="button"
        onClick={onExport}
        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <i className="fas fa-download mr-2"></i>
        Export
      </button>
    </div>
  );
};