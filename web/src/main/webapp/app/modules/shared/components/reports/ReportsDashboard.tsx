import React from 'react';
import { Card } from '../../../../components';
import { ReportTemplate } from '../../pages/Reports/Reports';
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../../../../utils/format';

interface ReportsDashboardProps {
  templates: ReportTemplate[];
  onSelectTemplate: (template: ReportTemplate) => void;
  role: string;
}

export const ReportsDashboard: React.FC<ReportsDashboardProps> = ({ 
  templates, 
  onSelectTemplate,
  role 
}) => {
  // Mock data for overview charts
  const getOverviewData = () => {
    switch (role) {
      case 'BROKER':
        return {
          revenue: [
            { month: 'Jan', value: 245000 },
            { month: 'Feb', value: 298000 },
            { month: 'Mar', value: 312000 },
            { month: 'Apr', value: 285000 },
            { month: 'May', value: 342000 },
            { month: 'Jun', value: 378000 }
          ],
          metrics: [
            { label: 'Total Revenue', value: '$1.86M', change: '+12%', trend: 'up' },
            { label: 'Active Loads', value: '156', change: '+8%', trend: 'up' },
            { label: 'Avg Margin', value: '21%', change: '-2%', trend: 'down' },
            { label: 'Customer Count', value: '85', change: '+5%', trend: 'up' }
          ]
        };
      case 'SHIPPER':
        return {
          revenue: [
            { month: 'Jan', value: 42 },
            { month: 'Feb', value: 56 },
            { month: 'Mar', value: 48 },
            { month: 'Apr', value: 62 },
            { month: 'May', value: 71 },
            { month: 'Jun', value: 68 }
          ],
          metrics: [
            { label: 'Shipments', value: '347', change: '+15%', trend: 'up' },
            { label: 'On-Time Rate', value: '94%', change: '+3%', trend: 'up' },
            { label: 'Avg Cost/Mile', value: '$1.82', change: '-5%', trend: 'down' },
            { label: 'Active Warehouses', value: '12', change: '0%', trend: 'neutral' }
          ]
        };
      case 'CARRIER':
        return {
          revenue: [
            { month: 'Jan', value: 89 },
            { month: 'Feb', value: 92 },
            { month: 'Mar', value: 88 },
            { month: 'Apr', value: 95 },
            { month: 'May', value: 98 },
            { month: 'Jun', value: 94 }
          ],
          metrics: [
            { label: 'Utilization', value: '94%', change: '+2%', trend: 'up' },
            { label: 'Miles Driven', value: '285K', change: '+10%', trend: 'up' },
            { label: 'Fuel Efficiency', value: '6.8 MPG', change: '+1%', trend: 'up' },
            { label: 'Active Drivers', value: '32', change: '+4%', trend: 'up' }
          ]
        };
      default:
        return { revenue: [], metrics: [] };
    }
  };
  
  const { revenue, metrics } = getOverviewData();
  const popularTemplates = templates.filter(t => t.isPopular);
  
  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <Card key={index} className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">{metric.label}</p>
                <p className="text-2xl font-bold mt-1">{metric.value}</p>
              </div>
              <div className={`text-sm font-medium ${
                metric.trend === 'up' ? 'text-green-600' : 
                metric.trend === 'down' ? 'text-red-600' : 
                'text-gray-600'
              }`}>
                {metric.change}
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      {/* Overview Chart */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">
          {role === 'BROKER' ? 'Revenue Trend' : 
           role === 'SHIPPER' ? 'Shipment Volume' : 
           'Utilization Rate'}
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={revenue}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value: number | string) => 
              role === 'BROKER' ? formatCurrency(Number(value)) : `${value}%`
            } />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#3B82F6" 
              fill="#3B82F6" 
              fillOpacity={0.1} 
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card>
      
      {/* Popular Reports */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Popular Reports</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {popularTemplates.map((template) => (
              <div
              key={template.id}
              onClick={() => onSelectTemplate(template)}
            >
              <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-start">
                <div className={`p-3 rounded-lg bg-${template.color}-100 mr-4`}>
                  {getIcon(template.icon, template.color)}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{template.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{template.description}</p>
                  <button className="text-blue-600 text-sm font-medium mt-2 hover:text-blue-800">
                    Generate Report →
                  </button>
                </div>
              </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
      
      {/* All Report Templates */}
      <div>
        <h2 className="text-lg font-semibold mb-4">All Report Templates</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates.map((template) => (
            <div
              key={template.id}
              onClick={() => onSelectTemplate(template)}
            >
              <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`p-2 rounded bg-${template.color}-100 mr-3`}>
                    {getIcon(template.icon, template.color)}
                  </div>
                  <div>
                    <h4 className="font-medium">{template.name}</h4>
                    <p className="text-sm text-gray-500">{template.description}</p>
                  </div>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

function getIcon(iconName: string, color: string): JSX.Element {
  const iconClass = `w-6 h-6 text-${color}-600`;
  
  const icons: Record<string, JSX.Element> = {
    dollar: (
      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    truck: (
      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
      </svg>
    ),
    users: (
      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    package: (
      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    box: (
      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    history: (
      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    warehouse: (
      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    chart: (
      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    user: (
      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    wrench: (
      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    gas: (
      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    )
  };
  
  return icons[iconName] || icons.chart;
}