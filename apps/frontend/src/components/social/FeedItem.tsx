import type { ActivityItem } from '@questlog/shared-types';
import * as Avatar from '@radix-ui/react-avatar';
import { Star } from 'lucide-react';

interface FeedItemProps {
  activity: ActivityItem;
}

export default function FeedItem({ activity }: FeedItemProps) {
  const { type, user, createdAt } = activity;

  // Normalize createdAt to a string for formatting helper
  const createdAtStr =
    typeof createdAt === 'string' ? createdAt : createdAt ? new Date(createdAt).toISOString() : '';

  // Format relative timestamp
  const formatTimestamp = (date: string) => {
    const now = new Date();
    const past = new Date(date);
    const diffMs = now.getTime() - past.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return past.toLocaleDateString();
  };

  // Render stars for ratings
  const renderRating = (rating: number) => {
    const stars = Math.round(rating / 2); // Convert 0-10 to 0-5 stars
    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={16}
            fill={i < stars ? 'var(--brand-accent)' : 'none'}
            stroke={i < stars ? 'var(--brand-accent)' : 'var(--text-muted)'}
            strokeWidth={1.5}
          />
        ))}
      </div>
    );
  };

  // Render content based on activity type
  const renderActivityContent = () => {
    const activityType = String(type);

    switch (activityType) {
      case 'REVIEW_CREATED':
      case 'REVIEW_UPDATED': {
        const review = activity.review;
        if (!review?.game) return null;

        const snippet = review.content
          ? review.content.slice(0, 150) + (review.content.length > 150 ? '...' : '')
          : '';

        return (
          <div className="flex gap-4">
            {/* Game Cover */}
            {review.game?.coverImage && (
              <a href={`/games/${review.game?.slug}`} className="flex-shrink-0">
                <img
                  src={review.game?.coverImage}
                  alt={review.game?.title}
                  className="w-20 h-28 object-cover rounded"
                  style={{ borderRadius: 'var(--radius-sm)' }}
                />
              </a>
            )}

            {/* Review Content */}
            <div className="flex-1 min-w-0">
              <div className="mb-2">
                <a
                  href={`/games/${review.game?.slug}`}
                  className="font-semibold hover:underline"
                  style={{
                    color: 'var(--brand-primary)',
                    fontSize: 'var(--font-size-lg)',
                  }}
                >
                  {review.game?.title}
                </a>
              </div>

              {/* Rating */}
              {review.rating !== null && review.rating !== undefined && (
                <div className="mb-2">{renderRating(review.rating)}</div>
              )}

              {/* Review snippet */}
              {snippet && (
                <p
                  className="mb-2"
                  style={{
                    color: 'var(--text-secondary)',
                    fontSize: 'var(--font-size-base)',
                  }}
                >
                  {snippet}
                </p>
              )}

              {/* Read more link */}
              <a
                href={`/reviews/${review.id}`}
                className="font-medium hover:underline inline-flex items-center gap-1"
                style={{ color: 'var(--brand-primary)', fontSize: 'var(--font-size-sm)' }}
              >
                Read full review
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </a>
            </div>
          </div>
        );
      }

      case 'USER_FOLLOWED':
      case 'follow': {
        const followedUser = activity.followedUser;
        if (!followedUser) return null;

        return (
          <div className="flex items-center gap-4">
            {/* Followed User Avatar */}
            <a href={`/profile/${followedUser.username}`}>
              <Avatar.Root className="inline-flex items-center justify-center overflow-hidden rounded-full w-12 h-12">
                <Avatar.Image
                  src={followedUser.avatar ?? undefined}
                  alt={followedUser.username}
                  className="w-full h-full object-cover"
                />
                <Avatar.Fallback
                  className="flex items-center justify-center w-full h-full font-semibold"
                  style={{
                    background: 'var(--bg-tertiary)',
                    color: 'var(--text-primary)',
                    fontSize: 'var(--font-size-lg)',
                  }}
                >
                  {followedUser.username.slice(0, 2).toUpperCase()}
                </Avatar.Fallback>
              </Avatar.Root>
            </a>

            {/* Followed User Info */}
            <div className="flex-1">
              <p
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: 'var(--font-size-base)',
                }}
              >
                started following{' '}
                <a
                  href={`/profile/${followedUser.username}`}
                  className="font-semibold hover:underline"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {followedUser.displayName ?? followedUser.username}
                </a>
              </p>
            </div>
          </div>
        );
      }

      case 'review': {
        const review = activity.review;
        if (!review?.game) return null;

        const snippet = review.content
          ? review.content.slice(0, 150) + (review.content.length > 150 ? '...' : '')
          : '';

        return (
          <div className="flex gap-4">
            {/* Game Cover */}
            {review.game?.coverImage && (
              <a href={`/games/${review.game?.slug}`} className="flex-shrink-0">
                <img
                  src={review.game?.coverImage}
                  alt={review.game?.title}
                  className="w-20 h-28 object-cover rounded"
                  style={{ borderRadius: 'var(--radius-sm)' }}
                />
              </a>
            )}

            {/* Review Content */}
            <div className="flex-1 min-w-0">
              <div className="mb-2">
                <a
                  href={`/games/${review.game?.slug}`}
                  className="font-semibold hover:underline"
                  style={{
                    color: 'var(--brand-primary)',
                    fontSize: 'var(--font-size-lg)',
                  }}
                >
                  {review.game?.title}
                </a>
              </div>

              {/* Rating */}
              {review.rating !== null && review.rating !== undefined && (
                <div className="mb-2">{renderRating(review.rating)}</div>
              )}

              {/* Review snippet */}
              {snippet && (
                <p
                  className="mb-2"
                  style={{
                    color: 'var(--text-secondary)',
                    fontSize: 'var(--font-size-base)',
                  }}
                >
                  {snippet}
                </p>
              )}

              {/* Read more link */}
              <a
                href={`/reviews/${review.id}`}
                className="font-medium hover:underline inline-flex items-center gap-1"
                style={{ color: 'var(--brand-primary)', fontSize: 'var(--font-size-sm)' }}
              >
                Read full review
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </a>
            </div>
          </div>
        );
      }

      // Placeholder for future activity types
      default:
        return (
          <p
            style={{
              color: 'var(--text-secondary)',
              fontSize: 'var(--font-size-base)',
            }}
          >
            Activity type not yet implemented
          </p>
        );
    }
  };

  return (
    <article
      className="rounded-lg p-6 transition-shadow hover:shadow-md"
      style={{
        background: 'var(--bg-secondary)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      {/* Activity Header */}
      <div className="flex items-start gap-4 mb-4">
        {/* User Avatar */}
        <a href={`/profile/${user.username}`} className="flex-shrink-0">
          <Avatar.Root className="inline-flex items-center justify-center overflow-hidden rounded-full w-10 h-10">
            <Avatar.Image
              src={user.avatar || undefined}
              alt={user.username}
              className="w-full h-full object-cover"
            />
            <Avatar.Fallback
              className="flex items-center justify-center w-full h-full font-semibold"
              style={{
                background: 'var(--bg-tertiary)',
                color: 'var(--text-primary)',
                fontSize: 'var(--font-size-base)',
              }}
            >
              {user.username.slice(0, 2).toUpperCase()}
            </Avatar.Fallback>
          </Avatar.Root>
        </a>

        {/* User Info & Timestamp */}
        <div className="flex-1 min-w-0">
          <a
            href={`/profile/${user.username}`}
            className="font-semibold hover:underline"
            style={{
              color: 'var(--text-primary)',
              fontSize: 'var(--font-size-base)',
            }}
          >
            {user.displayName || user.username}
          </a>
          <p
            style={{
              color: 'var(--text-muted)',
              fontSize: 'var(--font-size-sm)',
            }}
          >
            {formatTimestamp(createdAtStr)}
          </p>
        </div>
      </div>

      {/* Activity Content */}
      {renderActivityContent()}
    </article>
  );
}
