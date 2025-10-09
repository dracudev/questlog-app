import { atom } from 'nanostores';
import type { PlatformResponse } from '@questlog/shared-types';
import type { PaginatedPlatformsResponse } from '@/services/platforms';

// ============================================================================
// Platforms List State
// ============================================================================

/**
 * Current platforms list data with pagination
 */
export const $platformsData = atom<PaginatedPlatformsResponse | null>(null);

/**
 * Platforms list loading state
 */
export const $platformsLoading = atom<boolean>(false);

/**
 * Platforms list error state
 */
export const $platformsError = atom<string | null>(null);

// ============================================================================
// Platform Detail State
// ============================================================================

/**
 * Current platform detail data
 */
export const $platformDetail = atom<PlatformResponse | null>(null);

/**
 * Currently loaded platform slug/ID (for refetch purposes)
 */
export const $currentPlatformId = atom<string | null>(null);

/**
 * Platform detail loading state
 */
export const $platformDetailLoading = atom<boolean>(false);

/**
 * Platform detail error state
 */
export const $platformDetailError = atom<string | null>(null);

// ============================================================================
// Create/Update Platform State
// ============================================================================

/**
 * Platform form submission loading state
 */
export const $platformFormLoading = atom<boolean>(false);

/**
 * Platform form submission error state
 */
export const $platformFormError = atom<string | null>(null);

// ============================================================================
// Platforms List Actions
// ============================================================================

/**
 * Set platforms list data
 */
export function setPlatformsData(data: PaginatedPlatformsResponse) {
  $platformsData.set(data);
}

/**
 * Set platforms loading state
 */
export function setPlatformsLoading(loading: boolean) {
  $platformsLoading.set(loading);
}

/**
 * Set platforms error state
 */
export function setPlatformsError(error: string | null) {
  $platformsError.set(error);
}

/**
 * Clear platforms list state
 */
export function clearPlatformsState() {
  $platformsData.set(null);
  $platformsLoading.set(false);
  $platformsError.set(null);
}

/**
 * Append platforms to existing list (for pagination/infinite scroll)
 */
export function appendPlatformsData(newData: PaginatedPlatformsResponse) {
  const currentData = $platformsData.get();

  if (!currentData) {
    setPlatformsData(newData);
    return;
  }

  // Merge the new platforms with existing ones
  const mergedData: PaginatedPlatformsResponse = {
    ...newData,
    data: [...currentData.data, ...newData.data],
  };

  $platformsData.set(mergedData);
}

// ============================================================================
// Platform Detail Actions
// ============================================================================

/**
 * Set platform detail data
 */
export function setPlatformDetail(platform: PlatformResponse, id: string) {
  $platformDetail.set(platform);
  $currentPlatformId.set(id);
}

/**
 * Set platform detail loading state
 */
export function setPlatformDetailLoading(loading: boolean) {
  $platformDetailLoading.set(loading);
}

/**
 * Set platform detail error state
 */
export function setPlatformDetailError(error: string | null) {
  $platformDetailError.set(error);
}

/**
 * Clear platform detail state
 */
export function clearPlatformDetailState() {
  $platformDetail.set(null);
  $currentPlatformId.set(null);
  $platformDetailLoading.set(false);
  $platformDetailError.set(null);
}

/**
 * Update platform detail data (for optimistic updates)
 */
export function updatePlatformDetail(updates: Partial<PlatformResponse>) {
  const currentPlatform = $platformDetail.get();
  if (currentPlatform) {
    const updatedPlatform = { ...currentPlatform, ...updates };
    $platformDetail.set(updatedPlatform);
  }
}

// ============================================================================
// Platform Form Actions
// ============================================================================

/**
 * Set platform form loading state
 */
export function setPlatformFormLoading(loading: boolean) {
  $platformFormLoading.set(loading);
}

/**
 * Set platform form error state
 */
export function setPlatformFormError(error: string | null) {
  $platformFormError.set(error);
}

/**
 * Clear platform form state
 */
export function clearPlatformFormState() {
  $platformFormLoading.set(false);
  $platformFormError.set(null);
}

// ============================================================================
// Global Actions
// ============================================================================

/**
 * Clear all platforms-related state
 */
export function clearAllPlatformsState() {
  clearPlatformsState();
  clearPlatformDetailState();
  clearPlatformFormState();
}

// ============================================================================
// Cache Management (Optional Enhancement)
// ============================================================================

/**
 * Cache for platform details by ID to avoid refetching
 */
const platformDetailCache = new Map<string, { platform: PlatformResponse; timestamp: number }>();

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Get cached platform detail if available and not expired
 */
export function getCachedPlatformDetail(id: string): PlatformResponse | null {
  const cached = platformDetailCache.get(id);

  if (!cached) return null;

  const isExpired = Date.now() - cached.timestamp > CACHE_DURATION;
  if (isExpired) {
    platformDetailCache.delete(id);
    return null;
  }

  return cached.platform;
}

/**
 * Cache platform detail data
 */
export function cachePlatformDetail(id: string, platform: PlatformResponse) {
  platformDetailCache.set(id, {
    platform,
    timestamp: Date.now(),
  });
}

/**
 * Clear platform detail cache
 */
export function clearPlatformDetailCache() {
  platformDetailCache.clear();
}

/**
 * Enhanced set platform detail with caching
 */
export function setPlatformDetailWithCache(platform: PlatformResponse, id: string) {
  setPlatformDetail(platform, id);
  cachePlatformDetail(id, platform);
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Check if a specific platform is in the current platforms list
 */
export function isPlatformInList(platformId: string): boolean {
  const platformsData = $platformsData.get();
  return platformsData?.data.some((platform) => platform.id === platformId) || false;
}

/**
 * Get platform from current list by ID
 */
export function getPlatformFromList(platformId: string): PlatformResponse | null {
  const platformsData = $platformsData.get();
  return platformsData?.data.find((platform) => platform.id === platformId) || null;
}

/**
 * Get platform from current list by slug
 */
export function getPlatformFromListBySlug(slug: string): PlatformResponse | null {
  const platformsData = $platformsData.get();
  return platformsData?.data.find((platform) => platform.slug === slug) || null;
}

/**
 * Get platform from current list by abbreviation
 */
export function getPlatformFromListByAbbreviation(abbreviation: string): PlatformResponse | null {
  const platformsData = $platformsData.get();
  return platformsData?.data.find((platform) => platform.abbreviation === abbreviation) || null;
}

/**
 * Get current pagination info
 */
export function getCurrentPaginationInfo() {
  const platformsData = $platformsData.get();

  if (!platformsData) {
    return {
      page: 1,
      limit: 20,
      total: 0,
      totalPages: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    };
  }

  return {
    page: platformsData.page,
    limit: platformsData.limit,
    total: platformsData.total,
    totalPages: platformsData.totalPages,
    hasNextPage: platformsData.hasNextPage,
    hasPreviousPage: platformsData.hasPreviousPage,
  };
}

/**
 * Get loading state summary
 */
export function getLoadingState() {
  return {
    platforms: $platformsLoading.get(),
    platformDetail: $platformDetailLoading.get(),
    platformForm: $platformFormLoading.get(),
    isAnyLoading:
      $platformsLoading.get() || $platformDetailLoading.get() || $platformFormLoading.get(),
  };
}

/**
 * Get error state summary
 */
export function getErrorState() {
  return {
    platforms: $platformsError.get(),
    platformDetail: $platformDetailError.get(),
    platformForm: $platformFormError.get(),
    hasAnyError: Boolean(
      $platformsError.get() || $platformDetailError.get() || $platformFormError.get(),
    ),
  };
}

/**
 * Sort platforms alphabetically
 */
export function sortPlatformsAlphabetically(platforms: PlatformResponse[]): PlatformResponse[] {
  return [...platforms].sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Sort platforms by game count (descending)
 */
export function sortPlatformsByGameCount(platforms: PlatformResponse[]): PlatformResponse[] {
  return [...platforms].sort((a, b) => (b.gamesCount || 0) - (a.gamesCount || 0));
}

/**
 * Filter platforms by search term
 */
export function filterPlatformsBySearch(
  platforms: PlatformResponse[],
  searchTerm: string,
): PlatformResponse[] {
  if (!searchTerm.trim()) return platforms;

  const term = searchTerm.toLowerCase();
  return platforms.filter(
    (platform) =>
      platform.name.toLowerCase().includes(term) ||
      platform.abbreviation?.toLowerCase().includes(term),
  );
}

/**
 * Group platforms by type (Console, PC, Mobile, etc.)
 * Note: This assumes platforms have a type field or we can infer from name
 */
export function groupPlatformsByType(
  platforms: PlatformResponse[],
): Record<string, PlatformResponse[]> {
  const groups: Record<string, PlatformResponse[]> = {
    Console: [],
    PC: [],
    Mobile: [],
    Other: [],
  };

  platforms.forEach((platform) => {
    const name = platform.name.toLowerCase();
    const abbr = platform.abbreviation?.toLowerCase() || '';

    if (
      name.includes('playstation') ||
      name.includes('xbox') ||
      name.includes('nintendo') ||
      name.includes('switch') ||
      abbr.includes('ps') ||
      abbr.includes('xbox')
    ) {
      groups.Console.push(platform);
    } else if (
      name.includes('pc') ||
      name.includes('steam') ||
      name.includes('epic') ||
      name.includes('windows') ||
      name.includes('mac') ||
      name.includes('linux')
    ) {
      groups.PC.push(platform);
    } else if (
      name.includes('ios') ||
      name.includes('android') ||
      name.includes('mobile') ||
      name.includes('iphone') ||
      name.includes('ipad')
    ) {
      groups.Mobile.push(platform);
    } else {
      groups.Other.push(platform);
    }
  });

  return groups;
}

/**
 * Get console platforms from current list
 */
export function getConsolePlatforms(platforms: PlatformResponse[]): PlatformResponse[] {
  const grouped = groupPlatformsByType(platforms);
  return grouped.Console;
}

/**
 * Get PC platforms from current list
 */
export function getPCPlatforms(platforms: PlatformResponse[]): PlatformResponse[] {
  const grouped = groupPlatformsByType(platforms);
  return grouped.PC;
}

/**
 * Get mobile platforms from current list
 */
export function getMobilePlatforms(platforms: PlatformResponse[]): PlatformResponse[] {
  const grouped = groupPlatformsByType(platforms);
  return grouped.Mobile;
}

/**
 * Get unique abbreviations from platforms list
 */
export function getUniqueAbbreviations(platforms: PlatformResponse[]): string[] {
  const abbreviations = platforms
    .map((platform) => platform.abbreviation)
    .filter((abbr): abbr is string => Boolean(abbr));

  return Array.from(new Set(abbreviations)).sort();
}
