"use client";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export default function SignUpPage() {
  const supabase = createSupabaseBrowserClient();
  const [error, setError] = useState<string|null>(null);
  const [msg, setMsg] = useState<string|null>(null);
  const [loading, setLoading] = useState(false);

  const withGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${location.origin}/auth/callback` },
    });
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null); setMsg(null); setLoading(true);
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") || "");
    const password = String(fd.get("password") || "");
    const { data, error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) return setError(error.message);
    if (data.session) {
      // email confirmation OFF -> auto logged in
      window.location.href = "/library";
    } else {
      setMsg("Check your email to confirm your account, then log in.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-8 space-y-6 surface border border-[var(--accent)]/20 rounded-2xl shadow-2xl shadow-[var(--accent)]/10 backdrop-blur-sm">
      <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-[var(--accent)] to-purple-400 bg-clip-text text-transparent">Join elnine</h1>

      <button onClick={withGoogle} className="w-full border border-[var(--accent)]/30 px-4 py-3 rounded-lg btn-accent shadow-lg shadow-[var(--accent)]/20 hover:shadow-xl hover:shadow-[var(--accent)]/30 transition-all duration-300">Continue with Google</button>

      <div className="relative my-2 text-center">
        <span className="px-2 text-xs muted bg-[var(--surface)] relative z-10">or</span>
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 border-t" />
      </div>

      <form onSubmit={onSubmit} className="space-y-3">
        <input name="email" type="email" required placeholder="Email" className="w-full border border-[var(--accent)]/30 rounded-lg p-3 bg-[var(--bg)]/50 focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/50 focus:outline-none transition-all duration-300 shadow-sm hover:shadow-md" />
        <input name="password" type="password" required placeholder="Password (min 6 chars)" className="w-full border border-[var(--accent)]/30 rounded-lg p-3 bg-[var(--bg)]/50 focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/50 focus:outline-none transition-all duration-300 shadow-sm hover:shadow-md" />
        {error && <p className="text-sm text-red-600">{error}</p>}
        {msg && <p className="text-sm text-green-600">{msg}</p>}
        <button disabled={loading} className="btn-accent w-full disabled:opacity-60 py-3 rounded-lg shadow-lg shadow-[var(--accent)]/30 hover:shadow-xl hover:shadow-[var(--accent)]/50 transition-all duration-300">
          {loading ? "Creating..." : "Sign up"}
        </button>
      </form>

      <div className="pt-4 border-t border-[var(--accent)]/20">
        <Link 
          href="/signin" 
          className="group relative overflow-hidden block rounded-xl bg-gradient-to-r from-[var(--accent)] to-purple-500 px-4 py-3 text-center text-sm font-medium text-white shadow-lg shadow-[var(--accent)]/30 transition-all duration-300 hover:shadow-xl hover:shadow-[var(--accent)]/50 hover:scale-105"
        >
          <span className="relative z-10">Already have an account? Sign In</span>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-purple-500 to-[var(--accent)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
        </Link>
      </div>
    </div>
  );
}
