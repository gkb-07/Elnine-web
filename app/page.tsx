import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import CreatorCard, { type Creator } from "@/components/creators/CreatorCard";
import CategoryCard, { type Category } from "@/components/categories/CategoryCard";
import TrackCard from "@/components/track/TrackCard";

type Track = { 
  id: number; 
  title: string; 
  artist: string | null; 
  plays: number; 
  cover_url: string | null; 
  preview_url: string | null 
};

export default async function HomePage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Enhanced trending tracks with high-quality images
  const trending: Track[] = [
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
    },
    {
      id: 5,
      title: "Golden Hour",
      artist: "Sunset Boulevard",
      plays: 756432,
      cover_url: "https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=800",
      preview_url: "/sample-1.mp3",
    },
    {
      id: 6,
      title: "Cosmic Journey",
      artist: "Stellar Drift",
      plays: 634521,
      cover_url: "https://images.pexels.com/photos/1629236/pexels-photo-1629236.jpeg?auto=compress&cs=tinysrgb&w=800",
      preview_url: "/sample-2.mp3",
    },
  ];

  // Enhanced latest tracks
  const latestOfAllTime: Track[] = [
    {
      id: 7,
      title: "Echoes of Tomorrow",
      artist: "Future Sounds",
      plays: 3456789,
      cover_url: "https://images.pexels.com/photos/1389429/pexels-photo-1389429.jpeg?auto=compress&cs=tinysrgb&w=800",
      preview_url: "/sample-1.mp3",
    },
    {
      id: 8,
      title: "Rhythm & Soul",
      artist: "Groove Masters",
      plays: 2987654,
      cover_url: "https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&cs=tinysrgb&w=800",
      preview_url: "/sample-2.mp3",
    },
    {
      id: 9,
      title: "Digital Harmony",
      artist: "Synth Wave",
      plays: 2345678,
      cover_url: "https://images.pexels.com/photos/1699161/pexels-photo-1699161.jpeg?auto=compress&cs=tinysrgb&w=800",
      preview_url: "/sample-1.mp3",
    },
    {
      id: 10,
      title: "Acoustic Dreams",
      artist: "Indie Folk Collective",
      plays: 1876543,
      cover_url: "https://images.pexels.com/photos/1751731/pexels-photo-1751731.jpeg?auto=compress&cs=tinysrgb&w=800",
      preview_url: "/sample-2.mp3",
    },
    {
      id: 11,
      title: "Bass Drop",
      artist: "Electronic Fusion",
      plays: 1654321,
      cover_url: "https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=800",
      preview_url: "/sample-1.mp3",
    },
    {
      id: 12,
      title: "Chill Lounge",
      artist: "Ambient Collective",
      plays: 1432109,
      cover_url: "https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=800",
      preview_url: "/sample-2.mp3",
    },
  ];

  // Enhanced categories with better images - showing only 3 initially
  const categories: Category[] = [
    { 
      id: 1, 
      slug: "electronic", 
      title: "Electronic", 
      cover_url: "https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=800" 
    },
    { 
      id: 2, 
      slug: "indie", 
      title: "Indie", 
      cover_url: "https://images.pexels.com/photos/1751731/pexels-photo-1751731.jpeg?auto=compress&cs=tinysrgb&w=800" 
    },
    { 
      id: 3, 
      slug: "ambient", 
      title: "Ambient", 
      cover_url: "https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=800" 
    },
  ];

  const allCategories: Category[] = [
    ...categories,
    { 
      id: 4, 
      slug: "rock", 
      title: "Rock", 
      cover_url: "https://images.pexels.com/photos/1389429/pexels-photo-1389429.jpeg?auto=compress&cs=tinysrgb&w=800" 
    },
    { 
      id: 5, 
      slug: "jazz", 
      title: "Jazz", 
      cover_url: "https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&cs=tinysrgb&w=800" 
    },
    { 
      id: 6, 
      slug: "classical", 
      title: "Classical", 
      cover_url: "https://images.pexels.com/photos/1699161/pexels-photo-1699161.jpeg?auto=compress&cs=tinysrgb&w=800" 
    },
  ];

  return (
    <div className="space-y-16 pb-32">
      {/* Enhanced Hero Section */}
      <section className="relative rounded-3xl overflow-hidden shadow-2xl">
        <div 
          className="relative h-[70vh] min-h-[500px] flex items-center justify-center"
          style={{
            backgroundImage: `url(https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=1600)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 hero-gradient" />
          <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-6">
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black mb-6 floating-animation">
              <span className="gradient-text">Discover</span> Your Sound
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-2xl mx-auto leading-relaxed">
              Immerse yourself in a world of premium audio experiences. From trending hits to hidden gems.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/playlists/1" className="btn-primary text-lg px-8 py-4">
                🎵 Start Listening
              </Link>
              <Link href="/categories" className="btn-secondary text-lg px-8 py-4">
                🎧 Explore Genres
              </Link>
            </div>
          </div>
          
          {/* Floating music notes animation */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-20 left-20 text-4xl opacity-20 floating-animation" style={{animationDelay: '0s'}}>🎵</div>
            <div className="absolute top-40 right-32 text-3xl opacity-30 floating-animation" style={{animationDelay: '1s'}}>🎶</div>
            <div className="absolute bottom-32 left-32 text-5xl opacity-15 floating-animation" style={{animationDelay: '2s'}}>🎼</div>
            <div className="absolute bottom-20 right-20 text-4xl opacity-25 floating-animation" style={{animationDelay: '3s'}}>🎤</div>
          </div>
        </div>
      </section>

      {/* Enhanced Categories Section */}
      <section className="section-padding scroll-fade" id="categories">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="gradient-text mb-4">Explore Genres</h2>
            <p className="text-[var(--text-secondary)] text-lg">Discover music that moves you</p>
          </div>
          <Link 
            href="/categories" 
            className="btn-secondary group"
          >
            View All Genres
            <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
            </svg>
          </Link>
        </div>
        
        <div className="category-grid">
          {categories.map((cat, index) => (
            <div key={cat.id} className="scroll-fade" style={{animationDelay: `${index * 0.1}s`}}>
              <div className="card-large group cursor-pointer">
                <Link href={`/categories/${cat.slug}`} className="block h-full">
                  <div className="relative h-48 rounded-xl overflow-hidden mb-6">
                    <img 
                      src={cat.cover_url || ''} 
                      alt={cat.title} 
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <h3 className="text-white text-2xl font-bold">{cat.title}</h3>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--muted)] text-sm">Explore {cat.title.toLowerCase()} music</span>
                    <svg className="w-6 h-6 text-[var(--accent)] group-hover:translate-x-2 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
                    </svg>
                  </div>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Enhanced Trending Section */}
      <section className="section-padding scroll-fade" id="trending-now">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="gradient-text mb-4">🔥 Trending Now</h2>
            <p className="text-[var(--text-secondary)] text-lg">What everyone's listening to</p>
          </div>
          <Link href="/tracks" className="btn-secondary group">
            See All Trending
            <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
            </svg>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {trending.map((track, index) => (
            <div key={track.id} className="scroll-fade" style={{animationDelay: `${index * 0.1}s`}}>
              <TrackCard track={track} />
            </div>
          ))}
        </div>
      </section>

      {/* Enhanced Latest Section */}
      <section className="section-padding scroll-fade" id="latest-of-all-time">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="gradient-text mb-4">✨ All-Time Favorites</h2>
            <p className="text-[var(--text-secondary)] text-lg">Timeless tracks that never get old</p>
          </div>
          <Link href="/tracks" className="btn-secondary group">
            Explore Classics
            <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
            </svg>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {latestOfAllTime.map((track, index) => (
            <div key={track.id} className="scroll-fade" style={{animationDelay: `${index * 0.1}s`}}>
              <TrackCard track={track} />
            </div>
          ))}
        </div>
      </section>

      {/* Enhanced Library Section */}
      {user && (
        <section className="section-padding scroll-fade" id="library">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="gradient-text mb-4">📚 Your Library</h2>
              <p className="text-[var(--text-secondary)] text-lg">Your personal music collection</p>
            </div>
            <Link href="/library" className="btn-primary">
              View Full Library
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card-large flex items-center justify-center scroll-fade" style={{animationDelay: `${i * 0.1}s`}}>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--secondary)] mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl">🎵</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Playlist {i + 1}</h3>
                  <p className="text-[var(--muted)] text-sm">Your curated collection</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}