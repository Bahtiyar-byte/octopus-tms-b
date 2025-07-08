import React, { useState } from 'react';
import Card from '../ui/Card';
import { DriverPerformance } from '../../types';

interface DriverPerformanceTableProps {
  driverPerformance: DriverPerformance[];
  onDriverAction: (driverName: string, action: string) => void;
  onBatchAction: (action: string, selectedDrivers: string[]) => void;
}

export const DriverPerformanceTable: React.FC<DriverPerformanceTableProps> = ({
  driverPerformance,
  onDriverAction,
  onBatchAction
}) => {
  const [driverFilter, setDriverFilter] = useState('all');
  const [driverSearchTerm, setDriverSearchTerm] = useState('');
  const [selectedDrivers, setSelectedDrivers] = useState<string[]>([]);

  const getPerformanceClass = (score: number) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 75) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const filteredDrivers = driverPerformance.filter(driver => {
    const matchesSearch = driver.name.toLowerCase().includes(driverSearchTerm.toLowerCase());
    
    if (driverFilter === 'all') return matchesSearch;
    
    const performanceScore = Math.round((driver.rating / 5) * 0.5 * 100 + driver.onTime * 0.5);
    
    if (driverFilter === 'top') return matchesSearch && performanceScore >= 90;
    if (driverFilter === 'attention') return matchesSearch && performanceScore < 75;
    
    return matchesSearch;
  });

  const handleBatchDriverAction = (action: string) => {
    if (selectedDrivers.length === 0) {
      alert('Please select at least one driver first.');
      return;
    }
    onBatchAction(action, selectedDrivers);
    if (action !== 'batch') {
      setSelectedDrivers([]);
    }
  };

  return (
    <Card>
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            <button 
              onClick={() => setDriverFilter('all')}
              className={`px-3 py-1 text-xs font-medium rounded-md ${
                driverFilter === 'all' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              All Drivers
            </button>
            <button 
              onClick={() => setDriverFilter('top')}
              className={`px-3 py-1 text-xs font-medium rounded-md ${
                driverFilter === 'top' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Top Performers
            </button>
            <button 
              onClick={() => setDriverFilter('attention')}
              className={`px-3 py-1 text-xs font-medium rounded-md ${
                driverFilter === 'attention' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Needs Attention
            </button>
          </div>
          <div>
            <input
              type="text"
              placeholder="Search drivers..."
              value={driverSearchTerm}
              onChange={(e) => setDriverSearchTerm(e.target.value)}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedDrivers(filteredDrivers.map(d => d.name));
                      } else {
                        setSelectedDrivers([]);
                      }
                    }}
                  />
                  <span className="ml-2">Driver</span>
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Miles</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deliveries</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">On-Time %</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredDrivers.map((driver, index) => {
              const performanceScore = Math.round((driver.rating / 5) * 0.5 * 100 + driver.onTime * 0.5);
              const performanceClass = getPerformanceClass(performanceScore);
              const isSelected = selectedDrivers.includes(driver.name);

              return (
                <tr key={index} className={`hover:bg-gray-50 transition-colors ${isSelected ? 'bg-blue-50' : ''}`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        checked={isSelected}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedDrivers([...selectedDrivers, driver.name]);
                          } else {
                            setSelectedDrivers(selectedDrivers.filter(name => name !== driver.name));
                          }
                        }}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <div className="h-8 w-8 ml-2 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-bold mr-3">
                        {driver.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="text-sm font-medium text-gray-900">{driver.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{driver.miles.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{driver.deliveries}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-600 mr-2">{driver.rating.toFixed(1)}</span>
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className={`w-4 h-4 ${i < Math.floor(driver.rating) ? 'text-yellow-400' : 'text-gray-300'}`} 
                              fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                          </svg>
                        ))}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{driver.onTime}%</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className={`${performanceClass} h-2.5 rounded-full transition-all duration-500`}
                        style={{ width: `${performanceScore}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-600 mt-1 text-right">{performanceScore}%</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => onDriverAction(driver.name, 'view')}
                        className="text-blue-600 hover:text-blue-800" 
                        title="View Details"
                      >
                        <i className="fas fa-eye"></i>
                      </button>
                      <button 
                        onClick={() => onDriverAction(driver.name, 'message')}
                        className="text-green-600 hover:text-green-800" 
                        title="Message"
                      >
                        <i className="fas fa-comment"></i>
                      </button>
                      <button 
                        onClick={() => onDriverAction(driver.name, 'assign')}
                        className="text-purple-600 hover:text-purple-800" 
                        title="Assign Load"
                      >
                        <i className="fas fa-truck-loading"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {selectedDrivers.length > 0 && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-700">
              <b>{selectedDrivers.length}</b> drivers selected
            </span>
            <div className="flex space-x-2">
              <button 
                onClick={() => handleBatchDriverAction('message')}
                className="px-3 py-1 text-xs font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700"
              >
                <i className="fas fa-envelope mr-1"></i> Message All
              </button>
              <button 
                onClick={() => handleBatchDriverAction('training')}
                className="px-3 py-1 text-xs font-medium rounded-md bg-green-600 text-white hover:bg-green-700"
              >
                <i className="fas fa-certificate mr-1"></i> Assign Training
              </button>
              <button 
                onClick={() => handleBatchDriverAction('batch')}
                className="px-3 py-1 text-xs font-medium rounded-md bg-purple-600 text-white hover:bg-purple-700"
              >
                <i className="fas fa-cog mr-1"></i> Batch Actions
              </button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};