import { z } from 'zod';

// ============================================================================
// Validation Schemas
// ============================================================================

/**
 * Login form validation schema
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

/**
 * Registration form validation schema
 */
export const registerSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  username: z
    .string()
    .min(1, 'Username is required')
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be no more than 30 characters')
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      'Username can only contain letters, numbers, underscores, and hyphens'
    )
    .refine(
      (val) => !val.startsWith('_') && !val.startsWith('-'),
      'Username cannot start with underscore or hyphen'
    )
    .refine(
      (val) => !val.endsWith('_') && !val.endsWith('-'),
      'Username cannot end with underscore or hyphen'
    ),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/\d/, 'Password must contain at least one number')
    .regex(
      /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
      'Password must contain at least one special character'
    ),
});

/**
 * Change password form validation schema
 */
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(1, 'New password is required')
    .min(8, 'Password must be at least 8 characters')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/\d/, 'Password must contain at least one number')
    .regex(
      /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
      'Password must contain at least one special character'
    ),
});

/**
 * Forgot password form validation schema
 */
export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
});

/**
 * Reset password form validation schema
 */
export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  newPassword: z
    .string()
    .min(1, 'New password is required')
    .min(8, 'Password must be at least 8 characters')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/\d/, 'Password must contain at least one number')
    .regex(
      /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
      'Password must contain at least one special character'
    ),
});

// ============================================================================
// Type Inference
// ============================================================================

// Export inferred types from schemas
export type LoginRequest = z.infer<typeof loginSchema>;
export type RegisterRequest = z.infer<typeof registerSchema>;
export type ChangePasswordRequest = z.infer<typeof changePasswordSchema>;
export type ForgotPasswordRequest = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordRequest = z.infer<typeof resetPasswordSchema>;

// ============================================================================
// Validation Functions
// ============================================================================

/**
 * Validate login form data
 */
export function validateLogin(data: unknown) {
  return loginSchema.safeParse(data);
}

/**
 * Validate registration form data
 */
export function validateRegister(data: unknown) {
  return registerSchema.safeParse(data);
}

/**
 * Validate change password form data
 */
export function validateChangePassword(data: unknown) {
  return changePasswordSchema.safeParse(data);
}

/**
 * Validate forgot password form data
 */
export function validateForgotPassword(data: unknown) {
  return forgotPasswordSchema.safeParse(data);
}

/**
 * Validate reset password form data
 */
export function validateResetPassword(data: unknown) {
  return resetPasswordSchema.safeParse(data);
}
