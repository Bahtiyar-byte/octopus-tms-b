import React from 'react';
import { Card } from '../../../../../../components';

interface DriverPerformance {
  name: string;
  miles: number;
  deliveries: number;
  rating: number;
  onTime: number;
}

interface TopPerformingDriversProps {
  drivers: DriverPerformance[];
}

const TopPerformingDrivers: React.FC<TopPerformingDriversProps> = ({ drivers }) => {
  return (
    <section className="mb-8">
      <h2 className="flex items-center text-xl font-semibold mb-4">
        <i className="fas fa-award mr-2 text-blue-600"></i>
        Top Performing Drivers
      </h2>
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 table-fixed">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="w-1/4 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
                <th scope="col" className="w-1/8 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Miles</th>
                <th scope="col" className="w-1/8 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deliveries</th>
                <th scope="col" className="w-1/6 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                <th scope="col" className="w-1/8 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">On-Time %</th>
                <th scope="col" className="w-1/4 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {drivers.map((driver, index) => {
                const performanceScore = Math.round((driver.rating / 5) * 0.5 * 100 + driver.onTime * 0.5);
                let performanceClass = 'bg-green-500';

                if (performanceScore < 70) {
                  performanceClass = 'bg-red-500';
                } else if (performanceScore < 85) {
                  performanceClass = 'bg-yellow-500';
                }

                return (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-bold mr-3">
                          {driver.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="text-sm font-medium text-gray-900 truncate">{driver.name}</div>
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
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </section>
  );
};

export default TopPerformingDrivers;