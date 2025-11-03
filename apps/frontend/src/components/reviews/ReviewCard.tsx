import type { ReviewResponse } from '@questlog/shared-types';

// ============================================================================
// Props Interface
// ============================================================================

interface ReviewCardProps {
  review: ReviewResponse;
}

// ============================================================================
// ReviewCard Component
// ============================================================================

/**
 * Individual review card component
 *
 * Displays a review with game cover, user info, rating, and content preview.
 * All elements are clickable links to their respective pages.
 *
 * @example
 * ```tsx
 * <ReviewCard review={reviewData} />
 * ```
 */
export default function ReviewCard({ review }: ReviewCardProps) {
  // ============================================================================
  // Helpers
  // ============================================================================

  // Format date for display
  const formatDate = (date: Date) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Truncate content for preview
  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength).trim() + '...';
  };

  // Generate avatar URL (using DiceBear as fallback)
  const avatarUrl =
    review.user.avatar ||
    `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(review.user.username)}`;

  // Generate game cover URL
  const coverUrl = review.game.coverImage || '/images/game-placeholder.svg';

  // ============================================================================
  // Render
  // ============================================================================

  return (
    <article className="bg-secondary rounded-lg border border-tertiary overflow-hidden hover:border-primary transition-all duration-200 hover:shadow-lg group flex flex-col md:flex-row">
      {/* Game Cover Image */}
      <a
        href={`/games/${review.game.slug}`}
        className="block w-full md:w-36 flex-shrink-0 md:aspect-[3/4] h-48 md:h-auto relative overflow-hidden bg-tertiary"
      >
        <img
          src={coverUrl}
          alt={review.game.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          loading="lazy"
          onError={(e) => {
            try {
              (e.currentTarget as HTMLImageElement).src = '/images/game-placeholder.svg';
            } catch (_) {
              /* noop */
            }
          }}
        />
        {/* Spoiler Badge */}
        {review.isSpoiler && (
          <div className="absolute top-2 right-2 bg-state-warning text-primary px-2 py-1 rounded text-xs font-semibold">
            SPOILER
          </div>
        )}
      </a>

      {/* Card Content */}
      <div className="p-4 flex-1">
        {/* Game Title - Link to Game */}
        <a
          href={`/games/${review.game.slug}`}
          className="block mb-3 hover:text-primary transition-colors"
        >
          <h3 className="font-semibold text-primary line-clamp-2">{review.game.title}</h3>
        </a>

        {/* User Info - Link to Profile */}
        <a
          href={`/profile/${review.user.username}`}
          className="flex items-center gap-2 mb-3 hover:opacity-80 transition-opacity"
        >
          <img
            src={avatarUrl}
            alt={review.user.displayName}
            className="w-8 h-8 rounded-full border border-tertiary"
            loading="lazy"
          />
          <div className="flex flex-col min-w-0">
            <span className="text-sm text-secondary font-medium truncate">
              {review.user.displayName}
            </span>
            <span className="text-xs text-muted">@{review.user.username}</span>
          </div>
        </a>

        {/* Rating Stars */}
        <div className="flex items-center gap-1 mb-3">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => {
            const isFilled = star <= Math.round(review.rating);
            return (
              <svg
                key={star}
                className={`w-4 h-4 ${isFilled ? 'text-brand-accent' : 'text-tertiary'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            );
          })}
          <span className="ml-1 text-sm font-semibold text-brand-accent">
            {review.rating.toFixed(1)}
          </span>
        </div>

        {/* Review Title (if exists) */}
        {review.title && (
          <a
            href={`/reviews/${review.id}`}
            className="block mb-2 hover:text-primary transition-colors"
          >
            <h4 className="font-medium text-secondary line-clamp-1">{review.title}</h4>
          </a>
        )}

        {/* Content Preview - Link to Review */}
        <a
          href={`/reviews/${review.id}`}
          className="block mb-3 hover:text-primary transition-colors"
        >
          <p className="text-sm text-muted line-clamp-3">{truncateContent(review.content)}</p>
        </a>

        {/* Footer: Stats and Date */}
        <div className="flex items-center justify-between text-xs text-muted pt-3 border-t border-tertiary">
          {/* Stats */}
          <div className="flex items-center gap-3">
            {/* Likes */}
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{review.stats.likesCount}</span>
            </div>

            {/* Comments */}
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{review.stats.commentsCount}</span>
            </div>
          </div>

          {/* Date */}
          <time dateTime={new Date(review.createdAt).toISOString()}>
            {formatDate(review.createdAt)}
          </time>
        </div>
      </div>
    </article>
  );
}
