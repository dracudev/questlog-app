import { useEffect, useRef, useCallback } from 'react';
import { useActivityFeed } from '@/hooks/useSocial';
import FeedItem from './FeedItem';
import FeedItemSkeleton from './FeedItemSkeleton';
import { Button } from '@/components/ui/Button';

interface ActivityFeedListProps {
  initialError?: string | null;
}

export default function ActivityFeedList({ initialError }: ActivityFeedListProps) {
  const { feed, isLoading, error, loadMoreFeed } = useActivityFeed();
  const observerTarget = useRef<HTMLDivElement>(null);

  // Intersection Observer for infinite scroll
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && feed?.meta?.hasNext && !isLoading) {
        loadMoreFeed();
      }
    },
    [feed?.meta?.hasNext, isLoading, loadMoreFeed],
  );

  useEffect(() => {
    const element = observerTarget.current;
    if (!element) return;

    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '100px', // Start loading before user reaches the bottom
      threshold: 0.1,
    });

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [handleObserver]);

  // Show error state
  if (error || initialError) {
    return (
      <div
        className="rounded-lg p-8 text-center"
        style={{
          background: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-lg)',
        }}
      >
        <div className="mb-4">
          <svg
            className="mx-auto h-12 w-12"
            style={{ color: 'var(--state-error)' }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3
          className="font-semibold mb-2"
          style={{
            fontSize: 'var(--font-size-xl)',
            color: 'var(--text-primary)',
          }}
        >
          Failed to Load Feed
        </h3>
        <p
          className="mb-4"
          style={{
            fontSize: 'var(--font-size-base)',
            color: 'var(--text-secondary)',
          }}
        >
          {error || initialError || 'An unexpected error occurred'}
        </p>
        <Button variant="primary" size="sm" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  // Show loading skeleton on initial load
  if (isLoading && !feed) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <FeedItemSkeleton key={i} />
        ))}
      </div>
    );
  }

  // Show empty state
  if (!feed || feed.items.length === 0) {
    return (
      <div
        className="rounded-lg p-12 text-center"
        style={{
          background: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-lg)',
        }}
      >
        <div className="mb-4">
          <svg
            className="mx-auto h-16 w-16"
            style={{ color: 'var(--text-muted)' }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
        </div>
        <h3
          className="font-semibold mb-2"
          style={{
            fontSize: 'var(--font-size-xl)',
            color: 'var(--text-primary)',
          }}
        >
          Your Feed is Empty
        </h3>
        <p
          className="mb-6 max-w-md mx-auto"
          style={{
            fontSize: 'var(--font-size-base)',
            color: 'var(--text-secondary)',
          }}
        >
          Start following other gamers to see their reviews and activities here.
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="/games"
            className="px-6 py-2 rounded-md font-medium transition-colors"
            style={{
              background: 'var(--brand-primary)',
              color: 'var(--text-primary)',
              borderRadius: 'var(--radius-md)',
              fontSize: 'var(--font-size-base)',
            }}
          >
            Explore Games
          </a>
          <a
            href="/users"
            className="px-6 py-2 rounded-md font-medium transition-colors border"
            style={{
              borderColor: 'var(--bg-tertiary)',
              color: 'var(--text-primary)',
              borderRadius: 'var(--radius-md)',
              fontSize: 'var(--font-size-base)',
            }}
          >
            Find Users
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Feed Items */}
      {feed.items.map((activity) => (
        <FeedItem key={activity.id} activity={activity} />
      ))}

      {/* Loading more indicator */}
      {isLoading && feed?.meta?.hasNext && (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <FeedItemSkeleton key={`loading-${i}`} />
          ))}
        </div>
      )}

      {/* Intersection observer target */}
      <div ref={observerTarget} className="h-4" />

      {/* End of feed indicator */}
      {!feed.meta.hasNext && feed.items.length > 0 && (
        <div className="text-center py-8">
          <p className="text-sm text-muted">You've reached the end of your feed</p>
        </div>
      )}
    </div>
  );
}
