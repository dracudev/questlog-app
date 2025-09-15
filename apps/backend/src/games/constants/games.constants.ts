export const GAMES_CONSTANTS = {
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 12,
    MAX_LIMIT: 100,
  },
  SIMILAR_GAMES: {
    DEFAULT_LIMIT: 6,
  },
  REVIEW_PREVIEW: {
    MAX_LENGTH: 300,
  },
  VALIDATION: {
    TITLE_MAX_LENGTH: 200,
    SUMMARY_MAX_LENGTH: 500,
  },
} as const;

export const SORT_FIELDS = [
  'title',
  'releaseDate',
  'averageRating',
  'reviewCount',
  'createdAt',
] as const;

export const SORT_ORDERS = ['asc', 'desc'] as const;

export type SortField = (typeof SORT_FIELDS)[number];
export type SortOrder = (typeof SORT_ORDERS)[number];
