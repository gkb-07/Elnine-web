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
    <header className="sticky top-0 z-50 border-b backdrop-blur surface/80">
      <div className="container px-4 py-3 flex items-center gap-4">
        <Link href="/" className="text-2xl font-extrabold text-[var(--accent)]">elnine</Link>

        <div className="flex-1 hidden md:flex">
          <div className="w-full max-w-xl relative">
            <input
              type="search"
              placeholder="Search songs, artists, albums"
              className="w-full rounded-md border bg-transparent px-3 py-2 text-sm"
            />
          </div>
        </div>

        <nav className="hidden sm:flex items-center gap-6 text-sm ml-auto">
          <Link href="/categories">Categories</Link>
          <Link href="/creators">Creators</Link>
          <Link href="/library">Library</Link>
          <Link href="/about">About</Link>
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <ThemeToggle />
          <HeaderClientMenu initialEmail={user?.email ?? null} />
        </div>
      </div>
    </header>
  );
}
