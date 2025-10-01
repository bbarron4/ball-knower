-- Ball Knower Database Schema
-- PostgreSQL 14+

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    display_name VARCHAR(100),
    favorite_team VARCHAR(50),
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    is_admin BOOLEAN DEFAULT false
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_created_at ON users(created_at DESC);

-- Weekly challenges table
CREATE TABLE IF NOT EXISTS weekly_challenges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    week_number INTEGER NOT NULL,
    season INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'open', 'locked', 'archived')),
    opens_at TIMESTAMP WITH TIME ZONE NOT NULL,
    locks_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(season, week_number)
);

CREATE INDEX idx_challenges_status ON weekly_challenges(status);
CREATE INDEX idx_challenges_locks_at ON weekly_challenges(locks_at);

-- Games table
CREATE TABLE IF NOT EXISTS games (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    challenge_id UUID NOT NULL REFERENCES weekly_challenges(id) ON DELETE CASCADE,
    home_team VARCHAR(50) NOT NULL,
    away_team VARCHAR(50) NOT NULL,
    kickoff_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_marquee BOOLEAN DEFAULT true,
    final_home_score INTEGER,
    final_away_score INTEGER,
    winner VARCHAR(10) CHECK (winner IN ('home', 'away', 'draw')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_games_challenge ON games(challenge_id);
CREATE INDEX idx_games_kickoff ON games(kickoff_at);

-- Picks table
CREATE TABLE IF NOT EXISTS picks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
    selection VARCHAR(10) NOT NULL CHECK (selection IN ('home', 'away')),
    confidence INTEGER CHECK (confidence BETWEEN 1 AND 10),
    locked_at TIMESTAMP WITH TIME ZONE,
    is_correct BOOLEAN,
    points_awarded INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, game_id)
);

CREATE INDEX idx_picks_user ON picks(user_id);
CREATE INDEX idx_picks_game ON picks(game_id);
CREATE INDEX idx_picks_locked ON picks(locked_at);

-- Trivia questions table
CREATE TABLE IF NOT EXISTS trivia_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    challenge_id UUID NOT NULL REFERENCES weekly_challenges(id) ON DELETE CASCADE,
    prompt TEXT NOT NULL,
    choices JSONB NOT NULL,
    correct_index INTEGER NOT NULL CHECK (correct_index BETWEEN 0 AND 3),
    difficulty VARCHAR(10) DEFAULT 'med' CHECK (difficulty IN ('easy', 'med', 'hard')),
    tags JSONB,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_trivia_challenge ON trivia_questions(challenge_id);
CREATE INDEX idx_trivia_active ON trivia_questions(active);

-- Trivia attempts table
CREATE TABLE IF NOT EXISTS trivia_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    challenge_id UUID NOT NULL REFERENCES weekly_challenges(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES trivia_questions(id) ON DELETE CASCADE,
    answer_index INTEGER CHECK (answer_index BETWEEN 0 AND 3),
    correct BOOLEAN NOT NULL,
    response_ms INTEGER NOT NULL,
    points_awarded INTEGER DEFAULT 0,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, challenge_id, question_id)
);

CREATE INDEX idx_trivia_attempts_user ON trivia_attempts(user_id);
CREATE INDEX idx_trivia_attempts_challenge ON trivia_attempts(challenge_id);
CREATE INDEX idx_trivia_attempts_submitted ON trivia_attempts(submitted_at);

-- Leaderboards table (combined picks + trivia)
CREATE TABLE IF NOT EXISTS leaderboards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    challenge_id UUID NOT NULL REFERENCES weekly_challenges(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    picks_points INTEGER DEFAULT 0,
    trivia_points INTEGER DEFAULT 0,
    total_points INTEGER DEFAULT 0,
    rank INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(challenge_id, user_id)
);

CREATE INDEX idx_leaderboards_challenge ON leaderboards(challenge_id);
CREATE INDEX idx_leaderboards_rank ON leaderboards(challenge_id, rank);
CREATE INDEX idx_leaderboards_total_points ON leaderboards(total_points DESC);

-- Trivia-only leaderboards table
CREATE TABLE IF NOT EXISTS leaderboards_trivia (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    challenge_id UUID NOT NULL REFERENCES weekly_challenges(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    trivia_points INTEGER DEFAULT 0,
    attempts_count INTEGER DEFAULT 0,
    rank INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(challenge_id, user_id)
);

CREATE INDEX idx_leaderboards_trivia_challenge ON leaderboards_trivia(challenge_id);
CREATE INDEX idx_leaderboards_trivia_rank ON leaderboards_trivia(challenge_id, rank);

-- Streaks table
CREATE TABLE IF NOT EXISTS streaks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    current_pick_streak INTEGER DEFAULT 0,
    best_pick_streak INTEGER DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_streaks_user ON streaks(user_id);

-- Badges table
CREATE TABLE IF NOT EXISTS badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert default badges
INSERT INTO badges (code, name, description, icon) VALUES
('PERFECT_WEEK', 'Perfect Week', 'Got all picks correct in a week', '🎯'),
('TRIVIA_MASTER', 'Trivia Master', 'Answered all 3 trivia questions correctly', '🧠'),
('UPSET_SLAYER', 'Upset Slayer', 'Correctly picked an upset (< 25% picked)', '⚡'),
('HOT_HAND', 'Hot Hand', 'Current winning streak of 8+', '🔥'),
('FIRST_WEEK', 'First Week', 'Completed your first weekly challenge', '🌟'),
('CONSISTENT', 'Consistent', 'Participated in 4 consecutive weeks', '💪'),
('TOP_10', 'Top 10', 'Finished in the top 10 of the leaderboard', '🏆'),
('SPEED_DEMON', 'Speed Demon', 'Answered all trivia in under 5 seconds each', '⚡')
ON CONFLICT (code) DO NOTHING;

-- User badges table
CREATE TABLE IF NOT EXISTS user_badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    badge_code VARCHAR(50) NOT NULL REFERENCES badges(code) ON DELETE CASCADE,
    awarded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB,
    UNIQUE(user_id, badge_code)
);

CREATE INDEX idx_user_badges_user ON user_badges(user_id);
CREATE INDEX idx_user_badges_awarded ON user_badges(awarded_at DESC);

-- Groups (private leagues) table
CREATE TABLE IF NOT EXISTS groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    invite_code VARCHAR(20) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_groups_owner ON groups(owner_user_id);
CREATE INDEX idx_groups_invite_code ON groups(invite_code);

-- Group members table
CREATE TABLE IF NOT EXISTS group_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(20) DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(group_id, user_id)
);

CREATE INDEX idx_group_members_group ON group_members(group_id);
CREATE INDEX idx_group_members_user ON group_members(user_id);

-- Communication preferences table
CREATE TABLE IF NOT EXISTS comm_prefs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    email_opt_in BOOLEAN DEFAULT true,
    sms_opt_in BOOLEAN DEFAULT false,
    push_opt_in BOOLEAN DEFAULT true,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    channel VARCHAR(20) NOT NULL CHECK (channel IN ('email', 'web_push', 'sms')),
    template_code VARCHAR(50) NOT NULL,
    payload JSONB,
    scheduled_for TIMESTAMP WITH TIME ZONE NOT NULL,
    sent_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) DEFAULT 'queued' CHECK (status IN ('queued', 'sent', 'failed')),
    error TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_scheduled ON notifications(scheduled_for);
CREATE INDEX idx_notifications_status ON notifications(status);

-- Analytics events table
CREATE TABLE IF NOT EXISTS events_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    event VARCHAR(100) NOT NULL,
    properties JSONB,
    occurred_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_events_user ON events_analytics(user_id);
CREATE INDEX idx_events_event ON events_analytics(event);
CREATE INDEX idx_events_occurred ON events_analytics(occurred_at DESC);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_challenges_updated_at BEFORE UPDATE ON weekly_challenges FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_games_updated_at BEFORE UPDATE ON games FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_picks_updated_at BEFORE UPDATE ON picks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_trivia_questions_updated_at BEFORE UPDATE ON trivia_questions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_leaderboards_updated_at BEFORE UPDATE ON leaderboards FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_streaks_updated_at BEFORE UPDATE ON streaks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_comm_prefs_updated_at BEFORE UPDATE ON comm_prefs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

