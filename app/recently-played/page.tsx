import ComingSoonPage from "@/components/ComingSoonPage";

export default function RecentlyPlayedPage() {
  return (
    <ComingSoonPage 
      title="Recently Played"
      description="This feature is coming soon. Track your listening history and pick up where you left off."
      icon={
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      }
    />
  );
}

