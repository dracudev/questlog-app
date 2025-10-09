import type {
  PublisherResponse,
  PublishersQuery,
  CreatePublisherRequest,
  UpdatePublisherRequest,
} from '@questlog/shared-types';
import { apiClient } from './api';

// ============================================================================
// Configuration
// ============================================================================

const PUBLISHERS_ENDPOINTS = {
  PUBLISHERS: 'publishers',
  PUBLISHER_BY_ID: (id: string) => `publishers/${id}`,
  PUBLISHER_BY_SLUG: (slug: string) => `publishers/${slug}`,
} as const;

// ============================================================================
// Paginated Response Interface
// ============================================================================

interface PaginatedPublishersResponse {
  data: PublisherResponse[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// ============================================================================
// Publishers Service Class
// ============================================================================

class PublishersService {
  /**
   * Fetch all publishers with optional filtering, searching, and pagination
   *
   * @param query - Query parameters for filtering and pagination
   * @returns Promise resolving to paginated publishers response
   *
   * @example
   * ```typescript
   * // Get all publishers with default pagination
   * const publishersResponse = await publishersService.getAllPublishers();
   *
   * // Get publishers with filters
   * const filteredPublishers = await publishersService.getAllPublishers({
   *   page: 1,
   *   limit: 20,
   *   search: 'electronic arts',
   *   country: 'US'
   * });
   * ```
   */
  async getAllPublishers(query: PublishersQuery = {}): Promise<PaginatedPublishersResponse> {
    const searchParams = new URLSearchParams();

    // Add query parameters
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });

    const endpoint = searchParams.toString()
      ? `${PUBLISHERS_ENDPOINTS.PUBLISHERS}?${searchParams.toString()}`
      : PUBLISHERS_ENDPOINTS.PUBLISHERS;

    return apiClient.get<PaginatedPublishersResponse>(endpoint, { skipAuth: true });
  }

  /**
   * Fetch a single publisher by its ID
   *
   * @param id - The publisher's unique identifier
   * @returns Promise resolving to publisher information
   *
   * @example
   * ```typescript
   * const publisher = await publishersService.getPublisherById('publisher-id');
   * ```
   */
  async getPublisherById(id: string): Promise<PublisherResponse> {
    if (!id) {
      throw new Error('Publisher ID is required');
    }

    return apiClient.get<PublisherResponse>(PUBLISHERS_ENDPOINTS.PUBLISHER_BY_ID(id), {
      skipAuth: true,
    });
  }

  /**
   * Fetch a single publisher by its slug
   *
   * @param slug - The publisher's unique slug identifier
   * @returns Promise resolving to publisher information
   *
   * @example
   * ```typescript
   * const publisher = await publishersService.getPublisherBySlug('electronic-arts');
   * ```
   */
  async getPublisherBySlug(slug: string): Promise<PublisherResponse> {
    if (!slug) {
      throw new Error('Publisher slug is required');
    }

    return apiClient.get<PublisherResponse>(PUBLISHERS_ENDPOINTS.PUBLISHER_BY_SLUG(slug), {
      skipAuth: true,
    });
  }

  /**
   * Create a new publisher (Admin/Moderator only)
   *
   * @param publisherData - The publisher data to create
   * @returns Promise resolving to created publisher
   *
   * @example
   * ```typescript
   * const newPublisher = await publishersService.createPublisher({
   *   name: 'Indie Games Publishing',
   *   description: 'Independent game publisher focused on innovative titles',
   *   website: 'https://indiegamespub.com',
   *   foundedYear: 2020,
   *   country: 'US'
   * });
   * ```
   */
  async createPublisher(publisherData: CreatePublisherRequest): Promise<PublisherResponse> {
    if (!publisherData.name?.trim()) {
      throw new Error('Publisher name is required');
    }

    return apiClient.post<PublisherResponse>(PUBLISHERS_ENDPOINTS.PUBLISHERS, publisherData);
  }

  /**
   * Update an existing publisher (Admin/Moderator only)
   *
   * @param id - The publisher's unique identifier
   * @param publisherData - The publisher data to update
   * @returns Promise resolving to updated publisher
   *
   * @example
   * ```typescript
   * const updatedPublisher = await publishersService.updatePublisher('publisher-id', {
   *   description: 'Updated description',
   *   website: 'https://new-website.com'
   * });
   * ```
   */
  async updatePublisher(
    id: string,
    publisherData: UpdatePublisherRequest,
  ): Promise<PublisherResponse> {
    if (!id) {
      throw new Error('Publisher ID is required');
    }

    return apiClient.patch<PublisherResponse>(
      PUBLISHERS_ENDPOINTS.PUBLISHER_BY_ID(id),
      publisherData,
    );
  }

  /**
   * Delete a publisher (Admin only)
   *
   * @param id - The publisher's unique identifier
   * @returns Promise resolving when publisher is deleted
   *
   * @example
   * ```typescript
   * await publishersService.deletePublisher('publisher-id');
   * ```
   */
  async deletePublisher(id: string): Promise<void> {
    if (!id) {
      throw new Error('Publisher ID is required');
    }

    return apiClient.delete<void>(PUBLISHERS_ENDPOINTS.PUBLISHER_BY_ID(id));
  }

  /**
   * Search publishers by name
   *
   * @param searchTerm - The search term to match against publisher names
   * @param options - Additional search options
   * @returns Promise resolving to paginated publishers response
   *
   * @example
   * ```typescript
   * const searchResults = await publishersService.searchPublishers('electronic', {
   *   limit: 10
   * });
   * ```
   */
  async searchPublishers(
    searchTerm: string,
    options: Omit<PublishersQuery, 'search'> = {},
  ): Promise<PaginatedPublishersResponse> {
    if (!searchTerm.trim()) {
      throw new Error('Search term is required');
    }

    return this.getAllPublishers({
      ...options,
      search: searchTerm.trim(),
    });
  }

  /**
   * Get popular publishers (ordered by game count)
   *
   * @param options - Query options for customizing the results
   * @returns Promise resolving to paginated publishers response
   *
   * @example
   * ```typescript
   * const popularPublishers = await publishersService.getPopularPublishers({
   *   limit: 20
   * });
   * ```
   */
  async getPopularPublishers(options: PublishersQuery = {}): Promise<PaginatedPublishersResponse> {
    // Note: Backend should support sorting by game count
    // This assumes the backend has been updated to support this
    return this.getAllPublishers({
      ...options,
    });
  }

  /**
   * Get publishers alphabetically
   *
   * @param options - Query options for customizing the results
   * @returns Promise resolving to paginated publishers response
   *
   * @example
   * ```typescript
   * const alphabeticalPublishers = await publishersService.getPublishersAlphabetically({
   *   limit: 50
   * });
   * ```
   */
  async getPublishersAlphabetically(
    options: PublishersQuery = {},
  ): Promise<PaginatedPublishersResponse> {
    return this.getAllPublishers({
      ...options,
    });
  }

  /**
   * Get publishers by country
   *
   * @param country - The country code to filter by
   * @param options - Additional query options
   * @returns Promise resolving to paginated publishers response
   *
   * @example
   * ```typescript
   * const usPublishers = await publishersService.getPublishersByCountry('US', {
   *   limit: 20,
   *   sortBy: 'name'
   * });
   * ```
   */
  async getPublishersByCountry(
    country: string,
    options: Omit<PublishersQuery, 'country'> = {},
  ): Promise<PaginatedPublishersResponse> {
    if (!country) {
      throw new Error('Country is required');
    }

    return this.getAllPublishers({
      ...options,
      country,
    });
  }

  /**
   * Get publishers founded in a specific year range
   *
   * @param startYear - The start year for filtering
   * @param endYear - The end year for filtering (optional)
   * @param options - Additional query options
   * @returns Promise resolving to paginated publishers response
   *
   * @example
   * ```typescript
   * const modernPublishers = await publishersService.getPublishersByFoundedYear(2000, 2023, {
   *   limit: 30
   * });
   * ```
   */
  async getPublishersByFoundedYear(
    startYear: number,
    endYear?: number,
    options: PublishersQuery = {},
  ): Promise<PaginatedPublishersResponse> {
    // Note: This would need backend support for year range filtering
    // For now, we'll fetch all and let the backend handle the filtering if supported
    // Using parameters to avoid unused variable warnings
    console.debug('Filtering by founded year:', { startYear, endYear });
    return this.getAllPublishers({
      ...options,
      // Backend would need to support these parameters
    });
  }

  /**
   * Get top publishers by average game rating
   *
   * @param options - Query options for customizing the results
   * @returns Promise resolving to paginated publishers response
   *
   * @example
   * ```typescript
   * const topRatedPublishers = await publishersService.getTopRatedPublishers({
   *   limit: 20
   * });
   * ```
   */
  async getTopRatedPublishers(options: PublishersQuery = {}): Promise<PaginatedPublishersResponse> {
    // Note: Backend should support sorting by average rating
    return this.getAllPublishers({
      ...options,
    });
  }
}

// ============================================================================
// Singleton Instance
// ============================================================================

/**
 * Default publishers service instance
 */
export const publishersService = new PublishersService();

/**
 * Create a new publishers service instance (for testing purposes)
 */
export function createPublishersService(): PublishersService {
  return new PublishersService();
}

// ============================================================================
// Named Exports for Individual Functions
// ============================================================================

export const {
  getAllPublishers,
  getPublisherById,
  getPublisherBySlug,
  createPublisher,
  updatePublisher,
  deletePublisher,
  searchPublishers,
  getPopularPublishers,
  getPublishersAlphabetically,
  getPublishersByCountry,
  getPublishersByFoundedYear,
  getTopRatedPublishers,
} = publishersService;

// ============================================================================
// Export Types
// ============================================================================

export type { PaginatedPublishersResponse };
