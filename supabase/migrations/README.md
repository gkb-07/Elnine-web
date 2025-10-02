# Supabase Database Migrations

## Overview
This folder contains SQL migration files to set up the complete database structure for the Elnine audio book platform.

## Migration Files

### 001_create_core_tables.sql
- Creates books, chapters, categories, and creators tables
- Sets up relationships and indexes
- Includes triggers for automatic updates

### 002_create_user_interaction_tables.sql
- Creates likes, plays, user_progress, reviews, and bookmarks tables
- Tracks user engagement and progress
- Auto-updates book ratings based on reviews

### 003_create_playlist_tables.sql
- Creates playlists, playlist_items, and playlist_followers tables
- Manages user collections and shared playlists

### 004_create_analytics_tables.sql
- Creates trending, stats, and analytics tables
- Tracks trends and popular content
- Aggregates statistics

### 005_create_views.sql
- Creates useful database views for common queries
- Includes trending books, featured content, user library
- Optimizes read performance

### 006_create_rls_policies.sql
- Enables Row Level Security on all tables
- Creates security policies for each table
- Protects user data and admin operations

### 007_create_storage_policies.sql
- Creates storage bucket policies
- Configures audio and covers bucket access

### 008_seed_sample_data.sql (OPTIONAL)
- Inserts sample data for testing
- Remove or modify for production use

## How to Run Migrations

### Option 1: Supabase Dashboard
1. Go to your Supabase project
2. Navigate to SQL Editor
3. Copy and paste each migration file in order
4. Run each migration sequentially

### Option 2: Supabase CLI
```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

## Post-Migration Steps

### 1. Configure Storage Buckets
Go to Storage in Supabase Dashboard:

**Audio Bucket:**
- Name: `audio`
- Public: ✅ Yes
- Allowed MIME types: `audio/mpeg, audio/mp3, audio/wav, audio/ogg`
- Max file size: `500 MB`

**Covers Bucket:**
- Name: `covers`
- Public: ✅ Yes
- Allowed MIME types: `image/jpeg, image/jpg, image/png, image/webp`
- Max file size: `5 MB`

### 2. Create Admin User
```sql
-- Update a user to admin role
UPDATE auth.users
SET raw_user_meta_data = raw_user_meta_data || '{"role": "admin"}'::jsonb
WHERE email = 'your-admin-email@example.com';
```

### 3. Upload Content
1. Upload book cover images to `covers` bucket
2. Upload audio files to `audio` bucket
3. Update book and chapter records with correct URLs

### 4. Test Policies
```sql
-- Test as different users to verify RLS policies work correctly
-- Switch between admin and regular user roles
```

## Database Structure Summary

### Core Tables
- `books` - Book information
- `chapters` - Individual audio chapters
- `categories` - Book categories/genres
- `creators` - Authors and narrators

### User Interaction
- `likes` - User likes/favorites
- `plays` - Listening history
- `user_progress` - Resume playback position
- `reviews` - User reviews and ratings
- `bookmarks` - Favorite moments

### Playlists
- `playlists` - User collections
- `playlist_items` - Books in playlists
- `playlist_followers` - Playlist subscribers

### Analytics
- `trending_books` - Trending content
- `book_stats` - Book statistics
- `user_stats` - User statistics
- `daily_stats` - System-wide metrics

## Storage Structure

```
audio/
├── books/
│   ├── moby-dick/
│   │   └── chapters/
│   │       ├── chapter-1.mp3
│   │       ├── chapter-2.mp3
│   │       └── ...
│   └── authority/
│       └── chapters/
│           └── ...

covers/
├── books/
│   ├── moby-dick.jpg
│   ├── authority.jpg
│   └── ...
```

## Environment Variables

Add to your `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Troubleshooting

### Error: relation already exists
- Some tables might already exist
- Add `IF NOT EXISTS` to CREATE statements
- Or drop existing tables if safe to do so

### Error: permission denied
- Check RLS policies are configured correctly
- Verify user has correct role
- Check bucket policies for storage

### Error: function does not exist
- Ensure previous migrations ran successfully
- Check UUID extension is enabled
- Verify trigger functions are created

## Need Help?
- Check Supabase documentation: https://supabase.com/docs
- Review RLS policies: https://supabase.com/docs/guides/auth/row-level-security
- Storage guide: https://supabase.com/docs/guides/storage


