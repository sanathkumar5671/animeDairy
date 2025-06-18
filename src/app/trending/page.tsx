"use client";

import { useAuth } from "@/lib/hooks/useAuth";
import { TrendingAnime } from "@/components/TrendingAnime/index";
import Link from "next/link";
import { AnimatedHeader } from "@/components/AnimatedHeader";

export default function TrendingPage() {
  const { user, loading, signOut } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500/5 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Navigation Bar */}
      <nav className="w-full bg-gray-800/50 backdrop-blur-lg shadow-sm border-b border-gray-700/50 pt-6">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center h-auto sm:h-20 py-4 sm:py-0 space-y-4 sm:space-y-0">
            <div className="w-full sm:flex-1 text-center sm:text-left">
              <Link
                href="/trending"
                className="text-sm text-gray-400 hover:text-gray-300 transition-colors"
              >
                Trending
              </Link>
            </div>
            <div className="w-full sm:flex-1 flex justify-center">
              <AnimatedHeader />
            </div>
            <div className="w-full sm:flex-1 flex flex-col sm:flex-row justify-center sm:justify-end items-center space-y-2 sm:space-y-0 sm:space-x-4">
              {user ? (
                <>
                  <span className="text-sm text-gray-400 text-center sm:text-left">
                    Welcome, {user.email}
                  </span>
                  <button
                    onClick={signOut}
                    className="w-full sm:w-auto inline-flex items-center justify-center px-3 py-2 border border-gray-700/50 text-sm leading-4 font-medium rounded-lg text-white bg-gray-800/50 hover:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-200"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-3 py-2 border border-gray-700/50 text-sm leading-4 font-medium rounded-lg text-white bg-gray-800/50 hover:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-200"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Dashboard Stats - Only show for authenticated users */}
      {user && (
        <div className="w-full bg-gray-800/50 backdrop-blur-lg border-b border-gray-700/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-gray-800/50 backdrop-blur-lg p-4 rounded-lg border border-gray-700/50">
                <h3 className="font-semibold text-white">Watchlist</h3>
                <p className="text-sm text-gray-400">0 anime</p>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-lg p-4 rounded-lg border border-gray-700/50">
                <h3 className="font-semibold text-white">Completed</h3>
                <p className="text-sm text-gray-400">0 anime</p>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-lg p-4 rounded-lg border border-gray-700/50 sm:col-span-2 md:col-span-1">
                <h3 className="font-semibold text-white">Favorites</h3>
                <p className="text-sm text-gray-400">0 anime</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="py-4 sm:py-6">
          <div className="grid grid-rows-[auto_1fr] gap-4 sm:gap-8">
            {/* Trending Anime Section */}
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-lg shadow-xl p-4 sm:p-6 border border-gray-700/50">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">
                Trending Now
              </h2>
              <TrendingAnime />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
