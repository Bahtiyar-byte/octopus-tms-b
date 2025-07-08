import React from 'react';
import { Geocoder } from '@mapbox/search-js-react';
const GeocoderComponent = Geocoder as any;
import type { GeocodingFeature } from '@mapbox/search-js-core';
import { Building2, Star } from 'lucide-react';
import { SavedLocation } from '../../../data/shipperLocations';

interface MapboxAddressInputProps {
  value: string;
  onChange: (value: string) => void;
  onFeatureSelect?: (feature: GeocodingFeature) => void;
  placeholder?: string;
  savedLocations?: SavedLocation[];
  label?: string;
  required?: boolean;
}

const MAPBOX_ACCESS_TOKEN = "pk.eyJ1IjoiYnJhbmRvbmhheTI5IiwiYSI6ImNtOHN2d3lmbzA0aXkya24xNWdwd3B4ZG8ifQ.XkfYRmRTSVJgK8g28PlOOA";

const MapboxAddressInput: React.FC<MapboxAddressInputProps> = ({
  value,
  onChange,
  onFeatureSelect,
  placeholder = "Enter address",
  savedLocations = [],
  label,
  required = false
}) => {
  const [showSaved, setShowSaved] = React.useState(false);
  const [inputFocused, setInputFocused] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState(value);

  const handleSelect = (location: SavedLocation) => {
    onChange(location.address);
    setShowSaved(false);
    
    // Create a feature object similar to what Mapbox returns
    if (onFeatureSelect && location.coordinates) {
      onFeatureSelect({
        type: 'Feature',
        id: 'custom_' + Math.random().toString(36).substring(2, 11),
        geometry: {
          coordinates: [location.coordinates.lon, location.coordinates.lat],
          type: 'Point'
        },
        properties: {
          mapbox_id: 'custom_' + Math.random().toString(36).substring(2, 11),
          feature_type: 'address',
          name: location.name,
          name_preferred: location.name,
          place_formatted: location.address,
          full_address: location.address,
          coordinates: {
            longitude: location.coordinates.lon,
            latitude: location.coordinates.lat
          }
        } as any
      });
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <div className="relative">
        <GeocoderComponent
          accessToken={MAPBOX_ACCESS_TOKEN}
          value={value}
          onChange={(val: string) => {
            setSearchValue(val);
            onChange(val);
          }}
          onRetrieve={(result: GeocodingFeature) => {
            if (result) {
              onChange(result.properties.full_address || '');
              onFeatureSelect?.(result);
            }
          }}
          onSuggest={() => setInputFocused(true)}
          onClear={() => {
            setSearchValue('');
            onChange('');
          }}
          options={{
            language: 'en',
            country: 'US',
            limit: 5
          }}
          theme={{
            variables: {
              borderRadius: '0.375rem',
              fontFamily: 'Poppins, system-ui, sans-serif',
              colorBackground: '#ffffff',
              colorBackgroundActive: '#f3f4f6',
              colorBackgroundHover: '#f9fafb',
              colorText: '#111827',
              colorSecondary: '#6b7280',
              colorPrimary: '#2563eb',
              unit: '16px',
              padding: '0.5rem 0.75rem',
              boxShadow: 'none',
              border: '1px solid #d1d5db'
            }
          }}
          placeholder={placeholder}
        />
        
        {/* Hint text */}
        {inputFocused && searchValue.length < 3 && (
          <p className="absolute -bottom-6 left-0 text-xs text-gray-500">
            Enter at least 3 characters to search
          </p>
        )}
      </div>

      {/* Saved Locations Button - Outside input field */}
      {savedLocations.length > 0 && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setShowSaved(!showSaved)}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
          >
            <span>Saved Locations</span>
            <svg className={`w-4 h-4 transition-transform ${showSaved ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      )}

      {/* Saved Locations Dropdown */}
      {showSaved && savedLocations.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
          <div className="p-2">
            <p className="text-xs font-semibold text-gray-500 uppercase px-2 py-1">Select a saved location</p>
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
  );
};

export default MapboxAddressInput;