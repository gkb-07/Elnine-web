import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/signin");
  }

  // Fetch additional user data if needed
  // For now, simple profile view

  return (
    <div className="container py-16">
      <h1 className="text-4xl font-bold gradient-text mb-8">Your Profile</h1>
      <div className="card p-8">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-24 h-24 rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--secondary)] flex items-center justify-center text-4xl font-bold text-white">
            {user.email?.[0].toUpperCase()}
          </div>
          <div>
            <h2 className="text-2xl font-bold">{user.email}</h2>
            <p className="text-[var(--muted)]">Premium Member</p>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Email</h3>
            <p>{user.email}</p>
          </div>
          {/* Add more profile fields here */}
        </div>
      </div>
    </div>
  );
}