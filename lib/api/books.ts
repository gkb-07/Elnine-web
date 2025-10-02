import { supabase } from '../supabase';

/**
 * Fetch all books with stats
 */
export async function getBooks() {
  const { data, error } = await supabase
    .from('books_with_stats')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * Fetch featured books
 */
export async function getFeaturedBooks() {
  const { data, error } = await supabase
    .from('featured_books')
    .select('*')
    .limit(10);

  if (error) throw error;
  return data;
}

/**
 * Fetch trending books
 */
export async function getTrendingBooks() {
  const { data, error } = await supabase
    .from('trending_this_week')
    .select('*')
    .limit(20);

  if (error) throw error;
  return data;
}

/**
 * Fetch book by ID with chapters
 */
export async function getBookById(bookId: string) {
  // Fetch book details
  const { data: book, error: bookError } = await supabase
    .from('books')
    .select('*')
    .eq('id', bookId)
    .single();

  if (bookError) throw bookError;

  // Fetch chapters
  const { data: chapters, error: chaptersError } = await supabase
    .from('chapters')
    .select('*')
    .eq('book_id', bookId)
    .order('chapter_number', { ascending: true });

  if (chaptersError) throw chaptersError;

  return { ...book, chapters };
}

/**
 * Fetch books by category
 */
export async function getBooksByCategory(categorySlug: string) {
  const { data, error } = await supabase
    .from('books_with_stats')
    .select('*, categories!inner(slug)')
    .eq('categories.slug', categorySlug);

  if (error) throw error;
  return data;
}

/**
 * Search books
 */
export async function searchBooks(query: string) {
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .or(`title.ilike.%${query}%,author.ilike.%${query}%`)
    .limit(20);

  if (error) throw error;
  return data;
}

/**
 * Get all categories
 */
export async function getCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  if (error) throw error;
  return data;
}


