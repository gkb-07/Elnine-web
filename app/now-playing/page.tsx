"use client";

import { useRouter } from "next/navigation";
import { useAudioPlayer } from "@/contexts/AudioPlayerContext";
import { useEffect, useState } from "react";

// Sample lyrics with timestamps (in seconds)
const sampleLyrics = [
  { time: 0, text: "Welcome to this audio chapter" },
  { time: 5, text: "Listen as the story unfolds" },
  { time: 10, text: "Each word brings a new adventure" },
  { time: 15, text: "Through lands both new and old" },
  { time: 20, text: "The narrator's voice guides you" },
  { time: 25, text: "Through every twist and turn" },
  { time: 30, text: "Imagination comes alive here" },
  { time: 35, text: "With every lesson learned" },
  { time: 40, text: "Characters begin to flourish" },
  { time: 45, text: "In this world of sound" },
  { time: 50, text: "Where stories know no boundaries" },
  { time: 55, text: "And magic can be found" },
  { time: 60, text: "Keep listening to discover more" },
  { time: 65, text: "What wonders lie ahead" },
  { time: 70, text: "In every chapter waiting" },
  { time: 75, text: "Every word that's read" },
];

export default function NowPlayingPage() {
  const router = useRouter();
  const { currentTrack, currentTime, setCurrentTime } = useAudioPlayer();
  const [activeLyricIndex, setActiveLyricIndex] = useState(-1);

  // Update active lyric based on current time from global audio player
  useEffect(() => {
    const currentIndex = sampleLyrics.findIndex((lyric, index) => {
      const nextLyric = sampleLyrics[index + 1];
      return currentTime >= lyric.time && (!nextLyric || currentTime < nextLyric.time);
    });
    
    if (currentIndex !== activeLyricIndex) {
      setActiveLyricIndex(currentIndex);
      
      // Auto-scroll to active lyric
      const activeLyricElement = document.getElementById(`lyric-${currentIndex}`);
      if (activeLyricElement) {
        activeLyricElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    }
  }, [currentTime, activeLyricIndex]);

  const handleLyricClick = (time: number) => {
    setCurrentTime(time);
  };

  if (!currentTrack) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-900 to-black flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-3xl font-bold mb-4">No track playing</h1>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-white text-purple-900 rounded-full font-semibold hover:bg-gray-100 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-purple-800 to-black text-white pb-32">
      {/* Header */}
      <div className="px-8 py-6 flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <h2 className="text-sm font-semibold uppercase tracking-wider">Now Playing</h2>
        <div className="w-20"></div>
      </div>

      <div className="max-w-4xl mx-auto px-8">
        {/* Book Cover */}
        <div className="flex justify-center mb-12">
          <div className="w-96 h-96 bg-purple-700 rounded-lg shadow-2xl overflow-hidden">
            {currentTrack.coverUrl ? (
              <img src={currentTrack.coverUrl} alt={currentTrack.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <svg className="w-32 h-32 text-white/30" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* Track Info */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2">{currentTrack.title}</h1>
          <p className="text-xl text-white/80">{currentTrack.artist}</p>
        </div>

        {/* Lyrics Section */}
        <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-8">
          <h3 className="text-2xl font-bold mb-6">Lyrics</h3>
          <div className="max-h-[500px] overflow-y-auto scrollbar-hide space-y-4">
            {sampleLyrics.map((lyric, index) => (
              <button
                key={index}
                id={`lyric-${index}`}
                onClick={() => handleLyricClick(lyric.time)}
                className={`block w-full text-left px-4 py-3 rounded-lg transition-all duration-300 ${
                  index === activeLyricIndex
                    ? 'text-white text-2xl font-bold bg-white/10'
                    : 'text-white/40 text-xl hover:text-white/60 hover:bg-white/5'
                }`}
              >
                {lyric.text}
              </button>
            ))}
          </div>
          <p className="text-white/40 text-sm mt-6 text-center italic">
            Sample lyrics for demonstration purposes
          </p>
        </div>
      </div>
    </div>
  );
}

