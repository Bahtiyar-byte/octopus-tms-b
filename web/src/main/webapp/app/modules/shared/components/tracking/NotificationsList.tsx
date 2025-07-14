import React from 'react';
import { Card } from '../../../../components';
import { Notification, Shipment } from '../../pages/Tracking/Tracking';

interface NotificationsListProps {
  notifications: Notification[];
  shipments: Shipment[];
  onSelectShipment: (id: string) => void;
}

export const NotificationsList: React.FC<NotificationsListProps> = ({
  notifications,
  shipments,
  onSelectShipment
}) => {
  const getNotificationTypeBadgeClass = (type: string) => {
    switch(type) {
      case 'location_update':
        return 'bg-blue-100 text-blue-800';
      case 'delay_alert':
        return 'bg-red-100 text-red-800';
      case 'status_change':
        return 'bg-green-100 text-green-800';
      case 'weather_alert':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getNotificationTypeLabel = (type: string) => {
    switch(type) {
      case 'location_update':
        return 'Location Update';
      case 'delay_alert':
        return 'Delay Alert';
      case 'status_change':
        return 'Status Change';
      case 'weather_alert':
        return 'Weather Alert';
      default:
        return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
  };

  const handleViewNotification = (loadId: string) => {
    const shipment = shipments.find(s => s.loadId === loadId);
    if (shipment) {
      onSelectShipment(shipment.id);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold flex items-center mb-4">
        <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        Recent Notifications
      </h2>

      <Card className="shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Load
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Message
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {notifications.map((notification) => (
                <tr key={notification.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {notification.time}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                    {notification.loadId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getNotificationTypeBadgeClass(notification.type)}`}>
                      {getNotificationTypeLabel(notification.type)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {notification.message}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      className="btn-sm btn-outline-primary"
                      onClick={() => handleViewNotification(notification.loadId)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 text-sm">
          <div className="flex justify-between items-center">
            <div>
              Showing <span className="font-medium">{notifications.length}</span> of <span className="font-medium">{notifications.length}</span> notifications
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50">
                View All
              </button>
              <button className="px-3 py-1 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Mark All as Read
              </button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};