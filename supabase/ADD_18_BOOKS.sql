-- ============================================
-- ADD YOUR 18 AUDIOBOOKS
-- ============================================
-- Replace the data below with your actual book information
-- After running this, you'll have 18 books ready for covers and audio!

INSERT INTO books (title, author, description, category, is_published) VALUES

-- Book 1
('The Great Gatsby', 'F. Scott Fitzgerald', 'A story of decadence and excess', 'fiction', true),

-- Book 2
('1984', 'George Orwell', 'A dystopian social science fiction novel', 'science-fiction', true),

-- Book 3
('Pride and Prejudice', 'Jane Austen', 'A romantic novel of manners', 'romance', true),

-- Book 4
('To Kill a Mockingbird', 'Harper Lee', 'A story of racial injustice and childhood innocence', 'fiction', true),

-- Book 5
('The Catcher in the Rye', 'J.D. Salinger', 'A story about teenage rebellion', 'fiction', true),

-- Book 6
('The Hobbit', 'J.R.R. Tolkien', 'A fantasy adventure novel', 'fantasy', true),

-- Book 7
('Harry Potter and the Sorcerer Stone', 'J.K. Rowling', 'A young wizard discovers his magical heritage', 'fantasy', true),

-- Book 8
('The Da Vinci Code', 'Dan Brown', 'A mystery thriller novel', 'mystery', true),

-- Book 9
('The Alchemist', 'Paulo Coelho', 'A philosophical story about following dreams', 'self-help', true),

-- Book 10
('Sapiens', 'Yuval Noah Harari', 'A brief history of humankind', 'history', true),

-- Book 11
('Atomic Habits', 'James Clear', 'An easy way to build good habits', 'self-help', true),

-- Book 12
('Steve Jobs', 'Walter Isaacson', 'The exclusive biography', 'biography', true),

-- Book 13
('The Subtle Art of Not Giving a F*ck', 'Mark Manson', 'A counterintuitive approach to living', 'self-help', true),

-- Book 14
('Educated', 'Tara Westover', 'A memoir about education and family', 'biography', true),

-- Book 15
('Becoming', 'Michelle Obama', 'The memoir of the former First Lady', 'biography', true),

-- Book 16
('The Martian', 'Andy Weir', 'A story of survival on Mars', 'science-fiction', true),

-- Book 17
('Gone Girl', 'Gillian Flynn', 'A psychological thriller', 'mystery', true),

-- Book 18
('The Silent Patient', 'Alex Michaelides', 'A psychological thriller about a woman who stops speaking', 'mystery', true);

-- ============================================
-- VERIFY YOUR BOOKS
-- ============================================
SELECT id, title, author FROM books ORDER BY title;

-- ============================================
-- NEXT STEPS:
-- ============================================
-- 1. Run this script in Supabase SQL Editor
-- 2. You'll now have 18 books
-- 3. Upload 18 cover images to Storage → covers bucket
-- 4. Update each book's cover_url (see next step)

