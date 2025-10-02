'use client';

import { useRef } from 'react';
import BookClickHandler from './ui/BookClickHandler';

interface Book {
  id: string;
  title: string;
  author: string;
  cover_url?: string;
}

interface BookGridProps {
  title: string;
  books: Book[];
}

// BookCover component
function BookCover({ coverUrl, title }: { coverUrl?: string; title: string }) {
  if (coverUrl) {
    return (
      <img 
        src={coverUrl}
        alt={title}
        className="w-full h-full object-cover"
      />
    );
  }
  
  return (
    <div className="w-full h-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
      <svg className="w-16 h-16 text-white/30" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z" />
      </svg>
    </div>
  );
}

export default function BookGrid({ title, books }: BookGridProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'right' ? 600 : -600;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (books.length === 0) {
    return null;
  }

  // Split books into two rows
  const firstRowBooks = books.slice(0, Math.ceil(books.length / 2));
  const secondRowBooks = books.slice(Math.ceil(books.length / 2));

  return (
    <section className="mb-16">
      <h2 className="text-4xl font-bold text-gray-800 mb-8 px-8">{title}</h2>
      
      <div className="relative group">
        {/* Left Arrow - Centered Vertically */}
        <button 
          onClick={() => handleScroll('left')}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all opacity-0 group-hover:opacity-100"
        >
          <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        {/* Scrollable Content */}
        <div className="overflow-hidden">
          <div 
            ref={scrollRef}
            className="overflow-x-auto scrollbar-hide scroll-smooth px-8"
          >
            {/* First Row */}
            <div className="flex gap-4 mb-4">
              {firstRowBooks.map((book) => (
                <div key={book.id} className="flex-shrink-0 w-48">
                  <BookClickHandler book={{ id: book.id, title: book.title, author: book.author, type: "audiobook" }}>
                    <div className="group cursor-pointer">
                      <div className="aspect-[3/4] bg-gray-200 rounded-lg overflow-hidden mb-2 shadow-sm hover:shadow-md transition-shadow">
                        <BookCover coverUrl={book.cover_url} title={book.title} />
                      </div>
                      <h3 className="font-semibold text-sm text-gray-800 truncate">{book.title}</h3>
                      <p className="text-xs text-gray-600 truncate">{book.author}</p>
                    </div>
                  </BookClickHandler>
                </div>
              ))}
            </div>

            {/* Second Row */}
            {secondRowBooks.length > 0 && (
              <div className="flex gap-4">
                {secondRowBooks.map((book) => (
                  <div key={book.id} className="flex-shrink-0 w-48">
                    <BookClickHandler book={{ id: book.id, title: book.title, author: book.author, type: "audiobook" }}>
                      <div className="group cursor-pointer">
                        <div className="aspect-[3/4] bg-gray-200 rounded-lg overflow-hidden mb-2 shadow-sm hover:shadow-md transition-shadow">
                          <BookCover coverUrl={book.cover_url} title={book.title} />
                        </div>
                        <h3 className="font-semibold text-sm text-gray-800 truncate">{book.title}</h3>
                        <p className="text-xs text-gray-600 truncate">{book.author}</p>
                      </div>
                    </BookClickHandler>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Right Arrow - Centered Vertically */}
        <button 
          onClick={() => handleScroll('right')}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all opacity-0 group-hover:opacity-100"
        >
          <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </section>
  );
}


