import Link from "next/link";

export type Category = {
  id: number | string;
  slug: string;
  title: string;
  cover_url?: string | null;
};

export default function CategoryCard({ category }: { category: Category }) {
  return (
    <Link href={`/categories/${category.slug}`} className="block rounded-xl border surface p-4 shadow-soft hover:shadow">
      <div className="h-28 w-full rounded-lg bg-gray-100 overflow-hidden mb-3">
        {category.cover_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={category.cover_url} alt={category.title} className="h-full w-full object-cover" />
        ) : null}
      </div>
      <div className="font-semibold">{category.title}</div>
    </Link>
  );
}


