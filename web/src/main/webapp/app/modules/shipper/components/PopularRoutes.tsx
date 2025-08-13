import React from 'react';
import { TrendingUp, Package, DollarSign, Users } from 'lucide-react';
import { formatCurrency } from '../../../utils';

interface RouteData {
  id: string;
  origin: string;
  destination: string;
  revenue: number;
  shipmentCount: number;
  commodities: string[];
  topBroker: string;
  topCarrier: string;
  avgRate: number;
}

const PopularRoutes: React.FC = () => {
  // Mock data for popular routes
  const popularRoutes: RouteData[] = [
    {
      id: '1',
      origin: 'Chicago, IL',
      destination: 'Detroit, MI',
      revenue: 145000,
      shipmentCount: 42,
      commodities: ['Aluminum Coils', 'Steel Sheets'],
      topBroker: 'ABC Logistics',
      topCarrier: 'Swift Transportation',
      avgRate: 3452
    },
    {
      id: '2',
      origin: 'Hammond, IN',
      destination: 'Nashville, TN',
      revenue: 98000,
      shipmentCount: 28,
      commodities: ['Aluminum Ingots', 'Metal Parts'],
      topBroker: 'XYZ Freight',
      topCarrier: 'JB Hunt',
      avgRate: 3500
    },
    {
      id: '3',
      origin: 'Beech Bottom, WV',
      destination: 'Atlanta, GA',
      revenue: 125000,
      shipmentCount: 35,
      commodities: ['Aluminum Billets', 'Raw Materials'],
      topBroker: 'Prime Logistics',
      topCarrier: 'Werner Enterprises',
      avgRate: 3571
    },
    {
      id: '4',
      origin: 'Fairland, IN',
      destination: 'Dallas, TX',
      revenue: 176000,
      shipmentCount: 45,
      commodities: ['Finished Aluminum Products'],
      topBroker: 'Elite Transport',
      topCarrier: 'Schneider National',
      avgRate: 3911
    }
  ];


  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">Popular Routes</h2>
        <TrendingUp className="w-5 h-5 text-green-500" />
      </div>

      <div className="space-y-4">
        {popularRoutes.map((route) => (
          <div key={route.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-gray-800">
                  {route.origin} → {route.destination}
                </h3>
                <p className="text-sm text-gray-500">{route.shipmentCount} shipments</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-green-600">{formatCurrency(route.revenue)}</p>
                <p className="text-sm text-gray-500">Avg: {formatCurrency(route.avgRate)}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Package className="w-4 h-4 text-gray-400" />
                  <span className="font-medium">Commodities:</span>
                </div>
                <p className="text-gray-600 text-xs">{route.commodities.join(', ')}</p>
              </div>
              
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span className="font-medium">Partners:</span>
                </div>
                <p className="text-gray-600 text-xs">
                  Broker: {route.topBroker}<br />
                  Carrier: {route.topCarrier}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="mt-4 w-full py-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
        View All Routes →
      </button>
    </div>
  );
};

export default PopularRoutes;