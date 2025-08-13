// Test script to verify backend connectivity

const API_BASE_URL = 'http://localhost:8080/api';

export const testBackendConnection = async () => {
  
  try {
    // Test 1: Health check
    const healthResponse = await fetch(`${API_BASE_URL}/health`);
    const healthData = await healthResponse.json();
    
    // Test 2: Login with test credentials
    const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'admin',
        password: 'password123'
      })
    });
    
    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      
      // Test 3: Validate token
      const validateResponse = await fetch(`${API_BASE_URL}/auth/validate`, {
        headers: {
          'Authorization': `Bearer ${loginData.token}`
        }
      });
      
      if (validateResponse.ok) {
        const validateData = await validateResponse.json();
      } else {
      }
      
    } else {
    }
    
  } catch (error) {
  }
};

// Add to window for easy console testing
if (typeof window !== 'undefined') {
  (window as any).testBackend = testBackendConnection;
}