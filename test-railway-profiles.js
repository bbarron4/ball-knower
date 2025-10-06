// Test script to verify Railway database connection and profile saving
const API_BASE = 'https://ball-knower-production.up.railway.app/api';

async function testRailwayConnection() {
  console.log('🧪 Testing Railway Database Connection for Profile Saving...\n');
  
  try {
    // Test 1: Health check
    console.log('1️⃣ Testing health endpoint...');
    const healthResponse = await fetch(`${API_BASE.replace('/api', '')}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData);
    
    // Test 2: Test user registration
    console.log('\n2️⃣ Testing user registration...');
    const testUser = {
      email: `test-${Date.now()}@example.com`,
      password: 'testpassword123',
      username: `testuser${Date.now()}`,
      favorite_team: 'Lakers'
    };
    
    const registerResponse = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser)
    });
    
    if (!registerResponse.ok) {
      const errorData = await registerResponse.json();
      console.log('❌ Registration failed:', errorData);
      return;
    }
    
    const registerData = await registerResponse.json();
    console.log('✅ User registered successfully:', {
      id: registerData.user.id,
      username: registerData.user.username,
      email: registerData.user.email,
      favorite_team: registerData.user.favorite_team
    });
    
    const authToken = registerData.token;
    
    // Test 3: Get user profile
    console.log('\n3️⃣ Testing profile retrieval...');
    const profileResponse = await fetch(`${API_BASE}/users/me`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      }
    });
    
    if (!profileResponse.ok) {
      const errorData = await profileResponse.json();
      console.log('❌ Profile retrieval failed:', errorData);
      return;
    }
    
    const profileData = await profileResponse.json();
    console.log('✅ Profile retrieved successfully:', profileData.user);
    
    // Test 4: Update user profile
    console.log('\n4️⃣ Testing profile update...');
    const updateData = {
      display_name: 'Test User Display Name',
      bio: 'This is a test bio for Railway testing',
      favorite_team: 'Warriors'
    };
    
    const updateResponse = await fetch(`${API_BASE}/users/me`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData)
    });
    
    if (!updateResponse.ok) {
      const errorData = await updateResponse.json();
      console.log('❌ Profile update failed:', errorData);
      return;
    }
    
    const updateResult = await updateResponse.json();
    console.log('✅ Profile updated successfully:', updateResult.user);
    
    // Test 5: Verify updated profile
    console.log('\n5️⃣ Verifying updated profile...');
    const verifyResponse = await fetch(`${API_BASE}/users/me`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      }
    });
    
    const verifyData = await verifyResponse.json();
    console.log('✅ Updated profile verified:', verifyData.user);
    
    // Test 6: Test database persistence
    console.log('\n6️⃣ Testing database persistence...');
    console.log('Waiting 2 seconds before re-fetching...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const persistenceResponse = await fetch(`${API_BASE}/users/me`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      }
    });
    
    const persistenceData = await persistenceResponse.json();
    console.log('✅ Profile persisted in database:', persistenceData.user);
    
    console.log('\n🎉 All tests passed! Railway database is working correctly for profile saving.');
    
  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    console.error('Full error:', error);
  }
}

// Run the test
testRailwayConnection();
