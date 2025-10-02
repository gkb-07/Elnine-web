import { notFound } from "next/navigation";

const samplePlaylists = {
  1: {
    id: 1,
    title: "Chill Vibes",
    description: "Perfect tracks to relax and unwind",
    cover_url: "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=800",
    tracks: [
      {
        id: 1,
        title: "Midnight Vibes",
        artist: "Luna Eclipse",
        plays: 2847392,
        cover_url: "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=800",
        preview_url: "/sample-1.mp3",
      },
      {
        id: 2,
        title: "Electric Dreams",
        artist: "Neon Pulse",
        plays: 1923847,
        cover_url: "https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=800",
        preview_url: "/sample-2.mp3",
      },
    ]
  }
};

export default async function PlaylistPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id);
  const playlist = samplePlaylists[id as keyof typeof samplePlaylists];

  if (!playlist) {
    notFound();
  }

  return (
    <div className="space-y-8">
      {/* Playlist Header */}
      <div className="flex items-end gap-6">
        <div className="w-48 h-48 rounded-2xl overflow-hidden shadow-2xl">
          <img 
            src={playlist.cover_url} 
            alt={playlist.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1">
          <p className="text-sm text-[var(--muted)] mb-2">Playlist</p>
          <h1 className="text-4xl md:text-6xl font-black gradient-text mb-4">
            {playlist.title}
          </h1>
          <p className="text-[var(--text-secondary)] text-lg mb-6">
            {playlist.description}
          </p>
          <div className="flex items-center gap-4">
            <button className="btn-primary text-lg px-8 py-4">
              🎵 Play All
            </button>
            <button className="btn-secondary px-6 py-3">
              ❤️ Like
            </button>
          </div>
        </div>
      </div>

      {/* Track List */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Tracks</h2>
        <div className="space-y-2">
          {playlist.tracks.map((track, index) => (
            <div 
              key={track.id} 
              className="flex items-center gap-4 p-4 rounded-xl hover:bg-[var(--surface)] transition-colors group cursor-pointer"
            >
              <div className="w-8 text-center text-[var(--muted)] group-hover:hidden">
                {index + 1}
              </div>
              <div className="w-8 hidden group-hover:flex items-center justify-center">
                <svg className="w-4 h-4 text-[var(--accent)]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
              
              <div className="w-12 h-12 rounded-lg overflow-hidden">
                <img 
                  src={track.cover_url || ''} 
                  alt={track.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate group-hover:text-[var(--accent)] transition-colors">
                  {track.title}
                </p>
                <p className="text-sm text-[var(--muted)] truncate">
                  {track.artist}
                </p>
              </div>

              <div className="text-sm text-[var(--muted)]">
                {Math.floor(Math.random() * 3) + 2}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}
              </div>

              <button className="p-2 opacity-0 group-hover:opacity-100 hover:bg-[var(--surface)] rounded-full transition-all">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

