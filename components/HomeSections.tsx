'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import BookSection from './BookSection';
import BookGrid from './BookGrid';

interface Book {
  id: string;
  title: string;
  author: string;
  cover_url?: string;
}

interface Props {
  allBooks: Book[];
  trendingBooks: Book[];
  fictionBooks: Book[];
  romanceBooks: Book[];
  mysteryBooks: Book[];
  biographyBooks: Book[];
  newlyReleasedBooks: Book[];
}

export default function HomeSections(props: Props) {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState<string>(searchParams.get('q') || '');

  // Listen for events from the SearchBar while typing
  useEffect(() => {
    const handler = (e: Event) => {
      const q = (e as CustomEvent<string>).detail || '';
      setQuery(q);
    };
    window.addEventListener('homeSearch', handler as EventListener);
    return () => window.removeEventListener('homeSearch', handler as EventListener);
  }, []);

  // Also react to URL changes (e.g., when typing updates ?q=)
  useEffect(() => {
    setQuery(searchParams.get('q') || '');
  }, [searchParams]);

  const normalize = (s: string) => s.toLowerCase();

  const filterList = (list: Book[]) => {
    const q = normalize(query.trim());
    if (!q) return list;
    return list.filter(b =>
      normalize(b.title).includes(q) || normalize(b.author || '').includes(q)
    );
  };

  const filtered = useMemo(() => ({
    trending: filterList(props.trendingBooks),
    fiction: filterList(props.fictionBooks),
    romance: filterList(props.romanceBooks),
    mystery: filterList(props.mysteryBooks),
    biography: filterList(props.biographyBooks),
    newly: filterList(props.newlyReleasedBooks),
    all: filterList(props.allBooks),
  }), [props, query]);

  const hasQuery = query.trim().length > 0;

  const pickList = (filteredList: Book[], originalList: Book[]) => {
    if (hasQuery) return filteredList; // during search, show only matching results
    // no search → show original section, empty if no books
    return originalList;
  };

  return (
    <>
      {/* Trending Now */}
      {pickList(filtered.trending, props.trendingBooks).length > 0 && (
        <BookSection title="Trending Now" books={pickList(filtered.trending, props.trendingBooks)} scrollId="trending-books" />
      )}

      {/* Top Picks for You */}
      {pickList(filtered.fiction, props.fictionBooks).length > 0 && (
        <BookGrid title="Top Picks for You" books={pickList(filtered.fiction, props.fictionBooks)} />
      )}

      {/* Top Picks in India */}
      {pickList(filtered.romance, props.romanceBooks).length > 0 && (
        <BookGrid title="Top Picks in India" books={pickList(filtered.romance, props.romanceBooks)} />
      )}

      {/* Something New */}
      {pickList(filtered.mystery, props.mysteryBooks).length > 0 && (
        <BookGrid title="Something New" books={pickList(filtered.mystery, props.mysteryBooks)} />
      )}

      {/* Featured Stories */}
      {pickList(filtered.biography, props.biographyBooks).length > 0 && (
        <BookGrid title="Featured Stories" books={pickList(filtered.biography, props.biographyBooks)} />
      )}

      {/* Newly Released */}
      {pickList(filtered.newly, props.newlyReleasedBooks).length > 0 && (
        <BookGrid title="Newly Released" books={pickList(filtered.newly, props.newlyReleasedBooks)} />
      )}
    </>
  );
}


