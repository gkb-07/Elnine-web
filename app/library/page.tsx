// app/library/page.tsx
import Link from 'next/link';
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function LibraryPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/signin");
  
  // 🚀 OPTIMIZED: Fetch user's books quickly
  const { data: userBooks } = await supabase
    .from('books')
    .select('id, title, author, cover_url, created_at')
    .order('created_at', { ascending: false })
    .limit(20);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">My Library</h1>
          <p className="text-lg text-gray-600 mt-2">Welcome back, {user.email}</p>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-4 mb-8">
          <Link 
            href="/" 
            prefetch={true}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>

        {/* Books Grid */}
        {userBooks && userBooks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {userBooks.map((book) => (
              <Link 
                key={book.id} 
                href={`/book/${book.id}`}
                prefetch={true}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="aspect-[3/4] bg-gray-200 relative">
                  {book.cover_url ? (
                    <img 
                      src={book.cover_url} 
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-800 truncate">{book.title}</h3>
                  <p className="text-gray-600 text-sm truncate">{book.author}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"/>
            </svg>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No books in your library yet</h3>
            <p className="text-gray-500 mb-4">Start exploring and add books to your collection</p>
            <Link 
              href="/categories" 
              prefetch={true}
              className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
            >
              Browse Categories
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
