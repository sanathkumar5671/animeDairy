"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { Navigation } from "@/components/Navigation";
import { BackgroundElements } from "@/components/BackgroundElements";
import { fetchAnimeDetail } from "@/lib/queries/anime";
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

interface AnimeDetail {
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
  bannerImage: string | null;
  description: string;
  averageScore: number;
  popularity: number;
  genres: string[];
  status: string;
  episodes: number;
  duration: number;
  season: string;
  seasonYear: number;
  format: string;
  source: string;
  studios: {
    nodes: Array<{
      name: string;
    }>;
  };
  startDate: {
    year: number;
    month: number;
    day: number;
  };
  endDate: {
    year: number;
    month: number;
    day: number;
  };
  characters: {
    nodes: Array<{
      id: number;
      name: {
        full: string;
      };
      image: {
        medium: string;
      };
    }>;
  };
  relations: {
    edges: Array<{
      relationType: string;
      node: {
        id: number;
        title: {
          english: string;
          romaji: string;
        };
        coverImage: {
          medium: string;
        };
        type: string;
      };
    }>;
  };
}

function ShowPageContent() {
  const searchParams = useSearchParams();
  const { user, signOut } = useAuth();
  const [anime, setAnime] = useState<AnimeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInUserWatchlist, setIsInUserWatchlist] = useState(false);
  const [isInUserWatched, setIsInUserWatched] = useState(false);
  const [isInUserFavorites, setIsInUserFavorites] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const animeId = Number(searchParams.get("id"));

  useEffect(() => {
    const loadAnimeDetail = async () => {
      if (!animeId || isNaN(animeId)) {
        setError("Invalid anime ID");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetchAnimeDetail(animeId);
        setAnime(response.data.Media);
      } catch (err) {
        setError("Failed to load anime details");
        console.error("Error loading anime detail:", err);
      } finally {
        setLoading(false);
      }
    };

    loadAnimeDetail();
  }, [animeId]);

  useEffect(() => {
    const checkUserStatus = async () => {
      if (!user || !animeId) return;

      try {
        const [watchlistStatus, watchedStatus, favoritesStatus] =
          await Promise.all([
            isInWatchlist(animeId),
            isInWatched(animeId),
            isInFavorites(animeId),
          ]);

        setIsInUserWatchlist(watchlistStatus);
        setIsInUserWatched(watchedStatus);
        setIsInUserFavorites(favoritesStatus);
      } catch (error) {
        console.error("Error checking anime status:", error);
      }
    };

    checkUserStatus();
  }, [user, animeId]);

  const handleWatchlistToggle = async () => {
    if (!user || !anime) return;
    setActionLoading(true);
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
      setActionLoading(false);
    }
  };

  const handleWatchedToggle = async () => {
    if (!user || !anime) return;
    setActionLoading(true);
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
      setActionLoading(false);
    }
  };

  const handleFavoritesToggle = async () => {
    if (!user || !anime) return;
    setActionLoading(true);
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
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    );
  }

  if (error || !anime) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
        <BackgroundElements />
        <Navigation user={user} onSignOut={signOut} />
        <div className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-white mb-4">
              Anime Not Found
            </h1>
            <p className="text-gray-400 mb-6">
              {error || "The anime you are looking for does not exist."}
            </p>
            <Link
              href="/trending"
              className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
            >
              Back to Trending
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (date: { year: number; month: number; day: number }) => {
    if (!date.year) return "Unknown";
    return new Date(date.year, date.month - 1, date.day).toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      <BackgroundElements />
      <Navigation user={user} onSignOut={signOut} />

      {/* Hero Section with Banner */}
      {anime.bannerImage && (
        <div className="relative h-64 sm:h-80 lg:h-96 overflow-hidden">
          <Image
            src={anime.bannerImage}
            alt={anime.title.english || anime.title.romaji}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-lg shadow-xl border border-gray-700/50 overflow-hidden">
          {/* Header Section */}
          <div className="p-6 sm:p-8">
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
              {/* Cover Image */}
              <div className="flex-shrink-0">
                <div className="relative w-48 h-72 sm:w-56 sm:h-80 rounded-lg overflow-hidden shadow-xl">
                  <Image
                    src={anime.coverImage.large}
                    alt={anime.title.english || anime.title.romaji}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Title and Info */}
              <div className="flex-1">
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                  {anime.title.english || anime.title.romaji}
                </h1>
                {anime.title.english &&
                  anime.title.romaji &&
                  anime.title.english !== anime.title.romaji && (
                    <p className="text-xl text-gray-300 mb-4">
                      {anime.title.romaji}
                    </p>
                  )}

                {/* Score and Popularity */}
                <div className="flex flex-wrap gap-4 mb-6">
                  {anime.averageScore && (
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-400 text-lg">★</span>
                      <span className="text-white font-semibold">
                        {anime.averageScore / 10}/10
                      </span>
                    </div>
                  )}
                  <div className="text-gray-400">
                    Popularity: #{anime.popularity}
                  </div>
                </div>

                {/* Genres */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {anime.genres.map((genre) => (
                    <span
                      key={genre}
                      className="bg-gray-700/50 text-gray-300 text-sm px-3 py-1 rounded-full"
                    >
                      {genre}
                    </span>
                  ))}
                </div>

                {/* Action Buttons */}
                {user ? (
                  <div className="flex flex-wrap gap-3 mb-6">
                    <button
                      onClick={handleWatchlistToggle}
                      disabled={actionLoading}
                      className={`px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${
                        isInUserWatchlist
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      }`}
                    >
                      {actionLoading
                        ? "..."
                        : isInUserWatchlist
                        ? "In Watchlist"
                        : "Add to Watchlist"}
                    </button>

                    <button
                      onClick={handleWatchedToggle}
                      disabled={actionLoading}
                      className={`px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${
                        isInUserWatched
                          ? "bg-green-600 text-white hover:bg-green-700"
                          : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      }`}
                    >
                      {actionLoading
                        ? "..."
                        : isInUserWatched
                        ? "Watched"
                        : "Mark Watched"}
                    </button>

                    <button
                      onClick={handleFavoritesToggle}
                      disabled={actionLoading}
                      className={`px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${
                        isInUserFavorites
                          ? "bg-red-600 text-white hover:bg-red-700"
                          : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      }`}
                    >
                      {actionLoading
                        ? "..."
                        : isInUserFavorites
                        ? "❤️ Favorited"
                        : "🤍 Add to Favorites"}
                    </button>
                  </div>
                ) : (
                  <div className="mb-6">
                    <p className="text-gray-400 mb-3">
                      Sign in to manage your anime lists
                    </p>
                    <Link
                      href="/login"
                      className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
                    >
                      Sign In to Add to Favorites
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="px-6 sm:px-8 pb-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Description
            </h2>
            <p className="text-gray-300 leading-relaxed">
              {anime.description?.replace(/<[^>]*>/g, "") ||
                "No description available."}
            </p>
          </div>

          {/* Details Grid */}
          <div className="px-6 sm:px-8 pb-6">
            <h2 className="text-xl font-semibold text-white mb-4">Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-gray-700/30 p-4 rounded-lg">
                <h3 className="text-gray-400 text-sm font-medium mb-1">
                  Status
                </h3>
                <p className="text-white capitalize">{anime.status}</p>
              </div>
              <div className="bg-gray-700/30 p-4 rounded-lg">
                <h3 className="text-gray-400 text-sm font-medium mb-1">
                  Format
                </h3>
                <p className="text-white capitalize">{anime.format}</p>
              </div>
              <div className="bg-gray-700/30 p-4 rounded-lg">
                <h3 className="text-gray-400 text-sm font-medium mb-1">
                  Episodes
                </h3>
                <p className="text-white">{anime.episodes || "Unknown"}</p>
              </div>
              <div className="bg-gray-700/30 p-4 rounded-lg">
                <h3 className="text-gray-400 text-sm font-medium mb-1">
                  Duration
                </h3>
                <p className="text-white">
                  {anime.duration ? `${anime.duration} min` : "Unknown"}
                </p>
              </div>
              <div className="bg-gray-700/30 p-4 rounded-lg">
                <h3 className="text-gray-400 text-sm font-medium mb-1">
                  Season
                </h3>
                <p className="text-white capitalize">
                  {anime.season} {anime.seasonYear}
                </p>
              </div>
              <div className="bg-gray-700/30 p-4 rounded-lg">
                <h3 className="text-gray-400 text-sm font-medium mb-1">
                  Source
                </h3>
                <p className="text-white capitalize">{anime.source}</p>
              </div>
              <div className="bg-gray-700/30 p-4 rounded-lg">
                <h3 className="text-gray-400 text-sm font-medium mb-1">
                  Start Date
                </h3>
                <p className="text-white">{formatDate(anime.startDate)}</p>
              </div>
              <div className="bg-gray-700/30 p-4 rounded-lg">
                <h3 className="text-gray-400 text-sm font-medium mb-1">
                  End Date
                </h3>
                <p className="text-white">{formatDate(anime.endDate)}</p>
              </div>
              {anime.studios.nodes.length > 0 && (
                <div className="bg-gray-700/30 p-4 rounded-lg">
                  <h3 className="text-gray-400 text-sm font-medium mb-1">
                    Studios
                  </h3>
                  <p className="text-white">
                    {anime.studios.nodes.map((s) => s.name).join(", ")}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Characters */}
          {anime.characters.nodes.length > 0 && (
            <div className="px-6 sm:px-8 pb-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                Main Characters
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {anime.characters.nodes.slice(0, 12).map((character) => (
                  <div key={character.id} className="text-center">
                    <div className="relative w-16 h-16 mx-auto mb-2 rounded-full overflow-hidden">
                      <Image
                        src={character.image.medium}
                        alt={character.name.full}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <p className="text-gray-300 text-sm truncate">
                      {character.name.full}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Related Anime */}
          {anime.relations.edges.length > 0 && (
            <div className="px-6 sm:px-8 pb-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                Related Anime
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {anime.relations.edges.slice(0, 6).map((relation) => (
                  <Link
                    key={relation.node.id}
                    href={`/show?id=${relation.node.id}`}
                    className="group block"
                  >
                    <div className="relative aspect-[3/4] rounded-lg overflow-hidden mb-2">
                      <Image
                        src={relation.node.coverImage.medium}
                        alt={
                          relation.node.title.english ||
                          relation.node.title.romaji
                        }
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                    <p className="text-gray-300 text-sm truncate group-hover:text-white transition-colors">
                      {relation.node.title.english ||
                        relation.node.title.romaji}
                    </p>
                    <p className="text-gray-500 text-xs capitalize">
                      {relation.relationType}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ShowPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 dark:border-white"></div>
        </div>
      }
    >
      <ShowPageContent />
    </Suspense>
  );
}
