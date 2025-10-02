-- ============================================
-- HOW TO USE THIS FILE:
-- ============================================
-- 1. Upload your 3 cover images to Supabase Storage → covers bucket
-- 2. Get the public URLs for each image
-- 3. Replace the URLs below with your actual URLs
-- 4. Run this script in Supabase SQL Editor

-- ============================================
-- STEP 1: UPDATE COVER IMAGES FOR YOUR BOOKS
-- ============================================

-- Update Moby Dick cover
UPDATE books 
SET cover_url = 'PASTE_YOUR_MOBY_DICK_COVER_URL_HERE'
WHERE title = 'Moby Dick';

-- Update Authority cover
UPDATE books 
SET cover_url = 'PASTE_YOUR_AUTHORITY_COVER_URL_HERE'
WHERE title = 'Authority';

-- Update test book cover
UPDATE books 
SET cover_url = 'PASTE_YOUR_TEST_BOOK_COVER_URL_HERE'
WHERE title = 'test';

-- ============================================
-- VERIFY YOUR CHANGES
-- ============================================
SELECT id, title, author, cover_url 
FROM books 
ORDER BY title;

-- ============================================
-- EXAMPLE - What the URLs should look like:
-- ============================================
-- cover_url = 'https://mksobwvgtnkzjafohldp.supabase.co/storage/v1/object/public/covers/moby-dick.jpg'
-- cover_url = 'https://mksobwvgtnkzjafohldp.supabase.co/storage/v1/object/public/covers/authority.jpg'
-- cover_url = 'https://mksobwvgtnkzjafohldp.supabase.co/storage/v1/object/public/covers/test.jpg'

-- ============================================
-- AFTER RUNNING THIS:
-- ============================================
-- 1. Go back to your website
-- 2. Refresh the page
-- 3. You should see your cover images!


