import ComingSoonPage from '@/components/ComingSoonPage';

export default function DownloadsPage() {
  return (
    <ComingSoonPage
      title="Downloads"
      description="Download your favorite audiobooks for offline listening. Take your stories anywhere, even without an internet connection."
      icon={
        <svg fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
        </svg>
      }
    />
  );
}
