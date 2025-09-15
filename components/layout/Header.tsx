import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import HeaderClientMenu from "./HeaderClientMenu";
import SearchBar from "./SearchBar";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Header() {
  noStore();
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <header className="bg-white border-b border-gray-100 px-8 py-6">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Left side - Logo and Search */}
        <div className="flex items-center gap-8">
          {/* Logo */}
          <Link href="/" className="logo-link flex items-center gap-2 focus:outline-none border-none no-underline">
            <div className="text-4xl font-light text-purple-400 italic border-none">elnine</div>
          </Link>

          {/* Search Component */}
          <SearchBar />
        </div>

        {/* Center - Navigation */}
        <nav className="flex items-center gap-12">
          <Link href="/creators" className="text-gray-700 font-medium hover:text-gray-900 transition-colors">
            Creators
          </Link>
          <Link href="/categories" className="text-gray-700 font-medium hover:text-gray-900 transition-colors">
            Category
          </Link>
          <Link href="/about" className="text-gray-700 font-medium hover:text-gray-900 transition-colors">
            About
          </Link>
          <Link href="/library" className="text-gray-700 font-medium hover:text-gray-900 transition-colors">
            Library
          </Link>
        </nav>

        {/* Right side - Tagline and Buttons */}
        <div className="flex items-center gap-6">
          <div className="text-gray-600 font-medium">
            the app for audio <span className="text-purple-400">desires</span>
          </div>
          
          <HeaderClientMenu initialEmail={user?.email ?? null} />
        </div>
      </div>
    </header>
  );
}