import React, { useState, useEffect } from 'react';
import Modal from '../../../components/ui/Modal';

interface Load {
  id: string;
  load_number: string;
  origin_city: string;
  origin_state: string;
  destination_city: string;
  destination_state: string;
  equipment_type: string;
  rate: number;
  weight?: number;
  distance?: number;
  pickup_date: string;
  delivery_date: string;
  broker_name?: string;
  broker_phone?: string;
  broker_email?: string;
  broker_company?: string;
}

interface SmartLoadMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  load: Load | null;
  onCallBroker: (load: Load) => void;
  onEmailBroker: (load: Load) => void;
  onRejectLoad: (load: Load) => void;
  onSaveForLater: (load: Load) => void;
}

export const SmartLoadMatchModal: React.FC<SmartLoadMatchModalProps> = ({
  isOpen,
  onClose,
  load,
  onCallBroker,
  onEmailBroker,
  onRejectLoad,
  onSaveForLater
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      // Play notification sound
      const audio = new Audio('/notification.mp3');
      audio.play().catch(() => {});
    }
  }, [isOpen]);

  if (!load) return null;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      title=""
      size="sm"
    >
      <div className="relative">
        {/* Success Header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 -m-6 mb-0 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold flex items-center">
                <span className="animate-pulse mr-2">🎯</span>
                Smart Match Found!
              </h2>
              <p className="text-green-100 mt-1">Perfect load match based on your criteria</p>
            </div>
            <div className="bg-white/20 rounded-full p-3 animate-bounce">
              <i className="fas fa-check text-2xl"></i>
            </div>
          </div>
        </div>

        {/* Load Details */}
        <div className="p-6 space-y-4">
          {/* Route Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">Load #{load.load_number}</h3>
              <span className="text-2xl font-bold text-green-600">${load.rate.toLocaleString()}</span>
            </div>
            
            <div className="flex items-center text-sm text-gray-600 mb-3">
              <div className="flex-1">
                <i className="fas fa-map-marker-alt text-blue-500 mr-1"></i>
                {load.origin_city}, {load.origin_state}
              </div>
              <i className="fas fa-arrow-right mx-3 text-gray-400"></i>
              <div className="flex-1 text-right">
                <i className="fas fa-flag-checkered text-red-500 mr-1"></i>
                {load.destination_city}, {load.destination_state}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="text-center p-2 bg-white rounded">
                <i className="fas fa-truck text-gray-400 mb-1"></i>
                <p className="font-medium">{load.equipment_type?.replace(/_/g, ' ')}</p>
              </div>
              <div className="text-center p-2 bg-white rounded">
                <i className="fas fa-weight text-gray-400 mb-1"></i>
                <p className="font-medium">{load.weight || 'TBD'} lbs</p>
              </div>
              <div className="text-center p-2 bg-white rounded">
                <i className="fas fa-route text-gray-400 mb-1"></i>
                <p className="font-medium">{load.distance || '---'} mi</p>
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-blue-50 rounded-lg p-3">
              <p className="text-xs text-blue-600 font-medium mb-1">Pickup</p>
              <p className="text-sm font-semibold text-gray-900">
                {new Date(load.pickup_date).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric',
                  year: 'numeric'
                })}
              </p>
            </div>
            <div className="bg-purple-50 rounded-lg p-3">
              <p className="text-xs text-purple-600 font-medium mb-1">Delivery</p>
              <p className="text-sm font-semibold text-gray-900">
                {new Date(load.delivery_date).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric',
                  year: 'numeric'
                })}
              </p>
            </div>
          </div>

          {/* Broker Information */}
          {(load.broker_name || load.broker_company) && (
            <div className="border-t pt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Broker Contact</h4>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="font-medium text-gray-900">{load.broker_name || 'Broker'}</p>
                <p className="text-sm text-gray-600">{load.broker_company || 'Logistics Company'}</p>
                {load.broker_phone && (
                  <p className="text-sm text-blue-600 mt-1">
                    <i className="fas fa-phone mr-1"></i>
                    {load.broker_phone}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => onCallBroker(load)}
                className="bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <i className="fas fa-phone mr-2 animate-pulse"></i>
                Call Broker
              </button>
              <button
                onClick={() => onEmailBroker(load)}
                className="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center font-medium"
              >
                <i className="fas fa-envelope mr-2"></i>
                Email Broker
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => onSaveForLater(load)}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center text-sm"
              >
                <i className="fas fa-bookmark mr-2"></i>
                Save for Later
              </button>
              <button
                onClick={() => onRejectLoad(load)}
                className="bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center text-sm"
              >
                <i className="fas fa-times mr-2"></i>
                Not Interested
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};