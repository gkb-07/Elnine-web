'use client';

import { useRouter } from 'next/navigation';

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
  const router = useRouter();

  const handleClick = () => {
    // Navigate to the book detail page with chapters
    router.push(`/book/${book.id}`);
  };

  return (
    <div onClick={handleClick} className="cursor-pointer">
      {children}
    </div>
  );
}

