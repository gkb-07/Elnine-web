-- Migration: User Interaction Tables
-- Description: Likes, Plays, Progress, and Reviews

-- ============================================
-- LIKES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, book_id)
);

-- Add missing columns if table already exists
DO $$ 
BEGIN
  -- Check if user_id exists, if not add it
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'likes' AND column_name = 'user_id') THEN
    ALTER TABLE likes ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
  
  -- Check if book_id exists, if not add it
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'likes' AND column_name = 'book_id') THEN
    ALTER TABLE likes ADD COLUMN book_id UUID REFERENCES books(id) ON DELETE CASCADE;
  END IF;
  
  -- Check if created_at exists, if not add it
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'likes' AND column_name = 'created_at') THEN
    ALTER TABLE likes ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
  END IF;
END $$;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_likes_user ON likes(user_id);
CREATE INDEX IF NOT EXISTS idx_likes_book ON likes(book_id);
CREATE INDEX IF NOT EXISTS idx_likes_created ON likes(created_at DESC);

-- ============================================
-- PLAYS TABLE (Listening History)
-- ============================================
CREATE TABLE IF NOT EXISTS plays (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  chapter_id UUID REFERENCES chapters(id) ON DELETE CASCADE,
  played_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  listen_duration INTEGER DEFAULT 0, -- seconds listened
  completed BOOLEAN DEFAULT FALSE,
  device_info JSONB, -- optional: {"platform": "web", "browser": "Chrome"}
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add missing columns if table already exists
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'plays' AND column_name = 'user_id') THEN
    ALTER TABLE plays ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'plays' AND column_name = 'book_id') THEN
    ALTER TABLE plays ADD COLUMN book_id UUID REFERENCES books(id) ON DELETE CASCADE;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'plays' AND column_name = 'chapter_id') THEN
    ALTER TABLE plays ADD COLUMN chapter_id UUID REFERENCES chapters(id) ON DELETE CASCADE;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'plays' AND column_name = 'played_at') THEN
    ALTER TABLE plays ADD COLUMN played_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'plays' AND column_name = 'listen_duration') THEN
    ALTER TABLE plays ADD COLUMN listen_duration INTEGER DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'plays' AND column_name = 'completed') THEN
    ALTER TABLE plays ADD COLUMN completed BOOLEAN DEFAULT FALSE;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'plays' AND column_name = 'device_info') THEN
    ALTER TABLE plays ADD COLUMN device_info JSONB;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'plays' AND column_name = 'created_at') THEN
    ALTER TABLE plays ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
  END IF;
END $$;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_plays_user ON plays(user_id);
CREATE INDEX IF NOT EXISTS idx_plays_book ON plays(book_id);
CREATE INDEX IF NOT EXISTS idx_plays_chapter ON plays(chapter_id);
CREATE INDEX IF NOT EXISTS idx_plays_date ON plays(played_at DESC);
CREATE INDEX IF NOT EXISTS idx_plays_completed ON plays(completed);

-- ============================================
-- USER_PROGRESS TABLE (Resume playback)
-- ============================================
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  chapter_id UUID NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
  current_position INTEGER DEFAULT 0, -- seconds into the chapter
  completed_chapters INTEGER DEFAULT 0,
  total_listen_time INTEGER DEFAULT 0, -- total seconds listened
  last_played_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, book_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_progress_user ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_book ON user_progress(book_id);
CREATE INDEX IF NOT EXISTS idx_progress_last_played ON user_progress(last_played_at DESC);

-- ============================================
-- REVIEWS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT,
  is_verified_purchase BOOLEAN DEFAULT FALSE,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, book_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_reviews_book ON reviews(book_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);
CREATE INDEX IF NOT EXISTS idx_reviews_created ON reviews(created_at DESC);

-- ============================================
-- REVIEW_HELPFUL TABLE (Users marking reviews as helpful)
-- ============================================
CREATE TABLE IF NOT EXISTS review_helpful (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  review_id UUID NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(review_id, user_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_review_helpful_review ON review_helpful(review_id);
CREATE INDEX IF NOT EXISTS idx_review_helpful_user ON review_helpful(user_id);

-- ============================================
-- BOOKMARKS TABLE (Favorite moments)
-- ============================================
CREATE TABLE IF NOT EXISTS bookmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  chapter_id UUID NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
  timestamp INTEGER NOT NULL, -- seconds into chapter
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_bookmarks_user ON bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_book ON bookmarks(book_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_chapter ON bookmarks(chapter_id);

-- ============================================
-- TRIGGERS
-- ============================================
DROP TRIGGER IF EXISTS update_user_progress_updated_at ON user_progress;
CREATE TRIGGER update_user_progress_updated_at
  BEFORE UPDATE ON user_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_reviews_updated_at ON reviews;
CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- FUNCTION TO UPDATE REVIEW HELPFUL COUNT
-- ============================================
CREATE OR REPLACE FUNCTION update_review_helpful_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE reviews
    SET helpful_count = helpful_count + 1
    WHERE id = NEW.review_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE reviews
    SET helpful_count = helpful_count - 1
    WHERE id = OLD.review_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_helpful_count_on_insert ON review_helpful;
CREATE TRIGGER update_helpful_count_on_insert
  AFTER INSERT ON review_helpful
  FOR EACH ROW
  EXECUTE FUNCTION update_review_helpful_count();

DROP TRIGGER IF EXISTS update_helpful_count_on_delete ON review_helpful;
CREATE TRIGGER update_helpful_count_on_delete
  AFTER DELETE ON review_helpful
  FOR EACH ROW
  EXECUTE FUNCTION update_review_helpful_count();

-- ============================================
-- FUNCTION TO UPDATE BOOK RATING
-- ============================================
CREATE OR REPLACE FUNCTION update_book_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE books
  SET rating = (
    SELECT ROUND(AVG(rating)::numeric, 2)
    FROM reviews
    WHERE book_id = COALESCE(NEW.book_id, OLD.book_id)
  )
  WHERE id = COALESCE(NEW.book_id, OLD.book_id);
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_book_rating_on_review ON reviews;
CREATE TRIGGER update_book_rating_on_review
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_book_rating();

