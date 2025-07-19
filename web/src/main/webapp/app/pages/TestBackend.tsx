import React, { useState } from 'react';
import { testBackendConnection } from '../services/testBackend';

const TestBackend: React.FC = () => {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const runTests = async () => {
    setLoading(true);
    setTestResults(['Starting backend connection tests...']);
    
    const logs: string[] = [];
    
    try {
      await testBackendConnection();
    } catch (error) {
      logs.push('[ERROR] Test failed: ' + error);
    }
    
    setTestResults(logs);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Backend Connection Test</h1>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-6">
            <button
              onClick={runTests}
              disabled={loading}
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
            >
              {loading ? 'Running Tests...' : 'Run Connection Tests'}
            </button>
          </div>
          
          <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm overflow-auto max-h-96">
            {testResults.length === 0 ? (
              <div className="text-gray-500">Click "Run Connection Tests" to start...</div>
            ) : (
              testResults.map((result, index) => (
                <div key={index} className={result.includes('[ERROR]') ? 'text-red-400' : ''}>
                  {result}
                </div>
              ))
            )}
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded">
            <h3 className="font-semibold mb-2">Test Information:</h3>
            <ul className="text-sm space-y-1">
              <li>• Backend URL: http://localhost:8080</li>
              <li>• Test credentials: admin / password123</li>
              <li>• Make sure the backend is running on port 8080</li>
              <li>• Check browser console for detailed logs</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestBackend;