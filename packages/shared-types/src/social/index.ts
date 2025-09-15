// Social Stats
export interface SocialStats {
  followersCount: number;
  followingCount: number;
  reviewsCount: number;
  likesReceived: number;
}

// Activity Feed Types
export type ActivityType =
  | 'REVIEW_CREATED'
  | 'REVIEW_LIKED'
  | 'USER_FOLLOWED'
  | 'GAME_ADDED'
  | 'REVIEW_UPDATED';

export type ActivityTargetType = 'GAME' | 'USER' | 'REVIEW';

export interface ActivityUser {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
}

export interface ActivityItem {
  id: string;
  type: ActivityType;
  userId: string;
  user: ActivityUser;
  targetId?: string;
  targetType?: ActivityTargetType;
  metadata?: Record<string, any>;
  createdAt: Date;
}

export interface ActivityFeedMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ActivityFeedResponse {
  items: ActivityItem[];
  meta: ActivityFeedMeta;
}

// Social Query Types
export interface ActivityFeedQuery {
  page?: number;
  limit?: number;
  type?: ActivityType;
  targetType?: ActivityTargetType;
  since?: Date;
  until?: Date;
}

// Follow Types
export interface FollowResponse {
  isFollowing: boolean;
}

export interface MutualFollowsResponse {
  mutualFollows: string[];
}

// Follow Suggestions
export interface FollowSuggestion {
  id: string;
  username: string;
  displayName: string;
  avatar?: string;
  bio?: string;
  followersCount: number;
  mutualFollowsCount: number;
  commonGenres?: string[];
  commonGames?: string[];
}

export interface FollowSuggestionsQuery {
  limit?: number;
  excludeFollowed?: boolean;
}

// Social Actions
export interface FollowUserRequest {
  userId: string;
}

export interface UnfollowUserRequest {
  userId: string;
}

// Social Relationships
export interface SocialRelationship {
  isFollowing: boolean;
  isFollowedBy: boolean;
  isMutual: boolean;
  followedAt?: Date;
}

// Social Profile Data
export interface SocialProfile {
  userId: string;
  stats: SocialStats;
  relationship?: SocialRelationship;
  recentActivity?: ActivityItem[];
}
