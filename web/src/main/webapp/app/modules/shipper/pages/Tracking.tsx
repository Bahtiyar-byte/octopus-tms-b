import React, { useState, useEffect, useRef } from 'react';
import { Card } from '../../../components';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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

interface LatLng {
  lat: number;
  lng: number;
}

interface Shipment {
  id: string;
  loadId: string;
  origin: string;
  destination: string;
  driver: string;
  brokerName: string;
  brokerCompany: string;
  brokerPhone: string;
  brokerEmail: string;
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

interface TimelineEvent {
  id: string;
  title: string;
  timestamp: string;
  location: string;
  status: 'completed' | 'current' | 'upcoming';
}

const Tracking: React.FC = () => {
  const [selectedShipmentId, setSelectedShipmentId] = useState<string>('1');
  const activeShipmentsRef = useRef<HTMLDivElement>(null);

  const shipments: Shipment[] = [
    {
      id: '1',
      loadId: 'LD1003',
      origin: 'Miami, FL',
      destination: 'Atlanta, GA',
      driver: 'Robert Johnson',
      brokerName: 'Sarah Thompson',
      brokerCompany: 'Express Logistics LLC',
      brokerPhone: '(555) 123-4567',
      brokerEmail: 'sarah.thompson@expresslogistics.com',
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
      loadId: 'LD1006',
      origin: 'San Francisco, CA',
      destination: 'Los Angeles, CA',
      driver: 'David Brown',
      brokerName: 'Michael Chen',
      brokerCompany: 'Pacific Transport Solutions',
      brokerPhone: '(555) 234-5678',
      brokerEmail: 'michael.chen@pacifictransport.com',
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
    },
    {
      id: '3',
      loadId: 'LD1007',
      origin: 'Denver, CO',
      destination: 'Phoenix, AZ',
      driver: 'John Smith',
      brokerName: 'Emily Rodriguez',
      brokerCompany: 'Mountain View Freight',
      brokerPhone: '(555) 345-6789',
      brokerEmail: 'emily.rodriguez@mountainviewfreight.com',
      status: 'arriving_soon',
      equipment: 'Flatbed',
      eta: 'May 23, 2025 - 16:45',
      distance: 865,
      distanceTraveled: 820,
      currentLocation: 'Flagstaff, AZ',
      coordinates: {
        origin: { lat: 39.7392, lng: -104.9903 },
        current: { lat: 35.1983, lng: -111.6513 },
        destination: { lat: 33.4484, lng: -112.0740 }
      }
    },
    {
      id: '4',
      loadId: 'LD1002',
      origin: 'Dallas, TX',
      destination: 'Houston, TX',
      driver: 'Maria Garcia',
      brokerName: 'James Wilson',
      brokerCompany: 'Texas Star Logistics',
      brokerPhone: '(555) 456-7890',
      brokerEmail: 'james.wilson@texasstarlogistics.com',
      status: 'en_route',
      equipment: 'Dry Van',
      eta: 'May 23, 2025 - 18:30',
      distance: 240,
      distanceTraveled: 90,
      currentLocation: 'Corsicana, TX',
      coordinates: {
        origin: { lat: 32.7767, lng: -96.7970 },
        current: { lat: 32.0954, lng: -96.4688 },
        destination: { lat: 29.7604, lng: -95.3698 }
      }
    },
    {
      id: '5',
      loadId: 'LD1008',
      origin: 'Chicago, IL',
      destination: 'Detroit, MI',
      driver: 'William Davis',
      brokerName: 'Jennifer Anderson',
      brokerCompany: 'Midwest Express Inc',
      brokerPhone: '(555) 567-8901',
      brokerEmail: 'jennifer.anderson@midwestexpress.com',
      status: 'en_route',
      equipment: 'Reefer',
      eta: 'May 24, 2025 - 09:00',
      distance: 280,
      distanceTraveled: 195,
      currentLocation: 'Kalamazoo, MI',
      coordinates: {
        origin: { lat: 41.8781, lng: -87.6298 },
        current: { lat: 42.2917, lng: -85.5872 },
        destination: { lat: 42.3314, lng: -83.0458 }
      }
    },
    {
      id: '6',
      loadId: 'LD1009',
      origin: 'Seattle, WA',
      destination: 'Portland, OR',
      driver: 'Linda Martinez',
      brokerName: 'Robert Taylor',
      brokerCompany: 'Northwest Carriers',
      brokerPhone: '(555) 678-9012',
      brokerEmail: 'robert.taylor@northwestcarriers.com',
      status: 'arriving_soon',
      equipment: 'Flatbed',
      eta: 'May 23, 2025 - 15:00',
      distance: 173,
      distanceTraveled: 165,
      currentLocation: 'Olympia, WA',
      coordinates: {
        origin: { lat: 47.6062, lng: -122.3321 },
        current: { lat: 47.0379, lng: -122.9007 },
        destination: { lat: 45.5152, lng: -122.6784 }
      }
    }
  ];

  const notifications = [
    { id: '1', time: '10:45 AM', loadId: 'LD1003', type: 'location_update', message: 'Your shipment has arrived in Macon, GA' },
    { id: '2', time: '09:30 AM', loadId: 'LD1006', type: 'delay_alert', message: 'Shipment delayed due to traffic on I-5. ETA updated by 45 min.' },
    { id: '3', time: '08:15 AM', loadId: 'LD1007', type: 'status_change', message: 'Your shipment is entering final delivery zone. Expected arrival soon.' },
    { id: '4', time: 'Yesterday', loadId: 'LD1002', type: 'weather_alert', message: 'Heavy rain expected along route. Broker has been notified.' }
  ];

  const timelineEvents: Record<string, TimelineEvent[]> = {
    '1': [
      { id: '1', title: 'Pickup Complete', timestamp: 'May 22, 2025 - 08:15', location: 'Miami, FL', status: 'completed' },
      { id: '2', title: 'Rest Stop', timestamp: 'May 22, 2025 - 15:30', location: 'Jacksonville, FL', status: 'completed' },
      { id: '3', title: 'Current Location', timestamp: 'May 23, 2025 - 10:45', location: 'Macon, GA', status: 'current' },
      { id: '4', title: 'Expected Delivery', timestamp: 'May 24, 2025 - 14:30', location: 'Atlanta, GA', status: 'upcoming' }
    ],
    '2': [
      { id: '1', title: 'Pickup Complete', timestamp: 'May 22, 2025 - 09:30', location: 'San Francisco, CA', status: 'completed' },
      { id: '2', title: 'Rest Stop', timestamp: 'May 22, 2025 - 16:45', location: 'San Jose, CA', status: 'completed' },
      { id: '3', title: 'Delay Reported', timestamp: 'May 23, 2025 - 09:15', location: 'Bakersfield, CA', status: 'current' },
      { id: '4', title: 'Expected Delivery', timestamp: 'May 25, 2025 - 10:15', location: 'Los Angeles, CA', status: 'upcoming' }
    ],
    '3': [
      { id: '1', title: 'Pickup Complete', timestamp: 'May 21, 2025 - 07:30', location: 'Denver, CO', status: 'completed' },
      { id: '2', title: 'Rest Stop', timestamp: 'May 21, 2025 - 18:15', location: 'Albuquerque, NM', status: 'completed' },
      { id: '3', title: 'Current Location', timestamp: 'May 23, 2025 - 08:30', location: 'Flagstaff, AZ', status: 'current' },
      { id: '4', title: 'Expected Delivery', timestamp: 'May 23, 2025 - 16:45', location: 'Phoenix, AZ', status: 'upcoming' }
    ],
    '4': [
      { id: '1', title: 'Pickup Complete', timestamp: 'May 23, 2025 - 10:00', location: 'Dallas, TX', status: 'completed' },
      { id: '2', title: 'Current Location', timestamp: 'May 23, 2025 - 11:45', location: 'Corsicana, TX', status: 'current' },
      { id: '3', title: 'Expected Delivery', timestamp: 'May 23, 2025 - 18:30', location: 'Houston, TX', status: 'upcoming' }
    ],
    '5': [
      { id: '1', title: 'Pickup Complete', timestamp: 'May 23, 2025 - 06:00', location: 'Chicago, IL', status: 'completed' },
      { id: '2', title: 'Current Location', timestamp: 'May 23, 2025 - 12:00', location: 'Kalamazoo, MI', status: 'current' },
      { id: '3', title: 'Expected Delivery', timestamp: 'May 24, 2025 - 09:00', location: 'Detroit, MI', status: 'upcoming' }
    ],
    '6': [
      { id: '1', title: 'Pickup Complete', timestamp: 'May 23, 2025 - 08:00', location: 'Seattle, WA', status: 'completed' },
      { id: '2', title: 'Current Location', timestamp: 'May 23, 2025 - 12:30', location: 'Olympia, WA', status: 'current' },
      { id: '3', title: 'Expected Delivery', timestamp: 'May 23, 2025 - 15:00', location: 'Portland, OR', status: 'upcoming' }
    ]
  };

  const selectedShipment = shipments.find(s => s.id === selectedShipmentId) || shipments[0];
  const shipmentTimeline = timelineEvents[selectedShipmentId] || timelineEvents['1'];

  const getStatusBadgeClass = (status: string) => {
    switch(status) {
      case 'en_route':
        return 'bg-blue-100 text-blue-800';
      case 'delayed':
        return 'bg-red-100 text-red-800';
      case 'arriving_soon':
        return 'bg-green-100 text-green-800';
      case 'delivered':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

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

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'en_route':
        return 'En Route';
      case 'delayed':
        return 'Delayed';
      case 'arriving_soon':
        return 'Arriving Soon';
      case 'delivered':
        return 'Delivered';
      default:
        return status;
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
        return type;
    }
  };

  // Component to dynamically fit bounds based on all shipments
  const DynamicMapBounds = ({ shipments }: { shipments: Shipment[] }) => {
    const map = useMap();

    useEffect(() => {
      if (shipments.length > 0) {
        const bounds = L.latLngBounds([]);
        
        // Add all coordinates to bounds
        shipments.forEach(shipment => {
          bounds.extend([shipment.coordinates.origin.lat, shipment.coordinates.origin.lng]);
          bounds.extend([shipment.coordinates.current.lat, shipment.coordinates.current.lng]);
          bounds.extend([shipment.coordinates.destination.lat, shipment.coordinates.destination.lng]);
        });

        // Fit the map to show all points
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }, [map, shipments]);

    return null;
  };

  // Get marker color based on status
  const getMarkerColor = (status: string) => {
    switch(status) {
      case 'en_route':
        return 'blue';
      case 'delayed':
        return 'red';
      case 'arriving_soon':
        return 'green';
      case 'delivered':
        return 'purple';
      default:
        return 'gray';
    }
  };

  // Create custom marker icons
  const createIcon = (color: string) => {
    return L.divIcon({
      className: `bg-${color}-500 rounded-full border-2 border-white shadow-md`,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
      html: `<div class="w-full h-full"></div>`
    });
  };

  return (
    <div className="fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Shipment Tracking</h1>
          <p className="text-gray-600">Monitor real-time location of your shipments</p>
        </div>
        <div className="flex space-x-2">
          <button className="btn btn-outline-primary flex items-center">
            <i className="fas fa-sync-alt mr-2"></i>
            Refresh Data
          </button>
          <button className="btn btn-outline-secondary flex items-center">
            <i className="fas fa-bell mr-2"></i>
            Notifications
          </button>
        </div>
      </div>

      <Card className="mb-8 shadow-md overflow-hidden">
        <div className="relative h-96 w-full">
          <MapContainer 
            center={[39.8283, -98.5795]} // Center of USA
            zoom={4} 
            style={{ height: '100%', width: '100%', zIndex: 0 }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Dynamically fit bounds to show all shipments */}
            <DynamicMapBounds shipments={shipments} />

            {/* Show all shipments on map */}
            {shipments.map(shipment => {
              const color = getMarkerColor(shipment.status);
              const isSelected = shipment.id === selectedShipmentId;
              const originIcon = L.divIcon({
                className: `bg-gray-100 rounded-full border-2 border-${color}-500 shadow-md flex items-center justify-center`,
                iconSize: [24, 24],
                iconAnchor: [12, 12],
                html: `<div class="flex items-center justify-center w-full h-full">
                  <div class="w-2 h-2 bg-${color}-500 rounded-full"></div>
                </div>`
              });

              const destinationIcon = L.divIcon({
                className: `bg-gray-100 rounded-full border-2 border-${color}-500 shadow-md flex items-center justify-center`,
                iconSize: [24, 24],
                iconAnchor: [12, 12],
                html: `<div class="flex items-center justify-center w-full h-full">
                  <div class="w-3 h-3 bg-${color}-500 rounded-full"></div>
                </div>`
              });

              const currentIcon = L.divIcon({
                className: `bg-${color}-500 rounded-full border-2 border-white shadow-md flex items-center justify-center`,
                iconSize: [isSelected ? 32 : 24, isSelected ? 32 : 24],
                iconAnchor: [isSelected ? 16 : 12, isSelected ? 16 : 12],
                html: `<div class="flex items-center justify-center w-full h-full text-white">
                  <i class="fas fa-truck-moving text-xs"></i>
                </div>`
              });

              return (
                <React.Fragment key={shipment.id}>
                  {/* Origin marker */}
                  <Marker 
                    position={[shipment.coordinates.origin.lat, shipment.coordinates.origin.lng]} 
                    icon={originIcon}
                    eventHandlers={{
                      click: () => setSelectedShipmentId(shipment.id)
                    }}
                  >
                    <Popup>
                      <div>
                        <div className="font-semibold">{shipment.origin}</div>
                        <div className="text-xs text-gray-500">Origin</div>
                      </div>
                    </Popup>
                  </Marker>

                  {/* Current location marker */}
                  <Marker 
                    position={[shipment.coordinates.current.lat, shipment.coordinates.current.lng]} 
                    icon={currentIcon}
                    eventHandlers={{
                      click: () => setSelectedShipmentId(shipment.id)
                    }}
                  >
                    <Popup>
                      <div>
                        <div className="font-semibold">{shipment.loadId}</div>
                        <div className="text-sm">{shipment.currentLocation}</div>
                        <div className="text-xs text-gray-500">Driver: {shipment.driver}</div>
                        <div className="text-xs text-gray-500">Status: {getStatusLabel(shipment.status)}</div>
                      </div>
                    </Popup>
                  </Marker>

                  {/* Destination marker */}
                  <Marker 
                    position={[shipment.coordinates.destination.lat, shipment.coordinates.destination.lng]} 
                    icon={destinationIcon}
                    eventHandlers={{
                      click: () => setSelectedShipmentId(shipment.id)
                    }}
                  >
                    <Popup>
                      <div>
                        <div className="font-semibold">{shipment.destination}</div>
                        <div className="text-xs text-gray-500">Destination</div>
                        <div className="text-xs text-gray-500">ETA: {shipment.eta}</div>
                      </div>
                    </Popup>
                  </Marker>

                  {/* Route from origin to current */}
                  <Polyline 
                    positions={[
                      [shipment.coordinates.origin.lat, shipment.coordinates.origin.lng],
                      [shipment.coordinates.current.lat, shipment.coordinates.current.lng]
                    ]} 
                    color={color}
                    weight={isSelected ? 4 : 3}
                    opacity={isSelected ? 0.8 : 0.5}
                  />

                  {/* Route from current to destination */}
                  <Polyline 
                    positions={[
                      [shipment.coordinates.current.lat, shipment.coordinates.current.lng],
                      [shipment.coordinates.destination.lat, shipment.coordinates.destination.lng]
                    ]} 
                    color={color}
                    weight={isSelected ? 4 : 3}
                    opacity={isSelected ? 0.5 : 0.3}
                    dashArray="5, 10"
                  />
                </React.Fragment>
              );
            })}
          </MapContainer>

          {/* Map overlay elements */}
          <div className="absolute top-4 right-4 bg-white shadow-md rounded-lg p-2 z-10">
            <div className="flex items-center space-x-3 text-xs text-gray-600">
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-blue-500 mr-1"></div>
                <span>En Route</span>
              </div>
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-red-500 mr-1"></div>
                <span>Delayed</span>
              </div>
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-green-500 mr-1"></div>
                <span>Arriving</span>
              </div>
            </div>
          </div>

          <div className="absolute bottom-4 left-4 bg-white shadow-md rounded-lg p-2 z-10">
            <div className="text-xs text-gray-500">
              Last Updated: 12:45 PM - May 23, 2025
            </div>
          </div>

          <div className="absolute top-4 left-4 z-10 flex space-x-2">
            <button className="btn btn-sm bg-white shadow-md hover:bg-gray-50 flex items-center">
              <i className="fas fa-truck mr-1"></i>
              Show All
            </button>
            <button className="btn btn-sm bg-white shadow-md hover:bg-gray-50 flex items-center">
              <i className="fas fa-layer-group mr-1"></i>
              Layers
            </button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        <div className="lg:col-span-4">
          <h2 className="text-xl font-semibold flex items-center mb-4">
            <i className="fas fa-truck-moving mr-2 text-blue-600"></i>
            Active Shipments ({shipments.length})
          </h2>

          {/* Scrollable container showing 3 cards */}
          <div 
            ref={activeShipmentsRef}
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
                  onClick={() => setSelectedShipmentId(shipment.id)}
                >
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900">{shipment.loadId}: {shipment.origin} → {shipment.destination}</h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                        ${getStatusBadgeClass(shipment.status)}`}>
                        {getStatusLabel(shipment.status)}
                      </span>
                    </div>

                    <div className="text-sm text-gray-600 mb-3">
                      <div className="flex items-center">
                        <i className="fas fa-building mr-1 text-gray-400"></i>
                        <span>Broker: {shipment.brokerName}</span>
                      </div>
                    </div>

                    <div className="mt-1">
                      <div className="flex justify-between items-center text-xs text-gray-500 mb-1">
                        <span>{shipment.currentLocation}</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div className={`h-1.5 rounded-full ${
                          shipment.status === 'delayed' 
                            ? 'bg-red-500' 
                            : shipment.status === 'arriving_soon'
                              ? 'bg-green-500'
                              : 'bg-blue-500'
                        }`} style={{ width: `${progress}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-8">
          <h2 className="text-xl font-semibold flex items-center mb-4">
            <i className="fas fa-boxes mr-2 text-blue-600"></i>
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
                          <div className="text-sm font-medium text-gray-900">{selectedShipment.loadId}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Status</div>
                          <div>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(selectedShipment.status)}`}>
                              {getStatusLabel(selectedShipment.status)}
                            </span>
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Origin</div>
                          <div className="text-sm font-medium text-gray-900">{selectedShipment.origin}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Destination</div>
                          <div className="text-sm font-medium text-gray-900">{selectedShipment.destination}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Driver</div>
                          <div className="text-sm font-medium text-gray-900">{selectedShipment.driver}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Equipment</div>
                          <div className="text-sm font-medium text-gray-900">{selectedShipment.equipment}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Broker Information</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="space-y-3">
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Broker Name</div>
                          <div className="text-sm font-medium text-gray-900">{selectedShipment.brokerName}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Company</div>
                          <div className="text-sm font-medium text-gray-900">{selectedShipment.brokerCompany}</div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-xs text-gray-500 mb-1">Phone</div>
                            <div className="text-sm font-medium text-gray-900">{selectedShipment.brokerPhone}</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 mb-1">Email</div>
                            <div className="text-sm font-medium text-gray-900 truncate">{selectedShipment.brokerEmail}</div>
                          </div>
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
                          <div className="text-sm font-medium text-gray-900">{selectedShipment.eta}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Current Location</div>
                          <div className="text-sm font-medium text-gray-900">{selectedShipment.currentLocation}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Total Distance</div>
                          <div className="text-sm font-medium text-gray-900">{selectedShipment.distance} miles</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Distance Traveled</div>
                          <div className="text-sm font-medium text-gray-900">{selectedShipment.distanceTraveled} miles</div>
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="flex justify-between items-center text-xs text-gray-500 mb-1">
                          <span>Delivery Progress</span>
                          <span>{Math.round((selectedShipment.distanceTraveled / selectedShipment.distance) * 100)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className={`h-2.5 rounded-full ${
                            selectedShipment.status === 'delayed' 
                              ? 'bg-red-500' 
                              : selectedShipment.status === 'arriving_soon'
                                ? 'bg-green-500'
                                : 'bg-blue-500'
                          }`} style={{ width: `${Math.round((selectedShipment.distanceTraveled / selectedShipment.distance) * 100)}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Shipment Timeline</h3>
                  <div className="relative pl-8 border-l-2 border-gray-200 space-y-6 py-2">
                    {shipmentTimeline.map((event) => (
                      <div key={event.id} className="relative">
                        <div className={`absolute -left-10 w-5 h-5 rounded-full flex items-center justify-center ${
                          event.status === 'completed' 
                            ? 'bg-green-500' 
                            : event.status === 'current'
                              ? 'bg-blue-500'
                              : 'bg-gray-300'
                        }`}>
                          {event.status === 'completed' ? (
                            <i className="fas fa-check text-white text-xs"></i>
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
                      <button className="btn btn-sm btn-outline-primary flex items-center">
                        <i className="fas fa-phone mr-1"></i>
                        Contact {selectedShipment.brokerName}
                      </button>
                      <button className="btn btn-sm btn-outline-secondary flex items-center">
                        <i className="fas fa-file-download mr-1"></i>
                        Download Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold flex items-center mb-4">
          <i className="fas fa-bell mr-2 text-blue-600"></i>
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
                        onClick={() => {
                          // Set selected shipment based on notification
                          const shipment = shipments.find(s => s.loadId === notification.loadId);
                          if (shipment) {
                            setSelectedShipmentId(shipment.id);
                          }
                        }}
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
                Showing <span className="font-medium">4</span> of <span className="font-medium">12</span> notifications
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

      <div className="bg-blue-50 border border-blue-100 rounded-lg mt-8 p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div className="flex">
            <div className="bg-blue-100 rounded-full p-2 text-blue-600 mr-3 shrink-0">
              <i className="fas fa-mobile-alt"></i>
            </div>
            <div>
              <h4 className="font-medium text-blue-800 mb-1">Track your shipments on the go</h4>
              <p className="text-sm text-blue-600 mb-2 md:mb-0">Download our mobile app to monitor your shipments from anywhere.</p>
            </div>
          </div>
          <div className="mt-3 md:mt-0 flex flex-shrink-0 space-x-2">
            <button className="inline-flex items-center px-4 py-2 border border-blue-300 shadow-sm text-sm font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50">
              <i className="fab fa-apple mr-2"></i>
              App Store
            </button>
            <button className="inline-flex items-center px-4 py-2 border border-blue-300 shadow-sm text-sm font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50">
              <i className="fab fa-google-play mr-2"></i>
              Google Play
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tracking;