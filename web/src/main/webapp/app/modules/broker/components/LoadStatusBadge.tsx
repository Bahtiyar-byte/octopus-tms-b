import React from 'react';

type LoadStatus = 'draft' | 'posted' | 'assigned' | 'en_route' | 'delivered' | 'awaiting_docs' | 'paid';

interface LoadStatusBadgeProps {
  status: LoadStatus;
  className?: string;
}

const LoadStatusBadge: React.FC<LoadStatusBadgeProps> = ({ status, className = '' }) => {
  // Define colors for each status
  const statusColors: Record<LoadStatus, { bg: string; text: string }> = {
    draft: { bg: 'bg-gray-200', text: 'text-gray-800' },
    posted: { bg: 'bg-blue-100', text: 'text-blue-800' },
    assigned: { bg: 'bg-indigo-100', text: 'text-indigo-800' },
    en_route: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
    delivered: { bg: 'bg-green-100', text: 'text-green-800' },
    awaiting_docs: { bg: 'bg-orange-100', text: 'text-orange-800' },
    paid: { bg: 'bg-green-200', text: 'text-green-900' }
  };

  // Format status for display
  const formatStatus = (status: LoadStatus): string => {
    return status
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const { bg, text } = statusColors[status];

  return (
    <span 
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bg} ${text} ${className}`}
    >
      {formatStatus(status)}
    </span>
  );
};

export default LoadStatusBadge;