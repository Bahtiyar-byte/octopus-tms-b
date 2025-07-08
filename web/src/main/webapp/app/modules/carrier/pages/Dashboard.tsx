import React, { useEffect, useState } from 'react';
import { carrierApi } from '../api/carrierApi';
import { fetchWeatherAlerts } from '../../../services/weatherService';
import type { DashboardData, WeatherAlert } from '../../../types';
import { Card } from '../../../components';
import WeatherWidget from '../../../components/WeatherWidget';
import { RevenueChart, LoadVolumeChart } from '../../../components/charts';

const Dashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [weatherAlerts, setWeatherAlerts] = useState<WeatherAlert[]>([]);
  const [weatherLoading, setWeatherLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await carrierApi.getDashboardData();
        setDashboardData(data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    void fetchData();
  }, []);

  // Fetch real weather alerts
  useEffect(() => {
    const getWeatherAlerts = async () => {
      try {
        setWeatherLoading(true);
        const alerts = await fetchWeatherAlerts();
        setWeatherAlerts(alerts);
      } catch (error) {
        console.error('Error fetching weather alerts:', error);
      } finally {
        setWeatherLoading(false);
      }
    };

    getWeatherAlerts();

    // Refresh weather data every 30 minutes
    const intervalId = setInterval(getWeatherAlerts, 30 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center my-10">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-md" role="alert">
        <p className="font-bold">Error</p>
        <p>Failed to load dashboard data. Please try again later.</p>
      </div>
    );
  }

  // Helper function to format currency
  const formatCurrency = (value: number) => {
    return '$' + value.toLocaleString();
  };

  return (
    <div className="fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Overview of your transportation management system</p>
      </div>

      <section className="mb-8">
        <h2 className="flex items-center text-xl font-semibold mb-4">
          <i className="fas fa-chart-line mr-2 text-blue-600"></i>
          Key Metrics
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="dashboard-card bg-gradient-blue">
            <div className="card-body">
              <i className="fas fa-truck-loading card-icon"></i>
              <h5 className="card-title text-gray-600">Total Loads Today</h5>
              <p className="text-3xl font-bold mt-2">{dashboardData.metrics.totalLoadsToday}</p>
              <div className="mt-3 bg-blue-200 bg-opacity-30 rounded-full h-1.5">
                <div 
                  className="bg-white h-1.5 rounded-full" 
                  style={{ width: '75%' }}
                ></div>
              </div>
            </div>
          </div>

          <div className="dashboard-card bg-gradient-green">
            <div className="card-body">
              <i className="fas fa-users card-icon"></i>
              <h5 className="card-title text-gray-600">Active Drivers</h5>
              <p className="text-3xl font-bold mt-2">{dashboardData.metrics.activeDrivers}</p>
              <div className="mt-3 bg-green-200 bg-opacity-30 rounded-full h-1.5">
                <div 
                  className="bg-white h-1.5 rounded-full" 
                  style={{ width: '65%' }}
                ></div>
              </div>
            </div>
          </div>

          <div className="dashboard-card bg-gradient-orange">
            <div className="card-body">
              <i className="fas fa-dollar-sign card-icon"></i>
              <h5 className="card-title text-gray-600">Revenue This Week</h5>
              <p className="text-3xl font-bold mt-2">{formatCurrency(dashboardData.metrics.revenueThisWeek)}</p>
              <div className="mt-3 bg-orange-200 bg-opacity-30 rounded-full h-1.5">
                <div 
                  className="bg-white h-1.5 rounded-full" 
                  style={{ width: '85%' }}
                ></div>
              </div>
            </div>
          </div>

          <div className="dashboard-card bg-gradient-purple">
            <div className="card-body">
              <i className="fas fa-check-circle card-icon"></i>
              <h5 className="card-title text-gray-600">Loads Delivered On Time</h5>
              <p className="text-3xl font-bold mt-2">{dashboardData.metrics.loadsDeliveredOnTime}</p>
              <div className="mt-3 bg-purple-200 bg-opacity-30 rounded-full h-1.5">
                <div 
                  className="bg-white h-1.5 rounded-full" 
                  style={{ width: '90%' }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional metrics row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-5">
          <div className="dashboard-card bg-gradient-teal">
            <div className="card-body">
              <i className="fas fa-road card-icon"></i>
              <h5 className="card-title text-gray-600">Total Miles</h5>
              <p className="text-3xl font-bold mt-2">{dashboardData.metrics.totalMiles.toLocaleString()}</p>
            </div>
          </div>

          <div className="dashboard-card bg-gradient-red">
            <div className="card-body">
              <i className="fas fa-gas-pump card-icon"></i>
              <h5 className="card-title text-gray-600">Fuel Cost</h5>
              <p className="text-3xl font-bold mt-2">{formatCurrency(dashboardData.metrics.fuelCost)}</p>
            </div>
          </div>

          <div className="dashboard-card bg-gradient-indigo">
            <div className="card-body">
              <i className="fas fa-file-invoice-dollar card-icon"></i>
              <h5 className="card-title text-gray-600">Pending Invoices</h5>
              <p className="text-3xl font-bold mt-2">{dashboardData.metrics.pendingInvoices}</p>
            </div>
          </div>

          <div className="dashboard-card bg-gradient-cyan">
            <div className="card-body">
              <i className="fas fa-smile card-icon"></i>
              <h5 className="card-title text-gray-600">Customer Satisfaction</h5>
              <p className="text-3xl font-bold mt-2">{dashboardData.metrics.customerSatisfaction}%</p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <section>
          <h2 className="flex items-center text-xl font-semibold mb-4">
            <i className="fas fa-chart-bar mr-2 text-blue-600"></i>
            Revenue per Customer
          </h2>
          <Card className="h-full">
            <div className="w-full h-full p-4">
              <RevenueChart data={dashboardData.revenuePerCustomer} />
            </div>
          </Card>
        </section>

        <section>
          <h2 className="flex items-center text-xl font-semibold mb-4">
            <i className="fas fa-calendar-alt mr-2 text-blue-600"></i>
            Weekly Load Volume
          </h2>
          <Card className="h-full">
            <div className="w-full h-full p-4">
              <LoadVolumeChart data={dashboardData.weeklyLoadVolume} />
            </div>
          </Card>
        </section>
      </div>

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
                {dashboardData.driverPerformance.map((driver, index) => {
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        <div className="lg:col-span-8">
          <section>
            <h2 className="flex items-center text-xl font-semibold mb-4">
              <i className="fas fa-history mr-2 text-blue-600"></i>
              Recent Activity
            </h2>
            <Card>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Load</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Origin</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destination</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {dashboardData.recentActivity.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors animate-fade-in" 
                          style={{ animationDelay: `${index * 100}ms` }}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{item.load}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.origin}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.destination}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.customer}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.driver || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`status-badge status-badge-${item.status.toLowerCase().replace(' ', '-')}`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </section>
        </div>

        <div className="lg:col-span-4">
          <section className="mb-6">
            <h2 className="flex items-center text-xl font-semibold mb-4">
              <i className="fas fa-truck mr-2 text-blue-600"></i>
              Upcoming Deliveries
            </h2>
            <Card className="h-full">
              <ul className="divide-y divide-gray-200">
                {dashboardData.upcomingDeliveries.map((delivery, index) => {
                  const isDelayed = delivery.status === 'Delayed';
                  const statusClass = isDelayed ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800';

                  return (
                    <li key={index} className="py-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start">
                        <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${isDelayed ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                          <i className={`fas ${isDelayed ? 'fa-exclamation-circle' : 'fa-check-circle'}`}></i>
                        </div>
                        <div className="ml-4 flex-1">
                          <div className="flex justify-between">
                            <h3 className="text-sm font-medium">{delivery.load}</h3>
                            <span className={`${statusClass} status-badge`}>
                              {delivery.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{delivery.destination}</p>
                          <div className="mt-1 text-xs text-gray-500">
                            <div className="flex items-center mb-1">
                              <i className="fas fa-clock mr-1"></i>
                              <span>ETA: {delivery.eta}</span>
                            </div>
                            <div className="flex items-center">
                              <i className="fas fa-user mr-1"></i>
                              <span>{delivery.driver}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </Card>
          </section>

          <section className="mb-6">
            <h2 className="flex items-center text-xl font-semibold mb-4">
              <i className="fas fa-cloud-sun mr-2 text-blue-600"></i>
              Current Weather
            </h2>
            <WeatherWidget 
              lat={40.4406}
              lon={-79.9959}
              location="Pittsburgh, PA"
            />
          </section>

          <section>
            <h2 className="flex items-center text-xl font-semibold mb-4">
              <i className="fas fa-cloud-sun-rain mr-2 text-blue-600"></i>
              Weather Alerts
            </h2>
            <Card>
              {weatherLoading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : weatherAlerts.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  <i className="fas fa-sun text-yellow-400 text-3xl mb-2"></i>
                  <p>No weather alerts at this time.</p>
                </div>
              ) : (
                <div className="space-y-3 p-4">
                  {weatherAlerts.map((alert, index) => {
                    const impactClass = alert.impact === 'High' 
                      ? 'bg-red-50 border-red-400 text-red-800' 
                      : alert.impact === 'Medium' 
                        ? 'bg-yellow-50 border-yellow-400 text-yellow-800' 
                        : 'bg-blue-50 border-blue-400 text-blue-800';

                    const impactIcon = alert.impact === 'High' 
                      ? 'fa-exclamation-triangle' 
                      : alert.impact === 'Medium' 
                        ? 'fa-exclamation-circle' 
                        : 'fa-info-circle';

                    return (
                      <div key={index} className={`${impactClass} border-l-4 p-4 rounded-md`}>
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <i className={`fas ${impactIcon}`}></i>
                          </div>
                          <div className="ml-3">
                            <h3 className="text-sm font-medium">
                              <span className="font-bold">{alert.region}:</span> {alert.alert}
                            </h3>
                            <div className="mt-1 text-xs">
                              <span className="font-semibold">Impact: </span>{alert.impact}
                              <span className="mx-1">&bull;</span>
                              <span className="font-semibold">Loads Affected: </span>{alert.affectedLoads}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  <div className="text-xs text-gray-500 text-right mt-2">
                    <i className="fas fa-sync-alt mr-1"></i> Weather data refreshes every 30 minutes
                  </div>
                </div>
              )}
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
