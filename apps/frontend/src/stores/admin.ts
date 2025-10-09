import { atom, computed } from 'nanostores';
import { $isAdmin, $isModerator, $userRole } from './auth.ts';
import type {
  UserResponse,
  UserProfile,
  GameResponse,
  DeveloperResponse,
  PublisherResponse,
  GenreResponse,
  PlatformResponse,
  PaginatedResponse,
  UserRole,
  AdminDashboardStats,
} from '@questlog/shared-types';

// ============================================================================
// Admin Permission Checks
// ============================================================================

/**
 * Check if current user can access admin panel
 */
export const $canAccessAdmin = computed(
  [$isAdmin, $isModerator],
  (isAdmin, isModerator) => isAdmin || isModerator,
);

/**
 * Check if current user has admin-only permissions
 */
export const $hasAdminPermissions = computed($isAdmin, (isAdmin) => isAdmin);

/**
 * Check if current user has moderator permissions (including admin)
 */
export const $hasModeratorPermissions = computed(
  [$isAdmin, $isModerator],
  (isAdmin, isModerator) => isAdmin || isModerator,
);

/**
 * Get permission level for UI rendering
 */
export const $adminPermissionLevel = computed($userRole, (role) => {
  if (role === 'ADMIN') return 'admin';
  if (role === 'MODERATOR') return 'moderator';
  return 'none';
});

// ============================================================================
// Admin State Atoms
// ============================================================================

/**
 * General admin loading state
 */
export const $adminLoading = atom<boolean>(false);

/**
 * General admin error state
 */
export const $adminError = atom<string | null>(null);

/**
 * Admin operation success messages
 */
export const $adminSuccess = atom<string | null>(null);

// ============================================================================
// User Management State
// ============================================================================

/**
 * Admin users list with pagination
 */
export const $adminUsers = atom<PaginatedResponse<UserResponse> | null>(null);

/**
 * Detailed user profiles for admin management
 */
export const $adminUserProfiles = atom<Record<string, UserProfile>>({});

/**
 * User management loading state
 */
export const $userManagementLoading = atom<boolean>(false);

/**
 * User management error state
 */
export const $userManagementError = atom<string | null>(null);

/**
 * User management query state
 */
export const $userManagementQuery = atom<{
  search?: string;
  page: number;
  limit: number;
  role?: UserRole;
}>({
  page: 1,
  limit: 20,
});

// ============================================================================
// Content Management State (Games, Developers, etc.)
// ============================================================================

/**
 * Admin games list with pagination
 */
export const $adminGames = atom<PaginatedResponse<GameResponse> | null>(null);

/**
 * Admin content management loading states
 */
export const $contentManagementLoading = atom<{
  games: boolean;
  developers: boolean;
  publishers: boolean;
  genres: boolean;
  platforms: boolean;
}>({
  games: false,
  developers: false,
  publishers: false,
  genres: false,
  platforms: false,
});

/**
 * Admin content management error states
 */
export const $contentManagementErrors = atom<{
  games: string | null;
  developers: string | null;
  publishers: string | null;
  genres: string | null;
  platforms: string | null;
}>({
  games: null,
  developers: null,
  publishers: null,
  genres: null,
  platforms: null,
});

/**
 * Admin developers list
 */
export const $adminDevelopers = atom<PaginatedResponse<DeveloperResponse> | null>(null);

/**
 * Admin publishers list
 */
export const $adminPublishers = atom<PaginatedResponse<PublisherResponse> | null>(null);

/**
 * Admin genres list
 */
export const $adminGenres = atom<PaginatedResponse<GenreResponse> | null>(null);

/**
 * Admin platforms list
 */
export const $adminPlatforms = atom<PaginatedResponse<PlatformResponse> | null>(null);

// ============================================================================
// Admin Dashboard Stats
// ============================================================================

/**
 * Admin dashboard statistics
 */
export const $adminStats = atom<AdminDashboardStats | null>(null);

/**
 * Admin activity log
 */
export const $adminActivityLog = atom<
  Array<{
    id: string;
    action: string;
    resource: string;
    resourceId: string;
    userId: string;
    username: string;
    timestamp: Date;
    details?: Record<string, any>;
  }>
>([]);

// ============================================================================
// Admin State Actions - General
// ============================================================================

/**
 * Set general admin loading state
 */
export function setAdminLoading(loading: boolean): void {
  $adminLoading.set(loading);
  if (loading) {
    $adminError.set(null);
  }
}

/**
 * Set general admin error
 */
export function setAdminError(error: string | null): void {
  $adminError.set(error);
  $adminLoading.set(false);
}

/**
 * Set admin success message
 */
export function setAdminSuccess(message: string | null): void {
  $adminSuccess.set(message);
  if (message) {
    // Auto-clear success message after 5 seconds
    setTimeout(() => {
      if ($adminSuccess.get() === message) {
        $adminSuccess.set(null);
      }
    }, 5000);
  }
}

/**
 * Clear all admin messages
 */
export function clearAdminMessages(): void {
  $adminError.set(null);
  $adminSuccess.set(null);
}

// ============================================================================
// Admin State Actions - User Management
// ============================================================================

/**
 * Set admin users list
 */
export function setAdminUsers(users: PaginatedResponse<UserResponse> | null): void {
  $adminUsers.set(users);
  $userManagementError.set(null);
}

/**
 * Set admin user profile
 */
export function setAdminUserProfile(userId: string, profile: UserProfile): void {
  const current = $adminUserProfiles.get();
  $adminUserProfiles.set({
    ...current,
    [userId]: profile,
  });
}

/**
 * Update user in admin list
 */
export function updateAdminUser(userId: string, updates: Partial<UserResponse>): void {
  const currentUsers = $adminUsers.get();
  if (!currentUsers) return;

  const updatedItems = currentUsers.items.map((user) =>
    user.id === userId ? { ...user, ...updates } : user,
  );

  setAdminUsers({
    ...currentUsers,
    items: updatedItems,
  });

  // Also update in profiles cache if exists
  const currentProfiles = $adminUserProfiles.get();
  if (currentProfiles[userId]) {
    setAdminUserProfile(userId, {
      ...currentProfiles[userId],
      ...updates,
    });
  }
}

/**
 * Remove user from admin list
 */
export function removeAdminUser(userId: string): void {
  const currentUsers = $adminUsers.get();
  if (!currentUsers) return;

  const filteredItems = currentUsers.items.filter((user) => user.id !== userId);

  setAdminUsers({
    ...currentUsers,
    items: filteredItems,
    meta: {
      ...currentUsers.meta,
      total: currentUsers.meta.total - 1,
    },
  });

  // Remove from profiles cache
  const currentProfiles = $adminUserProfiles.get();
  const { [userId]: removed, ...remainingProfiles } = currentProfiles;
  $adminUserProfiles.set(remainingProfiles);
}

/**
 * Set user management loading state
 */
export function setUserManagementLoading(loading: boolean): void {
  $userManagementLoading.set(loading);
  if (loading) {
    $userManagementError.set(null);
  }
}

/**
 * Set user management error
 */
export function setUserManagementError(error: string | null): void {
  $userManagementError.set(error);
  $userManagementLoading.set(false);
}

/**
 * Set user management query
 */
export function setUserManagementQuery(query: {
  search?: string;
  page: number;
  limit: number;
  role?: UserRole;
}): void {
  $userManagementQuery.set(query);
}

// ============================================================================
// Admin State Actions - Content Management
// ============================================================================

/**
 * Set content management loading state for specific domain
 */
export function setContentManagementLoading(
  domain: keyof typeof $contentManagementLoading.value,
  loading: boolean,
): void {
  const current = $contentManagementLoading.get();
  $contentManagementLoading.set({
    ...current,
    [domain]: loading,
  });

  if (loading) {
    const currentErrors = $contentManagementErrors.get();
    $contentManagementErrors.set({
      ...currentErrors,
      [domain]: null,
    });
  }
}

/**
 * Set content management error for specific domain
 */
export function setContentManagementError(
  domain: keyof typeof $contentManagementErrors.value,
  error: string | null,
): void {
  const currentErrors = $contentManagementErrors.get();
  $contentManagementErrors.set({
    ...currentErrors,
    [domain]: error,
  });

  const currentLoading = $contentManagementLoading.get();
  $contentManagementLoading.set({
    ...currentLoading,
    [domain]: false,
  });
}

/**
 * Set admin games list
 */
export function setAdminGames(games: PaginatedResponse<GameResponse> | null): void {
  $adminGames.set(games);
  setContentManagementError('games', null);
}

/**
 * Set admin developers list
 */
export function setAdminDevelopers(developers: PaginatedResponse<DeveloperResponse> | null): void {
  $adminDevelopers.set(developers);
  setContentManagementError('developers', null);
}

/**
 * Set admin publishers list
 */
export function setAdminPublishers(publishers: PaginatedResponse<PublisherResponse> | null): void {
  $adminPublishers.set(publishers);
  setContentManagementError('publishers', null);
}

/**
 * Set admin genres list
 */
export function setAdminGenres(genres: PaginatedResponse<GenreResponse> | null): void {
  $adminGenres.set(genres);
  setContentManagementError('genres', null);
}

/**
 * Set admin platforms list
 */
export function setAdminPlatforms(platforms: PaginatedResponse<PlatformResponse> | null): void {
  $adminPlatforms.set(platforms);
  setContentManagementError('platforms', null);
}

// ============================================================================
// Admin State Actions - Dashboard
// ============================================================================

/**
 * Set admin dashboard stats
 */
export function setAdminStats(stats: AdminDashboardStats | null): void {
  $adminStats.set(stats);
}

/**
 * Set admin activity log
 */
export function setAdminActivityLog(log: typeof $adminActivityLog.value): void {
  $adminActivityLog.set(log);
}

/**
 * Add activity log entry
 */
export function addAdminActivityLogEntry(entry: (typeof $adminActivityLog.value)[0]): void {
  const currentLog = $adminActivityLog.get();
  $adminActivityLog.set([entry, ...currentLog.slice(0, 49)]); // Keep last 50 entries
}

// ============================================================================
// Admin State Helpers
// ============================================================================

/**
 * Check if user can perform admin action based on role requirement
 */
export function canPerformAdminAction(requiredRole: 'ADMIN' | 'MODERATOR'): boolean {
  const currentRole = $userRole.get();
  if (!currentRole) return false;

  if (requiredRole === 'ADMIN') {
    return currentRole === 'ADMIN';
  }

  if (requiredRole === 'MODERATOR') {
    return currentRole === 'ADMIN' || currentRole === 'MODERATOR';
  }

  return false;
}

/**
 * Get admin user by ID from cache
 */
export function getAdminUser(userId: string): UserResponse | null {
  const adminUsers = $adminUsers.get();
  if (!adminUsers) return null;
  return adminUsers.items.find((user) => user.id === userId) || null;
}

/**
 * Get admin user profile by ID from cache
 */
export function getAdminUserProfile(userId: string): UserProfile | null {
  return $adminUserProfiles.get()[userId] || null;
}

/**
 * Check if any content management operation is loading
 */
export const $isAnyContentLoading = computed($contentManagementLoading, (loading) => {
  return Object.values(loading).some(Boolean);
});

/**
 * Get all content management errors
 */
export const $contentManagementErrorsArray = computed($contentManagementErrors, (errors) => {
  return Object.entries(errors)
    .filter(([, error]) => error !== null)
    .map(([domain, error]) => ({ domain, error }));
});

/**
 * Clear all admin state
 */
export function clearAllAdminState(): void {
  $adminLoading.set(false);
  $adminError.set(null);
  $adminSuccess.set(null);
  $adminUsers.set(null);
  $adminUserProfiles.set({});
  $userManagementLoading.set(false);
  $userManagementError.set(null);
  $userManagementQuery.set({ page: 1, limit: 20 });
  $adminGames.set(null);
  $adminDevelopers.set(null);
  $adminPublishers.set(null);
  $adminGenres.set(null);
  $adminPlatforms.set(null);
  $contentManagementLoading.set({
    games: false,
    developers: false,
    publishers: false,
    genres: false,
    platforms: false,
  });
  $contentManagementErrors.set({
    games: null,
    developers: null,
    publishers: null,
    genres: null,
    platforms: null,
  });
  $adminStats.set(null);
  $adminActivityLog.set([]);
}
