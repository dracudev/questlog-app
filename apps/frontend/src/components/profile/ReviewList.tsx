import { useUserReviews } from '@/hooks/useReviews';
import { useEffect, useRef, useCallback } from 'react';
import type { ReviewResponse } from '@questlog/shared-types';

// ============================================================================
// Props Interface
// ============================================================================

interface ReviewListProps {
  userId: string;
}

// ============================================================================
// ReviewList Component
// ============================================================================

/**
 * Infinite scroll list of user reviews
 *
 * @example
 * ```tsx
 * <ReviewList userId="user-123" />
 * ```
 */
export default function ReviewList({ userId }: ReviewListProps) {
  const { reviews, isLoading, error, fetchUserReviews, fetchMoreUserReviews } = useUserReviews();
  const observerTarget = useRef<HTMLDivElement>(null);
  const currentPage = useRef(1);
  const hasMore = useRef(true);
  const lastUserId = useRef<string | null>(null);

  // Initial fetch - only when userId changes
  useEffect(() => {
    if (lastUserId.current !== userId) {
      currentPage.current = 1;
      hasMore.current = true;
      fetchUserReviews(userId, { page: 1, limit: 10 });
      lastUserId.current = userId;
    }
  }, [userId, fetchUserReviews]);

  // Infinite scroll callback
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && !isLoading && hasMore.current) {
        const nextPage = currentPage.current + 1;
        currentPage.current = nextPage;

        fetchMoreUserReviews(userId, { page: nextPage, limit: 10 }).then((response) => {
          // If we received fewer results than the limit, we've reached the end
          if (response && response.items.length < 10) {
            hasMore.current = false;
          }
        });
      }
    },
    [userId, isLoading, fetchMoreUserReviews],
  );

  // Set up IntersectionObserver
  useEffect(() => {
    const element = observerTarget.current;
    if (!element) return;

    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '100px',
      threshold: 0.1,
    });

    observer.observe(element);

    return () => observer.disconnect();
  }, [handleObserver]);

  // Get reviews items safely
  const reviewItems = reviews?.items || [];

  // Loading state
  if (isLoading && reviewItems.length === 0) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <ReviewSkeleton key={i} />
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-error mb-2">Failed to load reviews</p>
        <p className="text-muted text-sm">{error}</p>
      </div>
    );
  }

  // Empty state
  if (reviewItems.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          className="w-16 h-16 mx-auto text-muted mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
        <p className="text-primary font-semibold mb-1">No reviews yet</p>
        <p className="text-muted text-sm">This user hasn't reviewed any games</p>
      </div>
    );
  }

  // Review list
  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {reviewItems.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>

      {/* Infinite scroll trigger */}
      {hasMore.current && <div ref={observerTarget} className="h-10" />}

      {/* Loading more indicator */}
      {isLoading && reviewItems.length > 0 && (
        <div className="flex justify-center py-4">
          <svg
            className="animate-spin h-6 w-6 text-brand-primary"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      )}

      {/* End of list indicator */}
      {!hasMore.current && reviewItems.length > 0 && (
        <p className="text-center text-muted text-sm py-4">You've reached the end</p>
      )}
    </>
  );
}

// ============================================================================
// ReviewCard Component
// ============================================================================

interface ReviewCardProps {
  review: ReviewResponse;
}

function ReviewCard({ review }: ReviewCardProps) {
  const maxLength = 200;
  const truncatedContent =
    review.content.length > maxLength ? review.content.slice(0, maxLength) + '...' : review.content;

  return (
    <a
      href={`/reviews/${review.id}`}
      className="block bg-secondary rounded-lg border border-tertiary p-4 hover:border-brand-primary transition-colors"
    >
      <div className="flex gap-4">
        {/* Game Cover */}
        <img
          src={review.game.coverImage || '/images/game-placeholder.svg'}
          alt={review.game.title}
          className="w-20 h-28 object-cover rounded"
        />

        {/* Review Content */}
        <div className="flex-1">
          <h3 className="font-semibold text-primary mb-1">{review.game.title}</h3>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={`w-4 h-4 ${
                    star <= review.rating ? 'text-brand-primary' : 'text-tertiary'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-sm text-muted">
              {new Date(review.createdAt).toLocaleDateString()}
            </span>
          </div>

          {/* Review Text */}
          <p className="text-secondary text-sm whitespace-pre-wrap">{truncatedContent}</p>

          {/* Stats */}
          <div className="flex gap-4 mt-2 text-xs text-muted">
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
              </svg>
              {review.stats.likesCount}
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                  clipRule="evenodd"
                />
              </svg>
              {review.stats.commentsCount}
            </span>
          </div>
        </div>
      </div>
    </a>
  );
}

// ============================================================================
// ReviewSkeleton Component
// ============================================================================

function ReviewSkeleton() {
  return (
    <div className="bg-secondary rounded-lg border border-tertiary p-4 animate-pulse">
      <div className="flex gap-4">
        {/* Cover skeleton */}
        <div className="w-20 h-28 bg-tertiary rounded" />

        {/* Content skeleton */}
        <div className="flex-1 space-y-2">
          <div className="h-5 bg-tertiary rounded w-2/3" />
          <div className="h-4 bg-tertiary rounded w-1/3" />
          <div className="space-y-1 pt-1">
            <div className="h-3 bg-tertiary rounded w-full" />
            <div className="h-3 bg-tertiary rounded w-full" />
            <div className="h-3 bg-tertiary rounded w-3/4" />
          </div>
          <div className="flex gap-4 pt-1">
            <div className="h-3 bg-tertiary rounded w-12" />
            <div className="h-3 bg-tertiary rounded w-12" />
          </div>
        </div>
      </div>
    </div>
  );
}
