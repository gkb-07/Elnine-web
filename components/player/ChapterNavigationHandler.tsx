"use client";

import { useEffect, useState } from "react";
import { useAudioPlayer } from "@/contexts/AudioPlayerContext";
import { supabase } from "@/lib/supabase";

// 🚀 OPTIMIZED: Fetch chapters from Supabase instead of hardcoded data
async function getBookChapters(bookId: string) {
  const { data: chapters, error } = await supabase
    .from('chapters')
    .select('id, title, chapter_number, audio_url')
    .eq('book_id', bookId)
    .order('chapter_number', { ascending: true });

  if (error) {
    console.error('Error fetching chapters:', error);
    return [];
  }

  return chapters || [];
}

async function getBookInfo(bookId: string) {
  const { data: book, error } = await supabase
    .from('books')
    .select('id, title, author, cover_url')
    .eq('id', bookId)
    .single();

  if (error) {
    console.error('Error fetching book:', error);
    return null;
  }

  return book;
}

export default function ChapterNavigationHandler() {
  const { currentTrack, playTrack } = useAudioPlayer();
  const [bookChapters, setBookChapters] = useState<any[]>([]);
  const [bookInfo, setBookInfo] = useState<any>(null);

  useEffect(() => {
    // Fetch chapters and book info when track changes
    if (currentTrack?.bookId) {
      Promise.all([
        getBookChapters(String(currentTrack.bookId)),
        getBookInfo(String(currentTrack.bookId))
      ]).then(([chapters, book]) => {
        setBookChapters(chapters);
        setBookInfo(book);
      });
    }
  }, [currentTrack?.bookId]);

  useEffect(() => {
    const handleNextChapter = () => {
      if (currentTrack?.bookId && currentTrack?.chapterIndex !== undefined && bookChapters.length > 0) {
        const nextIndex = currentTrack.chapterIndex + 1;
        if (nextIndex < bookChapters.length && bookInfo) {
          const nextChapter = bookChapters[nextIndex];
          playTrack({
            id: `${bookInfo.id}-${nextChapter.id}`,
            title: nextChapter.title,
            artist: bookInfo.author,
            coverUrl: bookInfo.cover_url,
            audioUrl: nextChapter.audio_url,
            bookId: bookInfo.id,
            chapterIndex: nextIndex,
          });
        }
      }
    };

    const handlePreviousChapter = () => {
      if (currentTrack?.bookId && currentTrack?.chapterIndex !== undefined && bookChapters.length > 0) {
        const prevIndex = currentTrack.chapterIndex - 1;
        if (prevIndex >= 0 && bookInfo) {
          const prevChapter = bookChapters[prevIndex];
          playTrack({
            id: `${bookInfo.id}-${prevChapter.id}`,
            title: prevChapter.title,
            artist: bookInfo.author,
            coverUrl: bookInfo.cover_url,
            audioUrl: prevChapter.audio_url,
            bookId: bookInfo.id,
            chapterIndex: prevIndex,
          });
        }
      }
    };

    window.addEventListener('playNextChapter', handleNextChapter);
    window.addEventListener('playPreviousChapter', handlePreviousChapter);

    return () => {
      window.removeEventListener('playNextChapter', handleNextChapter);
      window.removeEventListener('playPreviousChapter', handlePreviousChapter);
    };
  }, [currentTrack, playTrack, bookChapters, bookInfo]);

  return null;
}