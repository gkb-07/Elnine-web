import Link from "next/link";
import { supabase } from '@/lib/supabase';
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
  // 🚀 OPTIMIZED: Fetch ALL data in parallel for maximum speed
  const [
    allBooks,
    trendingBooks,
    fictionBooks,
    romanceBooks,
    mysteryBooks,
    biographyBooks,
    newlyReleasedBooks
  ] = await Promise.all([
    getBooks(),
    getTrendingBooks(12),
    getBooksByCategory('fiction', 12),
    getBooksByCategory('romance', 12),
    getBooksByCategory('mystery', 12),
    getBooksByCategory('biography', 12),
    getNewlyReleasedBooks(12)
  ]);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative h-[60vh] bg-cover bg-center bg-blend-normal"
        style={{
          backgroundImage: "url('https://m.media-amazon.com/images/I/61MdvINmm7L.jpg')"
        }}
      >
        <div className="relative z-10 flex items-center justify-center h-full text-center text-white px-8">
          <div>
            <h1 className="text-6xl md:text-8xl font-bold mb-6  text-purple-900 leading-tight">
              Discover Your<br />
              Sound
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Immerse yourself in a world of premium audio experiences.<br />
              From trending hits to hidden gems.
            </p>
            <div className="flex gap-6 justify-center">
              <Link 
                href="/categories" 
                prefetch={true}
                className="border-2 border-white/50 hover:border-white text-white px-8 py-3 rounded-full font-semibold text-lg transition-colors flex items-center gap-2"
              >
                🎧 Explore Genres
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content - Always show sections */}
      <div className="py-12">
        <HomeSections 
          allBooks={allBooks}
          trendingBooks={trendingBooks}
          fictionBooks={fictionBooks}
          romanceBooks={romanceBooks}
          mysteryBooks={mysteryBooks}
          biographyBooks={biographyBooks}
          newlyReleasedBooks={newlyReleasedBooks}
        />
      </div>
    </div>
  );
}
