// Service status check
console.log('🔍 Checking service status...');

async function checkServiceHealth() {
  const services = [
    { name: 'API Gateway', url: 'http://localhost:5000/health' },
    { name: 'Design Service', url: 'http://localhost:5001/health' },
    { name: 'Upload Service', url: 'http://localhost:5002/health' },
    { name: 'Subscription Service', url: 'http://localhost:5003/health' },
    { name: 'Frontend', url: 'http://localhost:3000' }
  ];

  for (const service of services) {
    try {
      const response = await fetch(service.url);
      if (response.ok) {
        const data = service.name === 'Frontend' ? { status: 'OK' } : await response.json();
        console.log(`✅ ${service.name}: ${data.status || 'Running'}`);
      } else {
        console.log(`❌ ${service.name}: HTTP ${response.status}`);
      }
    } catch (error) {
      console.log(`❌ ${service.name}: ${error.message}`);
    }
  }
}

checkServiceHealth();
