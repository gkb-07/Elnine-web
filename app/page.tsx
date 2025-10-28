import Link from "next/link";
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { Suspense } from 'react';
import HomeSections from '@/components/HomeSections';
import { MEDIA_PATHS, PAGINATION, CATEGORIES } from '@/lib/constants';

export const dynamic = 'force-dynamic';

// Fetch books from Supabase (prioritize books with covers)
async function getBooks() {
  const supabase = await createSupabaseServerClient();
  const { data: books, error } = await supabase
    .from('books')
    .select('*')
    .eq('is_published', true)
    .order('cover_url', { ascending: false, nullsFirst: false }) // Books with covers first
    .order('created_at', { ascending: false }); // Then by newest

  if (error) {
    console.error('Error fetching books:', error);
    return [];
  }

  return books || [];
}

// Fetch books by category (logical sorting: covers first, then newest)
async function getBooksByCategory(category: string, limit = PAGINATION.CATEGORY_LIMIT) {
  const supabase = await createSupabaseServerClient();
  const { data: books, error } = await supabase
    .from('books')
    .select('*')
    .eq('is_published', true)
    .eq('category', category);

  if (error) {
    console.error('Error fetching books by category:', error);
    // Fallback: if category column doesn't exist, get all books and apply custom sorting
    const supabaseFallback = await createSupabaseServerClient();
    const { data: fallbackBooks } = await supabaseFallback
      .from('books')
      .select('*')
      .eq('is_published', true);

    if (!fallbackBooks) return [];

    const fallbackBooksAny = fallbackBooks as any[];
    console.log('Top Picks - All books:', fallbackBooksAny.map(b => b.title));

    // Logical sorting: prioritize books with covers, then by creation date
    const sortedBooks = fallbackBooksAny.sort((a: any, b: any) => {
      // First priority: books with covers
      if (a.cover_url && !b.cover_url) return -1;
      if (!a.cover_url && b.cover_url) return 1;

      // Second priority: creation date (newest first)
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    console.log('Top Picks - Sorted books:', sortedBooks.map((b: any) => b.title));

    return sortedBooks.slice(0, limit);
  }

  if (!books) return [];

  const booksAny = books as any[];
  console.log('Top Picks Category - All books:', booksAny.map(b => b.title));

  // Logical sorting: prioritize books with covers, then by creation date
  const sortedBooks = booksAny.sort((a: any, b: any) => {
    // First priority: books with covers
    if (a.cover_url && !b.cover_url) return -1;
    if (!a.cover_url && b.cover_url) return 1;

    // Second priority: creation date (newest first)
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  console.log('Top Picks Category - Sorted books:', sortedBooks.map((b: any) => b.title));

  return sortedBooks.slice(0, limit);
}

// Fetch trending books (logical sorting: covers first, then newest)
async function getTrendingBooks(limit = PAGINATION.TRENDING_LIMIT) {
  const supabase = await createSupabaseServerClient();
  const { data: books, error } = await supabase
    .from('books')
    .select('*')
    .eq('is_published', true);

  if (error) {
    console.error('Error fetching trending books:', error);
    return [];
  }

  if (!books) return [];

  const booksAny = books as any[];
  console.log('All books:', booksAny.map(b => b.title));

  // Logical sorting: prioritize books with covers, then by creation date
  const sortedBooks = booksAny.sort((a: any, b: any) => {
    // First priority: books with covers
    if (a.cover_url && !b.cover_url) return -1;
    if (!a.cover_url && b.cover_url) return 1;

    // Second priority: creation date (newest first)
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  console.log('Sorted books:', sortedBooks.map((b: any) => b.title));
  
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
    getTrendingBooks(),
    getBooksByCategory(CATEGORIES.FICTION)
  ]);

  return (
    <div className="gradient-dark-purple min-h-screen">
      {/* Hero Section with Video Background */}
      <section 
        className="relative h-[60vh] sm:h-[70vh] lg:h-[80vh] overflow-hidden z-0"
        style={{
          minHeight: "400px"
        }}
      >
        {/* Video Background */}
        <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
            style={{ 
              transform: 'scale(1.1) translateY(2%)', 
              transformOrigin: 'center center',
              width: '100%',
              height: '100%'
            }}
          >
            <source src={MEDIA_PATHS.HERO_VIDEO} type="video/mp4" />
            {/* Fallback for browsers that don't support video */}
            <div className="w-full h-full bg-gradient-to-br from-purple-900 via-purple-700 to-indigo-800"></div>
          </video>
          
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black/40"></div>
          
          {/* Gradient overlay for smooth transition */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60"></div>
        </div>

        <div className="relative flex items-center justify-center h-full text-center text-white px-4 sm:px-8">
          <div className="max-w-4xl mx-auto">
              <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold mb-6 sm:mb-8 leading-tight font-section-title-purple">
                Immerse in your fantasies
              </h1>
            <div className="flex gap-4 sm:gap-6 justify-center flex-wrap">
              <Link 
                href="/categories" 
                prefetch={true}
                className="group border-2 border-white/50 hover:border-white text-white px-6 sm:px-8 py-2 sm:py-3 rounded-full font-semibold text-base sm:text-lg transition-all duration-300 flex items-center gap-2 hover:scale-105"
              >
                <span className="group-hover:animate-spin">🎧</span> Explore Genres
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content - Always show sections */}
      <div className="py-8 gradient-dark-purple">
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