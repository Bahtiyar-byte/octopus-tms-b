import React from 'react';
import Modal from '../../../components/ui/Modal';

interface BrokerInfo {
  name: string;
  company: string;
  phone: string;
  email: string;
  rating?: number;
}

interface LoadMatch {
  id: string;
  origin: string;
  destination: string;
  equipment: string;
  rate: number;
  weight: string;
  distance: number;
  pickupDate: string;
  deliveryDate: string;
  broker: BrokerInfo;
  isHotLoad?: boolean;
  matchScore?: number;
}

interface LoadMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  loads: LoadMatch[];
  onCallBroker: (load: LoadMatch) => void;
  onEmailBroker: (load: LoadMatch) => void;
  onReject: (loadId: string) => void;
  onSaveForLater: (loadId: string) => void;
}

export const LoadMatchModal: React.FC<LoadMatchModalProps> = ({
  isOpen,
  onClose,
  loads,
  onCallBroker,
  onEmailBroker,
  onReject,
  onSaveForLater
}) => {
  if (!loads.length) return null;

  const load = loads[0]; // For now, show the first match

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="🎯 Smart Match Found!"
      size="lg"
    >
      <div className="space-y-6">
        {/* Live indicator */}
        <div className="flex items-center justify-center space-x-2 mb-4">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          <span className="text-sm text-gray-600">Live Match</span>
        </div>
        
        {/* Match Score Badge */}
        {load.matchScore && (
          <div className="flex justify-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {load.matchScore}% Match
            </div>
          </div>
        )}

        {/* Load Details Card */}
        <div className="bg-gray-50 rounded-lg p-6 space-y-4">
          {/* Route */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <p className="text-sm text-gray-500">Origin</p>
                <p className="font-semibold text-lg">{load.origin}</p>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <div className="w-12 h-0.5 bg-gray-300"></div>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <div className="w-12 h-0.5 bg-gray-300"></div>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">Destination</p>
                <p className="font-semibold text-lg">{load.destination}</p>
              </div>
            </div>
            {load.isHotLoad && (
              <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                </svg>
                Hot Load
              </span>
            )}
          </div>

          {/* Load Info Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
            <div>
              <p className="text-sm text-gray-500">Equipment</p>
              <p className="font-medium">{load.equipment}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Rate</p>
              <p className="font-medium text-green-600">${load.rate.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Weight</p>
              <p className="font-medium">{load.weight}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Distance</p>
              <p className="font-medium">{load.distance} mi</p>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
            <div>
              <p className="text-sm text-gray-500">Pickup Date</p>
              <p className="font-medium">{load.pickupDate}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Delivery Date</p>
              <p className="font-medium">{load.deliveryDate}</p>
            </div>
          </div>
        </div>

        {/* Broker Information */}
        <div className="bg-blue-50 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-gray-900">{load.broker.name}</p>
              <p className="text-sm text-gray-600">{load.broker.company}</p>
              {load.broker.rating && (
                <div className="flex items-center mt-1">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${i < load.broker.rating! ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="ml-1 text-sm text-gray-600">({load.broker.rating})</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onCallBroker(load)}
              className="flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Call Broker
            </button>
            <button
              onClick={() => onEmailBroker(load)}
              className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Email Broker
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onSaveForLater(load.id)}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Save for Later
            </button>
            <button
              onClick={() => onReject(load.id)}
              className="px-6 py-2 border border-red-300 text-red-600 rounded-lg font-medium hover:bg-red-50 transition-colors"
            >
              Reject Load
            </button>
          </div>
        </div>

        {/* Multiple matches indicator */}
        {loads.length > 1 && (
          <div className="text-center text-sm text-gray-500">
            <p>+{loads.length - 1} more matches found</p>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default LoadMatchModal;