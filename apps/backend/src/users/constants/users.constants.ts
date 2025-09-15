export const USERS_CONSTANTS = {
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100,
  },
  PROFILE: {
    RECENT_REVIEWS_LIMIT: 5,
    RECENT_GAME_LISTS_LIMIT: 3,
    REVIEW_CONTENT_PREVIEW_LENGTH: 200,
  },
  SESSION: {
    RESET_TOKEN_EXPIRY_HOURS: 1,
  },
} as const;

export const USER_PROFILE_FIELDS = {
  PUBLIC: [
    'id',
    'username',
    'displayName',
    'avatar',
    'bio',
    'location',
    'website',
    'isPrivate',
    'createdAt',
  ],
  PRIVATE: ['id', 'username', 'displayName', 'avatar', 'isPrivate', 'createdAt'],
} as const;
