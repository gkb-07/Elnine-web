// components/player/AudioPlayer.tsx
"use client";

import { useState, useRef, useEffect } from "react";

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
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

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("loadedmetadata", setAudioDuration);
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const formatTime = (time: number) => {
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

  return (
    <div className="fixed bottom-0 left-0 right-0 surface shadow-lg border-t z-50">
      <div className="container px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <p className="text-sm font-medium">Preview Audio - The Library</p>
          <div className="text-xs muted">{formatTime(currentTime)} / {formatTime(duration)}</div>
        </div>
        <div className="flex items-center space-x-4 w-1/3">
          <input
            type="range"
            value={progress}
            onChange={handleSeek}
            className="w-full accent-[var(--accent)]"
          />
        </div>
        <button onClick={togglePlay} className="p-2 rounded-full btn-accent">
          {isPlaying ? "Pause" : "Play"}
        </button>
        <audio ref={audioRef} src="/sample.mp3" preload="auto" />
      </div>
    </div>
  );
}
