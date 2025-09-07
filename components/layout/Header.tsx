// components/layout/Header.tsx
import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-pink-600">
          Elnine
        </Link>

        <nav className="space-x-6">
          <Link href="/categories">Categories</Link>
          <Link href="/creators">Creators</Link>
          <Link href="/library">Library</Link>
          <Link href="/about">About</Link>
        </nav>

        <div className="space-x-4">
          <Link href="/login" className="text-sm border px-3 py-1 rounded">
            Log In
          </Link>
          <Link href="/signup" className="text-sm bg-pink-600 text-white px-3 py-1 rounded">
            Sign Up
          </Link>
        </div>
      </div>
    </header>
  );
}
