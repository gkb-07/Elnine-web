import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import ChapterList from './ChapterList';

// Fetch book with chapters from Supabase
async function getBookWithChapters(bookId: string) {
  // Fetch book details
  const { data: book, error: bookError } = await supabase
    .from('books')
    .select('*')
    .eq('id', bookId)
    .single();

  if (bookError) {
    console.error('Error fetching book:', bookError);
    return null;
  }

  // Fetch chapters
  const { data: chapters, error: chaptersError } = await supabase
    .from('chapters')
    .select('*')
    .eq('book_id', bookId)
    .order('chapter_number', { ascending: true });

  if (chaptersError) {
    console.error('Error fetching chapters:', chaptersError);
    return { ...book, chapters: [] };
  }

  return { ...book, chapters: chapters || [] };
}

export default async function BookDetailPage({ params }: { params: { id: string } }) {
  const book = await getBookWithChapters(params.id);

  if (!book) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Book Not Found</h1>
          <Link href="/" className="text-purple-600 hover:underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white pb-32">
      {/* Header */}
      <div className="bg-white shadow-sm py-6 mb-8">
        <div className="max-w-7xl mx-auto px-4">
          <Link href="/" className="text-purple-600 hover:underline flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        {/* Book Info Section */}
        <div className="flex flex-col md:flex-row gap-8 mb-12">
          {/* Cover Image */}
          <div className="md:w-80 flex-shrink-0">
            <div className="bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl shadow-2xl overflow-hidden aspect-[3/4]">
              {book.cover_url ? (
                <img
                  src={book.cover_url}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg className="w-32 h-32 text-white/30" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z" />
                  </svg>
                </div>
              )}
            </div>
          </div>

          {/* Book Details */}
          <div className="flex-1">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">{book.title}</h1>
            <p className="text-2xl text-gray-600 mb-6">by {book.author}</p>

            {book.description && (
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                {book.description}
              </p>
            )}

            {/* Stats */}
            <div className="flex gap-8 text-gray-600 mb-8">
              <div className="flex items-center gap-2">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <span className="font-semibold">{book.total_chapters || book.chapters.length || 0} Chapters</span>
              </div>
              
              {book.total_duration && (
                <div className="flex items-center gap-2">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                  </svg>
                  <span className="font-semibold">
                    {Math.floor(book.total_duration / 3600)}h {Math.floor((book.total_duration % 3600) / 60)}m
                  </span>
                </div>
              )}

              {book.rating && (
                <div className="flex items-center gap-2">
                  <span className="text-yellow-500">⭐</span>
                  <span className="font-semibold">{book.rating.toFixed(1)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Chapters Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            📖 Chapters ({book.chapters.length})
          </h2>

          {book.chapters.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              <p className="text-lg font-semibold mb-2">No chapters available yet</p>
              <p className="text-sm">Add chapters to this book from Supabase Dashboard</p>
            </div>
          ) : (
            <ChapterList book={book} chapters={book.chapters} />
          )}
        </div>
      </div>
    </div>
  );
}

// Export booksData for backward compatibility with ChapterNavigationHandler
export const booksData: any = {};
