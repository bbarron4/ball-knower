-- Update schema for Weekly Picks + Confidence + Trivia system

-- Add spreads and closing lines to games table
ALTER TABLE games ADD COLUMN IF NOT EXISTS spread DECIMAL(4,1);
ALTER TABLE games ADD COLUMN IF NOT EXISTS closing_spread DECIMAL(4,1);
ALTER TABLE games ADD COLUMN IF NOT EXISTS home_team_favorite BOOLEAN DEFAULT true;

-- Create weekly_picks table for user picks with confidence
CREATE TABLE IF NOT EXISTS weekly_picks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    challenge_id UUID NOT NULL REFERENCES weekly_challenges(id) ON DELETE CASCADE,
    game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
    selection VARCHAR(10) NOT NULL CHECK (selection IN ('FAV', 'DOG')),
    line_shown DECIMAL(4,1) NOT NULL,
    confidence INTEGER NOT NULL CHECK (confidence >= 1 AND confidence <= 10),
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, game_id)
);

-- Create weekly_trivia_answers table
CREATE TABLE IF NOT EXISTS weekly_trivia_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    challenge_id UUID NOT NULL REFERENCES weekly_challenges(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES trivia_questions(id) ON DELETE CASCADE,
    source_pool VARCHAR(20) NOT NULL CHECK (source_pool IN ('BALL_TRIVIA', 'COLLEGE_GUESSER')),
    is_correct BOOLEAN NOT NULL,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, question_id)
);

-- Create weekly_entries table (receipt object)
CREATE TABLE IF NOT EXISTS weekly_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    challenge_id UUID NOT NULL REFERENCES weekly_challenges(id) ON DELETE CASCADE,
    week VARCHAR(10) NOT NULL, -- Format: "2024-W5"
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, challenge_id)
);

-- Create weekly_results table for computed scores
CREATE TABLE IF NOT EXISTS weekly_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    challenge_id UUID NOT NULL REFERENCES weekly_challenges(id) ON DELETE CASCADE,
    week VARCHAR(10) NOT NULL,
    pick_points INTEGER DEFAULT 0,
    trivia_points INTEGER DEFAULT 0,
    bonus_points INTEGER DEFAULT 0,
    total_points INTEGER DEFAULT 0,
    rank INTEGER,
    computed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, challenge_id)
);

-- Create picks_leaderboard table for cumulative picks scoring
CREATE TABLE IF NOT EXISTS picks_leaderboard (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    total_pick_points INTEGER DEFAULT 0,
    total_trivia_points INTEGER DEFAULT 0,
    total_bonus_points INTEGER DEFAULT 0,
    total_points INTEGER DEFAULT 0,
    weeks_played INTEGER DEFAULT 0,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_weekly_picks_user_challenge ON weekly_picks(user_id, challenge_id);
CREATE INDEX IF NOT EXISTS idx_weekly_trivia_user_challenge ON weekly_trivia_answers(user_id, challenge_id);
CREATE INDEX IF NOT EXISTS idx_weekly_entries_user_challenge ON weekly_entries(user_id, challenge_id);
CREATE INDEX IF NOT EXISTS idx_weekly_results_challenge ON weekly_results(challenge_id);
CREATE INDEX IF NOT EXISTS idx_weekly_results_rank ON weekly_results(rank);
CREATE INDEX IF NOT EXISTS idx_picks_leaderboard_points ON picks_leaderboard(total_points DESC);

-- Update existing games with sample spreads
UPDATE games SET 
    spread = CASE 
        WHEN home_team = 'Chiefs' THEN -3.5
        WHEN home_team = 'Cowboys' THEN -7.0
        WHEN home_team = 'Ravens' THEN -1.5
        ELSE 0.0
    END,
    home_team_favorite = CASE 
        WHEN home_team IN ('Chiefs', 'Cowboys', 'Ravens') THEN true
        ELSE false
    END
WHERE spread IS NULL;
