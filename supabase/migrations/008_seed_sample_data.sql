-- Migration: Sample Data
-- Description: Insert sample data for testing (OPTIONAL - Remove in production)

-- ============================================
-- SAMPLE CATEGORIES
-- ============================================
-- Flexible insert based on available columns
DO $$
DECLARE
  has_description BOOLEAN;
  has_icon BOOLEAN;
  has_is_active BOOLEAN;
BEGIN
  -- Check which columns exist
  has_description := EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'categories' AND column_name = 'description');
  has_icon := EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'categories' AND column_name = 'icon');
  has_is_active := EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'categories' AND column_name = 'is_active');
  
  -- Insert based on available columns
  IF has_description AND has_icon AND has_is_active THEN
    INSERT INTO categories (name, slug, description, icon, is_active) VALUES
    ('Fiction', 'fiction', 'Fictional stories and novels', '📚', true),
    ('Mystery', 'mystery', 'Mystery and thriller books', '🔍', true),
    ('Romance', 'romance', 'Romance and love stories', '💕', true),
    ('Science Fiction', 'science-fiction', 'Sci-fi and futuristic tales', '🚀', true),
    ('Fantasy', 'fantasy', 'Fantasy and magical worlds', '🧙', true),
    ('Biography', 'biography', 'Life stories and biographies', '👤', true),
    ('Self-Help', 'self-help', 'Personal development books', '💪', true),
    ('History', 'history', 'Historical books and accounts', '📜', true),
    ('Business', 'business', 'Business and entrepreneurship', '💼', true),
    ('Technology', 'technology', 'Tech and programming books', '💻', true)
    ON CONFLICT (slug) DO NOTHING;
  ELSIF has_is_active THEN
    INSERT INTO categories (name, slug, is_active) VALUES
    ('Fiction', 'fiction', true),
    ('Mystery', 'mystery', true),
    ('Romance', 'romance', true),
    ('Science Fiction', 'science-fiction', true),
    ('Fantasy', 'fantasy', true),
    ('Biography', 'biography', true),
    ('Self-Help', 'self-help', true),
    ('History', 'history', true),
    ('Business', 'business', true),
    ('Technology', 'technology', true)
    ON CONFLICT (slug) DO NOTHING;
  ELSE
    -- Minimal insert with just name and slug
    INSERT INTO categories (name, slug) VALUES
    ('Fiction', 'fiction'),
    ('Mystery', 'mystery'),
    ('Romance', 'romance'),
    ('Science Fiction', 'science-fiction'),
    ('Fantasy', 'fantasy'),
    ('Biography', 'biography'),
    ('Self-Help', 'self-help'),
    ('History', 'history'),
    ('Business', 'business'),
    ('Technology', 'technology')
    ON CONFLICT (slug) DO NOTHING;
  END IF;
END $$;

-- ============================================
-- SAMPLE CREATORS
-- ============================================
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'creators') THEN
    INSERT INTO creators (name, bio) VALUES
    ('Herman Melville', 'American novelist, short story writer, and poet of the American Renaissance period'),
    ('Jeff VanderMeer', 'American author, editor, and literary critic'),
    ('Jane Austen', 'English novelist known for her six major novels'),
    ('J.R.R. Tolkien', 'English writer, poet, and philologist'),
    ('Agatha Christie', 'English writer known for her detective novels')
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- ============================================
-- SAMPLE BOOKS
-- ============================================
-- Note: Replace cover_url with actual Supabase storage URLs after upload
DO $$
DECLARE
  v_fiction_id UUID;
  v_mystery_id UUID;
  v_moby_dick_id UUID;
  v_authority_id UUID;
BEGIN
  -- Get category IDs
  SELECT id INTO v_fiction_id FROM categories WHERE slug = 'fiction';
  SELECT id INTO v_mystery_id FROM categories WHERE slug = 'mystery';
  
  -- Insert Moby Dick
  INSERT INTO books (title, author, description, category_id, cover_url, is_featured, is_published)
  VALUES (
    'Moby Dick',
    'Herman Melville',
    'A classic tale of obsession and adventure on the high seas.',
    v_fiction_id,
    'https://m.media-amazon.com/images/I/616R20nvohL._AC_UF1000,1000_QL80_.jpg',
    true,
    true
  )
  RETURNING id INTO v_moby_dick_id;
  
  -- Insert Authority
  INSERT INTO books (title, author, description, category_id, cover_url, is_featured, is_published)
  VALUES (
    'Authority',
    'Jeff VanderMeer',
    'The Southern Reach Trilogy continues with this suspenseful and atmospheric novel.',
    v_mystery_id,
    'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1370073128i/17945018.jpg',
    true,
    true
  )
  RETURNING id INTO v_authority_id;
  
  -- Insert sample chapters for Moby Dick
  INSERT INTO chapters (book_id, title, chapter_number, audio_url, duration, lyrics) VALUES
  (v_moby_dick_id, 'Chapter 1: Loomings', 1, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', 930, 
   '[{"time": 0, "text": "Welcome to this audio chapter"}, {"time": 5, "text": "Listen as the story unfolds"}]'::jsonb),
  (v_moby_dick_id, 'Chapter 2: The Carpet-Bag', 2, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', 765, 
   '[{"time": 0, "text": "Each word brings a new adventure"}]'::jsonb),
  (v_moby_dick_id, 'Chapter 3: The Spouter-Inn', 3, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', 1100, 
   '[{"time": 0, "text": "Through lands both new and old"}]'::jsonb);
  
  -- Insert sample chapters for Authority
  INSERT INTO chapters (book_id, title, chapter_number, audio_url, duration, lyrics) VALUES
  (v_authority_id, 'Chapter 1: Orientation', 1, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', 980, 
   '[{"time": 0, "text": "The narrator voice guides you"}]'::jsonb),
  (v_authority_id, 'Chapter 2: Control', 2, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', 875, 
   '[{"time": 0, "text": "Through every twist and turn"}]'::jsonb);
  
  -- Initialize book stats
  INSERT INTO book_stats (book_id) VALUES (v_moby_dick_id), (v_authority_id);
  
END $$;

-- ============================================
-- NOTE: After running migrations
-- ============================================
-- 1. Upload actual audio files to 'audio' bucket
-- 2. Upload book covers to 'covers' bucket
-- 3. Update audio_url and cover_url in books/chapters tables
-- 4. Remove or modify this seed data for production

