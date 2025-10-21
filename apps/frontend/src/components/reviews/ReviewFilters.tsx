import { useState } from 'react';
import { useReviews } from '@/hooks/useReviews';

// ============================================================================
// Types
// ============================================================================

type SortOption = {
  value: string;
  label: string;
  sortBy: 'createdAt' | 'rating' | 'likesCount';
  sortOrder: 'asc' | 'desc';
};

const SORT_OPTIONS: SortOption[] = [
  {
    value: 'recent',
    label: 'Most Recent',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  },
  {
    value: 'popular',
    label: 'Most Popular',
    sortBy: 'likesCount',
    sortOrder: 'desc',
  },
  {
    value: 'highest-rated',
    label: 'Highest Rated',
    sortBy: 'rating',
    sortOrder: 'desc',
  },
  {
    value: 'lowest-rated',
    label: 'Lowest Rated',
    sortBy: 'rating',
    sortOrder: 'asc',
  },
];

// ============================================================================
// ReviewFilters Component
// ============================================================================

/**
 * Filter controls for reviews list
 *
 * Provides sort dropdown to filter reviews by different criteria.
 * Uses useReviews hook to fetch data with new query params.
 *
 * @example
 * ```tsx
 * <ReviewFilters />
 * ```
 */
export default function ReviewFilters() {
  const { fetchReviews, isLoading } = useReviews();
  const [selectedSort, setSelectedSort] = useState<string>('recent');

  // ============================================================================
  // Event Handlers
  // ============================================================================

  const handleSortChange = async (value: string) => {
    setSelectedSort(value);

    const sortOption = SORT_OPTIONS.find((opt) => opt.value === value);
    if (!sortOption) return;

    // Fetch reviews with new sort parameters
    await fetchReviews({
      page: 1,
      limit: 20,
      sortBy: sortOption.sortBy,
      sortOrder: sortOption.sortOrder,
    });
  };

  // ============================================================================
  // Render
  // ============================================================================

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-secondary rounded-lg border border-tertiary p-4">
      {/* Filter Label */}
      <div className="flex items-center gap-2">
        <svg
          className="w-5 h-5 text-muted"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
          />
        </svg>
        <span className="text-sm font-medium text-secondary">Sort By</span>
      </div>

      {/* Sort Dropdown */}
      <div className="w-full sm:w-auto">
        <select
          value={selectedSort}
          onChange={(e) => handleSortChange(e.target.value)}
          disabled={isLoading}
          className="w-full sm:w-auto px-4 py-2 bg-primary border border-tertiary rounded-md text-sm text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
