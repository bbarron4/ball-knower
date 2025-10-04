// Test script to verify picks submission and leaderboard functionality
const API_URL = 'http://localhost:3001/api';

async function testSubmission() {
    try {
        console.log('🧪 Testing picks submission...');
        
        // First, let's get the current games
        const gamesResponse = await fetch(`${API_URL}/picks/games/current`);
        const gamesData = await gamesResponse.json();
        
        console.log('📋 Current games:', gamesData.games?.length || 0);
        
        if (gamesData.games && gamesData.games.length > 0) {
            // Create test picks (all favorites for simplicity)
            const picks = gamesData.games.map(game => ({
                gameId: game.id,
                selection: 'FAV'
            }));
            
            console.log('🎯 Test picks created:', picks.length);
            
            // Test submission (this will fail without auth, but we can see the structure)
            const submitResponse = await fetch(`${API_URL}/picks/submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    picks: picks,
                    triviaAnswers: []
                })
            });
            
            const submitData = await submitResponse.json();
            console.log('📤 Submission response:', submitData);
        }
        
    } catch (error) {
        console.error('❌ Test failed:', error);
    }
}

async function testLeaderboard() {
    try {
        console.log('🏆 Testing leaderboard...');
        
        // Get current challenge
        const challengeResponse = await fetch(`${API_URL}/challenges/current`);
        const challengeData = await challengeResponse.json();
        
        if (challengeData.challenge) {
            const challengeId = challengeData.challenge.id;
            console.log('📊 Challenge ID:', challengeId);
            
            // Test leaderboard endpoint
            const leaderboardResponse = await fetch(`${API_URL}/leaderboards/${challengeId}/global`);
            const leaderboardData = await leaderboardResponse.json();
            
            console.log('🏆 Leaderboard data:', leaderboardData);
        }
        
    } catch (error) {
        console.error('❌ Leaderboard test failed:', error);
    }
}

// Run tests
async function runTests() {
    console.log('🚀 Starting Ball Knower tests...\n');
    
    await testSubmission();
    console.log('\n' + '='.repeat(50) + '\n');
    await testLeaderboard();
    
    console.log('\n✅ Tests completed!');
}

runTests();
