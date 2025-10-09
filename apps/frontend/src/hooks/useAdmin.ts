import { useEffect, useCallback } from 'react';
import { useStore } from '@nanostores/react';
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

import { AdminService } from '@/services/admin';
import {
  // Permission state
  $canAccessAdmin,
  $hasAdminPermissions,
  $hasModeratorPermissions,
  $adminPermissionLevel,

  // General admin state
  $adminLoading,
  $adminError,
  $adminSuccess,

  // User management state
  $adminUsers,
  $adminUserProfiles,
  $userManagementLoading,
  $userManagementError,
  $userManagementQuery,

  // Content management state
  $adminGames,
  $adminDevelopers,
  $adminPublishers,
  $adminGenres,
  $adminPlatforms,
  $contentManagementLoading,
  $contentManagementErrors,

  // Dashboard state
  $adminStats,
  $adminActivityLog,

  // Actions
  clearAdminMessages,
  setUserManagementQuery,
  clearAllAdminState,
} from '@/stores/admin';

// ============================================================================
// Types
// ============================================================================

interface UseAdminReturn {
  // Permission state
  canAccessAdmin: boolean;
  hasAdminPermissions: boolean;
  hasModeratorPermissions: boolean;
  permissionLevel: 'admin' | 'moderator' | 'none';

  // General state
  isLoading: boolean;
  error: string | null;
  success: string | null;

  // User management state
  users: PaginatedResponse<UserResponse> | null;
  userProfiles: Record<string, UserProfile>;
  userManagementLoading: boolean;
  userManagementError: string | null;
  userQuery: { search?: string; page: number; limit: number; role?: UserRole };

  // Content management state
  games: PaginatedResponse<GameResponse> | null;
  developers: PaginatedResponse<DeveloperResponse> | null;
  publishers: PaginatedResponse<PublisherResponse> | null;
  genres: PaginatedResponse<GenreResponse> | null;
  platforms: PaginatedResponse<PlatformResponse> | null;
  contentLoading: {
    games: boolean;
    developers: boolean;
    publishers: boolean;
    genres: boolean;
    platforms: boolean;
  };
  contentErrors: {
    games: string | null;
    developers: string | null;
    publishers: string | null;
    genres: string | null;
    platforms: string | null;
  };

  // Dashboard state
  dashboardStats: AdminDashboardStats | null;
  activityLog: Array<{
    id: string;
    action: string;
    resource: string;
    resourceId: string;
    userId: string;
    username: string;
    timestamp: Date;
    details?: Record<string, any>;
  }>;

  // User management actions
  getUsers: (query?: UsersQuery) => Promise<PaginatedResponse<UserResponse>>;
  getUserProfile: (userId: string) => Promise<UserProfile>;
  updateUserRole: (userId: string, role: UserRole) => Promise<UserResponse>;
  updateUser: (userId: string, updates: UpdateUserRequest) => Promise<UserResponse>;
  deleteUser: (userId: string) => Promise<void>;
  bulkDeleteUsers: (userIds: string[]) => Promise<void>;

  // Game management actions
  getGames: (query?: GamesQuery) => Promise<PaginatedResponse<GameResponse>>;
  createGame: (gameData: CreateGameRequest) => Promise<GameResponse>;
  updateGame: (gameId: string, updates: UpdateGameRequest) => Promise<GameResponse>;
  deleteGame: (gameId: string) => Promise<void>;

  // Developer management actions
  getDevelopers: (query?: DevelopersQuery) => Promise<PaginatedResponse<DeveloperResponse>>;
  createDeveloper: (developerData: CreateDeveloperRequest) => Promise<DeveloperResponse>;
  updateDeveloper: (
    developerId: string,
    updates: UpdateDeveloperRequest,
  ) => Promise<DeveloperResponse>;
  deleteDeveloper: (developerId: string) => Promise<void>;

  // Publisher management actions
  getPublishers: (query?: PublishersQuery) => Promise<PaginatedResponse<PublisherResponse>>;
  createPublisher: (publisherData: CreatePublisherRequest) => Promise<PublisherResponse>;
  updatePublisher: (
    publisherId: string,
    updates: UpdatePublisherRequest,
  ) => Promise<PublisherResponse>;
  deletePublisher: (publisherId: string) => Promise<void>;

  // Genre management actions
  getGenres: (query?: GenresQuery) => Promise<PaginatedResponse<GenreResponse>>;
  createGenre: (genreData: CreateGenreRequest) => Promise<GenreResponse>;
  updateGenre: (genreId: string, updates: UpdateGenreRequest) => Promise<GenreResponse>;
  deleteGenre: (genreId: string) => Promise<void>;

  // Platform management actions
  getPlatforms: (query?: PlatformsQuery) => Promise<PaginatedResponse<PlatformResponse>>;
  createPlatform: (platformData: CreatePlatformRequest) => Promise<PlatformResponse>;
  updatePlatform: (platformId: string, updates: UpdatePlatformRequest) => Promise<PlatformResponse>;
  deletePlatform: (platformId: string) => Promise<void>;

  // Dashboard actions
  getDashboardStats: () => Promise<AdminDashboardStats>;
  exportData: (type: 'users' | 'games' | 'reviews') => Promise<Blob>;

  // Utility actions
  setUserQuery: (query: { search?: string; page: number; limit: number; role?: UserRole }) => void;
  clearMessages: () => void;
  clearAllState: () => void;
}

// ============================================================================
// Hook Implementation
// ============================================================================

/**
 * Admin hook that provides admin state and actions
 * Automatically enforces permissions and provides role-based functionality
 *
 * @example
 * ```tsx
 * function AdminUserManagement() {
 *   const {
 *     canAccessAdmin,
 *     hasAdminPermissions,
 *     users,
 *     userManagementLoading,
 *     getUsers,
 *     updateUserRole,
 *     deleteUser
 *   } = useAdmin();
 *
 *   useEffect(() => {
 *     if (canAccessAdmin) {
 *       getUsers({ page: 1, limit: 20 });
 *     }
 *   }, [canAccessAdmin, getUsers]);
 *
 *   const handleRoleUpdate = async (userId: string, role: UserRole) => {
 *     if (hasAdminPermissions) {
 *       await updateUserRole(userId, role);
 *     }
 *   };
 *
 *   if (!canAccessAdmin) {
 *     return <AccessDenied />;
 *   }
 *
 *   return (
 *     <div>
 *       {userManagementLoading ? <Loading /> : <UsersList users={users} />}
 *     </div>
 *   );
 * }
 * ```
 */
export function useAdmin(): UseAdminReturn {
  // Subscribe to admin stores
  const canAccessAdmin = useStore($canAccessAdmin);
  const hasAdminPermissions = useStore($hasAdminPermissions);
  const hasModeratorPermissions = useStore($hasModeratorPermissions);
  const permissionLevel = useStore($adminPermissionLevel);

  const isLoading = useStore($adminLoading);
  const error = useStore($adminError);
  const success = useStore($adminSuccess);

  const users = useStore($adminUsers);
  const userProfiles = useStore($adminUserProfiles);
  const userManagementLoading = useStore($userManagementLoading);
  const userManagementError = useStore($userManagementError);
  const userQuery = useStore($userManagementQuery);

  const games = useStore($adminGames);
  const developers = useStore($adminDevelopers);
  const publishers = useStore($adminPublishers);
  const genres = useStore($adminGenres);
  const platforms = useStore($adminPlatforms);
  const contentLoading = useStore($contentManagementLoading);
  const contentErrors = useStore($contentManagementErrors);

  const dashboardStats = useStore($adminStats);
  const activityLog = useStore($adminActivityLog);

  // ============================================================================
  // User Management Actions
  // ============================================================================

  const getUsers = useCallback(
    async (query: UsersQuery = {}): Promise<PaginatedResponse<UserResponse>> => {
      return await AdminService.getUsers(query);
    },
    [],
  );

  const getUserProfile = useCallback(async (userId: string): Promise<UserProfile> => {
    return await AdminService.getUserProfile(userId);
  }, []);

  const updateUserRole = useCallback(
    async (userId: string, role: UserRole): Promise<UserResponse> => {
      if (!hasAdminPermissions) {
        throw new Error('Admin permissions required to update user roles');
      }
      return await AdminService.updateUserRole(userId, role);
    },
    [hasAdminPermissions],
  );

  const updateUser = useCallback(
    async (userId: string, updates: UpdateUserRequest): Promise<UserResponse> => {
      if (!hasAdminPermissions) {
        throw new Error('Admin permissions required to update users');
      }
      return await AdminService.updateUser(userId, updates);
    },
    [hasAdminPermissions],
  );

  const deleteUser = useCallback(
    async (userId: string): Promise<void> => {
      if (!hasAdminPermissions) {
        throw new Error('Admin permissions required to delete users');
      }
      await AdminService.deleteUser(userId);
    },
    [hasAdminPermissions],
  );

  const bulkDeleteUsers = useCallback(
    async (userIds: string[]): Promise<void> => {
      if (!hasAdminPermissions) {
        throw new Error('Admin permissions required for bulk operations');
      }
      await AdminService.bulkDeleteUsers(userIds);
    },
    [hasAdminPermissions],
  );

  // ============================================================================
  // Game Management Actions
  // ============================================================================

  const getGames = useCallback(
    async (query: GamesQuery = {}): Promise<PaginatedResponse<GameResponse>> => {
      return await AdminService.getGames(query);
    },
    [],
  );

  const createGame = useCallback(
    async (gameData: CreateGameRequest): Promise<GameResponse> => {
      if (!hasModeratorPermissions) {
        throw new Error('Moderator permissions required to create games');
      }
      return await AdminService.createGame(gameData);
    },
    [hasModeratorPermissions],
  );

  const updateGame = useCallback(
    async (gameId: string, updates: UpdateGameRequest): Promise<GameResponse> => {
      if (!hasModeratorPermissions) {
        throw new Error('Moderator permissions required to update games');
      }
      return await AdminService.updateGame(gameId, updates);
    },
    [hasModeratorPermissions],
  );

  const deleteGame = useCallback(
    async (gameId: string): Promise<void> => {
      if (!hasAdminPermissions) {
        throw new Error('Admin permissions required to delete games');
      }
      await AdminService.deleteGame(gameId);
    },
    [hasAdminPermissions],
  );

  // ============================================================================
  // Developer Management Actions
  // ============================================================================

  const getDevelopers = useCallback(
    async (query: DevelopersQuery = {}): Promise<PaginatedResponse<DeveloperResponse>> => {
      return await AdminService.getDevelopers(query);
    },
    [],
  );

  const createDeveloper = useCallback(
    async (developerData: CreateDeveloperRequest): Promise<DeveloperResponse> => {
      if (!hasModeratorPermissions) {
        throw new Error('Moderator permissions required to create developers');
      }
      return await AdminService.createDeveloper(developerData);
    },
    [hasModeratorPermissions],
  );

  const updateDeveloper = useCallback(
    async (developerId: string, updates: UpdateDeveloperRequest): Promise<DeveloperResponse> => {
      if (!hasModeratorPermissions) {
        throw new Error('Moderator permissions required to update developers');
      }
      return await AdminService.updateDeveloper(developerId, updates);
    },
    [hasModeratorPermissions],
  );

  const deleteDeveloper = useCallback(
    async (developerId: string): Promise<void> => {
      if (!hasAdminPermissions) {
        throw new Error('Admin permissions required to delete developers');
      }
      await AdminService.deleteDeveloper(developerId);
    },
    [hasAdminPermissions],
  );

  // ============================================================================
  // Publisher Management Actions
  // ============================================================================

  const getPublishers = useCallback(
    async (query: PublishersQuery = {}): Promise<PaginatedResponse<PublisherResponse>> => {
      return await AdminService.getPublishers(query);
    },
    [],
  );

  const createPublisher = useCallback(
    async (publisherData: CreatePublisherRequest): Promise<PublisherResponse> => {
      if (!hasModeratorPermissions) {
        throw new Error('Moderator permissions required to create publishers');
      }
      return await AdminService.createPublisher(publisherData);
    },
    [hasModeratorPermissions],
  );

  const updatePublisher = useCallback(
    async (publisherId: string, updates: UpdatePublisherRequest): Promise<PublisherResponse> => {
      if (!hasModeratorPermissions) {
        throw new Error('Moderator permissions required to update publishers');
      }
      return await AdminService.updatePublisher(publisherId, updates);
    },
    [hasModeratorPermissions],
  );

  const deletePublisher = useCallback(
    async (publisherId: string): Promise<void> => {
      if (!hasAdminPermissions) {
        throw new Error('Admin permissions required to delete publishers');
      }
      await AdminService.deletePublisher(publisherId);
    },
    [hasAdminPermissions],
  );

  // ============================================================================
  // Genre Management Actions
  // ============================================================================

  const getGenres = useCallback(
    async (query: GenresQuery = {}): Promise<PaginatedResponse<GenreResponse>> => {
      return await AdminService.getGenres(query);
    },
    [],
  );

  const createGenre = useCallback(
    async (genreData: CreateGenreRequest): Promise<GenreResponse> => {
      if (!hasModeratorPermissions) {
        throw new Error('Moderator permissions required to create genres');
      }
      return await AdminService.createGenre(genreData);
    },
    [hasModeratorPermissions],
  );

  const updateGenre = useCallback(
    async (genreId: string, updates: UpdateGenreRequest): Promise<GenreResponse> => {
      if (!hasModeratorPermissions) {
        throw new Error('Moderator permissions required to update genres');
      }
      return await AdminService.updateGenre(genreId, updates);
    },
    [hasModeratorPermissions],
  );

  const deleteGenre = useCallback(
    async (genreId: string): Promise<void> => {
      if (!hasAdminPermissions) {
        throw new Error('Admin permissions required to delete genres');
      }
      await AdminService.deleteGenre(genreId);
    },
    [hasAdminPermissions],
  );

  // ============================================================================
  // Platform Management Actions
  // ============================================================================

  const getPlatforms = useCallback(
    async (query: PlatformsQuery = {}): Promise<PaginatedResponse<PlatformResponse>> => {
      return await AdminService.getPlatforms(query);
    },
    [],
  );

  const createPlatform = useCallback(
    async (platformData: CreatePlatformRequest): Promise<PlatformResponse> => {
      if (!hasModeratorPermissions) {
        throw new Error('Moderator permissions required to create platforms');
      }
      return await AdminService.createPlatform(platformData);
    },
    [hasModeratorPermissions],
  );

  const updatePlatform = useCallback(
    async (platformId: string, updates: UpdatePlatformRequest): Promise<PlatformResponse> => {
      if (!hasModeratorPermissions) {
        throw new Error('Moderator permissions required to update platforms');
      }
      return await AdminService.updatePlatform(platformId, updates);
    },
    [hasModeratorPermissions],
  );

  const deletePlatform = useCallback(
    async (platformId: string): Promise<void> => {
      if (!hasAdminPermissions) {
        throw new Error('Admin permissions required to delete platforms');
      }
      await AdminService.deletePlatform(platformId);
    },
    [hasAdminPermissions],
  );

  // ============================================================================
  // Dashboard Actions
  // ============================================================================

  const getDashboardStats = useCallback(async (): Promise<AdminDashboardStats> => {
    if (!canAccessAdmin) {
      throw new Error('Admin access required to view dashboard stats');
    }
    return await AdminService.getDashboardStats();
  }, [canAccessAdmin]);

  const exportData = useCallback(
    async (type: 'users' | 'games' | 'reviews'): Promise<Blob> => {
      if (!hasAdminPermissions) {
        throw new Error('Admin permissions required to export data');
      }
      return await AdminService.exportData(type);
    },
    [hasAdminPermissions],
  );

  // ============================================================================
  // Utility Actions
  // ============================================================================

  const setUserQuery = useCallback(
    (query: { search?: string; page: number; limit: number; role?: UserRole }) => {
      setUserManagementQuery(query);
    },
    [],
  );

  const clearMessages = useCallback(() => {
    clearAdminMessages();
  }, []);

  const clearAllState = useCallback(() => {
    clearAllAdminState();
  }, []);

  // ============================================================================
  // Effects
  // ============================================================================

  // Auto-redirect if user loses admin access
  useEffect(() => {
    if (!canAccessAdmin && typeof window !== 'undefined') {
      // Only redirect if we were previously on an admin page
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/dashboard';
      }
    }
  }, [canAccessAdmin]);

  return {
    // Permission state
    canAccessAdmin,
    hasAdminPermissions,
    hasModeratorPermissions,
    permissionLevel,

    // General state
    isLoading,
    error,
    success,

    // User management state
    users,
    userProfiles,
    userManagementLoading,
    userManagementError,
    userQuery,

    // Content management state
    games,
    developers,
    publishers,
    genres,
    platforms,
    contentLoading,
    contentErrors,

    // Dashboard state
    dashboardStats,
    activityLog,

    // User management actions
    getUsers,
    getUserProfile,
    updateUserRole,
    updateUser,
    deleteUser,
    bulkDeleteUsers,

    // Game management actions
    getGames,
    createGame,
    updateGame,
    deleteGame,

    // Developer management actions
    getDevelopers,
    createDeveloper,
    updateDeveloper,
    deleteDeveloper,

    // Publisher management actions
    getPublishers,
    createPublisher,
    updatePublisher,
    deletePublisher,

    // Genre management actions
    getGenres,
    createGenre,
    updateGenre,
    deleteGenre,

    // Platform management actions
    getPlatforms,
    createPlatform,
    updatePlatform,
    deletePlatform,

    // Dashboard actions
    getDashboardStats,
    exportData,

    // Utility actions
    setUserQuery,
    clearMessages,
    clearAllState,
  };
}

// ============================================================================
// Specialized Admin Hooks
// ============================================================================

/**
 * Hook for admin-only routes - redirects if not admin
 */
export function useRequireAdmin(): UseAdminReturn {
  const admin = useAdmin();

  useEffect(() => {
    if (!admin.isLoading && !admin.hasAdminPermissions) {
      // Redirect to dashboard or unauthorized page
      if (typeof window !== 'undefined') {
        window.location.href = '/dashboard';
      }
    }
  }, [admin.hasAdminPermissions, admin.isLoading]);

  return admin;
}

/**
 * Hook for moderator+ routes - redirects if not moderator or admin
 */
export function useRequireModerator(): UseAdminReturn {
  const admin = useAdmin();

  useEffect(() => {
    if (!admin.isLoading && !admin.hasModeratorPermissions) {
      // Redirect to dashboard or unauthorized page
      if (typeof window !== 'undefined') {
        window.location.href = '/dashboard';
      }
    }
  }, [admin.hasModeratorPermissions, admin.isLoading]);

  return admin;
}

/**
 * Hook specifically for user management - provides only user-related state and actions
 */
export function useAdminUserManagement() {
  const {
    canAccessAdmin,
    hasAdminPermissions,
    users,
    userProfiles,
    userManagementLoading,
    userManagementError,
    userQuery,
    getUsers,
    getUserProfile,
    updateUserRole,
    updateUser,
    deleteUser,
    bulkDeleteUsers,
    setUserQuery,
  } = useAdmin();

  return {
    // State
    canAccessAdmin,
    hasAdminPermissions,
    users,
    userProfiles,
    isLoading: userManagementLoading,
    error: userManagementError,
    query: userQuery,

    // Actions
    getUsers,
    getUserProfile,
    updateUserRole,
    updateUser,
    deleteUser,
    bulkDeleteUsers,
    setQuery: setUserQuery,
  };
}

/**
 * Hook specifically for content management - provides only content-related state and actions
 */
export function useAdminContentManagement() {
  const {
    canAccessAdmin,
    hasAdminPermissions,
    hasModeratorPermissions,
    games,
    developers,
    publishers,
    genres,
    platforms,
    contentLoading,
    contentErrors,
    getGames,
    createGame,
    updateGame,
    deleteGame,
    getDevelopers,
    createDeveloper,
    updateDeveloper,
    deleteDeveloper,
    getPublishers,
    createPublisher,
    updatePublisher,
    deletePublisher,
    getGenres,
    createGenre,
    updateGenre,
    deleteGenre,
    getPlatforms,
    createPlatform,
    updatePlatform,
    deletePlatform,
  } = useAdmin();

  return {
    // State
    canAccessAdmin,
    hasAdminPermissions,
    hasModeratorPermissions,
    games,
    developers,
    publishers,
    genres,
    platforms,
    loading: contentLoading,
    errors: contentErrors,

    // Game actions
    getGames,
    createGame,
    updateGame,
    deleteGame,

    // Developer actions
    getDevelopers,
    createDeveloper,
    updateDeveloper,
    deleteDeveloper,

    // Publisher actions
    getPublishers,
    createPublisher,
    updatePublisher,
    deletePublisher,

    // Genre actions
    getGenres,
    createGenre,
    updateGenre,
    deleteGenre,

    // Platform actions
    getPlatforms,
    createPlatform,
    updatePlatform,
    deletePlatform,
  };
}
