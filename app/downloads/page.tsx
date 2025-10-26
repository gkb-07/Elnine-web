import ComingSoonPage from "@/components/ComingSoonPage";

export default function DownloadsPage() {
  return (
    <ComingSoonPage 
      title="Downloads"
      description="This feature is coming soon. Download your favorite audiobooks for offline listening."
      icon={
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
      }
    />
  );
}
