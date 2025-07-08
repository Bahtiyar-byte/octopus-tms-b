import React, { useState } from 'react';

interface RateBenchmarkTooltipProps {
  rate: number;
  distance: number;
  origin: string;
  destination: string;
}

const RateBenchmarkTooltip: React.FC<RateBenchmarkTooltipProps> = ({
  rate,
  distance,
  origin,
  destination
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Calculate rate per mile
  const ratePerMile = distance > 0 ? (rate / distance).toFixed(2) : '0.00';
  
  // Mock benchmark data (in a real app, this would come from FreightWaves API)
  const mockBenchmarkData = {
    low: (parseFloat(ratePerMile) * 0.8).toFixed(2),
    average: (parseFloat(ratePerMile) * 1.0).toFixed(2),
    high: (parseFloat(ratePerMile) * 1.2).toFixed(2),
    trend: 'stable' as 'rising' | 'falling' | 'stable',
    lastUpdated: new Date().toLocaleDateString()
  };
  
  // Determine if the current rate is competitive
  const getRateAssessment = () => {
    const currentRate = parseFloat(ratePerMile);
    const avgRate = parseFloat(mockBenchmarkData.average);
    
    if (currentRate < avgRate * 0.9) {
      return {
        label: 'Below Market',
        color: 'text-red-600',
        message: 'This rate is below the market average and may be difficult to cover.'
      };
    } else if (currentRate > avgRate * 1.1) {
      return {
        label: 'Above Market',
        color: 'text-green-600',
        message: 'This rate is above the market average and should be easy to cover.'
      };
    } else {
      return {
        label: 'Competitive',
        color: 'text-blue-600',
        message: 'This rate is competitive with the current market.'
      };
    }
  };
  
  const assessment = getRateAssessment();
  
  return (
    <div className="relative inline-block">
      <button
        type="button"
        className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 focus:outline-none"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={assessment.color}>${ratePerMile}/mi</span>
        <svg className="ml-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute z-10 w-72 mt-2 -ml-2 bg-white rounded-lg shadow-lg border border-gray-200">
          <div className="px-4 py-3 border-b border-gray-200">
            <h3 className="text-sm font-medium text-gray-900">Rate Benchmark</h3>
            <p className="text-xs text-gray-500 mt-1">
              {origin} to {destination} ({distance} miles)
            </p>
          </div>
          
          <div className="px-4 py-3">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-gray-500">Your Rate:</span>
              <span className="text-sm font-medium">${rate} (${ratePerMile}/mi)</span>
            </div>
            
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-gray-500">Assessment:</span>
              <span className={`text-sm font-medium ${assessment.color}`}>{assessment.label}</span>
            </div>
            
            <p className="text-xs text-gray-600 mb-3">{assessment.message}</p>
            
            <div className="bg-gray-100 rounded-md p-3">
              <h4 className="text-xs font-medium text-gray-700 mb-2">Market Rates (per mile)</h4>
              
              <div className="grid grid-cols-3 gap-2 mb-2">
                <div className="text-center">
                  <div className="text-xs text-gray-500">Low</div>
                  <div className="text-sm font-medium">${mockBenchmarkData.low}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-500">Average</div>
                  <div className="text-sm font-medium">${mockBenchmarkData.average}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-500">High</div>
                  <div className="text-sm font-medium">${mockBenchmarkData.high}</div>
                </div>
              </div>
              
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>Market Trend: {mockBenchmarkData.trend.charAt(0).toUpperCase() + mockBenchmarkData.trend.slice(1)}</span>
                <span>Updated: {mockBenchmarkData.lastUpdated}</span>
              </div>
            </div>
            
            <div className="text-xs text-gray-400 mt-2 text-center">
              Data provided by FreightWaves (mock)
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RateBenchmarkTooltip;