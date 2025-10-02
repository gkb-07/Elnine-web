"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  // Debounce typing → update home URL query without navigating away
  const debouncedQuery = useMemo(() => {
    let timeout: any;
    return (value: string) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        const q = value.trim();
        const url = q ? `/?q=${encodeURIComponent(q)}` : "/";
        router.replace(url);
        // Notify any listeners on the home page
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("homeSearch", { detail: q }));
        }
      }, 300);
    };
  }, [router]);

  useEffect(() => {
    debouncedQuery(searchQuery);
  }, [searchQuery, debouncedQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    const url = q ? `/?q=${encodeURIComponent(q)}` : "/";
    router.replace(url);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("homeSearch", { detail: q }));
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative">
      <div className="flex items-center bg-gray-900 rounded-md border border-gray-700 px-4 py-2 focus-within:ring-0 focus-within:outline-none">
        {/* Search Icon */}
        <svg 
          className="w-5 h-5 text-gray-400 mr-3" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        
        {/* Search Input */}
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="search your desire"
          className="bg-transparent border-0 text-white placeholder-gray-400 focus:outline-none focus:ring-0 outline-none ring-0 text-sm w-64"
        />
      </div>
    </form>
  );
}
