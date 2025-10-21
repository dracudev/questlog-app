import { useEffect } from 'react';
import type { ReviewResponse } from '@questlog/shared-types';

// Components
import ReviewHeader from './ReviewHeader';
import ReviewContent from './ReviewContent';
import ReviewActions from './ReviewActions';

// Stores
import { setReviewDetail } from '@/stores/reviews';

// ============================================================================
// Props Interface
// ============================================================================

interface ReviewDetailPageProps {
  review: ReviewResponse;
}

// ============================================================================
// ReviewDetailPage Component
// ============================================================================

/**
 * Review detail page component (React Island)
 *
 * Main container for displaying full review details.
 * Hydrated by Astro with server-rendered review data.
 *
 * @example
 * ```tsx
 * <ReviewDetailPage review={reviewData} client:load />
 * ```
 */
export default function ReviewDetailPage({ review }: ReviewDetailPageProps) {
  // ============================================================================
  // Initialization Effect
  // ============================================================================

  useEffect(() => {
    // Hydrate global store with server-rendered data
    setReviewDetail(review, review.id);
  }, [review]);

  // ============================================================================
  // Render
  // ============================================================================

  return (
    <div className="min-h-screen bg-primary">
      {/* Main Container - Mobile-First Responsive */}
      <div className="container mx-auto px-4 py-6 md:py-8 lg:py-12 max-w-4xl">
        {/* Review Header - Game, User, Rating */}
        <ReviewHeader review={review} />

        {/* Review Content - Title & Body */}
        <div className="mt-6 md:mt-8">
          <ReviewContent review={review} />
        </div>

        {/* Review Actions - Like, Comment, Share */}
        <div className="mt-6 md:mt-8 pt-6 border-t border-tertiary">
          <ReviewActions review={review} />
        </div>
      </div>
    </div>
  );
}
