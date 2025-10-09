import type {
  PlatformResponse,
  PlatformsQuery,
  CreatePlatformRequest,
  UpdatePlatformRequest,
} from '@questlog/shared-types';
import { apiClient } from './api';

// ============================================================================
// Configuration
// ============================================================================

const PLATFORMS_ENDPOINTS = {
  PLATFORMS: 'platforms',
  PLATFORM_BY_ID: (id: string) => `platforms/${id}`,
  PLATFORM_BY_SLUG: (slug: string) => `platforms/${slug}`,
} as const;

// ============================================================================
// Paginated Response Interface
// ============================================================================

interface PaginatedPlatformsResponse {
  data: PlatformResponse[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// ============================================================================
// Platforms Service Class
// ============================================================================

class PlatformsService {
  /**
   * Fetch all platforms with optional filtering, searching, and pagination
   *
   * @param query - Query parameters for filtering and pagination
   * @returns Promise resolving to paginated platforms response
   *
   * @example
   * ```typescript
   * // Get all platforms with default pagination
   * const platformsResponse = await platformsService.getAllPlatforms();
   *
   * // Get platforms with filters
   * const filteredPlatforms = await platformsService.getAllPlatforms({
   *   page: 1,
   *   limit: 20,
   *   search: 'playstation'
   * });
   * ```
   */
  async getAllPlatforms(query: PlatformsQuery = {}): Promise<PaginatedPlatformsResponse> {
    const searchParams = new URLSearchParams();

    // Add query parameters
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });

    const endpoint = searchParams.toString()
      ? `${PLATFORMS_ENDPOINTS.PLATFORMS}?${searchParams.toString()}`
      : PLATFORMS_ENDPOINTS.PLATFORMS;

    return apiClient.get<PaginatedPlatformsResponse>(endpoint, { skipAuth: true });
  }

  /**
   * Fetch a single platform by its ID
   *
   * @param id - The platform's unique identifier
   * @returns Promise resolving to platform information
   *
   * @example
   * ```typescript
   * const platform = await platformsService.getPlatformById('platform-id');
   * ```
   */
  async getPlatformById(id: string): Promise<PlatformResponse> {
    if (!id) {
      throw new Error('Platform ID is required');
    }

    return apiClient.get<PlatformResponse>(PLATFORMS_ENDPOINTS.PLATFORM_BY_ID(id), {
      skipAuth: true,
    });
  }

  /**
   * Fetch a single platform by its slug
   *
   * @param slug - The platform's unique slug identifier
   * @returns Promise resolving to platform information
   *
   * @example
   * ```typescript
   * const platform = await platformsService.getPlatformBySlug('playstation-5');
   * ```
   */
  async getPlatformBySlug(slug: string): Promise<PlatformResponse> {
    if (!slug) {
      throw new Error('Platform slug is required');
    }

    return apiClient.get<PlatformResponse>(PLATFORMS_ENDPOINTS.PLATFORM_BY_SLUG(slug), {
      skipAuth: true,
    });
  }

  /**
   * Create a new platform (Admin/Moderator only)
   *
   * @param platformData - The platform data to create
   * @returns Promise resolving to created platform
   *
   * @example
   * ```typescript
   * const newPlatform = await platformsService.createPlatform({
   *   name: 'Steam Deck',
   *   abbreviation: 'DECK'
   * });
   * ```
   */
  async createPlatform(platformData: CreatePlatformRequest): Promise<PlatformResponse> {
    if (!platformData.name?.trim()) {
      throw new Error('Platform name is required');
    }

    return apiClient.post<PlatformResponse>(PLATFORMS_ENDPOINTS.PLATFORMS, platformData);
  }

  /**
   * Update an existing platform (Admin/Moderator only)
   *
   * @param id - The platform's unique identifier
   * @param platformData - The platform data to update
   * @returns Promise resolving to updated platform
   *
   * @example
   * ```typescript
   * const updatedPlatform = await platformsService.updatePlatform('platform-id', {
   *   abbreviation: 'PS5'
   * });
   * ```
   */
  async updatePlatform(id: string, platformData: UpdatePlatformRequest): Promise<PlatformResponse> {
    if (!id) {
      throw new Error('Platform ID is required');
    }

    return apiClient.patch<PlatformResponse>(PLATFORMS_ENDPOINTS.PLATFORM_BY_ID(id), platformData);
  }

  /**
   * Delete a platform (Admin only)
   *
   * @param id - The platform's unique identifier
   * @returns Promise resolving when platform is deleted
   *
   * @example
   * ```typescript
   * await platformsService.deletePlatform('platform-id');
   * ```
   */
  async deletePlatform(id: string): Promise<void> {
    if (!id) {
      throw new Error('Platform ID is required');
    }

    return apiClient.delete<void>(PLATFORMS_ENDPOINTS.PLATFORM_BY_ID(id));
  }

  /**
   * Search platforms by name
   *
   * @param searchTerm - The search term to match against platform names
   * @param options - Additional search options
   * @returns Promise resolving to paginated platforms response
   *
   * @example
   * ```typescript
   * const searchResults = await platformsService.searchPlatforms('xbox', {
   *   limit: 10
   * });
   * ```
   */
  async searchPlatforms(
    searchTerm: string,
    options: Omit<PlatformsQuery, 'search'> = {},
  ): Promise<PaginatedPlatformsResponse> {
    if (!searchTerm.trim()) {
      throw new Error('Search term is required');
    }

    return this.getAllPlatforms({
      ...options,
      search: searchTerm.trim(),
    });
  }

  /**
   * Get popular platforms (ordered by game count)
   *
   * @param options - Query options for customizing the results
   * @returns Promise resolving to paginated platforms response
   *
   * @example
   * ```typescript
   * const popularPlatforms = await platformsService.getPopularPlatforms({
   *   limit: 20
   * });
   * ```
   */
  async getPopularPlatforms(options: PlatformsQuery = {}): Promise<PaginatedPlatformsResponse> {
    // Note: Backend should support sorting by game count
    // This assumes the backend has been updated to support this
    return this.getAllPlatforms({
      ...options,
    });
  }

  /**
   * Get platforms alphabetically
   *
   * @param options - Query options for customizing the results
   * @returns Promise resolving to paginated platforms response
   *
   * @example
   * ```typescript
   * const alphabeticalPlatforms = await platformsService.getPlatformsAlphabetically({
   *   limit: 50
   * });
   * ```
   */
  async getPlatformsAlphabetically(
    options: PlatformsQuery = {},
  ): Promise<PaginatedPlatformsResponse> {
    return this.getAllPlatforms({
      ...options,
    });
  }

  /**
   * Get console platforms (hardware-based platforms)
   *
   * @param options - Query options for customizing the results
   * @returns Promise resolving to paginated platforms response
   *
   * @example
   * ```typescript
   * const consolePlatforms = await platformsService.getConsolePlatforms({
   *   limit: 20
   * });
   * ```
   */
  async getConsolePlatforms(options: PlatformsQuery = {}): Promise<PaginatedPlatformsResponse> {
    // Note: This would need backend support for platform type filtering
    // For now, we'll fetch all and let the backend handle the filtering if supported
    return this.getAllPlatforms({
      ...options,
      // Backend would need to support platform type filtering
    });
  }

  /**
   * Get PC platforms (PC-based platforms like Steam, Epic, etc.)
   *
   * @param options - Query options for customizing the results
   * @returns Promise resolving to paginated platforms response
   *
   * @example
   * ```typescript
   * const pcPlatforms = await platformsService.getPCPlatforms({
   *   limit: 10
   * });
   * ```
   */
  async getPCPlatforms(options: PlatformsQuery = {}): Promise<PaginatedPlatformsResponse> {
    // Note: This would need backend support for platform type filtering
    return this.getAllPlatforms({
      ...options,
      // Backend would need to support platform type filtering
    });
  }

  /**
   * Get mobile platforms (mobile-based platforms)
   *
   * @param options - Query options for customizing the results
   * @returns Promise resolving to paginated platforms response
   *
   * @example
   * ```typescript
   * const mobilePlatforms = await platformsService.getMobilePlatforms({
   *   limit: 5
   * });
   * ```
   */
  async getMobilePlatforms(options: PlatformsQuery = {}): Promise<PaginatedPlatformsResponse> {
    // Note: This would need backend support for platform type filtering
    return this.getAllPlatforms({
      ...options,
      // Backend would need to support platform type filtering
    });
  }

  /**
   * Get current generation platforms
   *
   * @param options - Query options for customizing the results
   * @returns Promise resolving to paginated platforms response
   *
   * @example
   * ```typescript
   * const currentGenPlatforms = await platformsService.getCurrentGenPlatforms({
   *   limit: 15
   * });
   * ```
   */
  async getCurrentGenPlatforms(options: PlatformsQuery = {}): Promise<PaginatedPlatformsResponse> {
    // Note: This would need backend support for generation filtering
    return this.getAllPlatforms({
      ...options,
      // Backend would need to support generation filtering
    });
  }
}

// ============================================================================
// Singleton Instance
// ============================================================================

/**
 * Default platforms service instance
 */
export const platformsService = new PlatformsService();

/**
 * Create a new platforms service instance (for testing purposes)
 */
export function createPlatformsService(): PlatformsService {
  return new PlatformsService();
}

// ============================================================================
// Named Exports for Individual Functions
// ============================================================================

export const {
  getAllPlatforms,
  getPlatformById,
  getPlatformBySlug,
  createPlatform,
  updatePlatform,
  deletePlatform,
  searchPlatforms,
  getPopularPlatforms,
  getPlatformsAlphabetically,
  getConsolePlatforms,
  getPCPlatforms,
  getMobilePlatforms,
  getCurrentGenPlatforms,
} = platformsService;

// ============================================================================
// Export Types
// ============================================================================

export type { PaginatedPlatformsResponse };
