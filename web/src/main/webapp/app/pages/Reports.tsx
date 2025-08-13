import React, { useState } from 'react';
import { Card } from '../components';
import { formatCurrency } from '../utils';

interface SavedReport {
  id: string;
  title: string;
  type: string;
  date: string;
}

interface CustomerRevenue {
  customer: string;
  loads: number;
  revenue: number;
  avgRate: number;
  percentOfTotal: number;
  yoyChange: number;
}

const Reports: React.FC = () => {
  const [reportType, setReportType] = useState('revenue');
  const [timePeriod, setTimePeriod] = useState('this-month');
  
  const savedReports: SavedReport[] = [
    { id: '1', title: 'Monthly Revenue Report', type: 'revenue', date: 'May 15, 2025' },
    { id: '2', title: 'Driver Performance Q2', type: 'drivers', date: 'May 10, 2025' },
    { id: '3', title: 'Customer Profitability Analysis', type: 'profit', date: 'May 5, 2025' },
    { id: '4', title: 'Route Efficiency Report', type: 'routes', date: 'April 28, 2025' }
  ];
  
  const topCustomers: CustomerRevenue[] = [
    { customer: 'Acme Co', loads: 22, revenue: 32450, avgRate: 1475, percentOfTotal: 25.8, yoyChange: 15.2 },
    { customer: 'Global Logistics', loads: 18, revenue: 28750, avgRate: 1597, percentOfTotal: 22.8, yoyChange: 8.7 },
    { customer: 'Fast Freight', loads: 15, revenue: 25300, avgRate: 1687, percentOfTotal: 20.1, yoyChange: 12.3 },
    { customer: 'Speedy Shipping', loads: 12, revenue: 19850, avgRate: 1654, percentOfTotal: 15.8, yoyChange: -2.1 },
    { customer: 'Reliable Transport', loads: 10, revenue: 15200, avgRate: 1520, percentOfTotal: 12.1, yoyChange: 5.4 }
  ];


  return (
    <div className="fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600">Generate custom reports and analyze your business performance</p>
        </div>
        <div>
          <button className="btn btn-primary flex items-center">
            <i className="fas fa-star mr-2"></i>
            Save Current Report
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="shadow-sm">
          <h2 className="text-lg font-semibold mb-4 pb-3 border-b border-gray-100">
            Report Parameters
          </h2>
          
          <form>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="report-type" className="block text-sm font-medium text-gray-700 mb-1">
                  Report Type
                </label>
                <select 
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  id="report-type"
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                >
                  <option value="revenue">Revenue Report</option>
                  <option value="loads">Load Report</option>
                  <option value="drivers">Driver Performance</option>
                  <option value="customers">Customer Analysis</option>
                  <option value="profit">Profitability Analysis</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="time-period" className="block text-sm font-medium text-gray-700 mb-1">
                  Time Period
                </label>
                <select 
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  id="time-period"
                  value={timePeriod}
                  onChange={(e) => setTimePeriod(e.target.value)}
                >
                  <option value="this-week">This Week</option>
                  <option value="this-month">This Month</option>
                  <option value="last-month">Last Month</option>
                  <option value="quarter">Last Quarter</option>
                  <option value="year">Year to Date</option>
                  <option value="custom">Custom Range</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fas fa-calendar-alt text-gray-400"></i>
                  </div>
                  <input 
                    type="date" 
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
                    id="start-date"
                    disabled={timePeriod !== 'custom'}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fas fa-calendar-alt text-gray-400"></i>
                  </div>
                  <input 
                    type="date" 
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
                    id="end-date"
                    disabled={timePeriod !== 'custom'}
                  />
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <label htmlFor="group-by" className="block text-sm font-medium text-gray-700 mb-1">
                Group By
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fas fa-layer-group text-gray-400"></i>
                </div>
                <select 
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  id="group-by"
                >
                  <option value="day">Day</option>
                  <option value="week">Week</option>
                  <option value="month">Month</option>
                  <option value="customer">Customer</option>
                  <option value="driver">Driver</option>
                  <option value="state">State/Region</option>
                </select>
              </div>
            </div>
            
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Filters
              </label>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="filter-customer"
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="filter-customer" className="ml-2 block text-sm text-gray-700">
                      Filter by Customer
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="filter-region"
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="filter-region" className="ml-2 block text-sm text-gray-700">
                      Filter by Region
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="filter-driver"
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="filter-driver" className="ml-2 block text-sm text-gray-700">
                      Filter by Driver
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="filter-load-type"
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="filter-load-type" className="ml-2 block text-sm text-gray-700">
                      Filter by Load Type
                    </label>
                  </div>
                </div>
                
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <button type="button" className="text-sm text-blue-600 hover:text-blue-800">
                    + Add Custom Filter
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <button 
                type="button" 
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Reset
              </button>
              <button 
                type="button" 
                className="btn btn-primary"
              >
                <i className="fas fa-chart-bar mr-2"></i>
                Generate Report
              </button>
            </div>
          </form>
        </Card>
        
        <Card className="shadow-sm">
          <h2 className="text-lg font-semibold mb-4 pb-3 border-b border-gray-100 flex justify-between items-center">
            <span>Saved Reports</span>
            <button className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
              <i className="fas fa-plus-circle mr-1"></i>
              Create Schedule
            </button>
          </h2>
          
          <div className="space-y-3">
            {savedReports.map((report) => (
              <div 
                key={report.id}
                className="group bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all duration-200"
              >
                <div className="p-4 flex justify-between items-center">
                  <div>
                    <div className="flex items-center">
                      <div className={`h-8 w-8 rounded-lg flex items-center justify-center mr-3 ${
                        report.type === 'revenue' ? 'bg-green-100 text-green-600' :
                        report.type === 'drivers' ? 'bg-blue-100 text-blue-600' :
                        report.type === 'profit' ? 'bg-purple-100 text-purple-600' :
                        'bg-orange-100 text-orange-600'
                      }`}>
                        <i className={`fas ${
                          report.type === 'revenue' ? 'fa-chart-line' :
                          report.type === 'drivers' ? 'fa-users' :
                          report.type === 'profit' ? 'fa-percentage' :
                          'fa-route'
                        }`}></i>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{report.title}</h3>
                        <p className="text-sm text-gray-500">Last Generated: {report.date}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-1">
                    <button className="p-2 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100 transition-colors">
                      <i className="fas fa-download"></i>
                    </button>
                    <button className="p-2 text-gray-500 hover:text-blue-600 rounded-md hover:bg-gray-100 transition-colors">
                      <i className="fas fa-sync-alt"></i>
                    </button>
                    <button className="p-2 text-gray-500 hover:text-red-600 rounded-md hover:bg-gray-100 transition-colors">
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </div>
                
                <div className="bg-gray-50 text-sm p-3 border-t border-gray-200 hidden group-hover:block">
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-6">
                      <div>
                        <span className="text-gray-500">Type:</span> 
                        <span className="ml-1 text-gray-900 font-medium">{
                          report.type === 'revenue' ? 'Revenue Report' :
                          report.type === 'drivers' ? 'Driver Performance' :
                          report.type === 'profit' ? 'Profitability Analysis' :
                          'Route Efficiency'
                        }</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Period:</span> 
                        <span className="ml-1 text-gray-900 font-medium">Last Month</span>
                      </div>
                    </div>
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      Load Parameters
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-lg p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="bg-blue-100 rounded-full p-2 text-blue-600">
                  <i className="fas fa-calendar-check"></i>
                </div>
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-blue-900">Automatic Report Delivery</h4>
                <p className="mt-1 text-sm text-blue-700">Set up scheduled reports to be automatically generated and emailed to your team.</p>
                <div className="mt-3">
                  <button className="inline-flex items-center px-3 py-1.5 border border-blue-300 shadow-sm text-xs font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50">
                    Manage Schedules
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
      
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold flex items-center">
            <i className="fas fa-chart-line mr-2 text-blue-600"></i>
            Revenue Report (April 2025)
          </h2>
          <div className="flex space-x-2">
            <div className="relative">
              <select className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-8 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <option>Last 30 Days</option>
                <option>Last Quarter</option>
                <option>Last Year</option>
                <option>Custom Range</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <i className="fas fa-chevron-down text-gray-400 text-xs"></i>
              </div>
            </div>
            <button className="p-1.5 text-gray-500 hover:text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50">
              <i className="fas fa-download"></i>
            </button>
          </div>
        </div>
        
        <Card className="shadow-sm">
          <div className="h-72 mb-6 bg-gray-50 rounded-lg flex flex-col items-center justify-center">
            <div className="text-center max-w-lg p-4">
              <i className="fas fa-chart-bar text-5xl text-blue-300 mb-4"></i>
              <p className="text-gray-600 mb-4">
                Chart visualization will be implemented with ApexCharts or a similar library.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-lg p-4 text-white">
              <div className="text-4xl font-bold mb-1">$125,850</div>
              <div className="text-lg font-medium mb-2">Total Revenue</div>
              <div className="flex items-center text-sm">
                <i className="fas fa-arrow-up mr-1"></i>
                <span>12.5% vs. previous month</span>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg p-4 text-white">
              <div className="text-4xl font-bold mb-1">86</div>
              <div className="text-lg font-medium mb-2">Total Loads</div>
              <div className="flex items-center text-sm">
                <i className="fas fa-arrow-up mr-1"></i>
                <span>8.9% vs. previous month</span>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg p-4 text-white">
              <div className="text-4xl font-bold mb-1">$1,463</div>
              <div className="text-lg font-medium mb-2">Average Rate</div>
              <div className="flex items-center text-sm">
                <i className="fas fa-arrow-up mr-1"></i>
                <span>3.2% vs. previous month</span>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg p-4 text-white">
              <div className="text-4xl font-bold mb-1">42.5%</div>
              <div className="text-lg font-medium mb-2">Profit Margin</div>
              <div className="flex items-center text-sm">
                <i className="fas fa-arrow-up mr-1"></i>
                <span>1.8% vs. previous month</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        <div className="lg:col-span-8">
          <h2 className="text-xl font-semibold flex items-center mb-4">
            <i className="fas fa-trophy mr-2 text-blue-600"></i>
            Top 5 Customers by Revenue
          </h2>
          
          <Card className="shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Loads
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Revenue
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Avg Rate
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      % of Total
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      YoY Change
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {topCustomers.map((customer, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {customer.customer}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {customer.loads}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {formatCurrency(customer.revenue)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {formatCurrency(customer.avgRate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        <div className="flex items-center">
                          <span className="mr-2">{customer.percentOfTotal}%</span>
                          <div className="w-16 bg-gray-200 rounded-full h-1.5">
                            <div 
                              className="bg-blue-600 h-1.5 rounded-full" 
                              style={{ width: `${customer.percentOfTotal}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`${customer.yoyChange >= 0 ? 'text-green-600' : 'text-red-600'} font-medium`}>
                          {customer.yoyChange >= 0 ? '+' : ''}{customer.yoyChange}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="border-t border-gray-200 px-6 py-3 bg-gray-50 text-right">
              <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                View All Customers
              </button>
            </div>
          </Card>
        </div>
        
        <div className="lg:col-span-4">
          <h2 className="text-xl font-semibold flex items-center mb-4">
            <i className="fas fa-file-export mr-2 text-blue-600"></i>
            Export Options
          </h2>
          
          <Card className="shadow-sm overflow-hidden">
            <div className="space-y-1">
              <button className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex justify-between items-center">
                <div className="flex items-center">
                  <div className="bg-red-100 rounded-full p-2 text-red-500 mr-3">
                    <i className="fas fa-file-pdf"></i>
                  </div>
                  <span className="font-medium text-gray-900">Export as PDF</span>
                </div>
                <i className="fas fa-chevron-right text-gray-400"></i>
              </button>
              
              <button className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex justify-between items-center">
                <div className="flex items-center">
                  <div className="bg-green-100 rounded-full p-2 text-green-500 mr-3">
                    <i className="fas fa-file-excel"></i>
                  </div>
                  <span className="font-medium text-gray-900">Export as Excel</span>
                </div>
                <i className="fas fa-chevron-right text-gray-400"></i>
              </button>
              
              <button className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex justify-between items-center">
                <div className="flex items-center">
                  <div className="bg-blue-100 rounded-full p-2 text-blue-500 mr-3">
                    <i className="fas fa-file-csv"></i>
                  </div>
                  <span className="font-medium text-gray-900">Export as CSV</span>
                </div>
                <i className="fas fa-chevron-right text-gray-400"></i>
              </button>
              
              <button className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex justify-between items-center">
                <div className="flex items-center">
                  <div className="bg-gray-100 rounded-full p-2 text-gray-500 mr-3">
                    <i className="fas fa-print"></i>
                  </div>
                  <span className="font-medium text-gray-900">Print Report</span>
                </div>
                <i className="fas fa-chevron-right text-gray-400"></i>
              </button>
              
              <button className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex justify-between items-center">
                <div className="flex items-center">
                  <div className="bg-purple-100 rounded-full p-2 text-purple-500 mr-3">
                    <i className="fas fa-envelope"></i>
                  </div>
                  <span className="font-medium text-gray-900">Schedule Email Delivery</span>
                </div>
                <i className="fas fa-chevron-right text-gray-400"></i>
              </button>
            </div>
          </Card>
          
          <div className="mt-6">
            <h2 className="text-xl font-semibold flex items-center mb-4">
              <i className="fas fa-sliders-h mr-2 text-blue-600"></i>
              Data Visualization
            </h2>
            
            <Card className="shadow-sm">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Chart Type
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm font-medium">
                      Bar Chart
                    </button>
                    <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-200">
                      Line Chart
                    </button>
                    <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-200">
                      Pie Chart
                    </button>
                    <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-200">
                      Area Chart
                    </button>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <label htmlFor="data-series" className="block text-sm font-medium text-gray-700 mb-1">
                    Data Series
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        id="series-revenue"
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        defaultChecked
                      />
                      <label htmlFor="series-revenue" className="ml-2 flex items-center">
                        <div className="h-3 w-3 bg-blue-500 rounded-full mr-1"></div>
                        <span className="text-sm text-gray-700">Revenue</span>
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        id="series-loads"
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        defaultChecked
                      />
                      <label htmlFor="series-loads" className="ml-2 flex items-center">
                        <div className="h-3 w-3 bg-green-500 rounded-full mr-1"></div>
                        <span className="text-sm text-gray-700">Loads</span>
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        id="series-profit"
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        defaultChecked
                      />
                      <label htmlFor="series-profit" className="ml-2 flex items-center">
                        <div className="h-3 w-3 bg-purple-500 rounded-full mr-1"></div>
                        <span className="text-sm text-gray-700">Profit</span>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between mb-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Comparison
                    </label>
                    <span className="text-sm text-gray-500">vs. Previous Period</span>
                  </div>
                  <div className="w-full h-8 flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;