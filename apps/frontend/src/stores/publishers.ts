import { atom } from 'nanostores';
import type { PublisherResponse } from '@questlog/shared-types';
import type { PaginatedPublishersResponse } from '@/services/publishers';

// ============================================================================
// Publishers List State
// ============================================================================

/**
 * Current publishers list data with pagination
 */
export const $publishersData = atom<PaginatedPublishersResponse | null>(null);

/**
 * Publishers list loading state
 */
export const $publishersLoading = atom<boolean>(false);

/**
 * Publishers list error state
 */
export const $publishersError = atom<string | null>(null);

// ============================================================================
// Publisher Detail State
// ============================================================================

/**
 * Current publisher detail data
 */
export const $publisherDetail = atom<PublisherResponse | null>(null);

/**
 * Currently loaded publisher slug/ID (for refetch purposes)
 */
export const $currentPublisherId = atom<string | null>(null);

/**
 * Publisher detail loading state
 */
export const $publisherDetailLoading = atom<boolean>(false);

/**
 * Publisher detail error state
 */
export const $publisherDetailError = atom<string | null>(null);

// ============================================================================
// Create/Update Publisher State
// ============================================================================

/**
 * Publisher form submission loading state
 */
export const $publisherFormLoading = atom<boolean>(false);

/**
 * Publisher form submission error state
 */
export const $publisherFormError = atom<string | null>(null);

// ============================================================================
// Publishers List Actions
// ============================================================================

/**
 * Set publishers list data
 */
export function setPublishersData(data: PaginatedPublishersResponse) {
  $publishersData.set(data);
}

/**
 * Set publishers loading state
 */
export function setPublishersLoading(loading: boolean) {
  $publishersLoading.set(loading);
}

/**
 * Set publishers error state
 */
export function setPublishersError(error: string | null) {
  $publishersError.set(error);
}

/**
 * Clear publishers list state
 */
export function clearPublishersState() {
  $publishersData.set(null);
  $publishersLoading.set(false);
  $publishersError.set(null);
}

/**
 * Append publishers to existing list (for pagination/infinite scroll)
 */
export function appendPublishersData(newData: PaginatedPublishersResponse) {
  const currentData = $publishersData.get();

  if (!currentData) {
    setPublishersData(newData);
    return;
  }

  // Merge the new publishers with existing ones
  const mergedData: PaginatedPublishersResponse = {
    ...newData,
    data: [...currentData.data, ...newData.data],
  };

  $publishersData.set(mergedData);
}

// ============================================================================
// Publisher Detail Actions
// ============================================================================

/**
 * Set publisher detail data
 */
export function setPublisherDetail(publisher: PublisherResponse, id: string) {
  $publisherDetail.set(publisher);
  $currentPublisherId.set(id);
}

/**
 * Set publisher detail loading state
 */
export function setPublisherDetailLoading(loading: boolean) {
  $publisherDetailLoading.set(loading);
}

/**
 * Set publisher detail error state
 */
export function setPublisherDetailError(error: string | null) {
  $publisherDetailError.set(error);
}

/**
 * Clear publisher detail state
 */
export function clearPublisherDetailState() {
  $publisherDetail.set(null);
  $currentPublisherId.set(null);
  $publisherDetailLoading.set(false);
  $publisherDetailError.set(null);
}

/**
 * Update publisher detail data (for optimistic updates)
 */
export function updatePublisherDetail(updates: Partial<PublisherResponse>) {
  const currentPublisher = $publisherDetail.get();
  if (currentPublisher) {
    const updatedPublisher = { ...currentPublisher, ...updates };
    $publisherDetail.set(updatedPublisher);
  }
}

// ============================================================================
// Publisher Form Actions
// ============================================================================

/**
 * Set publisher form loading state
 */
export function setPublisherFormLoading(loading: boolean) {
  $publisherFormLoading.set(loading);
}

/**
 * Set publisher form error state
 */
export function setPublisherFormError(error: string | null) {
  $publisherFormError.set(error);
}

/**
 * Clear publisher form state
 */
export function clearPublisherFormState() {
  $publisherFormLoading.set(false);
  $publisherFormError.set(null);
}

// ============================================================================
// Global Actions
// ============================================================================

/**
 * Clear all publishers-related state
 */
export function clearAllPublishersState() {
  clearPublishersState();
  clearPublisherDetailState();
  clearPublisherFormState();
}

// ============================================================================
// Cache Management (Optional Enhancement)
// ============================================================================

/**
 * Cache for publisher details by ID to avoid refetching
 */
const publisherDetailCache = new Map<string, { publisher: PublisherResponse; timestamp: number }>();

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Get cached publisher detail if available and not expired
 */
export function getCachedPublisherDetail(id: string): PublisherResponse | null {
  const cached = publisherDetailCache.get(id);

  if (!cached) return null;

  const isExpired = Date.now() - cached.timestamp > CACHE_DURATION;
  if (isExpired) {
    publisherDetailCache.delete(id);
    return null;
  }

  return cached.publisher;
}

/**
 * Cache publisher detail data
 */
export function cachePublisherDetail(id: string, publisher: PublisherResponse) {
  publisherDetailCache.set(id, {
    publisher,
    timestamp: Date.now(),
  });
}

/**
 * Clear publisher detail cache
 */
export function clearPublisherDetailCache() {
  publisherDetailCache.clear();
}

/**
 * Enhanced set publisher detail with caching
 */
export function setPublisherDetailWithCache(publisher: PublisherResponse, id: string) {
  setPublisherDetail(publisher, id);
  cachePublisherDetail(id, publisher);
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Check if a specific publisher is in the current publishers list
 */
export function isPublisherInList(publisherId: string): boolean {
  const publishersData = $publishersData.get();
  return publishersData?.data.some((publisher) => publisher.id === publisherId) || false;
}

/**
 * Get publisher from current list by ID
 */
export function getPublisherFromList(publisherId: string): PublisherResponse | null {
  const publishersData = $publishersData.get();
  return publishersData?.data.find((publisher) => publisher.id === publisherId) || null;
}

/**
 * Get publisher from current list by slug
 */
export function getPublisherFromListBySlug(slug: string): PublisherResponse | null {
  const publishersData = $publishersData.get();
  return publishersData?.data.find((publisher) => publisher.slug === slug) || null;
}

/**
 * Get current pagination info
 */
export function getCurrentPaginationInfo() {
  const publishersData = $publishersData.get();

  if (!publishersData) {
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
    page: publishersData.page,
    limit: publishersData.limit,
    total: publishersData.total,
    totalPages: publishersData.totalPages,
    hasNextPage: publishersData.hasNextPage,
    hasPreviousPage: publishersData.hasPreviousPage,
  };
}

/**
 * Get loading state summary
 */
export function getLoadingState() {
  return {
    publishers: $publishersLoading.get(),
    publisherDetail: $publisherDetailLoading.get(),
    publisherForm: $publisherFormLoading.get(),
    isAnyLoading:
      $publishersLoading.get() || $publisherDetailLoading.get() || $publisherFormLoading.get(),
  };
}

/**
 * Get error state summary
 */
export function getErrorState() {
  return {
    publishers: $publishersError.get(),
    publisherDetail: $publisherDetailError.get(),
    publisherForm: $publisherFormError.get(),
    hasAnyError: Boolean(
      $publishersError.get() || $publisherDetailError.get() || $publisherFormError.get(),
    ),
  };
}

/**
 * Sort publishers alphabetically
 */
export function sortPublishersAlphabetically(publishers: PublisherResponse[]): PublisherResponse[] {
  return [...publishers].sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Sort publishers by game count (descending)
 */
export function sortPublishersByGameCount(publishers: PublisherResponse[]): PublisherResponse[] {
  return [...publishers].sort((a, b) => (b.gamesCount || 0) - (a.gamesCount || 0));
}

/**
 * Sort publishers by founded year (descending - newest first)
 */
export function sortPublishersByFoundedYear(publishers: PublisherResponse[]): PublisherResponse[] {
  return [...publishers].sort((a, b) => {
    const aYear = a.foundedYear || 0;
    const bYear = b.foundedYear || 0;
    return bYear - aYear;
  });
}

/**
 * Filter publishers by search term
 */
export function filterPublishersBySearch(
  publishers: PublisherResponse[],
  searchTerm: string,
): PublisherResponse[] {
  if (!searchTerm.trim()) return publishers;

  const term = searchTerm.toLowerCase();
  return publishers.filter(
    (publisher) =>
      publisher.name.toLowerCase().includes(term) ||
      publisher.description?.toLowerCase().includes(term) ||
      publisher.country?.toLowerCase().includes(term),
  );
}

/**
 * Filter publishers by country
 */
export function filterPublishersByCountry(
  publishers: PublisherResponse[],
  country: string,
): PublisherResponse[] {
  if (!country) return publishers;

  return publishers.filter((publisher) => publisher.country === country);
}

/**
 * Filter publishers by founded year range
 */
export function filterPublishersByFoundedYear(
  publishers: PublisherResponse[],
  startYear: number,
  endYear?: number,
): PublisherResponse[] {
  return publishers.filter((publisher) => {
    if (!publisher.foundedYear) return false;

    const withinStart = publisher.foundedYear >= startYear;
    const withinEnd = !endYear || publisher.foundedYear <= endYear;

    return withinStart && withinEnd;
  });
}

/**
 * Get unique countries from publishers list
 */
export function getUniqueCountries(publishers: PublisherResponse[]): string[] {
  const countries = publishers
    .map((publisher) => publisher.country)
    .filter((country): country is string => Boolean(country));

  return Array.from(new Set(countries)).sort();
}
