import React, { useState, useEffect } from 'react';

const searchMessages = [
  { text: "Searching DAT load board...", icon: "🔍", duration: 3000 },
  { text: "Checking TruckStop database...", icon: "🚛", duration: 3000 },
  { text: "Analyzing smart matches...", icon: "🧠", duration: 2500 },
  { text: "Filtering by your preferences...", icon: "⚡", duration: 1500 }
];

interface SearchLoaderProps {
  isSearching: boolean;
  onComplete?: () => void;
}

export const SearchLoader: React.FC<SearchLoaderProps> = ({ isSearching, onComplete }) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isSearching) {
      setCurrentMessageIndex(0);
      setProgress(0);
      return;
    }

    let messageTimer: ReturnType<typeof setTimeout>;
    const totalDuration = searchMessages.reduce((acc, msg) => acc + msg.duration, 0);
    const progressIncrement = 100 / (totalDuration / 100);

    // Progress bar animation
    const progressTimer = setInterval(() => {
      setProgress(prev => {
        const newProgress = Math.min(prev + progressIncrement, 100);
        if (newProgress >= 100 && onComplete) {
          setTimeout(onComplete, 100);
        }
        return newProgress;
      });
    }, 100);

    // Message rotation
    let accumulatedTime = 0;
    searchMessages.forEach((message, index) => {
      if (index > 0) {
        messageTimer = setTimeout(() => {
          setCurrentMessageIndex(index);
        }, accumulatedTime);
      }
      accumulatedTime += message.duration;
    });

    return () => {
      clearInterval(progressTimer);
      clearTimeout(messageTimer);
    };
  }, [isSearching, onComplete]);

  if (!isSearching) return null;

  const currentMessage = searchMessages[currentMessageIndex];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
        <div className="text-center space-y-6">
          {/* Animated Icon */}
          <div className="relative inline-flex items-center justify-center">
            <span className="absolute inline-flex h-20 w-20 rounded-full bg-blue-400 opacity-25 animate-ping"></span>
            <span className="text-5xl animate-bounce">{currentMessage.icon}</span>
          </div>

          {/* Message */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Finding Your Perfect Load</h3>
            <p className="text-gray-600 animate-pulse">{currentMessage.text}</p>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="space-y-1">
              <p className="text-2xl font-bold text-blue-600 animate-pulse">
                {Math.floor(progress * 1.5)}
              </p>
              <p className="text-xs text-gray-500">Loads Scanned</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-green-600 animate-pulse">
                {Math.floor(progress * 0.08)}
              </p>
              <p className="text-xs text-gray-500">Matches Found</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-purple-600 animate-pulse">
                {Math.max(0, 10 - Math.floor(progress / 10))}s
              </p>
              <p className="text-xs text-gray-500">Time Left</p>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-blue-50 rounded-lg p-3">
            <p className="text-xs text-blue-800">
              <span className="font-semibold">Pro Tip:</span> We're matching loads based on your route preferences, 
              equipment type, and historical performance data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchLoader;