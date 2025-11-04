import { useState } from 'react';
import * as Select from '@radix-ui/react-select';
import { Check, ChevronDown } from 'lucide-react';
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
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-card rounded-lg border border-border p-4">
      {/* Filter Label */}
      <div className="flex items-center gap-2">
        <svg
          className="w-5 h-5 text-muted-foreground"
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
        <span className="text-sm font-medium text-foreground">Sort By</span>
      </div>

      {/* Sort Dropdown */}
      <div className="w-full sm:w-auto">
        <Select.Root value={selectedSort} onValueChange={handleSortChange} disabled={isLoading}>
          <Select.Trigger className="w-full sm:w-auto flex items-center justify-between rounded-lg border border-border bg-background px-4 py-2 text-sm hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            <Select.Value />
            <Select.Icon>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Select.Icon>
          </Select.Trigger>

          <Select.Portal>
            <Select.Content className="z-[60] rounded-lg border border-border bg-card shadow-lg">
              <Select.Viewport className="p-1">
                {SORT_OPTIONS.map((option) => (
                  <Select.Item
                    key={option.value}
                    value={option.value}
                    className="relative flex items-center rounded px-8 py-2 text-sm hover:bg-accent focus:bg-accent outline-none cursor-pointer"
                  >
                    <Select.ItemText>{option.label}</Select.ItemText>
                    <Select.ItemIndicator className="absolute left-2">
                      <Check className="h-4 w-4" />
                    </Select.ItemIndicator>
                  </Select.Item>
                ))}
              </Select.Viewport>
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      </div>
    </div>
  );
}
