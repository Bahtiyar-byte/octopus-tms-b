import React from 'react';
import { useRoleConfig } from '../../hooks/useRoleConfig';
import { DashboardWidget } from '../../components/dashboard/DashboardWidget';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { QuickActions } from '../../components/dashboard/QuickActions';


// import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Plus, Edit, Truck, Package, DollarSign, Users, TrendingUp, Activity } from 'lucide-react';
import {AIAgent} from "../../../broker/components/AIAgent";
// import { AIAgent } from '../components/AIAgent';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();

    // Mock data for charts
    const revenuePerCustomer = [
        { name: 'ABC Logistics', value: 125000 },
        { name: 'XYZ Transport', value: 98000 },
        { name: 'Global Freight', value: 87000 },
        { name: 'Express Ship Co', value: 76000 },
    ];

    const weeklyLoadVolume = [
        { day: 'Mon', loads: 18 },
        { day: 'Tue', loads: 22 },
        { day: 'Wed', loads: 25 },
        { day: 'Thu', loads: 20 },
        { day: 'Fri', loads: 28 },
        { day: 'Sat', loads: 15 },
        { day: 'Sun', loads: 10 },
    ];

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600">Overview of your freight brokerage operations</p>
            </div>

            {/* Key Metrics */}
            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    Key Metrics
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Open Loads Card */}
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-3 bg-white/20 rounded-lg backdrop-blur">
                                <Package className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <h3 className="text-white/80 text-sm font-medium mb-1">Open Loads</h3>
                        <p className="text-3xl font-bold mb-2">24</p>
                        <p className="text-xs text-white/70">5 awaiting carrier assignment</p>
                        <div className="mt-4 bg-white/20 rounded-full h-2">
                            <div className="bg-white h-2 rounded-full w-3/4"></div>
                        </div>
                    </div>

                    {/* Pending Payments Card */}
                    <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-3 bg-white/20 rounded-lg backdrop-blur">
                                <DollarSign className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <h3 className="text-white/80 text-sm font-medium mb-1">Pending Payments</h3>
                        <p className="text-3xl font-bold mb-2">$12,450</p>
                        <p className="text-xs text-white/70">8 invoices pending approval</p>
                        <div className="mt-4 bg-white/20 rounded-full h-2">
                            <div className="bg-white h-2 rounded-full w-3/5"></div>
                        </div>
                    </div>

                    {/* Total Revenue Card */}
                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-3 bg-white/20 rounded-lg backdrop-blur">
                                <Activity className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <h3 className="text-white/80 text-sm font-medium mb-1">Total Revenue (MTD)</h3>
                        <p className="text-3xl font-bold mb-2">$45,890</p>
                        <p className="text-xs text-white/70">+12% from last month</p>
                        <div className="mt-4 bg-white/20 rounded-full h-2">
                            <div className="bg-white h-2 rounded-full w-5/6"></div>
                        </div>
                    </div>

                    {/* Active Carriers Card */}
                    <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-3 bg-white/20 rounded-lg backdrop-blur">
                                <Users className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <h3 className="text-white/80 text-sm font-medium mb-1">Active Carriers</h3>
                        <p className="text-3xl font-bold mb-2">45</p>
                        <p className="text-xs text-white/70">12 preferred partners</p>
                        <div className="mt-4 bg-white/20 rounded-full h-2">
                            <div className="bg-white h-2 rounded-full w-11/12"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Quick Actions */}
            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-blue-600" />
                    Quick Actions
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <button
                        onClick={() => navigate('/broker/create-load')}
                        className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-200 text-center group"
                    >
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-200 transition-colors">
                            <Plus className="w-6 h-6 text-blue-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-700">Create Load</span>
                    </button>

                    <button
                        onClick={() => navigate('/broker/smart-load-match')}
                        className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-200 text-center group"
                    >
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-green-200 transition-colors">
                            <Edit className="w-6 h-6 text-green-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-700">Smart Match</span>
                    </button>

                    <button
                        onClick={() => navigate('/broker/carrier-match')}
                        className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-200 text-center group"
                    >
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-purple-200 transition-colors">
                            <Users className="w-6 h-6 text-purple-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-700">Carrier Match</span>
                    </button>

                    <button
                        onClick={() => navigate('/broker/reports')}
                        className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-200 text-center group"
                    >
                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-orange-200 transition-colors">
                            <Activity className="w-6 h-6 text-orange-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-700">Reports</span>
                    </button>
                </div>
            </section>

            {/* AI Assistant */}
            <AIAgent className="mb-8" />

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue per Customer */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-blue-600" />
                        Revenue per Customer
                    </h3>
                    <div className="space-y-4">
                        {revenuePerCustomer.map((customer, index) => {
                            const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500'];
                            const maxValue = Math.max(...revenuePerCustomer.map(c => c.value));
                            const percentage = (customer.value / maxValue) * 100;

                            return (
                                <div key={index} className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium text-gray-700">{customer.name}</span>
                                        <span className="text-sm font-semibold text-gray-900">
                      ${(customer.value / 1000).toFixed(0)}k
                    </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-6">
                                        <div
                                            className={`${colors[index]} h-6 rounded-full flex items-center justify-end pr-2`}
                                            style={{ width: `${percentage}%` }}
                                        >
                      <span className="text-xs text-white font-medium">
                        ${(customer.value / 1000).toFixed(0)}k
                      </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Weekly Load Volume */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Package className="w-5 h-5 text-blue-600" />
                        Weekly Load Volume
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={weeklyLoadVolume}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis
                                dataKey="day"
                                tick={{ fontSize: 12 }}
                                axisLine={{ stroke: '#e5e7eb' }}
                            />
                            <YAxis
                                tick={{ fontSize: 12 }}
                                axisLine={{ stroke: '#e5e7eb' }}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#fff',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px',
                                    padding: '8px'
                                }}
                            />
                            <Bar
                                dataKey="loads"
                                fill="#10b981"
                                radius={[8, 8, 0, 0]}
                                animationDuration={1000}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Truck className="w-5 h-5 text-blue-600" />
                    Recent Loads
                </h3>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                        <tr className="border-b border-gray-200">
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Load ID</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Origin</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Destination</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Carrier</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Status</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Revenue</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                        <tr className="hover:bg-gray-50">
                            <td className="py-3 px-4 text-sm font-medium text-gray-900">BL-2024-001</td>
                            <td className="py-3 px-4 text-sm text-gray-600">Chicago, IL</td>
                            <td className="py-3 px-4 text-sm text-gray-600">Atlanta, GA</td>
                            <td className="py-3 px-4 text-sm text-gray-600">FastFreight Inc.</td>
                            <td className="py-3 px-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Delivered
                  </span>
                            </td>
                            <td className="py-3 px-4 text-sm font-medium text-gray-900">$2,450</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                            <td className="py-3 px-4 text-sm font-medium text-gray-900">BL-2024-002</td>
                            <td className="py-3 px-4 text-sm text-gray-600">Dallas, TX</td>
                            <td className="py-3 px-4 text-sm text-gray-600">Phoenix, AZ</td>
                            <td className="py-3 px-4 text-sm text-gray-600">Southwest Carriers</td>
                            <td className="py-3 px-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    In Transit
                  </span>
                            </td>
                            <td className="py-3 px-4 text-sm font-medium text-gray-900">$1,890</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                            <td className="py-3 px-4 text-sm font-medium text-gray-900">BL-2024-003</td>
                            <td className="py-3 px-4 text-sm text-gray-600">Miami, FL</td>
                            <td className="py-3 px-4 text-sm text-gray-600">Charlotte, NC</td>
                            <td className="py-3 px-4 text-sm text-gray-600">East Coast Logistics</td>
                            <td className="py-3 px-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Pending
                  </span>
                            </td>
                            <td className="py-3 px-4 text-sm font-medium text-gray-900">$2,150</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
