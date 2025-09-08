import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import HeaderClientMenu from "./HeaderClientMenu";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Header() {
  noStore();
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <header className="bg-white/80 backdrop-blur sticky top-0 z-50 border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-2xl font-extrabold text-pink-600">elnine</Link>

        <nav className="hidden sm:flex items-center gap-6 text-sm">
          <Link href="/categories">Categories</Link>
          <Link href="/creators">Creators</Link>
          <Link href="/library">Library</Link>
          <Link href="/about">About</Link>
        </nav>

        {/* Right side: login/sign-up OR avatar menu */}
        <HeaderClientMenu initialEmail={user?.email ?? null} />
      </div>
    </header>
  );
}
