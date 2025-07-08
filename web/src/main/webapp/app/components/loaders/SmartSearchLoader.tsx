import React, { useState, useEffect } from 'react';

interface SmartSearchLoaderProps {
  isSearching: boolean;
  onComplete?: () => void;
}

const searchMessages = [
  { icon: '🔍', text: 'Searching DAT load board...', duration: 3000 },
  { icon: '🚚', text: 'Checking TruckStop marketplace...', duration: 3000 },
  { icon: '🎯', text: 'Filtering smart matches...', duration: 2500 },
  { icon: '✨', text: 'Analyzing best opportunities...', duration: 1500 }
];

export const SmartSearchLoader: React.FC<SmartSearchLoaderProps> = ({ 
  isSearching, 
  onComplete 
}) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isSearching) {
      setCurrentMessageIndex(0);
      setProgress(0);
      return;
    }

    let timeoutId: NodeJS.Timeout;
    let progressInterval: NodeJS.Timeout | undefined;

    // Progress bar animation
    // eslint-disable-next-line prefer-const
    progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          if (progressInterval) {
            clearInterval(progressInterval);
          }
          if (onComplete) {
            onComplete();
          }
          return 100;
        }
        return prev + 1;
      });
    }, 100); // 10 seconds total

    // Message rotation
    const rotateMessage = (index: number) => {
      if (index >= searchMessages.length || !isSearching) return;
      
      setCurrentMessageIndex(index);
      
      timeoutId = setTimeout(() => {
        rotateMessage(index + 1);
      }, searchMessages[index].duration);
    };

    rotateMessage(0);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (progressInterval) clearInterval(progressInterval);
    };
  }, [isSearching, onComplete]);

  if (!isSearching) return null;

  const currentMessage = searchMessages[currentMessageIndex] || searchMessages[0];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 transform transition-all">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <span className="text-3xl animate-bounce">{currentMessage.icon}</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Finding Your Perfect Load</h3>
          <p className="text-sm text-gray-600">
            We're searching multiple load boards to find the best matches for you
          </p>
        </div>

        {/* Current Status */}
        <div className="mb-6">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="flex space-x-1">
              <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
              <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse animation-delay-200"></div>
              <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse animation-delay-400"></div>
            </div>
            <span className="text-sm font-medium text-gray-700">
              {currentMessage.text}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 text-center mt-2">{progress}% complete</p>
        </div>

        {/* Load Board Status */}
        <div className="space-y-2">
          {searchMessages.map((message, index) => (
            <div 
              key={index}
              className={`flex items-center justify-between text-sm p-2 rounded-lg transition-all ${
                index < currentMessageIndex 
                  ? 'bg-green-50 text-green-700' 
                  : index === currentMessageIndex 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-gray-400'
              }`}
            >
              <span className="flex items-center">
                <span className="mr-2">{message.icon}</span>
                {message.text.replace('...', '')}
              </span>
              {index < currentMessageIndex && (
                <i className="fas fa-check-circle text-green-600"></i>
              )}
              {index === currentMessageIndex && (
                <i className="fas fa-spinner fa-spin text-blue-600"></i>
              )}
            </div>
          ))}
        </div>

        {/* Tips */}
        <div className="mt-6 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600">
            <i className="fas fa-lightbulb text-yellow-500 mr-1"></i>
            <strong>Pro tip:</strong> We're matching loads based on your preferred routes, 
            equipment type, and rate history to save you time.
          </p>
        </div>
      </div>
    </div>
  );
};