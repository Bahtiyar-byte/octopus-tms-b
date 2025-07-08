import React from 'react';
import Modal from '../../../components/ui/Modal';
import { MatchedCarrier } from '../hooks/useCarrierMatcher';
import { 
  Star, 
  Phone, 
  Mail, 
  Truck, 
  Shield, 
  Clock, 
  TrendingUp,
  CheckCircle,
  Bookmark,
  BookmarkCheck
} from 'lucide-react';

interface CarrierMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  carriers: MatchedCarrier[];
  onCallCarrier: (carrier: MatchedCarrier) => void;
  onEmailCarrier: (carrier: MatchedCarrier) => void;
  contactedCarriers: Set<string>;
  savedCarriers: Set<string>;
  onToggleSave: (carrierId: string) => void;
}

export const CarrierMatchModal: React.FC<CarrierMatchModalProps> = ({
  isOpen,
  onClose,
  carriers,
  onCallCarrier,
  onEmailCarrier,
  contactedCarriers,
  savedCarriers,
  onToggleSave
}) => {
  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available': return 'text-green-600 bg-green-50';
      case 'busy': return 'text-yellow-600 bg-yellow-50';
      case 'offline': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50';
    if (score >= 75) return 'text-blue-600 bg-blue-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Smart Carrier Matches Found!"
      size="xl"
    >
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Truck className="w-6 h-6 text-blue-600" />
          </div>
          <p className="text-sm text-gray-500">
            {carriers.length} carrier{carriers.length !== 1 ? 's' : ''} matched your load requirements
          </p>
        </div>
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
        {carriers.map((carrier) => (
          <div
            key={carrier.id}
            className={`border rounded-xl p-5 transition-all duration-200 ${
              contactedCarriers.has(carrier.id) 
                ? 'border-green-300 bg-green-50/30' 
                : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
            }`}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{carrier.company}</h3>
                  {contactedCarriers.has(carrier.id) && (
                    <span className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      <CheckCircle className="w-3 h-3" />
                      Contacted
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="font-medium">{carrier.name}</span>
                  <span className="text-gray-400">•</span>
                  <span>MC# {carrier.mcNumber}</span>
                  <span className="text-gray-400">•</span>
                  <span>DOT# {carrier.dotNumber}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onToggleSave(carrier.id)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title={savedCarriers.has(carrier.id) ? 'Remove from saved' : 'Save carrier'}
                >
                  {savedCarriers.has(carrier.id) ? (
                    <BookmarkCheck className="w-5 h-5 text-blue-600" />
                  ) : (
                    <Bookmark className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${getMatchScoreColor(carrier.matchScore)}`}>
                  {carrier.matchScore}% Match
                </div>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <div>
                  <span className="text-sm font-medium text-gray-900">{carrier.rating}</span>
                  <span className="text-xs text-gray-500 ml-1">Rating</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <div>
                  <span className="text-sm font-medium text-gray-900">{carrier.onTimePercentage}%</span>
                  <span className="text-xs text-gray-500 ml-1">On-Time</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-blue-500" />
                <div>
                  <span className="text-sm font-medium text-gray-900">{carrier.totalLoads}</span>
                  <span className="text-xs text-gray-500 ml-1">Loads</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-purple-500" />
                <div>
                  <span className="text-sm font-medium text-gray-900">
                    ${(carrier.insuranceCoverage / 1000000).toFixed(1)}M
                  </span>
                  <span className="text-xs text-gray-500 ml-1">Insurance</span>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-500">Equipment:</span>
                <div className="flex gap-1">
                  {carrier.equipmentTypes.map((type, idx) => (
                    <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                      {type}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-500">Status:</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getAvailabilityColor(carrier.availability)}`}>
                  {carrier.availability === 'available' ? '🟢 Available Now' : 
                   carrier.availability === 'busy' ? '🟡 Currently Busy' : '⚫ Offline'}
                </span>
                <span className="text-gray-400 text-xs flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {carrier.lastActive}
                </span>
              </div>
              {carrier.notes && (
                <div className="text-sm bg-blue-50 text-blue-700 p-2 rounded-lg">
                  💡 {carrier.notes}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => onCallCarrier(carrier)}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
              >
                <Phone className="w-4 h-4" />
                Call Carrier
              </button>
              <button
                onClick={() => onEmailCarrier(carrier)}
                className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                <Mail className="w-4 h-4" />
                Email Carrier
              </button>
            </div>
          </div>
        ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-gray-200 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          💡 Carriers are ranked by match score based on equipment, lane preference, and performance
        </div>
        <button
          onClick={onClose}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
        >
          Close
        </button>
      </div>
    </Modal>
  );
};