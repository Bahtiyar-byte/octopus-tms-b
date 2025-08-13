import React, { type ReactNode } from 'react';

interface CardProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ title, children, className = '' }) => {
  return (
      <div className={`bg-white rounded-lg shadow-sm overflow-hidden ${className}`}>
        {title && (
            <div className="border-b px-4 py-3">
              <h5 className="font-medium text-gray-700">{title}</h5>
            </div>
        )}
        <div className="p-4">
          {children}
        </div>
      </div>
  );
};

export default Card;