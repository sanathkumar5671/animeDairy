"use client";

import { useEffect, useState } from "react";
import { getAnimeStats } from "@/lib/queries/userAnime";
import type { AnimeStats } from "@/lib/types/anime";

export const DashboardStats = () => {
  const [stats, setStats] = useState<AnimeStats>({
    watchlistCount: 0,
    watchedCount: 0,
    favoritesCount: 0,
  });
  const [loading, setLoading] = useState(true);

  const handleLoadStats = async () => {
    try {
      const userStats = await getAnimeStats();
      setStats(userStats);
    } catch (error) {
      console.error("Error loading stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleLoadStats();
  }, []);

  if (loading) {
    return (
      <div className="w-full bg-gray-800/50 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-gray-800/50 backdrop-blur-lg p-4 rounded-lg border border-gray-700/50 animate-pulse"
              >
                <div className="h-4 bg-gray-700 rounded mb-2"></div>
                <div className="h-3 bg-gray-700 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-800/50 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-gray-800/50 backdrop-blur-lg p-4 rounded-lg border border-gray-700/50 hover:bg-gray-700/50 transition-colors duration-200">
            <h3 className="font-semibold text-white mb-1">Watchlist</h3>
            <p className="text-sm text-gray-400">
              {stats.watchlistCount} anime
            </p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-lg p-4 rounded-lg border border-gray-700/50 hover:bg-gray-700/50 transition-colors duration-200">
            <h3 className="font-semibold text-white mb-1">Completed</h3>
            <p className="text-sm text-gray-400">{stats.watchedCount} anime</p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-lg p-4 rounded-lg border border-gray-700/50 hover:bg-gray-700/50 transition-colors duration-200 sm:col-span-2 md:col-span-1">
            <h3 className="font-semibold text-white mb-1">Favorites</h3>
            <p className="text-sm text-gray-400">
              {stats.favoritesCount} anime
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
