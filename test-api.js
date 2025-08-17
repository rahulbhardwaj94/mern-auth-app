const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

// Test data
const testUser = {
  email: 'rhlbhrdwj3@gmail.com',
  firstName: 'Rahul',
  lastName: 'Bhardwaj',
  mobileNumber: '+1234567890',
  password: 'password123'
};

let authToken = '';

async function testAPIs() {
  try {
    console.log('🧪 Starting API Tests...\n');

    // Test 1: Health Check
    console.log('1️⃣ Testing Health Endpoint...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health Check:', healthResponse.data);
    console.log('');

    // Test 2: Send OTP
    console.log('2️⃣ Testing OTP Sending...');
    const otpResponse = await axios.post(`${BASE_URL}/auth/send-otp`, {
      email: testUser.email,
      firstName: testUser.firstName
    });
    console.log('✅ OTP Sent:', otpResponse.data);
    console.log('');

    // Test 3: Verify OTP (you'll need to get the actual OTP from console/email)
    console.log('3️⃣ Testing OTP Verification...');
    console.log('⚠️  Note: You need to get the actual OTP from console/email first');
    console.log('   Then update the otp value in this script and run again');
    console.log('');

    // Test 4: Login (after user is created)
    console.log('4️⃣ Testing Login...');
    try {
      const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
        email: testUser.email,
        password: testUser.password
      });
      console.log('✅ Login Successful:', loginResponse.data);
      authToken = loginResponse.data.token;
      console.log('');
    } catch (error) {
      console.log('❌ Login Failed (expected if user not created yet):', error.response?.data?.message || error.message);
      console.log('');
    }

    // Test 5: Get User Profile (if logged in)
    if (authToken) {
      console.log('5️⃣ Testing Protected Route - Get Profile...');
      try {
        const profileResponse = await axios.get(`${BASE_URL}/user/profile`, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        console.log('✅ Profile Retrieved:', profileResponse.data);
        console.log('');
      } catch (error) {
        console.log('❌ Profile Retrieval Failed:', error.response?.data?.message || error.message);
        console.log('');
      }
    }

    console.log('🎉 API Tests Completed!');

  } catch (error) {
    console.error('❌ Test Failed:', error.response?.data || error.message);
  }
}

// Run tests
testAPIs();
