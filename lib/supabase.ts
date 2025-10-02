import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types (you can generate these with Supabase CLI later)
export type Book = {
  id: string;
  title: string;
  author: string;
  description?: string;
  cover_url?: string;
  category_id?: string;
  total_chapters: number;
  total_duration: number;
  rating?: number;
  is_featured: boolean;
  created_at: string;
};

export type Chapter = {
  id: string;
  book_id: string;
  title: string;
  chapter_number: number;
  audio_url: string;
  duration: number;
  lyrics?: any;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
};

export type UserProgress = {
  id: string;
  user_id: string;
  book_id: string;
  chapter_id: string;
  current_position: number;
  completed_chapters: number;
  last_played_at: string;
};


