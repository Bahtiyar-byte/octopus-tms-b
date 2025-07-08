import React from 'react';

interface RouteDisplayProps {
  origin: string;
  destination: string;
  stops?: string[];
  distance?: number;
  duration?: string;
  className?: string;
  showArrow?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const RouteDisplay: React.FC<RouteDisplayProps> = ({
  origin,
  destination,
  stops = [],
  distance,
  duration,
  className = '',
  showArrow = true,
  size = 'md'
}) => {
  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'text-sm';
      case 'lg':
        return 'text-lg';
      default:
        return 'text-base';
    }
  };

  return (
    <div className={`flex flex-col ${className}`}>
      <div className={`flex items-center ${getSizeStyles()}`}>
        <div className="flex items-center">
          <svg className="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="font-medium text-gray-900">{origin}</span>
        </div>
        
        {showArrow && (
          <svg className="w-5 h-5 mx-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        )}
        
        {stops.length > 0 && showArrow && (
          <>
            {stops.map((stop, index) => (
              <React.Fragment key={index}>
                <div className="flex items-center">
                  <svg className="w-3 h-3 mr-1 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-600">{stop}</span>
                </div>
                <svg className="w-5 h-5 mx-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </React.Fragment>
            ))}
          </>
        )}
        
        <div className="flex items-center">
          <svg className="w-4 h-4 mr-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="font-medium text-gray-900">{destination}</span>
        </div>
      </div>
      
      {(distance || duration) && (
        <div className="flex items-center mt-1 text-sm text-gray-500 ml-6">
          {distance && (
            <span className="flex items-center">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 9m0 0L9 12m6-3v13" />
              </svg>
              {distance} miles
            </span>
          )}
          {distance && duration && <span className="mx-2">•</span>}
          {duration && (
            <span className="flex items-center">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {duration}
            </span>
          )}
        </div>
      )}
      
      {!showArrow && stops.length === 0 && (
        <div className="flex items-center mt-1">
          <span className="text-gray-900">{origin}</span>
          <span className="mx-2 text-gray-400">→</span>
          <span className="text-gray-900">{destination}</span>
        </div>
      )}
    </div>
  );
};

export default RouteDisplay;