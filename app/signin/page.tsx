"use client";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export default function SignInPage() {
  const supabase = createSupabaseBrowserClient();
  const [error, setError] = useState<string|null>(null);
  const [loading, setLoading] = useState(false);

  const withGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${location.origin}/auth/callback` },
    });
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null); setLoading(true);
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") || "");
    const password = String(fd.get("password") || "");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return setError(error.message);
    window.location.href = "/library";
  };

  return (
    <div className="max-w-md mx-auto p-6 space-y-4 surface shadow-soft border rounded-2xl">
      <h1 className="text-2xl font-bold">Log in</h1>

      <button onClick={withGoogle} className="w-full border px-4 py-2 rounded-md btn-accent">Continue with Google</button>

      <div className="relative my-2 text-center">
        <span className="px-2 text-xs muted bg-[var(--surface)] relative z-10">or</span>
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 border-t" />
      </div>

      <form onSubmit={onSubmit} className="space-y-3">
        <input name="email" type="email" required placeholder="Email" className="w-full border rounded-md p-2 bg-transparent" />
        <input name="password" type="password" required placeholder="Password" className="w-full border rounded-md p-2 bg-transparent" />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button disabled={loading} className="btn-accent w-full disabled:opacity-60">
          {loading ? "Signing in..." : "Log in"}
        </button>
      </form>

      <p className="text-sm muted">
        Forgot your password? <Link href="/forgot-password" className="text-[var(--accent)] underline">Reset</Link>
      </p>

      <p className="text-sm muted">
        Don’t have an account? <Link href="/signup" className="text-[var(--accent)] underline">Sign up</Link>
      </p>
    </div>
  );
}
