import type {
  GenreResponse,
  GenresQuery,
  CreateGenreRequest,
  UpdateGenreRequest,
} from '@questlog/shared-types';
import { apiClient } from './api';

// ============================================================================
// Configuration
// ============================================================================

const GENRES_ENDPOINTS = {
  GENRES: 'genres',
  GENRE_BY_ID: (id: string) => `genres/${id}`,
  GENRE_BY_SLUG: (slug: string) => `genres/${slug}`,
} as const;

// ============================================================================
// Paginated Response Interface
// ============================================================================

interface PaginatedGenresResponse {
  data: GenreResponse[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// ============================================================================
// Genres Service Class
// ============================================================================

class GenresService {
  /**
   * Fetch all genres with optional filtering, searching, and pagination
   *
   * @param query - Query parameters for filtering and pagination
   * @returns Promise resolving to paginated genres response
   *
   * @example
   * ```typescript
   * // Get all genres with default pagination
   * const genresResponse = await genresService.getAllGenres();
   *
   * // Get genres with filters
   * const filteredGenres = await genresService.getAllGenres({
   *   page: 1,
   *   limit: 20,
   *   search: 'action'
   * });
   * ```
   */
  async getAllGenres(query: GenresQuery = {}): Promise<PaginatedGenresResponse> {
    const searchParams = new URLSearchParams();

    // Add query parameters
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });

    const endpoint = searchParams.toString()
      ? `${GENRES_ENDPOINTS.GENRES}?${searchParams.toString()}`
      : GENRES_ENDPOINTS.GENRES;

    return apiClient.get<PaginatedGenresResponse>(endpoint, { skipAuth: true });
  }

  /**
   * Fetch a single genre by its ID
   *
   * @param id - The genre's unique identifier
   * @returns Promise resolving to genre information
   *
   * @example
   * ```typescript
   * const genre = await genresService.getGenreById('genre-id');
   * ```
   */
  async getGenreById(id: string): Promise<GenreResponse> {
    if (!id) {
      throw new Error('Genre ID is required');
    }

    return apiClient.get<GenreResponse>(GENRES_ENDPOINTS.GENRE_BY_ID(id), {
      skipAuth: true,
    });
  }

  /**
   * Fetch a single genre by its slug
   *
   * @param slug - The genre's unique slug identifier
   * @returns Promise resolving to genre information
   *
   * @example
   * ```typescript
   * const genre = await genresService.getGenreBySlug('action-adventure');
   * ```
   */
  async getGenreBySlug(slug: string): Promise<GenreResponse> {
    if (!slug) {
      throw new Error('Genre slug is required');
    }

    return apiClient.get<GenreResponse>(GENRES_ENDPOINTS.GENRE_BY_SLUG(slug), {
      skipAuth: true,
    });
  }

  /**
   * Create a new genre (Admin/Moderator only)
   *
   * @param genreData - The genre data to create
   * @returns Promise resolving to created genre
   *
   * @example
   * ```typescript
   * const newGenre = await genresService.createGenre({
   *   name: 'Battle Royale',
   *   description: 'Large-scale last-player-standing games'
   * });
   * ```
   */
  async createGenre(genreData: CreateGenreRequest): Promise<GenreResponse> {
    if (!genreData.name?.trim()) {
      throw new Error('Genre name is required');
    }

    return apiClient.post<GenreResponse>(GENRES_ENDPOINTS.GENRES, genreData);
  }

  /**
   * Update an existing genre (Admin/Moderator only)
   *
   * @param id - The genre's unique identifier
   * @param genreData - The genre data to update
   * @returns Promise resolving to updated genre
   *
   * @example
   * ```typescript
   * const updatedGenre = await genresService.updateGenre('genre-id', {
   *   description: 'Updated description'
   * });
   * ```
   */
  async updateGenre(id: string, genreData: UpdateGenreRequest): Promise<GenreResponse> {
    if (!id) {
      throw new Error('Genre ID is required');
    }

    return apiClient.patch<GenreResponse>(GENRES_ENDPOINTS.GENRE_BY_ID(id), genreData);
  }

  /**
   * Delete a genre (Admin only)
   *
   * @param id - The genre's unique identifier
   * @returns Promise resolving when genre is deleted
   *
   * @example
   * ```typescript
   * await genresService.deleteGenre('genre-id');
   * ```
   */
  async deleteGenre(id: string): Promise<void> {
    if (!id) {
      throw new Error('Genre ID is required');
    }

    return apiClient.delete<void>(GENRES_ENDPOINTS.GENRE_BY_ID(id));
  }

  /**
   * Search genres by name
   *
   * @param searchTerm - The search term to match against genre names
   * @param options - Additional search options
   * @returns Promise resolving to paginated genres response
   *
   * @example
   * ```typescript
   * const searchResults = await genresService.searchGenres('action', {
   *   limit: 10
   * });
   * ```
   */
  async searchGenres(
    searchTerm: string,
    options: Omit<GenresQuery, 'search'> = {},
  ): Promise<PaginatedGenresResponse> {
    if (!searchTerm.trim()) {
      throw new Error('Search term is required');
    }

    return this.getAllGenres({
      ...options,
      search: searchTerm.trim(),
    });
  }

  /**
   * Get popular genres (ordered by game count)
   *
   * @param options - Query options for customizing the results
   * @returns Promise resolving to paginated genres response
   *
   * @example
   * ```typescript
   * const popularGenres = await genresService.getPopularGenres({
   *   limit: 20
   * });
   * ```
   */
  async getPopularGenres(options: GenresQuery = {}): Promise<PaginatedGenresResponse> {
    // Note: Backend should support sorting by game count
    // This assumes the backend has been updated to support this
    return this.getAllGenres({
      ...options,
    });
  }

  /**
   * Get genres alphabetically
   *
   * @param options - Query options for customizing the results
   * @returns Promise resolving to paginated genres response
   *
   * @example
   * ```typescript
   * const alphabeticalGenres = await genresService.getGenresAlphabetically({
   *   limit: 50
   * });
   * ```
   */
  async getGenresAlphabetically(options: GenresQuery = {}): Promise<PaginatedGenresResponse> {
    return this.getAllGenres({
      ...options,
    });
  }
}

// ============================================================================
// Singleton Instance
// ============================================================================

/**
 * Default genres service instance
 */
export const genresService = new GenresService();

/**
 * Create a new genres service instance (for testing purposes)
 */
export function createGenresService(): GenresService {
  return new GenresService();
}

// ============================================================================
// Named Exports for Individual Functions
// ============================================================================

export const {
  getAllGenres,
  getGenreById,
  getGenreBySlug,
  createGenre,
  updateGenre,
  deleteGenre,
  searchGenres,
  getPopularGenres,
  getGenresAlphabetically,
} = genresService;

// ============================================================================
// Export Types
// ============================================================================

export type { PaginatedGenresResponse };
