import { useState } from 'react';
import type { ReviewResponse } from '@questlog/shared-types';
import * as Tooltip from '@radix-ui/react-tooltip';
import { Heart } from 'lucide-react';

// Hooks
import { useReviewActions } from '@/hooks/useReviews';
import { useStore } from '@nanostores/react';
import { $reviewDetail } from '@/stores/reviews';

// ============================================================================
// Props Interface
// ============================================================================

interface ReviewActionsProps {
  review: ReviewResponse;
}

// ============================================================================
// ReviewActions Component
// ============================================================================

/**
 * Review actions component with social interactions
 *
 * Provides like/unlike functionality with optimistic updates.
 * Uses Radix UI tooltips for accessibility.
 *
 * @example
 * ```tsx
 * <ReviewActions review={reviewData} />
 * ```
 */
export default function ReviewActions({ review: initialReview }: ReviewActionsProps) {
  // ============================================================================
  // State & Hooks
  // ============================================================================

  // Get current review from store (for optimistic updates)
  const currentReview = useStore($reviewDetail) || initialReview;

  // Review actions hook
  const { likeReview, unlikeReview, isLoading, error } = useReviewActions();

  // Local loading state for the like button
  const [isLiking, setIsLiking] = useState(false);

  // ============================================================================
  // Handlers
  // ============================================================================

  /**
   * Handle like/unlike toggle
   */
  const handleLikeToggle = async () => {
    if (isLiking) return;

    setIsLiking(true);

    try {
      if (currentReview.isLiked) {
        await unlikeReview(currentReview.id);
      } else {
        await likeReview(currentReview.id);
      }
    } catch (err) {
      console.error('Failed to toggle like:', err);
    } finally {
      setIsLiking(false);
    }
  };

  // ============================================================================
  // Render
  // ============================================================================

  return (
    <Tooltip.Provider delayDuration={300}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Social Stats */}
        <div className="flex items-center gap-6 text-sm text-muted">
          {/* Likes Count */}
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5" aria-hidden="true" />
            <span className="font-medium">
              {currentReview.stats.likesCount}{' '}
              {currentReview.stats.likesCount === 1 ? 'like' : 'likes'}
            </span>
          </div>

          {/* Comments Count */}
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-medium">
              {currentReview.stats.commentsCount}{' '}
              {currentReview.stats.commentsCount === 1 ? 'comment' : 'comments'}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Like Button with Tooltip */}
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <button
                onClick={handleLikeToggle}
                disabled={isLiking || isLoading}
                className={`
                  inline-flex items-center gap-2 px-4 py-2 rounded-lg
                  border transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2
                  disabled:opacity-50 disabled:cursor-not-allowed
                  ${
                    currentReview.isLiked
                      ? 'bg-brand-accent border-brand-accent text-white hover:bg-brand-accent/90'
                      : 'bg-transparent border-tertiary text-secondary hover:border-brand-accent hover:text-brand-accent'
                  }
                `}
                aria-label={currentReview.isLiked ? 'Unlike this review' : 'Like this review'}
                aria-pressed={currentReview.isLiked}
              >
                <Heart
                  className={`w-5 h-5 transition-transform ${isLiking ? 'scale-110' : ''}`}
                  fill={currentReview.isLiked ? 'currentColor' : 'none'}
                  aria-hidden="true"
                />
                <span className="font-medium">{currentReview.isLiked ? 'Liked' : 'Like'}</span>
              </button>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content
                className="bg-tertiary text-primary px-3 py-2 rounded-md text-sm font-medium shadow-lg z-tooltip"
                sideOffset={5}
              >
                {currentReview.isLiked ? 'Unlike this review' : 'Like this review'}
                <Tooltip.Arrow className="fill-tertiary" />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>

          {/* Share Button with Tooltip */}
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <button
                onClick={() => {
                  const url = window.location.href;
                  if (navigator.share) {
                    navigator
                      .share({
                        title: currentReview.title || `${currentReview.game.title} Review`,
                        text: `Check out this review of ${currentReview.game.title} by ${currentReview.user.displayName}`,
                        url,
                      })
                      .catch(() => {
                        // User cancelled or error - fallback to clipboard
                        navigator.clipboard.writeText(url);
                      });
                  } else {
                    // Fallback to clipboard
                    navigator.clipboard.writeText(url);
                  }
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg
                  bg-transparent border border-tertiary text-secondary
                  hover:border-brand-primary hover:text-brand-primary
                  transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2"
                aria-label="Share this review"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  />
                </svg>
                <span className="font-medium hidden sm:inline">Share</span>
              </button>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content
                className="bg-tertiary text-primary px-3 py-2 rounded-md text-sm font-medium shadow-lg z-tooltip"
                sideOffset={5}
              >
                Share this review
                <Tooltip.Arrow className="fill-tertiary" />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mt-4 p-3 bg-state-error/10 border border-state-error rounded-md">
          <div className="flex items-start gap-2">
            <svg
              className="w-5 h-5 text-state-error shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-sm text-state-error">{error}</p>
          </div>
        </div>
      )}
    </Tooltip.Provider>
  );
}
