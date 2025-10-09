import type {
  DeveloperResponse,
  CreateDeveloperRequest,
  UpdateDeveloperRequest,
  DevelopersQuery,
  PaginatedResponse,
} from '@questlog/shared-types';
import { apiClient } from './api';

// ============================================================================
// Configuration
// ============================================================================

const DEVELOPERS_ENDPOINTS = {
  GET_DEVELOPERS: 'games/developers',
  GET_DEVELOPER_BY_ID: (developerId: string) => `games/developers/${developerId}`,
  GET_DEVELOPER_BY_SLUG: (slug: string) => `games/developers/slug/${slug}`,
  CREATE_DEVELOPER: 'games/developers',
  UPDATE_DEVELOPER: (developerId: string) => `games/developers/${developerId}`,
  DELETE_DEVELOPER: (developerId: string) => `games/developers/${developerId}`,
  GET_DEVELOPER_GAMES: (developerId: string) => `games/developers/${developerId}/games`,
} as const;

// ============================================================================
// Developers Service Class
// ============================================================================

class DevelopersService {
  /**
   * Get paginated list of developers
   *
   * @param query - Optional query parameters for pagination and filtering
   * @returns Promise resolving to paginated developers response
   *
   * @example
   * ```typescript
   * const developers = await developersService.getDevelopers({ page: 1, limit: 20, search: 'nintendo' });
   * console.log(developers.items.length); // Number of developers
   * ```
   */
  async getDevelopers(query: DevelopersQuery = {}): Promise<PaginatedResponse<DeveloperResponse>> {
    const searchParams = new URLSearchParams();

    // Add query parameters
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });

    const endpoint = searchParams.toString()
      ? `${DEVELOPERS_ENDPOINTS.GET_DEVELOPERS}?${searchParams.toString()}`
      : DEVELOPERS_ENDPOINTS.GET_DEVELOPERS;

    return apiClient.get<PaginatedResponse<DeveloperResponse>>(endpoint);
  }

  /**
   * Get developer by ID
   *
   * @param developerId - The developer's unique identifier
   * @returns Promise resolving to developer response
   *
   * @example
   * ```typescript
   * const developer = await developersService.getDeveloperById('developer-id');
   * console.log(developer.name);
   * ```
   */
  async getDeveloperById(developerId: string): Promise<DeveloperResponse> {
    if (!developerId) {
      throw new Error('Developer ID is required');
    }

    return apiClient.get<DeveloperResponse>(DEVELOPERS_ENDPOINTS.GET_DEVELOPER_BY_ID(developerId));
  }

  /**
   * Get developer by slug
   *
   * @param slug - The developer's slug
   * @returns Promise resolving to developer response
   *
   * @example
   * ```typescript
   * const developer = await developersService.getDeveloperBySlug('nintendo');
   * console.log(developer.name);
   * ```
   */
  async getDeveloperBySlug(slug: string): Promise<DeveloperResponse> {
    if (!slug) {
      throw new Error('Developer slug is required');
    }

    return apiClient.get<DeveloperResponse>(DEVELOPERS_ENDPOINTS.GET_DEVELOPER_BY_SLUG(slug));
  }

  /**
   * Create a new developer (requires admin/moderator authentication)
   *
   * @param developerData - Developer data to create
   * @returns Promise resolving to created developer
   *
   * @example
   * ```typescript
   * const newDeveloper = await developersService.createDeveloper({
   *   name: 'Indie Studio',
   *   description: 'Independent game developer',
   *   country: 'USA',
   * });
   * ```
   */
  async createDeveloper(developerData: CreateDeveloperRequest): Promise<DeveloperResponse> {
    if (!developerData || !developerData.name) {
      throw new Error('Developer name is required');
    }

    return apiClient.post<DeveloperResponse>(DEVELOPERS_ENDPOINTS.CREATE_DEVELOPER, developerData);
  }

  /**
   * Update a developer (requires admin/moderator authentication)
   *
   * @param developerId - The developer's unique identifier
   * @param updates - Developer data to update
   * @returns Promise resolving to updated developer
   *
   * @example
   * ```typescript
   * const updated = await developersService.updateDeveloper('developer-id', {
   *   description: 'Updated description',
   * });
   * ```
   */
  async updateDeveloper(
    developerId: string,
    updates: UpdateDeveloperRequest,
  ): Promise<DeveloperResponse> {
    if (!developerId) {
      throw new Error('Developer ID is required');
    }

    if (!updates || Object.keys(updates).length === 0) {
      throw new Error('Update data is required');
    }

    return apiClient.patch<DeveloperResponse>(
      DEVELOPERS_ENDPOINTS.UPDATE_DEVELOPER(developerId),
      updates,
    );
  }

  /**
   * Delete a developer (requires admin authentication)
   *
   * @param developerId - The developer's unique identifier
   * @returns Promise resolving when developer is deleted
   *
   * @example
   * ```typescript
   * await developersService.deleteDeveloper('developer-id');
   * ```
   */
  async deleteDeveloper(developerId: string): Promise<void> {
    if (!developerId) {
      throw new Error('Developer ID is required');
    }

    return apiClient.delete<void>(DEVELOPERS_ENDPOINTS.DELETE_DEVELOPER(developerId));
  }

  /**
   * Search developers by query
   *
   * @param searchQuery - Search term
   * @param options - Additional query options
   * @returns Promise resolving to paginated search results
   *
   * @example
   * ```typescript
   * const results = await developersService.searchDevelopers('nintendo', { limit: 10 });
   * console.log(`Found ${results.meta.total} developers`);
   * ```
   */
  async searchDevelopers(
    searchQuery: string,
    options: Omit<DevelopersQuery, 'search'> = {},
  ): Promise<PaginatedResponse<DeveloperResponse>> {
    if (!searchQuery.trim()) {
      throw new Error('Search query is required');
    }

    return this.getDevelopers({
      ...options,
      search: searchQuery.trim(),
    });
  }

  /**
   * Get developers with pagination support
   *
   * @param page - Page number (1-based)
   * @param limit - Number of items per page
   * @returns Promise resolving to paginated developers
   *
   * @example
   * ```typescript
   * const firstPage = await developersService.getDevelopersPage(1, 20);
   * const secondPage = await developersService.getDevelopersPage(2, 20);
   * ```
   */
  async getDevelopersPage(
    page: number = 1,
    limit: number = 20,
  ): Promise<PaginatedResponse<DeveloperResponse>> {
    return this.getDevelopers({ page, limit });
  }

  /**
   * Get developers by country
   *
   * @param country - Country code or name
   * @param options - Additional query options
   * @returns Promise resolving to developers from specified country
   *
   * @example
   * ```typescript
   * const japaneseDevs = await developersService.getDevelopersByCountry('Japan');
   * ```
   */
  async getDevelopersByCountry(
    country: string,
    options: Omit<DevelopersQuery, 'country'> = {},
  ): Promise<PaginatedResponse<DeveloperResponse>> {
    if (!country.trim()) {
      throw new Error('Country is required');
    }

    return this.getDevelopers({
      ...options,
      country: country.trim(),
    });
  }

  /**
   * Get developers with their games included
   *
   * @param options - Query options
   * @returns Promise resolving to developers with games data
   *
   * @example
   * ```typescript
   * const devsWithGames = await developersService.getDevelopersWithGames({ limit: 10 });
   * ```
   */
  async getDevelopersWithGames(
    options: Omit<DevelopersQuery, 'includeGames'> = {},
  ): Promise<PaginatedResponse<DeveloperResponse>> {
    return this.getDevelopers({
      ...options,
      includeGames: true,
    });
  }

  /**
   * Batch get developers by IDs
   *
   * @param developerIds - Array of developer IDs to fetch
   * @returns Promise resolving to array of developers
   *
   * @example
   * ```typescript
   * const developers = await developersService.getBatchDevelopers(['dev1', 'dev2', 'dev3']);
   * console.log(`Retrieved ${developers.length} developers`);
   * ```
   */
  async getBatchDevelopers(developerIds: string[]): Promise<DeveloperResponse[]> {
    if (!developerIds.length) {
      return [];
    }

    // For now, make individual requests (could be optimized with a batch endpoint)
    const developerPromises = developerIds.map((developerId) => this.getDeveloperById(developerId));

    try {
      return await Promise.all(developerPromises);
    } catch (error) {
      // Handle partial failures - return successful requests only
      const results = await Promise.allSettled(developerPromises);
      return results
        .filter(
          (result): result is PromiseFulfilledResult<DeveloperResponse> =>
            result.status === 'fulfilled',
        )
        .map((result) => result.value);
    }
  }

  /**
   * Check if a developer slug is available
   *
   * @param slug - Slug to check
   * @returns Promise resolving to availability status
   *
   * @example
   * ```typescript
   * const isAvailable = await developersService.isSlugAvailable('new-studio');
   * if (isAvailable) {
   *   console.log('Slug is available!');
   * }
   * ```
   */
  async isSlugAvailable(slug: string): Promise<boolean> {
    if (!slug.trim()) {
      throw new Error('Slug is required');
    }

    try {
      await this.getDeveloperBySlug(slug);
      return false; // Developer exists, slug not available
    } catch (error) {
      // If developer not found (404), slug is available
      if (error && typeof error === 'object' && 'status' in error && error.status === 404) {
        return true;
      }
      throw error; // Re-throw other errors
    }
  }

  /**
   * Get developer's display name
   *
   * @param developer - Developer object
   * @returns Display name
   *
   * @example
   * ```typescript
   * const displayName = developersService.getDisplayName(developer);
   * ```
   */
  getDisplayName(developer: DeveloperResponse): string {
    return developer.name || 'Unknown Developer';
  }

  /**
   * Get developer's avatar URL with fallback
   *
   * @param developer - Developer object
   * @param size - Avatar size in pixels
   * @returns Avatar URL
   *
   * @example
   * ```typescript
   * const avatarUrl = developersService.getAvatarUrl(developer, 64);
   * ```
   */
  getAvatarUrl(developer: DeveloperResponse, size: number = 40): string {
    if (developer.avatar) {
      return developer.avatar;
    }

    // Fallback to generated avatar based on name
    const name = developer.name || 'Developer';
    return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&size=${size}`;
  }

  /**
   * Format developer's founded year display
   *
   * @param developer - Developer object
   * @returns Formatted founded year or null
   *
   * @example
   * ```typescript
   * const founded = developersService.getFoundedYearDisplay(developer);
   * // Returns "Founded in 1985" or null
   * ```
   */
  getFoundedYearDisplay(developer: DeveloperResponse): string | null {
    if (!developer.foundedYear) return null;
    return `Founded in ${developer.foundedYear}`;
  }
}

// ============================================================================
// Singleton Instance
// ============================================================================

export const developersService = new DevelopersService();

// ============================================================================
// Individual Function Exports
// ============================================================================

export const {
  getDevelopers,
  getDeveloperById,
  getDeveloperBySlug,
  createDeveloper,
  updateDeveloper,
  deleteDeveloper,
  searchDevelopers,
  getDevelopersPage,
  getDevelopersByCountry,
  getDevelopersWithGames,
  getBatchDevelopers,
  isSlugAvailable,
  getDisplayName,
  getAvatarUrl,
  getFoundedYearDisplay,
} = developersService;
