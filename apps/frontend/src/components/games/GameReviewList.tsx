import { useEffect, useRef, useCallback } from 'react';
import { useGameReviews } from '@/hooks/useReviews';
import ReviewCard from '@/components/reviews/ReviewCard';

interface GameReviewListProps {
  gameId: string;
}

export default function GameReviewList({ gameId }: GameReviewListProps) {
  const { reviews, isLoading, fetchGameReviews } = useGameReviews();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && !isLoading) {
        // Load next page if available
        const currentPage = reviews?.meta.page ?? 1;
        const totalPages = reviews?.meta.totalPages ?? 1;
        const limit = reviews?.meta.limit ?? 10;

        if (currentPage < totalPages) {
          fetchGameReviews(gameId, { page: currentPage + 1, limit });
        }
      }
    },
    [isLoading, fetchGameReviews, reviews, gameId],
  );

  useEffect(() => {
    const element = loadMoreRef.current;
    if (!element) return;

    observerRef.current = new IntersectionObserver(handleObserver, {
      threshold: 0.1,
    });

    observerRef.current.observe(element);

    return () => {
      if (observerRef.current && element) {
        observerRef.current.unobserve(element);
      }
    };
  }, [handleObserver]);

  if (isLoading && (!reviews || reviews.items.length === 0)) {
    return <ReviewListSkeleton />;
  }
  if (!reviews || reviews.items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-text-secondary text-lg">
          No reviews yet. Be the first to review this game!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.items.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}

      {/* Infinite Scroll Trigger */}
      <div ref={loadMoreRef} className="h-20 flex items-center justify-center">
        {isLoading && (reviews?.meta.page ?? 1) < (reviews?.meta.totalPages ?? 1) && (
          <div className="flex items-center gap-2 text-text-secondary">
            <div className="w-5 h-5 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
            <span>Loading more reviews...</span>
          </div>
        )}
      </div>
    </div>
  );
}

function ReviewListSkeleton() {
  return (
    <div className="space-y-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-bg-secondary rounded-lg p-6 animate-pulse">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 bg-bg-tertiary rounded-full" />
            <div className="flex-1">
              <div className="h-5 bg-bg-tertiary rounded w-1/4 mb-2" />
              <div className="h-4 bg-bg-tertiary rounded w-1/6" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-bg-tertiary rounded w-full" />
            <div className="h-4 bg-bg-tertiary rounded w-5/6" />
            <div className="h-4 bg-bg-tertiary rounded w-4/6" />
          </div>
        </div>
      ))}
    </div>
  );
}
