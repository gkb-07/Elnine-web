'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface Book {
  id: string;
  title: string;
  author: string;
  cover_url?: string;
  created_at: string;
}

async function getBooksByCategory(category: string, limit: number = 4): Promise<Book[]> {
  const { data, error } = await supabase
    .from('books')
    .select('id, title, author, cover_url, created_at')
    .eq('is_published', true)
    .ilike('title', `%${category}%`) // Search for books with category in title
    .order('cover_url', { ascending: false, nullsFirst: false }) // Books with covers first
    .order('created_at', { ascending: false }) // Then by newest
    .limit(limit);

  if (error) {
    console.error('Error fetching books:', error);
    return [];
  }
  
  // If no books found for specific category, get any 4 books
  if (!data || data.length === 0) {
    const { data: fallbackData, error: fallbackError } = await supabase
      .from('books')
      .select('id, title, author, cover_url, created_at')
      .eq('is_published', true)
      .order('cover_url', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (fallbackError) {
      console.error('Error fetching fallback books:', fallbackError);
      return [];
    }
    return fallbackData || [];
  }
  
  return data;
}

export default function TempCategoriesPage() {
  const params = useParams();
  const category = params?.category as string || 'romance';
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      const fetchedBooks = await getBooksByCategory(category, 4);
      setBooks(fetchedBooks);
      setLoading(false);
    };
    fetchBooks();
  }, [category]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading {category} books...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-12 px-4 sm:px-6 lg:px-8 text-white">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-8 text-center font-section-title-purple capitalize">
          {category} Books
        </h1>
        <p className="text-lg text-gray-300 mb-12 text-center max-w-2xl mx-auto">
          Discover {category} audiobooks and stories in this collection.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {books.length > 0 ? (
            books.map((book) => (
              <Link href={`/book/${book.id}`} key={book.id} className="block group">
                <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
                  <div className="aspect-[3/4] relative">
                    {book.cover_url ? (
                      <img
                        src={book.cover_url}
                        alt={book.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center relative">
                        <svg className="w-16 h-16 text-white/50" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14.5c-.83 0-1.5-.67-1.5-1.5h-1c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5h-1c0 .83-.67 1.5-1.5 1.5zm-2.5-3.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm5 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM12 6c-2.76 0-5 2.24-5 5h2c0-1.66 1.34-3 3-3s3 1.34 3 3h2c0-2.76-2.24-5-5-5z" />
                        </svg>
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <div className="text-center">
                            <div className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                              Coming Soon
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg text-white mb-1 line-clamp-2">{book.title}</h3>
                    <p className="text-gray-400 text-sm line-clamp-1">{book.author}</p>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-400">No {category} books found.</p>
          )}
        </div>

        <div className="mt-12 text-center">
          <Link href="/" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-purple-600 hover:bg-purple-700 transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
