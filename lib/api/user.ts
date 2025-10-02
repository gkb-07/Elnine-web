import { supabase } from '../supabase';

/**
 * Get user's library (books in progress)
 */
export async function getUserLibrary(userId: string) {
  const { data, error } = await supabase
    .from('user_library')
    .select('*')
    .eq('user_id', userId)
    .order('last_played_at', { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * Get user's liked books
 */
export async function getUserLikedBooks(userId: string) {
  const { data, error } = await supabase
    .from('user_liked_books')
    .select('*')
    .eq('user_id', userId)
    .order('liked_at', { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * Like a book
 */
export async function likeBook(userId: string, bookId: string) {
  const { error } = await supabase
    .from('likes')
    .insert({ user_id: userId, book_id: bookId });

  if (error) throw error;
}

/**
 * Unlike a book
 */
export async function unlikeBook(userId: string, bookId: string) {
  const { error } = await supabase
    .from('likes')
    .delete()
    .eq('user_id', userId)
    .eq('book_id', bookId);

  if (error) throw error;
}

/**
 * Save user progress
 */
export async function saveProgress(
  userId: string,
  bookId: string,
  chapterId: string,
  currentPosition: number
) {
  const { error } = await supabase
    .from('user_progress')
    .upsert({
      user_id: userId,
      book_id: bookId,
      chapter_id: chapterId,
      current_position: currentPosition,
      last_played_at: new Date().toISOString(),
    });

  if (error) throw error;
}

/**
 * Track a play
 */
export async function trackPlay(
  userId: string | null,
  bookId: string,
  chapterId: string,
  listenDuration: number
) {
  const { error } = await supabase
    .from('plays')
    .insert({
      user_id: userId,
      book_id: bookId,
      chapter_id: chapterId,
      listen_duration: listenDuration,
      played_at: new Date().toISOString(),
    });

  if (error) throw error;
}

/**
 * Get user progress for a specific book
 */
export async function getUserProgress(userId: string, bookId: string) {
  const { data, error } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('book_id', bookId)
    .single();

  if (error && error.code !== 'PGRST116') throw error; // Ignore "not found" error
  return data;
}


