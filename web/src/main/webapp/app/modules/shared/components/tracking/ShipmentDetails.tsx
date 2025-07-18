import React from 'react';
import { Card } from '../../../../components';
import { Shipment, TimelineEvent } from '../../pages/Tracking/Tracking';
import { PageConfig } from '../../config/roleConfig';
import { getLoadStatusColor, formatLoadStatus } from '../../utils/loadUtils';

interface ShipmentDetailsProps {
  shipment: Shipment | undefined;
  timeline: TimelineEvent[];
  config: PageConfig;
  onAction: (action: string, data?: any) => void;
}

export const ShipmentDetails: React.FC<ShipmentDetailsProps> = ({
  shipment,
  timeline,
  config,
  onAction
}) => {
  if (!shipment) {
    return (
      <Card className="shadow-sm">
        <div className="p-6">
          <p className="text-gray-500">No shipment selected</p>
        </div>
      </Card>
    );
  }

  const progress = Math.round((shipment.distanceTraveled / shipment.distance) * 100);

  return (
    <>
      <h2 className="text-xl font-semibold flex items-center mb-4">
        <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
        Shipment Details
      </h2>

      <Card className="shadow-sm">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Load Information</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Load ID</div>
                      <div className="text-sm font-medium text-gray-900">{shipment.loadId}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Status</div>
                      <div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getLoadStatusColor(shipment.status)}`}>
                          {formatLoadStatus(shipment.status)}
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Origin</div>
                      <div className="text-sm font-medium text-gray-900">{shipment.origin}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Destination</div>
                      <div className="text-sm font-medium text-gray-900">{shipment.destination}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Driver</div>
                      <div className="text-sm font-medium text-gray-900">{shipment.driver}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Equipment</div>
                      <div className="text-sm font-medium text-gray-900">{shipment.equipment}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Delivery Information</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">ETA</div>
                      <div className="text-sm font-medium text-gray-900">{shipment.eta}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Current Location</div>
                      <div className="text-sm font-medium text-gray-900">{shipment.currentLocation}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Total Distance</div>
                      <div className="text-sm font-medium text-gray-900">{shipment.distance} miles</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Distance Traveled</div>
                      <div className="text-sm font-medium text-gray-900">{shipment.distanceTraveled} miles</div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex justify-between items-center text-xs text-gray-500 mb-1">
                      <span>Delivery Progress</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full ${
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
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Shipment Timeline</h3>
              <div className="relative pl-8 border-l-2 border-gray-200 space-y-6 py-2">
                {timeline.map((event) => (
                  <div key={event.id} className="relative">
                    <div className={`absolute -left-10 w-5 h-5 rounded-full flex items-center justify-center ${
                      event.status === 'completed' 
                        ? 'bg-green-500' 
                        : event.status === 'current'
                          ? 'bg-blue-500'
                          : 'bg-gray-300'
                    }`}>
                      {event.status === 'completed' ? (
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : event.status === 'current' ? (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      ) : (
                        <div className="w-2 h-2 bg-white rounded-full opacity-50"></div>
                      )}
                    </div>

                    <div className={`mb-1 font-medium ${
                      event.status === 'current' 
                        ? 'text-blue-600' 
                        : 'text-gray-900'
                    }`}>
                      {event.title}
                    </div>
                    <div className="text-sm text-gray-500">{event.timestamp}</div>
                    <div className="text-sm text-gray-600">{event.location}</div>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <div className="flex space-x-2">
                  {config.actions?.map((action, index) => (
                    <button
                      key={`${action.name}-${index}`}
                      className="btn btn-sm btn-outline-primary flex items-center"
                      onClick={() => onAction(action.handler || action.name, shipment)}
                    >
                      {getActionIcon(action.icon || action.name)}
                      <span className="ml-1 capitalize">{action.name.replace(/_/g, ' ')}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </>
  );
};

function getActionIcon(iconName: string): JSX.Element {
  const icons: Record<string, JSX.Element> = {
    phone: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
    contact: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    download: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    edit: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
    location: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    check: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    bell: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    )
  };
  
  return icons[iconName] || icons.contact;
}