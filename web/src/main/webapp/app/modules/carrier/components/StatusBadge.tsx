import React from 'react';

type LoadStatus = 'Booked' | 'Assigned' | 'Picked Up' | 'Delivered' | 'Cancelled';
type InvoiceStatus = 'Pending' | 'Paid' | 'Overdue' | 'Processing';
type DriverStatus = 'Available' | 'On Route' | 'Off Duty' | 'On Break';
type ShipmentStatus = 'On Time' | 'Delayed' | 'At Risk' | 'Delivered';

type Status = LoadStatus | InvoiceStatus | DriverStatus | ShipmentStatus;

interface StatusBadgeProps {
  status: Status;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  size = 'md',
  className = '' 
}) => {
  const getStatusStyles = (status: Status): string => {
    const statusMap: Record<Status, string> = {
      // Load statuses
      'Delivered': 'bg-green-100 text-green-800',
      'Picked Up': 'bg-blue-100 text-blue-800',
      'Assigned': 'bg-yellow-100 text-yellow-800',
      'Booked': 'bg-gray-100 text-gray-800',
      'Cancelled': 'bg-red-100 text-red-800',
      
      // Invoice statuses
      'Paid': 'bg-green-100 text-green-800',
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Overdue': 'bg-red-100 text-red-800',
      'Processing': 'bg-blue-100 text-blue-800',
      
      // Driver statuses
      'Available': 'bg-green-100 text-green-800',
      'On Route': 'bg-blue-100 text-blue-800',
      'Off Duty': 'bg-gray-100 text-gray-800',
      'On Break': 'bg-yellow-100 text-yellow-800',
      
      // Shipment statuses
      'On Time': 'bg-green-100 text-green-800',
      'Delayed': 'bg-red-100 text-red-800',
      'At Risk': 'bg-orange-100 text-orange-800',
    };

    return statusMap[status] || 'bg-gray-100 text-gray-800';
  };

  const getSizeStyles = (size: 'sm' | 'md' | 'lg'): string => {
    switch (size) {
      case 'sm':
        return 'px-2 py-0.5 text-xs';
      case 'lg':
        return 'px-3 py-1.5 text-sm';
      default:
        return 'px-2.5 py-1 text-xs';
    }
  };

  return (
    <span 
      className={`inline-flex items-center font-medium rounded-full ${getStatusStyles(status)} ${getSizeStyles(size)} ${className}`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;