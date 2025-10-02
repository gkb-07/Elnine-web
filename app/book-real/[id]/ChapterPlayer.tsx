'use client';

import { useAudioPlayer } from '@/contexts/AudioPlayerContext';

interface Chapter {
  id: string;
  title: string;
  chapter_number: number;
  audio_url: string;
  duration: number;
}

interface ChapterPlayerProps {
  book: any;
  chapters: Chapter[];
}

export default function ChapterPlayer({ book, chapters }: ChapterPlayerProps) {
  const { currentTrack, isPlaying, playTrack } = useAudioPlayer();

  const handleChapterClick = (chapter: Chapter, index: number) => {
    playTrack({
      id: `${book.id}-${chapter.id}`,
      title: chapter.title,
      artist: book.author,
      coverUrl: book.cover_url,
      audioUrl: chapter.audio_url,
      bookId: book.id,
      chapterIndex: index,
    });
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-3">
      {chapters.map((chapter, index) => {
        const isCurrentChapter = currentTrack?.id === `${book.id}-${chapter.id}`;

        return (
          <button
            key={chapter.id}
            onClick={() => handleChapterClick(chapter, index)}
            className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all hover:shadow-md ${
              isCurrentChapter
                ? 'bg-purple-100 border-2 border-purple-400 shadow-lg'
                : 'bg-gray-50 hover:bg-purple-50 border-2 border-transparent'
            }`}
          >
            {/* Chapter Number / Play Icon */}
            <div
              className={`flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg transition-colors ${
                isCurrentChapter
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {isCurrentChapter && isPlaying ? (
                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
              ) : (
                <span>{chapter.chapter_number}</span>
              )}
            </div>

            {/* Chapter Info */}
            <div className="flex-1 text-left">
              <h3 className="font-bold text-gray-800 text-lg mb-1">
                {chapter.title}
              </h3>
              <p className="text-sm text-gray-500">
                Duration: {formatDuration(chapter.duration)}
              </p>
            </div>

            {/* Play Status */}
            {isCurrentChapter && (
              <div className="flex-shrink-0">
                <div className="flex items-center gap-2 text-purple-600">
                  {isPlaying ? (
                    <>
                      <span className="text-sm font-semibold">Now Playing</span>
                      <div className="flex gap-1">
                        <div className="w-1 h-4 bg-purple-600 animate-pulse"></div>
                        <div className="w-1 h-4 bg-purple-600 animate-pulse delay-75"></div>
                        <div className="w-1 h-4 bg-purple-600 animate-pulse delay-150"></div>
                      </div>
                    </>
                  ) : (
                    <span className="text-sm font-semibold">Paused</span>
                  )}
                </div>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}


