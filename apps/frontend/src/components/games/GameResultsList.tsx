import { useEffect, useRef, useCallback } from 'react';
import { useStore } from '@nanostores/react';
import { useGames } from '@/hooks/useGames';
import { $selectedFilters, clearFilters } from '@/stores/explore';
import GameCard from './GameCard.tsx';
import { Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { GameResponse } from '@questlog/shared-types';

export default function GameResultsList() {
  const selectedFilters = useStore($selectedFilters);
  const { data, isLoading, error, fetchGames, loadMoreGames } = useGames();

  const observerTarget = useRef<HTMLDivElement>(null);
  const isLoadingMore = useRef(false);

  // Fetch games when filters change
  useEffect(() => {
    fetchGames(selectedFilters);
  }, [selectedFilters, fetchGames]);

  // Infinite scroll implementation
  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;

      if (entry.isIntersecting && data?.hasNextPage && !isLoading && !isLoadingMore.current) {
        isLoadingMore.current = true;
        loadMoreGames(selectedFilters).finally(() => {
          isLoadingMore.current = false;
        });
      }
    },
    [data?.hasNextPage, isLoading, loadMoreGames, selectedFilters],
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      root: null,
      rootMargin: '200px', // Start loading 200px before reaching the bottom
      threshold: 0.1,
    });

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [handleIntersection]);

  // Loading state (initial load)
  if (isLoading && !data?.data.length) {
    return (
      <div>
        <ResultsHeader isLoading />
        <GameGridSkeleton />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-8 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
        <h3 className="text-lg font-semibold text-destructive mb-2">Failed to Load Games</h3>
        <p className="text-sm text-muted-foreground mb-4">{error}</p>
        <Button onClick={() => fetchGames(selectedFilters)} size="sm">
          Try Again
        </Button>
      </div>
    );
  }

  // Empty state
  if (!data?.data.length) {
    return (
      <div className="rounded-lg border border-border bg-muted/50 p-12 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <AlertCircle className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No Games Found</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Try adjusting your filters or search terms
        </p>
        <Button
          onClick={() => {
            clearFilters();
            setTimeout(() => {
              fetchGames($selectedFilters.get()).catch(() => {
                fetchGames().catch(() => {});
              });
            }, 0);
          }}
          size="sm"
        >
          Clear All Filters
        </Button>
      </div>
    );
  }

  return (
    <div>
      <ResultsHeader total={data.total} page={data.page} totalPages={data.totalPages} />

      {/* Game Grid  */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {data.data.map((game: GameResponse) => (
          <GameCard key={game.game.id} game={game} />
        ))}
      </div>

      {/* Infinite Scroll Trigger & Loading Indicator */}
      <div ref={observerTarget} className="mt-8 flex justify-center">
        {data.hasNextPage && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Loading more games...</span>
          </div>
        )}
      </div>

      {/* End of results message */}
      {!data.hasNextPage && data.data.length > 0 && (
        <div className="mt-8 text-center text-sm text-muted">
          You've reached the end of the results
        </div>
      )}
    </div>
  );
}

// Results Header Component
function ResultsHeader({
  total,
  page,
  totalPages,
  isLoading = false,
}: {
  total?: number;
  page?: number;
  totalPages?: number;
  isLoading?: boolean;
}) {
  if (isLoading) {
    return (
      <div className="mb-6 animate-pulse">
        <div className="h-6 w-48 bg-muted rounded" />
      </div>
    );
  }

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
      <p className="text-sm text-muted-foreground">
        {total !== undefined && (
          <>
            Showing <span className="font-semibold text-foreground">{total}</span>{' '}
            {total === 1 ? 'game' : 'games'}
            {page && totalPages && (
              <span className="ml-2">
                • Page {page} of {totalPages}
              </span>
            )}
          </>
        )}
      </p>

      {/* Optional: Quick pagination */}
      {totalPages && totalPages > 1 && (
        <div className="flex items-center gap-2">
          <Button
            onClick={() => {
              const { setPage, $selectedFilters } = require('@/stores/explore');
              const current = $selectedFilters.get();
              if (current.page > 1) {
                setPage(current.page - 1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            disabled={page === 1}
            size="sm"
            variant="outline"
          >
            Previous
          </Button>
          <span className="text-xs text-muted-foreground">
            {page} / {totalPages}
          </span>
          <Button
            onClick={() => {
              const { setPage, $selectedFilters } = require('@/stores/explore');
              const current = $selectedFilters.get();
              if (current.page < totalPages) {
                setPage(current.page + 1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            disabled={page === totalPages}
            size="sm"
            variant="outline"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}

// Loading Skeleton
function GameGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-[3/4] rounded-lg bg-muted mb-3" />
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded w-3/4" />
            <div className="h-3 bg-muted rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}
