"use client";

import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import BookClickHandler from "@/components/ui/BookClickHandler";
import { useEffect, useState } from "react";

// BookCover component for creating placeholder book covers
function BookCover({ type, title, author }: { type: 'moby-dick' | 'authority'; title: string; author: string }) {
  if (type === 'moby-dick') {
    return (
      <img 
        src="https://m.media-amazon.com/images/I/616R20nvohL._AC_UF1000,1000_QL80_.jpg" 
        alt="Moby Dick by Herman Melville"
        className="w-full h-full object-cover"
      />
    );
  }
  
  if (type === 'authority') {
    return (
      <div className="w-full h-full bg-black text-white flex flex-col items-center justify-between p-4 relative">
        {/* Series info at top */}
        <div className="text-center text-xs opacity-75">
          THE SOUTHERN REACH TRILOGY - BOOK 2
        </div>
        
        {/* Central lighthouse with red beam */}
        <div className="flex-1 flex items-center justify-center relative">
          {/* Lighthouse */}
          <div className="w-2 h-16 bg-white relative">
            <div className="w-4 h-2 bg-white absolute -top-1 -left-1"></div>
            <div className="w-1 h-2 bg-yellow-400 absolute -top-1 left-0.5"></div>
          </div>
          
          {/* Red beam */}
          <div className="absolute left-1/2 top-1/2 transform -translate-y-1/2 translate-x-1">
            <div className="w-8 h-12 bg-gradient-to-r from-red-600 to-red-400 transform skew-x-12 opacity-80"></div>
          </div>
        </div>
        
        {/* Title at bottom */}
        <div className="text-center text-lg font-bold tracking-wider">
          AUTHORITY
        </div>
      </div>
    );
  }
  
  return null;
}

// PlaylistCover component with new image
function PlaylistCover() {
  return (
    <img 
      src="https://tse3.mm.bing.net/th/id/OIP._dDAy28ywYCb8ZjNIBAz6gHaKb?pid=ImgDet&w=184&h=258&c=7&dpr=1.3&o=7&rm=3" 
      alt="Playlist Cover"
      className="w-full h-full object-cover"
    />
  );
}

export default function HomePage() {
  const supabase = createSupabaseBrowserClient();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  // Sample data matching the reference design
  const trendingBooks = [
    { id: 1, title: "Moby Dick", author: "Herman Meville", type: "moby-dick" as const },
    { id: 2, title: "Authority", author: "Jeff Vandermer", type: "authority" as const },
    { id: 3, title: "Moby Dick", author: "Herman Meville", type: "moby-dick" as const },
    { id: 4, title: "Authority", author: "Jeff Vandermer", type: "authority" as const },
    { id: 5, title: "Moby Dick", author: "Herman Meville", type: "moby-dick" as const },
    { id: 6, title: "Authority", author: "Jeff Vandermer", type: "authority" as const },
    { id: 7, title: "Moby Dick", author: "Herman Meville", type: "moby-dick" as const },
  ];

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
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full font-semibold text-lg transition-colors flex items-center gap-2">
                🎵 Start Listening
              </button>
              <button className="border-2 border-white/50 hover:border-white text-white px-8 py-3 rounded-full font-semibold text-lg transition-colors flex items-center gap-2">
                🎧 Explore Genres
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        
        {/* Trending Now Section */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-4xl font-bold text-gray-800">Trending Now</h2>
            <div className="text-gray-400 font-medium">Books</div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex-1 overflow-hidden">
              <div id="trending-books" className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth">
                {trendingBooks.map((book) => (
                  <div key={book.id} className="flex-shrink-0 w-48">
                    <BookClickHandler book={book}>
                      <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                        <div className="aspect-[3/4] relative">
                          <BookCover type={book.type} title={book.title} author={book.author} />
                        </div>
                        <div className="p-4">
                          <h3 className="font-bold text-gray-800">{book.title}</h3>
                          <p className="text-gray-600 text-sm">{book.author}</p>
                        </div>
                      </div>
                    </BookClickHandler>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Navigation Arrow - Outside the cards */}
            <button 
              onClick={() => {
                const container = document.getElementById('trending-books');
                if (container) {
                  container.scrollBy({ left: 200, behavior: 'smooth' });
                }
              }}
              className="flex-shrink-0 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </section>

        {/* Popular Playlists Section */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-8">Popular Playlists</h2>
          
          <div className="flex items-center gap-4">
            <div className="flex-1 overflow-hidden">
              <div id="popular-playlists" className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth">
                {[...Array(12)].map((_, index) => (
                  <div key={index} className="flex-shrink-0 w-48">
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                      <div className="aspect-square relative">
                        <PlaylistCover />
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-gray-800">1000 Black Umbrellas</h3>
                        <p className="text-gray-600 text-sm">Playlist • {20 + index} songs</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Navigation Arrow - Outside the cards */}
            <button 
              onClick={() => {
                const container = document.getElementById('popular-playlists');
                if (container) {
                  container.scrollBy({ left: 200, behavior: 'smooth' });
                }
              }}
              className="flex-shrink-0 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}