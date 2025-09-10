import Link from "next/link";

export type Category = {
  id: number | string;
  slug: string;
  title: string;
  cover_url?: string | null;
};

export default function CategoryCard({ category }: { category: Category }) {
  return (
    <Link href={`/categories/${category.slug}`} className="block group">
      <div className="card-large relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden">
          {category.cover_url ? (
            <img 
              src={category.cover_url} 
              alt={category.title} 
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" 
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-[var(--accent)] to-[var(--secondary)]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-end p-6">
          <div className="transform transition-transform duration-300 group-hover:translate-y-[-8px]">
            <h3 className="text-white text-3xl font-bold mb-2">{category.title}</h3>
            <p className="text-gray-200 text-sm opacity-80 mb-4">
              Explore the best of {category.title.toLowerCase()} music
            </p>
            
            {/* Play Button */}
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-full bg-[var(--accent)] flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
              
              <svg className="w-6 h-6 text-white group-hover:translate-x-2 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Hover Effect */}
        <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-[var(--accent)] transition-colors pointer-events-none" />
      </div>
    </Link>
  );
}