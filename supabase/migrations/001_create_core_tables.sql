-- Migration: Create Core Tables for Elnine Audio Platform
-- Description: Books, Chapters, Categories, and Creators tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- BOOKS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS books (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  description TEXT,
  cover_url TEXT,
  category_id UUID,
  publisher TEXT,
  published_date DATE,
  language TEXT DEFAULT 'en',
  total_chapters INTEGER DEFAULT 0,
  total_duration INTEGER DEFAULT 0, -- in seconds
  rating DECIMAL(3,2) DEFAULT 0.0,
  is_featured BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_books_category ON books(category_id);
CREATE INDEX IF NOT EXISTS idx_books_author ON books(author);
CREATE INDEX IF NOT EXISTS idx_books_featured ON books(is_featured);
CREATE INDEX IF NOT EXISTS idx_books_published ON books(is_published);

-- ============================================
-- CHAPTERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS chapters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  chapter_number INTEGER NOT NULL,
  audio_url TEXT NOT NULL,
  duration INTEGER NOT NULL, -- in seconds
  file_size BIGINT, -- in bytes
  lyrics JSONB, -- Store synced lyrics: [{"time": 0, "text": "..."}]
  description TEXT,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(book_id, chapter_number)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_chapters_book ON chapters(book_id);
CREATE INDEX IF NOT EXISTS idx_chapters_number ON chapters(book_id, chapter_number);

-- ============================================
-- CATEGORIES TABLE (Update existing or create)
-- ============================================
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  cover_image TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add missing columns if table already exists
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'categories' AND column_name = 'slug') THEN
    ALTER TABLE categories ADD COLUMN slug TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'categories' AND column_name = 'cover_image') THEN
    ALTER TABLE categories ADD COLUMN cover_image TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'categories' AND column_name = 'sort_order') THEN
    ALTER TABLE categories ADD COLUMN sort_order INTEGER DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'categories' AND column_name = 'is_active') THEN
    ALTER TABLE categories ADD COLUMN is_active BOOLEAN DEFAULT TRUE;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'categories' AND column_name = 'created_at') THEN
    ALTER TABLE categories ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
  END IF;
END $$;

-- Update existing rows to have slug based on name if slug is null
UPDATE categories SET slug = LOWER(REGEXP_REPLACE(name, '[^a-zA-Z0-9]+', '-', 'g')) WHERE slug IS NULL;

-- Make slug unique and not null after updating
DO $$
BEGIN
  -- Set NOT NULL constraint
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'categories' AND column_name = 'slug' AND is_nullable = 'YES') THEN
    ALTER TABLE categories ALTER COLUMN slug SET NOT NULL;
  END IF;
  
  -- Add unique constraint if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'categories_slug_key') THEN
    ALTER TABLE categories ADD CONSTRAINT categories_slug_key UNIQUE (slug);
  END IF;
EXCEPTION
  WHEN unique_violation THEN NULL;
  WHEN others THEN NULL;
END $$;

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_active ON categories(is_active);

-- ============================================
-- CREATORS TABLE (Authors/Narrators)
-- ============================================
CREATE TABLE IF NOT EXISTS creators (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  email TEXT,
  website TEXT,
  social_links JSONB, -- {"twitter": "...", "instagram": "..."}
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add missing columns if table already exists
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'creators' AND column_name = 'bio') THEN
    ALTER TABLE creators ADD COLUMN bio TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'creators' AND column_name = 'avatar_url') THEN
    ALTER TABLE creators ADD COLUMN avatar_url TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'creators' AND column_name = 'email') THEN
    ALTER TABLE creators ADD COLUMN email TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'creators' AND column_name = 'website') THEN
    ALTER TABLE creators ADD COLUMN website TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'creators' AND column_name = 'social_links') THEN
    ALTER TABLE creators ADD COLUMN social_links JSONB;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'creators' AND column_name = 'is_featured') THEN
    ALTER TABLE creators ADD COLUMN is_featured BOOLEAN DEFAULT FALSE;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'creators' AND column_name = 'created_at') THEN
    ALTER TABLE creators ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'creators' AND column_name = 'updated_at') THEN
    ALTER TABLE creators ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
  END IF;
END $$;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_creators_name ON creators(name);
CREATE INDEX IF NOT EXISTS idx_creators_featured ON creators(is_featured);

-- ============================================
-- BOOK_CREATORS TABLE (Many-to-Many)
-- ============================================
CREATE TABLE IF NOT EXISTS book_creators (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  creator_id UUID NOT NULL REFERENCES creators(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'author', -- author, narrator, translator, etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(book_id, creator_id, role)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_book_creators_book ON book_creators(book_id);
CREATE INDEX IF NOT EXISTS idx_book_creators_creator ON book_creators(creator_id);

-- ============================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop triggers if they exist, then create them
DROP TRIGGER IF EXISTS update_books_updated_at ON books;
CREATE TRIGGER update_books_updated_at
  BEFORE UPDATE ON books
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_chapters_updated_at ON chapters;
CREATE TRIGGER update_chapters_updated_at
  BEFORE UPDATE ON chapters
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_creators_updated_at ON creators;
CREATE TRIGGER update_creators_updated_at
  BEFORE UPDATE ON creators
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- FUNCTION TO UPDATE BOOK STATS
-- ============================================
CREATE OR REPLACE FUNCTION update_book_chapter_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    UPDATE books
    SET 
      total_chapters = (SELECT COUNT(*) FROM chapters WHERE book_id = OLD.book_id),
      total_duration = (SELECT COALESCE(SUM(duration), 0) FROM chapters WHERE book_id = OLD.book_id)
    WHERE id = OLD.book_id;
    RETURN OLD;
  ELSE
    UPDATE books
    SET 
      total_chapters = (SELECT COUNT(*) FROM chapters WHERE book_id = NEW.book_id),
      total_duration = (SELECT COALESCE(SUM(duration), 0) FROM chapters WHERE book_id = NEW.book_id)
    WHERE id = NEW.book_id;
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_book_stats_on_chapter_insert ON chapters;
CREATE TRIGGER update_book_stats_on_chapter_insert
  AFTER INSERT ON chapters
  FOR EACH ROW
  EXECUTE FUNCTION update_book_chapter_count();

DROP TRIGGER IF EXISTS update_book_stats_on_chapter_update ON chapters;
CREATE TRIGGER update_book_stats_on_chapter_update
  AFTER UPDATE ON chapters
  FOR EACH ROW
  EXECUTE FUNCTION update_book_chapter_count();

DROP TRIGGER IF EXISTS update_book_stats_on_chapter_delete ON chapters;
CREATE TRIGGER update_book_stats_on_chapter_delete
  AFTER DELETE ON chapters
  FOR EACH ROW
  EXECUTE FUNCTION update_book_chapter_count();

