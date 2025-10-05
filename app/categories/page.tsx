import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import CategoryCard, { type Category } from "@/components/categories/CategoryCard";

// 🚀 OPTIMIZED: Fetch categories from Supabase
async function getCategories() {
  const { data: categories, error } = await supabase
    .from('categories')
    .select('id, name, slug, icon, description')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }

  return categories || [];
}

export default async function CategoriesPage() {
  // Adult/Erotic Literature Categories
  const categories: Category[] = [
    { 
      id: 1, 
      slug: "romance", 
      title: "Romance", 
      cover_url: "https://images.pexels.com/photos/1563356/pexels-photo-1563356.jpeg?auto=compress&cs=tinysrgb&w=800" 
    },
    { 
      id: 2, 
      slug: "erotic-stories", 
      title: "Erotic Stories", 
      cover_url: "https://images.pexels.com/photos/1261180/pexels-photo-1261180.jpeg?auto=compress&cs=tinysrgb&w=800" 
    },
    { 
      id: 3, 
      slug: "bdsm", 
      title: "BDSM", 
      cover_url: "https://images.pexels.com/photos/2693212/pexels-photo-2693212.jpeg?auto=compress&cs=tinysrgb&w=800" 
    },
    { 
      id: 4, 
      slug: "fingering", 
      title: "Fingering", 
      cover_url: "https://images.pexels.com/photos/1738986/pexels-photo-1738986.jpeg?auto=compress&cs=tinysrgb&w=800" 
    },
    { 
      id: 5, 
      slug: "passionate", 
      title: "Passionate", 
      cover_url: "https://images.pexels.com/photos/1024960/pexels-photo-1024960.jpeg?auto=compress&cs=tinysrgb&w=800" 
    },
    { 
      id: 6, 
      slug: "intimate", 
      title: "Intimate", 
      cover_url: "https://images.pexels.com/photos/1144256/pexels-photo-1144256.jpeg?auto=compress&cs=tinysrgb&w=800" 
    },
    { 
      id: 7, 
      slug: "steamy", 
      title: "Steamy", 
      cover_url: "https://images.pexels.com/photos/1170986/pexels-photo-1170986.jpeg?auto=compress&cs=tinysrgb&w=800" 
    },
    { 
      id: 8, 
      slug: "sensual", 
      title: "Sensual", 
      cover_url: "https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=800" 
    },
    { 
      id: 9, 
      slug: "fantasy", 
      title: "Fantasy", 
      cover_url: "https://images.pexels.com/photos/1261180/pexels-photo-1261180.jpeg?auto=compress&cs=tinysrgb&w=800" 
    },
    { 
      id: 10, 
      slug: "taboo", 
      title: "Taboo", 
      cover_url: "https://images.pexels.com/photos/956981/pexels-photo-956981.jpeg?auto=compress&cs=tinysrgb&w=800" 
    },
    { 
      id: 11, 
      slug: "dominance", 
      title: "Dominance", 
      cover_url: "https://images.pexels.com/photos/1563356/pexels-photo-1563356.jpeg?auto=compress&cs=tinysrgb&w=800" 
    },
    { 
      id: 12, 
      slug: "submission", 
      title: "Submission", 
      cover_url: "https://images.pexels.com/photos/1144256/pexels-photo-1144256.jpeg?auto=compress&cs=tinysrgb&w=800" 
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white font-section-title">
            Categories
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Discover intimate stories and audio experiences across diverse categories
          </p>
        </div>

        {/* Categories Tags */}
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}
                prefetch={true}
                className="px-6 py-3 bg-white border border-gray-200 rounded-full text-gray-700 hover:bg-purple-50 hover:border-purple-300 hover:text-purple-700 transition-all duration-200 shadow-sm hover:shadow-md font-medium"
              >
                {cat.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


