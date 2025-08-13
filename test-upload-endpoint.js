const fetch = require('node-fetch');

async function testUploadEndpoint() {
  try {
    console.log('Testing upload service health...');
    
    // Test health endpoint
    const healthResponse = await fetch('http://localhost:5002/health');
    const healthData = await healthResponse.json();
    console.log('Health check:', healthData);
    
    // Test media endpoint (should fail without auth but show the service is running)
    console.log('\nTesting media endpoint...');
    const mediaResponse = await fetch('http://localhost:5002/api/media/user');
    const mediaData = await mediaResponse.text();
    console.log('Media endpoint response status:', mediaResponse.status);
    console.log('Media endpoint response:', mediaData);
    
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testUploadEndpoint();
