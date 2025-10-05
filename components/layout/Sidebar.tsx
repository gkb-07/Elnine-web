"use client";

import Link from "next/link";
import { useState } from "react";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <>
      {/* Hamburger Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="relative z-[60] w-8 h-8 flex flex-col justify-center items-center gap-1.5 text-white hover:text-gray-300 transition-colors focus:outline-none"
        aria-label="Open menu"
      >
        <span className="block w-6 h-0.5 bg-white rounded"></span>
        <span className="block w-6 h-0.5 bg-white rounded"></span>
        <span className="block w-6 h-0.5 bg-white rounded"></span>
      </button>

      {/* Overlay Backdrop */}
      {isOpen && (
        <div 
          onClick={closeMenu}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
          style={{ 
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
          }}
        />
      )}

      {/* Sidebar Panel */}
      <aside 
        className={`
          fixed top-0 left-0 h-screen w-80 
          bg-white
          shadow-2xl
          z-[9999]
          transition-transform duration-300 ease-in-out
          overflow-y-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        style={{
          position: 'fixed',
          backgroundColor: '#ffffff',
          zIndex: 9999,
          top: 0,
          left: 0,
          height: '100vh',
          width: '320px'
        }}
      >
        {/* Header */}
        <div 
          className="flex items-center justify-between px-6 py-5 border-b border-gray-200 bg-white"
          style={{ backgroundColor: '#ffffff' }}
        >
          <h2 className="text-3xl font-bold text-purple-500 italic">Elnine</h2>
          <button 
            onClick={closeMenu}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="py-2 bg-white" style={{ backgroundColor: '#ffffff' }}>
          {/* Main Section */}
          <div className="py-2 bg-white" style={{ backgroundColor: '#ffffff' }}>
            <Link 
              href="/"
              onClick={closeMenu}
              className="flex items-center gap-4 px-6 py-3.5 text-gray-800 hover:bg-purple-50 hover:text-purple-600 transition-colors font-medium"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
              </svg>
              <span>Home</span>
            </Link>

            <Link 
              href="/"
              onClick={(e) => {
                closeMenu();
                // Focus on search bar after navigation
                setTimeout(() => {
                  const searchInput = document.querySelector('input[placeholder="search your desire"]') as HTMLInputElement;
                  if (searchInput) {
                    searchInput.focus();
                    searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }
                }, 100);
              }}
              className="flex items-center gap-4 px-6 py-3.5 text-gray-800 hover:bg-purple-50 hover:text-purple-600 transition-colors font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>Search</span>
            </Link>

            <Link 
              href="/library"
              onClick={closeMenu}
              className="flex items-center gap-4 px-6 py-3.5 text-gray-800 hover:bg-purple-50 hover:text-purple-600 transition-colors font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <span>Your Library</span>
            </Link>

            <Link 
              href="/profile"
              onClick={closeMenu}
              className="flex items-center gap-4 px-6 py-3.5 text-gray-800 hover:bg-purple-50 hover:text-purple-600 transition-colors font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>Profile</span>
            </Link>
          </div>

          {/* Divider */}
          <div className="my-2 border-t border-gray-200 bg-white" style={{ backgroundColor: '#ffffff' }}></div>

          {/* Library Section */}
          <div className="py-2 bg-white" style={{ backgroundColor: '#ffffff' }}>
            <Link 
              href="/downloads"
              onClick={closeMenu}
              className="flex items-center gap-4 px-6 py-3.5 text-gray-800 hover:bg-purple-50 hover:text-purple-600 transition-colors font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Downloads</span>
            </Link>

            <Link 
              href="/liked"
              onClick={closeMenu}
              className="flex items-center gap-4 px-6 py-3.5 text-gray-800 hover:bg-purple-50 hover:text-purple-600 transition-colors font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span>Liked Songs</span>
            </Link>

            <Link 
              href="/recently-played"
              onClick={closeMenu}
              className="flex items-center gap-4 px-6 py-3.5 text-gray-800 hover:bg-purple-50 hover:text-purple-600 transition-colors font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Recently Played</span>
            </Link>
          </div>

          {/* Divider */}
          <div className="my-2 border-t border-gray-200 bg-white" style={{ backgroundColor: '#ffffff' }}></div>

          {/* Settings Section */}
          <div className="py-2 pb-8 bg-white" style={{ backgroundColor: '#ffffff' }}>
            <Link 
              href="/settings"
              onClick={closeMenu}
              className="flex items-center gap-4 px-6 py-3.5 text-gray-800 hover:bg-purple-50 hover:text-purple-600 transition-colors font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Settings</span>
            </Link>

            <Link 
              href="/help"
              onClick={closeMenu}
              className="flex items-center gap-4 px-6 py-3.5 text-gray-800 hover:bg-purple-50 hover:text-purple-600 transition-colors font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Help & Feedback</span>
            </Link>

            <Link 
              href="/about"
              onClick={closeMenu}
              className="flex items-center gap-4 px-6 py-3.5 text-gray-800 hover:bg-purple-50 hover:text-purple-600 transition-colors font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>About</span>
            </Link>
          </div>
        </nav>
      </aside>
    </>
  );
}

