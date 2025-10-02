import Link from "next/link";
import TrackCard from "@/components/track/TrackCard";
import { notFound } from "next/navigation";

const categoryData = {
  electronic: {
    title: "Electronic",
    description: "Dive into the world of electronic music with pulsating beats and synthesized sounds.",
    cover_url: "https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=1600",
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
      {
        id: 5,
        title: "Digital Harmony",
        artist: "Synth Wave",
        plays: 2345678,
        cover_url: "https://images.pexels.com/photos/1699161/pexels-photo-1699161.jpeg?auto=compress&cs=tinysrgb&w=800",
        preview_url: "/sample-1.mp3",
      },
      {
        id: 6,
        title: "Bass Drop",
        artist: "Electronic Fusion",
        plays: 1654321,
        cover_url: "https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=800",
        preview_url: "/sample-2.mp3",
      }
    ]
  },
  indie: {
    title: "Indie",
    description: "Independent artists creating unique and authentic musical experiences.",
    cover_url: "https://images.pexels.com/photos/1751731/pexels-photo-1751731.jpeg?auto=compress&cs=tinysrgb&w=1600",
    tracks: [
      {
        id: 4,
        title: "Acoustic Dreams",
        artist: "Indie Folk Collective",
        plays: 1876543,
        cover_url: "https://images.pexels.com/photos/1751731/pexels-photo-1751731.jpeg?auto=compress&cs=tinysrgb&w=800",
        preview_url: "/sample-1.mp3",
      },
      {
        id: 7,
        title: "Coffee Shop Sessions",
        artist: "The Midnight Poets",
        plays: 1234567,
        cover_url: "https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&cs=tinysrgb&w=800",
        preview_url: "/sample-2.mp3",
      }
    ]
  },
  ambient: {
    title: "Ambient",
    description: "Atmospheric and immersive soundscapes for relaxation and meditation.",
    cover_url: "https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=1600",
    tracks: [
      {
        id: 3,
        title: "Ocean Waves",
        artist: "Coastal Sounds",
        plays: 1456789,
        cover_url: "https://images.pexels.com/photos/1671325/pexels-photo-1671325.jpeg?auto=compress&cs=tinysrgb&w=800",
        preview_url: "/sample-1.mp3",
      },
      {
        id: 8,
        title: "Chill Lounge",
        artist: "Ambient Collective",
        plays: 1432109,
        cover_url: "https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=800",
        preview_url: "/sample-2.mp3",
      }
    ]
  }
};
export default async function CategoryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const category = categoryData[resolvedParams.slug as keyof typeof categoryData];

  if (!category) {
    notFound();
  }

  return (
    <div className="space-y-12 pb-32">
      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden min-h-[400px] flex items-center">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${category.cover_url})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        
        <div className="relative z-10 max-w-4xl px-8">
          <Link 
            href="/categories" 
            className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            All Genres
          </Link>
          
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6">
            {category.title}
          </h1>
          <p className="text-xl text-gray-200 max-w-2xl leading-relaxed">
            {category.description}
          </p>
          
          <div className="mt-8 flex items-center gap-4">
            <button className="btn-primary text-lg px-8 py-4">
              🎵 Play All
            </button>
            <div className="text-white/80 text-sm">
              {category.tracks.length} tracks
            </div>
          </div>
        </div>
      </div>

      {/* Tracks Section */}
      <section>
        <h2 className="text-3xl font-bold gradient-text mb-8">Featured {category.title} Tracks</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {category.tracks.map((track, index) => (
            <div key={track.id} className="scroll-fade" style={{animationDelay: `${index * 0.1}s`}}>
              <TrackCard track={track} />
            </div>
          ))}
        </div>
      </section>

      {/* Related Categories */}
      <section>
        <h2 className="text-3xl font-bold gradient-text mb-8">Explore More Genres</h2>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {Object.entries(categoryData).filter(([slug]) => slug !== resolvedParams.slug).map(([slug, data]) => (
            <Link 
              key={slug}
              href={`/categories/${slug}`}
              className="flex-shrink-0 w-48 h-32 rounded-xl overflow-hidden relative group hover:scale-105 transition-transform"
            >
              <img 
                src={data.cover_url} 
                alt={data.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
              <div className="absolute bottom-4 left-4">
                <h3 className="text-white font-bold text-lg">{data.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}