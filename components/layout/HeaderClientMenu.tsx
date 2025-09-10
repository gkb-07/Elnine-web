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
          className="btn-secondary text-sm"
        >
          Log In
        </Link>
        <Link
          href="/signup"
          className="btn-primary text-sm"
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
        className="h-10 w-10 rounded-full bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white grid place-items-center font-bold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
        title={email}
      >
        {initialFrom(email)}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] shadow-xl backdrop-blur-sm">
          <div className="px-4 py-3 text-xs text-[var(--text-tertiary)] truncate border-b border-[var(--border-color)]">
            {email}
          </div>
          <Link
            href="/library"
            className="block px-4 py-3 text-sm hover:bg-[var(--bg-tertiary)] transition-colors"
            onClick={() => setOpen(false)}
          >
            📚 
            Library
          </Link>
          <button
            onClick={signOut}
            className="w-full text-left px-4 py-3 text-sm hover:bg-[var(--bg-tertiary)] transition-colors text-red-500"
          >
            🚪 
            Log out
          </button>
        </div>
      )}
    </div>
  );
}
