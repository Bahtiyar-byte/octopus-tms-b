import React, { useState } from 'react';
import { Card } from '../../../components';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { toast } from 'react-hot-toast';

interface BrokerPerformance {
  name: string;
  loadsBooked: number;
  revenue: number;
  avgMargin: number;
  customerSatisfaction: number;
  activeLoads: number;
}

interface TeamMetrics {
  totalLoads: number;
  totalRevenue: number;
  avgMargin: number;
  onTimeDelivery: number;
  customerComplaints: number;
  carrierIssues: number;
}

const SupervisorDashboard: React.FC = () => {
  const [dateRange, setDateRange] = useState('week');
  const [selectedBroker, setSelectedBroker] = useState<string | null>(null);
  const [showTargetsModal, setShowTargetsModal] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<'loads' | 'revenue'>('revenue');

  // Mock team metrics
  const teamMetrics: TeamMetrics = {
    totalLoads: 247,
    totalRevenue: 485000,
    avgMargin: 18.5,
    onTimeDelivery: 94.2,
    customerComplaints: 3,
    carrierIssues: 5
  };

  // Mock broker performance data
  const brokerPerformance: BrokerPerformance[] = [
    {
      name: 'Sarah Johnson',
      loadsBooked: 45,
      revenue: 98500,
      avgMargin: 19.2,
      customerSatisfaction: 4.8,
      activeLoads: 12
    },
    {
      name: 'Mike Chen',
      loadsBooked: 38,
      revenue: 87200,
      avgMargin: 18.7,
      customerSatisfaction: 4.6,
      activeLoads: 10
    },
    {
      name: 'Emily Davis',
      loadsBooked: 52,
      revenue: 112300,
      avgMargin: 17.9,
      customerSatisfaction: 4.9,
      activeLoads: 15
    },
    {
      name: 'James Wilson',
      loadsBooked: 41,
      revenue: 91000,
      avgMargin: 18.1,
      customerSatisfaction: 4.5,
      activeLoads: 11
    },
    {
      name: 'Lisa Thompson',
      loadsBooked: 36,
      revenue: 78400,
      avgMargin: 19.5,
      customerSatisfaction: 4.7,
      activeLoads: 9
    },
    {
      name: 'David Martinez',
      loadsBooked: 35,
      revenue: 77600,
      avgMargin: 17.8,
      customerSatisfaction: 4.4,
      activeLoads: 8
    }
  ];

  // Mock daily performance data
  const dailyPerformance = [
    { day: 'Mon', loads: 42, revenue: 85000 },
    { day: 'Tue', loads: 38, revenue: 78000 },
    { day: 'Wed', loads: 45, revenue: 92000 },
    { day: 'Thu', loads: 51, revenue: 105000 },
    { day: 'Fri', loads: 48, revenue: 98000 },
    { day: 'Sat', loads: 15, revenue: 18000 },
    { day: 'Sun', loads: 8, revenue: 9000 }
  ];

  // Mock lane performance data
  const lanePerformance = [
    { name: 'TX-CA', value: 25, revenue: 125000 },
    { name: 'IL-FL', value: 18, revenue: 95000 },
    { name: 'CA-WA', value: 15, revenue: 78000 },
    { name: 'NY-GA', value: 12, revenue: 65000 },
    { name: 'Other', value: 30, revenue: 122000 }
  ];

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  // Mock alerts and issues
  const alerts = [
    { id: 1, type: 'warning', message: 'Load BL-1245 delayed - weather conditions', broker: 'Sarah Johnson', time: '10 min ago' },
    { id: 2, type: 'error', message: 'Carrier cancelled on Load BL-1248', broker: 'Mike Chen', time: '25 min ago' },
    { id: 3, type: 'info', message: 'New high-value customer inquiry', broker: 'Emily Davis', time: '1 hour ago' },
    { id: 4, type: 'warning', message: 'Load BL-1242 - driver requesting detention pay', broker: 'James Wilson', time: '2 hours ago' }
  ];

  // Mock revenue trends data
  const revenueTrends = [
    { month: 'Jan', revenue: 380000, target: 400000, margin: 17.5 },
    { month: 'Feb', revenue: 420000, target: 420000, margin: 18.2 },
    { month: 'Mar', revenue: 465000, target: 450000, margin: 18.8 },
    { month: 'Apr', revenue: 485000, target: 480000, margin: 18.5 },
    { month: 'May', revenue: 512000, target: 500000, margin: 19.1 }
  ];

  // Mock broker targets
  const brokerTargets = [
    { broker: 'Sarah Johnson', monthlyTarget: 85000, currentProgress: 92, loadsTarget: 40, loadsProgress: 45 },
    { broker: 'Mike Chen', monthlyTarget: 80000, currentProgress: 88, loadsTarget: 35, loadsProgress: 38 },
    { broker: 'Emily Davis', monthlyTarget: 95000, currentProgress: 105, loadsTarget: 45, loadsProgress: 52 },
    { broker: 'James Wilson', monthlyTarget: 82000, currentProgress: 96, loadsTarget: 38, loadsProgress: 41 },
    { broker: 'Lisa Thompson', monthlyTarget: 75000, currentProgress: 85, loadsTarget: 32, loadsProgress: 36 },
    { broker: 'David Martinez', monthlyTarget: 72000, currentProgress: 94, loadsTarget: 30, loadsProgress: 35 }
  ];

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error':
        return 'fa-exclamation-circle text-red-500';
      case 'warning':
        return 'fa-exclamation-triangle text-yellow-500';
      case 'info':
        return 'fa-info-circle text-blue-500';
      default:
        return 'fa-info-circle text-gray-500';
    }
  };

  const handleExportData = () => {
    toast.success('Exporting team performance data...');
    setTimeout(() => {
      toast.success('Performance report downloaded successfully');
    }, 1500);
  };

  const handleSetTargets = () => {
    setShowTargetsModal(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Broker Team Dashboard</h1>
          <p className="text-gray-600">Monitor and manage your brokerage team performance</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setDateRange('day')}
            className={`px-3 py-1 rounded-md text-sm ${
              dateRange === 'day' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setDateRange('week')}
            className={`px-3 py-1 rounded-md text-sm ${
              dateRange === 'week' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            This Week
          </button>
          <button
            onClick={() => setDateRange('month')}
            className={`px-3 py-1 rounded-md text-sm ${
              dateRange === 'month' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            This Month
          </button>
          <button
            onClick={handleSetTargets}
            className="px-3 py-1 rounded-md text-sm bg-purple-600 text-white hover:bg-purple-700"
          >
            <i className="fas fa-bullseye mr-1"></i>
            Set Targets
          </button>
          <button
            onClick={handleExportData}
            className="px-3 py-1 rounded-md text-sm bg-green-600 text-white hover:bg-green-700"
          >
            <i className="fas fa-download mr-1"></i>
            Export Data
          </button>
        </div>
      </div>

      {/* Team KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
        <Card>
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Loads</p>
                <p className="text-2xl font-bold">{teamMetrics.totalLoads}</p>
                <p className="text-xs text-green-600">+12% vs last {dateRange}</p>
              </div>
              <div className="text-blue-500">
                <i className="fas fa-truck text-2xl"></i>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Revenue</p>
                <p className="text-2xl font-bold">${(teamMetrics.totalRevenue / 1000).toFixed(0)}K</p>
                <p className="text-xs text-green-600">+8% vs last {dateRange}</p>
              </div>
              <div className="text-green-500">
                <i className="fas fa-dollar-sign text-2xl"></i>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Avg Margin</p>
                <p className="text-2xl font-bold">{teamMetrics.avgMargin}%</p>
                <p className="text-xs text-yellow-600">-0.5% vs last {dateRange}</p>
              </div>
              <div className="text-purple-500">
                <i className="fas fa-percentage text-2xl"></i>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">On-Time</p>
                <p className="text-2xl font-bold">{teamMetrics.onTimeDelivery}%</p>
                <p className="text-xs text-green-600">+1.2% vs last {dateRange}</p>
              </div>
              <div className="text-blue-500">
                <i className="fas fa-clock text-2xl"></i>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Complaints</p>
                <p className="text-2xl font-bold">{teamMetrics.customerComplaints}</p>
                <p className="text-xs text-red-600">+1 vs last {dateRange}</p>
              </div>
              <div className="text-red-500">
                <i className="fas fa-exclamation-triangle text-2xl"></i>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Issues</p>
                <p className="text-2xl font-bold">{teamMetrics.carrierIssues}</p>
                <p className="text-xs text-yellow-600">+2 vs last {dateRange}</p>
              </div>
              <div className="text-orange-500">
                <i className="fas fa-exclamation-circle text-2xl"></i>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Daily Performance Chart */}
        <Card className="lg:col-span-2">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Daily Performance</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailyPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis yAxisId="left" orientation="left" stroke="#3B82F6" />
                <YAxis yAxisId="right" orientation="right" stroke="#10B981" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="loads" fill="#3B82F6" name="Loads" />
                <Bar yAxisId="right" dataKey="revenue" fill="#10B981" name="Revenue ($)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Lane Performance */}
        <Card>
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Top Lanes</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={lanePerformance}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {lanePerformance.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Broker Performance Table */}
        <div className="lg:col-span-2">
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Broker Performance</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Broker
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Loads
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Revenue
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Margin
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rating
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Active
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {brokerPerformance.map((broker) => (
                      <tr 
                        key={broker.name} 
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => setSelectedBroker(broker.name)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-700">
                                {broker.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-900">{broker.name}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {broker.loadsBooked}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${(broker.revenue / 1000).toFixed(1)}K
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`text-sm ${
                            broker.avgMargin >= 19 ? 'text-green-600' : 
                            broker.avgMargin >= 18 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {broker.avgMargin}%
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="text-sm text-gray-900 mr-1">{broker.customerSatisfaction}</span>
                            <i className="fas fa-star text-yellow-400 text-xs"></i>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                            {broker.activeLoads}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        </div>

        {/* Alerts and Issues */}
        <Card>
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Alerts</h2>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div key={alert.id} className="border-l-4 border-gray-200 pl-4 hover:border-blue-500 transition-colors">
                  <div className="flex items-start">
                    <i className={`fas ${getAlertIcon(alert.type)} mr-2 mt-1`}></i>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{alert.message}</p>
                      <p className="text-xs text-gray-500">{alert.broker} • {alert.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-4 w-full text-center text-sm text-blue-600 hover:text-blue-800">
              View All Alerts
            </button>
          </div>
        </Card>
      </div>

      {/* Revenue Trends Chart */}
      <div className="mt-6">
        <Card>
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Revenue Trends & Targets</h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedMetric('revenue')}
                  className={`px-3 py-1 rounded-md text-sm ${
                    selectedMetric === 'revenue' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  Revenue
                </button>
                <button
                  onClick={() => setSelectedMetric('loads')}
                  className={`px-3 py-1 rounded-md text-sm ${
                    selectedMetric === 'loads' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  Load Volume
                </button>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value: number) => `$${(value / 1000).toFixed(0)}K`} />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stackId="1"
                  stroke="#3B82F6" 
                  fill="#3B82F6" 
                  fillOpacity={0.6}
                  name="Actual Revenue"
                />
                <Area 
                  type="monotone" 
                  dataKey="target" 
                  stackId="2"
                  stroke="#10B981" 
                  fill="#10B981" 
                  fillOpacity={0.3}
                  name="Target Revenue"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Broker Targets Progress */}
      <div className="mt-6">
        <Card>
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Monthly Targets Progress</h2>
            <div className="space-y-4">
              {brokerTargets.map((target) => (
                <div key={target.broker} className="border-b pb-4 last:border-b-0">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-gray-900">{target.broker}</h3>
                    <div className="flex space-x-4 text-sm">
                      <span className="text-gray-600">
                        Revenue: ${(target.monthlyTarget / 1000).toFixed(0)}K target
                      </span>
                      <span className="text-gray-600">
                        Loads: {target.loadsTarget} target
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Revenue Progress</span>
                        <span className={`font-medium ${
                          target.currentProgress >= 100 ? 'text-green-600' : 
                          target.currentProgress >= 80 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {target.currentProgress}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-500 ${
                            target.currentProgress >= 100 ? 'bg-green-500' : 
                            target.currentProgress >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${Math.min(target.currentProgress, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Loads Progress</span>
                        <span className="font-medium text-blue-600">
                          {target.loadsProgress}/{target.loadsTarget}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${(target.loadsProgress / target.loadsTarget) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <button 
          onClick={() => toast.success('Opening team meeting scheduler...')}
          className="p-4 bg-white border rounded-lg hover:shadow-md transition-shadow text-left"
        >
          <div className="flex items-center justify-between">
            <div>
              <i className="fas fa-calendar-plus text-blue-500 text-xl mb-2"></i>
              <h3 className="font-medium">Schedule Team Meeting</h3>
              <p className="text-sm text-gray-600 mt-1">Set up weekly sync</p>
            </div>
            <i className="fas fa-chevron-right text-gray-400"></i>
          </div>
        </button>

        <button 
          onClick={() => toast.success('Opening performance review forms...')}
          className="p-4 bg-white border rounded-lg hover:shadow-md transition-shadow text-left"
        >
          <div className="flex items-center justify-between">
            <div>
              <i className="fas fa-chart-line text-green-500 text-xl mb-2"></i>
              <h3 className="font-medium">Performance Reviews</h3>
              <p className="text-sm text-gray-600 mt-1">Monthly evaluations</p>
            </div>
            <i className="fas fa-chevron-right text-gray-400"></i>
          </div>
        </button>

        <button 
          onClick={() => toast.success('Opening training resources...')}
          className="p-4 bg-white border rounded-lg hover:shadow-md transition-shadow text-left"
        >
          <div className="flex items-center justify-between">
            <div>
              <i className="fas fa-graduation-cap text-purple-500 text-xl mb-2"></i>
              <h3 className="font-medium">Training Resources</h3>
              <p className="text-sm text-gray-600 mt-1">Broker education</p>
            </div>
            <i className="fas fa-chevron-right text-gray-400"></i>
          </div>
        </button>

        <button 
          onClick={() => toast.success('Opening incentive programs...')}
          className="p-4 bg-white border rounded-lg hover:shadow-md transition-shadow text-left"
        >
          <div className="flex items-center justify-between">
            <div>
              <i className="fas fa-trophy text-yellow-500 text-xl mb-2"></i>
              <h3 className="font-medium">Incentive Programs</h3>
              <p className="text-sm text-gray-600 mt-1">Bonus structures</p>
            </div>
            <i className="fas fa-chevron-right text-gray-400"></i>
          </div>
        </button>
      </div>
    </div>
  );
};

export default SupervisorDashboard;