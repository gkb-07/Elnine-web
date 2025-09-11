import Link from "next/link";

export type Playlist = {
  id: number | string;
  title: string;
  cover_url?: string | null;
  updated_at?: string | null;
};

export default function PlaylistCard({ playlist }: { playlist: Playlist }) {
  return (
    <Link href={`/library/playlists/${playlist.id}`} className="block rounded-xl border surface p-4 shadow-soft hover:shadow">
      <div className="h-28 w-full rounded-lg bg-gray-100 overflow-hidden mb-3">
        {playlist.cover_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={playlist.cover_url} alt={playlist.title} className="h-full w-full object-cover" />
        ) : null}
      </div>
      <div className="font-semibold truncate">{playlist.title}</div>
      {playlist.updated_at ? (
        <div className="text-xs muted">Updated {new Date(playlist.updated_at).toLocaleDateString()}</div>
      ) : null}
    </Link>
  );
}


