import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import CreatorCard, { type Creator } from "@/components/creators/CreatorCard";
import CategoryCard, { type Category } from "@/components/categories/CategoryCard";

type Track = { id: number; title: string; artist: string | null; plays: number };

export default async function HomePage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Trending for everyone
  const { data: trendingData } = await supabase
    .from("tracks")
    .select("id,title,artist,plays")
    .order("plays", { ascending: false })
    .limit(6);
  const trending = (trendingData as Track[]) ?? [];

  const { data: creatorsData } = await supabase
    .from("creators")
    .select("id,name,avatar_url,bio,plays")
    .order("plays", { ascending: false })
    .limit(6);
  const creators = (creatorsData as Creator[]) ?? [];

  const { data: categoriesData } = await supabase
    .from("categories")
    .select("id,slug,title,cover_url")
    .order("title", { ascending: true })
    .limit(6);
  const categories = (categoriesData as Category[]) ?? [];



  return (
    <div className="space-y-12">
      {/* Featured Hero */}
      <section className="relative rounded-2xl p-10 surface shadow-soft border overflow-hidden">
        <div className="z-10 relative">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[var(--accent)]">The Muse</h1>
          <p className="mt-2 text-xl">Original audio series</p>
          <Link href="/playlists/1" className="mt-4 btn-accent inline-block">Play Episode 1</Link>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Categories</h2>
        <div className="flex overflow-x-auto space-x-5 pb-4">
          {categories.map((cat) => (
            <div key={cat.id} className="flex-shrink-0 w-48">
              <CategoryCard category={cat} />
            </div>
          ))}
        </div>
      </section>

      {/* Trending Now */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Trending Now</h2>
        <div className="flex overflow-x-auto space-x-5 pb-4">
          {trending.map((t) => (
            <div key={t.id} className="flex-shrink-0 w-48">
              <Link href={`/track/${t.id}`} className="card block">
                <div className="h-32 w-full rounded-lg bg-gray-200 mb-3" />
                <div className="font-semibold">{t.title}</div>
                <div className="text-sm muted">{t.artist ?? "Unknown"}</div>
                <div className="text-xs muted">{t.plays} plays</div>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Creators */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Featured Creators</h2>
        <div className="flex overflow-x-auto space-x-5 pb-4">
          {creators.map((c) => (
            <div key={c.id} className="flex-shrink-0 w-48">
              <CreatorCard creator={c} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
