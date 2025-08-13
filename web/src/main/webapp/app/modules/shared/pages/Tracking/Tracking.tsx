import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useRoleConfig } from '../../hooks/useRoleConfig';
import { TrackingMap } from '../../components/tracking/TrackingMap';
import { ShipmentList } from '../../components/tracking/ShipmentList';
import { ShipmentDetails } from '../../components/tracking/ShipmentDetails';
import { NotificationsList } from '../../components/tracking/NotificationsList';
import { Card } from '../../../../components';

// Fix Leaflet default icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

export interface LatLng {
  lat: number;
  lng: number;
}

export interface Shipment {
  id: string;
  loadId: string;
  origin: string;
  destination: string;
  driver: string;
  status: 'en_route' | 'delayed' | 'arriving_soon' | 'delivered';
  equipment: string;
  eta: string;
  distance: number;
  distanceTraveled: number;
  currentLocation: string;
  coordinates: {
    origin: LatLng;
    current: LatLng;
    destination: LatLng;
  };
}

export interface TimelineEvent {
  id: string;
  title: string;
  timestamp: string;
  location: string;
  status: 'completed' | 'current' | 'upcoming';
}

export interface Notification {
  id: string;
  time: string;
  loadId: string;
  type: 'location_update' | 'delay_alert' | 'status_change' | 'weather_alert';
  message: string;
}

const Tracking: React.FC = () => {
  const config = useRoleConfig('tracking');
  const [selectedShipmentId, setSelectedShipmentId] = useState<string>('1');
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [timelineEvents, setTimelineEvents] = useState<Record<string, TimelineEvent[]>>({});
  
  useEffect(() => {
    // In real app, fetch data based on role
    // For now, using mock data
    loadMockData();
  }, []);
  
  const loadMockData = () => {
    // Mock shipments data
    const mockShipments: Shipment[] = [
      {
        id: '1',
        loadId: 'LD-000103',
        origin: 'Miami, FL',
        destination: 'Atlanta, GA',
        driver: 'Robert Johnson',
        status: 'en_route',
        equipment: 'Reefer',
        eta: 'May 24, 2025 - 14:30',
        distance: 685,
        distanceTraveled: 425,
        currentLocation: 'Macon, GA',
        coordinates: {
          origin: { lat: 25.7617, lng: -80.1918 },
          current: { lat: 32.8407, lng: -83.6324 },
          destination: { lat: 33.7490, lng: -84.3880 }
        }
      },
      {
        id: '2',
        loadId: 'LD-000106',
        origin: 'San Francisco, CA',
        destination: 'Los Angeles, CA',
        driver: 'David Brown',
        status: 'delayed',
        equipment: 'Dry Van',
        eta: 'May 25, 2025 - 10:15',
        distance: 382,
        distanceTraveled: 150,
        currentLocation: 'Bakersfield, CA',
        coordinates: {
          origin: { lat: 37.7749, lng: -122.4194 },
          current: { lat: 35.3733, lng: -119.0187 },
          destination: { lat: 34.0522, lng: -118.2437 }
        }
      }
    ];
    
    const mockNotifications: Notification[] = [
      { id: '1', time: '10:45 AM', loadId: 'LD-000103', type: 'location_update', message: 'Truck arrived in Macon, GA' },
      { id: '2', time: '09:30 AM', loadId: 'LD-000106', type: 'delay_alert', message: 'Truck delayed due to traffic on I-5. ETA pushed by 45 min.' }
    ];
    
    const mockTimeline: Record<string, TimelineEvent[]> = {
      '1': [
        { id: '1', title: 'Departed Origin', timestamp: 'May 22, 2025 - 08:15', location: 'Miami, FL', status: 'completed' },
        { id: '2', title: 'Rest Stop', timestamp: 'May 22, 2025 - 15:30', location: 'Jacksonville, FL', status: 'completed' },
        { id: '3', title: 'Current Location', timestamp: 'May 23, 2025 - 10:45', location: 'Macon, GA', status: 'current' },
        { id: '4', title: 'Expected Arrival', timestamp: 'May 24, 2025 - 14:30', location: 'Atlanta, GA', status: 'upcoming' }
      ]
    };
    
    setShipments(mockShipments);
    setNotifications(mockNotifications);
    setTimelineEvents(mockTimeline);
  };
  
  const handleRefresh = () => {
    // Refreshing tracking data...
    loadMockData();
  };
  
  const handleAction = (action: string, data?: unknown) => {
    switch (action) {
      case 'refresh':
        handleRefresh();
        break;
      case 'contact':
        // Contacting driver/carrier...
        break;
      case 'update':
        // Updating status/location...
        break;
      case 'notify':
        // Notifying warehouse...
        break;
      case 'complete':
        // Marking as delivered...
        break;
      default:
        // Unknown action
    }
  };
  
  const selectedShipment = shipments.find(s => s.id === selectedShipmentId) || shipments[0];
  const shipmentTimeline = timelineEvents[selectedShipmentId] || [];
  
  return (
    <div className="fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{config.title || 'Load Tracking'}</h1>
          <p className="text-gray-600">Monitor real-time location of your shipments</p>
        </div>
        <div className="flex space-x-2">
          {config.actions?.map((action, index) => (
            <button
              key={`${action.name}-${index}`}
              className="btn btn-outline-primary flex items-center"
              onClick={() => handleAction(action.handler || action.name)}
            >
              {getActionIcon(action.icon || action.name)}
              <span className="ml-2 capitalize">{action.name.replace(/_/g, ' ')}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Map Section */}
      <TrackingMap
        shipments={shipments}
        selectedShipmentId={selectedShipmentId}
        onSelectShipment={setSelectedShipmentId}
      />

      {/* Shipments and Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        <div className="lg:col-span-4">
          <ShipmentList
            shipments={shipments}
            selectedShipmentId={selectedShipmentId}
            onSelectShipment={setSelectedShipmentId}
          />
        </div>

        <div className="lg:col-span-8">
          <ShipmentDetails
            shipment={selectedShipment}
            timeline={shipmentTimeline}
            config={config}
            onAction={handleAction}
          />
        </div>
      </div>

      {/* Notifications Section */}
      <NotificationsList
        notifications={notifications}
        shipments={shipments}
        onSelectShipment={setSelectedShipmentId}
      />

      {/* Mobile App Promo - can be configured per role */}
      {config.fields?.includes('mobilePromo') && (
        <div className="bg-blue-50 border border-blue-100 rounded-lg mt-8 p-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="flex">
              <div className="bg-blue-100 rounded-full p-2 text-blue-600 mr-3 shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-blue-800 mb-1">Get real-time updates on the go</h4>
                <p className="text-sm text-blue-600 mb-2 md:mb-0">Download our mobile app to track your shipments from anywhere.</p>
              </div>
            </div>
            <div className="mt-3 md:mt-0 flex flex-shrink-0 space-x-2">
              <button className="inline-flex items-center px-4 py-2 border border-blue-300 shadow-sm text-sm font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50">
                App Store
              </button>
              <button className="inline-flex items-center px-4 py-2 border border-blue-300 shadow-sm text-sm font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50">
                Google Play
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function getActionIcon(iconName: string): JSX.Element {
  const icons: Record<string, JSX.Element> = {
    refresh: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
    share: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m9.632 4.316C18.114 15.938 18 15.482 18 15c0-.482.114-.938.316-1.342m0 2.684a3 3 0 110-2.684M6.316 10.658a3 3 0 110 2.684" />
      </svg>
    ),
    phone: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
    contact: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
    bell: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
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
    )
  };
  
  return icons[iconName] || icons.refresh;
}

export default Tracking;