import { useEffect, useState } from "react";
import Image from "next/image";
import { fetchTrendingAnime } from "@/lib/queries/anime";
import { Pagination } from "@/components/Pagination";

interface Anime {
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

const ITEMS_PER_PAGE = 12;

export const TrendingAnime = () => {
  const [animeList, setAnimeList] = useState<Anime[]>([]);
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
          <div
            key={anime.id}
            className="bg-white/10 backdrop-blur-lg rounded-lg overflow-hidden border border-white/20 hover:border-white/40 transition-all duration-300 group"
          >
            <div className="relative h-64">
              <Image
                src={anime.coverImage.large}
                alt={anime.title.english || anime.title.romaji}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                {anime.title.english || anime.title.romaji}
              </h3>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-white/80">
                  Score: {anime.averageScore / 10}
                </span>
                <span className="text-sm text-white/80">•</span>
                <span className="text-sm text-white/80">{anime.status}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {anime.genres.slice(0, 3).map((genre) => (
                  <span
                    key={genre}
                    className="text-xs px-2 py-1 bg-white/20 rounded-full text-white/90"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          </div>
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
