import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import HeaderClientMenu from "./HeaderClientMenu";
import ThemeToggle from "@/components/ui/ThemeToggle";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Header() {
  noStore();
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <header className="glass sticky top-0 z-50 border-b border-[var(--border-color)]">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-3xl font-black gradient-text hover:scale-105 transition-transform">
          elnine
        </Link>

        <nav className="hidden sm:flex items-center gap-8 text-sm font-medium">
          <Link href="/categories" className="hover:text-[var(--accent-primary)] transition-colors relative group">
            Categories
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[var(--accent-primary)] transition-all group-hover:w-full"></span>
          </Link>
          <Link href="/creators" className="hover:text-[var(--accent-primary)] transition-colors relative group">
            Creators
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[var(--accent-primary)] transition-all group-hover:w-full"></span>
          </Link>
          <Link href="/library" className="hover:text-[var(--accent-primary)] transition-colors relative group">
            Library
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[var(--accent-primary)] transition-all group-hover:w-full"></span>
          </Link>
          <Link href="/about" className="hover:text-[var(--accent-primary)] transition-colors relative group">
            About
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[var(--accent-primary)] transition-all group-hover:w-full"></span>
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <HeaderClientMenu initialEmail={user?.email ?? null} />
        </div>
      </div>
    </header>
  );
}