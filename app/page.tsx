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
  // Fetch different sets of books for each section
  const trendingBooks = await getTrendingBooks(12);
  const fictionBooks = await getBooksByCategory('fiction', 12);
  const romanceBooks = await getBooksByCategory('romance', 12);
  const mysteryBooks = await getBooksByCategory('mystery', 12);
  const biographyBooks = await getBooksByCategory('biography', 12);
  const newlyReleasedBooks = await getNewlyReleasedBooks(12);
  const allBooks = await getBooks();

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
              <Link href="/categories" className="border-2 border-white/50 hover:border-white text-white px-8 py-3 rounded-full font-semibold text-lg transition-colors flex items-center gap-2">
                🎧 Explore Genres
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="py-12">
        
        {/* Show message if no books */}
        {allBooks.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📚</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">No Books Yet</h2>
            <p className="text-gray-600 mb-6">Add books to your Supabase database to get started!</p>
            <Link 
              href="/admin/upload-book"
              className="inline-block bg-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-purple-700 transition-colors"
            >
              Upload First Book
            </Link>
          </div>
        )}

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
