const http = require('http');

// Test backend connectivity
function checkBackend() {
  console.log('🔍 Checking backend connectivity...\n');
  
  const options = {
    hostname: 'localhost',
    port: 8080,
    path: '/authenticate',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    }
  };

  const testData = JSON.stringify({
    username: 'broker1',
    password: 'password'
  });

  const req = http.request(options, (res) => {
    console.log(`Status Code: ${res.statusCode}`);
    console.log(`Status Message: ${res.statusMessage}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('\nResponse:');
      console.log(data);
      
      if (res.statusCode === 200) {
        console.log('\n✅ Backend is running and authentication endpoint is working!');
      } else {
        console.log('\n❌ Backend returned an error');
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ Backend connection failed:', error.message);
    console.log('\nPlease ensure:');
    console.log('1. Backend is running on port 8080');
    console.log('2. Run: ./gradlew bootRun -Dspring.profiles.active=local');
    console.log('3. PostgreSQL is running (docker compose up)');
  });

  req.write(testData);
  req.end();
}

checkBackend();