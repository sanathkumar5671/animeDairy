import { useEffect, useState } from "react";
import { fetchTrendingAnime } from "@/lib/queries/anime";
import { Pagination } from "@/components/Pagination";
import { AnimeCard } from "@/components/AnimeCard";
import type { AnimeData } from "@/lib/types/anime";

const ITEMS_PER_PAGE = 12;

export const TrendingAnime = () => {
  const [animeList, setAnimeList] = useState<AnimeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const loadTrendingAnime = async () => {
      try {
        setLoading(true);
        const response = await fetchTrendingAnime(currentPage, ITEMS_PER_PAGE);
        setAnimeList(response.data.Page.media);
        // Assuming the API returns total count, adjust this based on your API response
        setTotalPages(
          Math.ceil(response.data.Page.pageInfo.total / ITEMS_PER_PAGE)
        );
        setLoading(false);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load trending anime"
        );
        setLoading(false);
      }
    };

    loadTrendingAnime();
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of the anime list when changing pages
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-white/80 py-8">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {animeList.map((anime) => (
          <AnimeCard key={anime.id} anime={anime} />
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};
