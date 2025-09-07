// app/page.tsx
import TrackList from "../components/track/TrackList";

const mockTracks = [
  { id: 1, title: "The Muse", artist: "William", plays: 4320 },
  { id: 2, title: "Daddy Noble", artist: "Noble", plays: 2615 },
  { id: 3, title: "Hangover Horn", artist: "Mairsyy", plays: 1754 },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="mb-8">
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-10 rounded-lg text-center">
          <h1 className="text-4xl font-bold">Welcome to Elnine</h1>
          <p className="mt-2 text-lg">Discover and listen to premium audio stories</p>
        </div>
      </section>

      {/* Trending Now */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Trending Now</h2>
        <TrackList tracks={mockTracks} />
      </section>
    </div>
  );
}
