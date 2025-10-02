import { supabase } from '@/lib/supabase';
import BookCard from '@/components/BookCard';
import Link from 'next/link';

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

async function getFeaturedBooks() {
  const { data: books, error } = await supabase
    .from('books')
    .select('*')
    .eq('is_featured', true)
    .eq('is_published', true)
    .limit(6);

  if (error) {
    console.error('Error fetching featured books:', error);
    return [];
  }

  return books || [];
}

export default async function TestBooksPage() {
  const allBooks = await getBooks();
  const featuredBooks = await getFeaturedBooks();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            📚 Books from Supabase
          </h1>
          <p className="text-gray-600">
            Showing {allBooks.length} books from your database
          </p>
        </div>

        {/* No books message */}
        {allBooks.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📚</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No Books Found</h2>
            <p className="text-gray-600 mb-6">
              Add some books to your Supabase database or upload via the admin page
            </p>
            <Link 
              href="/admin/upload-book"
              className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
            >
              Upload First Book
            </Link>
          </div>
        )}

        {/* Featured Books */}
        {featuredBooks.length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">⭐ Featured Books</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          </section>
        )}

        {/* All Books */}
        {allBooks.length > 0 && (
          <section>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">📖 All Books</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {allBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          </section>
        )}

        {/* Book Details */}
        {allBooks.length > 0 && (
          <section className="mt-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">📋 Book Data (Debug)</h2>
            <div className="bg-white rounded-lg shadow-md p-6 overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b">
                    <th className="py-3 px-4 font-semibold">Title</th>
                    <th className="py-3 px-4 font-semibold">Author</th>
                    <th className="py-3 px-4 font-semibold">Cover URL</th>
                    <th className="py-3 px-4 font-semibold">Featured</th>
                    <th className="py-3 px-4 font-semibold">Chapters</th>
                  </tr>
                </thead>
                <tbody>
                  {allBooks.map((book) => (
                    <tr key={book.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{book.title}</td>
                      <td className="py-3 px-4">{book.author}</td>
                      <td className="py-3 px-4 text-xs text-blue-600 truncate max-w-xs">
                        {book.cover_url || 'No cover'}
                      </td>
                      <td className="py-3 px-4">
                        {book.is_featured ? '⭐ Yes' : 'No'}
                      </td>
                      <td className="py-3 px-4">{book.total_chapters || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Action Buttons */}
        <div className="mt-12 flex gap-4 justify-center">
          <Link 
            href="/admin/upload-book"
            className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
          >
            ➕ Upload New Book
          </Link>
          <Link 
            href="/"
            className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
          >
            🏠 Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}


