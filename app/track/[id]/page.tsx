import { notFound } from "next/navigation";
import TrackCard from "@/components/track/TrackCard";

const sampleTracks = {
  1: {
    id: 1,
    title: "Midnight Vibes",
    artist: "Luna Eclipse",
    plays: 2847392,
    cover_url: "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=800",
    preview_url: "/sample-1.mp3",
    duration: "3:45",
    genre: "Electronic",
    description: "A mesmerizing journey through ambient soundscapes and ethereal melodies."
  },
  2: {
    id: 2,
    title: "Electric Dreams",
    artist: "Neon Pulse",
    plays: 1923847,
    cover_url: "https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=800",
    preview_url: "/sample-2.mp3",
    duration: "4:12",
    genre: "Synthwave",
    description: "Pulsating synths and retro-futuristic vibes that transport you to another dimension."
  }
};

const relatedTracks = [
  {
    id: 3,
    title: "Ocean Waves",
    artist: "Coastal Sounds",
    plays: 1456789,
    cover_url: "https://images.pexels.com/photos/1671325/pexels-photo-1671325.jpeg?auto=compress&cs=tinysrgb&w=800",
    preview_url: "/sample-1.mp3",
  },
  {
    id: 4,
    title: "Urban Nights",
    artist: "City Lights Collective",
    plays: 987654,
    cover_url: "https://images.pexels.com/photos/2747449/pexels-photo-2747449.jpeg?auto=compress&cs=tinysrgb&w=800",
    preview_url: "/sample-2.mp3",
  }
];

export default function TrackPage({ params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  const track = sampleTracks[id as keyof typeof sampleTracks];

  if (!track) {
    notFound();
  }

  return (
    <div className="space-y-12">
      {/* Track Header */}
      <div className="flex flex-col lg:flex-row items-start gap-8">
        <div className="w-full lg:w-96 h-96 rounded-3xl overflow-hidden shadow-2xl">
          <img 
            src={track.cover_url} 
            alt={track.title}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="flex-1 space-y-6">
          <div>
            <p className="text-sm text-gray-500 mb-2">Track</p>
            <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-4">
              {track.title}
            </h1>
            <p className="text-xl text-gray-700 mb-2">
              by {track.artist}
            </p>
            <p className="text-gray-500">
              {track.plays.toLocaleString()} plays • {track.duration} • {track.genre}
            </p>
          </div>

          <p className="text-gray-700 text-lg leading-relaxed">
            {track.description}
          </p>

          <div className="flex items-center gap-4">
            <button className="btn-primary text-lg px-8 py-4 flex items-center gap-2">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
              Play Now
            </button>
            <button className="btn-secondary px-6 py-3 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              Like
            </button>
            <button className="p-3 hover:bg-gray-100 rounded-full transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Related Tracks */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-8">More Like This</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {relatedTracks.map((relatedTrack) => (
            <TrackCard key={relatedTrack.id} track={relatedTrack} />
          ))}
        </div>
      </section>
    </div>
  );
}

