import React from 'react';
import { formatDateTime } from '../../../../../utils/format';

interface ActivityWidgetProps {
  id: string;
  title: string;
  size?: string;
  props?: Record<string, any>;
}

export const ActivityWidget: React.FC<ActivityWidgetProps> = ({ title }) => {
  // Mock activity data
  const activities = [
    { id: 1, type: 'load_created', message: 'New load created: LD-000123', timestamp: new Date().toISOString(), icon: '📦' },
    { id: 2, type: 'carrier_assigned', message: 'Carrier assigned to LD-000122', timestamp: new Date(Date.now() - 3600000).toISOString(), icon: '🚚' },
    { id: 3, type: 'delivery_completed', message: 'Load LD-000121 delivered', timestamp: new Date(Date.now() - 7200000).toISOString(), icon: '✅' },
    { id: 4, type: 'payment_received', message: 'Payment received for INV-2024-089', timestamp: new Date(Date.now() - 10800000).toISOString(), icon: '💰' },
  ];
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {title}
      </h3>
      <div className="space-y-3">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="text-2xl">{activity.icon}</div>
            <div className="flex-1">
              <p className="text-sm text-gray-700">{activity.message}</p>
              <p className="text-xs text-gray-500 mt-1">{formatDateTime(activity.timestamp)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};