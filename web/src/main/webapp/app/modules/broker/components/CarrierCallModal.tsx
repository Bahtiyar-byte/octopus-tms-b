import React, { useState, useEffect, useRef } from 'react';
import Modal from '../../../components/ui/Modal';
import { MatchedCarrier } from '../hooks/useCarrierMatcher';
import { 
  Phone, 
  PhoneOff, 
  User, 
  Building2, 
  Clock, 
  MessageSquare,
  Save,
  CheckCircle,
  Volume2,
  Mic,
  MicOff
} from 'lucide-react';

interface CarrierCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  carrier: MatchedCarrier | null;
  onSaveCall: (carrierId: string, notes: string, duration: number) => void;
}

export const CarrierCallModal: React.FC<CarrierCallModalProps> = ({
  isOpen,
  onClose,
  carrier,
  onSaveCall
}) => {
  const [callDuration, setCallDuration] = useState(0);
  const [callActive, setCallActive] = useState(false);
  const [callNotes, setCallNotes] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [savedNotes, setSavedNotes] = useState(false);
  // @ts-ignore
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (isOpen && carrier) {
      // Reset state when modal opens
      setCallDuration(0);
      setCallActive(false);
      setCallNotes('');
      setIsMuted(false);
      setSavedNotes(false);
      
      // Start call automatically after a short delay
      const startTimer = setTimeout(() => {
        handleStartCall();
      }, 500);
      
      return () => clearTimeout(startTimer);
    }
  }, [isOpen, carrier]);

  useEffect(() => {
    if (callActive) {
      intervalRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [callActive]);

  const handleStartCall = () => {
    setCallActive(true);
    // Play ringtone sound (optional)
    playRingtone();
  };

  const handleEndCall = () => {
    setCallActive(false);
    stopRingtone();
  };

  const playRingtone = () => {
    // Create a simple beep sound using Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 440; // A4 note
    gainNode.gain.value = 0.1; // Low volume
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.2); // Short beep
  };

  const stopRingtone = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSaveNotes = () => {
    if (carrier) {
      onSaveCall(carrier.id, callNotes, callDuration);
      setSavedNotes(true);
      setTimeout(() => setSavedNotes(false), 2000);
    }
  };

  const handleCloseModal = () => {
    if (callActive) {
      handleEndCall();
    }
    if (carrier && callNotes.trim()) {
      onSaveCall(carrier.id, callNotes, callDuration);
    }
    onClose();
  };

  if (!carrier) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCloseModal}
      title={callActive ? 'Call in Progress' : 'Preparing Call'}
      size="lg"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${callActive ? 'bg-green-100' : 'bg-gray-100'}`}>
            <Phone className={`w-6 h-6 ${callActive ? 'text-green-600' : 'text-gray-600'}`} />
          </div>
          <p className="text-sm text-gray-500">
            {callActive ? 'Connected' : 'Connecting...'} to {carrier.company}
          </p>
        </div>

        {/* Call Interface */}
        <div className="bg-gradient-to-b from-gray-50 to-gray-100 rounded-xl p-6 text-center">
          {/* Pulsing Phone Icon */}
          <div className="relative inline-block mb-4">
            <div className={`w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center ${
              callActive ? 'animate-pulse' : ''
            }`}>
              <Phone className="w-12 h-12 text-white" />
            </div>
            {callActive && (
              <div className="absolute -inset-2 bg-blue-600 rounded-full opacity-20 animate-ping" />
            )}
          </div>

          {/* Carrier Info */}
          <div className="space-y-2 mb-4">
            <h3 className="text-2xl font-semibold text-gray-900">{carrier.name}</h3>
            <p className="text-lg text-gray-600 flex items-center justify-center gap-2">
              <Building2 className="w-4 h-4" />
              {carrier.company}
            </p>
            <p className="text-xl font-mono text-blue-600">📱 {carrier.phone}</p>
          </div>

          {/* Call Timer */}
          {callActive && (
            <div className="flex items-center justify-center gap-2 text-gray-700">
              <Clock className="w-5 h-5" />
              <span className="text-2xl font-mono">{formatDuration(callDuration)}</span>
            </div>
          )}

          {/* Call Controls */}
          <div className="flex items-center justify-center gap-4 mt-6">
            {callActive ? (
              <>
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className={`p-4 rounded-full transition-colors ${
                    isMuted 
                      ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                </button>
                <button
                  onClick={handleEndCall}
                  className="p-4 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-lg"
                  title="End Call"
                >
                  <PhoneOff className="w-8 h-8" />
                </button>
                <button
                  className="p-4 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors"
                  title="Speaker"
                >
                  <Volume2 className="w-6 h-6" />
                </button>
              </>
            ) : (
              <button
                onClick={handleStartCall}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 shadow-lg"
              >
                <Phone className="w-5 h-5" />
                Start Call
              </button>
            )}
          </div>
        </div>

        {/* Call Notes Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <MessageSquare className="w-4 h-4" />
              Call Notes
            </label>
            {savedNotes && (
              <span className="flex items-center gap-1 text-sm text-green-600">
                <CheckCircle className="w-4 h-4" />
                Notes saved
              </span>
            )}
          </div>
          <textarea
            value={callNotes}
            onChange={(e) => setCallNotes(e.target.value)}
            placeholder="Jot down important details from the call..."
            className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
          <div className="flex gap-3">
            <button
              onClick={handleSaveNotes}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Save className="w-4 h-4" />
              Save Call Notes
            </button>
            <button
              onClick={handleCloseModal}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              {callActive ? 'End Call & Close' : 'Close'}
            </button>
          </div>
        </div>

        {/* Quick Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">Carrier Quick Info</h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-blue-700">Rating:</span>
              <span className="ml-2 font-medium text-blue-900">⭐ {carrier.rating}/5</span>
            </div>
            <div>
              <span className="text-blue-700">On-Time:</span>
              <span className="ml-2 font-medium text-blue-900">{carrier.onTimePercentage}%</span>
            </div>
            <div>
              <span className="text-blue-700">Total Loads:</span>
              <span className="ml-2 font-medium text-blue-900">{carrier.totalLoads}</span>
            </div>
            <div>
              <span className="text-blue-700">Insurance:</span>
              <span className="ml-2 font-medium text-blue-900">${(carrier.insuranceCoverage / 1000000).toFixed(1)}M</span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};