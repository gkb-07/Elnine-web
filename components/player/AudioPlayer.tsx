// components/player/AudioPlayer.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { useAudioPlayer } from "@/contexts/AudioPlayerContext";

export default function AudioPlayer() {
  const { currentTrack } = useAudioPlayer();
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1); // New state for volume
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      setCurrentTime(audio.currentTime);
      setProgress((audio.currentTime / audio.duration) * 100);
    };

    const setAudioDuration = () => {
      setDuration(audio.duration);
    };

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("loadedmetadata", setAudioDuration);
    audio.addEventListener("ended", () => setIsPlaying(false));

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("loadedmetadata", setAudioDuration);
      audio.removeEventListener("ended", () => setIsPlaying(false));
    };
  }, []);

  useEffect(() => {
    if (audioRef.current && currentTrack?.preview_url) {
      audioRef.current.src = currentTrack.preview_url;
      audioRef.current.play();
      setIsPlaying(true);
    } else if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, [currentTrack]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSkipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime += 10; // Skip 10 seconds forward
    }
  };

  const handleSkipBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime -= 10; // Skip 10 seconds backward
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    const newTime = (parseFloat(e.target.value) / 100) * audioRef.current.duration;
    audioRef.current.currentTime = newTime;
    setProgress(parseFloat(e.target.value));
  };

  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 bg-opacity-90 shadow-lg border-t border-gray-700 z-50 text-white p-4">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-6">
        {/* Track Info */}
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          {currentTrack.cover_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={currentTrack.cover_url} alt={currentTrack.title} className="h-12 w-12 rounded-md object-cover hidden sm:block" />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{currentTrack.title}</p>
            <p className="text-xs text-gray-400 truncate">{currentTrack.artist ?? "Unknown Artist"}</p>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center space-x-4 md:w-1/3 justify-center">
          <button onClick={handleSkipBackward} className="p-2 rounded-full hover:bg-gray-700 transition-colors">
            {"<<"} {/* Placeholder for skip backward icon */}
          </button>
          <button onClick={togglePlay} className="p-3 rounded-full bg-[var(--accent)] text-[var(--accent-contrast)] hover:opacity-90 transition-opacity">
            {isPlaying ? "Pause" : "Play"} {/* Placeholder for play/pause icon */}
          </button>
          <button onClick={handleSkipForward} className="p-2 rounded-full hover:bg-gray-700 transition-colors">
            {">>"} {/* Placeholder for skip forward icon */}
          </button>
        </div>

        {/* Progress Bar and Time */}
        <div className="flex items-center space-x-3 flex-1 w-full md:w-auto">
          <div className="text-xs text-gray-400">{formatTime(currentTime)}</div>
          <input
            type="range"
            value={progress}
            onChange={handleSeek}
            className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[var(--accent)]"
          />
          <div className="text-xs text-gray-400">{formatTime(duration)}</div>
        </div>

        {/* Volume Control */}
        <div className="flex items-center space-x-2 hidden md:flex"> {/* Hidden on small screens */}
          <span>Vol</span> {/* Placeholder for volume icon */}
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="w-24 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[var(--accent)]"
          />
        </div>
      </div>
      <audio ref={audioRef} src={currentTrack.preview_url || ""} preload="auto" />
    </div>
  );
}
