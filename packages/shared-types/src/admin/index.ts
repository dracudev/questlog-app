// Admin-specific types that extend the base shared types
export * from '../users';
export * from '../games';
export * from '../auth';
export * from '../api';

/**
 * Admin dashboard statistics
 */
export interface AdminDashboardStats {
  totalUsers: number;
  totalGames: number;
  totalReviews: number;
  pendingReports: number;
  newUsersToday: number;
  newGamesToday: number;
  newReviewsToday: number;
  activeUsersThisWeek: number;
  topGenresThisMonth: Array<{
    id: string;
    name: string;
    gameCount: number;
  }>;
  recentActivity: Array<{
    type: 'user_registered' | 'game_added' | 'review_posted';
    count: number;
    date: string;
  }>;
}

/**
 * Admin activity log entry
 */
export interface AdminActivityLogEntry {
  id: string;
  action: AdminAction;
  resource: AdminResource;
  resourceId: string;
  userId: string;
  username: string;
  userRole: 'ADMIN' | 'MODERATOR';
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
  details?: Record<string, any>;
}

/**
 * Admin actions for activity logging
 */
export type AdminAction =
  | 'CREATE_USER'
  | 'UPDATE_USER'
  | 'UPDATE_USER_ROLE'
  | 'DELETE_USER'
  | 'BULK_DELETE_USERS'
  | 'CREATE_GAME'
  | 'UPDATE_GAME'
  | 'DELETE_GAME'
  | 'CREATE_DEVELOPER'
  | 'UPDATE_DEVELOPER'
  | 'DELETE_DEVELOPER'
  | 'CREATE_PUBLISHER'
  | 'UPDATE_PUBLISHER'
  | 'DELETE_PUBLISHER'
  | 'CREATE_GENRE'
  | 'UPDATE_GENRE'
  | 'DELETE_GENRE'
  | 'CREATE_PLATFORM'
  | 'UPDATE_PLATFORM'
  | 'DELETE_PLATFORM'
  | 'MODERATE_REVIEW'
  | 'MODERATE_COMMENT'
  | 'BAN_USER'
  | 'UNBAN_USER'
  | 'EXPORT_DATA';

/**
 * Admin resources for activity logging
 */
export type AdminResource =
  | 'user'
  | 'game'
  | 'developer'
  | 'publisher'
  | 'genre'
  | 'platform'
  | 'review'
  | 'comment'
  | 'report';

/**
 * Bulk operations request types
 */
export interface BulkDeleteUsersRequest {
  userIds: string[];
  reason?: string;
}

export interface BulkUpdateUsersRequest {
  userIds: string[];
  updates: {
    role?: 'USER' | 'ADMIN' | 'MODERATOR';
    isPrivate?: boolean;
    emailNotifications?: boolean;
  };
}

/**
 * Admin user management query with additional filters
 */
export interface AdminUsersQuery {
  page?: number;
  limit?: number;
  search?: string;
  role?: 'USER' | 'ADMIN' | 'MODERATOR';
  isPrivate?: boolean;
  createdAfter?: Date;
  createdBefore?: Date;
  lastActiveAfter?: Date;
  lastActiveBefore?: Date;
  sortBy?: 'username' | 'email' | 'createdAt' | 'lastActiveAt' | 'role';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Admin content management query with additional filters
 */
export interface AdminGamesQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'RELEASED' | 'UNRELEASED' | 'EARLY_ACCESS' | 'CANCELLED';
  createdAfter?: Date;
  createdBefore?: Date;
  hasReviews?: boolean;
  minRating?: number;
  maxRating?: number;
  sortBy?:
    | 'title'
    | 'createdAt'
    | 'releaseDate'
    | 'averageRating'
    | 'reviewCount';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Admin export data request
 */
export interface AdminExportRequest {
  type:
    | 'users'
    | 'games'
    | 'reviews'
    | 'developers'
    | 'publishers'
    | 'genres'
    | 'platforms';
  format: 'json' | 'csv' | 'xlsx';
  filters?: {
    dateFrom?: Date;
    dateTo?: Date;
    includeDeleted?: boolean;
  };
}

/**
 * Admin permission check response
 */
export interface AdminPermissionCheck {
  canAccessAdmin: boolean;
  canManageUsers: boolean;
  canManageContent: boolean;
  canDeleteContent: boolean;
  canExportData: boolean;
  canViewActivityLog: boolean;
  permissions: {
    users: {
      create: boolean;
      read: boolean;
      update: boolean;
      delete: boolean;
      updateRole: boolean;
    };
    games: {
      create: boolean;
      read: boolean;
      update: boolean;
      delete: boolean;
    };
    developers: {
      create: boolean;
      read: boolean;
      update: boolean;
      delete: boolean;
    };
    publishers: {
      create: boolean;
      read: boolean;
      update: boolean;
      delete: boolean;
    };
    genres: {
      create: boolean;
      read: boolean;
      update: boolean;
      delete: boolean;
    };
    platforms: {
      create: boolean;
      read: boolean;
      update: boolean;
      delete: boolean;
    };
  };
}

/**
 * Admin content moderation types
 */
export interface AdminModerationAction {
  action: 'approve' | 'reject' | 'flag' | 'unflag';
  reason?: string;
  moderatorNote?: string;
}

export interface AdminReportedContent {
  id: string;
  type: 'review' | 'comment' | 'user_profile';
  resourceId: string;
  reportedBy: {
    id: string;
    username: string;
  };
  reason: string;
  description?: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  createdAt: Date;
  reviewedAt?: Date;
  reviewedBy?: {
    id: string;
    username: string;
    role: 'ADMIN' | 'MODERATOR';
  };
  content: {
    title?: string;
    body?: string;
    author: {
      id: string;
      username: string;
    };
  };
}
