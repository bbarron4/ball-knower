import { query } from './src/config/database.js';

async function debugDatabase() {
    try {
        console.log('🔍 Debugging database...\n');
        
        // Check challenges
        const challengesResult = await query('SELECT * FROM weekly_challenges ORDER BY created_at DESC LIMIT 5');
        console.log('📊 Challenges:', challengesResult.rows);
        
        // Check games
        const gamesResult = await query('SELECT * FROM games ORDER BY created_at DESC LIMIT 5');
        console.log('🏈 Games:', gamesResult.rows);
        
        // Check specific challenge games
        const challengeId = 'd03fa52a-ce82-4e47-bf1f-0bcb60022db6';
        const challengeGamesResult = await query(
            'SELECT * FROM games WHERE challenge_id = $1 ORDER BY created_at DESC',
            [challengeId]
        );
        console.log(`🎯 Games for challenge ${challengeId}:`, challengeGamesResult.rows);
        
    } catch (error) {
        console.error('❌ Database debug failed:', error);
    }
}

debugDatabase();
