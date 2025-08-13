// Test script to verify all services are working
async function testAllServices() {
  console.log('🚀 Testing Canva Clone Services...\n');

  // Test API Gateway Health
  try {
    console.log('1. Testing API Gateway...');
    const gatewayResponse = await fetch('http://localhost:5000/health');
    const gatewayData = await gatewayResponse.json();
    console.log('✅ API Gateway:', gatewayData);
  } catch (error) {
    console.log('❌ API Gateway failed:', error.message);
  }

  // Test Design Service
  try {
    console.log('\n2. Testing Design Service...');
    const designResponse = await fetch('http://localhost:5001/health');
    const designData = await designResponse.json();
    console.log('✅ Design Service:', designData);
  } catch (error) {
    console.log('❌ Design Service failed:', error.message);
  }

  // Test Upload Service
  try {
    console.log('\n3. Testing Upload Service...');
    const uploadResponse = await fetch('http://localhost:5002/health');
    const uploadData = await uploadResponse.json();
    console.log('✅ Upload Service:', uploadData);
  } catch (error) {
    console.log('❌ Upload Service failed:', error.message);
  }

  // Test Subscription Service
  try {
    console.log('\n4. Testing Subscription Service...');
    const subResponse = await fetch('http://localhost:5003/health');
    const subData = await subResponse.json();
    console.log('✅ Subscription Service:', subData);
  } catch (error) {
    console.log('❌ Subscription Service failed:', error.message);
  }

  // Test Frontend
  try {
    console.log('\n5. Testing Frontend...');
    const frontendResponse = await fetch('http://localhost:3000');
    if (frontendResponse.ok) {
      console.log('✅ Frontend is accessible');
    } else {
      console.log('❌ Frontend returned status:', frontendResponse.status);
    }
  } catch (error) {
    console.log('❌ Frontend failed:', error.message);
  }

  console.log('\n🎉 Service testing complete!');
  console.log('\n📋 Next Steps:');
  console.log('1. Open http://localhost:3000 in your browser');
  console.log('2. Login with Google');
  console.log('3. Create a new design');
  console.log('4. Test upload functionality in the sidebar');
  console.log('5. Test AI image generation in the sidebar');
}

testAllServices();
