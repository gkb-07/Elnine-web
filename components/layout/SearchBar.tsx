"use client";

import { useState } from "react";

export default function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search page with query
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <div className="flex items-center gap-4">
      {/* Search Icon */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="search-button w-6 h-6 text-gray-600 hover:text-gray-800 transition-colors focus:outline-none"
      >
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>

      {/* Search Input - appears when search icon is clicked */}
      {isOpen && (
        <form onSubmit={handleSearch} className="flex items-center">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search authors, playlists, audio..."
            className="w-48 px-2 py-1 bg-transparent border-0 border-b border-gray-300 focus:outline-none focus:border-purple-400 text-sm"
            autoFocus
          />
          <button
            type="submit"
            className="ml-2 px-3 py-1 bg-purple-400 text-white rounded hover:bg-purple-500 transition-colors focus:outline-none text-sm"
          >
            Search
          </button>
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              setSearchQuery("");
            }}
            className="ml-2 px-2 py-1 text-gray-500 hover:text-gray-700 transition-colors focus:outline-none text-sm"
          >
            ✕
          </button>
        </form>
      )}
    </div>
  );
}
