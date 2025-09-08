-- Resilience Rituals Database Schema
-- Run this in your Supabase SQL editor to set up the database

-- Users table
CREATE TABLE users (
  userId TEXT PRIMARY KEY,
  farcasterId TEXT,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  streakCount INTEGER DEFAULT 0,
  totalPoints INTEGER DEFAULT 0,
  badgesEarned TEXT[] DEFAULT '{}',
  isPremium BOOLEAN DEFAULT FALSE,
  activeRituals TEXT[] DEFAULT '{}'
);

-- Rituals table
CREATE TABLE rituals (
  ritualId TEXT PRIMARY KEY,
  userId TEXT REFERENCES users(userId) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'mindfulness',
  frequency TEXT DEFAULT 'daily',
  completedToday BOOLEAN DEFAULT FALSE,
  streak INTEGER DEFAULT 0,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  lastCompleted TIMESTAMP WITH TIME ZONE
);

-- Sessions table (ritual completions)
CREATE TABLE sessions (
  sessionId TEXT PRIMARY KEY,
  userId TEXT REFERENCES users(userId) ON DELETE CASCADE,
  ritualId TEXT REFERENCES rituals(ritualId) ON DELETE CASCADE,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  moodBefore INTEGER,
  moodAfter INTEGER,
  notes TEXT
);

-- Badges table
CREATE TABLE badges (
  badgeId TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  imageUrl TEXT,
  condition JSONB
);

-- User badges junction table
CREATE TABLE user_badges (
  userId TEXT REFERENCES users(userId) ON DELETE CASCADE,
  badgeId TEXT REFERENCES badges(badgeId) ON DELETE CASCADE,
  earnedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (userId, badgeId)
);

-- Insert default badges
INSERT INTO badges (badgeId, name, description, imageUrl) VALUES
('early_bird', 'Early Bird', '7-day morning ritual streak', '/badges/early-bird.svg'),
('mindful_master', 'Mindful Master', 'Complete 50 mindfulness rituals', '/badges/mindful-master.svg'),
('consistency_champion', 'Consistency Champion', '30-day streak achieved', '/badges/consistency-champion.svg'),
('resilience_warrior', 'Resilience Warrior', '100 rituals completed', '/badges/resilience-warrior.svg'),
('point_collector', 'Point Collector', '500 points earned', '/badges/point-collector.svg');

-- Create indexes for better performance
CREATE INDEX idx_rituals_user_id ON rituals(userId);
CREATE INDEX idx_sessions_user_id ON sessions(userId);
CREATE INDEX idx_sessions_ritual_id ON sessions(ritualId);
CREATE INDEX idx_sessions_timestamp ON sessions(timestamp);
CREATE INDEX idx_user_badges_user_id ON user_badges(userId);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE rituals ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

-- Create policies (users can only access their own data)
-- Note: These policies assume you're using Supabase Auth
-- If using wallet-based auth, you'll need to modify these

-- Users policies
CREATE POLICY "Users can view own data" ON users 
  FOR SELECT USING (auth.uid()::text = userId);
CREATE POLICY "Users can insert own data" ON users 
  FOR INSERT WITH CHECK (auth.uid()::text = userId);
CREATE POLICY "Users can update own data" ON users 
  FOR UPDATE USING (auth.uid()::text = userId);

-- Rituals policies
CREATE POLICY "Users can view own rituals" ON rituals 
  FOR SELECT USING (auth.uid()::text = userId);
CREATE POLICY "Users can insert own rituals" ON rituals 
  FOR INSERT WITH CHECK (auth.uid()::text = userId);
CREATE POLICY "Users can update own rituals" ON rituals 
  FOR UPDATE USING (auth.uid()::text = userId);
CREATE POLICY "Users can delete own rituals" ON rituals 
  FOR DELETE USING (auth.uid()::text = userId);

-- Sessions policies
CREATE POLICY "Users can view own sessions" ON sessions 
  FOR SELECT USING (auth.uid()::text = userId);
CREATE POLICY "Users can insert own sessions" ON sessions 
  FOR INSERT WITH CHECK (auth.uid()::text = userId);

-- User badges policies
CREATE POLICY "Users can view own badges" ON user_badges 
  FOR SELECT USING (auth.uid()::text = userId);
CREATE POLICY "Users can insert own badges" ON user_badges 
  FOR INSERT WITH CHECK (auth.uid()::text = userId);

-- Badges are public (read-only)
CREATE POLICY "Anyone can view badges" ON badges 
  FOR SELECT USING (true);

-- Functions for common operations

-- Function to reset daily ritual completion status
CREATE OR REPLACE FUNCTION reset_daily_rituals()
RETURNS void AS $$
BEGIN
  UPDATE rituals 
  SET completedToday = false 
  WHERE frequency = 'daily' 
    AND lastCompleted < CURRENT_DATE;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate user streak
CREATE OR REPLACE FUNCTION calculate_user_streak(user_id TEXT)
RETURNS INTEGER AS $$
DECLARE
  streak_count INTEGER := 0;
  check_date DATE := CURRENT_DATE;
BEGIN
  -- Count consecutive days with at least one ritual completion
  LOOP
    IF EXISTS (
      SELECT 1 FROM sessions 
      WHERE userId = user_id 
        AND DATE(timestamp) = check_date
    ) THEN
      streak_count := streak_count + 1;
      check_date := check_date - INTERVAL '1 day';
    ELSE
      EXIT;
    END IF;
  END LOOP;
  
  RETURN streak_count;
END;
$$ LANGUAGE plpgsql;

-- Function to award badge to user
CREATE OR REPLACE FUNCTION award_badge(user_id TEXT, badge_id TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  INSERT INTO user_badges (userId, badgeId)
  VALUES (user_id, badge_id)
  ON CONFLICT (userId, badgeId) DO NOTHING;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update user streak when session is created
CREATE OR REPLACE FUNCTION update_user_streak()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE users 
  SET streakCount = calculate_user_streak(NEW.userId)
  WHERE userId = NEW.userId;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_user_streak
  AFTER INSERT ON sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_user_streak();

-- Create a scheduled job to reset daily rituals (if using pg_cron extension)
-- SELECT cron.schedule('reset-daily-rituals', '0 0 * * *', 'SELECT reset_daily_rituals();');

-- Sample data for testing (optional)
-- Uncomment to insert sample data

/*
-- Sample user
INSERT INTO users (userId, streakCount, totalPoints) VALUES
('0x1234567890123456789012345678901234567890', 5, 150);

-- Sample rituals
INSERT INTO rituals (ritualId, userId, name, description, category) VALUES
('ritual_1', '0x1234567890123456789012345678901234567890', 'Morning Gratitude', 'Write down 3 things you are grateful for', 'mindfulness'),
('ritual_2', '0x1234567890123456789012345678901234567890', 'Deep Breathing', '5 minutes of mindful breathing', 'wellness'),
('ritual_3', '0x1234567890123456789012345678901234567890', 'Positive Affirmation', 'Repeat your personal power statement', 'mindset');

-- Sample sessions
INSERT INTO sessions (sessionId, userId, ritualId, moodBefore, moodAfter, notes) VALUES
('session_1', '0x1234567890123456789012345678901234567890', 'ritual_1', 2, 4, 'Felt much better after reflecting on positive things'),
('session_2', '0x1234567890123456789012345678901234567890', 'ritual_2', 3, 4, 'Breathing exercise was very calming');
*/
