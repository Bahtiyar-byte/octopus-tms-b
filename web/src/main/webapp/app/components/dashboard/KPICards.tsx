import React from 'react';
import Card  from '../ui/Card';
import { SupervisorKPI } from '../../data/kpis';

interface KPICardsProps {
  kpis: SupervisorKPI[];
  viewType: 'grid' | 'detail';
}

export const KPICards: React.FC<KPICardsProps> = ({ kpis, viewType }) => {
  const formatChange = (change: number) => {
    return change > 0 
      ? <span className="text-green-600">+{change}%</span>
      : change < 0 
        ? <span className="text-red-600">{change}%</span>
        : <span className="text-gray-600">0%</span>;
  };

  if (viewType === 'grid') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {kpis.map((kpi, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <div className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">{kpi.title}</p>
                  <h3 className="text-2xl font-bold mt-1">{kpi.value}</h3>
                  <p className="text-sm mt-1">
                    vs last period: {formatChange(kpi.change)}
                  </p>
                </div>
                <div className={`bg-${kpi.color}-100 p-3 rounded-full`}>
                  <i className={`${kpi.icon} text-${kpi.color}-500 text-xl`}></i>
                </div>
              </div>
              <div className="mt-3">
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-${kpi.color}-500 rounded-full`} 
                    style={{ width: typeof kpi.value === 'string' && kpi.value.includes('%') 
                      ? kpi.value 
                      : '75%' 
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  // Detail View
  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Metric</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Change</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trend</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {kpis.map((kpi, index) => {
              const status = kpi.change > 0 ? 'Improving' : kpi.change < 0 ? 'Declining' : 'Stable';
              const statusColor = kpi.change > 0 ? 'text-green-600' : kpi.change < 0 ? 'text-red-600' : 'text-gray-600';

              return (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`flex-shrink-0 h-8 w-8 rounded-full bg-${kpi.color}-100 flex items-center justify-center mr-3`}>
                        <i className={`${kpi.icon} text-${kpi.color}-500`}></i>
                      </div>
                      <div className="text-sm font-medium text-gray-900">{kpi.title}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold">{kpi.value}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">{formatChange(kpi.change)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full bg-${kpi.color}-500 rounded-full`} 
                        style={{ width: typeof kpi.value === 'string' && kpi.value.includes('%') 
                          ? kpi.value 
                          : '75%' 
                        }}
                      ></div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColor} bg-opacity-10`}>
                      {status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
};