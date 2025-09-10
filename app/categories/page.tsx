import CategoryCard, { type Category } from "@/components/categories/CategoryCard";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function CategoriesPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("categories")
    .select("id,slug,title,cover_url")
    .order("title", { ascending: true });
  const categories = (data as Category[]) ?? [];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Categories</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
        {categories.map((cat) => (
          <CategoryCard key={cat.id} category={cat} />
        ))}
      </div>
    </div>
  );
}


