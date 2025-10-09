import { useCallback, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import type {
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
} from '@/services/admin';

import { adminService } from '@/services/admin';
import { $currentUser } from '@/stores/auth';
import {
  // User Management State
  adminUsersState,
  selectedUserState,
  userManagementQuery,
  usersLoading,
  usersError,
  // Content Moderation State
  pendingReviewsState,
  selectedReviewState,
  contentModerationQuery,
  reviewsLoading,
  reviewsError,
  // Reports Management State
  reportsState,
  selectedReportState,
  reportsQuery,
  reportsLoading,
  reportsError,
  // System Statistics State
  systemStatsState,
  statsLoading,
  statsError,
  // UI State
  selectedTab,
  bulkSelectedUsers,
  bulkSelectedReviews,
  bulkSelectionCounts,
  // Form State
  banUserForm,
  promoteUserForm,
  rejectReviewForm,
  resolveReportForm,
  // Computed Values
  usersStats,
  reviewsStats,
  reportsStats,
  dashboardSummary,
  // Action Functions
  setUsersData,
  updateUserInList,
  setSelectedUser,
  updateUserManagementQuery,
  setUsersLoading,
  setUsersError,
  setPendingReviewsData,
  removeReviewFromList,
  setSelectedReview,
  updateContentModerationQuery,
  setReviewsLoading,
  setReviewsError,
  setReportsData,
  updateReportInList,
  setSelectedReport,
  updateReportsQuery,
  setReportsLoading,
  setReportsError,
  setSystemStats,
  setStatsLoading,
  setStatsError,
  setSelectedTab,
  toggleUserSelection,
  toggleReviewSelection,
  selectAllUsers,
  selectAllReviews,
  clearBulkSelections,
  setBanUserForm,
  setPromoteUserForm,
  setRejectReviewForm,
  setResolveReportForm,
  resetAdminState,
  resetUserManagement,
  resetContentModeration,
  resetReportsManagement,
} from '@/stores/admin';

// ============================================================================
// Types
// ============================================================================

interface UseAdminUsersReturn {
  // State
  users: PaginatedUsersResponse | null;
  selectedUser: AdminUserResponse | null;
  query: UserManagementQuery;
  isLoading: boolean;
  error: string | null;
  stats: {
    total: number;
    active: number;
    banned: number;
    moderators: number;
    admins: number;
    currentPage: number;
    totalPages: number;
  } | null;
  bulkSelected: string[];

  // Actions
  fetchUsers: (query?: UserManagementQuery) => Promise<PaginatedUsersResponse>;
  fetchUserById: (userId: string) => Promise<AdminUserResponse>;
  searchUsers: (
    searchTerm: string,
    options?: Omit<UserManagementQuery, 'search'>,
  ) => Promise<PaginatedUsersResponse>;
  getUsersByRole: (
    role: 'USER' | 'MODERATOR' | 'ADMIN',
    options?: Omit<UserManagementQuery, 'role'>,
  ) => Promise<PaginatedUsersResponse>;
  getBannedUsers: (options?: UserManagementQuery) => Promise<PaginatedUsersResponse>;
  banUser: (userId: string, reason: string) => Promise<void>;
  unbanUser: (userId: string) => Promise<void>;
  promoteUser: (userId: string, role: 'MODERATOR' | 'ADMIN') => Promise<AdminUserResponse>;
  demoteUser: (userId: string) => Promise<AdminUserResponse>;
  bulkBanUsers: (userIds: string[], reason: string) => Promise<void>;
  clearError: () => void;
  clearData: () => void;

  // Selection Actions
  selectUser: (user: AdminUserResponse | null) => void;
  toggleSelection: (userId: string) => void;
  selectAll: () => void;
  clearSelections: () => void;

  // Query Actions
  updateQuery: (updates: Partial<UserManagementQuery>) => void;

  // Utils
  refetch: () => Promise<void>;
}

interface UseAdminReviewsReturn {
  // State
  reviews: PaginatedReviewsResponse | null;
  selectedReview: PendingReviewResponse | null;
  query: ContentModerationQuery;
  isLoading: boolean;
  error: string | null;
  stats: {
    total: number;
    highPriority: number;
    reported: number;
    currentPage: number;
    totalPages: number;
  } | null;
  bulkSelected: string[];

  // Actions
  fetchPendingReviews: (query?: ContentModerationQuery) => Promise<PaginatedReviewsResponse>;
  approveReview: (reviewId: string) => Promise<void>;
  rejectReview: (reviewId: string, reason: string) => Promise<void>;
  bulkApproveReviews: (reviewIds: string[]) => Promise<void>;
  bulkRejectReviews: (reviewIds: string[], reason: string) => Promise<void>;
  clearError: () => void;
  clearData: () => void;

  // Selection Actions
  selectReview: (review: PendingReviewResponse | null) => void;
  toggleSelection: (reviewId: string) => void;
  selectAll: () => void;
  clearSelections: () => void;

  // Query Actions
  updateQuery: (updates: Partial<ContentModerationQuery>) => void;

  // Utils
  refetch: () => Promise<void>;
}

interface UseAdminReportsReturn {
  // State
  reports: PaginatedReportsResponse | null;
  selectedReport: ReportResponse | null;
  query: ReportsQuery;
  isLoading: boolean;
  error: string | null;
  stats: {
    total: number;
    pending: number;
    resolved: number;
    reviewReports: number;
    userReports: number;
    currentPage: number;
    totalPages: number;
  } | null;

  // Actions
  fetchReports: (query?: ReportsQuery) => Promise<PaginatedReportsResponse>;
  fetchReportById: (reportId: string) => Promise<ReportResponse>;
  getPendingReports: (options?: ReportsQuery) => Promise<PaginatedReportsResponse>;
  resolveReport: (
    reportId: string,
    resolution: string,
    action?: 'DISMISSED' | 'RESOLVED',
  ) => Promise<void>;
  clearError: () => void;
  clearData: () => void;

  // Selection Actions
  selectReport: (report: ReportResponse | null) => void;

  // Query Actions
  updateQuery: (updates: Partial<ReportsQuery>) => void;

  // Utils
  refetch: () => Promise<void>;
}

interface UseAdminStatsReturn {
  // State
  stats: SystemStatsResponse | null;
  isLoading: boolean;
  error: string | null;
  dashboard: {
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
    currentStats: {
      users: any;
      reviews: any;
      reports: any;
    };
  } | null;

  // Actions
  fetchSystemStats: () => Promise<SystemStatsResponse>;
  fetchUserStats: () => Promise<SystemStatsResponse['users']>;
  fetchContentStats: () => Promise<SystemStatsResponse['content']>;
  fetchActivityStats: () => Promise<SystemStatsResponse['activity']>;
  clearError: () => void;

  // Utils
  refetch: () => Promise<void>;
}

interface UseAdminUIReturn {
  // State
  selectedTab: 'users' | 'reviews' | 'reports' | 'stats';
  bulkCounts: {
    users: number;
    reviews: number;
  };
  banForm: { userId: string; reason: string } | null;
  promoteForm: { userId: string; role: 'MODERATOR' | 'ADMIN' } | null;
  rejectForm: { reviewId: string; reason: string } | null;
  resolveForm: {
    reportId: string;
    resolution: string;
    action: 'RESOLVED' | 'DISMISSED';
  } | null;

  // Actions
  setTab: (tab: 'users' | 'reviews' | 'reports' | 'stats') => void;
  clearAllSelections: () => void;

  // Form Actions
  openBanDialog: (userId: string, reason?: string) => void;
  closeBanDialog: () => void;
  openPromoteDialog: (userId: string, role?: 'MODERATOR' | 'ADMIN') => void;
  closePromoteDialog: () => void;
  openRejectDialog: (reviewId: string, reason?: string) => void;
  closeRejectDialog: () => void;
  openResolveDialog: (
    reportId: string,
    resolution?: string,
    action?: 'RESOLVED' | 'DISMISSED',
  ) => void;
  closeResolveDialog: () => void;
}

// ============================================================================
// User Management Hook
// ============================================================================

/**
 * Hook for managing admin user operations
 *
 * @example
 * ```tsx
 * function AdminUsersPanel() {
 *   const {
 *     users,
 *     isLoading,
 *     error,
 *     fetchUsers,
 *     banUser,
 *     promoteUser,
 *     clearError
 *   } = useAdminUsers();
 *
 *   useEffect(() => {
 *     fetchUsers({ page: 1, limit: 20, role: 'USER' });
 *   }, []);
 *
 *   const handleBanUser = async (userId: string, reason: string) => {
 *     try {
 *       await banUser(userId, reason);
 *       // User will be updated in the list automatically
 *     } catch (err) {
 *       // Error is already handled in the hook
 *     }
 *   };
 *
 *   if (error) return <ErrorMessage message={error} onClose={clearError} />;
 *   if (isLoading) return <Loading />;
 *
 *   return (
 *     <div>
 *       {users?.data.map(user => (
 *         <UserCard
 *           key={user.id}
 *           user={user}
 *           onBan={(reason) => handleBanUser(user.id, reason)}
 *         />
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export function useAdminUsers(): UseAdminUsersReturn {
  // Subscribe to global admin stores
  const users = useStore(adminUsersState);
  const selectedUser = useStore(selectedUserState);
  const query = useStore(userManagementQuery);
  const isLoading = useStore(usersLoading);
  const error = useStore(usersError);
  const stats = useStore(usersStats);
  const bulkSelected = useStore(bulkSelectedUsers);

  // ============================================================================
  // API Actions
  // ============================================================================

  const fetchUsers = useCallback(
    async (queryParams: UserManagementQuery = {}): Promise<PaginatedUsersResponse> => {
      setUsersLoading(true);
      setUsersError(null);

      try {
        const response = await adminService.getUsers(queryParams);
        setUsersData(response);
        updateUserManagementQuery(queryParams);
        return response;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch users';
        setUsersError(errorMessage);
        throw error;
      } finally {
        setUsersLoading(false);
      }
    },
    [],
  );

  const fetchUserById = useCallback(async (userId: string): Promise<AdminUserResponse> => {
    setUsersLoading(true);
    setUsersError(null);

    try {
      const response = await adminService.getUserById(userId);
      setSelectedUser(response);
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch user';
      setUsersError(errorMessage);
      throw error;
    } finally {
      setUsersLoading(false);
    }
  }, []);

  const searchUsers = useCallback(
    async (
      searchTerm: string,
      options: Omit<UserManagementQuery, 'search'> = {},
    ): Promise<PaginatedUsersResponse> => {
      setUsersLoading(true);
      setUsersError(null);

      try {
        const response = await adminService.searchUsers(searchTerm, options);
        setUsersData(response);
        updateUserManagementQuery({ ...options, search: searchTerm });
        return response;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to search users';
        setUsersError(errorMessage);
        throw error;
      } finally {
        setUsersLoading(false);
      }
    },
    [],
  );

  const getUsersByRole = useCallback(
    async (
      role: 'USER' | 'MODERATOR' | 'ADMIN',
      options: Omit<UserManagementQuery, 'role'> = {},
    ): Promise<PaginatedUsersResponse> => {
      return fetchUsers({ ...options, role });
    },
    [fetchUsers],
  );

  const getBannedUsers = useCallback(
    async (options: UserManagementQuery = {}): Promise<PaginatedUsersResponse> => {
      return fetchUsers({ ...options, status: 'BANNED' });
    },
    [fetchUsers],
  );

  const banUser = useCallback(
    async (userId: string, reason: string): Promise<void> => {
      try {
        await adminService.banUser(userId, reason);

        // Optimistically update the user in the list
        const currentUser = users?.data.find((u) => u.id === userId);
        if (currentUser) {
          const updatedUser: AdminUserResponse = {
            ...currentUser,
            isBanned: true,
            banReason: reason,
            bannedAt: new Date(),
            isActive: false,
          };
          updateUserInList(userId, updatedUser);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to ban user';
        setUsersError(errorMessage);
        throw error;
      }
    },
    [users],
  );

  const unbanUser = useCallback(
    async (userId: string): Promise<void> => {
      try {
        await adminService.unbanUser(userId);

        // Optimistically update the user in the list
        const currentUser = users?.data.find((u) => u.id === userId);
        if (currentUser) {
          const updatedUser: AdminUserResponse = {
            ...currentUser,
            isBanned: false,
            banReason: undefined,
            bannedAt: undefined,
            isActive: true,
          };
          updateUserInList(userId, updatedUser);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to unban user';
        setUsersError(errorMessage);
        throw error;
      }
    },
    [users],
  );

  const promoteUser = useCallback(
    async (userId: string, role: 'MODERATOR' | 'ADMIN'): Promise<AdminUserResponse> => {
      try {
        const response = await adminService.promoteUser(userId, role);
        updateUserInList(userId, response);
        return response;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to promote user';
        setUsersError(errorMessage);
        throw error;
      }
    },
    [],
  );

  const demoteUser = useCallback(async (userId: string): Promise<AdminUserResponse> => {
    try {
      const response = await adminService.demoteUser(userId);
      updateUserInList(userId, response);
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to demote user';
      setUsersError(errorMessage);
      throw error;
    }
  }, []);

  const bulkBanUsers = useCallback(
    async (userIds: string[], reason: string): Promise<void> => {
      try {
        await adminService.bulkBanUsers(userIds, reason);

        // Optimistically update all users in the list
        userIds.forEach((userId) => {
          const currentUser = users?.data.find((u) => u.id === userId);
          if (currentUser) {
            const updatedUser: AdminUserResponse = {
              ...currentUser,
              isBanned: true,
              banReason: reason,
              bannedAt: new Date(),
              isActive: false,
            };
            updateUserInList(userId, updatedUser);
          }
        });

        // Clear selections after successful bulk operation
        clearBulkSelections();
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to bulk ban users';
        setUsersError(errorMessage);
        throw error;
      }
    },
    [users],
  );

  // ============================================================================
  // Utility Actions
  // ============================================================================

  const clearError = useCallback(() => {
    setUsersError(null);
  }, []);

  const clearData = useCallback(() => {
    resetUserManagement();
  }, []);

  const selectUser = useCallback((user: AdminUserResponse | null) => {
    setSelectedUser(user);
  }, []);

  const toggleSelection = useCallback((userId: string) => {
    toggleUserSelection(userId);
  }, []);

  const selectAll = useCallback(() => {
    selectAllUsers();
  }, []);

  const clearSelections = useCallback(() => {
    clearBulkSelections();
  }, []);

  const updateQuery = useCallback((updates: Partial<UserManagementQuery>) => {
    updateUserManagementQuery(updates);
  }, []);

  const refetch = useCallback(async (): Promise<void> => {
    await fetchUsers(query);
  }, [fetchUsers, query]);

  return {
    // State
    users,
    selectedUser,
    query,
    isLoading,
    error,
    stats,
    bulkSelected,

    // Actions
    fetchUsers,
    fetchUserById,
    searchUsers,
    getUsersByRole,
    getBannedUsers,
    banUser,
    unbanUser,
    promoteUser,
    demoteUser,
    bulkBanUsers,
    clearError,
    clearData,

    // Selection Actions
    selectUser,
    toggleSelection,
    selectAll,
    clearSelections,

    // Query Actions
    updateQuery,

    // Utils
    refetch,
  };
}

// ============================================================================
// Content Moderation Hook
// ============================================================================

/**
 * Hook for managing admin review moderation operations
 *
 * @example
 * ```tsx
 * function AdminReviewsPanel() {
 *   const {
 *     reviews,
 *     isLoading,
 *     error,
 *     fetchPendingReviews,
 *     approveReview,
 *     rejectReview,
 *     clearError
 *   } = useAdminReviews();
 *
 *   useEffect(() => {
 *     fetchPendingReviews({ page: 1, limit: 20 });
 *   }, []);
 *
 *   const handleApproveReview = async (reviewId: string) => {
 *     try {
 *       await approveReview(reviewId);
 *       // Review will be removed from pending list automatically
 *     } catch (err) {
 *       // Error is already handled in the hook
 *     }
 *   };
 *
 *   if (error) return <ErrorMessage message={error} onClose={clearError} />;
 *   if (isLoading) return <Loading />;
 *
 *   return (
 *     <div>
 *       {reviews?.data.map(review => (
 *         <ReviewModerationCard
 *           key={review.id}
 *           review={review}
 *           onApprove={() => handleApproveReview(review.id)}
 *           onReject={(reason) => rejectReview(review.id, reason)}
 *         />
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export function useAdminReviews(): UseAdminReviewsReturn {
  // Subscribe to global admin stores
  const reviews = useStore(pendingReviewsState);
  const selectedReview = useStore(selectedReviewState);
  const query = useStore(contentModerationQuery);
  const isLoading = useStore(reviewsLoading);
  const error = useStore(reviewsError);
  const stats = useStore(reviewsStats);
  const bulkSelected = useStore(bulkSelectedReviews);

  // ============================================================================
  // API Actions
  // ============================================================================

  const fetchPendingReviews = useCallback(
    async (queryParams: ContentModerationQuery = {}): Promise<PaginatedReviewsResponse> => {
      setReviewsLoading(true);
      setReviewsError(null);

      try {
        const response = await adminService.getPendingReviews(queryParams);
        setPendingReviewsData(response);
        updateContentModerationQuery(queryParams);
        return response;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to fetch pending reviews';
        setReviewsError(errorMessage);
        throw error;
      } finally {
        setReviewsLoading(false);
      }
    },
    [],
  );

  const approveReview = useCallback(async (reviewId: string): Promise<void> => {
    try {
      await adminService.approveReview(reviewId);
      // Remove the review from the pending list
      removeReviewFromList(reviewId);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to approve review';
      setReviewsError(errorMessage);
      throw error;
    }
  }, []);

  const rejectReview = useCallback(async (reviewId: string, reason: string): Promise<void> => {
    try {
      await adminService.rejectReview(reviewId, reason);
      // Remove the review from the pending list
      removeReviewFromList(reviewId);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to reject review';
      setReviewsError(errorMessage);
      throw error;
    }
  }, []);

  const bulkApproveReviews = useCallback(async (reviewIds: string[]): Promise<void> => {
    try {
      await adminService.bulkApproveReviews(reviewIds);

      // Remove all approved reviews from the pending list
      reviewIds.forEach((reviewId) => {
        removeReviewFromList(reviewId);
      });

      // Clear selections after successful bulk operation
      clearBulkSelections();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to bulk approve reviews';
      setReviewsError(errorMessage);
      throw error;
    }
  }, []);

  const bulkRejectReviews = useCallback(
    async (reviewIds: string[], reason: string): Promise<void> => {
      try {
        await adminService.bulkRejectReviews(reviewIds, reason);

        // Remove all rejected reviews from the pending list
        reviewIds.forEach((reviewId) => {
          removeReviewFromList(reviewId);
        });

        // Clear selections after successful bulk operation
        clearBulkSelections();
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to bulk reject reviews';
        setReviewsError(errorMessage);
        throw error;
      }
    },
    [],
  );

  // ============================================================================
  // Utility Actions
  // ============================================================================

  const clearError = useCallback(() => {
    setReviewsError(null);
  }, []);

  const clearData = useCallback(() => {
    resetContentModeration();
  }, []);

  const selectReview = useCallback((review: PendingReviewResponse | null) => {
    setSelectedReview(review);
  }, []);

  const toggleSelection = useCallback((reviewId: string) => {
    toggleReviewSelection(reviewId);
  }, []);

  const selectAll = useCallback(() => {
    selectAllReviews();
  }, []);

  const clearSelections = useCallback(() => {
    clearBulkSelections();
  }, []);

  const updateQuery = useCallback((updates: Partial<ContentModerationQuery>) => {
    updateContentModerationQuery(updates);
  }, []);

  const refetch = useCallback(async (): Promise<void> => {
    await fetchPendingReviews(query);
  }, [fetchPendingReviews, query]);

  return {
    // State
    reviews,
    selectedReview,
    query,
    isLoading,
    error,
    stats,
    bulkSelected,

    // Actions
    fetchPendingReviews,
    approveReview,
    rejectReview,
    bulkApproveReviews,
    bulkRejectReviews,
    clearError,
    clearData,

    // Selection Actions
    selectReview,
    toggleSelection,
    selectAll,
    clearSelections,

    // Query Actions
    updateQuery,

    // Utils
    refetch,
  };
}

// ============================================================================
// Reports Management Hook
// ============================================================================

/**
 * Hook for managing admin report operations
 *
 * @example
 * ```tsx
 * function AdminReportsPanel() {
 *   const {
 *     reports,
 *     isLoading,
 *     error,
 *     fetchReports,
 *     resolveReport,
 *     clearError
 *   } = useAdminReports();
 *
 *   useEffect(() => {
 *     fetchReports({ page: 1, limit: 20, status: 'PENDING' });
 *   }, []);
 *
 *   const handleResolveReport = async (reportId: string, resolution: string) => {
 *     try {
 *       await resolveReport(reportId, resolution, 'RESOLVED');
 *     } catch (err) {
 *       // Error is already handled in the hook
 *     }
 *   };
 *
 *   if (error) return <ErrorMessage message={error} onClose={clearError} />;
 *   if (isLoading) return <Loading />;
 *
 *   return (
 *     <div>
 *       {reports?.data.map(report => (
 *         <ReportCard
 *           key={report.id}
 *           report={report}
 *           onResolve={(resolution) => handleResolveReport(report.id, resolution)}
 *         />
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export function useAdminReports(): UseAdminReportsReturn {
  // Subscribe to global admin stores
  const reports = useStore(reportsState);
  const selectedReport = useStore(selectedReportState);
  const query = useStore(reportsQuery);
  const isLoading = useStore(reportsLoading);
  const error = useStore(reportsError);
  const stats = useStore(reportsStats);

  // ============================================================================
  // API Actions
  // ============================================================================

  const fetchReports = useCallback(
    async (queryParams: ReportsQuery = {}): Promise<PaginatedReportsResponse> => {
      setReportsLoading(true);
      setReportsError(null);

      try {
        const response = await adminService.getReports(queryParams);
        setReportsData(response);
        updateReportsQuery(queryParams);
        return response;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch reports';
        setReportsError(errorMessage);
        throw error;
      } finally {
        setReportsLoading(false);
      }
    },
    [],
  );

  const fetchReportById = useCallback(async (reportId: string): Promise<ReportResponse> => {
    setReportsLoading(true);
    setReportsError(null);

    try {
      const response = await adminService.getReportById(reportId);
      setSelectedReport(response);
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch report';
      setReportsError(errorMessage);
      throw error;
    } finally {
      setReportsLoading(false);
    }
  }, []);

  const getPendingReports = useCallback(
    async (options: ReportsQuery = {}): Promise<PaginatedReportsResponse> => {
      return fetchReports({ ...options, status: 'PENDING' });
    },
    [fetchReports],
  );

  const resolveReport = useCallback(
    async (
      reportId: string,
      resolution: string,
      action: 'DISMISSED' | 'RESOLVED' = 'RESOLVED',
    ): Promise<void> => {
      try {
        await adminService.resolveReport(reportId, resolution, action);

        // Optimistically update the report in the list
        const currentReport = reports?.data.find((r) => r.id === reportId);
        if (currentReport) {
          const updatedReport: ReportResponse = {
            ...currentReport,
            status: action,
            resolution,
            resolvedAt: new Date(),
          };
          updateReportInList(reportId, updatedReport);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to resolve report';
        setReportsError(errorMessage);
        throw error;
      }
    },
    [reports],
  );

  // ============================================================================
  // Utility Actions
  // ============================================================================

  const clearError = useCallback(() => {
    setReportsError(null);
  }, []);

  const clearData = useCallback(() => {
    resetReportsManagement();
  }, []);

  const selectReport = useCallback((report: ReportResponse | null) => {
    setSelectedReport(report);
  }, []);

  const updateQuery = useCallback((updates: Partial<ReportsQuery>) => {
    updateReportsQuery(updates);
  }, []);

  const refetch = useCallback(async (): Promise<void> => {
    await fetchReports(query);
  }, [fetchReports, query]);

  return {
    // State
    reports,
    selectedReport,
    query,
    isLoading,
    error,
    stats,

    // Actions
    fetchReports,
    fetchReportById,
    getPendingReports,
    resolveReport,
    clearError,
    clearData,

    // Selection Actions
    selectReport,

    // Query Actions
    updateQuery,

    // Utils
    refetch,
  };
}

// ============================================================================
// System Statistics Hook
// ============================================================================

/**
 * Hook for managing admin system statistics
 *
 * @example
 * ```tsx
 * function AdminDashboard() {
 *   const {
 *     stats,
 *     dashboard,
 *     isLoading,
 *     error,
 *     fetchSystemStats,
 *     clearError
 *   } = useAdminStats();
 *
 *   useEffect(() => {
 *     fetchSystemStats();
 *   }, []);
 *
 *   if (error) return <ErrorMessage message={error} onClose={clearError} />;
 *   if (isLoading) return <Loading />;
 *
 *   return (
 *     <div>
 *       <StatCard title="Total Users" value={stats?.users.total} />
 *       <StatCard title="Active Users" value={stats?.users.active} />
 *       <StatCard title="Total Reviews" value={stats?.content.reviews} />
 *       <StatCard title="Pending Reports" value={stats?.reports.pending} />
 *     </div>
 *   );
 * }
 * ```
 */
export function useAdminStats(): UseAdminStatsReturn {
  // Subscribe to global admin stores
  const stats = useStore(systemStatsState);
  const isLoading = useStore(statsLoading);
  const error = useStore(statsError);
  const dashboard = useStore(dashboardSummary);

  // ============================================================================
  // API Actions
  // ============================================================================

  const fetchSystemStats = useCallback(async (): Promise<SystemStatsResponse> => {
    setStatsLoading(true);
    setStatsError(null);

    try {
      const response = await adminService.getSystemStats();
      setSystemStats(response);
      return response;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to fetch system statistics';
      setStatsError(errorMessage);
      throw error;
    } finally {
      setStatsLoading(false);
    }
  }, []);

  const fetchUserStats = useCallback(async (): Promise<SystemStatsResponse['users']> => {
    setStatsLoading(true);
    setStatsError(null);

    try {
      const response = await adminService.getUserStats();
      return response;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to fetch user statistics';
      setStatsError(errorMessage);
      throw error;
    } finally {
      setStatsLoading(false);
    }
  }, []);

  const fetchContentStats = useCallback(async (): Promise<SystemStatsResponse['content']> => {
    setStatsLoading(true);
    setStatsError(null);

    try {
      const response = await adminService.getContentStats();
      return response;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to fetch content statistics';
      setStatsError(errorMessage);
      throw error;
    } finally {
      setStatsLoading(false);
    }
  }, []);

  const fetchActivityStats = useCallback(async (): Promise<SystemStatsResponse['activity']> => {
    setStatsLoading(true);
    setStatsError(null);

    try {
      const response = await adminService.getActivityStats();
      return response;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to fetch activity statistics';
      setStatsError(errorMessage);
      throw error;
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // ============================================================================
  // Utility Actions
  // ============================================================================

  const clearError = useCallback(() => {
    setStatsError(null);
  }, []);

  const refetch = useCallback(async (): Promise<void> => {
    await fetchSystemStats();
  }, [fetchSystemStats]);

  return {
    // State
    stats,
    isLoading,
    error,
    dashboard,

    // Actions
    fetchSystemStats,
    fetchUserStats,
    fetchContentStats,
    fetchActivityStats,
    clearError,

    // Utils
    refetch,
  };
}

// ============================================================================
// Admin UI Hook
// ============================================================================

/**
 * Hook for managing admin UI state and interactions
 *
 * @example
 * ```tsx
 * function AdminPanel() {
 *   const {
 *     selectedTab,
 *     bulkCounts,
 *     setTab,
 *     openBanDialog,
 *     closeBanDialog
 *   } = useAdminUI();
 *
 *   return (
 *     <div>
 *       <AdminTabs selectedTab={selectedTab} onTabChange={setTab} />
 *       {bulkCounts.users > 0 && (
 *         <BulkActions count={bulkCounts.users} />
 *       )}
 *       <BanUserDialog
 *         open={banForm !== null}
 *         onClose={closeBanDialog}
 *         onConfirm={(reason) => banUser(banForm.userId, reason)}
 *       />
 *     </div>
 *   );
 * }
 * ```
 */
export function useAdminUI(): UseAdminUIReturn {
  // Subscribe to global admin UI stores
  const currentTab = useStore(selectedTab);
  const bulkCounts = useStore(bulkSelectionCounts);
  const banForm = useStore(banUserForm);
  const promoteForm = useStore(promoteUserForm);
  const rejectForm = useStore(rejectReviewForm);
  const resolveForm = useStore(resolveReportForm);

  // ============================================================================
  // UI Actions
  // ============================================================================

  const setTab = useCallback((tab: 'users' | 'reviews' | 'reports' | 'stats') => {
    setSelectedTab(tab);
  }, []);

  const clearAllSelections = useCallback(() => {
    clearBulkSelections();
  }, []);

  // ============================================================================
  // Form Actions
  // ============================================================================

  const openBanDialog = useCallback((userId: string, reason: string = '') => {
    setBanUserForm({ userId, reason });
  }, []);

  const closeBanDialog = useCallback(() => {
    setBanUserForm(null);
  }, []);

  const openPromoteDialog = useCallback(
    (userId: string, role: 'MODERATOR' | 'ADMIN' = 'MODERATOR') => {
      setPromoteUserForm({ userId, role });
    },
    [],
  );

  const closePromoteDialog = useCallback(() => {
    setPromoteUserForm(null);
  }, []);

  const openRejectDialog = useCallback((reviewId: string, reason: string = '') => {
    setRejectReviewForm({ reviewId, reason });
  }, []);

  const closeRejectDialog = useCallback(() => {
    setRejectReviewForm(null);
  }, []);

  const openResolveDialog = useCallback(
    (reportId: string, resolution: string = '', action: 'RESOLVED' | 'DISMISSED' = 'RESOLVED') => {
      setResolveReportForm({ reportId, resolution, action });
    },
    [],
  );

  const closeResolveDialog = useCallback(() => {
    setResolveReportForm(null);
  }, []);

  return {
    // State
    selectedTab: currentTab,
    bulkCounts,
    banForm,
    promoteForm,
    rejectForm,
    resolveForm,

    // Actions
    setTab,
    clearAllSelections,

    // Form Actions
    openBanDialog,
    closeBanDialog,
    openPromoteDialog,
    closePromoteDialog,
    openRejectDialog,
    closeRejectDialog,
    openResolveDialog,
    closeResolveDialog,
  };
}

// ============================================================================
// Combined Admin Hook
// ============================================================================

/**
 * Combined hook that provides access to all admin functionality
 *
 * @example
 * ```typescript
 * function AdminDashboard() {
 *   const admin = useAdminModule();
 *
 *   // Access all admin features
 *   const { users, reviews, reports, stats, ui } = admin;
 *
 *   useEffect(() => {
 *     // Initialize dashboard data
 *     admin.initializeDashboard();
 *   }, []);
 *
 *   return (
 *     <div>
 *       <AdminTabs selectedTab={ui.selectedTab} onTabChange={ui.setTab} />
 *       {ui.selectedTab === 'users' && <UsersPanel {...users} />}
 *       {ui.selectedTab === 'reviews' && <ReviewsPanel {...reviews} />}
 *       {ui.selectedTab === 'reports' && <ReportsPanel {...reports} />}
 *       {ui.selectedTab === 'stats' && <StatsPanel {...stats} />}
 *     </div>
 *   );
 * }
 * ```
 */
export function useAdminModule() {
  const users = useAdminUsers();
  const reviews = useAdminReviews();
  const reports = useAdminReports();
  const stats = useAdminStats();
  const ui = useAdminUI();

  // ============================================================================
  // Initialization Functions
  // ============================================================================

  const initializeDashboard = useCallback(async () => {
    try {
      // Load initial stats for dashboard
      await stats.fetchSystemStats();
    } catch (error) {
      console.error('Failed to initialize admin dashboard:', error);
    }
  }, [stats]);

  const initializeUsersTab = useCallback(async () => {
    if (!users.users) {
      try {
        await users.fetchUsers({ page: 1, limit: 20 });
      } catch (error) {
        console.error('Failed to initialize users tab:', error);
      }
    }
  }, [users]);

  const initializeReviewsTab = useCallback(async () => {
    if (!reviews.reviews) {
      try {
        await reviews.fetchPendingReviews({ page: 1, limit: 20 });
      } catch (error) {
        console.error('Failed to initialize reviews tab:', error);
      }
    }
  }, [reviews]);

  const initializeReportsTab = useCallback(async () => {
    if (!reports.reports) {
      try {
        await reports.fetchReports({ page: 1, limit: 20, status: 'PENDING' });
      } catch (error) {
        console.error('Failed to initialize reports tab:', error);
      }
    }
  }, [reports]);

  // ============================================================================
  // Combined Actions
  // ============================================================================

  const clearAllData = useCallback(() => {
    users.clearData();
    reviews.clearData();
    reports.clearData();
    ui.clearAllSelections();
  }, [users, reviews, reports, ui]);

  const refreshAllData = useCallback(async () => {
    const promises = [];

    if (users.users) promises.push(users.refetch());
    if (reviews.reviews) promises.push(reviews.refetch());
    if (reports.reports) promises.push(reports.refetch());
    if (stats.stats) promises.push(stats.refetch());

    try {
      await Promise.all(promises);
    } catch (error) {
      console.error('Failed to refresh admin data:', error);
    }
  }, [users, reviews, reports, stats]);

  // ============================================================================
  // Auto-initialization Effect
  // ============================================================================

  useEffect(() => {
    initializeDashboard();
  }, [initializeDashboard]);

  // Initialize tab data when switching tabs
  useEffect(() => {
    switch (ui.selectedTab) {
      case 'users':
        initializeUsersTab();
        break;
      case 'reviews':
        initializeReviewsTab();
        break;
      case 'reports':
        initializeReportsTab();
        break;
      case 'stats':
        // Stats are already loaded in dashboard initialization
        break;
    }
  }, [ui.selectedTab, initializeUsersTab, initializeReviewsTab, initializeReportsTab]);

  return {
    users,
    reviews,
    reports,
    stats,
    ui,

    // Combined actions
    initializeDashboard,
    initializeUsersTab,
    initializeReviewsTab,
    initializeReportsTab,
    clearAllData,
    refreshAllData,

    // Global reset
    resetAll: resetAdminState,
  };
}

// ============================================================================
// Specialized Admin Hooks
// ============================================================================

/**
 * Hook for admin dashboard overview with key metrics
 */
export function useAdminDashboard() {
  const { stats } = useAdminModule();
  const dashboard = useStore(dashboardSummary);

  useEffect(() => {
    if (!stats.stats) {
      stats.fetchSystemStats();
    }
  }, [stats]);

  return {
    dashboard,
    isLoading: stats.isLoading,
    error: stats.error,
    refetch: stats.refetch,
    clearError: stats.clearError,
  };
}

/**
 * Hook for requiring admin privileges - redirects if not admin
 */
export function useRequireAdmin() {
  const auth = useStore($currentUser);

  useEffect(() => {
    if (auth && auth.role !== 'ADMIN' && auth.role !== 'MODERATOR') {
      // Redirect to unauthorized page
      if (typeof window !== 'undefined') {
        window.location.href = '/unauthorized';
      }
    }
  }, [auth]);

  return {
    isAdmin: auth?.role === 'ADMIN',
    isModerator: auth?.role === 'MODERATOR',
    hasAccess: auth?.role === 'ADMIN' || auth?.role === 'MODERATOR',
  };
}

/**
 * Hook for admin-only routes - redirects if not admin
 */
export function useAdminOnly() {
  const auth = useStore($currentUser);

  useEffect(() => {
    if (auth && auth.role !== 'ADMIN') {
      // Redirect to unauthorized page
      if (typeof window !== 'undefined') {
        window.location.href = '/unauthorized';
      }
    }
  }, [auth]);

  return {
    isAdmin: auth?.role === 'ADMIN',
  };
}
