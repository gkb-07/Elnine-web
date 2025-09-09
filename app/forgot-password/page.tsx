"use client";
import { useState, FormEvent } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export default function ForgotPasswordPage() {
  const supabase = createSupabaseBrowserClient();
  const [msg, setMsg] = useState<string|null>(null);
  const [error, setError] = useState<string|null>(null);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null); setMsg(null);
    const email = String(new FormData(e.currentTarget).get("email") || "");
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${location.origin}/update-password`,
    });
    if (error) setError(error.message); else setMsg("Check your email for the reset link.");
  };

  return (
    <div className="max-w-md mx-auto p-6 space-y-3 surface shadow-soft border rounded-2xl">
      <h1 className="text-2xl font-bold">Reset password</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input name="email" type="email" required placeholder="Email" className="w-full border rounded-md p-2 bg-transparent" />
        {error && <p className="text-sm text-red-600">{error}</p>}
        {msg && <p className="text-sm text-green-600">{msg}</p>}
        <button className="btn-accent w-full">Send reset link</button>
      </form>
    </div>
  );
}
