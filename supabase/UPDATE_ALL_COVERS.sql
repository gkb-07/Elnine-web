-- ============================================
-- UPDATE COVER IMAGES FOR ALL 18 BOOKS
-- ============================================
-- STEPS:
-- 1. Upload 18 cover images to Supabase Storage → covers bucket
--    Name them clearly: gatsby.jpg, 1984.jpg, pride.jpg, etc.
-- 2. Get the public URL for each image
-- 3. Replace the URLs below with your actual URLs
-- 4. Run this script

-- ============================================
-- FIRST: See all your books and their IDs
-- ============================================
SELECT id, title, author, cover_url FROM books ORDER BY title;

-- ============================================
-- UPDATE EACH BOOK'S COVER
-- ============================================

-- Book 1: The Great Gatsby
UPDATE books 
SET cover_url = 'https://YOUR_PROJECT.supabase.co/storage/v1/object/public/covers/gatsby.jpg'
WHERE title = 'The Great Gatsby';

-- Book 2: 1984
UPDATE books 
SET cover_url = 'https://YOUR_PROJECT.supabase.co/storage/v1/object/public/covers/1984.jpg'
WHERE title = '1984';

-- Book 3: Pride and Prejudice
UPDATE books 
SET cover_url = 'https://YOUR_PROJECT.supabase.co/storage/v1/object/public/covers/pride.jpg'
WHERE title = 'Pride and Prejudice';

-- Book 4: To Kill a Mockingbird
UPDATE books 
SET cover_url = 'https://YOUR_PROJECT.supabase.co/storage/v1/object/public/covers/mockingbird.jpg'
WHERE title = 'To Kill a Mockingbird';

-- Book 5: The Catcher in the Rye
UPDATE books 
SET cover_url = 'https://YOUR_PROJECT.supabase.co/storage/v1/object/public/covers/catcher.jpg'
WHERE title = 'The Catcher in the Rye';

-- Book 6: The Hobbit
UPDATE books 
SET cover_url = 'https://YOUR_PROJECT.supabase.co/storage/v1/object/public/covers/hobbit.jpg'
WHERE title = 'The Hobbit';

-- Book 7: Harry Potter
UPDATE books 
SET cover_url = 'https://YOUR_PROJECT.supabase.co/storage/v1/object/public/covers/harry-potter.jpg'
WHERE title = 'Harry Potter and the Sorcerer Stone';

-- Book 8: The Da Vinci Code
UPDATE books 
SET cover_url = 'https://YOUR_PROJECT.supabase.co/storage/v1/object/public/covers/davinci.jpg'
WHERE title = 'The Da Vinci Code';

-- Book 9: The Alchemist
UPDATE books 
SET cover_url = 'https://YOUR_PROJECT.supabase.co/storage/v1/object/public/covers/alchemist.jpg'
WHERE title = 'The Alchemist';

-- Book 10: Sapiens
UPDATE books 
SET cover_url = 'https://YOUR_PROJECT.supabase.co/storage/v1/object/public/covers/sapiens.jpg'
WHERE title = 'Sapiens';

-- Book 11: Atomic Habits
UPDATE books 
SET cover_url = 'https://YOUR_PROJECT.supabase.co/storage/v1/object/public/covers/atomic-habits.jpg'
WHERE title = 'Atomic Habits';

-- Book 12: Steve Jobs
UPDATE books 
SET cover_url = 'https://YOUR_PROJECT.supabase.co/storage/v1/object/public/covers/steve-jobs.jpg'
WHERE title = 'Steve Jobs';

-- Book 13: The Subtle Art
UPDATE books 
SET cover_url = 'https://YOUR_PROJECT.supabase.co/storage/v1/object/public/covers/subtle-art.jpg'
WHERE title = 'The Subtle Art of Not Giving a F*ck';

-- Book 14: Educated
UPDATE books 
SET cover_url = 'https://YOUR_PROJECT.supabase.co/storage/v1/object/public/covers/educated.jpg'
WHERE title = 'Educated';

-- Book 15: Becoming
UPDATE books 
SET cover_url = 'https://YOUR_PROJECT.supabase.co/storage/v1/object/public/covers/becoming.jpg'
WHERE title = 'Becoming';

-- Book 16: The Martian
UPDATE books 
SET cover_url = 'https://YOUR_PROJECT.supabase.co/storage/v1/object/public/covers/martian.jpg'
WHERE title = 'The Martian';

-- Book 17: Gone Girl
UPDATE books 
SET cover_url = 'https://YOUR_PROJECT.supabase.co/storage/v1/object/public/covers/gone-girl.jpg'
WHERE title = 'Gone Girl';

-- Book 18: The Silent Patient
UPDATE books 
SET cover_url = 'https://YOUR_PROJECT.supabase.co/storage/v1/object/public/covers/silent-patient.jpg'
WHERE title = 'The Silent Patient';

-- ============================================
-- VERIFY ALL COVERS ARE SET
-- ============================================
SELECT title, cover_url FROM books ORDER BY title;

-- ============================================
-- HOW TO GET THE CORRECT URL:
-- ============================================
-- 1. Go to Supabase → Storage → covers
-- 2. Click on an image
-- 3. Click "Copy URL"
-- 4. Replace in this script
-- 5. Make sure to replace YOUR_PROJECT with your actual project URL!

