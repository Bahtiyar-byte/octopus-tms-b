import React, { useState, useRef, useEffect } from 'react';
import { Card } from '../../../components';

interface AIAgentProps {
  className?: string;
}

interface AIResponse {
  text: string;
  data?: any;
  suggestions?: string[];
}

export const AIAgent: React.FC<AIAgentProps> = ({ className = '' }) => {
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [response, setResponse] = useState<AIResponse | null>(null);
  const [showResponse, setShowResponse] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Format data for display
  const formatDataDisplay = (data: any): React.ReactNode => {
    // Handle revenue data
    if (data.revenue || data.pending_payments) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.revenue && (
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-700">Monthly Revenue</h4>
                <i className="fas fa-chart-line text-green-500"></i>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                ${data.revenue.total ? data.revenue.total.toLocaleString() : '0'}
              </p>
              <p className="text-xs text-gray-500 mt-1">{data.revenue.count || 0} invoices</p>
            </div>
          )}
          
          {data.pending_payments && (
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-700">Pending Payments</h4>
                <i className="fas fa-clock text-orange-500"></i>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                ${data.pending_payments.total ? data.pending_payments.total.toLocaleString() : '0'}
              </p>
              <p className="text-xs text-gray-500 mt-1">{data.pending_payments.count || 0} pending</p>
            </div>
          )}
        </div>
      );
    }

    // Handle loads data
    if (data.loads && Array.isArray(data.loads)) {
      const maxLoadsToShow = 10; // Show up to 10 loads
      return (
        <div className="space-y-2">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-sm font-medium text-gray-700">Available Loads</h4>
            <span className="text-xs text-gray-500">{data.loads.length} total</span>
          </div>
          {data.loads.length === 0 ? (
            <p className="text-sm text-gray-500 italic">No loads found matching your criteria</p>
          ) : (
            <>
              <div className="grid gap-2">
                {data.loads.slice(0, maxLoadsToShow).map((load: any, index: number) => (
                  <div key={load.id || index} className="bg-white p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm text-gray-900">{load.load_number || `LOAD${String(index + 1).padStart(3, '0')}`}</p>
                          {load.status && (
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              load.status === 'POSTED' ? 'bg-blue-100 text-blue-700' :
                              load.status === 'IN_TRANSIT' ? 'bg-yellow-100 text-yellow-700' :
                              load.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                              load.status === 'ASSIGNED' ? 'bg-purple-100 text-purple-700' :
                              load.status === 'PENDING' ? 'bg-orange-100 text-orange-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {load.status.replace(/_/g, ' ')}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                          <i className="fas fa-map-marker-alt text-blue-500 mr-1"></i>
                          {load.origin_city}, {load.origin_state} 
                          <i className="fas fa-arrow-right mx-2 text-gray-400"></i>
                          {load.destination_city}, {load.destination_state}
                        </p>
                        <div className="flex items-center gap-3 mt-1">
                          {load.equipment_type && (
                            <p className="text-xs text-gray-500">
                              <i className="fas fa-truck mr-1"></i>
                              {load.equipment_type.replace(/_/g, ' ')}
                            </p>
                          )}
                          {load.pickup_date && (
                            <p className="text-xs text-gray-500">
                              <i className="fas fa-calendar mr-1"></i>
                              {new Date(load.pickup_date).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right ml-3">
                        <p className="text-lg font-bold text-green-600">
                          ${typeof load.rate === 'number' ? load.rate.toLocaleString() : load.rate}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {load.distance ? `${load.distance} mi` : ''}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {data.loads.length > maxLoadsToShow && (
                <p className="text-xs text-gray-500 text-center pt-2 border-t">
                  <i className="fas fa-ellipsis-h mr-1"></i>
                  {data.loads.length - maxLoadsToShow} more load{data.loads.length - maxLoadsToShow > 1 ? 's' : ''} available
                </p>
              )}
            </>
          )}
        </div>
      );
    }

    // Handle carrier ratings
    if (data.carrier_ratings && Array.isArray(data.carrier_ratings)) {
      return (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Carrier Ratings</h4>
          {data.carrier_ratings.slice(0, 5).map((carrier: any, index: number) => (
            <div key={index} className="bg-white p-3 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="font-medium text-sm text-gray-900">{carrier.name}</p>
                  <p className="text-xs text-gray-600 mt-1">
                    MC# {carrier.mc_number} • {carrier.total_loads || 0} loads completed
                  </p>
                </div>
                <div className="text-right ml-3">
                  <div className="flex items-center">
                    <span className="text-lg font-bold text-yellow-500">{carrier.rating}</span>
                    <i className="fas fa-star text-yellow-500 ml-1"></i>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    {carrier.on_time_percentage}% on-time
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }
    
    // Handle carriers data
    if (data.carriers && Array.isArray(data.carriers)) {
      return (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Available Carriers</h4>
          {data.carriers.length === 0 ? (
            <p className="text-sm text-gray-500 italic">No carriers found</p>
          ) : (
            data.carriers.slice(0, 3).map((carrier: any, index: number) => (
              <div key={index} className="bg-white p-3 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors cursor-pointer">
                <p className="font-medium text-sm text-gray-900">{carrier.name}</p>
                <p className="text-xs text-gray-600 mt-1">
                  <i className="fas fa-id-card mr-1"></i>
                  MC# {carrier.mc_number}
                </p>
                {carrier.equipment_types && (
                  <p className="text-xs text-gray-500 mt-1">
                    <i className="fas fa-truck mr-1"></i>
                    {carrier.equipment_types.replace(/_/g, ' ')}
                  </p>
                )}
                {carrier.phone && (
                  <p className="text-xs text-blue-600 mt-1">
                    <i className="fas fa-phone mr-1"></i>
                    {carrier.phone}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      );
    }

    // Fallback for other data
    return null;
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleSubmit = async () => {
    if (!input.trim() || isProcessing) return;

    setIsProcessing(true);
    setShowResponse(false);

    try {
      const res = await fetch('/api/ai/agent/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: input,
          context: 'broker_dashboard'
        }),
      });

      if (!res.ok) throw new Error('Failed to get AI response');

      const data = await res.json();
      setResponse(data);
      setShowResponse(true);
    } catch (error) {
      console.error('AI Agent error:', error);
      setResponse({
        text: 'I apologize, but I encountered an error processing your request. Please try again.',
        suggestions: ['Check system status', 'View recent loads', 'Search carriers']
      });
      setShowResponse(true);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in your browser.');
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
      alert('Voice recognition failed. Please try again.');
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    setShowResponse(false);
  };

  return (
    <div className={`${className}`}>
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
              <i className="fas fa-robot text-white"></i>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-semibold text-gray-900">AI Assistant</h3>
              <p className="text-sm text-gray-600">Ask me about loads, carriers, or operations</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
                placeholder="Type your question or command..."
                className="w-full px-4 py-3 pr-24 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none min-h-[52px] max-h-[120px]"
                rows={1}
              />
              <div className="absolute right-2 bottom-2 flex items-center space-x-2">
                <button
                  onClick={handleVoiceInput}
                  className={`p-2 rounded-full transition-colors ${
                    isListening 
                      ? 'bg-red-500 text-white animate-pulse' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  title="Voice input"
                >
                  <i className={`fas ${isListening ? 'fa-stop' : 'fa-microphone'} text-sm`}></i>
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!input.trim() || isProcessing}
                  className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  {isProcessing ? (
                    <i className="fas fa-spinner fa-spin text-sm"></i>
                  ) : (
                    <i className="fas fa-paper-plane text-sm"></i>
                  )}
                </button>
              </div>
            </div>

            {/* Sample queries */}
            {!showResponse && !isProcessing && (
              <div className="space-y-2">
                <p className="text-xs text-gray-500">Try asking:</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Show me open loads to California',
                    'Find carriers with reefer equipment',
                    'What\'s my revenue this month?',
                    'Check driver John Smith status'
                  ].map((query, index) => (
                    <button
                      key={index}
                      onClick={() => setInput(query)}
                      className="text-xs px-3 py-1 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors"
                    >
                      {query}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Processing indicator */}
            {isProcessing && (
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                  <span className="text-sm text-gray-600">Processing your request...</span>
                </div>
              </div>
            )}

            {/* AI Response */}
            {showResponse && response && (
              <div className="animate-fadeIn">
                {/* Main Response */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
                        <i className="fas fa-robot text-white text-sm"></i>
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-800 leading-relaxed">{response.text}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Data Display - Formatted nicely */}
                  {response.data && Object.keys(response.data).length > 0 && !response.text.includes("Error") && (
                    <div className="border-t border-gray-100 bg-gray-50 p-4">
                      {formatDataDisplay(response.data)}
                    </div>
                  )}

                  {/* Suggestions */}
                  {response.suggestions && response.suggestions.length > 0 && (
                    <div className="border-t border-gray-100 p-4 bg-blue-50/30">
                      <p className="text-xs font-medium text-gray-600 mb-2">Suggested actions:</p>
                      <div className="flex flex-wrap gap-2">
                        {response.suggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="text-xs px-3 py-1.5 bg-white border border-blue-200 text-blue-700 rounded-full hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow"
                          >
                            <i className="fas fa-arrow-right mr-1 text-[10px]"></i>
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};