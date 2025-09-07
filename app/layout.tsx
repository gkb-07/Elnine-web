import '../styles/globals.css';
import Header from '../components/layout/Header';
import AudioPlayer from '../components/player/AudioPlayer';

export const metadata = {
  title: 'Elnine - Listen to Premium Audio',
  description: 'Audio streaming platform for stories, podcasts, and more.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <div className="flex flex-col min-h-screen">
          <Header />
          
          <main className="flex-1 container mx-auto px-4 py-6">
            {children}
          </main>

          <AudioPlayer />
        </div>
      </body>
    </html>
  );
}
