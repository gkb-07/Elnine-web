'use client';

import Link from 'next/link';
import { useState } from 'react';

interface BookCardProps {
  book: {
    id: string;
    title: string;
    author: string;
    cover_url?: string;
    total_chapters?: number;
    total_duration?: number;
  };
}

export default function BookCard({ book }: BookCardProps) {
  const [imageError, setImageError] = useState(false);

  // Format duration (seconds to minutes)
  const formatDuration = (seconds?: number) => {
    if (!seconds) return '';
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    return `${minutes}m`;
  };

  return (
    <Link href={`/book/${book.id}`} className="block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer">
        {/* Cover Image */}
        <div className="relative h-64 bg-gradient-to-br from-purple-400 to-purple-600">
          {book.cover_url && !imageError ? (
            <img
              src={book.cover_url}
              alt={book.title}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            // Fallback icon if no cover or error loading
            <div className="w-full h-full flex items-center justify-center">
              <svg
                className="w-20 h-20 text-white/50"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z" />
              </svg>
            </div>
          )}
        </div>

        {/* Book Info */}
        <div className="p-4">
          <h3 className="font-bold text-lg text-gray-800 mb-1 line-clamp-2">
            {book.title}
          </h3>
          <p className="text-gray-600 text-sm mb-2">{book.author}</p>
          
          {/* Metadata */}
          <div className="flex items-center gap-3 text-xs text-gray-500">
            {book.total_chapters && (
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                {book.total_chapters} chapters
              </span>
            )}
            {book.total_duration && (
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                </svg>
                {formatDuration(book.total_duration)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}


