import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useActivityFeed } from '@/hooks/useSocial';
import ActivityFeedList from './ActivityFeedList';
import FeedItemSkeleton from './FeedItemSkeleton';

export default function ActivityFeedPage() {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { fetchFeed, feed, isLoading: isFeedLoading, error: feedError } = useActivityFeed();

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      // If auth is loaded and user is NOT authenticated, redirect
      window.location.href = '/auth/login?redirect=/feed';
    }
  }, [isAuthenticated, isAuthLoading]);

  useEffect(() => {
    if (isAuthenticated && !feed && !isFeedLoading) {
      fetchFeed({ page: 1, limit: 15 }).catch((err) => {
        console.error('Error fetching initial feed:', err);
      });
    }
  }, [isAuthenticated, fetchFeed, feed, isFeedLoading]);

  if (isAuthLoading || (isAuthenticated && isFeedLoading && !feed)) {
    return (
      <div className="container mx-auto px-4 py-6 lg:py-8">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold mb-6 text-primary">Your Feed</h1>
          <FeedItemSkeleton />
        </div>
      </div>
    );
  }

  // If not authenticated, render nothing (the effect will redirect)
  if (!isAuthenticated) {
    return null;
  }

  // Render error state if feed fetch failed
  if (feedError) {
    return (
      <div className="container mx-auto px-4 py-6 lg:py-8">
        <h1 className="text-3xl font-bold mb-6 text-primary">Your Feed</h1>
        <div className="text-center py-10 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-destructive font-semibold">Failed to Load Feed</p>
          <p className="text-sm text-destructive/80 mt-1">{feedError}</p>
          <button
            onClick={() => fetchFeed({ page: 1, limit: 15 })}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 text-sm"
          >
            Try Again
          </button>
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
