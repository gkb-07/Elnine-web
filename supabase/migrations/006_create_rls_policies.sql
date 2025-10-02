-- Migration: Row Level Security Policies
-- Description: Enable RLS and create security policies

-- ============================================
-- ENABLE RLS ON ALL TABLES
-- ============================================
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE creators ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_creators ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE plays ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_helpful ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE playlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE playlist_followers ENABLE ROW LEVEL SECURITY;

-- ============================================
-- BOOKS POLICIES
-- ============================================
-- Public read access for published books
CREATE POLICY "Anyone can view published books"
  ON books FOR SELECT
  USING (is_published = TRUE);

-- Admins can do everything (create function for admin check)
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid()
    AND raw_user_meta_data->>'role' = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE POLICY "Admins can do everything with books"
  ON books FOR ALL
  USING (is_admin());

-- ============================================
-- CHAPTERS POLICIES
-- ============================================
CREATE POLICY "Anyone can view published chapters"
  ON chapters FOR SELECT
  USING (
    is_published = TRUE 
    AND EXISTS (
      SELECT 1 FROM books 
      WHERE id = chapters.book_id 
      AND is_published = TRUE
    )
  );

CREATE POLICY "Admins can manage chapters"
  ON chapters FOR ALL
  USING (is_admin());

-- ============================================
-- CATEGORIES POLICIES
-- ============================================
CREATE POLICY "Anyone can view active categories"
  ON categories FOR SELECT
  USING (is_active = TRUE);

CREATE POLICY "Admins can manage categories"
  ON categories FOR ALL
  USING (is_admin());

-- ============================================
-- CREATORS POLICIES
-- ============================================
CREATE POLICY "Anyone can view creators"
  ON creators FOR SELECT
  USING (TRUE);

CREATE POLICY "Admins can manage creators"
  ON creators FOR ALL
  USING (is_admin());

-- ============================================
-- BOOK_CREATORS POLICIES
-- ============================================
CREATE POLICY "Anyone can view book creators"
  ON book_creators FOR SELECT
  USING (TRUE);

CREATE POLICY "Admins can manage book creators"
  ON book_creators FOR ALL
  USING (is_admin());

-- ============================================
-- LIKES POLICIES
-- ============================================
CREATE POLICY "Users can view their own likes"
  ON likes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own likes"
  ON likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own likes"
  ON likes FOR DELETE
  USING (auth.uid() = user_id);

-- Anyone can see like counts (for stats)
CREATE POLICY "Anyone can count likes"
  ON likes FOR SELECT
  USING (TRUE);

-- ============================================
-- PLAYS POLICIES
-- ============================================
CREATE POLICY "Users can view their own plays"
  ON plays FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert their own plays"
  ON plays FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Admins can view all plays (for analytics)
CREATE POLICY "Admins can view all plays"
  ON plays FOR SELECT
  USING (is_admin());

-- ============================================
-- USER_PROGRESS POLICIES
-- ============================================
CREATE POLICY "Users can view their own progress"
  ON user_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress"
  ON user_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
  ON user_progress FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own progress"
  ON user_progress FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- REVIEWS POLICIES
-- ============================================
CREATE POLICY "Anyone can view reviews"
  ON reviews FOR SELECT
  USING (TRUE);

CREATE POLICY "Users can insert their own reviews"
  ON reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews"
  ON reviews FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews"
  ON reviews FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- REVIEW_HELPFUL POLICIES
-- ============================================
CREATE POLICY "Anyone can view review helpful"
  ON review_helpful FOR SELECT
  USING (TRUE);

CREATE POLICY "Users can mark reviews as helpful"
  ON review_helpful FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unmark reviews as helpful"
  ON review_helpful FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- BOOKMARKS POLICIES
-- ============================================
CREATE POLICY "Users can view their own bookmarks"
  ON bookmarks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own bookmarks"
  ON bookmarks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookmarks"
  ON bookmarks FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookmarks"
  ON bookmarks FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- PLAYLISTS POLICIES
-- ============================================
CREATE POLICY "Anyone can view public playlists"
  ON playlists FOR SELECT
  USING (is_public = TRUE);

CREATE POLICY "Users can view their own playlists"
  ON playlists FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own playlists"
  ON playlists FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own playlists"
  ON playlists FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own playlists"
  ON playlists FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- PLAYLIST_ITEMS POLICIES
-- ============================================
CREATE POLICY "Anyone can view public playlist items"
  ON playlist_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM playlists 
      WHERE id = playlist_items.playlist_id 
      AND is_public = TRUE
    )
  );

CREATE POLICY "Users can view their own playlist items"
  ON playlist_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM playlists 
      WHERE id = playlist_items.playlist_id 
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage their own playlist items"
  ON playlist_items FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM playlists 
      WHERE id = playlist_items.playlist_id 
      AND user_id = auth.uid()
    )
  );

-- ============================================
-- PLAYLIST_FOLLOWERS POLICIES
-- ============================================
CREATE POLICY "Anyone can view playlist followers"
  ON playlist_followers FOR SELECT
  USING (TRUE);

CREATE POLICY "Users can follow playlists"
  ON playlist_followers FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unfollow playlists"
  ON playlist_followers FOR DELETE
  USING (auth.uid() = user_id);


