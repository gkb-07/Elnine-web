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
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    getUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return (
    <header className="bg-white border-b border-gray-100 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Left side - Hamburger, Logo and Navigation */}
        <div className="flex items-center gap-3 sm:gap-6">
          {/* Sidebar with Hamburger */}
          <Sidebar />

          {/* Logo */}
          <Link href="/" className="logo-link flex items-center gap-2 focus:outline-none border-none no-underline">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-heading font-semibold text-purple-400 italic border-none">Elninee</div>
          </Link>

          {/* Navigation - Hidden on mobile, visible on tablet+ */}
          <nav className="hidden md:flex items-center gap-4 lg:gap-6">
            <Link href="/categories" className="text-gray-700 font-medium hover:text-gray-900 transition-colors text-sm lg:text-base">
              Category
            </Link>
            <Link href="/library" className="text-gray-700 font-medium hover:text-gray-900 transition-colors text-sm lg:text-base">
              Library
            </Link>
            <Link href="/about" className="text-gray-700 font-medium hover:text-gray-900 transition-colors text-sm lg:text-base">
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