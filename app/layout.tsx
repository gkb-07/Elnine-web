// app/layout.tsx
import "styles/globals.css";
import Header from "@/components/layout/Header";
import SupabaseProvider from "@/components/providers/SupabaseProvider";
import AudioPlayer from "@/components/player/AudioPlayer";
import ThemeProvider from "@/components/providers/ThemeProvider";
import { AudioPlayerProvider } from "@/contexts/AudioPlayerContext";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SupabaseProvider>
          <ThemeProvider>
            <AudioPlayerProvider>
              <div className="flex min-h-screen flex-col">
                <Header />
                <main className="container flex-1 py-6">{children}</main>
                <AudioPlayer />
              </div>
            </AudioPlayerProvider>
          </ThemeProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
}
