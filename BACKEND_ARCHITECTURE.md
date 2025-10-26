# 🎧 Elnine Backend Architecture & How Everything Works

## 📊 **Database Overview**

Your backend is built on **Supabase (PostgreSQL)** with a comprehensive schema for audiobook management and user interactions.

---

## 🗄️ **Core Tables**

### 1. **Books Table**
```sql
books (
  id UUID PRIMARY KEY,
  title TEXT,
  author TEXT,
  description TEXT,
  cover_url TEXT,
  category_id UUID → categories(id),
  total_chapters INTEGER,
  total_duration INTEGER (seconds),
  rating DECIMAL(3,2),
  is_featured BOOLEAN,
  is_published BOOLEAN,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

**How it works:**
- Stores all audiobook metadata
- `is_published = TRUE` controls visibility
- `is_featured = TRUE` for promoted books
- Auto-updates `total_chapters` and `total_duration` via triggers when chapters are added

---

### 2. **Chapters Table**
```sql
chapters (
  id UUID PRIMARY KEY,
  book_id UUID → books(id),
  title TEXT,
  chapter_number INTEGER,
  audio_url TEXT,
  duration INTEGER (seconds),
  lyrics JSONB, -- [{"time": 0, "text": "..."}]
  is_published BOOLEAN
)
```

**How it works:**
- Each chapter is a separate audio file
- `lyrics` field stores synced lyrics in JSON format
- When a chapter is added/updated/deleted, a trigger automatically updates the parent book's stats

---

### 3. **Categories Table**
```sql
categories (
  id UUID PRIMARY KEY,
  name TEXT UNIQUE,
  slug TEXT UNIQUE,
  description TEXT,
  icon TEXT,
  cover_image TEXT,
  sort_order INTEGER,
  is_active BOOLEAN
)
```

**How Categories Work:**
1. **Frontend fetches categories:**
   ```typescript
   const { data } = await supabase
     .from('categories')
     .select('*')
     .eq('is_active', true)
     .order('sort_order');
   ```

2. **Books are linked via `category_id`**

3. **To get books by category:**
   ```typescript
   const { data } = await supabase
     .from('books')
     .select('*')
     .eq('category_id', categoryId)
     .eq('is_published', true);
   ```

---

## 👤 **User Interaction Tables**

### 4. **Likes Table**
```sql
likes (
  id UUID PRIMARY KEY,
  user_id UUID → auth.users(id),
  book_id UUID → books(id),
  created_at TIMESTAMP,
  UNIQUE(user_id, book_id)
)
```

**How Liked Books Work:**

**Adding a Like:**
```typescript
// When user clicks "like" button
const { error } = await supabase
  .from('likes')
  .insert({ user_id: user.id, book_id: bookId });

// Trigger automatically increments book_stats.total_likes
```

**Fetching Liked Books:**
```typescript
// Get user's liked books
const { data } = await supabase
  .from('user_liked_books') // This is a VIEW
  .select('*')
  .eq('user_id', user.id)
  .order('liked_at', { ascending: false });
```

**Checking if User Liked a Book:**
```typescript
const { data } = await supabase
  .from('likes')
  .select('id')
  .eq('user_id', user.id)
  .eq('book_id', bookId)
  .single();

const isLiked = !!data;
```

---

### 5. **Plays Table (Listening History)**
```sql
plays (
  id UUID PRIMARY KEY,
  user_id UUID → auth.users(id),
  book_id UUID → books(id),
  chapter_id UUID → chapters(id),
  played_at TIMESTAMP DEFAULT NOW(),
  listen_duration INTEGER (seconds),
  completed BOOLEAN,
  device_info JSONB
)
```

**How Recently Played Works:**

**Recording a Play:**
```typescript
// When user starts playing a chapter
const { error } = await supabase
  .from('plays')
  .insert({
    user_id: user.id,
    book_id: bookId,
    chapter_id: chapterId,
    played_at: new Date(),
    listen_duration: 0,
    completed: false
  });
```

**Fetching Recently Played:**
```typescript
// Get user's recent plays
const { data } = await supabase
  .from('plays')
  .select(`
    *,
    books (*),
    chapters (*)
  `)
  .eq('user_id', user.id)
  .order('played_at', { ascending: false })
  .limit(20);

// Group by book to avoid duplicates
const uniqueBooks = data.reduce((acc, play) => {
  if (!acc.find(b => b.book_id === play.book_id)) {
    acc.push(play);
  }
  return acc;
}, []);
```

---

### 6. **User Progress Table (Resume Playback)**
```sql
user_progress (
  id UUID PRIMARY KEY,
  user_id UUID → auth.users(id),
  book_id UUID → books(id),
  chapter_id UUID → chapters(id),
  current_position INTEGER (seconds),
  completed_chapters INTEGER,
  total_listen_time INTEGER,
  last_played_at TIMESTAMP,
  UNIQUE(user_id, book_id)
)
```

**How Progress Tracking Works:**

**Saving Progress:**
```typescript
// Update progress every 10 seconds while playing
const saveProgress = async (position: number) => {
  await supabase
    .from('user_progress')
    .upsert({
      user_id: user.id,
      book_id: bookId,
      chapter_id: chapterId,
      current_position: position,
      last_played_at: new Date()
    });
};
```

**Resume from Last Position:**
```typescript
// When user opens a book
const { data } = await supabase
  .from('user_progress')
  .select('*')
  .eq('user_id', user.id)
  .eq('book_id', bookId)
  .single();

if (data) {
  // Resume from data.chapter_id at data.current_position
  audioPlayer.seek(data.current_position);
}
```

---

## 📈 **Analytics & Trending**

### 7. **Book Stats Table**
```sql
book_stats (
  id UUID PRIMARY KEY,
  book_id UUID → books(id) UNIQUE,
  total_plays INTEGER,
  total_likes INTEGER,
  total_reviews INTEGER,
  unique_listeners INTEGER,
  avg_completion_rate DECIMAL(5,2),
  last_calculated_at TIMESTAMP
)
```

**How Trending Works:**

**Automatic Stats Update (via Triggers):**
```sql
-- When user plays a book → total_plays++
-- When user likes a book → total_likes++
-- When user reviews a book → total_reviews++
```

**Fetching Trending Books:**
```typescript
// Method 1: Use the trending_this_week VIEW
const { data } = await supabase
  .from('trending_this_week')
  .select('*')
  .limit(12);

// Method 2: Sort by plays + likes (current implementation)
const { data: books } = await supabase
  .from('books')
  .select('*, book_stats(*)')
  .eq('is_published', true)
  .order('book_stats.total_plays', { ascending: false })
  .order('created_at', { ascending: false });

// Sort by weighted score
const sortedBooks = books.sort((a, b) => {
  const scoreA = (a.book_stats?.total_plays || 0) * 2 + 
                 (a.book_stats?.total_likes || 0) * 3 +
                 (a.book_stats?.total_reviews || 0) * 5;
  const scoreB = (b.book_stats?.total_plays || 0) * 2 + 
                 (b.book_stats?.total_likes || 0) * 3 +
                 (b.book_stats?.total_reviews || 0) * 5;
  return scoreB - scoreA;
});
```

**Current Trending Logic in Code:**
```typescript
// app/page.tsx - getTrendingBooks()
async function getTrendingBooks(limit = 12) {
  const { data: books } = await supabase
    .from('books')
    .select('*')
    .eq('is_published', true);

  // Prioritize books with covers, then by newest
  const sortedBooks = books.sort((a, b) => {
    if (a.cover_url && !b.cover_url) return -1;
    if (!a.cover_url && b.cover_url) return 1;
    return new Date(b.created_at) - new Date(a.created_at);
  });

  return sortedBooks.slice(0, limit);
}
```

**⚠️ This needs to be updated to use actual play/like data!**

---

### 8. **Trending Books Table**
```sql
trending_books (
  id UUID PRIMARY KEY,
  book_id UUID → books(id),
  period_type TEXT ('daily', 'weekly', 'monthly'),
  period_start DATE,
  period_end DATE,
  play_count INTEGER,
  unique_listeners INTEGER,
  rank INTEGER,
  score DECIMAL(10,2)
)
```

**How to Calculate Trending:**
```sql
-- Daily calculation (run via cron job)
INSERT INTO trending_books (book_id, period_type, period_start, period_end, play_count, unique_listeners, score, rank)
SELECT 
  b.id,
  'weekly',
  CURRENT_DATE - INTERVAL '7 days',
  CURRENT_DATE,
  COUNT(p.*) as play_count,
  COUNT(DISTINCT p.user_id) as unique_listeners,
  (COUNT(p.*) * 2) + (COUNT(DISTINCT p.user_id) * 5) + (COALESCE(bs.total_likes, 0) * 3) as score,
  ROW_NUMBER() OVER (ORDER BY (COUNT(p.*) * 2) + (COUNT(DISTINCT p.user_id) * 5) DESC)
FROM books b
LEFT JOIN plays p ON b.id = p.book_id AND p.played_at >= CURRENT_DATE - INTERVAL '7 days'
LEFT JOIN book_stats bs ON b.id = bs.book_id
WHERE b.is_published = TRUE
GROUP BY b.id, bs.total_likes
ON CONFLICT (book_id, period_type, period_start) DO UPDATE
SET play_count = EXCLUDED.play_count,
    unique_listeners = EXCLUDED.unique_listeners,
    score = EXCLUDED.score,
    rank = EXCLUDED.rank;
```

---

## 🎯 **"For You" Recommendations**

**Currently NOT Implemented** - Here's how it should work:

### **Method 1: Collaborative Filtering**
```typescript
// Find users with similar listening history
async function getRecommendations(userId: string) {
  // 1. Get user's liked books and plays
  const { data: userLikes } = await supabase
    .from('likes')
    .select('book_id')
    .eq('user_id', userId);

  // 2. Find other users who liked the same books
  const { data: similarUsers } = await supabase
    .from('likes')
    .select('user_id')
    .in('book_id', userLikes.map(l => l.book_id))
    .neq('user_id', userId)
    .limit(50);

  // 3. Get books liked by similar users that current user hasn't liked
  const { data: recommendations } = await supabase
    .from('likes')
    .select('book_id, books(*)')
    .in('user_id', similarUsers.map(u => u.user_id))
    .not('book_id', 'in', `(${userLikes.map(l => l.book_id).join(',')})`)
    .limit(20);

  return recommendations;
}
```

### **Method 2: Category-Based**
```typescript
async function getCategoryRecommendations(userId: string) {
  // 1. Get user's favorite category
  const { data: stats } = await supabase
    .from('user_stats')
    .select('favorite_category_id')
    .eq('user_id', userId)
    .single();

  // 2. Get popular books from that category
  const { data } = await supabase
    .from('books')
    .select('*, book_stats(*)')
    .eq('category_id', stats.favorite_category_id)
    .order('book_stats.total_plays', { ascending: false })
    .limit(20);

  return data;
}
```

---

## 🔄 **How Everything Connects**

### **User Journey Flow:**

1. **User Opens App**
   - Fetch books from `books_with_stats` view
   - Shows: Trending, Categories, Featured

2. **User Browses Categories**
   - Click category → Filter books by `category_id`
   - Display books sorted by popularity (total_plays)

3. **User Plays a Book**
   ```typescript
   // Step 1: Record play
   await supabase.from('plays').insert({ user_id, book_id, chapter_id });
   
   // Step 2: Update progress
   await supabase.from('user_progress').upsert({ 
     user_id, 
     book_id, 
     chapter_id, 
     current_position 
   });
   
   // Step 3: Trigger increments book_stats.total_plays
   ```

4. **User Likes a Book**
   ```typescript
   await supabase.from('likes').insert({ user_id, book_id });
   // Trigger increments book_stats.total_likes
   ```

5. **User Views "Recently Played"**
   ```typescript
   // Fetch from plays table, group by book
   const { data } = await supabase
     .from('plays')
     .select('*, books(*)')
     .eq('user_id', user.id)
     .order('played_at', { ascending: false });
   ```

6. **User Views "Liked Books"**
   ```typescript
   const { data } = await supabase
     .from('user_liked_books') // VIEW
     .select('*')
     .eq('user_id', user.id);
   ```

7. **Trending Updates**
   - Background job calculates trending daily/weekly
   - Or calculate on-the-fly from `book_stats` table

---

## 🚀 **What Needs to Be Implemented**

### **High Priority:**

1. **Update Trending Logic**
   - Replace cover-based sorting with `book_stats` sorting
   - Use `trending_this_week` view

2. **Implement Recently Played Page**
   ```typescript
   // elnine-web/app/recently-played/page.tsx
   async function getRecentlyPlayed(userId: string) {
     const { data } = await supabase
       .from('plays')
       .select('*, books(*), chapters(*)')
       .eq('user_id', userId)
       .order('played_at', { ascending: false })
       .limit(20);
     
     // Remove duplicate books
     return uniqueByBookId(data);
   }
   ```

3. **Implement Liked Books Page**
   ```typescript
   // elnine-web/app/liked/page.tsx
   async function getLikedBooks(userId: string) {
     const { data } = await supabase
       .from('user_liked_books')
       .select('*')
       .eq('user_id', userId)
       .order('liked_at', { ascending: false });
     
     return data;
   }
   ```

4. **Update Audio Player to Track Progress**
   ```typescript
   // In AudioPlayerContext.tsx
   useEffect(() => {
     const interval = setInterval(async () => {
       if (isPlaying && currentTime) {
         await supabase.from('user_progress').upsert({
           user_id: user.id,
           book_id: currentBook.id,
           chapter_id: currentChapter.id,
           current_position: currentTime,
           last_played_at: new Date()
         });
       }
     }, 10000); // Save every 10 seconds
     
     return () => clearInterval(interval);
   }, [isPlaying, currentTime]);
   ```

5. **Add Like/Unlike Functionality**
   ```typescript
   // components/BookCard.tsx
   const toggleLike = async () => {
     if (isLiked) {
       await supabase
         .from('likes')
         .delete()
         .eq('user_id', user.id)
         .eq('book_id', book.id);
     } else {
       await supabase
         .from('likes')
         .insert({ user_id: user.id, book_id: book.id });
     }
     setIsLiked(!isLiked);
   };
   ```

6. **Implement "For You" Section**
   - Use collaborative filtering or category-based recommendations
   - Create new API route: `/api/recommendations`

---

## 📝 **Database Views Available**

- `books_with_stats` - Books with play/like counts
- `trending_this_week` - Most played books this week
- `most_liked_books` - Top 50 liked books
- `top_rated_books` - Highest rated books
- `recently_added_books` - Newest books
- `featured_books` - Featured books
- `user_library` - User's in-progress books
- `user_liked_books` - User's liked books
- `popular_categories` - Categories by popularity

---

## 🔐 **Row Level Security (RLS)**

All tables have RLS policies:
- Users can only see their own likes, plays, progress
- All users can read books, categories, chapters
- Only authenticated users can create likes/plays
- Admin users can manage books/categories

---

## 🎨 **Frontend → Backend Flow**

```
Frontend (Next.js)
     ↓
Supabase Client (lib/supabase.ts)
     ↓
PostgreSQL Database (Tables + Views)
     ↓
Triggers Update Stats Automatically
     ↓
Frontend Displays Updated Data
```

**Key Files:**
- `lib/supabase.ts` - Database client
- `lib/supabase/server.ts` - Server-side client (auth)
- `lib/api/books.ts` - Book API functions
- `app/page.tsx` - Uses Supabase to fetch data
- `contexts/AudioPlayerContext.tsx` - Manages playback state

---

This architecture is **scalable**, **real-time**, and **user-centric**! 🚀
