'use client';

import { useAudioPlayer } from '@/contexts/AudioPlayerContext';
import { useEffect, useRef, useState } from 'react';

export default function AudioPlayer() {
  const { currentTrack } = useAudioPlayer();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', () => setIsPlaying(false));

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', () => setIsPlaying(false));
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
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-8 py-4 z-50">
      <div className="max-w-7xl mx-auto flex items-center gap-6">
        
        {/* Track Info */}
        <div className="flex items-center gap-4 min-w-0 flex-1">
          <div className="w-16 h-16 bg-red-600 rounded-lg flex-shrink-0 overflow-hidden">
            {/* Book cover placeholder */}
            <div className="w-full h-full flex items-center justify-center text-white">
              <div className="w-8 h-8 bg-white/20 rounded-full"></div>
            </div>
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-gray-800 truncate">
              Moby Dick (audio preview)
            </h3>
          </div>
        </div>

        {/* Waveform and Time */}
        <div className="flex-1 max-w-md flex items-center gap-4">
          <span className="text-sm text-gray-500 w-12 text-right">
            {formatTime(currentTime)}
          </span>
          
          {/* Waveform Visualization */}
          <div className="flex-1 h-8 flex items-center gap-px">
            {[...Array(50)].map((_, i) => {
              const progress = duration > 0 ? currentTime / duration : 0;
              const isActive = i / 50 <= progress;
              const height = Math.random() * 20 + 4; // Random heights for waveform
              
              return (
                <div
                  key={i}
                  className={`w-1 transition-colors ${
                    isActive ? 'bg-gray-800' : 'bg-gray-300'
                  }`}
                  style={{ height: `${height}px` }}
                />
              );
            })}
          </div>
          
          <span className="text-sm text-gray-500 w-12">
            {formatTime(duration)}
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          {/* Previous */}
          <button className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-800">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
            </svg>
          </button>

          {/* Play/Pause */}
          <button
            onClick={togglePlay}
            className="w-12 h-12 bg-purple-400 hover:bg-purple-500 rounded-full flex items-center justify-center text-white transition-colors"
          >
            {isPlaying ? (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
              </svg>
            ) : (
              <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            )}
          </button>

          {/* Next */}
          <button className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-800">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
            </svg>
          </button>

          {/* Additional Controls */}
          <button className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-800">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </button>

          <button className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-800">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={currentTrack.preview_url || ''}
        preload="metadata"
      />
    </div>
  );
}