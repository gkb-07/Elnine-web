// components/track/TrackList.tsx
import TrackCard from "./TrackCard";

interface Track {
  id: number;
  title: string;
  artist: string;
  plays: number;
}

export default function TrackList({ tracks }: { tracks: Track[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {tracks.map((track) => (
        <TrackCard key={track.id} track={track} />
      ))}
    </div>
  );
}
