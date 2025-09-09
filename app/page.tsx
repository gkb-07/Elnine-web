import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import CreatorCard, { type Creator } from "@/components/creators/CreatorCard";
import CategoryCard, { type Category } from "@/components/categories/CategoryCard";
import TrackCard from "@/components/track/TrackCard";

type Track = { id: number; title: string; artist: string | null; plays: number; cover_url: string | null; preview_url: string | null };

export default async function HomePage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Trending for everyone
  // Hardcoded data for demonstration based on user's request
  const trending: Track[] = [
    {
      id: 1,
      title: "Hangover Horn",
      artist: "Marley",
      plays: 12983,
      cover_url: "https://picsum.photos/seed/1/400/400",
      preview_url: "/sample-1.mp3",
    },
    {
      id: 2,
      title: "Sunset Drive",
      artist: "Chillwave Collective",
      plays: 9876,
      cover_url: "https://picsum.photos/seed/2/400/400",
      preview_url: "/sample-2.mp3",
    },
    {
      id: 3,
      title: "City Lights",
      artist: "Urban Beats",
      plays: 7654,
      cover_url: "https://picsum.photos/seed/3/400/400",
      preview_url: "/sample-1.mp3",
    },
    {
      id: 4,
      title: "Morning Dew",
      artist: "Nature Sounds",
      plays: 5432,
      cover_url: "https://picsum.photos/seed/4/400/400",
      preview_url: "/sample-2.mp3",
    },
    {
      id: 5,
      title: "Electric Dreams",
      artist: "Synthwave Duo",
      plays: 3210,
      cover_url: "https://picsum.photos/seed/5/400/400",
      preview_url: "/sample-1.mp3",
    },
    {
      id: 6,
      title: "Rainy Days",
      artist: "Acoustic Soul",
      plays: 1098,
      cover_url: "https://picsum.photos/seed/6/400/400",
      preview_url: "/sample-2.mp3",
    },
  ];

  // Latest of All Time
  // Hardcoded data for demonstration based on user's request
  const latestOfAllTime: Track[] = [
    {
      id: 7,
      title: "Episode One: The First...",
      artist: "Podcast Pro",
      plays: 268428,
      cover_url: "https://picsum.photos/seed/7/400/400",
      preview_url: "/sample-1.mp3",
    },
    {
      id: 8,
      title: "Deep House Mix 2023",
      artist: "DJ Groove",
      plays: 150000,
      cover_url: "https://picsum.photos/seed/8/400/400",
      preview_url: "/sample-2.mp3",
    },
    {
      id: 9,
      title: "Classical Study Music",
      artist: "Orchestra Ensemble",
      plays: 120000,
      cover_url: "https://picsum.photos/seed/9/400/400",
      preview_url: "/sample-1.mp3",
    },
    {
      id: 10,
      title: "Lo-Fi Chill Session",
      artist: "Bedroom Producer",
      plays: 90000,
      cover_url: "https://picsum.photos/seed/10/400/400",
      preview_url: "/sample-2.mp3",
    },
    {
      id: 11,
      title: "Workout Motivation",
      artist: "Fitness Beats",
      plays: 70000,
      cover_url: "https://picsum.photos/seed/11/400/400",
      preview_url: "/sample-1.mp3",
    },
    {
      id: 12,
      title: "Meditation Sounds",
      artist: "Zen Master",
      plays: 50000,
      cover_url: "https://picsum.photos/seed/12/400/400",
      preview_url: "/sample-2.mp3",
    },
  ];

  

  // Hardcoded categories for demonstration
  const categories: Category[] = [
    { id: 1, slug: "rock", title: "Rock", cover_url: "https://picsum.photos/seed/rock/400/400" },
    { id: 2, slug: "pop", title: "Pop", cover_url: "https://picsum.photos/seed/pop/400/400" },
    { id: 3, slug: "jazz", title: "Jazz", cover_url: "https://picsum.photos/seed/jazz/400/400" },
    { id: 4, slug: "electronic", title: "Electronic", cover_url: "https://picsum.photos/seed/electronic/400/400" },
    { id: 5, slug: "hip-hop", title: "Hip Hop", cover_url: "https://picsum.photos/seed/hiphop/400/400" },
    { id: 6, slug: "classical", title: "Classical", cover_url: "https://picsum.photos/seed/classical/400/400" },
  ];



  return (
    (<div className="space-y-12">
      {/* Featured Hero */}
      <section
        className="relative rounded-2xl p-20 surface shadow-soft border overflow-hidden"
        style={{
          backgroundImage: `url(https://images.pexels.com/photos/374631/pexels-photo-374631.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="z-10 relative">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white">The Muse</h1>
          <p className="mt-2 text-xl text-gray-200">Original audio series</p>
          <Link href="/playlists/1" className="mt-4 btn-accent inline-block">Play Episode 1</Link>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="space-y-4" id="categories"> {/* Added ID */}
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
      <section className="space-y-4" id="trending-now">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Trending Now</h2>
          <Link href="/tracks" className="text-sm text-[var(--accent)] hover:underline">See All</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {trending.map((t) => (
            <TrackCard key={t.id} track={t} />
          ))}
        </div>
      </section>

      {/* Latest of All Time */}
      <section className="space-y-4" id="latest-of-all-time">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Latest of All Time</h2>
          <Link href="/tracks" className="text-sm text-[var(--accent)] hover:underline">See All</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {latestOfAllTime.map((t) => (
            <TrackCard key={t.id} track={t} />
          ))}
        </div>
      </section>

      {/* Library Section */}
      <section className="space-y-4" id="library"> {/* New Library Section */}
        <h2 className="text-2xl font-bold">Your Library</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-32 bg-black rounded-lg shadow-md flex items-center justify-center text-white text-lg font-bold">
              Card {i + 1}
            </div>
          ))}
        </div>
      </section>

      
    </div>)
  );
}
