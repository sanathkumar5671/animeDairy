export interface AnimeData {
  id: number;
  title: {
    romaji: string;
    english: string;
    native: string;
  };
  coverImage: {
    large: string;
    medium: string;
  };
  description: string;
  averageScore: number;
  popularity: number;
  genres: string[];
  status: string;
  episodes: number;
  duration: number;
}

export interface WatchlistItem {
  id: string;
  user_id: string;
  anime_id: number;
  anime_title: string;
  anime_cover_image: string | null;
  anime_description: string | null;
  anime_genres: string[] | null;
  anime_status: string | null;
  anime_episodes: number | null;
  anime_duration: number | null;
  added_at: string;
}

export interface WatchedItem {
  id: string;
  user_id: string;
  anime_id: number;
  anime_title: string;
  anime_cover_image: string | null;
  anime_description: string | null;
  anime_genres: string[] | null;
  anime_status: string | null;
  anime_episodes: number | null;
  anime_duration: number | null;
  completed_at: string;
  rating: number | null;
  notes: string | null;
}

export interface FavoriteItem {
  id: string;
  user_id: string;
  anime_id: number;
  anime_title: string;
  anime_cover_image: string | null;
  anime_description: string | null;
  anime_genres: string[] | null;
  anime_status: string | null;
  anime_episodes: number | null;
  anime_duration: number | null;
  added_at: string;
}

export interface AnimeStats {
  watchlistCount: number;
  watchedCount: number;
  favoritesCount: number;
} 