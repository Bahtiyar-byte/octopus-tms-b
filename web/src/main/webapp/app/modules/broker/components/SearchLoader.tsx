import React from 'react';

interface SearchLoaderProps {
  progress: number;
  message: string;
}

export const SearchLoader: React.FC<SearchLoaderProps> = ({ progress, message }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
        <div className="text-center space-y-6">
          {/* Animated Icon */}
          <div className="relative inline-flex items-center justify-center">
            <span className="absolute inline-flex h-20 w-20 rounded-full bg-blue-400 opacity-25 animate-ping"></span>
            <span className="text-5xl animate-bounce">🔍</span>
          </div>

          {/* Message */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Finding Perfect Carriers</h3>
            <p className="text-gray-600 animate-pulse">{message}</p>
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
              <p className="text-xs text-gray-500">Carriers Scanned</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-green-600 animate-pulse">
                {Math.floor(progress * 0.03)}
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
              <span className="font-semibold">Pro Tip:</span> We're matching carriers based on equipment compatibility, 
              lane preferences, safety ratings, and insurance status.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};