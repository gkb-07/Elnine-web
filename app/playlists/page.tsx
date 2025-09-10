import PlaylistCard, { type Playlist } from "@/components/playlists/PlaylistCard";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function PlaylistsPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("playlists")
    .select("id,title,cover_url,updated_at")
    .order("updated_at", { ascending: false })
    .limit(20);
  const playlists = (data as Playlist[]) ?? [];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Featured Playlists</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {playlists.map((pl) => (
          <PlaylistCard key={pl.id} playlist={pl} />
        ))}
      </div>
    </div>
  );
}


