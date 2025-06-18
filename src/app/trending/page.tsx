"use client";

import { useAuth } from "@/lib/hooks/useAuth";
import { TrendingAnime } from "@/components/TrendingAnime/index";
import { Navigation } from "@/components/Navigation";
import { DashboardStats } from "@/components/DashboardStats";
import { BackgroundElements } from "@/components/BackgroundElements";

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
      <BackgroundElements />

      <Navigation user={user} onSignOut={signOut} />

      {user && <DashboardStats />}

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
