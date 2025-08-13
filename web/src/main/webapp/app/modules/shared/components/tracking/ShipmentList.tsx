import React, { useRef } from 'react';
import { Shipment } from '../../pages/Tracking/Tracking';
import { getLoadStatusColor, formatLoadStatus } from '../../../../utils/load/loadUtils';

interface ShipmentListProps {
  shipments: Shipment[];
  selectedShipmentId: string;
  onSelectShipment: (id: string) => void;
}

export const ShipmentList: React.FC<ShipmentListProps> = ({
  shipments,
  selectedShipmentId,
  onSelectShipment
}) => {
  const listRef = useRef<HTMLDivElement>(null);
  
  return (
    <>
      <h2 className="text-xl font-semibold flex items-center mb-4">
        <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
        </svg>
        Active Shipments ({shipments.length})
      </h2>

      <div 
        ref={listRef}
        className="space-y-3 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#d1d5db #f3f4f6'
        }}
      >
        {shipments.map(shipment => {
          const isSelected = shipment.id === selectedShipmentId;
          const progress = Math.round((shipment.distanceTraveled / shipment.distance) * 100);

          return (
            <div 
              key={shipment.id}
              className={`bg-white rounded-xl shadow-sm border overflow-hidden transition-all duration-300 cursor-pointer
                ${isSelected 
                  ? 'border-blue-300 ring-2 ring-blue-300 transform scale-[1.02] shadow-md' 
                  : 'border-gray-200 hover:border-blue-200 hover:shadow'}`}
              onClick={() => onSelectShipment(shipment.id)}
            >
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-900">
                    {shipment.loadId}: {shipment.origin} → {shipment.destination}
                  </h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getLoadStatusColor(shipment.status)}`}>
                    {formatLoadStatus(shipment.status)}
                  </span>
                </div>

                <div className="text-sm text-gray-600 mb-3">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>Driver: {shipment.driver}</span>
                  </div>
                </div>

                <div className="mt-1">
                  <div className="flex justify-between items-center text-xs text-gray-500 mb-1">
                    <span>{shipment.currentLocation}</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className={`h-1.5 rounded-full ${
                        shipment.status === 'delayed' 
                          ? 'bg-red-500' 
                          : shipment.status === 'arriving_soon'
                            ? 'bg-green-500'
                            : 'bg-blue-500'
                      }`} 
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};