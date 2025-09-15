export const SOCIAL_CONSTANTS = {
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100,
  },
  FEED: {
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 50,
    CACHE_TTL: 300, // 5 minutes
  },
  ACTIVITY_TYPES: {
    FOLLOW: 'follow',
    REVIEW: 'review',
    LIKE: 'like',
    COMMENT: 'comment',
  },
} as const;

export type ActivityType =
  (typeof SOCIAL_CONSTANTS.ACTIVITY_TYPES)[keyof typeof SOCIAL_CONSTANTS.ACTIVITY_TYPES];
