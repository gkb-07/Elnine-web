-- ============================================
-- ADD CATEGORY COLUMN TO BOOKS TABLE
-- ============================================
-- This fixes the "column category does not exist" error

-- Add category column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'books' AND column_name = 'category'
  ) THEN
    ALTER TABLE books ADD COLUMN category TEXT;
    RAISE NOTICE 'Added category column to books table';
  ELSE
    RAISE NOTICE 'Category column already exists';
  END IF;
END $$;

-- Set default category for existing books
UPDATE books 
SET category = 'fiction' 
WHERE category IS NULL;

-- Verify the column was added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'books' 
ORDER BY ordinal_position;

