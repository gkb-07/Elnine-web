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
    <div className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Log in</h1>

      <button onClick={withGoogle} className="w-full border px-4 py-2 rounded">Continue with Google</button>

      <div className="relative my-2 text-center">
        <span className="px-2 text-xs text-gray-500 bg-white relative z-10">or</span>
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 border-t" />
      </div>

      <form onSubmit={onSubmit} className="space-y-3">
        <input name="email" type="email" required placeholder="Email" className="w-full border rounded p-2" />
        <input name="password" type="password" required placeholder="Password" className="w-full border rounded p-2" />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button disabled={loading} className="bg-pink-600 text-white px-4 py-2 rounded w-full disabled:opacity-60">
          {loading ? "Signing in..." : "Log in"}
        </button>
      </form>

      <p className="text-sm text-gray-600">
        Forgot your password? <Link href="/forgot-password" className="text-pink-600 underline">Reset</Link>
      </p>

      <p className="text-sm text-gray-600">
        Don’t have an account? <Link href="/signup" className="text-pink-600 underline">Sign up</Link>
      </p>
    </div>
  );
}
