"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useAuth } from "@/lib/hooks/useAuth";
import { Navigation } from "@/components/Navigation";
import { BackgroundElements } from "@/components/BackgroundElements";
import { getWatchlist } from "@/lib/queries/userAnime";
import type { WatchlistItem } from "@/lib/types/anime";

export default function WatchlistPage() {
  const { user, loading, signOut } = useAuth();
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [loadingWatchlist, setLoadingWatchlist] = useState(true);

  const handleLoadWatchlist = async () => {
    try {
      const userWatchlist = await getWatchlist();
      setWatchlist(userWatchlist);
    } catch (error) {
      console.error("Error loading watchlist:", error);
    } finally {
      setLoadingWatchlist(false);
    }
  };

  useEffect(() => {
    if (user) {
      handleLoadWatchlist();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      <BackgroundElements />

      <Navigation user={user} onSignOut={signOut} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="py-4 sm:py-6">
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-lg shadow-xl p-4 sm:p-6 border border-gray-700/50">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-6">
              My Watchlist
            </h1>

            {loadingWatchlist ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="bg-gray-800/50 backdrop-blur-lg rounded-lg shadow-xl border border-gray-700/50 overflow-hidden animate-pulse"
                  >
                    <div className="aspect-[3/4] bg-gray-700"></div>
                    <div className="p-4">
                      <div className="h-4 bg-gray-700 rounded mb-2"></div>
                      <div className="h-3 bg-gray-700 rounded mb-2"></div>
                      <div className="h-3 bg-gray-700 rounded w-2/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : watchlist.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-lg mb-4">
                  Your watchlist is empty
                </div>
                <p className="text-gray-500">
                  Start adding anime to your watchlist from the trending page!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {watchlist.map((item) => (
                  <div
                    key={item.id}
                    className="bg-gray-800/50 backdrop-blur-lg rounded-lg shadow-xl border border-gray-700/50 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]"
                  >
                    {/* Anime Cover Image */}
                    <div className="relative aspect-[3/4] overflow-hidden">
                      <Image
                        src={item.anime_cover_image || "/placeholder-anime.jpg"}
                        alt={item.anime_title}
                        fill
                        className="object-cover transition-transform duration-300 hover:scale-110"
                      />
                    </div>

                    {/* Anime Info */}
                    <div className="p-4">
                      <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2">
                        {item.anime_title}
                      </h3>

                      <p className="text-gray-400 text-sm mb-3 line-clamp-3">
                        {item.anime_description || "No description available"}
                      </p>

                      {/* Genres */}
                      {item.anime_genres && item.anime_genres.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {item.anime_genres.slice(0, 3).map((genre) => (
                            <span
                              key={genre}
                              className="bg-gray-700/50 text-gray-300 text-xs px-2 py-1 rounded-full"
                            >
                              {genre}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Anime Details */}
                      <div className="flex justify-between text-gray-400 text-sm mb-4">
                        <span>{item.anime_episodes || "?"} episodes</span>
                        <span>{item.anime_duration || "?"} min</span>
                        <span className="capitalize">
                          {item.anime_status || "Unknown"}
                        </span>
                      </div>

                      {/* Added Date */}
                      <div className="text-gray-500 text-xs">
                        Added: {new Date(item.added_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
