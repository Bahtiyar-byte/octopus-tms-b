import React from 'react';
import { Card } from '../../../components';
import WeatherWidget from '../../../components/WeatherWidget';
import { RevenueChart, LoadVolumeChart } from '../../../components/charts';
import PopularRoutes from '../components/PopularRoutes';

const Dashboard: React.FC = () => {

  // Mock data for shipper-specific metrics
  const spendByCarrier = [
    { customer: 'Shanahan Transportation', revenue: 185000, color: '#3B82F6' },
    { customer: 'Swift Logistics', revenue: 156000, color: '#10B981' },
    { customer: 'JB Hunt', revenue: 142000, color: '#F59E0B' },
    { customer: 'Schneider National', revenue: 128000, color: '#8B5CF6' },
    { customer: 'Werner Enterprises', revenue: 95000, color: '#EF4444' }
  ];

  const weeklyShipmentVolume = {
    dates: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    counts: [22, 28, 32, 26, 35, 12, 8]
  };

  const upcomingPickups = [
    { load: 'SH-2145', origin: 'Chicago, IL', pickup: 'Today, 2:00 PM', carrier: 'Shanahan Transportation', status: 'Scheduled' },
    { load: 'SH-2146', origin: 'Detroit, MI', pickup: 'Today, 4:30 PM', carrier: 'Swift Logistics', status: 'In Transit' },
    { load: 'SH-2147', origin: 'Milwaukee, WI', pickup: 'Tomorrow, 9:00 AM', carrier: 'JB Hunt', status: 'Scheduled' },
    { load: 'SH-2148', origin: 'Cleveland, OH', pickup: 'Tomorrow, 1:00 PM', carrier: 'Werner Enterprises', status: 'Pending' }
  ];

  const recentPODs = [
    { load: 'SH-2140', destination: 'Los Angeles, CA', delivered: '2 hours ago', status: 'Verified' },
    { load: 'SH-2139', destination: 'Phoenix, AZ', delivered: '5 hours ago', status: 'Pending Review' },
    { load: 'SH-2138', destination: 'Seattle, WA', delivered: 'Yesterday', status: 'Verified' },
    { load: 'SH-2137', destination: 'Denver, CO', delivered: 'Yesterday', status: 'Verified' }
  ];

  return (
    <div className="fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Shipper Dashboard</h1>
        <p className="text-gray-600">Overview of your shipping operations and logistics</p>
      </div>
      
      <section className="mb-8">
        <h2 className="flex items-center text-xl font-semibold mb-4">
          <i className="fas fa-chart-line mr-2 text-blue-600"></i>
          Key Metrics
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="dashboard-card bg-gradient-blue">
            <div className="card-body">
              <i className="fas fa-truck mr-1 card-icon"></i>
              <h5 className="card-title text-gray-600">Upcoming Shipments</h5>
              <p className="text-3xl font-bold mt-2">18</p>
              <p className="text-sm text-gray-500 mt-1">6 scheduled today</p>
              <div className="mt-3 bg-blue-200 bg-opacity-30 rounded-full h-1.5">
                <div className="bg-white h-1.5 rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>
          </div>
          
          <div className="dashboard-card bg-gradient-green">
            <div className="card-body">
              <i className="fas fa-clock card-icon"></i>
              <h5 className="card-title text-gray-600">Late Deliveries</h5>
              <p className="text-3xl font-bold mt-2">3</p>
              <p className="text-sm text-gray-500 mt-1">All being tracked</p>
              <div className="mt-3 bg-green-200 bg-opacity-30 rounded-full h-1.5">
                <div className="bg-white h-1.5 rounded-full" style={{ width: '15%' }}></div>
              </div>
            </div>
          </div>
          
          <div className="dashboard-card bg-gradient-purple">
            <div className="card-body">
              <i className="fas fa-file-alt card-icon"></i>
              <h5 className="card-title text-gray-600">Recent PODs</h5>
              <p className="text-3xl font-bold mt-2">12</p>
              <p className="text-sm text-gray-500 mt-1">8 verified, 4 pending</p>
              <div className="mt-3 bg-purple-200 bg-opacity-30 rounded-full h-1.5">
                <div className="bg-white h-1.5 rounded-full" style={{ width: '67%' }}></div>
              </div>
            </div>
          </div>

          <div className="dashboard-card bg-gradient-orange">
            <div className="card-body">
              <i className="fas fa-dollar-sign card-icon"></i>
              <h5 className="card-title text-gray-600">Total Spend (MTD)</h5>
              <p className="text-3xl font-bold mt-2">$276,500</p>
              <p className="text-sm text-gray-500 mt-1">-8% from last month</p>
              <div className="mt-3 bg-orange-200 bg-opacity-30 rounded-full h-1.5">
                <div className="bg-white h-1.5 rounded-full" style={{ width: '82%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <section>
          <h2 className="flex items-center text-xl font-semibold mb-4">
            <i className="fas fa-chart-bar mr-2 text-blue-600"></i>
            Spend by Carrier
          </h2>
          <Card className="h-full">
            <div className="w-full h-full p-4">
              <RevenueChart data={spendByCarrier} />
            </div>
          </Card>
        </section>

        <section>
          <h2 className="flex items-center text-xl font-semibold mb-4">
            <i className="fas fa-calendar-alt mr-2 text-blue-600"></i>
            Weekly Shipment Volume
          </h2>
          <Card className="h-full">
            <div className="w-full h-full p-4">
              <LoadVolumeChart data={weeklyShipmentVolume} />
            </div>
          </Card>
        </section>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Upcoming Pickups</h2>
            <div className="space-y-3">
              {upcomingPickups.map((pickup, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{pickup.load}</p>
                    <p className="text-sm text-gray-600">{pickup.origin} - {pickup.carrier}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-700">{pickup.pickup}</p>
                    <p className={`text-xs px-2 py-1 rounded-full inline-block mt-1 ${
                      pickup.status === 'Scheduled' ? 'bg-blue-100 text-blue-700' :
                      pickup.status === 'In Transit' ? 'bg-green-100 text-green-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {pickup.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Recent PODs</h2>
            <div className="space-y-3">
              {recentPODs.map((pod, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{pod.load}</p>
                    <p className="text-sm text-gray-600">{pod.destination}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">{pod.delivered}</p>
                    <p className={`text-xs px-2 py-1 rounded-full inline-block mt-1 ${
                      pod.status === 'Verified' ? 'bg-green-100 text-green-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {pod.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Popular Routes and Weather Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <PopularRoutes />
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Weather Alerts</h2>
          <Card>
            <div className="p-6">
              <WeatherWidget lat={41.8781} lon={-87.6298} location="Chicago, IL" />
            </div>
          </Card>
        </div>
      </div>

      {/* On-Time Delivery Performance */}
      <Card>
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">On-Time Delivery Performance</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Overall Performance</span>
                <span className="text-sm font-medium text-gray-700">94%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '94%' }}></div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">156</p>
                <p className="text-sm text-gray-600">On-Time Deliveries</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-yellow-600">7</p>
                <p className="text-sm text-gray-600">Delayed Deliveries</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">3</p>
                <p className="text-sm text-gray-600">In Transit</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;