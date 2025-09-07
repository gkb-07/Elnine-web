// components/track/TrackCard.tsx
import Link from "next/link";

interface TrackCardProps {
  track: {
    id: number;
    title: string;
    artist: string;
    plays: number;
  };
}

export default function TrackCard({ track }: TrackCardProps) {
  return (
    <div className="border rounded-lg p-4 shadow hover:shadow-lg transition">
      <Link href={`/track/${track.id}`}>
        <h3 className="font-semibold">{track.title}</h3>
        <p className="text-sm text-gray-500">{track.artist}</p>
        <p className="text-xs text-gray-400">{track.plays} plays</p>
      </Link>
    </div>
  );
}
