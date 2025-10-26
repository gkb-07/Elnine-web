import ComingSoonPage from "@/components/ComingSoonPage";

export default function HistoryPage() {
  return (
    <ComingSoonPage 
      title="Listening History"
      description="This feature is coming soon. View your complete listening history and resume where you left off."
      icon={
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      }
    />
  );
}
