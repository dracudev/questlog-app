import { atom } from 'nanostores';
import type { UserResponse, UserProfile, PaginatedResponse } from '@questlog/shared-types';

// ============================================================================
// Users State
// ============================================================================

/**
 * Current user's detailed profile (includes private info like email)
 */
export const $currentUserProfile = atom<UserProfile | null>(null);

/**
 * Cache of user profiles by user ID
 */
export const $userProfiles = atom<Record<string, UserProfile>>({});

/**
 * Cache of basic user data by user ID
 */
export const $users = atom<Record<string, UserResponse>>({});

/**
 * Paginated users list (for user directory/search)
 */
export const $usersList = atom<PaginatedResponse<UserResponse> | null>(null);

/**
 * Users loading state
 */
export const $usersLoading = atom<boolean>(false);

/**
 * Users error state
 */
export const $usersError = atom<string | null>(null);

/**
 * Current users query/filter state
 */
export const $usersQuery = atom<{ search?: string; page: number; limit: number }>({
  page: 1,
  limit: 20,
});

/**
 * Profile update loading state
 */
export const $profileUpdateLoading = atom<boolean>(false);

/**
 * Profile update error state
 */
export const $profileUpdateError = atom<string | null>(null);

/**
 * Username availability cache
 */
export const $usernameAvailability = atom<Record<string, boolean>>({});

// ============================================================================
// Users State Actions
// ============================================================================

/**
 * Set current user's profile
 */
export function setCurrentUserProfile(profile: UserProfile | null): void {
  $currentUserProfile.set(profile);
  $profileUpdateError.set(null);
}

/**
 * Set user profile in cache
 */
export function setUserProfile(userId: string, profile: UserProfile): void {
  const current = $userProfiles.get();
  $userProfiles.set({
    ...current,
    [userId]: profile,
  });
}

/**
 * Set user data in cache
 */
export function setUser(userId: string, user: UserResponse): void {
  const current = $users.get();
  $users.set({
    ...current,
    [userId]: user,
  });
}

/**
 * Set users list with pagination
 */
export function setUsersList(usersList: PaginatedResponse<UserResponse> | null): void {
  $usersList.set(usersList);
  $usersError.set(null);
}

/**
 * Append users to current list (for pagination)
 */
export function appendUsersList(newUsers: PaginatedResponse<UserResponse>): void {
  const currentList = $usersList.get();

  if (!currentList) {
    setUsersList(newUsers);
    return;
  }

  const updatedList: PaginatedResponse<UserResponse> = {
    ...newUsers,
    items: [...currentList.items, ...newUsers.items],
  };

  setUsersList(updatedList);
}

/**
 * Set users loading state
 */
export function setUsersLoading(loading: boolean): void {
  $usersLoading.set(loading);
  if (loading) {
    $usersError.set(null);
  }
}

/**
 * Set users error
 */
export function setUsersError(error: string | null): void {
  $usersError.set(error);
  $usersLoading.set(false);
}

/**
 * Set users query/filter state
 */
export function setUsersQuery(query: { search?: string; page: number; limit: number }): void {
  $usersQuery.set(query);
}

/**
 * Set profile update loading state
 */
export function setProfileUpdateLoading(loading: boolean): void {
  $profileUpdateLoading.set(loading);
  if (loading) {
    $profileUpdateError.set(null);
  }
}

/**
 * Set profile update error
 */
export function setProfileUpdateError(error: string | null): void {
  $profileUpdateError.set(error);
  $profileUpdateLoading.set(false);
}

/**
 * Set username availability
 */
export function setUsernameAvailability(username: string, isAvailable: boolean): void {
  const current = $usernameAvailability.get();
  $usernameAvailability.set({
    ...current,
    [username.toLowerCase()]: isAvailable,
  });
}

/**
 * Update current user profile with partial data
 */
export function updateCurrentUserProfile(updates: Partial<UserProfile>): void {
  const currentProfile = $currentUserProfile.get();
  if (currentProfile) {
    const updatedProfile = { ...currentProfile, ...updates };
    setCurrentUserProfile(updatedProfile);
  }
}

/**
 * Update user in cache
 */
export function updateUser(userId: string, updates: Partial<UserResponse>): void {
  const current = $users.get();
  const existingUser = current[userId];

  if (existingUser) {
    const updatedUser = { ...existingUser, ...updates };
    setUser(userId, updatedUser);
  }
}

/**
 * Update user profile in cache
 */
export function updateUserProfile(userId: string, updates: Partial<UserProfile>): void {
  const current = $userProfiles.get();
  const existingProfile = current[userId];

  if (existingProfile) {
    const updatedProfile = { ...existingProfile, ...updates };
    setUserProfile(userId, updatedProfile);
  }
}

/**
 * Remove user from cache
 */
export function removeUser(userId: string): void {
  const currentUsers = $users.get();
  const currentProfiles = $userProfiles.get();

  const { [userId]: removedUser, ...remainingUsers } = currentUsers;
  const { [userId]: removedProfile, ...remainingProfiles } = currentProfiles;

  $users.set(remainingUsers);
  $userProfiles.set(remainingProfiles);
}

/**
 * Clear all users state
 */
export function clearUsersState(): void {
  $currentUserProfile.set(null);
  $userProfiles.set({});
  $users.set({});
  $usersList.set(null);
  $usersLoading.set(false);
  $usersError.set(null);
  $usersQuery.set({ page: 1, limit: 20 });
  $profileUpdateLoading.set(false);
  $profileUpdateError.set(null);
  $usernameAvailability.set({});
}

/**
 * Clear users list state only
 */
export function clearUsersListState(): void {
  $usersList.set(null);
  $usersError.set(null);
  $usersQuery.set({ page: 1, limit: 20 });
}

/**
 * Clear profile update state only
 */
export function clearProfileUpdateState(): void {
  $profileUpdateLoading.set(false);
  $profileUpdateError.set(null);
}

// ============================================================================
// Users State Helpers
// ============================================================================

/**
 * Get user from cache by ID
 */
export function getUser(userId: string): UserResponse | null {
  return $users.get()[userId] || null;
}

/**
 * Get user profile from cache by ID
 */
export function getUserProfile(userId: string): UserProfile | null {
  return $userProfiles.get()[userId] || null;
}

/**
 * Check if username availability is cached
 */
export function getUsernameAvailability(username: string): boolean | null {
  const availability = $usernameAvailability.get()[username.toLowerCase()];
  return availability !== undefined ? availability : null;
}

/**
 * Check if user is cached
 */
export function isUserCached(userId: string): boolean {
  return userId in $users.get();
}

/**
 * Check if user profile is cached
 */
export function isUserProfileCached(userId: string): boolean {
  return userId in $userProfiles.get();
}

/**
 * Get all cached users as array
 */
export function getAllCachedUsers(): UserResponse[] {
  return Object.values($users.get());
}

/**
 * Get all cached user profiles as array
 */
export function getAllCachedUserProfiles(): UserProfile[] {
  return Object.values($userProfiles.get());
}

/**
 * Get user's display name with fallback
 */
export function getUserDisplayName(userId: string): string {
  const user = getUser(userId);
  const profile = getUserProfile(userId);

  const userData = profile || user;
  if (!userData) return 'Unknown User';

  return userData.displayName || userData.username || 'Anonymous User';
}

/**
 * Get user's avatar URL with fallback
 */
export function getUserAvatarUrl(userId: string, size: number = 40): string {
  const user = getUser(userId);
  const profile = getUserProfile(userId);

  const userData = profile || user;
  if (!userData) {
    return `https://api.dicebear.com/7.x/initials/svg?seed=Anonymous&size=${size}`;
  }

  if (userData.avatar) {
    return userData.avatar;
  }

  // Fallback to generated avatar based on username
  const username = userData.username || 'Anonymous';
  return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(username)}&size=${size}`;
}
