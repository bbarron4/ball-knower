// Debug script to check games and challenge status
const API_URL = 'http://localhost:3001/api';

async function debugGames() {
    try {
        console.log('🔍 Debugging games and challenge status...\n');
        
        // Check challenge status directly
        const challengeResponse = await fetch(`${API_URL}/challenges/current`);
        const challengeData = await challengeResponse.json();
        
        console.log('📊 Challenge data:', challengeData);
        
        if (challengeData.challenge) {
            const challengeId = challengeData.challenge.id;
            console.log('\n🎯 Challenge ID:', challengeId);
            console.log('📅 Week:', challengeData.challenge.week_number);
            console.log('🏆 Season:', challengeData.challenge.season);
            console.log('🔓 Status:', challengeData.challenge.status);
            
            // Try to get games directly from database via admin endpoint
            const gamesResponse = await fetch(`${API_URL}/admin/games/week/1`);
            const gamesData = await gamesResponse.json();
            
            console.log('\n🏈 Games data:', gamesData);
        }
        
    } catch (error) {
        console.error('❌ Debug failed:', error);
    }
}

debugGames();
