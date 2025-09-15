export const BCRYPT_SALT_ROUNDS = 12;
export const BCRYPT_RESET_TOKEN_ROUNDS = 10;

export const JWT_TOKEN_TYPE = {
  RESET: 'reset',
} as const;

export const JWT_DEFAULTS = {
  EXPIRES_IN: '7d',
  REFRESH_EXPIRES_IN: '30d',
  RESET_EXPIRES_IN: '1h',
} as const;

export const PASSWORD_RESET = {
  TOKEN_EXPIRY: '1h',
} as const;

export const AUTH_MESSAGES = {
  EMAIL_ALREADY_REGISTERED: 'Email already registered',
  USERNAME_ALREADY_TAKEN: 'Username already taken',
  INVALID_CREDENTIALS: 'Invalid credentials',
  USER_NOT_FOUND: 'User not found',
  CURRENT_PASSWORD_INCORRECT: 'Current password is incorrect',
  INVALID_TOKEN_TYPE: 'Invalid token type',
  INVALID_OR_EXPIRED_TOKEN: 'Invalid or expired reset token',
} as const;
