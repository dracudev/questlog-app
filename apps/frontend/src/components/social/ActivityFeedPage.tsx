import { useEffect } from 'react';
import type { ActivityFeedResponse } from '@questlog/shared-types';
import ActivityFeedList from './ActivityFeedList';
import { setActivityFeed } from '@/stores/social';

interface ActivityFeedPageProps {
  initialData: ActivityFeedResponse | null;
  initialError?: string | null;
}

export default function ActivityFeedPage({ initialData, initialError }: ActivityFeedPageProps) {
  // Hydrate the store with server-fetched data on mount
  useEffect(() => {
    if (initialData) {
      setActivityFeed(initialData);
    }
  }, [initialData]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Page Header */}
      <header className="mb-8">
        <h1 className="font-bold mb-2" style={{ fontSize: 'var(--font-size-h1)' }}>
          Your Feed
        </h1>
        <p className="text-secondary" style={{ fontSize: 'var(--font-size-base)' }}>
          Stay updated with gaming activities from people you follow
        </p>
      </header>

      {/* Feed Content */}
      <ActivityFeedList initialError={initialError} />
    </div>
  );
}
