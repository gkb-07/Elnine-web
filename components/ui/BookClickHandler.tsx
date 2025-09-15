'use client';

import { useAudioPlayer } from '@/contexts/AudioPlayerContext';

interface BookClickHandlerProps {
  book: {
    id: number;
    title: string;
    author: string;
    type: string;
  };
  children: React.ReactNode;
}

export default function BookClickHandler({ book, children }: BookClickHandlerProps) {
  const { playTrack } = useAudioPlayer();

  const handleClick = () => {
    // Create a sample track when book is clicked
    playTrack({
      id: book.id,
      title: `${book.title} (audio preview)`,
      artist: book.author,
      cover_url: null,
      preview_url: "/sample-1.mp3", // Use the existing sample audio
    });
  };

  return (
    <div onClick={handleClick} className="cursor-pointer">
      {children}
    </div>
  );
}

