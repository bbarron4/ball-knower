import { query } from './src/config/database.js';

async function runSimpleMigration() {
    try {
        console.log('🔄 Running user stats migration...');
        
        // Create user_stats table
        console.log('📊 Creating user_stats table...');
        await query(`
            CREATE TABLE IF NOT EXISTS user_stats (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                total_games INTEGER DEFAULT 0,
                total_questions_answered INTEGER DEFAULT 0,
                total_correct_answers INTEGER DEFAULT 0,
                best_streak INTEGER DEFAULT 0,
                current_streak INTEGER DEFAULT 0,
                average_score DECIMAL(5,2) DEFAULT 0.00,
                total_score INTEGER DEFAULT 0,
                last_played_at TIMESTAMP WITH TIME ZONE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(user_id)
            )
        `);
        console.log('✅ user_stats table created');
        
        // Create game_sessions table
        console.log('📊 Creating game_sessions table...');
        await query(`
            CREATE TABLE IF NOT EXISTS game_sessions (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                game_mode VARCHAR(20) NOT NULL,
                sport VARCHAR(10) NOT NULL,
                questions_answered INTEGER DEFAULT 0,
                correct_answers INTEGER DEFAULT 0,
                final_score INTEGER DEFAULT 0,
                streak INTEGER DEFAULT 0,
                started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                completed_at TIMESTAMP WITH TIME ZONE,
                is_completed BOOLEAN DEFAULT false
            )
        `);
        console.log('✅ game_sessions table created');
        
        // Create indexes
        console.log('📊 Creating indexes...');
        await query('CREATE INDEX IF NOT EXISTS idx_user_stats_user ON user_stats(user_id)');
        await query('CREATE INDEX IF NOT EXISTS idx_user_stats_best_streak ON user_stats(best_streak DESC)');
        await query('CREATE INDEX IF NOT EXISTS idx_user_stats_total_games ON user_stats(total_games DESC)');
        await query('CREATE INDEX IF NOT EXISTS idx_game_sessions_user ON game_sessions(user_id)');
        await query('CREATE INDEX IF NOT EXISTS idx_game_sessions_mode ON game_sessions(game_mode)');
        await query('CREATE INDEX IF NOT EXISTS idx_game_sessions_sport ON game_sessions(sport)');
        await query('CREATE INDEX IF NOT EXISTS idx_game_sessions_completed ON game_sessions(is_completed)');
        console.log('✅ Indexes created');
        
        console.log('✅ Migration completed successfully!');
        console.log('📊 Created tables: user_stats, game_sessions');
        console.log('🔧 Created indexes for performance');
        
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

runSimpleMigration();
