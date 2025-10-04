import Link from "next/link";
import { supabase } from '@/lib/supabase';
import { Suspense } from 'react';
import HomeSections from '@/components/HomeSections';

// Fetch books from Supabase
async function getBooks() {
  const { data: books, error } = await supabase
    .from('books')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching books:', error);
    return [];
  }

  return books || [];
}

// Fetch books by category (with fallback if category column doesn't exist)
async function getBooksByCategory(category: string, limit = 12) {
  const { data: books, error } = await supabase
    .from('books')
    .select('*')
    .eq('is_published', true)
    .eq('category', category)
    .limit(limit);

  if (error) {
    console.error('Error fetching books by category:', error);
    // Fallback: if category column doesn't exist, just return recent books
    const { data: fallbackBooks } = await supabase
      .from('books')
      .select('*')
      .eq('is_published', true)
      .limit(limit);
    return fallbackBooks || [];
  }

  return books || [];
}

// Fetch trending books (most played - for now just recent)
async function getTrendingBooks(limit = 12) {
  const { data: books, error } = await supabase
    .from('books')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching trending books:', error);
    return [];
  }

  return books || [];
}

// Fetch newly released books
async function getNewlyReleasedBooks(limit = 12) {
  const { data: books, error } = await supabase
    .from('books')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching new books:', error);
    return [];
  }

  return books || [];
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
      <div className="py-12">
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
