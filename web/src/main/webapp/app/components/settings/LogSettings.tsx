import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

const LogSettings: React.FC = () => {
  // Mock log data
  const [logs, setLogs] = useState([
    { id: '1', timestamp: 'May 15, 2023 - 10:23:45 AM', level: 'ERROR', message: 'Failed to connect to payment gateway', source: 'PaymentService' },
    { id: '2', timestamp: 'May 15, 2023 - 09:45:12 AM', level: 'INFO', message: 'User john.doe@example.com logged in', source: 'AuthService' },
    { id: '3', timestamp: 'May 15, 2023 - 09:30:05 AM', level: 'WARNING', message: 'High CPU usage detected (85%)', source: 'SystemMonitor' },
    { id: '4', timestamp: 'May 15, 2023 - 08:15:30 AM', level: 'INFO', message: 'System backup completed successfully', source: 'BackupService' },
    { id: '5', timestamp: 'May 14, 2023 - 11:42:18 PM', level: 'ERROR', message: 'Database query timeout after 30 seconds', source: 'DatabaseService' },
    { id: '6', timestamp: 'May 14, 2023 - 10:30:45 PM', level: 'INFO', message: 'Load #12345 status changed to "Delivered"', source: 'LoadService' },
    { id: '7', timestamp: 'May 14, 2023 - 08:22:10 PM', level: 'WARNING', message: 'Low disk space warning (15% remaining)', source: 'SystemMonitor' },
    { id: '8', timestamp: 'May 14, 2023 - 05:17:42 PM', level: 'INFO', message: 'New user jane.smith@example.com created', source: 'UserService' }
  ]);

  const [logFilter, setLogFilter] = useState({
    level: 'all',
    source: 'all',
    dateFrom: '',
    dateTo: ''
  });

  const handleClearLogs = () => {
    toast.success('Clearing system logs...');
    setTimeout(() => {
      setLogs([]);
      toast.success('System logs cleared successfully');
    }, 1000);
  };

  const handleExportLogs = () => {
    toast.success('Exporting system logs...');
    setTimeout(() => {
      toast.success('System logs exported successfully');
    }, 1500);
  };

  const handleFilterChange = (field: string, value: string) => {
    setLogFilter({
      ...logFilter,
      [field]: value
    });
  };

  const handleRefreshLogs = () => {
    toast.success('Refreshing system logs...');
    // In a real app, this would fetch the latest logs from the server
    setTimeout(() => {
      toast.success('System logs refreshed');
    }, 1000);
  };

  // Filter logs based on current filter settings
  const filteredLogs = logs.filter(log => {
    if (logFilter.level !== 'all' && log.level !== logFilter.level) {
      return false;
    }
    if (logFilter.source !== 'all' && log.source !== logFilter.source) {
      return false;
    }
    return true;
  });

  // Get unique sources for filter dropdown
  const uniqueSources = Array.from(new Set(logs.map(log => log.source)));

  return (
    <div>
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h2 className="text-xl font-semibold text-gray-900">System Logs</h2>
        <p className="text-sm text-gray-600 mt-1">View and manage system logs and events</p>
      </div>

      {/* Log Filters */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Log Filters</h3>
          <div className="flex space-x-2">
            <button 
              className="btn btn-sm btn-white"
              onClick={handleRefreshLogs}
            >
              <i className="fas fa-sync-alt mr-1"></i> Refresh
            </button>
            <button 
              className="btn btn-sm btn-white"
              onClick={handleExportLogs}
            >
              <i className="fas fa-download mr-1"></i> Export
            </button>
            <button 
              className="btn btn-sm btn-danger"
              onClick={handleClearLogs}
            >
              <i className="fas fa-trash-alt mr-1"></i> Clear Logs
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label htmlFor="log-level" className="form-label">Log Level</label>
            <select 
              id="log-level" 
              className="form-control"
              value={logFilter.level}
              onChange={(e) => handleFilterChange('level', e.target.value)}
            >
              <option value="all">All Levels</option>
              <option value="INFO">Info</option>
              <option value="WARNING">Warning</option>
              <option value="ERROR">Error</option>
            </select>
          </div>

          <div>
            <label htmlFor="log-source" className="form-label">Source</label>
            <select 
              id="log-source" 
              className="form-control"
              value={logFilter.source}
              onChange={(e) => handleFilterChange('source', e.target.value)}
            >
              <option value="all">All Sources</option>
              {uniqueSources.map(source => (
                <option key={source} value={source}>{source}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="date-from" className="form-label">Date From</label>
            <input 
              type="date" 
              id="date-from" 
              className="form-control"
              value={logFilter.dateFrom}
              onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="date-to" className="form-label">Date To</label>
            <input 
              type="date" 
              id="date-to" 
              className="form-control"
              value={logFilter.dateTo}
              onChange={(e) => handleFilterChange('dateTo', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Log Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Level
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Source
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Message
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLogs.length > 0 ? (
                filteredLogs.map(log => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {log.timestamp}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        log.level === 'ERROR' ? 'bg-red-100 text-red-800' :
                        log.level === 'WARNING' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {log.level}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {log.source}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {log.message}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                    No logs found matching the current filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Settings */}
      <div className="mt-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Log Settings</h3>
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="log-retention" className="form-label">Log Retention Period</label>
              <select id="log-retention" className="form-control">
                <option value="7">7 days</option>
                <option value="14">14 days</option>
                <option value="30" selected>30 days</option>
                <option value="60">60 days</option>
                <option value="90">90 days</option>
              </select>
            </div>

            <div>
              <label htmlFor="log-level-setting" className="form-label">Minimum Log Level</label>
              <select id="log-level-setting" className="form-control">
                <option value="DEBUG">Debug</option>
                <option value="INFO" selected>Info</option>
                <option value="WARNING">Warning</option>
                <option value="ERROR">Error</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <button 
              className="btn btn-primary"
              onClick={() => toast.success('Log settings saved successfully')}
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogSettings;