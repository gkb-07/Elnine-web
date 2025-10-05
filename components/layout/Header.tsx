'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import HeaderClientMenu from "./HeaderClientMenu";
import SearchBar from "./SearchBar";
import Sidebar from "./Sidebar";

export default function Header() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial user
    const getUser = async () => {
      console.log('Header: Getting initial user...');
      const { data: { user } } = await supabase.auth.getUser();
      console.log('Header: Initial user:', user?.email || 'No user');
      setUser(user);
      setLoading(false);
    };

    getUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Header: Auth state change:', event, session?.user?.email || 'No user');
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return (
        <header className="bg-gray-900/90 backdrop-blur-sm border-b border-gray-700 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Left side - Hamburger, Logo and Navigation */}
        <div className="flex items-center gap-3 sm:gap-6">
          {/* Sidebar with Hamburger */}
          <Sidebar />

          {/* Logo */}
          <Link href="/" className="logo-link flex items-center gap-2 focus:outline-none border-none no-underline">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-heading font-semibold border-none font-section-title-purple">Elninee</div>
          </Link>

          {/* Navigation - Hidden on mobile, visible on tablet+ */}
          <nav className="hidden md:flex items-center gap-4 lg:gap-6">
            <Link href="/categories" className="text-white font-medium hover:text-purple-400 transition-colors text-sm lg:text-base font-section-title">
              Category
            </Link>
            <Link href="/library" className="text-gray-200 font-medium hover:text-purple-400 transition-colors text-sm lg:text-base font-section-title">
              Library
            </Link>
            <Link href="/about" className="text-gray-200 font-medium hover:text-purple-400 transition-colors text-sm lg:text-base font-section-title">
              About
            </Link>
          </nav>
        </div>

        {/* Right side - Search, Tagline and Buttons */}
        <div className="flex items-center gap-3 sm:gap-4 lg:gap-6">
          {/* Search Component - Compact on mobile */}
          <div className="hidden sm:block">
            <SearchBar />
          </div>
          
          {/* Mobile-only search icon could be added here */}
          <div className="sm:hidden">
            <HeaderClientMenu initialEmail={user?.email ?? null} />
          </div>
          
          {/* Desktop menu */}
          <div className="hidden sm:block">
            <HeaderClientMenu initialEmail={user?.email ?? null} />
          </div>
        </div>
      </div>
    </header>
  );
}