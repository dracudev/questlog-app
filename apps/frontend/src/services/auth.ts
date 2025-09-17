import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  ChangePasswordRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  TokenResponse,
} from '@questlog/shared-types';

import { apiClient } from './api';
import {
  setAuthenticatedUser,
  clearAuthState,
  setAuthLoading,
  setAuthError,
  updateAuthTokens,
} from '@/stores/auth';

// ============================================================================
// Authentication Functions
// ============================================================================

/**
 * Login user with email and password
 */
export async function login(credentials: LoginRequest): Promise<AuthResponse> {
  setAuthLoading(true);
  setAuthError(null);

  try {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials, {
      skipAuth: true, // Don't send auth header for login
    });

    // Update global authentication state
    setAuthenticatedUser(response.user, response.accessToken, response.refreshToken);

    return response;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Login failed';
    setAuthError(errorMessage);
    throw error;
  } finally {
    setAuthLoading(false);
  }
}

/**
 * Register new user account
 */
export async function register(userData: RegisterRequest): Promise<AuthResponse> {
  setAuthLoading(true);
  setAuthError(null);

  try {
    const response = await apiClient.post<AuthResponse>('/auth/register', userData, {
      skipAuth: true, // Don't send auth header for registration
    });

    // Update global authentication state
    setAuthenticatedUser(response.user, response.accessToken, response.refreshToken);

    return response;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Registration failed';
    setAuthError(errorMessage);
    throw error;
  } finally {
    setAuthLoading(false);
  }
}

/**
 * Logout user and clear authentication state
 */
export async function logout(): Promise<void> {
  setAuthLoading(true);

  try {
    // Call logout endpoint to invalidate server-side session
    await apiClient.post('/auth/logout');
  } catch (error) {
    // Continue with logout even if server request fails
    console.warn('Logout request failed:', error);
  } finally {
    // Clear local authentication state
    clearAuthState();
    setAuthLoading(false);

    // Redirect to home page
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  }
}

/**
 * Refresh authentication tokens
 */
export async function refreshTokens(): Promise<TokenResponse> {
  try {
    const response = await apiClient.post<TokenResponse>('/auth/refresh');

    // Update global token state
    updateAuthTokens(response.accessToken, response.refreshToken);

    return response;
  } catch (error) {
    // If refresh fails, clear auth state and redirect to login
    clearAuthState();
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/login';
    }
    throw error;
  }
}

/**
 * Change user password
 */
export async function changePassword(passwordData: ChangePasswordRequest): Promise<void> {
  setAuthLoading(true);
  setAuthError(null);

  try {
    await apiClient.post('/auth/change-password', passwordData);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Password change failed';
    setAuthError(errorMessage);
    throw error;
  } finally {
    setAuthLoading(false);
  }
}

/**
 * Request password reset email
 */
export async function forgotPassword(emailData: ForgotPasswordRequest): Promise<void> {
  setAuthLoading(true);
  setAuthError(null);

  try {
    await apiClient.post('/auth/forgot-password', emailData, {
      skipAuth: true, // Don't require authentication for password reset request
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Password reset request failed';
    setAuthError(errorMessage);
    throw error;
  } finally {
    setAuthLoading(false);
  }
}

/**
 * Reset password with token
 */
export async function resetPassword(resetData: ResetPasswordRequest): Promise<void> {
  setAuthLoading(true);
  setAuthError(null);

  try {
    await apiClient.post('/auth/reset-password', resetData, {
      skipAuth: true, // Don't require authentication for password reset
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Password reset failed';
    setAuthError(errorMessage);
    throw error;
  } finally {
    setAuthLoading(false);
  }
}

/**
 * Get current user profile (authenticated)
 */
export async function getCurrentUser(): Promise<AuthResponse['user']> {
  try {
    const user = await apiClient.get<AuthResponse['user']>('/auth/me');
    return user;
  } catch (error) {
    // If getting current user fails, might be due to expired token
    clearAuthState();
    throw error;
  }
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Check if user is authenticated by verifying token validity
 */
export async function verifyAuthentication(): Promise<boolean> {
  try {
    await getCurrentUser();
    return true;
  } catch {
    return false;
  }
}

/**
 * Initialize authentication state on app startup
 * This should be called when the app loads to restore authentication state
 */
export async function initializeAuth(): Promise<void> {
  // Note: The actual initialization is handled by the auth store
  // This function can be used for additional initialization logic
  try {
    // Verify stored authentication is still valid
    const isValid = await verifyAuthentication();
    if (!isValid) {
      clearAuthState();
    }
  } catch {
    // Ignore errors during initialization
    clearAuthState();
  }
}
