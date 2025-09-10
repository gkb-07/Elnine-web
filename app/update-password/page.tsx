"use client";
import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export default function UpdatePasswordPage() {
  const supabase = createSupabaseBrowserClient();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string|null>(null);

  // When user opens the email link, Supabase recovers the session client-side.
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setReady(true);
    });
    // In most cases the session is already set; allow form anyway
    setReady(true);
    return () => sub.subscription.unsubscribe();
  }, [supabase]);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const password = String(new FormData(e.currentTarget).get("password") || "");
    const { error } = await supabase.auth.updateUser({ password });
    if (error) return setError(error.message);
    router.replace("/signin");
  };

  if (!ready) return <p className="p-6">Loading…</p>;

  return (
    <div className="max-w-md mx-auto p-6 space-y-3 surface shadow-soft border rounded-2xl">
      <h1 className="text-2xl font-bold">Set new password</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input name="password" type="password" required placeholder="New password" className="w-full border rounded-md p-2 bg-transparent" />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button className="btn-accent w-full">Update password</button>
      </form>
    </div>
  );
}
