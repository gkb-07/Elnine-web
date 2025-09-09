import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type TrackCard = { id: number; title: string; artist: string | null; plays: number };
type PlaylistCard = { id: number; title: string; cover_url: string | null; updated_at: string };

export default async function HomePage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Trending for everyone
  const { data: trending } = await supabase
    .from("tracks")
    .select("id,title,artist,plays")
    .order("plays", { ascending: false })
    .limit(6);

  // User playlists (if signed in)
  let playlists: PlaylistCard[] = [];
  if (user) {
    const { data } = await supabase
      .from("playlists")
      .select("id,title,cover_url,updated_at")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })
      .limit(6);
    playlists = (data as PlaylistCard[]) ?? [];
  }

  return (
    <div className="space-y-10">
      {/* Hero */}
      <section className="rounded-2xl p-10 surface shadow-soft border bg-gradient-to-br from-[var(--bg)] to-transparent">
        <h1 className="text-4xl md:text-5xl font-extrabold">Welcome to Elnine</h1>
        <p className="mt-2 muted">Discover and listen to premium audio stories</p>
        <div className="mt-6 flex gap-3">
          <Link href="/playlists" className="btn-accent">Explore Playlists</Link>
          <Link href="/library" className="inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium border">Your Library</Link>
        </div>
      </section>

      {/* Personalized section if logged in */}
      {user && (
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Your Library</h2>
          {playlists.length === 0 ? (
            <p className="muted">
              You don’t have any playlists yet. <Link className="text-[var(--accent)] underline" href="/library">Go to Library</Link>
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {playlists.map((pl) => (
                <Link
                  key={pl.id}
                  href={`/library/playlists/${pl.id}`}
                  className="rounded-xl border surface p-4 shadow-sm hover:shadow"
                >
                  <div className="h-32 w-full rounded-lg bg-gray-100 overflow-hidden mb-3">
                    {/* optional cover */}
                    {pl.cover_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={pl.cover_url} alt={pl.title} className="h-full w-full object-cover" />
                    ) : null}
                  </div>
                  <div className="font-semibold">{pl.title}</div>
                  <div className="text-xs muted">Updated {new Date(pl.updated_at).toLocaleDateString()}</div>
                </Link>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Trending */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Trending Now</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {((trending as TrackCard[]) ?? []).map((t) => (
            <Link
              key={t.id}
              href={`/track/${t.id}`}
              className="rounded-xl border surface p-4 shadow-sm hover:shadow"
            >
              <div className="font-semibold">{t.title}</div>
              <div className="text-sm muted">{t.artist ?? "Unknown"}</div>
              <div className="text-xs muted">{t.plays} plays</div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
