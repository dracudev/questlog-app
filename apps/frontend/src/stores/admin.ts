import { atom, computed, map } from 'nanostores';
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
} from '../services/admin';

// ============================================================================
// State Atoms
// ============================================================================

// User Management State
export const adminUsersState = atom<PaginatedUsersResponse | null>(null);
export const selectedUserState = atom<AdminUserResponse | null>(null);
export const userManagementQuery = atom<UserManagementQuery>({ page: 1, limit: 20 });
export const usersLoading = atom<boolean>(false);
export const usersError = atom<string | null>(null);

// Content Moderation State
export const pendingReviewsState = atom<PaginatedReviewsResponse | null>(null);
export const selectedReviewState = atom<PendingReviewResponse | null>(null);
export const contentModerationQuery = atom<ContentModerationQuery>({ page: 1, limit: 20 });
export const reviewsLoading = atom<boolean>(false);
export const reviewsError = atom<string | null>(null);

// Reports Management State
export const reportsState = atom<PaginatedReportsResponse | null>(null);
export const selectedReportState = atom<ReportResponse | null>(null);
export const reportsQuery = atom<ReportsQuery>({ page: 1, limit: 20 });
export const reportsLoading = atom<boolean>(false);
export const reportsError = atom<string | null>(null);

// System Statistics State
export const systemStatsState = atom<SystemStatsResponse | null>(null);
export const statsLoading = atom<boolean>(false);
export const statsError = atom<string | null>(null);

// UI State
export const selectedTab = atom<'users' | 'reviews' | 'reports' | 'stats'>('users');
export const bulkSelectedUsers = atom<string[]>([]);
export const bulkSelectedReviews = atom<string[]>([]);
export const showBanDialog = atom<boolean>(false);
export const showPromoteDialog = atom<boolean>(false);

// Form State
export const banUserForm = atom<{ userId: string; reason: string } | null>(null);
export const promoteUserForm = atom<{ userId: string; role: 'MODERATOR' | 'ADMIN' } | null>(null);
export const rejectReviewForm = atom<{ reviewId: string; reason: string } | null>(null);
export const resolveReportForm = atom<{
  reportId: string;
  resolution: string;
  action: 'RESOLVED' | 'DISMISSED';
} | null>(null);

// Cache Management
const adminUsersCache = map<Record<string, AdminUserResponse>>({});
const pendingReviewsCache = map<Record<string, PendingReviewResponse>>({});
const reportsCache = map<Record<string, ReportResponse>>({});

// ============================================================================
// Computed Values
// ============================================================================

// Users Statistics
export const usersStats = computed(adminUsersState, (usersData) => {
  if (!usersData?.data) return null;

  const activeUsers = usersData.data.filter((user) => user.isActive && !user.isBanned).length;
  const bannedUsers = usersData.data.filter((user) => user.isBanned).length;
  const moderators = usersData.data.filter((user) => user.role === 'MODERATOR').length;
  const admins = usersData.data.filter((user) => user.role === 'ADMIN').length;

  return {
    total: usersData.total,
    active: activeUsers,
    banned: bannedUsers,
    moderators,
    admins,
    currentPage: usersData.page,
    totalPages: usersData.totalPages,
  };
});

// Reviews Statistics
export const reviewsStats = computed(pendingReviewsState, (reviewsData) => {
  if (!reviewsData?.data) return null;

  const highPriorityReviews = reviewsData.data.filter((review) => review.reportCount > 5).length;
  const reportedReviews = reviewsData.data.filter((review) => review.reportCount > 0).length;

  return {
    total: reviewsData.total,
    highPriority: highPriorityReviews,
    reported: reportedReviews,
    currentPage: reviewsData.page,
    totalPages: reviewsData.totalPages,
  };
});

// Reports Statistics
export const reportsStats = computed(reportsState, (reportsData) => {
  if (!reportsData?.data) return null;

  const pendingReports = reportsData.data.filter((report) => report.status === 'PENDING').length;
  const resolvedReports = reportsData.data.filter((report) => report.status === 'RESOLVED').length;
  const reviewReports = reportsData.data.filter((report) => report.type === 'REVIEW').length;
  const userReports = reportsData.data.filter((report) => report.type === 'USER').length;

  return {
    total: reportsData.total,
    pending: pendingReports,
    resolved: resolvedReports,
    reviewReports,
    userReports,
    currentPage: reportsData.page,
    totalPages: reportsData.totalPages,
  };
});

// Dashboard Summary
export const dashboardSummary = computed(
  [systemStatsState, usersStats, reviewsStats, reportsStats],
  (systemStats, usersStatsData, reviewsStatsData, reportsStatsData) => {
    if (!systemStats) return null;

    return {
      users: {
        total: systemStats.users.total,
        active: systemStats.users.active,
        banned: systemStats.users.banned,
        newThisMonth: systemStats.users.newThisMonth,
      },
      content: {
        games: systemStats.content.games,
        reviews: systemStats.content.reviews,
        pendingReviews: systemStats.content.pendingReviews,
        comments: systemStats.content.comments,
      },
      activity: {
        dailyActiveUsers: systemStats.activity.dailyActiveUsers,
        weeklyActiveUsers: systemStats.activity.weeklyActiveUsers,
        monthlyActiveUsers: systemStats.activity.monthlyActiveUsers,
        avgSessionDuration: systemStats.activity.avgSessionDuration,
      },
      reports: {
        pending: systemStats.reports.pending,
        resolved: systemStats.reports.resolved,
        dismissed: systemStats.reports.dismissed,
      },
      currentStats: {
        users: usersStatsData,
        reviews: reviewsStatsData,
        reports: reportsStatsData,
      },
    };
  },
);

// Bulk Selection Counts
export const bulkSelectionCounts = computed(
  [bulkSelectedUsers, bulkSelectedReviews],
  (selectedUsers, selectedReviews) => ({
    users: selectedUsers.length,
    reviews: selectedReviews.length,
  }),
);

// ============================================================================
// Action Functions
// ============================================================================

// User Management Actions
export function setUsersData(data: PaginatedUsersResponse): void {
  adminUsersState.set(data);

  // Cache individual users
  data.data.forEach((user) => {
    adminUsersCache.setKey(user.id, user);
  });
}

export function updateUserInList(userId: string, updatedUser: AdminUserResponse): void {
  const currentData = adminUsersState.get();
  if (currentData) {
    const updatedData = {
      ...currentData,
      data: currentData.data.map((user) => (user.id === userId ? updatedUser : user)),
    };
    adminUsersState.set(updatedData);
  }

  // Update cache
  adminUsersCache.setKey(userId, updatedUser);
}

export function removeUserFromList(userId: string): void {
  const currentData = adminUsersState.get();
  if (currentData) {
    const updatedData = {
      ...currentData,
      data: currentData.data.filter((user) => user.id !== userId),
      total: currentData.total - 1,
    };
    adminUsersState.set(updatedData);
  }

  // Remove from cache
  adminUsersCache.setKey(userId, undefined);
}

export function setSelectedUser(user: AdminUserResponse | null): void {
  selectedUserState.set(user);
}

export function updateUserManagementQuery(updates: Partial<UserManagementQuery>): void {
  const currentQuery = userManagementQuery.get();
  userManagementQuery.set({ ...currentQuery, ...updates });
}

export function setUsersLoading(loading: boolean): void {
  usersLoading.set(loading);
}

export function setUsersError(error: string | null): void {
  usersError.set(error);
}

// Content Moderation Actions
export function setPendingReviewsData(data: PaginatedReviewsResponse): void {
  pendingReviewsState.set(data);

  // Cache individual reviews
  data.data.forEach((review) => {
    pendingReviewsCache.setKey(review.id, review);
  });
}

export function removeReviewFromList(reviewId: string): void {
  const currentData = pendingReviewsState.get();
  if (currentData) {
    const updatedData = {
      ...currentData,
      data: currentData.data.filter((review) => review.id !== reviewId),
      total: currentData.total - 1,
    };
    pendingReviewsState.set(updatedData);
  }

  // Remove from cache
  pendingReviewsCache.setKey(reviewId, undefined);
}

export function setSelectedReview(review: PendingReviewResponse | null): void {
  selectedReviewState.set(review);
}

export function updateContentModerationQuery(updates: Partial<ContentModerationQuery>): void {
  const currentQuery = contentModerationQuery.get();
  contentModerationQuery.set({ ...currentQuery, ...updates });
}

export function setReviewsLoading(loading: boolean): void {
  reviewsLoading.set(loading);
}

export function setReviewsError(error: string | null): void {
  reviewsError.set(error);
}

// Reports Management Actions
export function setReportsData(data: PaginatedReportsResponse): void {
  reportsState.set(data);

  // Cache individual reports
  data.data.forEach((report) => {
    reportsCache.setKey(report.id, report);
  });
}

export function updateReportInList(reportId: string, updatedReport: ReportResponse): void {
  const currentData = reportsState.get();
  if (currentData) {
    const updatedData = {
      ...currentData,
      data: currentData.data.map((report) => (report.id === reportId ? updatedReport : report)),
    };
    reportsState.set(updatedData);
  }

  // Update cache
  reportsCache.setKey(reportId, updatedReport);
}

export function setSelectedReport(report: ReportResponse | null): void {
  selectedReportState.set(report);
}

export function updateReportsQuery(updates: Partial<ReportsQuery>): void {
  const currentQuery = reportsQuery.get();
  reportsQuery.set({ ...currentQuery, ...updates });
}

export function setReportsLoading(loading: boolean): void {
  reportsLoading.set(loading);
}

export function setReportsError(error: string | null): void {
  reportsError.set(error);
}

// System Statistics Actions
export function setSystemStats(stats: SystemStatsResponse): void {
  systemStatsState.set(stats);
}

export function setStatsLoading(loading: boolean): void {
  statsLoading.set(loading);
}

export function setStatsError(error: string | null): void {
  statsError.set(error);
}

// UI Actions
export function setSelectedTab(tab: 'users' | 'reviews' | 'reports' | 'stats'): void {
  selectedTab.set(tab);
  // Clear selections when switching tabs
  clearBulkSelections();
}

export function toggleUserSelection(userId: string): void {
  const current = bulkSelectedUsers.get();
  const isSelected = current.includes(userId);

  if (isSelected) {
    bulkSelectedUsers.set(current.filter((id) => id !== userId));
  } else {
    bulkSelectedUsers.set([...current, userId]);
  }
}

export function toggleReviewSelection(reviewId: string): void {
  const current = bulkSelectedReviews.get();
  const isSelected = current.includes(reviewId);

  if (isSelected) {
    bulkSelectedReviews.set(current.filter((id) => id !== reviewId));
  } else {
    bulkSelectedReviews.set([...current, reviewId]);
  }
}

export function selectAllUsers(): void {
  const currentData = adminUsersState.get();
  if (currentData) {
    const allUserIds = currentData.data.map((user) => user.id);
    bulkSelectedUsers.set(allUserIds);
  }
}

export function selectAllReviews(): void {
  const currentData = pendingReviewsState.get();
  if (currentData) {
    const allReviewIds = currentData.data.map((review) => review.id);
    bulkSelectedReviews.set(allReviewIds);
  }
}

export function clearBulkSelections(): void {
  bulkSelectedUsers.set([]);
  bulkSelectedReviews.set([]);
}

// Form Actions
export function setBanUserForm(form: { userId: string; reason: string } | null): void {
  banUserForm.set(form);
  showBanDialog.set(form !== null);
}

export function setPromoteUserForm(
  form: {
    userId: string;
    role: 'MODERATOR' | 'ADMIN';
  } | null,
): void {
  promoteUserForm.set(form);
  showPromoteDialog.set(form !== null);
}

export function setRejectReviewForm(form: { reviewId: string; reason: string } | null): void {
  rejectReviewForm.set(form);
}

export function setResolveReportForm(
  form: {
    reportId: string;
    resolution: string;
    action: 'RESOLVED' | 'DISMISSED';
  } | null,
): void {
  resolveReportForm.set(form);
}

// ============================================================================
// Cache Helper Functions
// ============================================================================

export function getCachedUser(userId: string): AdminUserResponse | undefined {
  return adminUsersCache.get()[userId];
}

export function getCachedReview(reviewId: string): PendingReviewResponse | undefined {
  return pendingReviewsCache.get()[reviewId];
}

export function getCachedReport(reportId: string): ReportResponse | undefined {
  return reportsCache.get()[reportId];
}

export function clearUsersCache(): void {
  adminUsersCache.set({});
}

export function clearReviewsCache(): void {
  pendingReviewsCache.set({});
}

export function clearReportsCache(): void {
  reportsCache.set({});
}

export function clearAllCaches(): void {
  clearUsersCache();
  clearReviewsCache();
  clearReportsCache();
}

// ============================================================================
// Filter Helper Functions
// ============================================================================

export function filterUsersByRole(
  users: AdminUserResponse[],
  role: 'USER' | 'MODERATOR' | 'ADMIN',
): AdminUserResponse[] {
  return users.filter((user) => user.role === role);
}

export function filterUsersByStatus(
  users: AdminUserResponse[],
  status: 'ACTIVE' | 'BANNED',
): AdminUserResponse[] {
  if (status === 'ACTIVE') {
    return users.filter((user) => user.isActive && !user.isBanned);
  }
  return users.filter((user) => user.isBanned);
}

export function filterReviewsByReportCount(
  reviews: PendingReviewResponse[],
  minReports: number,
): PendingReviewResponse[] {
  return reviews.filter((review) => review.reportCount >= minReports);
}

export function filterReportsByType(
  reports: ReportResponse[],
  type: 'REVIEW' | 'USER' | 'COMMENT',
): ReportResponse[] {
  return reports.filter((report) => report.type === type);
}

export function filterReportsByStatus(
  reports: ReportResponse[],
  status: 'PENDING' | 'RESOLVED' | 'DISMISSED',
): ReportResponse[] {
  return reports.filter((report) => report.status === status);
}

// ============================================================================
// Statistics Helper Functions
// ============================================================================

export function calculateUserGrowthRate(
  currentTotal: number,
  newThisMonth: number,
): { percentage: number; trend: 'up' | 'down' | 'stable' } {
  const previousTotal = currentTotal - newThisMonth;
  if (previousTotal === 0) return { percentage: 100, trend: 'up' };

  const percentage = (newThisMonth / previousTotal) * 100;
  return {
    percentage: Math.round(percentage * 100) / 100,
    trend: percentage > 5 ? 'up' : percentage < -5 ? 'down' : 'stable',
  };
}

export function getActivityTrend(
  daily: number,
  weekly: number,
  monthly: number,
): { metric: string; value: number; trend: 'up' | 'down' | 'stable' } {
  const dailyRate = daily / 1;
  const weeklyRate = weekly / 7;
  const monthlyRate = monthly / 30;

  // Compare current daily activity to historical patterns
  const weeklyComparison = (dailyRate - weeklyRate) / weeklyRate;
  const monthlyComparison = (dailyRate - monthlyRate) / monthlyRate;

  // Use the more conservative comparison
  const comparison = Math.min(weeklyComparison, monthlyComparison);

  return {
    metric: 'Daily Activity Trend',
    value: Math.round(comparison * 100 * 100) / 100,
    trend: comparison > 0.1 ? 'up' : comparison < -0.1 ? 'down' : 'stable',
  };
}

// ============================================================================
// Reset Functions
// ============================================================================

export function resetAdminState(): void {
  // Reset all atoms to initial state
  adminUsersState.set(null);
  selectedUserState.set(null);
  userManagementQuery.set({ page: 1, limit: 20 });
  usersLoading.set(false);
  usersError.set(null);

  pendingReviewsState.set(null);
  selectedReviewState.set(null);
  contentModerationQuery.set({ page: 1, limit: 20 });
  reviewsLoading.set(false);
  reviewsError.set(null);

  reportsState.set(null);
  selectedReportState.set(null);
  reportsQuery.set({ page: 1, limit: 20 });
  reportsLoading.set(false);
  reportsError.set(null);

  systemStatsState.set(null);
  statsLoading.set(false);
  statsError.set(null);

  selectedTab.set('users');
  clearBulkSelections();
  showBanDialog.set(false);
  showPromoteDialog.set(false);

  banUserForm.set(null);
  promoteUserForm.set(null);
  rejectReviewForm.set(null);
  resolveReportForm.set(null);

  clearAllCaches();
}

export function resetUserManagement(): void {
  adminUsersState.set(null);
  selectedUserState.set(null);
  userManagementQuery.set({ page: 1, limit: 20 });
  usersLoading.set(false);
  usersError.set(null);
  bulkSelectedUsers.set([]);
  clearUsersCache();
}

export function resetContentModeration(): void {
  pendingReviewsState.set(null);
  selectedReviewState.set(null);
  contentModerationQuery.set({ page: 1, limit: 20 });
  reviewsLoading.set(false);
  reviewsError.set(null);
  bulkSelectedReviews.set([]);
  clearReviewsCache();
}

export function resetReportsManagement(): void {
  reportsState.set(null);
  selectedReportState.set(null);
  reportsQuery.set({ page: 1, limit: 20 });
  reportsLoading.set(false);
  reportsError.set(null);
  clearReportsCache();
}
