import type {
  GameResponse,
  GameDetail,
  PaginatedGamesResponse,
  GamesQuery,
} from '@questlog/shared-types';
import { apiClient } from './api';

// ============================================================================
// Configuration
// ============================================================================

const GAMES_ENDPOINTS = {
  GAMES: 'games',
  GAME_BY_SLUG: (slug: string) => `games/${slug}`,
  SIMILAR_GAMES: (id: string) => `games/${id}/similar`,
} as const;

// ============================================================================
// Games Service Class
// ============================================================================

class GamesService {
  /**
   * Fetch all games with optional filtering, searching, and pagination
   *
   * @param query - Query parameters for filtering and pagination
   * @returns Promise resolving to paginated games response
   *
   * @example
   * ```typescript
   * // Get all games with default pagination
   * const gamesResponse = await gamesService.getAllGames();
   *
   * // Get games with filters
   * const filteredGames = await gamesService.getAllGames({
   *   page: 1,
   *   limit: 12,
   *   search: 'witcher',
   *   genreIds: ['action-rpg-id'],
   *   status: 'RELEASED',
   *   minRating: 8.0,
   *   sortBy: 'averageRating',
   *   sortOrder: 'desc'
   * });
   * ```
   */
  async getAllGames(query: GamesQuery = {}): Promise<PaginatedGamesResponse> {
    const searchParams = new URLSearchParams();

    // Add query parameters
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          // Handle array parameters (genreIds, platformIds)
          if (value.length > 0) {
            value.forEach((item) => searchParams.append(key, item.toString()));
          }
        } else {
          searchParams.append(key, value.toString());
        }
      }
    });

    const endpoint = searchParams.toString()
      ? `${GAMES_ENDPOINTS.GAMES}?${searchParams.toString()}`
      : GAMES_ENDPOINTS.GAMES;

    return apiClient.get<PaginatedGamesResponse>(endpoint, { skipAuth: true });
  }

  /**
   * Fetch a single game by its slug
   *
   * @param slug - The game's unique slug identifier
   * @returns Promise resolving to detailed game information
   *
   * @example
   * ```typescript
   * const gameDetail = await gamesService.getGameBySlug('the-witcher-3-wild-hunt');
   * ```
   */
  async getGameBySlug(slug: string): Promise<GameDetail> {
    if (!slug) {
      throw new Error('Game slug is required');
    }

    return apiClient.get<GameDetail>(GAMES_ENDPOINTS.GAME_BY_SLUG(slug), {
      skipAuth: true,
    });
  }

  /**
   * Fetch similar games for a given game
   *
   * @param gameId - The game's unique identifier
   * @param limit - Maximum number of similar games to return (optional)
   * @returns Promise resolving to array of similar games
   *
   * @example
   * ```typescript
   * const similarGames = await gamesService.getSimilarGames('game-id', 6);
   * ```
   */
  async getSimilarGames(gameId: string, limit?: number): Promise<GameResponse[]> {
    if (!gameId) {
      throw new Error('Game ID is required');
    }

    const searchParams = new URLSearchParams();
    if (limit !== undefined) {
      searchParams.append('limit', limit.toString());
    }

    const endpoint = searchParams.toString()
      ? `${GAMES_ENDPOINTS.SIMILAR_GAMES(gameId)}?${searchParams.toString()}`
      : GAMES_ENDPOINTS.SIMILAR_GAMES(gameId);

    return apiClient.get<GameResponse[]>(endpoint, { skipAuth: true });
  }

  /**
   * Search games by title
   *
   * @param searchTerm - The search term to match against game titles
   * @param options - Additional search options
   * @returns Promise resolving to paginated games response
   *
   * @example
   * ```typescript
   * const searchResults = await gamesService.searchGames('witcher', {
   *   limit: 10,
   *   sortBy: 'averageRating',
   *   sortOrder: 'desc'
   * });
   * ```
   */
  async searchGames(
    searchTerm: string,
    options: Omit<GamesQuery, 'search'> = {},
  ): Promise<PaginatedGamesResponse> {
    if (!searchTerm.trim()) {
      throw new Error('Search term is required');
    }

    return this.getAllGames({
      ...options,
      search: searchTerm.trim(),
    });
  }

  /**
   * Get games by genre
   *
   * @param genreIds - Array of genre IDs to filter by
   * @param options - Additional query options
   * @returns Promise resolving to paginated games response
   *
   * @example
   * ```typescript
   * const rpgGames = await gamesService.getGamesByGenre(['rpg-id'], {
   *   limit: 20,
   *   sortBy: 'averageRating',
   *   sortOrder: 'desc'
   * });
   * ```
   */
  async getGamesByGenre(
    genreIds: string[],
    options: Omit<GamesQuery, 'genreIds'> = {},
  ): Promise<PaginatedGamesResponse> {
    if (!genreIds.length) {
      throw new Error('At least one genre ID is required');
    }

    return this.getAllGames({
      ...options,
      genreIds,
    });
  }

  /**
   * Get games by platform
   *
   * @param platformIds - Array of platform IDs to filter by
   * @param options - Additional query options
   * @returns Promise resolving to paginated games response
   *
   * @example
   * ```typescript
   * const pcGames = await gamesService.getGamesByPlatform(['pc-id'], {
   *   limit: 20,
   *   sortBy: 'releaseDate',
   *   sortOrder: 'desc'
   * });
   * ```
   */
  async getGamesByPlatform(
    platformIds: string[],
    options: Omit<GamesQuery, 'platformIds'> = {},
  ): Promise<PaginatedGamesResponse> {
    if (!platformIds.length) {
      throw new Error('At least one platform ID is required');
    }

    return this.getAllGames({
      ...options,
      platformIds,
    });
  }

  /**
   * Get games by developer
   *
   * @param developerId - The developer ID to filter by
   * @param options - Additional query options
   * @returns Promise resolving to paginated games response
   *
   * @example
   * ```typescript
   * const cdprGames = await gamesService.getGamesByDeveloper('cd-projekt-red-id', {
   *   sortBy: 'releaseDate',
   *   sortOrder: 'desc'
   * });
   * ```
   */
  async getGamesByDeveloper(
    developerId: string,
    options: Omit<GamesQuery, 'developerId'> = {},
  ): Promise<PaginatedGamesResponse> {
    if (!developerId) {
      throw new Error('Developer ID is required');
    }

    return this.getAllGames({
      ...options,
      developerId,
    });
  }

  /**
   * Get games by publisher
   *
   * @param publisherId - The publisher ID to filter by
   * @param options - Additional query options
   * @returns Promise resolving to paginated games response
   *
   * @example
   * ```typescript
   * const publisherGames = await gamesService.getGamesByPublisher('publisher-id', {
   *   sortBy: 'averageRating',
   *   sortOrder: 'desc'
   * });
   * ```
   */
  async getGamesByPublisher(
    publisherId: string,
    options: Omit<GamesQuery, 'publisherId'> = {},
  ): Promise<PaginatedGamesResponse> {
    if (!publisherId) {
      throw new Error('Publisher ID is required');
    }

    return this.getAllGames({
      ...options,
      publisherId,
    });
  }

  /**
   * Get top-rated games
   *
   * @param options - Query options for customizing the results
   * @returns Promise resolving to paginated games response
   *
   * @example
   * ```typescript
   * const topGames = await gamesService.getTopRatedGames({
   *   limit: 50,
   *   minRating: 8.5
   * });
   * ```
   */
  async getTopRatedGames(options: GamesQuery = {}): Promise<PaginatedGamesResponse> {
    return this.getAllGames({
      ...options,
      sortBy: 'averageRating',
      sortOrder: 'desc',
      minRating: options.minRating || 7.0,
    });
  }

  /**
   * Get recently released games
   *
   * @param options - Query options for customizing the results
   * @returns Promise resolving to paginated games response
   *
   * @example
   * ```typescript
   * const recentGames = await gamesService.getRecentGames({
   *   limit: 20,
   *   status: 'RELEASED'
   * });
   * ```
   */
  async getRecentGames(options: GamesQuery = {}): Promise<PaginatedGamesResponse> {
    return this.getAllGames({
      ...options,
      sortBy: 'releaseDate',
      sortOrder: 'desc',
      status: options.status || 'RELEASED',
    });
  }

  /**
   * Get most popular games (by review count)
   *
   * @param options - Query options for customizing the results
   * @returns Promise resolving to paginated games response
   *
   * @example
   * ```typescript
   * const popularGames = await gamesService.getPopularGames({
   *   limit: 30
   * });
   * ```
   */
  async getPopularGames(options: GamesQuery = {}): Promise<PaginatedGamesResponse> {
    return this.getAllGames({
      ...options,
      sortBy: 'reviewCount',
      sortOrder: 'desc',
    });
  }
}

// ============================================================================
// Singleton Instance
// ============================================================================

/**
 * Default games service instance
 */
export const gamesService = new GamesService();

/**
 * Create a new games service instance (for testing purposes)
 */
export function createGamesService(): GamesService {
  return new GamesService();
}

// ============================================================================
// Named Exports for Individual Functions
// ============================================================================

export const {
  getAllGames,
  getGameBySlug,
  getSimilarGames,
  searchGames,
  getGamesByGenre,
  getGamesByPlatform,
  getGamesByDeveloper,
  getGamesByPublisher,
  getTopRatedGames,
  getRecentGames,
  getPopularGames,
} = gamesService;
