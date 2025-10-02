-- Migration: Analytics and Trending Tables
-- Description: Track trends, popular content, and statistics

-- ============================================
-- TRENDING_BOOKS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS trending_books (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  period_type TEXT NOT NULL, -- 'daily', 'weekly', 'monthly'
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  play_count INTEGER DEFAULT 0,
  unique_listeners INTEGER DEFAULT 0,
  completion_rate DECIMAL(5,2) DEFAULT 0.0,
  rank INTEGER,
  score DECIMAL(10,2) DEFAULT 0.0, -- weighted score
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(book_id, period_type, period_start)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_trending_period ON trending_books(period_type, period_start);
CREATE INDEX IF NOT EXISTS idx_trending_rank ON trending_books(period_type, rank);
CREATE INDEX IF NOT EXISTS idx_trending_book ON trending_books(book_id);

-- ============================================
-- BOOK_STATS TABLE (Aggregated statistics)
-- ============================================
CREATE TABLE IF NOT EXISTS book_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE UNIQUE,
  total_plays INTEGER DEFAULT 0,
  total_likes INTEGER DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  total_bookmarks INTEGER DEFAULT 0,
  unique_listeners INTEGER DEFAULT 0,
  avg_completion_rate DECIMAL(5,2) DEFAULT 0.0,
  last_calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_book_stats_book ON book_stats(book_id);
CREATE INDEX IF NOT EXISTS idx_book_stats_plays ON book_stats(total_plays DESC);
CREATE INDEX IF NOT EXISTS idx_book_stats_likes ON book_stats(total_likes DESC);

-- ============================================
-- USER_STATS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS user_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  total_books_completed INTEGER DEFAULT 0,
  total_listening_time INTEGER DEFAULT 0, -- in seconds
  total_books_started INTEGER DEFAULT 0,
  favorite_category_id UUID REFERENCES categories(id),
  streak_days INTEGER DEFAULT 0,
  last_activity_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_stats_user ON user_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_user_stats_streak ON user_stats(streak_days DESC);

-- ============================================
-- DAILY_STATS TABLE (System-wide daily metrics)
-- ============================================
CREATE TABLE IF NOT EXISTS daily_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  stat_date DATE NOT NULL UNIQUE,
  total_plays INTEGER DEFAULT 0,
  unique_listeners INTEGER DEFAULT 0,
  new_users INTEGER DEFAULT 0,
  total_listening_time INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index
CREATE INDEX IF NOT EXISTS idx_daily_stats_date ON daily_stats(stat_date DESC);

-- ============================================
-- TRIGGERS
-- ============================================
DROP TRIGGER IF EXISTS update_trending_books_updated_at ON trending_books;
CREATE TRIGGER update_trending_books_updated_at
  BEFORE UPDATE ON trending_books
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_book_stats_updated_at ON book_stats;
CREATE TRIGGER update_book_stats_updated_at
  BEFORE UPDATE ON book_stats
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_stats_updated_at ON user_stats;
CREATE TRIGGER update_user_stats_updated_at
  BEFORE UPDATE ON user_stats
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- FUNCTION TO INCREMENT BOOK STATS
-- ============================================
CREATE OR REPLACE FUNCTION increment_book_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Initialize stats if not exists
  INSERT INTO book_stats (book_id)
  VALUES (NEW.book_id)
  ON CONFLICT (book_id) DO NOTHING;
  
  -- Increment play count
  IF TG_TABLE_NAME = 'plays' THEN
    UPDATE book_stats
    SET 
      total_plays = total_plays + 1,
      last_calculated_at = NOW()
    WHERE book_id = NEW.book_id;
  END IF;
  
  -- Increment likes count
  IF TG_TABLE_NAME = 'likes' THEN
    UPDATE book_stats
    SET 
      total_likes = total_likes + 1,
      last_calculated_at = NOW()
    WHERE book_id = NEW.book_id;
  END IF;
  
  -- Increment reviews count
  IF TG_TABLE_NAME = 'reviews' THEN
    UPDATE book_stats
    SET 
      total_reviews = total_reviews + 1,
      last_calculated_at = NOW()
    WHERE book_id = NEW.book_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS increment_stats_on_play ON plays;
CREATE TRIGGER increment_stats_on_play
  AFTER INSERT ON plays
  FOR EACH ROW
  EXECUTE FUNCTION increment_book_stats();

DROP TRIGGER IF EXISTS increment_stats_on_like ON likes;
CREATE TRIGGER increment_stats_on_like
  AFTER INSERT ON likes
  FOR EACH ROW
  EXECUTE FUNCTION increment_book_stats();

DROP TRIGGER IF EXISTS increment_stats_on_review ON reviews;
CREATE TRIGGER increment_stats_on_review
  AFTER INSERT ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION increment_book_stats();

-- ============================================
-- FUNCTION TO DECREMENT BOOK STATS
-- ============================================
CREATE OR REPLACE FUNCTION decrement_book_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_TABLE_NAME = 'likes' THEN
    UPDATE book_stats
    SET 
      total_likes = GREATEST(0, total_likes - 1),
      last_calculated_at = NOW()
    WHERE book_id = OLD.book_id;
  END IF;
  
  IF TG_TABLE_NAME = 'reviews' THEN
    UPDATE book_stats
    SET 
      total_reviews = GREATEST(0, total_reviews - 1),
      last_calculated_at = NOW()
    WHERE book_id = OLD.book_id;
  END IF;
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS decrement_stats_on_unlike ON likes;
CREATE TRIGGER decrement_stats_on_unlike
  AFTER DELETE ON likes
  FOR EACH ROW
  EXECUTE FUNCTION decrement_book_stats();

DROP TRIGGER IF EXISTS decrement_stats_on_review_delete ON reviews;
CREATE TRIGGER decrement_stats_on_review_delete
  AFTER DELETE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION decrement_book_stats();

