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
          className="text-sm border px-3 py-1.5 rounded-md hover:bg-gray-50"
        >
          Log In
        </Link>
        <Link
          href="/signup"
          className="text-sm bg-pink-600 text-white px-3 py-1.5 rounded-md hover:bg-pink-700"
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
        className="h-9 w-9 rounded-full bg-pink-600 text-white grid place-items-center font-semibold"
        title={email}
      >
        {initialFrom(email)}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 rounded-lg border bg-white shadow">
          <div className="px-3 py-2 text-xs text-gray-500 truncate">
            {email}
          </div>
          <Link
            href="/library"
            className="block px-3 py-2 text-sm hover:bg-gray-50"
            onClick={() => setOpen(false)}
          >
            Library
          </Link>
          <button
            onClick={signOut}
            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
          >
            Log out
          </button>
        </div>
      )}
    </div>
  );
}
