import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Card } from '../../../../components';
import { Shipment, LatLng } from '../../pages/Tracking/Tracking';
import { formatLoadStatus } from '../../../../utils/load/loadUtils';

interface TrackingMapProps {
  shipments: Shipment[];
  selectedShipmentId: string;
  onSelectShipment: (id: string) => void;
}

// Component to dynamically fit bounds
const DynamicMapBounds = ({ shipments }: { shipments: Shipment[] }) => {
  const map = useMap();

  useEffect(() => {
    if (shipments.length > 0) {
      const bounds = L.latLngBounds([]);
      
      shipments.forEach(shipment => {
        bounds.extend([shipment.coordinates.origin.lat, shipment.coordinates.origin.lng]);
        bounds.extend([shipment.coordinates.current.lat, shipment.coordinates.current.lng]);
        bounds.extend([shipment.coordinates.destination.lat, shipment.coordinates.destination.lng]);
      });

      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [map, shipments]);

  return null;
};

export const TrackingMap: React.FC<TrackingMapProps> = ({ 
  shipments, 
  selectedShipmentId, 
  onSelectShipment 
}) => {
  const getMarkerColor = (status: string) => {
    switch(status) {
      case 'en_route': return 'blue';
      case 'delayed': return 'red';
      case 'arriving_soon': return 'green';
      case 'delivered': return 'purple';
      default: return 'gray';
    }
  };

  const createMarkerIcon = (type: 'origin' | 'destination' | 'current', color: string, isSelected = false) => {
    const sizeMap = {
      origin: 24,
      destination: 24,
      current: isSelected ? 32 : 24
    };
    
    const size = sizeMap[type];
    
    if (type === 'current') {
      return L.divIcon({
        className: `bg-${color}-500 rounded-full border-2 border-white shadow-md flex items-center justify-center`,
        iconSize: [size, size],
        iconAnchor: [size/2, size/2],
        html: `<div class="flex items-center justify-center w-full h-full text-white">
          <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
            <path d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"/>
          </svg>
        </div>`
      });
    }
    
    return L.divIcon({
      className: `bg-gray-100 rounded-full border-2 border-${color}-500 shadow-md flex items-center justify-center`,
      iconSize: [size, size],
      iconAnchor: [size/2, size/2],
      html: `<div class="flex items-center justify-center w-full h-full">
        <div class="w-${type === 'origin' ? '2' : '3'} h-${type === 'origin' ? '2' : '3'} bg-${color}-500 rounded-full"></div>
      </div>`
    });
  };

  return (
    <Card className="mb-8 shadow-md overflow-hidden">
      <div className="relative h-96 w-full">
        <MapContainer 
          center={[39.8283, -98.5795]}
          zoom={4} 
          style={{ height: '100%', width: '100%', zIndex: 0 }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <DynamicMapBounds shipments={shipments} />

          {shipments.map(shipment => {
            const color = getMarkerColor(shipment.status);
            const isSelected = shipment.id === selectedShipmentId;

            return (
              <React.Fragment key={shipment.id}>
                {/* Origin marker */}
                <Marker 
                  position={[shipment.coordinates.origin.lat, shipment.coordinates.origin.lng]} 
                  icon={createMarkerIcon('origin', color)}
                  eventHandlers={{ click: () => onSelectShipment(shipment.id) }}
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
                  icon={createMarkerIcon('current', color, isSelected)}
                  eventHandlers={{ click: () => onSelectShipment(shipment.id) }}
                >
                  <Popup>
                    <div>
                      <div className="font-semibold">{shipment.loadId}</div>
                      <div className="text-sm">{shipment.currentLocation}</div>
                      <div className="text-xs text-gray-500">Driver: {shipment.driver}</div>
                      <div className="text-xs text-gray-500">Status: {formatLoadStatus(shipment.status)}</div>
                    </div>
                  </Popup>
                </Marker>

                {/* Destination marker */}
                <Marker 
                  position={[shipment.coordinates.destination.lat, shipment.coordinates.destination.lng]} 
                  icon={createMarkerIcon('destination', color)}
                  eventHandlers={{ click: () => onSelectShipment(shipment.id) }}
                >
                  <Popup>
                    <div>
                      <div className="font-semibold">{shipment.destination}</div>
                      <div className="text-xs text-gray-500">Destination</div>
                      <div className="text-xs text-gray-500">ETA: {shipment.eta}</div>
                    </div>
                  </Popup>
                </Marker>

                {/* Route lines */}
                <Polyline 
                  positions={[
                    [shipment.coordinates.origin.lat, shipment.coordinates.origin.lng],
                    [shipment.coordinates.current.lat, shipment.coordinates.current.lng]
                  ]} 
                  color={color}
                  weight={isSelected ? 4 : 3}
                  opacity={isSelected ? 0.8 : 0.5}
                />

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
            Last Updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>
    </Card>
  );
};