import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import HeaderClientMenu from "./HeaderClientMenu";
import ThemeToggle from "./ThemeToggle";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Header() {
  noStore();
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-40 glass-effect border-b border-[var(--border)]">
      <div className="container px-4 py-4 flex items-center gap-6">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[var(--accent)] to-[var(--secondary)] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <span className="text-white font-bold text-lg">E</span>
          </div>
          <span className="text-2xl font-black gradient-text">elnine</span>
        </Link>

        {/* Search Bar */}
        <div className="flex-1 hidden md:flex max-w-2xl">
          <form action="/search" className="w-full relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-[var(--muted)] group-focus-within:text-[var(--accent)] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="search"
              name="q"
              placeholder="Search songs, artists, albums..."
              className="w-full pl-12 pr-4 py-3 rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] placeholder-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-all duration-300 hover:shadow-lg"
            />
          </form>
        </div>

        {/* Navigation */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium">
          <Link 
            href="/#categories" 
            className="text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors relative group"
          >
            Categories
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[var(--accent)] group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link 
            href="/#library" 
            className="text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors relative group"
          >
            Library
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[var(--accent)] group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link 
            href="/about" 
            className="text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors relative group"
          >
            About
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[var(--accent)] group-hover:w-full transition-all duration-300"></span>
          </Link>
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <HeaderClientMenu initialEmail={user?.email ?? null} />
        </div>
      </div>
    </header>
  );
}