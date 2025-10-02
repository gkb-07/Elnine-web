"use client";

import { useEffect } from "react";
import { useAudioPlayer } from "@/contexts/AudioPlayerContext";

// Book data - same as in book detail page
const booksData: any = {
  "1": {
    id: 1,
    title: "Moby Dick",
    author: "Herman Melville",
    cover: "https://m.media-amazon.com/images/I/616R20nvohL._AC_UF1000,1000_QL80_.jpg",
    chapters: [
      { id: 1, title: "Chapter 1: Loomings", duration: "15:30", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
      { id: 2, title: "Chapter 2: The Carpet-Bag", duration: "12:45", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
      { id: 3, title: "Chapter 3: The Spouter-Inn", duration: "18:20", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
      { id: 4, title: "Chapter 4: The Counterpane", duration: "10:15", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" },
      { id: 5, title: "Chapter 5: Breakfast", duration: "8:30", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3" },
      { id: 6, title: "Chapter 6: The Street", duration: "14:25", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3" },
      { id: 7, title: "Chapter 7: The Chapel", duration: "11:50", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3" },
      { id: 8, title: "Chapter 8: The Pulpit", duration: "9:40", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3" },
    ]
  },
  "2": {
    id: 2,
    title: "Authority",
    author: "Jeff VanderMeer",
    cover: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1370073128i/17945018.jpg",
    chapters: [
      { id: 1, title: "Chapter 1: Orientation", duration: "16:20", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
      { id: 2, title: "Chapter 2: Control", duration: "14:35", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
      { id: 3, title: "Chapter 3: The Biologist", duration: "19:10", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
      { id: 4, title: "Chapter 4: The Director", duration: "13:45", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" },
      { id: 5, title: "Chapter 5: Investigations", duration: "17:30", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3" },
      { id: 6, title: "Chapter 6: Revelations", duration: "15:55", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3" },
    ]
  },
  "3": {
    id: 3,
    title: "Moby Dick",
    author: "Herman Melville",
    cover: "https://m.media-amazon.com/images/I/616R20nvohL._AC_UF1000,1000_QL80_.jpg",
    chapters: [
      { id: 1, title: "Chapter 1: Loomings", duration: "15:30", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
      { id: 2, title: "Chapter 2: The Carpet-Bag", duration: "12:45", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
      { id: 3, title: "Chapter 3: The Spouter-Inn", duration: "18:20", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
      { id: 4, title: "Chapter 4: The Counterpane", duration: "10:15", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" },
      { id: 5, title: "Chapter 5: Breakfast", duration: "8:30", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3" },
    ]
  },
  "4": {
    id: 4,
    title: "Authority",
    author: "Jeff VanderMeer",
    cover: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1370073128i/17945018.jpg",
    chapters: [
      { id: 1, title: "Chapter 1: Orientation", duration: "16:20", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
      { id: 2, title: "Chapter 2: Control", duration: "14:35", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
      { id: 3, title: "Chapter 3: The Biologist", duration: "19:10", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
    ]
  },
  "5": {
    id: 5,
    title: "Moby Dick",
    author: "Herman Melville",
    cover: "https://m.media-amazon.com/images/I/616R20nvohL._AC_UF1000,1000_QL80_.jpg",
    chapters: [
      { id: 1, title: "Chapter 1: Loomings", duration: "15:30", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
      { id: 2, title: "Chapter 2: The Carpet-Bag", duration: "12:45", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
    ]
  },
  "6": {
    id: 6,
    title: "Authority",
    author: "Jeff VanderMeer",
    cover: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1370073128i/17945018.jpg",
    chapters: [
      { id: 1, title: "Chapter 1: Orientation", duration: "16:20", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
      { id: 2, title: "Chapter 2: Control", duration: "14:35", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
    ]
  },
  "7": {
    id: 7,
    title: "Moby Dick",
    author: "Herman Melville",
    cover: "https://m.media-amazon.com/images/I/616R20nvohL._AC_UF1000,1000_QL80_.jpg",
    chapters: [
      { id: 1, title: "Chapter 1: Loomings", duration: "15:30", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
      { id: 2, title: "Chapter 2: The Carpet-Bag", duration: "12:45", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
    ]
  }
};

export default function ChapterNavigationHandler() {
  const { currentTrack, playTrack } = useAudioPlayer();

  useEffect(() => {
    const handleNextChapter = () => {
      if (currentTrack?.bookId && currentTrack?.chapterIndex !== undefined) {
        const trackBookId = String(currentTrack.bookId);
        const currentBook = booksData[trackBookId];
        
        if (currentBook) {
          const nextIndex = currentTrack.chapterIndex + 1;
          if (nextIndex < currentBook.chapters.length) {
            const nextChapter = currentBook.chapters[nextIndex];
            playTrack({
              id: `${currentBook.id}-${nextChapter.id}`,
              title: nextChapter.title,
              artist: currentBook.author,
              coverUrl: currentBook.cover,
              audioUrl: nextChapter.audioUrl,
              bookId: currentBook.id,
              chapterIndex: nextIndex,
            });
          }
        }
      }
    };

    const handlePreviousChapter = () => {
      if (currentTrack?.bookId && currentTrack?.chapterIndex !== undefined) {
        const trackBookId = String(currentTrack.bookId);
        const currentBook = booksData[trackBookId];
        
        if (currentBook) {
          const prevIndex = currentTrack.chapterIndex - 1;
          if (prevIndex >= 0) {
            const prevChapter = currentBook.chapters[prevIndex];
            playTrack({
              id: `${currentBook.id}-${prevChapter.id}`,
              title: prevChapter.title,
              artist: currentBook.author,
              coverUrl: currentBook.cover,
              audioUrl: prevChapter.audioUrl,
              bookId: currentBook.id,
              chapterIndex: prevIndex,
            });
          }
        }
      }
    };

    window.addEventListener('playNextChapter', handleNextChapter);
    window.addEventListener('playPreviousChapter', handlePreviousChapter);

    return () => {
      window.removeEventListener('playNextChapter', handleNextChapter);
      window.removeEventListener('playPreviousChapter', handlePreviousChapter);
    };
  }, [currentTrack, playTrack]);

  return null;
}


