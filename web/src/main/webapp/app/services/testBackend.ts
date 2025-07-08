// Test script to verify backend connectivity

const API_BASE_URL = 'http://localhost:8080/api';

export const testBackendConnection = async () => {
  console.log('Testing backend connection...');
  
  try {
    // Test 1: Health check
    console.log('1. Testing health endpoint...');
    const healthResponse = await fetch(`${API_BASE_URL}/health`);
    const healthData = await healthResponse.json();
    console.log('Health check response:', healthData);
    
    // Test 2: Login with test credentials
    console.log('\n2. Testing login endpoint...');
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
      console.log('Login successful:', loginData);
      
      // Test 3: Validate token
      console.log('\n3. Testing token validation...');
      const validateResponse = await fetch(`${API_BASE_URL}/auth/validate`, {
        headers: {
          'Authorization': `Bearer ${loginData.token}`
        }
      });
      
      if (validateResponse.ok) {
        const validateData = await validateResponse.json();
        console.log('Token validation successful:', validateData);
      } else {
        console.error('Token validation failed:', validateResponse.status);
      }
      
    } else {
      console.error('Login failed:', loginResponse.status, await loginResponse.text());
    }
    
  } catch (error) {
    console.error('Connection error:', error);
  }
};

// Add to window for easy console testing
if (typeof window !== 'undefined') {
  (window as any).testBackend = testBackendConnection;
}