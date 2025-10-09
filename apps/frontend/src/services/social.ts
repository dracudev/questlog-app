import type {
  SocialStats,
  ActivityFeedResponse,
  ActivityFeedQuery,
  FollowResponse,
  MutualFollowsResponse,
  FollowSuggestion,
  FollowSuggestionsQuery,
  ActivityType,
} from '@questlog/shared-types';
import { apiClient } from './api';

// ============================================================================
// Configuration
// ============================================================================

const SOCIAL_ENDPOINTS = {
  FOLLOW_USER: (userId: string) => `social/follow/${userId}`,
  UNFOLLOW_USER: (userId: string) => `social/follow/${userId}`,
  CHECK_FOLLOWING: (userId: string) => `social/following/${userId}`,
  ACTIVITY_FEED: 'social/feed',
  SOCIAL_STATS: 'social/stats',
  USER_SOCIAL_STATS: (userId: string) => `social/stats/${userId}`,
  FOLLOW_SUGGESTIONS: 'social/suggestions',
  MUTUAL_FOLLOWS: (userId: string) => `social/mutual/${userId}`,
} as const;

// ============================================================================
// Social Service Class
// ============================================================================

class SocialService {
  /**
   * Follow a user (requires authentication)
   *
   * @param userId - The user's unique identifier to follow
   * @returns Promise resolving when user is followed
   *
   * @example
   * ```typescript
   * await socialService.followUser('user-id');
   * ```
   */
  async followUser(userId: string): Promise<void> {
    if (!userId) {
      throw new Error('User ID is required');
    }

    return apiClient.post<void>(SOCIAL_ENDPOINTS.FOLLOW_USER(userId));
  }

  /**
   * Unfollow a user (requires authentication)
   *
   * @param userId - The user's unique identifier to unfollow
   * @returns Promise resolving when user is unfollowed
   *
   * @example
   * ```typescript
   * await socialService.unfollowUser('user-id');
   * ```
   */
  async unfollowUser(userId: string): Promise<void> {
    if (!userId) {
      throw new Error('User ID is required');
    }

    return apiClient.delete<void>(SOCIAL_ENDPOINTS.UNFOLLOW_USER(userId));
  }

  /**
   * Check if current user is following a specific user
   *
   * @param userId - The user's unique identifier to check
   * @returns Promise resolving to follow status
   *
   * @example
   * ```typescript
   * const result = await socialService.isFollowing('user-id');
   * console.log(result.isFollowing); // true/false
   * ```
   */
  async isFollowing(userId: string): Promise<FollowResponse> {
    if (!userId) {
      throw new Error('User ID is required');
    }

    return apiClient.get<FollowResponse>(SOCIAL_ENDPOINTS.CHECK_FOLLOWING(userId));
  }

  /**
   * Get the activity feed for the current user
   *
   * @param query - Optional query parameters for pagination and filtering
   * @returns Promise resolving to activity feed response
   *
   * @example
   * ```typescript
   * const feed = await socialService.getActivityFeed({ page: 1, limit: 20 });
   * console.log(feed.items.length); // Number of activity items
   * ```
   */
  async getActivityFeed(query: ActivityFeedQuery = {}): Promise<ActivityFeedResponse> {
    const searchParams = new URLSearchParams();

    // Add query parameters
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (value instanceof Date) {
          searchParams.append(key, value.toISOString());
        } else {
          searchParams.append(key, value.toString());
        }
      }
    });

    const endpoint = searchParams.toString()
      ? `${SOCIAL_ENDPOINTS.ACTIVITY_FEED}?${searchParams.toString()}`
      : SOCIAL_ENDPOINTS.ACTIVITY_FEED;

    return apiClient.get<ActivityFeedResponse>(endpoint);
  }

  /**
   * Get activity feed filtered by activity type
   *
   * @param activityType - The type of activity to filter by
   * @param options - Additional query options
   * @returns Promise resolving to filtered activity feed
   *
   * @example
   * ```typescript
   * const reviews = await socialService.getActivityFeedByType('REVIEW_CREATED', {
   *   limit: 10
   * });
   * ```
   */
  async getActivityFeedByType(
    activityType: ActivityType,
    options: Omit<ActivityFeedQuery, 'type'> = {},
  ): Promise<ActivityFeedResponse> {
    return this.getActivityFeed({
      ...options,
      type: activityType,
    });
  }

  /**
   * Get recent activity feed (last 24 hours)
   *
   * @param options - Query options excluding time filters
   * @returns Promise resolving to recent activity feed
   *
   * @example
   * ```typescript
   * const recent = await socialService.getRecentActivity({ limit: 20 });
   * ```
   */
  async getRecentActivity(
    options: Omit<ActivityFeedQuery, 'since' | 'until'> = {},
  ): Promise<ActivityFeedResponse> {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    return this.getActivityFeed({
      ...options,
      since: yesterday,
    });
  }

  /**
   * Get social stats for the current user
   *
   * @returns Promise resolving to current user's social statistics
   *
   * @example
   * ```typescript
   * const stats = await socialService.getCurrentUserSocialStats();
   * console.log(`${stats.followersCount} followers`);
   * ```
   */
  async getCurrentUserSocialStats(): Promise<SocialStats> {
    return apiClient.get<SocialStats>(SOCIAL_ENDPOINTS.SOCIAL_STATS);
  }

  /**
   * Get social stats for a specific user
   *
   * @param userId - The user's unique identifier
   * @returns Promise resolving to user's social statistics
   *
   * @example
   * ```typescript
   * const stats = await socialService.getUserSocialStats('user-id');
   * console.log(`${stats.reviewsCount} reviews`);
   * ```
   */
  async getUserSocialStats(userId: string): Promise<SocialStats> {
    if (!userId) {
      throw new Error('User ID is required');
    }

    return apiClient.get<SocialStats>(SOCIAL_ENDPOINTS.USER_SOCIAL_STATS(userId));
  }

  /**
   * Get follow suggestions for the current user
   *
   * @param query - Optional query parameters for customizing suggestions
   * @returns Promise resolving to array of follow suggestions
   *
   * @example
   * ```typescript
   * const suggestions = await socialService.getFollowSuggestions({ limit: 10 });
   * console.log(`Found ${suggestions.length} suggestions`);
   * ```
   */
  async getFollowSuggestions(query: FollowSuggestionsQuery = {}): Promise<FollowSuggestion[]> {
    const searchParams = new URLSearchParams();

    // Add query parameters
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });

    const endpoint = searchParams.toString()
      ? `${SOCIAL_ENDPOINTS.FOLLOW_SUGGESTIONS}?${searchParams.toString()}`
      : SOCIAL_ENDPOINTS.FOLLOW_SUGGESTIONS;

    return apiClient.get<FollowSuggestion[]>(endpoint);
  }

  /**
   * Get mutual follows between current user and specified user
   *
   * @param userId - The user's unique identifier to check mutual follows with
   * @returns Promise resolving to mutual follows response
   *
   * @example
   * ```typescript
   * const mutual = await socialService.getMutualFollows('user-id');
   * console.log(`${mutual.mutualFollows.length} mutual follows`);
   * ```
   */
  async getMutualFollows(userId: string): Promise<MutualFollowsResponse> {
    if (!userId) {
      throw new Error('User ID is required');
    }

    return apiClient.get<MutualFollowsResponse>(SOCIAL_ENDPOINTS.MUTUAL_FOLLOWS(userId));
  }

  /**
   * Batch check following status for multiple users
   *
   * @param userIds - Array of user IDs to check
   * @returns Promise resolving to object mapping user IDs to follow status
   *
   * @example
   * ```typescript
   * const statuses = await socialService.batchCheckFollowing(['user1', 'user2']);
   * console.log(statuses['user1']); // true/false
   * ```
   */
  async batchCheckFollowing(userIds: string[]): Promise<Record<string, boolean>> {
    if (!userIds.length) {
      return {};
    }

    // For now, make individual requests (could be optimized with a batch endpoint)
    const results = await Promise.all(
      userIds.map(async (userId) => ({
        userId,
        isFollowing: (await this.isFollowing(userId)).isFollowing,
      })),
    );

    return results.reduce(
      (acc, { userId, isFollowing }) => {
        acc[userId] = isFollowing;
        return acc;
      },
      {} as Record<string, boolean>,
    );
  }

  /**
   * Follow multiple users at once
   *
   * @param userIds - Array of user IDs to follow
   * @returns Promise resolving when all users are followed
   *
   * @example
   * ```typescript
   * await socialService.followMultipleUsers(['user1', 'user2', 'user3']);
   * ```
   */
  async followMultipleUsers(userIds: string[]): Promise<void> {
    if (!userIds.length) {
      return;
    }

    await Promise.all(userIds.map((userId) => this.followUser(userId)));
  }

  /**
   * Unfollow multiple users at once
   *
   * @param userIds - Array of user IDs to unfollow
   * @returns Promise resolving when all users are unfollowed
   *
   * @example
   * ```typescript
   * await socialService.unfollowMultipleUsers(['user1', 'user2']);
   * ```
   */
  async unfollowMultipleUsers(userIds: string[]): Promise<void> {
    if (!userIds.length) {
      return;
    }

    await Promise.all(userIds.map((userId) => this.unfollowUser(userId)));
  }
}

// ============================================================================
// Singleton Instance
// ============================================================================

export const socialService = new SocialService();

// ============================================================================
// Individual Function Exports
// ============================================================================

export const {
  followUser,
  unfollowUser,
  isFollowing,
  getActivityFeed,
  getActivityFeedByType,
  getRecentActivity,
  getCurrentUserSocialStats,
  getUserSocialStats,
  getFollowSuggestions,
  getMutualFollows,
  batchCheckFollowing,
  followMultipleUsers,
  unfollowMultipleUsers,
} = socialService;
