import CreatorCard, { type Creator } from "@/components/creators/CreatorCard";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function CreatorsPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("creators")
    .select("id,name,avatar_url,bio,plays")
    .order("plays", { ascending: false })
    .limit(12);
  const creators = (data as Creator[]) ?? [];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Featured Creators</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {creators.map((c) => (
          <CreatorCard key={c.id} creator={c} />
        ))}
      </div>
    </div>
  );
}


