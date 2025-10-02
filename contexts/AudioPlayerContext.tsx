'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Track {
  id: number | string;
  title: string;
  artist: string | null;
  coverUrl?: string | null;
  cover_url?: string | null;
  audioUrl?: string | null;
  preview_url?: string | null;
  bookId?: string | number;
  chapterIndex?: number;
}

interface AudioPlayerContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playTrack: (track: Track) => void;
  togglePlayPause: () => void;
  setIsPlaying: (playing: boolean) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  playNext: () => void;
  playPrevious: () => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined);

export const AudioPlayerProvider = ({ children }: { children: ReactNode }) => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const playTrack = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    setCurrentTime(0);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const playNext = () => {
    // This will be handled by the component that has chapter context
    if (currentTrack?.chapterIndex !== undefined) {
      // Trigger next chapter event
      window.dispatchEvent(new CustomEvent('playNextChapter'));
    }
  };

  const playPrevious = () => {
    // This will be handled by the component that has chapter context
    if (currentTrack?.chapterIndex !== undefined) {
      // Trigger previous chapter event
      window.dispatchEvent(new CustomEvent('playPreviousChapter'));
    }
  };

  return (
    <AudioPlayerContext.Provider value={{ 
      currentTrack, 
      isPlaying,
      currentTime,
      duration,
      playTrack,
      togglePlayPause,
      setIsPlaying,
      setCurrentTime,
      setDuration,
      playNext,
      playPrevious
    }}>
      {children}
    </AudioPlayerContext.Provider>
  );
};

export const useAudioPlayer = () => {
  const context = useContext(AudioPlayerContext);
  if (context === undefined) {
    throw new Error('useAudioPlayer must be used within an AudioPlayerProvider');
  }
  return context;
};
