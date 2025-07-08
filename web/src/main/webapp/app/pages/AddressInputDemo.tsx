import React, { useState } from 'react';
import MapboxAddressInput from '../modules/shipper/components/MapboxAddressInput';
import AddressInputWithMap from '../modules/shipper/components/AddressInputWithMap';
import type { GeocodingFeature } from '@mapbox/search-js-core';
import { jupiterAluminumLocations, commonDestinations } from '../data/shipperLocations';
import { Card } from '../components';

const AddressInputDemo: React.FC = () => {
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [address3, setAddress3] = useState('');
  const [coordinates1, setCoordinates1] = useState<{ lat: number; lon: number } | null>(null);
  const [coordinates2, setCoordinates2] = useState<{ lat: number; lon: number } | null>(null);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Address Input Components Demo</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Basic Address Input</h2>
            <MapboxAddressInput
              label="Delivery Address"
              value={address1}
              onChange={setAddress1}
              placeholder="Search for any address"
              required
            />
            {address1 && (
              <p className="mt-2 text-sm text-gray-600">
                Selected: {address1}
              </p>
            )}
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">With Saved Locations</h2>
            <MapboxAddressInput
              label="Pickup Location"
              value={address2}
              onChange={setAddress2}
              savedLocations={jupiterAluminumLocations}
              placeholder="Search or select from saved locations"
              required
            />
            {address2 && (
              <p className="mt-2 text-sm text-gray-600">
                Selected: {address2}
              </p>
            )}
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">With Map Preview</h2>
            <AddressInputWithMap
              label="Warehouse Location"
              value={address3}
              onChange={setAddress3}
              onCoordinatesChange={(coords) => {
                setCoordinates1(coords);
                console.log('Coordinates:', coords);
              }}
              savedLocations={[...jupiterAluminumLocations, ...commonDestinations]}
              placeholder="Search for warehouse address"
              showMap
              required
            />
            {coordinates1 && (
              <p className="mt-2 text-sm text-gray-600">
                Coordinates: {coordinates1.lat.toFixed(4)}, {coordinates1.lon.toFixed(4)}
              </p>
            )}
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Form Example</h2>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <MapboxAddressInput
                  label="Origin"
                  value={address1}
                  onChange={setAddress1}
                  onFeatureSelect={(feature: GeocodingFeature) => {
                    if (feature?.geometry?.coordinates) {
                      setCoordinates1({
                        lat: feature.geometry.coordinates[1],
                        lon: feature.geometry.coordinates[0]
                      });
                    }
                  }}
                  savedLocations={jupiterAluminumLocations}
                  placeholder="Select pickup location"
                  required
                />
                
                <MapboxAddressInput
                  label="Destination"
                  value={address2}
                  onChange={setAddress2}
                  onFeatureSelect={(feature: GeocodingFeature) => {
                    if (feature?.geometry?.coordinates) {
                      setCoordinates2({
                        lat: feature.geometry.coordinates[1],
                        lon: feature.geometry.coordinates[0]
                      });
                    }
                  }}
                  savedLocations={commonDestinations}
                  placeholder="Select delivery location"
                  required
                />
              </div>
              
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium mb-2">Form Data:</h3>
                <pre className="text-xs bg-white p-3 rounded border border-gray-200">
{JSON.stringify({
  origin: { address: address1, coordinates: coordinates1 },
  destination: { address: address2, coordinates: coordinates2 }
}, null, 2)}
                </pre>
              </div>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AddressInputDemo;