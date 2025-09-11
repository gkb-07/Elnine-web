import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function SearchPage({ searchParams }: { searchParams: any }) {
  const q = (searchParams.q ?? "").trim();
  const supabase = await createSupabaseServerClient();

  let tracks: any[] = [];
  let creators: any[] = [];
  if (q) {
    const [t, c] = await Promise.all([
      supabase.from("tracks").select("id,title,artist,plays").ilike("title", `%${q}%`).limit(12),
      supabase.from("creators").select("id,name,avatar_url").ilike("name", `%${q}%`).limit(8),
    ]);
    tracks = (t.data as any[]) ?? [];
    creators = (c.data as any[]) ?? [];
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Search</h1>
      <form action="/search" className="max-w-xl">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search songs, artists, albums"
          className="w-full rounded-md border bg-transparent px-3 py-2 text-sm"
        />
      </form>

      {q ? (
        <>
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">Tracks</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {tracks.map((t) => (
                <Link key={t.id} href={`/track/${t.id}`} className="rounded-xl border surface p-4 shadow-soft hover:shadow">
                  <div className="font-semibold truncate">{t.title}</div>
                  <div className="text-sm muted truncate">{t.artist}</div>
                </Link>
              ))}
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">Creators</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {creators.map((c) => (
                <Link key={c.id} href={`/creators/${c.id}`} className="rounded-xl border surface p-4 shadow-soft hover:shadow">
                  <div className="h-20 w-full rounded-lg bg-gray-100 overflow-hidden mb-2" />
                  <div className="font-semibold truncate">{c.name}</div>
                </Link>
              ))}
            </div>
          </section>
        </>
      ) : (
        <p className="muted">Try searching for a track or creator.</p>
      )}
    </div>
  );
}
