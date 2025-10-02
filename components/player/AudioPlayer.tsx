'use client';

import { useAudioPlayer } from '@/contexts/AudioPlayerContext';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AudioPlayer() {
  const router = useRouter();
  const { 
    currentTrack, 
    isPlaying, 
    setIsPlaying, 
    currentTime, 
    setCurrentTime, 
    duration, 
    setDuration,
    togglePlayPause,
    playNext,
    playPrevious
  } = useAudioPlayer();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [volume, setVolume] = useState(0.7);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'off' | 'all' | 'one'>('off');

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      if (repeatMode === 'one') {
        // Repeat current track
        audio.currentTime = 0;
        audio.play();
      } else if (repeatMode === 'all') {
        // Play next chapter and loop back
        playNext();
      } else {
        // Normal mode - just play next
        setIsPlaying(false);
        playNext();
      }
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [setCurrentTime, setDuration, setIsPlaying, playNext, repeatMode]);

  useEffect(() => {
    const audioUrl = currentTrack?.audioUrl || currentTrack?.preview_url;
    if (audioRef.current && audioUrl) {
      audioRef.current.src = audioUrl;
      if (isPlaying) {
        audioRef.current.play();
      }
    }
  }, [currentTrack, isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  // Handle seek from external sources (like now-playing page)
  useEffect(() => {
    if (audioRef.current && Math.abs(audioRef.current.currentTime - currentTime) > 1) {
      audioRef.current.currentTime = currentTime;
    }
  }, [currentTime]);

  // Handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return;
    
    const bounds = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - bounds.left) / bounds.width;
    const newTime = percent * duration;
    
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e: React.MouseEvent<HTMLDivElement>) => {
    const bounds = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - bounds.left) / bounds.width;
    setVolume(Math.max(0, Math.min(1, percent)));
  };

  const toggleShuffle = () => {
    setIsShuffle(!isShuffle);
  };

  const toggleRepeat = () => {
    if (repeatMode === 'off') {
      setRepeatMode('all');
    } else if (repeatMode === 'all') {
      setRepeatMode('one');
    } else {
      setRepeatMode('off');
    }
  };

  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 px-4 py-3 z-50">
      <div className="max-w-screen-2xl mx-auto flex items-center justify-between gap-4">
        
        {/* Left: Track Info - Clickable */}
        <div 
          onClick={() => router.push('/now-playing')}
          className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer hover:bg-white/5 rounded-lg p-2 -ml-2 transition-colors"
        >
          <div className="w-14 h-14 bg-gray-800 rounded-md flex-shrink-0 overflow-hidden">
            {currentTrack.coverUrl ? (
              <img src={currentTrack.coverUrl} alt={currentTrack.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                </svg>
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-white text-sm truncate">
              {currentTrack.title}
            </h3>
            <p className="text-xs text-gray-400 truncate">
              {currentTrack.artist}
            </p>
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              router.push('/now-playing');
            }}
            className="text-gray-400 hover:text-white transition-colors flex-shrink-0 text-xs px-3 py-1 border border-gray-600 rounded-full hover:border-white"
          >
            Read Chapter
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              router.push('/now-playing');
            }}
            className="text-gray-400 hover:text-white transition-colors flex-shrink-0"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>

        {/* Center: Controls and Progress */}
        <div className="flex flex-col items-center gap-2 flex-1 max-w-2xl">
          {/* Control Buttons */}
          <div className="flex items-center gap-4">
            {/* Shuffle */}
            <button 
              onClick={toggleShuffle}
              className={`transition-colors ${isShuffle ? 'text-purple-400' : 'text-gray-400 hover:text-white'}`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"/>
              </svg>
            </button>

            {/* Previous */}
            <button 
              onClick={playPrevious}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
              </svg>
            </button>

            {/* Play/Pause */}
            <button
              onClick={togglePlayPause}
              className="w-10 h-10 bg-white hover:scale-105 rounded-full flex items-center justify-center text-black transition-transform"
            >
              {isPlaying ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                </svg>
              ) : (
                <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              )}
            </button>

            {/* Next */}
            <button 
              onClick={playNext}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
              </svg>
            </button>

            {/* Repeat */}
            <button 
              onClick={toggleRepeat}
              className={`transition-colors relative ${repeatMode !== 'off' ? 'text-purple-400' : 'text-gray-400 hover:text-white'}`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/>
              </svg>
              {repeatMode === 'one' && (
                <span className="absolute -bottom-1 -right-1 text-[8px] font-bold">1</span>
              )}
            </button>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center gap-2 w-full">
            <span className="text-xs text-gray-400 w-10 text-right">
              {formatTime(currentTime)}
            </span>
            
            <div 
              onClick={handleProgressClick}
              className="flex-1 h-1 bg-gray-700 rounded-full overflow-hidden group cursor-pointer relative"
            >
              <div 
                className="h-full bg-white rounded-full transition-all group-hover:bg-purple-400 relative pointer-events-none"
                style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 shadow-lg"></div>
              </div>
            </div>
            
            <span className="text-xs text-gray-400 w-10">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Right: Volume and Additional Controls */}
        <div className="flex items-center gap-2 flex-1 justify-end">
          <button className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
            </svg>
          </button>
          
          <button 
            onClick={() => setVolume(volume > 0 ? 0 : 0.7)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            {volume === 0 ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
              </svg>
            ) : volume < 0.5 ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7 9v6h4l5 5V4l-5 5H7z"/>
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
              </svg>
            )}
          </button>
          
          <div 
            onClick={handleVolumeChange}
            className="w-24 h-1 bg-gray-700 rounded-full overflow-hidden cursor-pointer group"
          >
            <div 
              className="h-full bg-white rounded-full group-hover:bg-purple-400 transition-colors relative"
              style={{ width: `${volume * 100}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full opacity-0 group-hover:opacity-100"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={currentTrack.audioUrl || currentTrack.preview_url || ''}
        preload="metadata"
      />
    </div>
  );
}