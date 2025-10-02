-- Migration: Playlist Tables
-- Description: User playlists and collections

-- ============================================
-- PLAYLISTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS playlists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  cover_url TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  is_collaborative BOOLEAN DEFAULT FALSE,
  total_items INTEGER DEFAULT 0,
  total_duration INTEGER DEFAULT 0, -- in seconds
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_playlists_user ON playlists(user_id);
CREATE INDEX IF NOT EXISTS idx_playlists_public ON playlists(is_public);
CREATE INDEX IF NOT EXISTS idx_playlists_created ON playlists(created_at DESC);

-- ============================================
-- PLAYLIST_ITEMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS playlist_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  playlist_id UUID NOT NULL REFERENCES playlists(id) ON DELETE CASCADE,
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  position INTEGER NOT NULL,
  added_by UUID REFERENCES auth.users(id),
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(playlist_id, book_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_playlist_items_playlist ON playlist_items(playlist_id);
CREATE INDEX IF NOT EXISTS idx_playlist_items_book ON playlist_items(book_id);
CREATE INDEX IF NOT EXISTS idx_playlist_items_position ON playlist_items(playlist_id, position);

-- ============================================
-- PLAYLIST_FOLLOWERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS playlist_followers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  playlist_id UUID NOT NULL REFERENCES playlists(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(playlist_id, user_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_playlist_followers_playlist ON playlist_followers(playlist_id);
CREATE INDEX IF NOT EXISTS idx_playlist_followers_user ON playlist_followers(user_id);

-- ============================================
-- TRIGGERS
-- ============================================
DROP TRIGGER IF EXISTS update_playlists_updated_at ON playlists;
CREATE TRIGGER update_playlists_updated_at
  BEFORE UPDATE ON playlists
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- FUNCTION TO UPDATE PLAYLIST STATS
-- ============================================
CREATE OR REPLACE FUNCTION update_playlist_stats()
RETURNS TRIGGER AS $$
DECLARE
  v_playlist_id UUID;
BEGIN
  v_playlist_id := COALESCE(NEW.playlist_id, OLD.playlist_id);
  
  UPDATE playlists
  SET 
    total_items = (SELECT COUNT(*) FROM playlist_items WHERE playlist_id = v_playlist_id),
    total_duration = (
      SELECT COALESCE(SUM(b.total_duration), 0)
      FROM playlist_items pi
      JOIN books b ON pi.book_id = b.id
      WHERE pi.playlist_id = v_playlist_id
    ),
    updated_at = NOW()
  WHERE id = v_playlist_id;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_playlist_stats_on_item_change ON playlist_items;
CREATE TRIGGER update_playlist_stats_on_item_change
  AFTER INSERT OR DELETE ON playlist_items
  FOR EACH ROW
  EXECUTE FUNCTION update_playlist_stats();

