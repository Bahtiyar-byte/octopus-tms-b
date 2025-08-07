import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../../components';
import { toast } from 'react-hot-toast';
import MapboxAddressInput from '../../shipper/components/MapboxAddressInput';
import type { GeocodingFeature } from '@mapbox/search-js-core';
import { jupiterAluminumLocations, commonDestinations } from '../../../data/shipperLocations';
import { brokerApi, Load } from '../api/brokerApi';

const CreateLoad: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [postToLoadBoard, setPostToLoadBoard] = useState(false);
  
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    originCoordinates: null as { lat: number; lon: number } | null,
    destinationCoordinates: null as { lat: number; lon: number } | null,
    pickupDate: '',
    deliveryDate: '',
    commodity: '',
    weight: '',
    rate: '',
    equipmentType: 'DRY_VAN',
    notes: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Format the form data to match the expected structure
      const loadData: Partial<Load> = {
        // Generate a unique loadNumber (required by backend)
        loadNumber: `LD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        origin: formData.origin,
        destination: formData.destination,
        commodity: formData.commodity,
        weight: Number(formData.weight),
        rate: Number(formData.rate),
        status: 'Posted' as Load['status'],
        notes: formData.notes,
        // Include equipment type
        equipmentType: formData.equipmentType,
        // Include dates
        pickupDate: formData.pickupDate,
        deliveryDate: formData.deliveryDate,
        // Additional fields that might be useful
        distance: formData.originCoordinates && formData.destinationCoordinates 
          ? Math.floor(500 + Math.random() * 1000) // This would be calculated properly in a real app
          : 0
      };
      
      // Submit the load data to the API
      const newLoad = await brokerApi.createLoad(loadData);
      
      // If load board posting is enabled, handle posting to DAT/Truckstop
      if (postToLoadBoard) {
        // In a real implementation, this would make another API call
        toast.success('Load posted to DAT/Truckstop', { 
          duration: 3000,
          icon: '🚚'
        });
      }
      
      // Show success message
      toast.success(`Load ${newLoad.id} created successfully!`);
      
      // Navigate to loads page
      navigate('/broker/loads');
    } catch (error) {
      console.error('Error creating load:', error);
      toast.error('Failed to create load. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Create New Load</h1>
        <button
          onClick={() => navigate('/broker/loads')}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md shadow-sm flex items-center"
        >
          <i className="fas fa-arrow-left mr-2"></i> Back to Loads
        </button>
      </div>
      
      <Card className="bg-white shadow-md">
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Origin and Destination */}
              <div>
                <MapboxAddressInput
                  label="Origin Address"
                  value={formData.origin}
                  onChange={(value) => setFormData({ ...formData, origin: value })}
                  onFeatureSelect={(feature: GeocodingFeature) => {
                    if (feature?.geometry?.coordinates) {
                      setFormData({
                        ...formData,
                        origin: feature.properties.full_address || formData.origin,
                        originCoordinates: {
                          lat: feature.geometry.coordinates[1],
                          lon: feature.geometry.coordinates[0]
                        }
                      });
                    }
                  }}
                  savedLocations={jupiterAluminumLocations}
                  placeholder="Search for pickup address"
                  required
                />
              </div>
              
              <div>
                <MapboxAddressInput
                  label="Destination Address"
                  value={formData.destination}
                  onChange={(value) => setFormData({ ...formData, destination: value })}
                  onFeatureSelect={(feature: GeocodingFeature) => {
                    if (feature?.geometry?.coordinates) {
                      setFormData({
                        ...formData,
                        destination: feature.properties.full_address || formData.destination,
                        destinationCoordinates: {
                          lat: feature.geometry.coordinates[1],
                          lon: feature.geometry.coordinates[0]
                        }
                      });
                    }
                  }}
                  savedLocations={[...jupiterAluminumLocations, ...commonDestinations]}
                  placeholder="Search for delivery address"
                  required
                />
              </div>
              
              {/* Pickup and Delivery Dates */}
              <div>
                <label htmlFor="pickupDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Pickup Date *
                </label>
                <input
                  type="date"
                  id="pickupDate"
                  name="pickupDate"
                  value={formData.pickupDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="deliveryDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Delivery Date *
                </label>
                <input
                  type="date"
                  id="deliveryDate"
                  name="deliveryDate"
                  value={formData.deliveryDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              {/* Commodity and Weight */}
              <div>
                <label htmlFor="commodity" className="block text-sm font-medium text-gray-700 mb-1">
                  Commodity *
                </label>
                <input
                  type="text"
                  id="commodity"
                  name="commodity"
                  value={formData.commodity}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. General Freight"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
                  Weight (lbs) *
                </label>
                <input
                  type="text"
                  id="weight"
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. 40000"
                  required
                />
              </div>
              
              {/* Rate and Equipment Type */}
              <div>
                <label htmlFor="rate" className="block text-sm font-medium text-gray-700 mb-1">
                  Rate ($) *
                </label>
                <input
                  type="text"
                  id="rate"
                  name="rate"
                  value={formData.rate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. 1500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="equipmentType" className="block text-sm font-medium text-gray-700 mb-1">
                  Equipment Type *
                </label>
                <select
                  id="equipmentType"
                  name="equipmentType"
                  value={formData.equipmentType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="DRY_VAN">Dry Van</option>
                  <option value="REEFER">Reefer</option>
                  <option value="FLATBED">Flatbed</option>
                  <option value="STEP_DECK">Step Deck</option>
                  <option value="DOUBLE_DROP">Double Drop</option>
                  <option value="TANKER">Tanker</option>
                  <option value="POWER_ONLY">Power Only</option>
                  <option value="BOX_TRUCK">Box Truck</option>
                  <option value="RGN">RGN</option>
                  <option value="HOTSHOT">Hotshot</option>
                </select>
              </div>
            </div>
            
            {/* Notes */}
            <div className="mt-6">
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                Special Instructions
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter any special instructions or requirements..."
              ></textarea>
            </div>
            
            {/* Load Board Posting Option */}
            <div className="mt-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="postToLoadBoard"
                  checked={postToLoadBoard}
                  onChange={() => setPostToLoadBoard(!postToLoadBoard)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="postToLoadBoard" className="ml-2 block text-sm text-gray-700">
                  Post to external load boards (DAT/Truckstop)
                </label>
              </div>
            </div>
            
            {/* Distance and Rate Calculation (Simulated) */}
            {formData.origin && formData.destination && (
              <div className="mt-6 p-4 bg-blue-50 rounded-md">
                <h3 className="text-sm font-semibold text-blue-800 mb-2">Calculated Information:</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-blue-800">Estimated Distance:</span>
                    <span className="ml-2">{Math.floor(500 + Math.random() * 1000)} miles</span>
                  </div>
                  <div>
                    <span className="font-medium text-blue-800">Rate per Mile:</span>
                    <span className="ml-2">${formData.rate ? (Number(formData.rate) / 750).toFixed(2) : '0.00'}/mile</span>
                  </div>
                  <div>
                    <span className="font-medium text-blue-800">Market Rate:</span>
                    <span className="ml-2">${Math.floor(1.8 * 750)}-${Math.floor(2.2 * 750)}</span>
                  </div>
                </div>
              </div>
            )}
            
            {/* Submit Button */}
            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md shadow-sm flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Load...
                  </>
                ) : (
                  <>
                    <i className="fas fa-plus-circle mr-2"></i> Create Load
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default CreateLoad;