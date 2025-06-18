"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useAuth } from "@/lib/hooks/useAuth";
import type { AnimeData } from "@/lib/types/anime";
import {
  addToWatchlist,
  removeFromWatchlist,
  addToWatched,
  removeFromWatched,
  addToFavorites,
  removeFromFavorites,
  isInWatchlist,
  isInWatched,
  isInFavorites,
} from "@/lib/queries/userAnime";

interface AnimeCardProps {
  anime: AnimeData;
  showActions?: boolean;
  className?: string;
}

export const AnimeCard = ({
  anime,
  showActions = true,
  className = "",
}: AnimeCardProps) => {
  const { user } = useAuth();
  const [isInUserWatchlist, setIsInUserWatchlist] = useState(false);
  const [isInUserWatched, setIsInUserWatched] = useState(false);
  const [isInUserFavorites, setIsInUserFavorites] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCheckStatus = useCallback(async () => {
    if (!showActions || !user) return;

    try {
      const [watchlistStatus, watchedStatus, favoritesStatus] =
        await Promise.all([
          isInWatchlist(anime.id),
          isInWatched(anime.id),
          isInFavorites(anime.id),
        ]);

      setIsInUserWatchlist(watchlistStatus);
      setIsInUserWatched(watchedStatus);
      setIsInUserFavorites(favoritesStatus);
    } catch (error) {
      console.error("Error checking anime status:", error);
    }
  }, [anime.id, showActions, user]);

  const handleWatchlistToggle = async () => {
    if (!user) return;
    setLoading(true);
    try {
      if (isInUserWatchlist) {
        await removeFromWatchlist(anime.id);
        setIsInUserWatchlist(false);
      } else {
        await addToWatchlist(anime);
        setIsInUserWatchlist(true);
      }
    } catch (error) {
      console.error("Error toggling watchlist:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleWatchedToggle = async () => {
    if (!user) return;
    setLoading(true);
    try {
      if (isInUserWatched) {
        await removeFromWatched(anime.id);
        setIsInUserWatched(false);
      } else {
        await addToWatched(anime);
        setIsInUserWatched(true);
      }
    } catch (error) {
      console.error("Error toggling watched:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFavoritesToggle = async () => {
    if (!user) return;
    setLoading(true);
    try {
      if (isInUserFavorites) {
        await removeFromFavorites(anime.id);
        setIsInUserFavorites(false);
      } else {
        await addToFavorites(anime);
        setIsInUserFavorites(true);
      }
    } catch (error) {
      console.error("Error toggling favorites:", error);
    } finally {
      setLoading(false);
    }
  };

  // Check status on mount
  useEffect(() => {
    handleCheckStatus();
  }, [handleCheckStatus]);

  return (
    <div
      className={`bg-gray-800/50 backdrop-blur-lg rounded-lg shadow-xl border border-gray-700/50 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] ${className}`}
    >
      {/* Anime Cover Image */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <Image
          src={anime.coverImage.large}
          alt={anime.title.english || anime.title.romaji}
          fill
          className="object-cover transition-transform duration-300 hover:scale-110"
        />

        {/* Overlay with Score */}
        <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm rounded-full px-2 py-1">
          <span className="text-white text-sm font-semibold">
            {anime.averageScore ? `${anime.averageScore / 10}/10` : "N/A"}
          </span>
        </div>
      </div>

      {/* Anime Info */}
      <div className="p-4">
        <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2">
          {anime.title.english || anime.title.romaji}
        </h3>

        <p className="text-gray-400 text-sm mb-3 line-clamp-3">
          {anime.description?.replace(/<[^>]*>/g, "") ||
            "No description available"}
        </p>

        {/* Genres */}
        <div className="flex flex-wrap gap-1 mb-3">
          {anime.genres?.slice(0, 3).map((genre) => (
            <span
              key={genre}
              className="bg-gray-700/50 text-gray-300 text-xs px-2 py-1 rounded-full"
            >
              {genre}
            </span>
          ))}
        </div>

        {/* Anime Details */}
        <div className="flex justify-between text-gray-400 text-sm mb-4">
          <span>{anime.episodes || "?"} episodes</span>
          <span>{anime.duration || "?"} min</span>
          <span className="capitalize">{anime.status}</span>
        </div>

        {/* Action Buttons - Only show if user is logged in */}
        {showActions && user && (
          <div className="flex gap-2">
            <button
              onClick={handleWatchlistToggle}
              disabled={loading}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                isInUserWatchlist
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              {loading
                ? "..."
                : isInUserWatchlist
                ? "In Watchlist"
                : "Add to Watchlist"}
            </button>

            <button
              onClick={handleWatchedToggle}
              disabled={loading}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                isInUserWatched
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              {loading ? "..." : isInUserWatched ? "Watched" : "Mark Watched"}
            </button>

            <button
              onClick={handleFavoritesToggle}
              disabled={loading}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                isInUserFavorites
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              {loading ? "..." : isInUserFavorites ? "❤️" : "🤍"}
            </button>
          </div>
        )}

        {/* Login Prompt - Show if user is not logged in */}
        {showActions && !user && (
          <div className="text-center py-3">
            <p className="text-gray-400 text-sm mb-2">
              Sign in to manage your anime lists
            </p>
            <a
              href="/login"
              className="inline-block px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
            >
              Sign In
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
