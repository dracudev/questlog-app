import type { ApiResponse, ApiError } from '@questlog/shared-types';
import { $authToken, $refreshToken, clearAuthState, updateAuthTokens } from '@/stores/auth';

// ============================================================================
// Configuration
// ============================================================================

const API_CONFIG = {
  baseURL: import.meta.env.PUBLIC_API_URL || 'http://localhost:3000/api/v1',
  timeout: 30000, // 30 seconds
  retryAttempts: 3,
  retryDelay: 1000, // 1 second
} as const;

// ============================================================================
// Types
// ============================================================================

interface RequestConfig extends RequestInit {
  timeout?: number;
  skipAuth?: boolean;
  retryAttempts?: number;
}

interface ApiClientOptions {
  baseURL?: string;
  timeout?: number;
  defaultHeaders?: Record<string, string>;
}

// ============================================================================
// Core API Client Class
// ============================================================================

class ApiClient {
  private baseURL: string;
  private timeout: number;
  private defaultHeaders: Record<string, string>;
  private refreshPromise: Promise<void> | null = null;

  constructor(options: ApiClientOptions = {}) {
    this.baseURL = options.baseURL || API_CONFIG.baseURL;
    this.timeout = options.timeout || API_CONFIG.timeout;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...options.defaultHeaders,
    };
  }

  /**
   * Make a type-safe HTTP request to the API
   */
  async request<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
    const url = this.buildURL(endpoint);
    const requestConfig = await this.buildRequestConfig(config);

    return this.executeRequest<T>(url, requestConfig);
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, data?: unknown, config: RequestConfig = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PATCH request
   */
  async patch<T>(endpoint: string, data?: unknown, config: RequestConfig = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }

  // ============================================================================
  // Private Helper Methods
  // ============================================================================

  /**
   * Build the full URL for the request
   */
  private buildURL(endpoint: string): string {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    const cleanBaseURL = this.baseURL.endsWith('/') ? this.baseURL.slice(0, -1) : this.baseURL;
    return `${cleanBaseURL}/${cleanEndpoint}`;
  }

  /**
   * Build the request configuration with headers and authentication
   */
  private async buildRequestConfig(config: RequestConfig): Promise<RequestInit> {
    const headers = new Headers(this.defaultHeaders);

    // Add custom headers from config
    if (config.headers) {
      Object.entries(config.headers).forEach(([key, value]) => {
        headers.set(key, value);
      });
    }

    // Add authentication header if not skipped
    if (!config.skipAuth) {
      const token = await this.getValidToken();
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
    }

    return {
      ...config,
      headers,
      signal: this.createAbortSignal(config.timeout),
    };
  }

  /**
   * Execute the HTTP request with error handling and retries
   */
  private async executeRequest<T>(url: string, config: RequestInit): Promise<T> {
    const maxRetries = (config as RequestConfig).retryAttempts || API_CONFIG.retryAttempts;
    let lastError: Error;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const response = await fetch(url, config);
        return await this.handleResponse<T>(response);
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');

        // Don't retry on client errors (4xx) or authentication errors
        if (error instanceof ApiClientError && error.status >= 400 && error.status < 500) {
          throw error;
        }

        // Wait before retrying (exponential backoff)
        if (attempt < maxRetries) {
          await this.delay(API_CONFIG.retryDelay * Math.pow(2, attempt));
        }
      }
    }

    throw lastError!;
  }

  /**
   * Handle the response and parse JSON with error handling
   */
  private async handleResponse<T>(response: Response): Promise<T> {
    // Handle authentication errors
    if (response.status === 401) {
      await this.handleUnauthorized();
      throw new ApiClientError('Authentication required', 401);
    }

    // Parse response body
    let responseData: ApiResponse<T> | ApiError;
    try {
      responseData = await response.json();
    } catch {
      throw new ApiClientError(`HTTP ${response.status}: ${response.statusText}`, response.status);
    }

    // Handle error responses
    if (!response.ok) {
      const errorData = responseData as ApiError;
      throw new ApiClientError(
        errorData.message || `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        errorData.details,
      );
    }

    // Return successful response data
    const successData = responseData as ApiResponse<T>;
    return successData.data;
  }

  /**
   * Get a valid authentication token, refreshing if necessary
   */
  private async getValidToken(): Promise<string | null> {
    const currentToken = $authToken.get();

    if (!currentToken) {
      return null;
    }

    // Check if token needs refresh (basic client-side check)
    if (this.isTokenExpiringSoon(currentToken)) {
      await this.refreshToken();
      return $authToken.get();
    }

    return currentToken;
  }

  /**
   * Refresh the authentication token
   */
  private async refreshToken(): Promise<void> {
    // Prevent multiple concurrent refresh attempts
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = this.performTokenRefresh();

    try {
      await this.refreshPromise;
    } finally {
      this.refreshPromise = null;
    }
  }

  /**
   * Perform the actual token refresh
   */
  private async performTokenRefresh(): Promise<void> {
    const refreshToken = $refreshToken.get();

    if (!refreshToken) {
      clearAuthState();
      return;
    }

    try {
      const response = await fetch(`${this.baseURL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${refreshToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const data = await response.json();
      updateAuthTokens(data.data.accessToken, data.data.refreshToken);
    } catch {
      // Refresh failed, clear auth state
      clearAuthState();
    }
  }

  /**
   * Handle unauthorized responses
   */
  private async handleUnauthorized(): Promise<void> {
    // Try to refresh token first
    try {
      await this.refreshToken();
    } catch {
      // Refresh failed, redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
    }
  }

  /**
   * Check if token is expiring soon (basic client-side check)
   */
  private isTokenExpiringSoon(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = payload.exp * 1000; // Convert to milliseconds
      const currentTime = Date.now();
      const timeUntilExpiry = expirationTime - currentTime;

      // Refresh if token expires within 5 minutes
      return timeUntilExpiry < 5 * 60 * 1000;
    } catch {
      // If we can't parse the token, assume it needs refresh
      return true;
    }
  }

  /**
   * Create an AbortSignal with timeout
   */
  private createAbortSignal(timeout?: number): AbortSignal | undefined {
    if (typeof AbortController === 'undefined') {
      return undefined;
    }

    const controller = new AbortController();
    const timeoutMs = timeout || this.timeout;

    setTimeout(() => controller.abort(), timeoutMs);

    return controller.signal;
  }

  /**
   * Delay utility for retries
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// ============================================================================
// Custom Error Class
// ============================================================================

export class ApiClientError extends Error {
  constructor(
    message: string,
    public status: number,
    public details?: string[],
  ) {
    super(message);
    this.name = 'ApiClientError';
  }
}

// ============================================================================
// Singleton Instance
// ============================================================================

/**
 * Default API client instance
 */
export const apiClient = new ApiClient();

/**
 * Create a new API client instance with custom configuration
 */
export function createApiClient(options: ApiClientOptions): ApiClient {
  return new ApiClient(options);
}
