// components/player/AudioPlayer.tsx
"use client";

import { useState, useRef } from "react";

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 surface shadow-lg border-t">
      <div className="container px-4 py-3 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">Preview Audio - The Library</p>
        </div>

        <div className="flex items-center space-x-4">
          <button onClick={togglePlay} className="p-2 rounded-full btn-accent">
            {isPlaying ? "Pause" : "Play"}
          </button>
          <audio ref={audioRef} src="/sample.mp3" preload="auto" />
        </div>
      </div>
    </div>
  );
}
