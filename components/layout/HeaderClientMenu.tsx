"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useSupabase } from "@/components/providers/SupabaseProvider";

const initialFrom = (s?: string | null) => (s?.[0] ?? "U").toUpperCase();

export default function HeaderClientMenu({ initialEmail }: { initialEmail: string | null }) {
  const supabase = useSupabase();
  const [email, setEmail] = useState(initialEmail);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  // Sync email state with Supabase session updates
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user?.email ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, [supabase]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setOpen(false);
    setEmail(null);
  };

  // If no user is logged in, show Login / Sign Up
  if (!email) {
    return (
      <div className="flex items-center gap-3">
        <Link
          href="/signin"
          className="btn-secondary text-sm px-4 py-2"
        >
          Log In
        </Link>
        <Link
          href="/signup"
          className="btn-primary text-sm px-4 py-2"
        >
          Sign Up
        </Link>
      </div>
    );
  }

  // If logged in, show avatar with dropdown
  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-12 h-12 rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--secondary)] text-white flex items-center justify-center font-bold shadow-lg hover:scale-110 transition-transform"
        title={email}
      >
        {initialFrom(email)}
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-56 rounded-2xl border border-[var(--border)] surface-elevated shadow-2xl overflow-hidden">
          <div className="px-4 py-3 border-b border-[var(--border)]">
            <p className="text-sm font-medium text-[var(--text)] truncate">{email}</p>
            <p className="text-xs text-[var(--muted)]">Premium Member</p>
          </div>
          
          <div className="py-2">
            <Link
              href="/profile"
              className="flex items-center px-4 py-3 text-sm text-[var(--text)] hover:bg-[var(--surface)] transition-colors"
              onClick={() => setOpen(false)}
            >
              <svg className="w-4 h-4 mr-3 text-[var(--muted)]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
              Profile
            </Link>
            <Link
              href="/library"
              className="flex items-center px-4 py-3 text-sm text-[var(--text)] hover:bg-[var(--surface)] transition-colors"
              onClick={() => setOpen(false)}
            >
              <svg className="w-4 h-4 mr-3 text-[var(--muted)]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              Your Library
            </Link>
            
            <Link
              href="/library/liked"
              className="flex items-center px-4 py-3 text-sm text-[var(--text)] hover:bg-[var(--surface)] transition-colors"
              onClick={() => setOpen(false)}
            >
              <svg className="w-4 h-4 mr-3 text-[var(--muted)]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              Liked Songs
            </Link>
            
            <Link
              href="/library/playlists"
              className="flex items-center px-4 py-3 text-sm text-[var(--text)] hover:bg-[var(--surface)] transition-colors"
              onClick={() => setOpen(false)}
            >
              <svg className="w-4 h-4 mr-3 text-[var(--muted)]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M15 6H3v2h12V6zm0 4H3v2h12v-2zM3 16h8v-2H3v2zM17 6v8.18c-.31-.11-.65-.18-1-.18-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3V8h3V6h-5z"/>
              </svg>
              Playlists
            </Link>
          </div>
          
          <div className="border-t border-[var(--border)] py-2">
            <button
              onClick={signOut}
              className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <svg className="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.59L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}