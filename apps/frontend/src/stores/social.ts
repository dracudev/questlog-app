import { atom } from 'nanostores';
import type {
  SocialStats,
  ActivityFeedResponse,
  FollowSuggestion,
  MutualFollowsResponse,
} from '@questlog/shared-types';

// ============================================================================
// Social Stats State
// ============================================================================

/**
 * Current user's social statistics
 */
export const $currentUserSocialStats = atom<SocialStats | null>(null);

/**
 * Social stats for specific users (by user ID)
 */
export const $userSocialStats = atom<Record<string, SocialStats>>({});

/**
 * Social stats loading state
 */
export const $socialStatsLoading = atom<boolean>(false);

/**
 * Social stats error state
 */
export const $socialStatsError = atom<string | null>(null);

// ============================================================================
// Activity Feed State
// ============================================================================

/**
 * Current activity feed data with pagination
 */
export const $activityFeed = atom<ActivityFeedResponse | null>(null);

/**
 * Activity feed loading state
 */
export const $activityFeedLoading = atom<boolean>(false);

/**
 * Activity feed error state
 */
export const $activityFeedError = atom<string | null>(null);

/**
 * Activity feed current page
 */
export const $activityFeedPage = atom<number>(1);

// ============================================================================
// Follow Suggestions State
// ============================================================================

/**
 * Follow suggestions data
 */
export const $followSuggestions = atom<FollowSuggestion[]>([]);

/**
 * Follow suggestions loading state
 */
export const $followSuggestionsLoading = atom<boolean>(false);

/**
 * Follow suggestions error state
 */
export const $followSuggestionsError = atom<string | null>(null);

// ============================================================================
// Following State
// ============================================================================

/**
 * Following status for specific users (by user ID)
 */
export const $followingStatus = atom<Record<string, boolean>>({});

/**
 * Mutual follows data (by user ID)
 */
export const $mutualFollows = atom<Record<string, MutualFollowsResponse>>({});

/**
 * Follow actions loading state (by user ID)
 */
export const $followActionsLoading = atom<Record<string, boolean>>({});

// ============================================================================
// Social State Actions
// ============================================================================

/**
 * Set current user's social stats
 */
export function setCurrentUserSocialStats(stats: SocialStats | null): void {
  $currentUserSocialStats.set(stats);
  $socialStatsError.set(null);
}

/**
 * Set social stats for a specific user
 */
export function setUserSocialStats(userId: string, stats: SocialStats): void {
  const current = $userSocialStats.get();
  $userSocialStats.set({
    ...current,
    [userId]: stats,
  });
}

/**
 * Set social stats loading state
 */
export function setSocialStatsLoading(loading: boolean): void {
  $socialStatsLoading.set(loading);
  if (loading) {
    $socialStatsError.set(null);
  }
}

/**
 * Set social stats error
 */
export function setSocialStatsError(error: string | null): void {
  $socialStatsError.set(error);
  $socialStatsLoading.set(false);
}

/**
 * Set activity feed data
 */
export function setActivityFeed(feed: ActivityFeedResponse | null): void {
  $activityFeed.set(feed);
  $activityFeedError.set(null);
}

/**
 * Set activity feed loading state
 */
export function setActivityFeedLoading(loading: boolean): void {
  $activityFeedLoading.set(loading);
  if (loading) {
    $activityFeedError.set(null);
  }
}

/**
 * Set activity feed error
 */
export function setActivityFeedError(error: string | null): void {
  $activityFeedError.set(error);
  $activityFeedLoading.set(false);
}

/**
 * Set activity feed page
 */
export function setActivityFeedPage(page: number): void {
  $activityFeedPage.set(page);
}

/**
 * Append more activity feed items (for pagination)
 */
export function appendActivityFeedItems(newFeed: ActivityFeedResponse): void {
  const currentFeed = $activityFeed.get();

  if (!currentFeed) {
    setActivityFeed(newFeed);
    return;
  }

  const updatedFeed: ActivityFeedResponse = {
    ...newFeed,
    items: [...currentFeed.items, ...newFeed.items],
  };

  setActivityFeed(updatedFeed);
}

/**
 * Set follow suggestions
 */
export function setFollowSuggestions(suggestions: FollowSuggestion[]): void {
  $followSuggestions.set(suggestions);
  $followSuggestionsError.set(null);
}

/**
 * Set follow suggestions loading state
 */
export function setFollowSuggestionsLoading(loading: boolean): void {
  $followSuggestionsLoading.set(loading);
  if (loading) {
    $followSuggestionsError.set(null);
  }
}

/**
 * Set follow suggestions error
 */
export function setFollowSuggestionsError(error: string | null): void {
  $followSuggestionsError.set(error);
  $followSuggestionsLoading.set(false);
}

/**
 * Set following status for a specific user
 */
export function setFollowingStatus(userId: string, isFollowing: boolean): void {
  const current = $followingStatus.get();
  $followingStatus.set({
    ...current,
    [userId]: isFollowing,
  });
}

/**
 * Set batch following status
 */
export function setBatchFollowingStatus(statuses: Record<string, boolean>): void {
  const current = $followingStatus.get();
  $followingStatus.set({
    ...current,
    ...statuses,
  });
}

/**
 * Set mutual follows for a specific user
 */
export function setMutualFollows(userId: string, mutualFollows: MutualFollowsResponse): void {
  const current = $mutualFollows.get();
  $mutualFollows.set({
    ...current,
    [userId]: mutualFollows,
  });
}

/**
 * Set follow action loading state for a specific user
 */
export function setFollowActionLoading(userId: string, loading: boolean): void {
  const current = $followActionsLoading.get();
  $followActionsLoading.set({
    ...current,
    [userId]: loading,
  });
}

/**
 * Update current user stats after follow/unfollow actions
 */
export function updateCurrentUserStatsAfterFollow(isFollowing: boolean): void {
  const currentStats = $currentUserSocialStats.get();
  if (!currentStats) return;

  const updatedStats: SocialStats = {
    ...currentStats,
    followingCount: currentStats.followingCount + (isFollowing ? 1 : -1),
  };

  setCurrentUserSocialStats(updatedStats);
}

/**
 * Update user stats after being followed/unfollowed
 */
export function updateUserStatsAfterBeingFollowed(userId: string, isFollowing: boolean): void {
  const userStats = $userSocialStats.get()[userId];
  if (!userStats) return;

  const updatedStats: SocialStats = {
    ...userStats,
    followersCount: userStats.followersCount + (isFollowing ? 1 : -1),
  };

  setUserSocialStats(userId, updatedStats);
}

/**
 * Remove a suggestion after following
 */
export function removeSuggestionAfterFollow(userId: string): void {
  const suggestions = $followSuggestions.get();
  const filteredSuggestions = suggestions.filter((suggestion) => suggestion.id !== userId);
  setFollowSuggestions(filteredSuggestions);
}

// ============================================================================
// Social State Helpers
// ============================================================================

/**
 * Check if a user is being followed
 */
export function isUserFollowed(userId: string): boolean {
  return $followingStatus.get()[userId] ?? false;
}

/**
 * Check if follow action is loading for a user
 */
export function isFollowActionLoading(userId: string): boolean {
  return $followActionsLoading.get()[userId] ?? false;
}

/**
 * Get user social stats
 */
export function getUserStats(userId: string): SocialStats | null {
  return $userSocialStats.get()[userId] ?? null;
}

/**
 * Get mutual follows for a user
 */
export function getUserMutualFollows(userId: string): MutualFollowsResponse | null {
  return $mutualFollows.get()[userId] ?? null;
}

/**
 * Clear all social state
 */
export function clearSocialState(): void {
  $currentUserSocialStats.set(null);
  $userSocialStats.set({});
  $socialStatsLoading.set(false);
  $socialStatsError.set(null);

  $activityFeed.set(null);
  $activityFeedLoading.set(false);
  $activityFeedError.set(null);
  $activityFeedPage.set(1);

  $followSuggestions.set([]);
  $followSuggestionsLoading.set(false);
  $followSuggestionsError.set(null);

  $followingStatus.set({});
  $mutualFollows.set({});
  $followActionsLoading.set({});
}

/**
 * Clear activity feed state only
 */
export function clearActivityFeedState(): void {
  $activityFeed.set(null);
  $activityFeedLoading.set(false);
  $activityFeedError.set(null);
  $activityFeedPage.set(1);
}

/**
 * Clear follow suggestions state only
 */
export function clearFollowSuggestionsState(): void {
  $followSuggestions.set([]);
  $followSuggestionsLoading.set(false);
  $followSuggestionsError.set(null);
}

/**
 * Clear social stats state only
 */
export function clearSocialStatsState(): void {
  $currentUserSocialStats.set(null);
  $userSocialStats.set({});
  $socialStatsLoading.set(false);
  $socialStatsError.set(null);
}
