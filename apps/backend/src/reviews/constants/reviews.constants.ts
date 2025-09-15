export const REVIEWS_CONSTANTS = {
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 12,
    MAX_LIMIT: 100,
  },
  VALIDATION: {
    TITLE_MAX_LENGTH: 100,
    CONTENT_MIN_LENGTH: 10,
    CONTENT_MAX_LENGTH: 5000,
    MIN_RATING: 0,
    MAX_RATING: 10,
  },
  REVIEW_PREVIEW: {
    MAX_LENGTH: 200,
  },
  SORT_OPTIONS: {
    CREATED_AT: 'createdAt',
    UPDATED_AT: 'updatedAt',
    RATING: 'rating',
    LIKES_COUNT: 'likesCount',
  },
  SORT_ORDERS: {
    ASC: 'asc',
    DESC: 'desc',
  },
} as const;
