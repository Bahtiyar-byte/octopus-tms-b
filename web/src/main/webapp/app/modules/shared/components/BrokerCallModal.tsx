import React, { useState, useEffect } from 'react';
import Modal from '../../../components/ui/Modal';

interface BrokerCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  brokerName: string;
  brokerCompany: string;
  brokerPhone: string;
  loadId: string;
  onSaveNotes: (notes: string, contacted: boolean) => void;
}

export const BrokerCallModal: React.FC<BrokerCallModalProps> = ({
  isOpen,
  onClose,
  brokerName,
  brokerCompany,
  brokerPhone,
  loadId,
  onSaveNotes
}) => {
  const [timer, setTimer] = useState(0);
  const [notes, setNotes] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [markAsContacted, setMarkAsContacted] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    
    if (isOpen && !isActive) {
      // Start timer after 2 seconds to simulate dialing
      const dialTimeout = setTimeout(() => {
        setIsActive(true);
      }, 2000);
      
      return () => clearTimeout(dialTimeout);
    }
    
    if (isActive && isOpen) {
      interval = setInterval(() => {
        setTimer(seconds => seconds + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, isOpen]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setTimer(0);
      setNotes('');
      setIsActive(false);
      setMarkAsContacted(false);
    }
  }, [isOpen]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSaveAndClose = () => {
    onSaveNotes(notes, markAsContacted);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      size="md"
    >
      <div className="text-center space-y-6">
        {/* Phone Animation */}
        <div className="relative inline-flex items-center justify-center">
          {/* Pulsing rings */}
          {!isActive && (
            <>
              <span className="absolute inline-flex h-32 w-32 rounded-full bg-green-400 opacity-25 animate-ping"></span>
              <span className="absolute inline-flex h-24 w-24 rounded-full bg-green-400 opacity-50 animate-ping animation-delay-200"></span>
            </>
          )}
          
          {/* Phone icon */}
          <div className={`relative inline-flex items-center justify-center w-20 h-20 rounded-full ${isActive ? 'bg-green-600' : 'bg-gray-400'} transition-colors duration-500`}>
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
        </div>

        {/* Call Status */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900">
            {isActive ? 'In Call' : 'Calling...'}
          </h3>
          <p className="text-2xl font-bold text-gray-800 mt-2">{brokerName}</p>
          <p className="text-lg text-gray-600">{brokerCompany}</p>
          <p className="text-lg text-blue-600 font-medium mt-1">📱 {brokerPhone}</p>
        </div>

        {/* Timer */}
        <div className="text-3xl font-mono font-bold text-gray-700">
          {formatTime(timer)}
        </div>

        {/* Notes Section */}
        <div className="text-left">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Call Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Jot down broker notes here... (rate negotiations, special requirements, etc.)"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={4}
          />
          <p className="text-xs text-gray-500 mt-1">Load ID: {loadId}</p>
        </div>

        {/* Mark as Contacted */}
        <div className="flex items-center justify-center">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={markAsContacted}
              onChange={(e) => setMarkAsContacted(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Mark broker as contacted</span>
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={handleSaveAndClose}
            className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V2" />
            </svg>
            Save Call Notes
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            End Call
          </button>
        </div>

        {/* Call Tips */}
        <div className="bg-blue-50 rounded-lg p-3 text-left">
          <p className="text-xs text-blue-800 font-medium mb-1">Quick Tips:</p>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• Confirm rate and payment terms</li>
            <li>• Verify pickup/delivery times</li>
            <li>• Ask about detention policies</li>
            <li>• Clarify any special requirements</li>
          </ul>
        </div>
      </div>
    </Modal>
  );
};

export default BrokerCallModal;