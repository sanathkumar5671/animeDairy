import { createClient } from '@/lib/supabase/client';
import type { WatchlistItem, WatchedItem, FavoriteItem, AnimeData, AnimeStats } from '@/lib/types/anime';

const supabase = createClient();

// Watchlist functions
export const addToWatchlist = async (anime: AnimeData): Promise<WatchlistItem | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('watchlist')
    .insert({
      user_id: user.id,
      anime_id: anime.id,
      anime_title: anime.title.english || anime.title.romaji,
      anime_cover_image: anime.coverImage.large,
      anime_description: anime.description,
      anime_genres: anime.genres,
      anime_status: anime.status,
      anime_episodes: anime.episodes,
      anime_duration: anime.duration,
    })
    .select()
    .single();

  if (error) {
    if (error.code === '23505') { // Unique constraint violation
      throw new Error('Anime already in watchlist');
    }
    throw error;
  }

  return data;
};

export const removeFromWatchlist = async (animeId: number): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('User not authenticated');

  const { error } = await supabase
    .from('watchlist')
    .delete()
    .eq('user_id', user.id)
    .eq('anime_id', animeId);

  if (error) throw error;
};

export const getWatchlist = async (): Promise<WatchlistItem[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('watchlist')
    .select('*')
    .eq('user_id', user.id)
    .order('added_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const isInWatchlist = async (animeId: number): Promise<boolean> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return false;

  const { data, error } = await supabase
    .from('watchlist')
    .select('id')
    .eq('user_id', user.id)
    .eq('anime_id', animeId)
    .single();

  if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
  return !!data;
};

// Watched functions
export const addToWatched = async (anime: AnimeData, rating?: number, notes?: string): Promise<WatchedItem | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('watched')
    .insert({
      user_id: user.id,
      anime_id: anime.id,
      anime_title: anime.title.english || anime.title.romaji,
      anime_cover_image: anime.coverImage.large,
      anime_description: anime.description,
      anime_genres: anime.genres,
      anime_status: anime.status,
      anime_episodes: anime.episodes,
      anime_duration: anime.duration,
      rating,
      notes,
    })
    .select()
    .single();

  if (error) {
    if (error.code === '23505') { // Unique constraint violation
      throw new Error('Anime already in watched list');
    }
    throw error;
  }

  return data;
};

export const updateWatchedRating = async (animeId: number, rating: number, notes?: string): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('User not authenticated');

  const { error } = await supabase
    .from('watched')
    .update({ rating, notes })
    .eq('user_id', user.id)
    .eq('anime_id', animeId);

  if (error) throw error;
};

export const removeFromWatched = async (animeId: number): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('User not authenticated');

  const { error } = await supabase
    .from('watched')
    .delete()
    .eq('user_id', user.id)
    .eq('anime_id', animeId);

  if (error) throw error;
};

export const getWatched = async (): Promise<WatchedItem[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('watched')
    .select('*')
    .eq('user_id', user.id)
    .order('completed_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const isInWatched = async (animeId: number): Promise<boolean> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return false;

  const { data, error } = await supabase
    .from('watched')
    .select('id')
    .eq('user_id', user.id)
    .eq('anime_id', animeId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return !!data;
};

// Favorites functions
export const addToFavorites = async (anime: AnimeData): Promise<FavoriteItem | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('favorites')
    .insert({
      user_id: user.id,
      anime_id: anime.id,
      anime_title: anime.title.english || anime.title.romaji,
      anime_cover_image: anime.coverImage.large,
      anime_description: anime.description,
      anime_genres: anime.genres,
      anime_status: anime.status,
      anime_episodes: anime.episodes,
      anime_duration: anime.duration,
    })
    .select()
    .single();

  if (error) {
    if (error.code === '23505') { // Unique constraint violation
      throw new Error('Anime already in favorites');
    }
    throw error;
  }

  return data;
};

export const removeFromFavorites = async (animeId: number): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('User not authenticated');

  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', user.id)
    .eq('anime_id', animeId);

  if (error) throw error;
};

export const getFavorites = async (): Promise<FavoriteItem[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('favorites')
    .select('*')
    .eq('user_id', user.id)
    .order('added_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const isInFavorites = async (animeId: number): Promise<boolean> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return false;

  const { data, error } = await supabase
    .from('favorites')
    .select('id')
    .eq('user_id', user.id)
    .eq('anime_id', animeId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return !!data;
};

// Stats function
export const getAnimeStats = async (): Promise<AnimeStats> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { watchlistCount: 0, watchedCount: 0, favoritesCount: 0 };
  }

  const [watchlistResult, watchedResult, favoritesResult] = await Promise.all([
    supabase.from('watchlist').select('id', { count: 'exact' }).eq('user_id', user.id),
    supabase.from('watched').select('id', { count: 'exact' }).eq('user_id', user.id),
    supabase.from('favorites').select('id', { count: 'exact' }).eq('user_id', user.id),
  ]);

  return {
    watchlistCount: watchlistResult.count || 0,
    watchedCount: watchedResult.count || 0,
    favoritesCount: favoritesResult.count || 0,
  };
}; 