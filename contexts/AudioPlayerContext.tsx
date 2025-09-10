'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Track {
  id: number;
  title: string;
  artist: string | null;
  cover_url: string | null;
  preview_url: string | null;
}

interface AudioPlayerContextType {
  currentTrack: Track | null;
  playTrack: (track: Track) => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined);

export const AudioPlayerProvider = ({ children }: { children: ReactNode }) => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);

  const playTrack = (track: Track) => {
    setCurrentTrack(track);
  };

  return (
    <AudioPlayerContext.Provider value={{ currentTrack, playTrack }}>
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
