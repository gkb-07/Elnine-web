// components/track/TrackCard.tsx
'use client';

import { useAudioPlayer } from "@/contexts/AudioPlayerContext";
import Link from "next/link";

interface TrackCardProps {
  track: {
    id: number;
    title: string;
    artist: string | null;
    plays: number;
    cover_url?: string | null;
    preview_url?: string | null;
  };
}

export default function TrackCard({ track }: TrackCardProps) {
  const { playTrack } = useAudioPlayer();

  const handlePlay = (e: React.MouseEvent) => {
    e.preventDefault();
    if (track.preview_url) {
      playTrack(track);
    } else {
      console.log("No preview available for this track.");
    }
  };

  return (
    <div onClick={handlePlay} className="card block cursor-pointer">
      <div className="h-32 w-full rounded-lg bg-gray-200 mb-3 overflow-hidden">
        {track.cover_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={track.cover_url} alt={track.title} className="h-full w-full object-cover" />
        ) : null}
      </div>
      <div className="font-semibold truncate">{track.title}</div>
      <div className="text-sm muted truncate">{track.artist ?? "Unknown"}</div>
      <div className="text-xs muted">{track.plays} plays</div>
    </div>
  );
}
