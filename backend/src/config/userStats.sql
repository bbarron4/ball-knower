-- User Statistics Table for tracking general game performance
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
);

CREATE INDEX idx_user_stats_user ON user_stats(user_id);
CREATE INDEX idx_user_stats_best_streak ON user_stats(best_streak DESC);
CREATE INDEX idx_user_stats_total_games ON user_stats(total_games DESC);

-- Game Sessions Table for tracking individual game sessions
CREATE TABLE IF NOT EXISTS game_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    game_mode VARCHAR(20) NOT NULL, -- 'trivia', 'college', 'jersey'
    sport VARCHAR(10) NOT NULL, -- 'nfl', 'nba', 'both'
    questions_answered INTEGER DEFAULT 0,
    correct_answers INTEGER DEFAULT 0,
    final_score INTEGER DEFAULT 0,
    streak INTEGER DEFAULT 0,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE,
    is_completed BOOLEAN DEFAULT false
);

CREATE INDEX idx_game_sessions_user ON game_sessions(user_id);
CREATE INDEX idx_game_sessions_mode ON game_sessions(game_mode);
CREATE INDEX idx_game_sessions_sport ON game_sessions(sport);
CREATE INDEX idx_game_sessions_completed ON game_sessions(is_completed);

-- Function to update user stats after a game session
CREATE OR REPLACE FUNCTION update_user_stats_after_game()
RETURNS TRIGGER AS $$
BEGIN
    -- Only update stats when a game session is completed
    IF NEW.is_completed = true AND (OLD.is_completed = false OR OLD.is_completed IS NULL) THEN
        -- Insert or update user stats
        INSERT INTO user_stats (user_id, total_games, total_questions_answered, total_correct_answers, 
                               best_streak, current_streak, average_score, total_score, last_played_at)
        VALUES (NEW.user_id, 1, NEW.questions_answered, NEW.correct_answers, 
                NEW.streak, NEW.streak, NEW.final_score, NEW.final_score, NEW.completed_at)
        ON CONFLICT (user_id) 
        DO UPDATE SET
            total_games = user_stats.total_games + 1,
            total_questions_answered = user_stats.total_questions_answered + NEW.questions_answered,
            total_correct_answers = user_stats.total_correct_answers + NEW.correct_answers,
            best_streak = GREATEST(user_stats.best_streak, NEW.streak),
            current_streak = CASE 
                WHEN NEW.correct_answers = NEW.questions_answered THEN user_stats.current_streak + 1
                ELSE 0
            END,
            total_score = user_stats.total_score + NEW.final_score,
            average_score = (user_stats.total_score + NEW.final_score)::DECIMAL / (user_stats.total_games + 1),
            last_played_at = NEW.completed_at,
            updated_at = CURRENT_TIMESTAMP;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update user stats when a game session is completed
CREATE TRIGGER update_user_stats_trigger
    AFTER UPDATE ON game_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_user_stats_after_game();

-- Apply updated_at trigger to user_stats table
CREATE TRIGGER update_user_stats_updated_at 
    BEFORE UPDATE ON user_stats 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
