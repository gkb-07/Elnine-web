'use client';

import { useRef } from 'react';
import BookClickHandler from './ui/BookClickHandler';

interface Book {
  id: string;
  title: string;
  author: string;
  cover_url?: string;
}

interface BookSectionProps {
  title: string;
  books: Book[];
  scrollId?: string;
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
      <svg className="w-24 h-24 text-white/30" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z" />
      </svg>
    </div>
  );
}

export default function BookSection({ title, books, scrollId }: BookSectionProps) {
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

  return (
    <section className="mb-8 sm:mb-12 lg:mb-16">
      <div className="flex justify-between items-center mb-6 sm:mb-8 px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800">{title}</h2>
        <div className="text-gray-400 font-medium text-sm sm:text-base">Books</div>
      </div>
      
      <div className="relative group">
        {/* Left Arrow - Mobile Optimized */}
        <button 
          onClick={() => handleScroll('left')}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 sm:p-3 shadow-lg hover:shadow-xl transition-all opacity-0 group-hover:opacity-100"
          aria-label="Scroll left"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        {/* Scrollable Content */}
        <div className="overflow-hidden">
          <div 
            ref={scrollRef}
            id={scrollId} 
            className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth px-4 sm:px-6 lg:px-8"
          >
            {books.map((book) => (
              <div key={book.id} className="flex-shrink-0 w-32 sm:w-40 md:w-44 lg:w-48">
                <BookClickHandler book={{ id: book.id, title: book.title, author: book.author, type: "audiobook" }}>
                  <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                    <div className="aspect-[3/4] relative">
                      <BookCover coverUrl={book.cover_url} title={book.title} />
                    </div>
                    <div className="p-2 sm:p-3 lg:p-4">
                      <h3 className="font-bold text-gray-800 truncate text-sm sm:text-base">{book.title}</h3>
                      <p className="text-gray-600 text-xs sm:text-sm truncate">{book.author}</p>
                    </div>
                  </div>
                </BookClickHandler>
              </div>
            ))}
          </div>
        </div>
        
        {/* Right Arrow - Mobile Optimized */}
        <button 
          onClick={() => handleScroll('right')}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 sm:p-3 shadow-lg hover:shadow-xl transition-all opacity-0 group-hover:opacity-100"
          aria-label="Scroll right"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </section>
  );
}


