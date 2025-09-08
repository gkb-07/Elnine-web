// app/layout.tsx
import "styles/globals.css";
import Header from "@/components/layout/Header";
import SupabaseProvider from "@/components/providers/SupabaseProvider";
import AudioPlayer from "@/components/player/AudioPlayer";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <SupabaseProvider>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="container mx-auto flex-1 px-4 py-6">{children}</main>
            <AudioPlayer />
          </div>
        </SupabaseProvider>
      </body>
    </html>
  );
}
