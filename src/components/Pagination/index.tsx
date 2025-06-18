import { useCallback } from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  const handlePageChange = useCallback(
    (page: number) => {
      if (page >= 1 && page <= totalPages) {
        onPageChange(page);
      }
    },
    [onPageChange, totalPages]
  );

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-4 py-2 rounded-lg transition-all duration-200 ${
            currentPage === i
              ? "bg-purple-600 text-white"
              : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/50"
          }`}
          aria-label={`Go to page ${i}`}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-4 py-2 rounded-lg transition-all duration-200 ${
          currentPage === 1
            ? "bg-gray-800/30 text-gray-500 cursor-not-allowed"
            : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/50"
        }`}
        aria-label="Previous page"
      >
        Previous
      </button>

      {renderPageNumbers()}

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-4 py-2 rounded-lg transition-all duration-200 ${
          currentPage === totalPages
            ? "bg-gray-800/30 text-gray-500 cursor-not-allowed"
            : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/50"
        }`}
        aria-label="Next page"
      >
        Next
      </button>
    </div>
  );
};
