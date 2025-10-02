import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import HeaderClientMenu from "./HeaderClientMenu";
import SearchBar from "./SearchBar";
import Sidebar from "./Sidebar";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Header() {
  noStore();
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <header className="bg-white border-b border-gray-100 px-8 py-6">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Left side - Hamburger, Logo and Navigation */}
        <div className="flex items-center gap-6">
          {/* Sidebar with Hamburger */}
          <Sidebar />

          {/* Logo */}
          <Link href="/" className="logo-link flex items-center gap-2 focus:outline-none border-none no-underline">
            <div className="text-4xl font-heading font-semibold text-purple-400 italic border-none">Elninee</div>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-6">
            <Link href="/categories" className="text-gray-700 font-medium hover:text-gray-900 transition-colors">
              Category
            </Link>
            <Link href="/library" className="text-gray-700 font-medium hover:text-gray-900 transition-colors">
              Library
            </Link>
            <Link href="/about" className="text-gray-700 font-medium hover:text-gray-900 transition-colors">
              About
            </Link>
          </nav>
        </div>

        {/* Right side - Search, Tagline and Buttons */}
        <div className="flex items-center gap-6">
          {/* Search Component */}
          <SearchBar />
          
          
          
          <HeaderClientMenu initialEmail={user?.email ?? null} />
        </div>
      </div>
    </header>
  );
}