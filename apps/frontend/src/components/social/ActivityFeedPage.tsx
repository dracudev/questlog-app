import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useActivityFeed } from '@/hooks/useSocial';
import ActivityFeedList from './ActivityFeedList';
import FeedItemSkeleton from './FeedItemSkeleton';
import { Button } from '@/components/ui/Button';

export default function ActivityFeedPage() {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { fetchFeed, feed, isLoading: isFeedLoading, error: feedError } = useActivityFeed();
  useEffect(() => {
    if (isAuthenticated && !feed && !isFeedLoading) {
      fetchFeed({ page: 1, limit: 15 }).catch((err) => {
        console.error('Error fetching initial feed:', err);
      });
    }
  }, [isAuthenticated, fetchFeed, feed, isFeedLoading]);
  // If auth is loading, show the skeleton
  if (isAuthLoading) {
    return (
      <div className="container mx-auto px-4 py-6 lg:py-8">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold mb-6 text-primary">Your Feed</h1>
          <FeedItemSkeleton />
        </div>
      </div>
    );
  }

  // If auth is loaded but user is NOT authenticated, show a prompt to log in
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-6 lg:py-8 text-center">
        <h1 className="text-3xl font-bold mb-6 text-primary">Your Feed</h1>
        <p className="text-text-secondary">
          Please{' '}
          <a href="/auth/login?redirect=/feed" className="text-brand-primary underline">
            log in
          </a>{' '}
          to view your feed.
        </p>
      </div>
    );
  }

  // From here we know the user IS authenticated. Show loading skeleton ONLY if we are fetching the feed and have no data yet.
  if (isFeedLoading && !feed) {
    return (
      <div className="container mx-auto px-4 py-6 lg:py-8">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold mb-6 text-primary">Your Feed</h1>
          <FeedItemSkeleton />
        </div>
      </div>
    );
  }

  // Render error state if feed fetch failed
  if (feedError) {
    return (
      <div className="container mx-auto px-4 py-6 lg:py-8">
        <h1 className="text-3xl font-bold mb-6 text-primary">Your Feed</h1>
        <div className="text-center py-10 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-destructive font-semibold">Failed to Load Feed</p>
          <p className="text-sm text-destructive/80 mt-1">{feedError}</p>
          <Button
            onClick={() => fetchFeed({ page: 1, limit: 15 })}
            variant="primary"
            size="sm"
            className="mt-4"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // Render the actual feed list
  return (
    <div className="container mx-auto px-4 py-6 lg:py-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold mb-6 text-primary">Your Feed</h1>
        {/* ActivityFeedList will render the empty state if feed.items is empty */}
        <ActivityFeedList />
      </div>
    </div>
  );
}
