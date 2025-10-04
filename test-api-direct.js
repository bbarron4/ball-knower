// Direct API test
const API_URL = 'http://localhost:3001/api';

async function testAPI() {
    try {
        console.log('🧪 Testing API directly...\n');
        
        const response = await fetch(`${API_URL}/picks/games/current`);
        const data = await response.json();
        
        console.log('📊 Response status:', response.status);
        console.log('📋 Response data:', JSON.stringify(data, null, 2));
        
    } catch (error) {
        console.error('❌ API test failed:', error);
    }
}

testAPI();
