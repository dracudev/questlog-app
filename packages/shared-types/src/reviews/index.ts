// Review-related User and Game DTOs
export interface ReviewUser {
  id: string;
  username: string;
  displayName: string;
  avatar?: string;
}

export interface ReviewGame {
  id: string;
  title: string;
  slug: string;
  coverImage?: string;
}

export interface ReviewStats {
  likesCount: number;
  commentsCount: number;
}

// Review Response
export interface ReviewResponse {
  id: string;
  title?: string;
  content: string;
  rating: number;
  isPublished: boolean;
  isSpoiler: boolean;
  user: ReviewUser;
  game: ReviewGame;
  stats: ReviewStats;
  createdAt: Date;
  updatedAt: Date;
  isLiked?: boolean; // Only present for authenticated users
}

// Review Request DTOs
export interface CreateReviewRequest {
  title?: string;
  content: string;
  rating: number;
  gameId: string;
  isPublished?: boolean;
  isSpoiler?: boolean;
}

export interface UpdateReviewRequest {
  title?: string;
  content?: string;
  rating?: number;
  isPublished?: boolean;
  isSpoiler?: boolean;
}

// Paginated Reviews Response
export interface PaginatedReviewsResponse {
  items: ReviewResponse[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Review Query Types
export interface ReviewsQuery {
  page?: number;
  limit?: number;
  search?: string;
  gameId?: string;
  userId?: string;
  minRating?: number;
  maxRating?: number;
  isPublished?: boolean;
  isSpoiler?: boolean;
  sortBy?: 'createdAt' | 'updatedAt' | 'rating' | 'likesCount';
  sortOrder?: 'asc' | 'desc';
}

// Review Filters
export interface ReviewFilters {
  gameId?: string;
  userId?: string;
  minRating?: number;
  maxRating?: number;
  isPublished?: boolean;
  isSpoiler?: boolean;
  hasContent?: boolean;
  dateFrom?: Date;
  dateTo?: Date;
}

// Review Actions
export interface LikeReviewResponse {
  isLiked: boolean;
  likesCount: number;
}

// Delete Response
export interface DeleteSuccessResponse {
  message: string;
  deletedAt: Date;
}
