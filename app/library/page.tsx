// app/library/page.tsx
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function LibraryPage() {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await (await supabase).auth.getUser();
  if (!user) redirect("/signin");
  return <div className="text-lg">Welcome to your Library, {user.email}.</div>;
}
