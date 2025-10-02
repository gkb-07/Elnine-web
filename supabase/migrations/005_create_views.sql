-- Migration: Useful Views
-- Description: Pre-computed views for common queries

-- ============================================
-- VIEW: Books with Stats
-- ============================================
CREATE OR REPLACE VIEW books_with_stats AS
SELECT 
  b.*,
  COALESCE(bs.total_plays, 0) as total_plays,
  COALESCE(bs.total_likes, 0) as total_likes,
  COALESCE(bs.total_reviews, 0) as total_reviews,
  COALESCE(bs.unique_listeners, 0) as unique_listeners,
  c.name as category_name,
  c.slug as category_slug
FROM books b
LEFT JOIN book_stats bs ON b.id = bs.book_id
LEFT JOIN categories c ON b.category_id = c.id
WHERE b.is_published = TRUE;

-- ============================================
-- VIEW: Trending This Week
-- ============================================
CREATE OR REPLACE VIEW trending_this_week AS
SELECT 
  b.*,
  COUNT(DISTINCT p.user_id) as unique_listeners,
  COUNT(p.*) as play_count
FROM books b
LEFT JOIN plays p ON b.id = p.book_id 
  AND p.played_at >= CURRENT_DATE - INTERVAL '7 days'
WHERE b.is_published = TRUE
GROUP BY b.id
ORDER BY play_count DESC, unique_listeners DESC
LIMIT 50;

-- ============================================
-- VIEW: Most Liked Books
-- ============================================
CREATE OR REPLACE VIEW most_liked_books AS
SELECT 
  b.*,
  COUNT(l.*) as like_count
FROM books b
LEFT JOIN likes l ON b.id = l.book_id
WHERE b.is_published = TRUE
GROUP BY b.id
ORDER BY like_count DESC
LIMIT 50;

-- ============================================
-- VIEW: Top Rated Books
-- ============================================
CREATE OR REPLACE VIEW top_rated_books AS
SELECT 
  b.*,
  COALESCE(AVG(r.rating), 0) as avg_rating,
  COUNT(r.*) as review_count
FROM books b
LEFT JOIN reviews r ON b.id = r.book_id
WHERE b.is_published = TRUE
GROUP BY b.id
HAVING COUNT(r.*) >= 5 -- At least 5 reviews
ORDER BY avg_rating DESC, review_count DESC
LIMIT 50;

-- ============================================
-- VIEW: Recently Added Books
-- ============================================
CREATE OR REPLACE VIEW recently_added_books AS
SELECT 
  b.*,
  COALESCE(bs.total_plays, 0) as total_plays,
  COALESCE(bs.total_likes, 0) as total_likes
FROM books b
LEFT JOIN book_stats bs ON b.id = bs.book_id
WHERE b.is_published = TRUE
ORDER BY b.created_at DESC
LIMIT 50;

-- ============================================
-- VIEW: Featured Books
-- ============================================
CREATE OR REPLACE VIEW featured_books AS
SELECT 
  b.*,
  COALESCE(bs.total_plays, 0) as total_plays,
  COALESCE(bs.total_likes, 0) as total_likes,
  c.name as category_name
FROM books b
LEFT JOIN book_stats bs ON b.id = bs.book_id
LEFT JOIN categories c ON b.category_id = c.id
WHERE b.is_featured = TRUE AND b.is_published = TRUE
ORDER BY b.created_at DESC;

-- ============================================
-- VIEW: User Library (For logged-in users)
-- ============================================
CREATE OR REPLACE VIEW user_library AS
SELECT 
  up.user_id,
  b.*,
  up.chapter_id as current_chapter_id,
  ch.title as current_chapter_title,
  ch.chapter_number as current_chapter_number,
  up.current_position,
  up.completed_chapters,
  up.total_listen_time,
  up.last_played_at,
  ROUND((up.completed_chapters::DECIMAL / NULLIF(b.total_chapters, 0) * 100), 2) as progress_percentage
FROM user_progress up
JOIN books b ON up.book_id = b.id
LEFT JOIN chapters ch ON up.chapter_id = ch.id
WHERE b.is_published = TRUE;

-- ============================================
-- VIEW: User Liked Books
-- ============================================
CREATE OR REPLACE VIEW user_liked_books AS
SELECT 
  l.user_id,
  b.*,
  l.created_at as liked_at
FROM likes l
JOIN books b ON l.book_id = b.id
WHERE b.is_published = TRUE
ORDER BY l.created_at DESC;

-- ============================================
-- VIEW: Popular Categories
-- ============================================
CREATE OR REPLACE VIEW popular_categories AS
SELECT 
  c.*,
  COUNT(DISTINCT b.id) as book_count,
  COUNT(DISTINCT p.user_id) as listener_count,
  COUNT(p.*) as total_plays
FROM categories c
LEFT JOIN books b ON c.id = b.category_id AND b.is_published = TRUE
LEFT JOIN plays p ON b.id = p.book_id
WHERE c.is_active = TRUE
GROUP BY c.id
ORDER BY book_count DESC, total_plays DESC;

-- ============================================
-- VIEW: Book Details with Full Info
-- ============================================
CREATE OR REPLACE VIEW book_details AS
SELECT 
  b.*,
  COALESCE(bs.total_plays, 0) as total_plays,
  COALESCE(bs.total_likes, 0) as total_likes,
  COALESCE(bs.total_reviews, 0) as total_reviews,
  c.name as category_name,
  c.slug as category_slug,
  COALESCE(
    json_agg(
      DISTINCT jsonb_build_object(
        'id', cr.id,
        'name', cr.name,
        'role', bc.role
      )
    ) FILTER (WHERE cr.id IS NOT NULL),
    '[]'
  ) as creators
FROM books b
LEFT JOIN book_stats bs ON b.id = bs.book_id
LEFT JOIN categories c ON b.category_id = c.id
LEFT JOIN book_creators bc ON b.id = bc.book_id
LEFT JOIN creators cr ON bc.creator_id = cr.id
WHERE b.is_published = TRUE
GROUP BY b.id, bs.total_plays, bs.total_likes, bs.total_reviews, c.name, c.slug;

-- ============================================
-- VIEW: Chapter List with Book Info
-- ============================================
CREATE OR REPLACE VIEW chapters_with_book_info AS
SELECT 
  ch.*,
  b.title as book_title,
  b.author as book_author,
  b.cover_url as book_cover_url
FROM chapters ch
JOIN books b ON ch.book_id = b.id
WHERE ch.is_published = TRUE AND b.is_published = TRUE
ORDER BY ch.book_id, ch.chapter_number;

