import Link from "next/link";
import { supabase } from '@/lib/supabase';
import { Suspense } from 'react';
import HomeSections from '@/components/HomeSections';

// Fetch books from Supabase (prioritize books with covers)
async function getBooks() {
  const { data: books, error } = await supabase
    .from('books')
    .select('*')
    .eq('is_published', true)
    .order('cover_url', { ascending: false, nullsLast: true }) // Books with covers first
    .order('created_at', { ascending: false }); // Then by newest

  if (error) {
    console.error('Error fetching books:', error);
    return [];
  }

  return books || [];
}

// Fetch books by category (logical sorting: covers first, then newest)
async function getBooksByCategory(category: string, limit = 12) {
  const { data: books, error } = await supabase
    .from('books')
    .select('*')
    .eq('is_published', true)
    .eq('category', category);

  if (error) {
    console.error('Error fetching books by category:', error);
    // Fallback: if category column doesn't exist, get all books and apply custom sorting
    const { data: fallbackBooks } = await supabase
      .from('books')
      .select('*')
      .eq('is_published', true);
    
    if (!fallbackBooks) return [];
    
    console.log('Top Picks - All books:', fallbackBooks.map(b => b.title));

    // Logical sorting: prioritize books with covers, then by creation date
    const sortedBooks = fallbackBooks.sort((a, b) => {
      // First priority: books with covers
      if (a.cover_url && !b.cover_url) return -1;
      if (!a.cover_url && b.cover_url) return 1;
      
      // Second priority: creation date (newest first)
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    console.log('Top Picks - Sorted books:', sortedBooks.map(b => b.title));

    return sortedBooks.slice(0, limit);
  }

  if (!books) return [];

  console.log('Top Picks Category - All books:', books.map(b => b.title));

  // Logical sorting: prioritize books with covers, then by creation date
  const sortedBooks = books.sort((a, b) => {
    // First priority: books with covers
    if (a.cover_url && !b.cover_url) return -1;
    if (!a.cover_url && b.cover_url) return 1;
    
    // Second priority: creation date (newest first)
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  console.log('Top Picks Category - Sorted books:', sortedBooks.map(b => b.title));

  return sortedBooks.slice(0, limit);
}

// Fetch trending books (logical sorting: covers first, then newest)
async function getTrendingBooks(limit = 12) {
  const { data: books, error } = await supabase
    .from('books')
    .select('*')
    .eq('is_published', true);

  if (error) {
    console.error('Error fetching trending books:', error);
    return [];
  }

  if (!books) return [];

  console.log('All books:', books.map(b => b.title));

  // Logical sorting: prioritize books with covers, then by creation date
  const sortedBooks = books.sort((a, b) => {
    // First priority: books with covers
    if (a.cover_url && !b.cover_url) return -1;
    if (!a.cover_url && b.cover_url) return 1;
    
    // Second priority: creation date (newest first)
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  console.log('Sorted books:', sortedBooks.map(b => b.title));
  
  return sortedBooks.slice(0, limit);
}

export default async function HomePage() {
  // 🚀 OPTIMIZED: Fetch data in parallel for maximum speed
  const [
    allBooks,
    trendingBooks,
    fictionBooks
  ] = await Promise.all([
    getBooks(),
    getTrendingBooks(12),
    getBooksByCategory('fiction', 12)
  ]);

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section - Mobile Optimized Background */}
      <section 
        className="relative h-[60vh] sm:h-[70vh] lg:h-[80vh] bg-gradient-to-br from-purple-900 via-purple-700 to-indigo-800 hero-bg"
        style={{
          minHeight: "400px"
        }}
      >
        <div className="relative z-10 flex items-center justify-center h-full text-center text-white px-4 sm:px-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-4 sm:mb-6 text-white leading-tight drop-shadow-lg">
              Discover Your<br />
              Sound
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-8 max-w-3xl mx-auto px-4 text-white/90 drop-shadow-md">
              Immerse yourself in a world of premium audio experiences.<br className="hidden sm:block" />
              <span className="sm:hidden"> </span>From trending hits to hidden gems.
            </p>
            <div className="flex gap-4 sm:gap-6 justify-center flex-wrap">
              <Link 
                href="/categories" 
                prefetch={true}
                className="border-2 border-white/50 hover:border-white text-white px-6 sm:px-8 py-2 sm:py-3 rounded-full font-semibold text-base sm:text-lg transition-colors flex items-center gap-2"
              >
                🎧 Explore Genres
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content - Always show sections */}
      <div className="py-8">
        <Suspense fallback={<div className="text-center py-8">Loading...</div>}>
          <HomeSections 
            allBooks={allBooks}
            trendingBooks={trendingBooks}
            fictionBooks={fictionBooks}
            romanceBooks={[]}
            mysteryBooks={[]}
            biographyBooks={[]}
            newlyReleasedBooks={[]}
          />
        </Suspense>
      </div>
    </div>
  );
}