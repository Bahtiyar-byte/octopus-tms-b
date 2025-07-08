import React from 'react';

type LoadStatus = 'draft' | 'posted' | 'assigned' | 'en_route' | 'delivered' | 'awaiting_docs' | 'paid';

interface LoadProgressTrackerProps {
  currentStatus: LoadStatus;
  className?: string;
}

const LoadProgressTracker: React.FC<LoadProgressTrackerProps> = ({ 
  currentStatus, 
  className = '' 
}) => {
  // Define all statuses in order
  const statuses: LoadStatus[] = [
    'draft',
    'posted',
    'assigned',
    'en_route',
    'delivered',
    'awaiting_docs',
    'paid'
  ];

  // Get the index of the current status
  const currentIndex = statuses.indexOf(currentStatus);

  // Format status for display
  const formatStatus = (status: LoadStatus): string => {
    return status
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className={`flex items-center w-full ${className}`}>
      {statuses.map((status, index) => {
        // Determine if this status is active, completed, or upcoming
        const isActive = status === currentStatus;
        const isCompleted = index < currentIndex;
        const isUpcoming = index > currentIndex;

        // Set colors based on status
        let circleClasses = 'w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium';
        let lineClasses = 'h-1 flex-1';
        
        if (isActive) {
          circleClasses += ' bg-blue-600 text-white';
        } else if (isCompleted) {
          circleClasses += ' bg-green-500 text-white';
        } else {
          circleClasses += ' bg-gray-200 text-gray-500';
        }

        if (isCompleted) {
          lineClasses += ' bg-green-500';
        } else {
          lineClasses += ' bg-gray-200';
        }

        return (
          <React.Fragment key={status}>
            <div className="flex flex-col items-center">
              <div className={circleClasses}>
                {isCompleted ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              <span className={`text-xs mt-1 ${isActive ? 'font-medium text-blue-600' : 'text-gray-500'}`}>
                {formatStatus(status)}
              </span>
            </div>
            
            {/* Don't render a line after the last item */}
            {index < statuses.length - 1 && (
              <div className={lineClasses}></div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default LoadProgressTracker;