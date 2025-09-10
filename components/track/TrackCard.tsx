'use client';

import { useAudioPlayer } from "@/contexts/AudioPlayerContext";
import { useState } from "react";

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
  const { playTrack, currentTrack } = useAudioPlayer();
  const [isHovered, setIsHovered] = useState(false);
  const isCurrentTrack = currentTrack?.id === track.id;

  const handlePlay = (e: React.MouseEvent) => {
    e.preventDefault();
    if (track.preview_url) {
      playTrack({
        ...track,
        cover_url: track.cover_url ?? null,
        preview_url: track.preview_url ?? null,
      });
    } else {
      console.log("No preview available for this track.");
    }
  };

  const formatPlays = (plays: number) => {
    if (plays >= 1000000) {
      return `${(plays / 1000000).toFixed(1)}M`;
    } else if (plays >= 1000) {
      return `${(plays / 1000).toFixed(1)}K`;
    }
    return plays.toString();
  };

  return (
    <div 
      className={`card group cursor-pointer relative overflow-hidden ${isCurrentTrack ? 'ring-2 ring-[var(--accent)] pulse-glow' : ''}`}
      onClick={handlePlay}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Cover Image */}
      <div className="relative h-48 rounded-xl overflow-hidden mb-4">
        {track.cover_url ? (
          <img 
            src={track.cover_url} 
            alt={track.title} 
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" 
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-[var(--accent)] to-[var(--secondary)] flex items-center justify-center">
            <svg className="w-16 h-16 text-white opacity-50" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
            </svg>
          </div>
        )}
        
        {/* Overlay with play button */}
        <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 ${isHovered || isCurrentTrack ? 'opacity-100' : 'opacity-0'}`}>
          <div className="w-16 h-16 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
            {isCurrentTrack ? (
              <svg className="w-8 h-8 text-[var(--accent)]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
              </svg>
            ) : (
              <svg className="w-8 h-8 text-[var(--accent)] ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            )}
          </div>
        </div>

        {/* Now Playing Indicator */}
        {isCurrentTrack && (
          <div className="absolute top-3 right-3">
            <div className="flex space-x-1">
              <div className="w-1 h-4 bg-[var(--accent)] rounded-full animate-pulse"></div>
              <div className="w-1 h-4 bg-[var(--accent)] rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
              <div className="w-1 h-4 bg-[var(--accent)] rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
            </div>
          </div>
        )}
      </div>

      {/* Track Info */}
      <div className="space-y-2">
        <h3 className="font-bold text-lg truncate text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
          {track.title}
        </h3>
        <p className="text-[var(--muted)] truncate text-sm">
          {track.artist ?? "Unknown Artist"}
        </p>
        
        {/* Stats */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4 text-[var(--muted)]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
            </svg>
            <span className="text-xs text-[var(--muted)]">{formatPlays(track.plays)} plays</span>
          </div>
          
          {/* Like Button */}
          <button 
            className="w-8 h-8 rounded-full hover:bg-[var(--surface)] flex items-center justify-center transition-colors group/like"
            onClick={(e) => {
              e.stopPropagation();
              // Add like functionality here
            }}
          >
            <svg className="w-4 h-4 text-[var(--muted)] group-hover/like:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Hover Effect Border */}
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-[var(--accent)] transition-colors pointer-events-none" />
    </div>
  );
}