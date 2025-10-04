import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import ChapterList from './ChapterList';
import NotFoundPage from '@/components/NotFoundPage';

// 🚀 OPTIMIZED: Fast parallel fetching with specific fields only
async function getBookWithChapters(bookId: string) {
  // Run BOTH queries in parallel instead of sequential calls
  const [bookResult, chaptersResult] = await Promise.all([
    supabase
      .from('books')
      .select('id, title, author, description, cover_url, total_chapters, total_duration, rating')
      .eq('id', bookId)
      .single(),
    
    supabase
      .from('chapters')
      .select('id, title, chapter_number, audio_url, duration')
      .eq('book_id', bookId)
      .order('chapter_number', { ascending: true })
  ]);

  if (bookResult.error) {
    console.error('Error fetching book:', bookResult.error);
    return null;
  }

  return { 
    ...bookResult.data, 
    chapters: chaptersResult.data || [] 
  };
}

export default async function BookDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const book = await getBookWithChapters(resolvedParams.id);

  if (!book) {
    return <NotFoundPage message="Book Not Found" linkText="← Back to Home" linkHref="/" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white pb-32">
      {/* Header */}
      <div className="bg-white shadow-sm py-6 mb-8">
        <div className="max-w-7xl mx-auto px-4">
          <Link href="/" prefetch={true} className="text-purple-600 hover:underline flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Book Info Section - Mobile Optimized */}
        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 mb-8 sm:mb-12">
          {/* Cover Image */}
          <div className="lg:w-80 flex-shrink-0 mx-auto lg:mx-0 w-full max-w-xs sm:max-w-sm">
            <div className="bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl shadow-2xl overflow-hidden aspect-[3/4]">
              {book.cover_url ? (
                <img
                  src={book.cover_url}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg className="w-24 h-24 sm:w-32 sm:h-32 text-white/30" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z" />
                  </svg>
                </div>
              )}
            </div>
          </div>

          {/* Book Details - Mobile Optimized */}
          <div className="flex-1">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">{book.title}</h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 mb-4 sm:mb-6">by {book.author}</p>

            {book.description && (
              <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-4 sm:mb-6">
                {book.description}
              </p>
            )}

            {/* Stats - Mobile Optimized */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 text-gray-600 mb-6 sm:mb-8">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <span className="font-semibold text-sm sm:text-base">{book.total_chapters || book.chapters.length || 0} Chapters</span>
              </div>
              
              {book.total_duration && (
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                  </svg>
                  <span className="font-semibold text-sm sm:text-base">
                    {Math.floor(book.total_duration / 3600)}h {Math.floor((book.total_duration % 3600) / 60)}m
                  </span>
                </div>
              )}

              {book.rating && (
                <div className="flex items-center gap-2">
                  <span className="text-yellow-500">⭐</span>
                  <span className="font-semibold text-sm sm:text-base">{book.rating.toFixed(1)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Chapters Section - Mobile Optimized */}
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">
            📖 Chapters ({book.chapters.length})
          </h2>

          {book.chapters.length === 0 ? (
            <div className="text-center py-8 sm:py-12 text-gray-500">
              <svg className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              <p className="text-base sm:text-lg font-semibold mb-2">No chapters available yet</p>
              <p className="text-xs sm:text-sm">Add chapters to this book from Supabase Dashboard</p>
            </div>
          ) : (
            <ChapterList book={book} chapters={book.chapters} />
          )}
        </div>
      </div>
    </div>
  );
}
