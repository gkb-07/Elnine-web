// app/layout.tsx
import "styles/globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SupabaseProvider from "@/components/providers/SupabaseProvider";
import AudioPlayer from "@/components/player/AudioPlayer";
import ThemeProvider from "@/components/providers/ThemeProvider";
import { AudioPlayerProvider } from "@/contexts/AudioPlayerContext";
import ScrollAnimations from "@/components/ui/ScrollAnimations";
import ChapterNavigationHandler from "@/components/player/ChapterNavigationHandler";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SupabaseProvider>
          <ThemeProvider>
            <AudioPlayerProvider>
              <div className="flex min-h-screen flex-col">
                <Header />
                <main className="flex-1 pt-[72px] sm:pt-[88px]">{children}</main>
                <Footer />
                <AudioPlayer />
                <ChapterNavigationHandler />
                <ScrollAnimations />
              </div>
            </AudioPlayerProvider>
          </ThemeProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
}
