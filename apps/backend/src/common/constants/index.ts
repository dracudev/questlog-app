export const HTTP_ERROR_MESSAGES = {
  INTERNAL_SERVER_ERROR: 'Internal server error',
  INVALID_DATA: 'Invalid data provided',
  RECORD_EXISTS: 'A record with this data already exists',
  RECORD_NOT_FOUND: 'Record not found',
  INVALID_REFERENCE: 'Invalid reference to related record',
  QUERY_ERROR: 'Query interpretation error',
  DATABASE_ERROR: 'Database operation failed',
} as const;

export const PRISMA_ERROR_CODES = {
  UNIQUE_CONSTRAINT: 'P2002',
  RECORD_NOT_FOUND: 'P2025',
  FOREIGN_KEY_CONSTRAINT: 'P2003',
  QUERY_INTERPRETATION: 'P2016',
} as const;

export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 10,
  MAX_LIMIT: 100,
} as const;

export const RESPONSE_STRUCTURE = {
  SUCCESS: true,
  ERROR: false,
} as const;
