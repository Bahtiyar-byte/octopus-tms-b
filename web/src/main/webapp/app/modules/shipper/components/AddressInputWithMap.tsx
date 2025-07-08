import React, { useRef, useEffect, useState } from 'react';
import { Geocoder } from '@mapbox/search-js-react';
const GeocoderComponent = Geocoder as any;
import type { GeocodingFeature } from '@mapbox/search-js-core';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Building2, Star, MapPin } from 'lucide-react';
import { SavedLocation } from '../../../data/shipperLocations';

interface AddressInputWithMapProps {
  value: string;
  onChange: (value: string) => void;
  onCoordinatesChange?: (coords: { lat: number; lon: number }) => void;
  placeholder?: string;
  savedLocations?: SavedLocation[];
  label?: string;
  required?: boolean;
  showMap?: boolean;
}

const MAPBOX_ACCESS_TOKEN = "pk.eyJ1IjoiYnJhbmRvbmhheTI5IiwiYSI6ImNtOHN2d3lmbzA0aXkya24xNWdwd3B4ZG8ifQ.XkfYRmRTSVJgK8g28PlOOA";

const AddressInputWithMap: React.FC<AddressInputWithMapProps> = ({
  value,
  onChange,
  onCoordinatesChange,
  placeholder = "Enter address",
  savedLocations = [],
  label,
  required = false,
  showMap = true
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const [showSaved, setShowSaved] = useState(false);
  const [coordinates, setCoordinates] = useState<{ lat: number; lon: number } | null>(null);

  useEffect(() => {
    if (!showMap || !mapContainerRef.current) return;

    mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

    mapInstanceRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-98.5795, 39.8283], // Center of USA
      zoom: 3
    });

    mapInstanceRef.current.on('load', () => {
      // Map loaded
    });

    return () => {
      mapInstanceRef.current?.remove();
    };
  }, [showMap]);

  const updateMapLocation = (lng: number, lat: number) => {
    if (!mapInstanceRef.current || !showMap) return;

    // Remove existing marker
    if (markerRef.current) {
      markerRef.current.remove();
    }

    // Add new marker
    markerRef.current = new mapboxgl.Marker({ color: '#3B82F6' })
      .setLngLat([lng, lat])
      .addTo(mapInstanceRef.current);

    // Fly to location
    mapInstanceRef.current.flyTo({
      center: [lng, lat],
      zoom: 15,
      duration: 1500
    });

    // Update coordinates
    setCoordinates({ lat, lon: lng });
    onCoordinatesChange?.({ lat, lon: lng });
  };

  const handleSelect = (location: SavedLocation) => {
    onChange(location.address);
    setShowSaved(false);
    
    if (location.coordinates) {
      updateMapLocation(location.coordinates.lon, location.coordinates.lat);
    }
  };

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return (
    <div className="space-y-2">
      <div className="relative">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
        
        <div className="relative">
          <GeocoderComponent
            accessToken={MAPBOX_ACCESS_TOKEN}
            value={value}
            onChange={onChange}
            onRetrieve={(result: GeocodingFeature) => {
              if (result) {
                onChange(result.properties.full_address || '');
                
                if (result.geometry?.coordinates) {
                  updateMapLocation(
                    result.geometry.coordinates[0],
                    result.geometry.coordinates[1]
                  );
                }
              }
            }}
            options={{
              language: 'en',
              country: 'US',
              limit: 5
            }}
            theme={{
              variables: {
                borderRadius: '0.5rem',
                fontFamily: 'Poppins, system-ui, sans-serif',
                unit: '14px',
                padding: '0.5rem',
                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
              }
            }}
            placeholder={placeholder}
          />
          
          {savedLocations.length > 0 && (
            <button
              type="button"
              onClick={() => setShowSaved(!showSaved)}
              className="absolute right-2 top-2 text-sm text-blue-600 hover:text-blue-700 font-medium bg-white px-2 py-1 rounded"
            >
              <MapPin className="w-4 h-4 inline mr-1" />
              Saved
            </button>
          )}
        </div>

        {/* Saved Locations Dropdown */}
        {showSaved && savedLocations.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
            <div className="p-2">
              <p className="text-xs font-semibold text-gray-500 uppercase px-2 py-1">Jupiter Aluminum Locations</p>
              {savedLocations.map((location) => (
                <button
                  key={location.id}
                  type="button"
                  onClick={() => handleSelect(location)}
                  className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded flex items-start gap-3 group"
                >
                  <div className="mt-0.5">
                    {location.type === 'facility' && <Building2 className="w-5 h-5 text-blue-500" />}
                    {location.type === 'warehouse' && <Building2 className="w-5 h-5 text-green-500" />}
                    {location.type === 'customer' && <Star className="w-5 h-5 text-yellow-500" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 group-hover:text-blue-600">
                      {location.name}
                      {location.isDefault && (
                        <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">Default</span>
                      )}
                    </p>
                    <p className="text-sm text-gray-600">{location.address}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Map Preview */}
      {showMap && (
        <div className="relative">
          <div 
            ref={mapContainerRef} 
            className="h-48 rounded-lg border border-gray-200 overflow-hidden"
          />
          {coordinates && (
            <div className="absolute bottom-2 left-2 bg-white px-2 py-1 rounded shadow-sm text-xs text-gray-600">
              {coordinates.lat.toFixed(4)}, {coordinates.lon.toFixed(4)}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AddressInputWithMap;