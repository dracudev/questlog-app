import { atom } from 'nanostores';
import type { ReviewResponse, PaginatedReviewsResponse } from '@questlog/shared-types';

// ============================================================================
// Reviews List State
// ============================================================================

/**
 * Current reviews list data with pagination
 */
export const $reviewsData = atom<PaginatedReviewsResponse | null>(null);

/**
 * Reviews list loading state
 */
export const $reviewsLoading = atom<boolean>(false);

/**
 * Reviews list error state
 */
export const $reviewsError = atom<string | null>(null);

// ============================================================================
// Review Detail State
// ============================================================================

/**
 * Current review detail data
 */
export const $reviewDetail = atom<ReviewResponse | null>(null);

/**
 * Currently loaded review ID (for refetch purposes)
 */
export const $currentReviewId = atom<string | null>(null);

/**
 * Review detail loading state
 */
export const $reviewDetailLoading = atom<boolean>(false);

/**
 * Review detail error state
 */
export const $reviewDetailError = atom<string | null>(null);

// ============================================================================
// User's Reviews State
// ============================================================================

/**
 * Current user's reviews data
 */
export const $userReviews = atom<PaginatedReviewsResponse | null>(null);

/**
 * User reviews loading state
 */
export const $userReviewsLoading = atom<boolean>(false);

/**
 * Currently loaded user ID for reviews
 */
export const $currentUserReviewsId = atom<string | null>(null);

// ============================================================================
// Game Reviews State
// ============================================================================

/**
 * Current game's reviews data
 */
export const $gameReviews = atom<PaginatedReviewsResponse | null>(null);

/**
 * Game reviews loading state
 */
export const $gameReviewsLoading = atom<boolean>(false);

/**
 * Currently loaded game ID for reviews
 */
export const $currentGameReviewsId = atom<string | null>(null);

// ============================================================================
// Review Actions State (Create, Update, Delete)
// ============================================================================

/**
 * Review action loading state (create, update, delete)
 */
export const $reviewActionLoading = atom<boolean>(false);

/**
 * Review action error state
 */
export const $reviewActionError = atom<string | null>(null);

// ============================================================================
// Reviews List Actions
// ============================================================================

/**
 * Set reviews list data
 */
export function setReviewsData(data: PaginatedReviewsResponse) {
  $reviewsData.set(data);
}

/**
 * Set reviews loading state
 */
export function setReviewsLoading(loading: boolean) {
  $reviewsLoading.set(loading);
}

/**
 * Set reviews error state
 */
export function setReviewsError(error: string | null) {
  $reviewsError.set(error);
}

/**
 * Clear reviews list state
 */
export function clearReviewsState() {
  $reviewsData.set(null);
  $reviewsLoading.set(false);
  $reviewsError.set(null);
}

/**
 * Append reviews to existing list (for pagination/infinite scroll)
 */
export function appendReviewsData(newData: PaginatedReviewsResponse) {
  const currentData = $reviewsData.get();

  if (!currentData) {
    setReviewsData(newData);
    return;
  }

  // Merge the new reviews with existing ones
  const mergedData: PaginatedReviewsResponse = {
    ...newData,
    items: [...currentData.items, ...newData.items],
  };

  $reviewsData.set(mergedData);
}

// ============================================================================
// Review Detail Actions
// ============================================================================

/**
 * Set review detail data
 */
export function setReviewDetail(review: ReviewResponse, reviewId: string) {
  $reviewDetail.set(review);
  $currentReviewId.set(reviewId);
}

/**
 * Set review detail loading state
 */
export function setReviewDetailLoading(loading: boolean) {
  $reviewDetailLoading.set(loading);
}

/**
 * Set review detail error state
 */
export function setReviewDetailError(error: string | null) {
  $reviewDetailError.set(error);
}

/**
 * Clear review detail state
 */
export function clearReviewDetailState() {
  $reviewDetail.set(null);
  $currentReviewId.set(null);
  $reviewDetailLoading.set(false);
  $reviewDetailError.set(null);
}

/**
 * Update review detail data (for optimistic updates)
 */
export function updateReviewDetail(updates: Partial<ReviewResponse>) {
  const currentReview = $reviewDetail.get();
  if (currentReview) {
    const updatedReview = { ...currentReview, ...updates };
    $reviewDetail.set(updatedReview);
  }
}

// ============================================================================
// User Reviews Actions
// ============================================================================

/**
 * Set user reviews data
 */
export function setUserReviews(data: PaginatedReviewsResponse, userId: string) {
  $userReviews.set(data);
  $currentUserReviewsId.set(userId);
}

/**
 * Set user reviews loading state
 */
export function setUserReviewsLoading(loading: boolean) {
  $userReviewsLoading.set(loading);
}

/**
 * Clear user reviews state
 */
export function clearUserReviewsState() {
  $userReviews.set(null);
  $userReviewsLoading.set(false);
  $currentUserReviewsId.set(null);
}

// ============================================================================
// Game Reviews Actions
// ============================================================================

/**
 * Set game reviews data
 */
export function setGameReviews(data: PaginatedReviewsResponse, gameId: string) {
  $gameReviews.set(data);
  $currentGameReviewsId.set(gameId);
}

/**
 * Set game reviews loading state
 */
export function setGameReviewsLoading(loading: boolean) {
  $gameReviewsLoading.set(loading);
}

/**
 * Clear game reviews state
 */
export function clearGameReviewsState() {
  $gameReviews.set(null);
  $gameReviewsLoading.set(false);
  $currentGameReviewsId.set(null);
}

// ============================================================================
// Review Actions (CRUD) Actions
// ============================================================================

/**
 * Set review action loading state
 */
export function setReviewActionLoading(loading: boolean) {
  $reviewActionLoading.set(loading);
}

/**
 * Set review action error state
 */
export function setReviewActionError(error: string | null) {
  $reviewActionError.set(error);
}

/**
 * Clear review action state
 */
export function clearReviewActionState() {
  $reviewActionLoading.set(false);
  $reviewActionError.set(null);
}

// ============================================================================
// Global Actions
// ============================================================================

/**
 * Clear all reviews-related state
 */
export function clearAllReviewsState() {
  clearReviewsState();
  clearReviewDetailState();
  clearUserReviewsState();
  clearGameReviewsState();
  clearReviewActionState();
}

// ============================================================================
// Cache Management (Optional Enhancement)
// ============================================================================

/**
 * Cache for review details by ID to avoid refetching
 */
const reviewDetailCache = new Map<string, { review: ReviewResponse; timestamp: number }>();

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Get cached review detail if available and not expired
 */
export function getCachedReviewDetail(reviewId: string): ReviewResponse | null {
  const cached = reviewDetailCache.get(reviewId);

  if (!cached) return null;

  const isExpired = Date.now() - cached.timestamp > CACHE_DURATION;
  if (isExpired) {
    reviewDetailCache.delete(reviewId);
    return null;
  }

  return cached.review;
}

/**
 * Cache review detail data
 */
export function cacheReviewDetail(reviewId: string, review: ReviewResponse) {
  reviewDetailCache.set(reviewId, {
    review,
    timestamp: Date.now(),
  });
}

/**
 * Clear review detail cache
 */
export function clearReviewDetailCache() {
  reviewDetailCache.clear();
}

/**
 * Enhanced set review detail with caching
 */
export function setReviewDetailWithCache(review: ReviewResponse, reviewId: string) {
  setReviewDetail(review, reviewId);
  cacheReviewDetail(reviewId, review);
}

// ============================================================================
// Optimistic Updates for Like/Unlike
// ============================================================================

/**
 * Optimistically update review like state
 */
export function optimisticLikeUpdate(reviewId: string, isLiked: boolean) {
  // Update in review detail if it's the current review
  const currentReview = $reviewDetail.get();
  if (currentReview && currentReview.id === reviewId) {
    const updatedStats = {
      ...currentReview.stats,
      likesCount: isLiked
        ? currentReview.stats.likesCount + 1
        : Math.max(0, currentReview.stats.likesCount - 1),
    };

    updateReviewDetail({
      isLiked,
      stats: updatedStats,
    });
  }

  // Update in reviews list if present
  const reviewsData = $reviewsData.get();
  if (reviewsData) {
    const updatedItems = reviewsData.items.map((review) => {
      if (review.id === reviewId) {
        return {
          ...review,
          isLiked,
          stats: {
            ...review.stats,
            likesCount: isLiked
              ? review.stats.likesCount + 1
              : Math.max(0, review.stats.likesCount - 1),
          },
        };
      }
      return review;
    });

    setReviewsData({ ...reviewsData, items: updatedItems });
  }

  // Update in user reviews if present
  const userReviews = $userReviews.get();
  if (userReviews) {
    const updatedItems = userReviews.items.map((review) => {
      if (review.id === reviewId) {
        return {
          ...review,
          isLiked,
          stats: {
            ...review.stats,
            likesCount: isLiked
              ? review.stats.likesCount + 1
              : Math.max(0, review.stats.likesCount - 1),
          },
        };
      }
      return review;
    });

    $userReviews.set({ ...userReviews, items: updatedItems });
  }

  // Update in game reviews if present
  const gameReviews = $gameReviews.get();
  if (gameReviews) {
    const updatedItems = gameReviews.items.map((review) => {
      if (review.id === reviewId) {
        return {
          ...review,
          isLiked,
          stats: {
            ...review.stats,
            likesCount: isLiked
              ? review.stats.likesCount + 1
              : Math.max(0, review.stats.likesCount - 1),
          },
        };
      }
      return review;
    });

    $gameReviews.set({ ...gameReviews, items: updatedItems });
  }
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Check if a specific review is in the current reviews list
 */
export function isReviewInList(reviewId: string): boolean {
  const reviewsData = $reviewsData.get();
  return reviewsData?.items.some((review) => review.id === reviewId) || false;
}

/**
 * Get review from current list by ID
 */
export function getReviewFromList(reviewId: string): ReviewResponse | null {
  const reviewsData = $reviewsData.get();
  return reviewsData?.items.find((review) => review.id === reviewId) || null;
}

/**
 * Get current pagination info for reviews
 */
export function getCurrentReviewsPaginationInfo() {
  const reviewsData = $reviewsData.get();

  if (!reviewsData) {
    return {
      page: 1,
      limit: 12,
      total: 0,
      totalPages: 0,
    };
  }

  return reviewsData.meta;
}

/**
 * Get loading state summary
 */
export function getReviewsLoadingState() {
  return {
    reviews: $reviewsLoading.get(),
    reviewDetail: $reviewDetailLoading.get(),
    userReviews: $userReviewsLoading.get(),
    gameReviews: $gameReviewsLoading.get(),
    reviewAction: $reviewActionLoading.get(),
    isAnyLoading:
      $reviewsLoading.get() ||
      $reviewDetailLoading.get() ||
      $userReviewsLoading.get() ||
      $gameReviewsLoading.get() ||
      $reviewActionLoading.get(),
  };
}

/**
 * Get error state summary
 */
export function getReviewsErrorState() {
  return {
    reviews: $reviewsError.get(),
    reviewDetail: $reviewDetailError.get(),
    reviewAction: $reviewActionError.get(),
    hasAnyError: Boolean(
      $reviewsError.get() || $reviewDetailError.get() || $reviewActionError.get(),
    ),
  };
}

// ============================================================================
// Service Integration Actions (User Profile Feature)
// ============================================================================

/**
 * Load user reviews and populate the user reviews state
 *
 * @param userId - The user ID whose reviews to load
 * @param query - Optional query parameters for pagination and filtering
 *
 * @example
 * ```typescript
 * await loadUserReviews('user-id', { page: 1, limit: 10 });
 * ```
 */
export async function loadUserReviews(
  userId: string,
  query: import('@questlog/shared-types').ReviewsQuery = {},
): Promise<void> {
  setUserReviewsLoading(true);

  try {
    const { fetchUserReviews } = await import('../services/reviews');
    const reviews = await fetchUserReviews(userId, query);

    setUserReviews(reviews, userId);
    setUserReviewsLoading(false);
  } catch (error: any) {
    setUserReviewsLoading(false);
    console.error('Failed to load user reviews:', error);
    throw error;
  }
}
