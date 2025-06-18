"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useAuth } from "@/lib/hooks/useAuth";
import { Navigation } from "@/components/Navigation";
import { BackgroundElements } from "@/components/BackgroundElements";
import { getWatched, updateWatchedRating } from "@/lib/queries/userAnime";
import type { WatchedItem } from "@/lib/types/anime";

export default function WatchedPage() {
  const { user, loading, signOut } = useAuth();
  const [watched, setWatched] = useState<WatchedItem[]>([]);
  const [loadingWatched, setLoadingWatched] = useState(true);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editRating, setEditRating] = useState<number>(0);
  const [editNotes, setEditNotes] = useState<string>("");

  const handleLoadWatched = async () => {
    try {
      const userWatched = await getWatched();
      setWatched(userWatched);
    } catch (error) {
      console.error("Error loading watched:", error);
    } finally {
      setLoadingWatched(false);
    }
  };

  const handleEditItem = (item: WatchedItem) => {
    setEditingItem(item.id);
    setEditRating(item.rating || 0);
    setEditNotes(item.notes || "");
  };

  const handleSaveEdit = async (item: WatchedItem) => {
    try {
      await updateWatchedRating(item.anime_id, editRating, editNotes);
      // Update local state
      setWatched((prev) =>
        prev.map((w) =>
          w.id === item.id ? { ...w, rating: editRating, notes: editNotes } : w
        )
      );
      setEditingItem(null);
    } catch (error) {
      console.error("Error updating rating:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
    setEditRating(0);
    setEditNotes("");
  };

  useEffect(() => {
    if (user) {
      handleLoadWatched();
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
              Watched Anime
            </h1>

            {loadingWatched ? (
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
            ) : watched.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-lg mb-4">
                  You haven&apos;t watched any anime yet
                </div>
                <p className="text-gray-500">
                  Mark anime as watched from the trending page to see them here!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {watched.map((item) => (
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

                      {/* Rating Overlay */}
                      {item.rating && (
                        <div className="absolute top-2 left-2 bg-green-600/90 backdrop-blur-sm rounded-full px-2 py-1">
                          <span className="text-white text-sm font-semibold">
                            {item.rating}/10
                          </span>
                        </div>
                      )}
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

                      {/* Rating and Notes Section */}
                      {editingItem === item.id ? (
                        <div className="space-y-3">
                          <div>
                            <label className="block text-gray-300 text-sm mb-1">
                              Rating (1-10)
                            </label>
                            <input
                              type="number"
                              min="1"
                              max="10"
                              value={editRating}
                              onChange={(e) =>
                                setEditRating(Number(e.target.value))
                              }
                              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-gray-300 text-sm mb-1">
                              Notes
                            </label>
                            <textarea
                              value={editNotes}
                              onChange={(e) => setEditNotes(e.target.value)}
                              rows={2}
                              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Add your thoughts..."
                            />
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleSaveEdit(item)}
                              className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                            >
                              Save
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="flex-1 px-3 py-2 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {/* Current Rating Display */}
                          {item.rating && (
                            <div className="flex items-center gap-2">
                              <span className="text-yellow-400 text-sm">★</span>
                              <span className="text-white text-sm">
                                {item.rating}/10
                              </span>
                            </div>
                          )}

                          {/* Notes Display */}
                          {item.notes && (
                            <div className="text-gray-300 text-sm bg-gray-700/50 p-2 rounded">
                              {item.notes}
                            </div>
                          )}

                          <button
                            onClick={() => handleEditItem(item)}
                            className="w-full px-3 py-2 bg-gray-700 text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-600 transition-colors"
                          >
                            {item.rating ? "Edit Rating" : "Add Rating"}
                          </button>
                        </div>
                      )}

                      {/* Completed Date */}
                      <div className="text-gray-500 text-xs mt-3">
                        Completed:{" "}
                        {new Date(item.completed_at).toLocaleDateString()}
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
