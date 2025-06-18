interface DashboardStatsProps {
  watchlistCount?: number;
  completedCount?: number;
  favoritesCount?: number;
}

export const DashboardStats = ({
  watchlistCount = 0,
  completedCount = 0,
  favoritesCount = 0,
}: DashboardStatsProps) => {
  return (
    <div className="w-full bg-gray-800/50 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-gray-800/50 backdrop-blur-lg p-4 rounded-lg border border-gray-700/50">
            <h3 className="font-semibold text-white">Watchlist</h3>
            <p className="text-sm text-gray-400">{watchlistCount} anime</p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-lg p-4 rounded-lg border border-gray-700/50">
            <h3 className="font-semibold text-white">Completed</h3>
            <p className="text-sm text-gray-400">{completedCount} anime</p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-lg p-4 rounded-lg border border-gray-700/50 sm:col-span-2 md:col-span-1">
            <h3 className="font-semibold text-white">Favorites</h3>
            <p className="text-sm text-gray-400">{favoritesCount} anime</p>
          </div>
        </div>
      </div>
    </div>
  );
};
