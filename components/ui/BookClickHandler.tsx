'use client';

import Link from 'next/link';

interface BookClickHandlerProps {
  book: {
    id: number | string; // Support both number and UUID string
    title: string;
    author: string;
    type: string;
  };
  children: React.ReactNode;
}

export default function BookClickHandler({ book, children }: BookClickHandlerProps) {
  // 🚀 OPTIMIZED: Use Link component for instant prefetching and navigation
  return (
    <Link href={`/book/${book.id}`} className="block" prefetch={true}>
      {children}
    </Link>
  );
}

