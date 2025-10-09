import type { UserResponse, ReviewResponse } from '@questlog/shared-types';
import { apiClient } from './api';

// ============================================================================
// Configuration
// ============================================================================

const ADMIN_ENDPOINTS = {
  // User Management
  USERS: 'admin/users',
  USER_BY_ID: (id: string) => `admin/users/${id}`,
  USER_BAN: (id: string) => `admin/users/${id}/ban`,
  USER_UNBAN: (id: string) => `admin/users/${id}/unban`,
  USER_PROMOTE: (id: string) => `admin/users/${id}/promote`,
  USER_DEMOTE: (id: string) => `admin/users/${id}/demote`,

  // Content Moderation
  REVIEWS_PENDING: 'admin/reviews/pending',
  REVIEW_APPROVE: (id: string) => `admin/reviews/${id}/approve`,
  REVIEW_REJECT: (id: string) => `admin/reviews/${id}/reject`,

  // Reports Management
  REPORTS: 'admin/reports',
  REPORT_BY_ID: (id: string) => `admin/reports/${id}`,
  REPORT_RESOLVE: (id: string) => `admin/reports/${id}/resolve`,

  // System Stats
  STATS: 'admin/stats',
  STATS_USERS: 'admin/stats/users',
  STATS_CONTENT: 'admin/stats/content',
  STATS_ACTIVITY: 'admin/stats/activity',
} as const;

// ============================================================================
// Admin Response Interfaces
// ============================================================================

interface AdminUserResponse extends UserResponse {
  role: 'USER' | 'MODERATOR' | 'ADMIN';
  isActive: boolean;
  isBanned: boolean;
  banReason?: string;
  bannedAt?: Date;
  bannedBy?: string;
  lastLoginAt?: Date;
  reviewsCount: number;
  reportsCount: number;
}

interface PendingReviewResponse extends ReviewResponse {
  user: {
    id: string;
    username: string;
    displayName: string;
    avatar?: string;
  };
  game: {
    id: string;
    title: string;
    slug: string;
    coverImage?: string;
  };
  reportCount: number;
  submittedAt: Date;
}

interface ReportResponse {
  id: string;
  type: 'REVIEW' | 'USER' | 'COMMENT';
  reason: string;
  description?: string;
  status: 'PENDING' | 'RESOLVED' | 'DISMISSED';
  targetId: string;
  targetType: string;
  reportedBy: {
    id: string;
    username: string;
    displayName: string;
  };
  reportedUser?: {
    id: string;
    username: string;
    displayName: string;
  };
  createdAt: Date;
  resolvedAt?: Date;
  resolvedBy?: string;
  resolution?: string;
}

interface SystemStatsResponse {
  users: {
    total: number;
    active: number;
    banned: number;
    newThisMonth: number;
  };
  content: {
    games: number;
    reviews: number;
    pendingReviews: number;
    comments: number;
  };
  activity: {
    dailyActiveUsers: number;
    weeklyActiveUsers: number;
    monthlyActiveUsers: number;
    avgSessionDuration: number;
  };
  reports: {
    pending: number;
    resolved: number;
    dismissed: number;
  };
}

interface PaginatedUsersResponse {
  data: AdminUserResponse[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface PaginatedReviewsResponse {
  data: PendingReviewResponse[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface PaginatedReportsResponse {
  data: ReportResponse[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface AdminQuery {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

interface UserManagementQuery extends AdminQuery {
  role?: 'USER' | 'MODERATOR' | 'ADMIN';
  status?: 'ACTIVE' | 'BANNED' | 'INACTIVE';
  dateFrom?: string;
  dateTo?: string;
}

interface ContentModerationQuery extends AdminQuery {
  status?: 'PENDING' | 'APPROVED' | 'REJECTED';
  gameId?: string;
  userId?: string;
}

interface ReportsQuery extends AdminQuery {
  type?: 'REVIEW' | 'USER' | 'COMMENT';
  status?: 'PENDING' | 'RESOLVED' | 'DISMISSED';
}

// ============================================================================
// Admin Service Class
// ============================================================================

class AdminService {
  // ============================================================================
  // User Management
  // ============================================================================

  /**
   * Get all users with admin filtering and pagination
   *
   * @param query - Query parameters for filtering users
   * @returns Promise resolving to paginated users response
   *
   * @example
   * ```typescript
   * const users = await adminService.getUsers({
   *   page: 1,
   *   limit: 20,
   *   role: 'USER',
   *   status: 'ACTIVE'
   * });
   * ```
   */
  async getUsers(query: UserManagementQuery = {}): Promise<PaginatedUsersResponse> {
    const searchParams = new URLSearchParams();

    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });

    const endpoint = searchParams.toString()
      ? `${ADMIN_ENDPOINTS.USERS}?${searchParams.toString()}`
      : ADMIN_ENDPOINTS.USERS;

    return apiClient.get<PaginatedUsersResponse>(endpoint);
  }

  /**
   * Get user details by ID (admin view)
   *
   * @param id - User ID
   * @returns Promise resolving to user details
   */
  async getUserById(id: string): Promise<AdminUserResponse> {
    if (!id) {
      throw new Error('User ID is required');
    }

    return apiClient.get<AdminUserResponse>(ADMIN_ENDPOINTS.USER_BY_ID(id));
  }

  /**
   * Ban a user
   *
   * @param id - User ID
   * @param reason - Reason for ban
   * @returns Promise resolving when user is banned
   */
  async banUser(id: string, reason: string): Promise<void> {
    if (!id) {
      throw new Error('User ID is required');
    }
    if (!reason?.trim()) {
      throw new Error('Ban reason is required');
    }

    return apiClient.post<void>(ADMIN_ENDPOINTS.USER_BAN(id), { reason });
  }

  /**
   * Unban a user
   *
   * @param id - User ID
   * @returns Promise resolving when user is unbanned
   */
  async unbanUser(id: string): Promise<void> {
    if (!id) {
      throw new Error('User ID is required');
    }

    return apiClient.post<void>(ADMIN_ENDPOINTS.USER_UNBAN(id));
  }

  /**
   * Promote user to moderator/admin
   *
   * @param id - User ID
   * @param role - New role
   * @returns Promise resolving when user is promoted
   */
  async promoteUser(id: string, role: 'MODERATOR' | 'ADMIN'): Promise<AdminUserResponse> {
    if (!id) {
      throw new Error('User ID is required');
    }
    if (!role) {
      throw new Error('Role is required');
    }

    return apiClient.post<AdminUserResponse>(ADMIN_ENDPOINTS.USER_PROMOTE(id), { role });
  }

  /**
   * Demote user from moderator/admin
   *
   * @param id - User ID
   * @returns Promise resolving when user is demoted
   */
  async demoteUser(id: string): Promise<AdminUserResponse> {
    if (!id) {
      throw new Error('User ID is required');
    }

    return apiClient.post<AdminUserResponse>(ADMIN_ENDPOINTS.USER_DEMOTE(id));
  }

  // ============================================================================
  // Content Moderation
  // ============================================================================

  /**
   * Get pending reviews for moderation
   *
   * @param query - Query parameters for filtering reviews
   * @returns Promise resolving to paginated pending reviews
   */
  async getPendingReviews(query: ContentModerationQuery = {}): Promise<PaginatedReviewsResponse> {
    const searchParams = new URLSearchParams();

    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });

    const endpoint = searchParams.toString()
      ? `${ADMIN_ENDPOINTS.REVIEWS_PENDING}?${searchParams.toString()}`
      : ADMIN_ENDPOINTS.REVIEWS_PENDING;

    return apiClient.get<PaginatedReviewsResponse>(endpoint);
  }

  /**
   * Approve a review
   *
   * @param id - Review ID
   * @returns Promise resolving when review is approved
   */
  async approveReview(id: string): Promise<void> {
    if (!id) {
      throw new Error('Review ID is required');
    }

    return apiClient.post<void>(ADMIN_ENDPOINTS.REVIEW_APPROVE(id));
  }

  /**
   * Reject a review
   *
   * @param id - Review ID
   * @param reason - Reason for rejection
   * @returns Promise resolving when review is rejected
   */
  async rejectReview(id: string, reason: string): Promise<void> {
    if (!id) {
      throw new Error('Review ID is required');
    }
    if (!reason?.trim()) {
      throw new Error('Rejection reason is required');
    }

    return apiClient.post<void>(ADMIN_ENDPOINTS.REVIEW_REJECT(id), { reason });
  }

  // ============================================================================
  // Reports Management
  // ============================================================================

  /**
   * Get all reports
   *
   * @param query - Query parameters for filtering reports
   * @returns Promise resolving to paginated reports response
   */
  async getReports(query: ReportsQuery = {}): Promise<PaginatedReportsResponse> {
    const searchParams = new URLSearchParams();

    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });

    const endpoint = searchParams.toString()
      ? `${ADMIN_ENDPOINTS.REPORTS}?${searchParams.toString()}`
      : ADMIN_ENDPOINTS.REPORTS;

    return apiClient.get<PaginatedReportsResponse>(endpoint);
  }

  /**
   * Get report details by ID
   *
   * @param id - Report ID
   * @returns Promise resolving to report details
   */
  async getReportById(id: string): Promise<ReportResponse> {
    if (!id) {
      throw new Error('Report ID is required');
    }

    return apiClient.get<ReportResponse>(ADMIN_ENDPOINTS.REPORT_BY_ID(id));
  }

  /**
   * Resolve a report
   *
   * @param id - Report ID
   * @param resolution - Resolution details
   * @param action - Action taken ('DISMISSED' | 'RESOLVED')
   * @returns Promise resolving when report is resolved
   */
  async resolveReport(
    id: string,
    resolution: string,
    action: 'DISMISSED' | 'RESOLVED' = 'RESOLVED',
  ): Promise<void> {
    if (!id) {
      throw new Error('Report ID is required');
    }
    if (!resolution?.trim()) {
      throw new Error('Resolution is required');
    }

    return apiClient.post<void>(ADMIN_ENDPOINTS.REPORT_RESOLVE(id), { resolution, action });
  }

  // ============================================================================
  // System Statistics
  // ============================================================================

  /**
   * Get system statistics
   *
   * @returns Promise resolving to system stats
   */
  async getSystemStats(): Promise<SystemStatsResponse> {
    return apiClient.get<SystemStatsResponse>(ADMIN_ENDPOINTS.STATS);
  }

  /**
   * Get user statistics
   *
   * @returns Promise resolving to user stats
   */
  async getUserStats(): Promise<SystemStatsResponse['users']> {
    return apiClient.get<SystemStatsResponse['users']>(ADMIN_ENDPOINTS.STATS_USERS);
  }

  /**
   * Get content statistics
   *
   * @returns Promise resolving to content stats
   */
  async getContentStats(): Promise<SystemStatsResponse['content']> {
    return apiClient.get<SystemStatsResponse['content']>(ADMIN_ENDPOINTS.STATS_CONTENT);
  }

  /**
   * Get activity statistics
   *
   * @returns Promise resolving to activity stats
   */
  async getActivityStats(): Promise<SystemStatsResponse['activity']> {
    return apiClient.get<SystemStatsResponse['activity']>(ADMIN_ENDPOINTS.STATS_ACTIVITY);
  }

  // ============================================================================
  // Bulk Operations
  // ============================================================================

  /**
   * Bulk ban users
   *
   * @param userIds - Array of user IDs
   * @param reason - Reason for ban
   * @returns Promise resolving when users are banned
   */
  async bulkBanUsers(userIds: string[], reason: string): Promise<void> {
    if (!userIds.length) {
      throw new Error('User IDs are required');
    }
    if (!reason?.trim()) {
      throw new Error('Ban reason is required');
    }

    return apiClient.post<void>(`${ADMIN_ENDPOINTS.USERS}/bulk-ban`, { userIds, reason });
  }

  /**
   * Bulk approve reviews
   *
   * @param reviewIds - Array of review IDs
   * @returns Promise resolving when reviews are approved
   */
  async bulkApproveReviews(reviewIds: string[]): Promise<void> {
    if (!reviewIds.length) {
      throw new Error('Review IDs are required');
    }

    return apiClient.post<void>(`${ADMIN_ENDPOINTS.REVIEWS_PENDING}/bulk-approve`, { reviewIds });
  }

  /**
   * Bulk reject reviews
   *
   * @param reviewIds - Array of review IDs
   * @param reason - Reason for rejection
   * @returns Promise resolving when reviews are rejected
   */
  async bulkRejectReviews(reviewIds: string[], reason: string): Promise<void> {
    if (!reviewIds.length) {
      throw new Error('Review IDs are required');
    }
    if (!reason?.trim()) {
      throw new Error('Rejection reason is required');
    }

    return apiClient.post<void>(`${ADMIN_ENDPOINTS.REVIEWS_PENDING}/bulk-reject`, {
      reviewIds,
      reason,
    });
  }

  // ============================================================================
  // Search and Filters
  // ============================================================================

  /**
   * Search users by username or email
   *
   * @param searchTerm - Search term
   * @param options - Additional search options
   * @returns Promise resolving to paginated users response
   */
  async searchUsers(
    searchTerm: string,
    options: Omit<UserManagementQuery, 'search'> = {},
  ): Promise<PaginatedUsersResponse> {
    if (!searchTerm.trim()) {
      throw new Error('Search term is required');
    }

    return this.getUsers({
      ...options,
      search: searchTerm.trim(),
    });
  }

  /**
   * Get users by role
   *
   * @param role - User role
   * @param options - Additional query options
   * @returns Promise resolving to paginated users response
   */
  async getUsersByRole(
    role: 'USER' | 'MODERATOR' | 'ADMIN',
    options: Omit<UserManagementQuery, 'role'> = {},
  ): Promise<PaginatedUsersResponse> {
    return this.getUsers({
      ...options,
      role,
    });
  }

  /**
   * Get banned users
   *
   * @param options - Additional query options
   * @returns Promise resolving to paginated users response
   */
  async getBannedUsers(options: UserManagementQuery = {}): Promise<PaginatedUsersResponse> {
    return this.getUsers({
      ...options,
      status: 'BANNED',
    });
  }

  /**
   * Get pending reports
   *
   * @param options - Additional query options
   * @returns Promise resolving to paginated reports response
   */
  async getPendingReports(options: ReportsQuery = {}): Promise<PaginatedReportsResponse> {
    return this.getReports({
      ...options,
      status: 'PENDING',
    });
  }
}

// ============================================================================
// Singleton Instance
// ============================================================================

/**
 * Default admin service instance
 */
export const adminService = new AdminService();

/**
 * Create a new admin service instance (for testing purposes)
 */
export function createAdminService(): AdminService {
  return new AdminService();
}

// ============================================================================
// Named Exports for Individual Functions
// ============================================================================

export const {
  getUsers,
  getUserById,
  banUser,
  unbanUser,
  promoteUser,
  demoteUser,
  getPendingReviews,
  approveReview,
  rejectReview,
  getReports,
  getReportById,
  resolveReport,
  getSystemStats,
  getUserStats,
  getContentStats,
  getActivityStats,
  bulkBanUsers,
  bulkApproveReviews,
  bulkRejectReviews,
  searchUsers,
  getUsersByRole,
  getBannedUsers,
  getPendingReports,
} = adminService;

// ============================================================================
// Export Types
// ============================================================================

export type {
  AdminUserResponse,
  PendingReviewResponse,
  ReportResponse,
  SystemStatsResponse,
  PaginatedUsersResponse,
  PaginatedReviewsResponse,
  PaginatedReportsResponse,
  UserManagementQuery,
  ContentModerationQuery,
  ReportsQuery,
};
