import { apiClient } from './api.ts';
import type {
  UserResponse,
  UserProfile,
  UserRole,
  UpdateUserRequest,
  UsersQuery,
  GameResponse,
  CreateGameRequest,
  UpdateGameRequest,
  GamesQuery,
  DeveloperResponse,
  CreateDeveloperRequest,
  UpdateDeveloperRequest,
  DevelopersQuery,
  PublisherResponse,
  CreatePublisherRequest,
  UpdatePublisherRequest,
  PublishersQuery,
  GenreResponse,
  CreateGenreRequest,
  UpdateGenreRequest,
  GenresQuery,
  PlatformResponse,
  CreatePlatformRequest,
  UpdatePlatformRequest,
  PlatformsQuery,
  PaginatedResponse,
  AdminDashboardStats,
} from '@questlog/shared-types';

import {
  setAdminLoading,
  setAdminError,
  setAdminSuccess,
  setAdminUsers,
  setUserManagementLoading,
  setUserManagementError,
  updateAdminUser,
  removeAdminUser,
  setAdminGames,
  setAdminDevelopers,
  setAdminPublishers,
  setAdminGenres,
  setAdminPlatforms,
  setContentManagementLoading,
  setContentManagementError,
  setAdminStats,
  addAdminActivityLogEntry,
} from '@/stores/admin.ts';

// ============================================================================
// Admin Service Class
// ============================================================================

/**
 * Service for admin-specific API operations that require ADMIN or MODERATOR roles
 * Mirrors the backend's role-based access control patterns
 */
export class AdminService {
  // ============================================================================
  // User Management (ADMIN only)
  // ============================================================================

  /**
   * Get all users for admin management
   * Requires ADMIN role
   */
  static async getUsers(query: UsersQuery = {}): Promise<PaginatedResponse<UserResponse>> {
    setUserManagementLoading(true);

    try {
      const params = new URLSearchParams();
      if (query.page) params.append('page', query.page.toString());
      if (query.limit) params.append('limit', query.limit.toString());
      if (query.search) params.append('search', query.search);

      const response = await apiClient.get<PaginatedResponse<UserResponse>>(
        `users?${params.toString()}`,
      );

      setAdminUsers(response);
      return response;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch users';
      setUserManagementError(message);
      throw error;
    }
  }

  /**
   * Get detailed user profile for admin management
   * Requires ADMIN role
   */
  static async getUserProfile(userId: string): Promise<UserProfile> {
    setUserManagementLoading(true);

    try {
      const response = await apiClient.get<UserProfile>(`users/${userId}`);
      return response;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch user profile';
      setUserManagementError(message);
      throw error;
    }
  }

  /**
   * Update user role (ADMIN only)
   * Endpoint: PATCH /users/:id/role
   */
  static async updateUserRole(userId: string, role: UserRole): Promise<UserResponse> {
    setUserManagementLoading(true);

    try {
      const response = await apiClient.patch<UserResponse>(`users/${userId}/role`, { role });

      updateAdminUser(userId, { ...response });
      setAdminSuccess(`User role updated to ${role}`);

      // Log admin activity
      addAdminActivityLogEntry({
        id: crypto.randomUUID(),
        action: 'UPDATE_USER_ROLE',
        resource: 'user',
        resourceId: userId,
        userId: '', // Will be filled by auth context
        username: '', // Will be filled by auth context
        timestamp: new Date(),
        details: { newRole: role },
      });

      return response;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update user role';
      setUserManagementError(message);
      throw error;
    }
  }

  /**
   * Delete user (ADMIN only)
   * Endpoint: DELETE /users/:id
   */
  static async deleteUser(userId: string): Promise<void> {
    setUserManagementLoading(true);

    try {
      await apiClient.delete<void>(`users/${userId}`);

      removeAdminUser(userId);
      setAdminSuccess('User deleted successfully');

      // Log admin activity
      addAdminActivityLogEntry({
        id: crypto.randomUUID(),
        action: 'DELETE_USER',
        resource: 'user',
        resourceId: userId,
        userId: '', // Will be filled by auth context
        username: '', // Will be filled by auth context
        timestamp: new Date(),
        details: {},
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete user';
      setUserManagementError(message);
      throw error;
    }
  }

  /**
   * Update user information (ADMIN only)
   * Endpoint: PATCH /users/:id
   */
  static async updateUser(userId: string, updates: UpdateUserRequest): Promise<UserResponse> {
    setUserManagementLoading(true);

    try {
      const response = await apiClient.patch<UserResponse>(`users/${userId}`, updates);

      updateAdminUser(userId, response);
      setAdminSuccess('User updated successfully');

      // Log admin activity
      addAdminActivityLogEntry({
        id: crypto.randomUUID(),
        action: 'UPDATE_USER',
        resource: 'user',
        resourceId: userId,
        userId: '', // Will be filled by auth context
        username: '', // Will be filled by auth context
        timestamp: new Date(),
        details: { updates },
      });

      return response;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update user';
      setUserManagementError(message);
      throw error;
    }
  }

  // ============================================================================
  // Game Management (ADMIN/MODERATOR)
  // ============================================================================

  /**
   * Create new game (ADMIN/MODERATOR)
   * Endpoint: POST /games
   */
  static async createGame(gameData: CreateGameRequest): Promise<GameResponse> {
    setContentManagementLoading('games', true);

    try {
      const response = await apiClient.post<GameResponse>('games', gameData);

      // Refresh games list
      await this.getGames({ page: 1, limit: 20 });
      setAdminSuccess('Game created successfully');

      // Log admin activity
      addAdminActivityLogEntry({
        id: crypto.randomUUID(),
        action: 'CREATE_GAME',
        resource: 'game',
        resourceId: response.game.id,
        userId: '', // Will be filled by auth context
        username: '', // Will be filled by auth context
        timestamp: new Date(),
        details: { title: gameData.title },
      });

      return response;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create game';
      setContentManagementError('games', message);
      throw error;
    }
  }

  /**
   * Update game (ADMIN/MODERATOR)
   * Endpoint: PATCH /games/:id
   */
  static async updateGame(gameId: string, updates: UpdateGameRequest): Promise<GameResponse> {
    setContentManagementLoading('games', true);

    try {
      const response = await apiClient.patch<GameResponse>(`games/${gameId}`, updates);

      // Refresh games list
      await this.getGames({ page: 1, limit: 20 });
      setAdminSuccess('Game updated successfully');

      // Log admin activity
      addAdminActivityLogEntry({
        id: crypto.randomUUID(),
        action: 'UPDATE_GAME',
        resource: 'game',
        resourceId: gameId,
        userId: '', // Will be filled by auth context
        username: '', // Will be filled by auth context
        timestamp: new Date(),
        details: { updates },
      });

      return response;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update game';
      setContentManagementError('games', message);
      throw error;
    }
  }

  /**
   * Delete game (ADMIN only)
   * Endpoint: DELETE /games/:id
   */
  static async deleteGame(gameId: string): Promise<void> {
    setContentManagementLoading('games', true);

    try {
      await apiClient.delete<void>(`games/${gameId}`);

      // Refresh games list
      await this.getGames({ page: 1, limit: 20 });
      setAdminSuccess('Game deleted successfully');

      // Log admin activity
      addAdminActivityLogEntry({
        id: crypto.randomUUID(),
        action: 'DELETE_GAME',
        resource: 'game',
        resourceId: gameId,
        userId: '', // Will be filled by auth context
        username: '', // Will be filled by auth context
        timestamp: new Date(),
        details: {},
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete game';
      setContentManagementError('games', message);
      throw error;
    }
  }

  /**
   * Get games for admin management
   */
  static async getGames(query: GamesQuery = {}): Promise<PaginatedResponse<GameResponse>> {
    setContentManagementLoading('games', true);

    try {
      const params = new URLSearchParams();
      if (query.page) params.append('page', query.page.toString());
      if (query.limit) params.append('limit', query.limit.toString());
      if (query.search) params.append('search', query.search);
      if (query.sortBy) params.append('sortBy', query.sortBy);
      if (query.sortOrder) params.append('sortOrder', query.sortOrder);

      const response = await apiClient.get<PaginatedResponse<GameResponse>>(
        `games?${params.toString()}`,
      );

      setAdminGames(response);
      return response;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch games';
      setContentManagementError('games', message);
      throw error;
    }
  }

  // ============================================================================
  // Developer Management (ADMIN/MODERATOR)
  // ============================================================================

  /**
   * Create developer (ADMIN/MODERATOR)
   * Endpoint: POST /games/developers
   */
  static async createDeveloper(developerData: CreateDeveloperRequest): Promise<DeveloperResponse> {
    setContentManagementLoading('developers', true);

    try {
      const response = await apiClient.post<DeveloperResponse>('games/developers', developerData);

      // Refresh developers list
      await this.getDevelopers({ page: 1, limit: 20 });
      setAdminSuccess('Developer created successfully');

      // Log admin activity
      addAdminActivityLogEntry({
        id: crypto.randomUUID(),
        action: 'CREATE_DEVELOPER',
        resource: 'developer',
        resourceId: response.id,
        userId: '', // Will be filled by auth context
        username: '', // Will be filled by auth context
        timestamp: new Date(),
        details: { name: developerData.name },
      });

      return response;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create developer';
      setContentManagementError('developers', message);
      throw error;
    }
  }

  /**
   * Update developer (ADMIN/MODERATOR)
   * Endpoint: PATCH /games/developers/:id
   */
  static async updateDeveloper(
    developerId: string,
    updates: UpdateDeveloperRequest,
  ): Promise<DeveloperResponse> {
    setContentManagementLoading('developers', true);

    try {
      const response = await apiClient.patch<DeveloperResponse>(
        `games/developers/${developerId}`,
        updates,
      );

      // Refresh developers list
      await this.getDevelopers({ page: 1, limit: 20 });
      setAdminSuccess('Developer updated successfully');

      // Log admin activity
      addAdminActivityLogEntry({
        id: crypto.randomUUID(),
        action: 'UPDATE_DEVELOPER',
        resource: 'developer',
        resourceId: developerId,
        userId: '', // Will be filled by auth context
        username: '', // Will be filled by auth context
        timestamp: new Date(),
        details: { updates },
      });

      return response;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update developer';
      setContentManagementError('developers', message);
      throw error;
    }
  }

  /**
   * Delete developer (ADMIN only)
   * Endpoint: DELETE /games/developers/:id
   */
  static async deleteDeveloper(developerId: string): Promise<void> {
    setContentManagementLoading('developers', true);

    try {
      await apiClient.delete<void>(`games/developers/${developerId}`);

      // Refresh developers list
      await this.getDevelopers({ page: 1, limit: 20 });
      setAdminSuccess('Developer deleted successfully');

      // Log admin activity
      addAdminActivityLogEntry({
        id: crypto.randomUUID(),
        action: 'DELETE_DEVELOPER',
        resource: 'developer',
        resourceId: developerId,
        userId: '', // Will be filled by auth context
        username: '', // Will be filled by auth context
        timestamp: new Date(),
        details: {},
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete developer';
      setContentManagementError('developers', message);
      throw error;
    }
  }

  /**
   * Get developers for admin management
   */
  static async getDevelopers(
    query: DevelopersQuery = {},
  ): Promise<PaginatedResponse<DeveloperResponse>> {
    setContentManagementLoading('developers', true);

    try {
      const params = new URLSearchParams();
      if (query.page) params.append('page', query.page.toString());
      if (query.limit) params.append('limit', query.limit.toString());
      if (query.search) params.append('search', query.search);

      const response = await apiClient.get<PaginatedResponse<DeveloperResponse>>(
        `games/developers?${params.toString()}`,
      );

      setAdminDevelopers(response);
      return response;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch developers';
      setContentManagementError('developers', message);
      throw error;
    }
  }

  // ============================================================================
  // Publisher Management (ADMIN/MODERATOR)
  // ============================================================================

  /**
   * Create publisher (ADMIN/MODERATOR)
   * Endpoint: POST /games/publishers
   */
  static async createPublisher(publisherData: CreatePublisherRequest): Promise<PublisherResponse> {
    setContentManagementLoading('publishers', true);

    try {
      const response = await apiClient.post<PublisherResponse>('games/publishers', publisherData);

      // Refresh publishers list
      await this.getPublishers({ page: 1, limit: 20 });
      setAdminSuccess('Publisher created successfully');

      // Log admin activity
      addAdminActivityLogEntry({
        id: crypto.randomUUID(),
        action: 'CREATE_PUBLISHER',
        resource: 'publisher',
        resourceId: response.id,
        userId: '', // Will be filled by auth context
        username: '', // Will be filled by auth context
        timestamp: new Date(),
        details: { name: publisherData.name },
      });

      return response;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create publisher';
      setContentManagementError('publishers', message);
      throw error;
    }
  }

  /**
   * Update publisher (ADMIN/MODERATOR)
   * Endpoint: PATCH /games/publishers/:id
   */
  static async updatePublisher(
    publisherId: string,
    updates: UpdatePublisherRequest,
  ): Promise<PublisherResponse> {
    setContentManagementLoading('publishers', true);

    try {
      const response = await apiClient.patch<PublisherResponse>(
        `games/publishers/${publisherId}`,
        updates,
      );

      // Refresh publishers list
      await this.getPublishers({ page: 1, limit: 20 });
      setAdminSuccess('Publisher updated successfully');

      // Log admin activity
      addAdminActivityLogEntry({
        id: crypto.randomUUID(),
        action: 'UPDATE_PUBLISHER',
        resource: 'publisher',
        resourceId: publisherId,
        userId: '', // Will be filled by auth context
        username: '', // Will be filled by auth context
        timestamp: new Date(),
        details: { updates },
      });

      return response;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update publisher';
      setContentManagementError('publishers', message);
      throw error;
    }
  }

  /**
   * Delete publisher (ADMIN only)
   * Endpoint: DELETE /games/publishers/:id
   */
  static async deletePublisher(publisherId: string): Promise<void> {
    setContentManagementLoading('publishers', true);

    try {
      await apiClient.delete<void>(`games/publishers/${publisherId}`);

      // Refresh publishers list
      await this.getPublishers({ page: 1, limit: 20 });
      setAdminSuccess('Publisher deleted successfully');

      // Log admin activity
      addAdminActivityLogEntry({
        id: crypto.randomUUID(),
        action: 'DELETE_PUBLISHER',
        resource: 'publisher',
        resourceId: publisherId,
        userId: '', // Will be filled by auth context
        username: '', // Will be filled by auth context
        timestamp: new Date(),
        details: {},
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete publisher';
      setContentManagementError('publishers', message);
      throw error;
    }
  }

  /**
   * Get publishers for admin management
   */
  static async getPublishers(
    query: PublishersQuery = {},
  ): Promise<PaginatedResponse<PublisherResponse>> {
    setContentManagementLoading('publishers', true);

    try {
      const params = new URLSearchParams();
      if (query.page) params.append('page', query.page.toString());
      if (query.limit) params.append('limit', query.limit.toString());
      if (query.search) params.append('search', query.search);

      const response = await apiClient.get<PaginatedResponse<PublisherResponse>>(
        `games/publishers?${params.toString()}`,
      );

      setAdminPublishers(response);
      return response;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch publishers';
      setContentManagementError('publishers', message);
      throw error;
    }
  }

  // ============================================================================
  // Genre Management (ADMIN/MODERATOR)
  // ============================================================================

  /**
   * Create genre (ADMIN/MODERATOR)
   * Endpoint: POST /games/genres
   */
  static async createGenre(genreData: CreateGenreRequest): Promise<GenreResponse> {
    setContentManagementLoading('genres', true);

    try {
      const response = await apiClient.post<GenreResponse>('games/genres', genreData);

      // Refresh genres list
      await this.getGenres({ page: 1, limit: 20 });
      setAdminSuccess('Genre created successfully');

      // Log admin activity
      addAdminActivityLogEntry({
        id: crypto.randomUUID(),
        action: 'CREATE_GENRE',
        resource: 'genre',
        resourceId: response.id,
        userId: '', // Will be filled by auth context
        username: '', // Will be filled by auth context
        timestamp: new Date(),
        details: { name: genreData.name },
      });

      return response;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create genre';
      setContentManagementError('genres', message);
      throw error;
    }
  }

  /**
   * Update genre (ADMIN/MODERATOR)
   * Endpoint: PATCH /games/genres/:id
   */
  static async updateGenre(genreId: string, updates: UpdateGenreRequest): Promise<GenreResponse> {
    setContentManagementLoading('genres', true);

    try {
      const response = await apiClient.patch<GenreResponse>(`games/genres/${genreId}`, updates);

      // Refresh genres list
      await this.getGenres({ page: 1, limit: 20 });
      setAdminSuccess('Genre updated successfully');

      // Log admin activity
      addAdminActivityLogEntry({
        id: crypto.randomUUID(),
        action: 'UPDATE_GENRE',
        resource: 'genre',
        resourceId: genreId,
        userId: '', // Will be filled by auth context
        username: '', // Will be filled by auth context
        timestamp: new Date(),
        details: { updates },
      });

      return response;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update genre';
      setContentManagementError('genres', message);
      throw error;
    }
  }

  /**
   * Delete genre (ADMIN only)
   * Endpoint: DELETE /games/genres/:id
   */
  static async deleteGenre(genreId: string): Promise<void> {
    setContentManagementLoading('genres', true);

    try {
      await apiClient.delete<void>(`games/genres/${genreId}`);

      // Refresh genres list
      await this.getGenres({ page: 1, limit: 20 });
      setAdminSuccess('Genre deleted successfully');

      // Log admin activity
      addAdminActivityLogEntry({
        id: crypto.randomUUID(),
        action: 'DELETE_GENRE',
        resource: 'genre',
        resourceId: genreId,
        userId: '', // Will be filled by auth context
        username: '', // Will be filled by auth context
        timestamp: new Date(),
        details: {},
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete genre';
      setContentManagementError('genres', message);
      throw error;
    }
  }

  /**
   * Get genres for admin management
   */
  static async getGenres(query: GenresQuery = {}): Promise<PaginatedResponse<GenreResponse>> {
    setContentManagementLoading('genres', true);

    try {
      const params = new URLSearchParams();
      if (query.page) params.append('page', query.page.toString());
      if (query.limit) params.append('limit', query.limit.toString());
      if (query.search) params.append('search', query.search);

      const response = await apiClient.get<PaginatedResponse<GenreResponse>>(
        `games/genres?${params.toString()}`,
      );

      setAdminGenres(response);
      return response;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch genres';
      setContentManagementError('genres', message);
      throw error;
    }
  }

  // ============================================================================
  // Platform Management (ADMIN/MODERATOR)
  // ============================================================================

  /**
   * Create platform (ADMIN/MODERATOR)
   * Endpoint: POST /games/platforms
   */
  static async createPlatform(platformData: CreatePlatformRequest): Promise<PlatformResponse> {
    setContentManagementLoading('platforms', true);

    try {
      const response = await apiClient.post<PlatformResponse>('games/platforms', platformData);

      // Refresh platforms list
      await this.getPlatforms({ page: 1, limit: 20 });
      setAdminSuccess('Platform created successfully');

      // Log admin activity
      addAdminActivityLogEntry({
        id: crypto.randomUUID(),
        action: 'CREATE_PLATFORM',
        resource: 'platform',
        resourceId: response.id,
        userId: '', // Will be filled by auth context
        username: '', // Will be filled by auth context
        timestamp: new Date(),
        details: { name: platformData.name },
      });

      return response;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create platform';
      setContentManagementError('platforms', message);
      throw error;
    }
  }

  /**
   * Update platform (ADMIN/MODERATOR)
   * Endpoint: PATCH /games/platforms/:id
   */
  static async updatePlatform(
    platformId: string,
    updates: UpdatePlatformRequest,
  ): Promise<PlatformResponse> {
    setContentManagementLoading('platforms', true);

    try {
      const response = await apiClient.patch<PlatformResponse>(
        `games/platforms/${platformId}`,
        updates,
      );

      // Refresh platforms list
      await this.getPlatforms({ page: 1, limit: 20 });
      setAdminSuccess('Platform updated successfully');

      // Log admin activity
      addAdminActivityLogEntry({
        id: crypto.randomUUID(),
        action: 'UPDATE_PLATFORM',
        resource: 'platform',
        resourceId: platformId,
        userId: '', // Will be filled by auth context
        username: '', // Will be filled by auth context
        timestamp: new Date(),
        details: { updates },
      });

      return response;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update platform';
      setContentManagementError('platforms', message);
      throw error;
    }
  }

  /**
   * Delete platform (ADMIN only)
   * Endpoint: DELETE /games/platforms/:id
   */
  static async deletePlatform(platformId: string): Promise<void> {
    setContentManagementLoading('platforms', true);

    try {
      await apiClient.delete<void>(`games/platforms/${platformId}`);

      // Refresh platforms list
      await this.getPlatforms({ page: 1, limit: 20 });
      setAdminSuccess('Platform deleted successfully');

      // Log admin activity
      addAdminActivityLogEntry({
        id: crypto.randomUUID(),
        action: 'DELETE_PLATFORM',
        resource: 'platform',
        resourceId: platformId,
        userId: '', // Will be filled by auth context
        username: '', // Will be filled by auth context
        timestamp: new Date(),
        details: {},
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete platform';
      setContentManagementError('platforms', message);
      throw error;
    }
  }

  /**
   * Get platforms for admin management
   */
  static async getPlatforms(
    query: PlatformsQuery = {},
  ): Promise<PaginatedResponse<PlatformResponse>> {
    setContentManagementLoading('platforms', true);

    try {
      const params = new URLSearchParams();
      if (query.page) params.append('page', query.page.toString());
      if (query.limit) params.append('limit', query.limit.toString());
      if (query.search) params.append('search', query.search);

      const response = await apiClient.get<PaginatedResponse<PlatformResponse>>(
        `games/platforms?${params.toString()}`,
      );

      setAdminPlatforms(response);
      return response;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch platforms';
      setContentManagementError('platforms', message);
      throw error;
    }
  }

  // ============================================================================
  // Dashboard & Stats
  // ============================================================================

  /**
   * Get admin dashboard statistics
   * Requires ADMIN or MODERATOR role
   */
  static async getDashboardStats(): Promise<AdminDashboardStats> {
    setAdminLoading(true);

    try {
      // This would be a custom endpoint for admin stats
      const response = await apiClient.get<AdminDashboardStats>('admin/stats');

      setAdminStats(response);
      return response;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch dashboard stats';
      setAdminError(message);
      throw error;
    }
  }

  // ============================================================================
  // Utility Methods
  // ============================================================================

  /**
   * Bulk actions for admin operations
   */
  static async bulkDeleteUsers(userIds: string[]): Promise<void> {
    setAdminLoading(true);

    try {
      await apiClient.post<void>('admin/users/bulk-delete', { userIds });

      // Refresh users list
      await this.getUsers({ page: 1, limit: 20 });
      setAdminSuccess(`${userIds.length} users deleted successfully`);

      // Log admin activity
      addAdminActivityLogEntry({
        id: crypto.randomUUID(),
        action: 'BULK_DELETE_USERS',
        resource: 'user',
        resourceId: userIds.join(','),
        userId: '', // Will be filled by auth context
        username: '', // Will be filled by auth context
        timestamp: new Date(),
        details: { count: userIds.length },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete users';
      setAdminError(message);
      throw error;
    }
  }

  /**
   * Export admin data
   */
  static async exportData(type: 'users' | 'games' | 'reviews'): Promise<Blob> {
    setAdminLoading(true);

    try {
      // Use apiClient to make the request properly
      const response = await apiClient.get<Blob>(`admin/export/${type}`);
      setAdminSuccess(`${type} data exported successfully`);
      return response;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to export data';
      setAdminError(message);
      throw error;
    }
  }
}
