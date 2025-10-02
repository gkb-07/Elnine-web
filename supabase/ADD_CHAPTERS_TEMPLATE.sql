-- ============================================
-- HOW TO ADD CHAPTERS WITH AUDIO
-- ============================================
-- 1. Upload audio files to Supabase Storage → audio bucket
-- 2. Organize them in folders: audio/moby-dick/, audio/authority/, etc.
-- 3. Get the public URLs for each audio file
-- 4. Replace the values below with your actual data
-- 5. Run this script in Supabase SQL Editor

-- ============================================
-- FIRST: Get your book IDs
-- ============================================
SELECT id, title FROM books;

-- Copy the IDs and paste them below!

-- ============================================
-- EXAMPLE: Add chapters for Moby Dick
-- ============================================
-- Replace 'YOUR_MOBY_DICK_BOOK_ID' with actual ID from above query

INSERT INTO chapters (book_id, title, chapter_number, audio_url, duration, is_published) VALUES
('YOUR_MOBY_DICK_BOOK_ID', 'Chapter 1: Loomings', 1, 'PASTE_AUDIO_URL_HERE', 930, true),
('YOUR_MOBY_DICK_BOOK_ID', 'Chapter 2: The Carpet-Bag', 2, 'PASTE_AUDIO_URL_HERE', 765, true),
('YOUR_MOBY_DICK_BOOK_ID', 'Chapter 3: The Spouter-Inn', 3, 'PASTE_AUDIO_URL_HERE', 1100, true);

-- ============================================
-- EXAMPLE: Add chapters for Authority
-- ============================================
-- Replace 'YOUR_AUTHORITY_BOOK_ID' with actual ID from above query

INSERT INTO chapters (book_id, title, chapter_number, audio_url, duration, is_published) VALUES
('YOUR_AUTHORITY_BOOK_ID', 'Chapter 1: Orientation', 1, 'PASTE_AUDIO_URL_HERE', 980, true),
('YOUR_AUTHORITY_BOOK_ID', 'Chapter 2: Control', 2, 'PASTE_AUDIO_URL_HERE', 875, true);

-- ============================================
-- EXAMPLE: Add chapters for test book
-- ============================================
-- Replace 'YOUR_TEST_BOOK_ID' with actual ID from above query

INSERT INTO chapters (book_id, title, chapter_number, audio_url, duration, is_published) VALUES
('YOUR_TEST_BOOK_ID', 'Chapter 1: Introduction', 1, 'PASTE_AUDIO_URL_HERE', 600, true);

-- ============================================
-- VERIFY YOUR CHAPTERS
-- ============================================
SELECT 
  b.title as book_title,
  c.chapter_number,
  c.title as chapter_title,
  c.audio_url,
  c.duration
FROM chapters c
JOIN books b ON c.book_id = b.id
ORDER BY b.title, c.chapter_number;

-- ============================================
-- URL FORMAT EXAMPLES:
-- ============================================
-- audio_url = 'https://mksobwvgtnkzjafohldp.supabase.co/storage/v1/object/public/audio/moby-dick/chapter-1.mp3'
-- audio_url = 'https://mksobwvgtnkzjafohldp.supabase.co/storage/v1/object/public/audio/authority/chapter-1.mp3'

-- ============================================
-- DURATION CALCULATOR:
-- ============================================
-- Convert minutes:seconds to total seconds:
-- 15:30 = (15 * 60) + 30 = 930
-- 12:45 = (12 * 60) + 45 = 765
-- 18:20 = (18 * 60) + 20 = 1100


