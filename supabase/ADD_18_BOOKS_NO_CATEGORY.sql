-- ============================================
-- ADD YOUR 18 AUDIOBOOKS (Without Category)
-- ============================================
-- Use this version if you haven't added the category column yet
-- Or run FIX_ADD_CATEGORY_COLUMN.sql first, then use ADD_18_BOOKS.sql

INSERT INTO books (title, author, description, is_published) VALUES

-- Book 1
('The Great Gatsby', 'F. Scott Fitzgerald', 'A story of decadence and excess', true),

-- Book 2
('1984', 'George Orwell', 'A dystopian social science fiction novel', true),

-- Book 3
('Pride and Prejudice', 'Jane Austen', 'A romantic novel of manners', true),

-- Book 4
('To Kill a Mockingbird', 'Harper Lee', 'A story of racial injustice and childhood innocence', true),

-- Book 5
('The Catcher in the Rye', 'J.D. Salinger', 'A story about teenage rebellion', true),

-- Book 6
('The Hobbit', 'J.R.R. Tolkien', 'A fantasy adventure novel', true),

-- Book 7
('Harry Potter and the Sorcerer Stone', 'J.K. Rowling', 'A young wizard discovers his magical heritage', true),

-- Book 8
('The Da Vinci Code', 'Dan Brown', 'A mystery thriller novel', true),

-- Book 9
('The Alchemist', 'Paulo Coelho', 'A philosophical story about following dreams', true),

-- Book 10
('Sapiens', 'Yuval Noah Harari', 'A brief history of humankind', true),

-- Book 11
('Atomic Habits', 'James Clear', 'An easy way to build good habits', true),

-- Book 12
('Steve Jobs', 'Walter Isaacson', 'The exclusive biography', true),

-- Book 13
('The Subtle Art of Not Giving a F*ck', 'Mark Manson', 'A counterintuitive approach to living', true),

-- Book 14
('Educated', 'Tara Westover', 'A memoir about education and family', true),

-- Book 15
('Becoming', 'Michelle Obama', 'The memoir of the former First Lady', true),

-- Book 16
('The Martian', 'Andy Weir', 'A story of survival on Mars', true),

-- Book 17
('Gone Girl', 'Gillian Flynn', 'A psychological thriller', true),

-- Book 18
('The Silent Patient', 'Alex Michaelides', 'A psychological thriller about a woman who stops speaking', true);

-- ============================================
-- VERIFY YOUR BOOKS
-- ============================================
SELECT id, title, author FROM books ORDER BY title;

